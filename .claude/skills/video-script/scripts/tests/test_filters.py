from collect_research_assets.filters import (
    is_acceptable_url,
    exceeds_domain_quota,
    is_acceptable_image_size,
    normalize_host,
)


def test_skip_data_uri():
    assert not is_acceptable_url("data:image/png;base64,iVBORw0K...")


def test_skip_svg():
    assert not is_acceptable_url("https://example.com/icon.svg")


def test_skip_logo_path():
    assert not is_acceptable_url("https://example.com/assets/logo/brand.png")
    assert not is_acceptable_url("https://example.com/static/icons/menu.png")
    assert not is_acceptable_url("https://example.com/path/avatar.jpg")


def test_skip_non_http():
    assert not is_acceptable_url("ftp://example.com/x.jpg")


def test_accept_normal():
    assert is_acceptable_url("https://example.com/photos/2026/landscape.jpg")


def test_normalize_host():
    assert normalize_host("https://www.github.com/path") == "github.com"
    assert normalize_host("https://github.com/path") == "github.com"


def test_domain_quota():
    counts = {"github.com": 5}
    assert exceeds_domain_quota("github.com", counts, cap=5)
    counts2 = {"github.com": 4}
    assert not exceeds_domain_quota("github.com", counts2, cap=5)


def test_image_size_below_min():
    assert not is_acceptable_image_size(300, 600, min_dim=400)
    assert not is_acceptable_image_size(600, 300, min_dim=400)


def test_image_size_above_min():
    assert is_acceptable_image_size(800, 800, min_dim=400)
    assert is_acceptable_image_size(400, 400, min_dim=400)
