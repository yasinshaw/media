from collect_research_assets.filename import next_id, extension_from_url, build_local_path
from pathlib import Path


def test_next_id_sequential():
    used = set()
    assert next_id("tavily", used) == "tavily-001"
    used.add("tavily-001")
    assert next_id("tavily", used) == "tavily-002"


def test_next_id_with_host():
    used = set()
    assert next_id("article-github.com", used) == "article-github.com-001"


def test_extension_from_url():
    assert extension_from_url("https://x.com/foo.jpg") == ".jpg"
    assert extension_from_url("https://x.com/path/photo.png?v=1") == ".png"
    assert extension_from_url("https://x.com/clip.MP4") == ".mp4"


def test_extension_default_image():
    assert extension_from_url("https://x.com/no-ext", default=".jpg") == ".jpg"


def test_build_local_path(tmp_path):
    base = tmp_path / "assets" / "research"
    p = build_local_path(base, "reference", "tavily-001", ".jpg")
    assert p == base / "reference" / "tavily-001.jpg"
