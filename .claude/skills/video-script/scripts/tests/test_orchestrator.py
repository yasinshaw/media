import json
import pytest
from pathlib import Path
from unittest.mock import patch, AsyncMock, MagicMock
from collect_research_assets.orchestrator import run


@pytest.mark.asyncio
@patch("collect_research_assets.orchestrator.Image")
async def test_run_creates_manifest(mock_image, tmp_path, monkeypatch):
    project_dir = tmp_path / "projects" / "2026-05-03-test"
    project_dir.mkdir(parents=True)
    research_md = project_dir / "research.md"
    research_md.write_text("""# Research

## 核心发现
- DeepSeek V4 released

## 视觉素材英文关键词
- AI model
- robot
""")

    tavily_json = tmp_path / "tavily.json"
    tavily_json.write_text(json.dumps({
        "results": [],
        "images": ["https://example.com/img1.jpg"]
    }))

    monkeypatch.setenv("PIXABAY_API_KEY", "fake-key")

    async def fake_download_all(session, jobs, concurrency=10):
        for _, dest in jobs:
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_bytes(b"fake-image")
        return [True] * len(jobs)

    mock_image.open.return_value.__enter__ = MagicMock(return_value=MagicMock(size=(800, 600)))
    mock_image.open.return_value.__exit__ = MagicMock(return_value=False)

    with patch("collect_research_assets.orchestrator.search_images", new=AsyncMock(return_value=[])), \
         patch("collect_research_assets.orchestrator.search_videos", new=AsyncMock(return_value=[])), \
         patch("collect_research_assets.orchestrator.fetch_article", new=AsyncMock(return_value=None)), \
         patch("collect_research_assets.orchestrator.download_all", new=fake_download_all):
        await run(
            project_dir=project_dir,
            research_md=research_md,
            tavily_results_json=tavily_json,
            refresh=False,
        )

    manifest_path = project_dir / "assets" / "research" / "manifest.json"
    assert manifest_path.exists()
    data = json.loads(manifest_path.read_text())
    assert data["topic"]
    assert data["english_keywords"] == ["AI model", "robot"]


@pytest.mark.asyncio
async def test_idempotent_skip(tmp_path, monkeypatch):
    project_dir = tmp_path / "projects" / "2026-05-03-test"
    (project_dir / "assets" / "research").mkdir(parents=True)
    manifest_path = project_dir / "assets" / "research" / "manifest.json"
    manifest_path.write_text('{"topic":"x","english_keywords":[],"items":[],"skipped":[],"limits":{},"stats":{},"generated_at":"2026-01-01T00:00:00+00:00"}')
    research_md = project_dir / "research.md"
    research_md.write_text("# r\n## 视觉素材英文关键词\n- x\n")
    tavily_json = tmp_path / "tavily.json"
    tavily_json.write_text("{}")

    with patch("collect_research_assets.orchestrator.download_all", new=AsyncMock(return_value=[])) as dl:
        await run(project_dir, research_md, tavily_json, refresh=False)
        dl.assert_not_called()


@pytest.mark.asyncio
async def test_refresh_archives_old_manifest_and_cleans_dirs(tmp_path, monkeypatch):
    project_dir = tmp_path / "projects" / "2026-05-03-test"
    research_dir = project_dir / "assets" / "research"
    (research_dir / "reference").mkdir(parents=True)
    (research_dir / "stock").mkdir()
    (research_dir / "manifest.json").write_text('{"topic":"x","english_keywords":[],"items":[],"skipped":[],"limits":{},"stats":{},"generated_at":"2026-01-01T00:00:00+00:00"}')
    (research_dir / "reference" / "old.jpg").write_bytes(b"old")
    research_md = project_dir / "research.md"
    research_md.write_text("# r\n")
    tavily_json = tmp_path / "tavily.json"
    tavily_json.write_text("{}")

    with patch("collect_research_assets.orchestrator.search_images", new=AsyncMock(return_value=[])), \
         patch("collect_research_assets.orchestrator.search_videos", new=AsyncMock(return_value=[])), \
         patch("collect_research_assets.orchestrator.fetch_article", new=AsyncMock(return_value=None)):
        await run(project_dir, research_md, tavily_json, refresh=True)

    archives = list(research_dir.glob("manifest.*.bak.json"))
    assert len(archives) == 1
    assert not (research_dir / "reference" / "old.jpg").exists()
    assert (research_dir / "manifest.json").exists()


@pytest.mark.asyncio
async def test_corrupt_manifest_archived_and_rerun(tmp_path):
    project_dir = tmp_path / "projects" / "2026-05-03-test"
    research_dir = project_dir / "assets" / "research"
    research_dir.mkdir(parents=True)
    (research_dir / "manifest.json").write_text("not valid json {{{")
    research_md = project_dir / "research.md"
    research_md.write_text("# r\n")
    tavily_json = tmp_path / "tavily.json"
    tavily_json.write_text("{}")

    with patch("collect_research_assets.orchestrator.search_images", new=AsyncMock(return_value=[])), \
         patch("collect_research_assets.orchestrator.search_videos", new=AsyncMock(return_value=[])), \
         patch("collect_research_assets.orchestrator.fetch_article", new=AsyncMock(return_value=None)):
        await run(project_dir, research_md, tavily_json, refresh=False)

    archives = list(research_dir.glob("manifest.*.bak.json"))
    assert len(archives) == 1


@pytest.mark.asyncio
async def test_video_size_filter(tmp_path, monkeypatch):
    """Videos under 100KB are rejected after download."""
    project_dir = tmp_path / "projects" / "2026-05-03-test"
    project_dir.mkdir(parents=True)
    research_md = project_dir / "research.md"
    research_md.write_text("# r\n## 视觉素材英文关键词\n- server\n")
    tavily_json = tmp_path / "tavily.json"
    tavily_json.write_text(json.dumps({
        "results": [],
        "images": [],
    }))
    monkeypatch.setenv("PIXABAY_API_KEY", "fake-key")

    video_hit = {
        "pixabay_id": 99, "url": "https://cdn.example.com/vid.mp4",
        "page_url": "https://pixabay.com/videos/99/", "tags": ["server"],
        "width": 1920, "height": 1080, "credit": "user", "type": "video",
    }

    async def fake_download_all(session, jobs, concurrency=10):
        for _, dest in jobs:
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_bytes(b"tiny-video-content")
        return [True] * len(jobs)

    with patch("collect_research_assets.orchestrator.search_images", new=AsyncMock(return_value=[])), \
         patch("collect_research_assets.orchestrator.search_videos", new=AsyncMock(return_value=[video_hit])), \
         patch("collect_research_assets.orchestrator.download_all", new=fake_download_all), \
         patch("collect_research_assets.orchestrator.fetch_article", new=AsyncMock(return_value=None)):
        await run(project_dir, research_md, tavily_json, refresh=False)

    manifest_path = project_dir / "assets" / "research" / "manifest.json"
    data = json.loads(manifest_path.read_text())
    assert data["stats"]["skipped"] == 1
    assert "too small" in data["skipped"][0]["reason"]
