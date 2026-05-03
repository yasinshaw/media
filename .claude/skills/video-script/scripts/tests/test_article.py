from pathlib import Path

from collect_research_assets.article import (
    extract_media_from_html,
    extract_title_from_html,
)


def test_extract_images():
    html = (Path(__file__).parent / "fixtures" / "sample_article.html").read_text()
    media = extract_media_from_html(html, page_url="https://example.com/article")
    urls = [m["url"] for m in media]
    assert "https://example.com/photo1.jpg" in urls
    assert "https://example.com/static/icons/share.png" not in urls
    assert all(not u.startswith("data:") for u in urls)


def test_alt_text_preserved():
    html = (Path(__file__).parent / "fixtures" / "sample_article.html").read_text()
    media = extract_media_from_html(html, page_url="https://example.com/article")
    photo = next(m for m in media if m["url"].endswith("photo1.jpg"))
    assert photo["alt"] == "hero"
    assert photo["type"] == "image"


def test_relative_url_resolved():
    html = "<img src=\"/relative.jpg\">"
    media = extract_media_from_html(html, page_url="https://example.com/sub/page")
    assert media[0]["url"] == "https://example.com/relative.jpg"


def test_extract_title():
    html = "<html><head><title>My Article</title></head><body></body></html>"
    assert extract_title_from_html(html) == "My Article"


def test_extract_title_missing():
    assert extract_title_from_html("<html></html>") == ""
