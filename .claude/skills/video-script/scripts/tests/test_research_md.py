from pathlib import Path

from collect_research_assets.manifest import Manifest
from collect_research_assets.research_md import append_visual_section


def test_append_visual_section(tmp_path):
    md = tmp_path / "research.md"
    md.write_text("# Research\n\n## 核心发现\n- ...\n")
    manifest = Manifest(
        topic="t",
        english_keywords=["x"],
        items=[
            {
                "id": "tavily-001",
                "category": "reference",
                "type": "image",
                "page_url": "https://e.com/a",
                "page_title": "Article",
                "alt": "hero",
                "local_path": "research/reference/tavily-001.jpg",
            },
            {
                "id": "pixabay-img-001",
                "category": "stock",
                "type": "image",
                "tags": ["AI", "robot"],
                "page_url": "https://pixabay.com/p/1/",
                "local_path": "research/stock/pixabay-img-001.jpg",
            },
        ],
        skipped=[{"url": "x", "reason": "too small"}],
    )
    append_visual_section(md, manifest)
    text = md.read_text()
    assert "## 视觉素材清单" in text
    assert "tavily-001.jpg" in text
    assert "pixabay-img-001.jpg" in text
    assert "共 1 项被跳过" in text


def test_append_idempotent(tmp_path):
    md = tmp_path / "research.md"
    md.write_text("# Research\n")
    manifest = Manifest(topic="t", english_keywords=[], items=[], skipped=[])
    append_visual_section(md, manifest)
    append_visual_section(md, manifest)
    assert md.read_text().count("## 视觉素材清单") == 1
