import json
from pathlib import Path

from collect_research_assets.tavily import extract_image_urls


def test_extract_filters_skipped():
    fixture = json.loads(
        (Path(__file__).parent / "fixtures" / "sample_tavily_results.json").read_text()
    )
    urls = extract_image_urls(fixture)
    assert "https://example.com/img1.jpg" in urls
    assert "https://example.com/img2.png" in urls
    assert "https://example.com/static/logo/brand.png" not in urls


def test_extract_handles_missing_key():
    assert extract_image_urls({"results": []}) == []


def test_extract_handles_empty():
    assert extract_image_urls({"images": []}) == []
