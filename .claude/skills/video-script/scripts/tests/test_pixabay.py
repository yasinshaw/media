import json
import pytest
from pathlib import Path
from unittest.mock import AsyncMock, MagicMock, patch

from collect_research_assets.pixabay import (
    parse_image_hits,
    parse_video_hits,
    build_image_search_params,
    build_video_search_params,
    _get_with_429_backoff,
)


def test_parse_image_hits():
    fixture = json.loads(
        (Path(__file__).parent / "fixtures" / "sample_pixabay_response.json").read_text()
    )
    items = parse_image_hits(fixture)
    assert len(items) == 1
    assert items[0]["pixabay_id"] == 12345
    assert items[0]["url"].endswith(".jpg")
    assert items[0]["credit"] == "Pixabay user Alice"
    assert items[0]["width"] == 1920


def test_parse_empty_hits():
    assert parse_image_hits({"hits": []}) == []


def test_image_search_params():
    p = build_image_search_params("KEY", "robot+ai", per_page=3)
    assert p["key"] == "KEY"
    assert p["q"] == "robot+ai"
    assert p["per_page"] == 3
    assert p["image_type"] == "photo"


def test_video_search_params():
    p = build_video_search_params("KEY", "robot", per_page=2)
    assert p["per_page"] == 2
    assert p["orientation"] == "vertical"


@pytest.mark.asyncio
@patch("collect_research_assets.pixabay.asyncio.sleep", new_callable=AsyncMock)
async def test_get_with_429_backoff_retries(mock_sleep):
    """On 429, retries up to 3 times then returns None."""
    call_count = 0

    class FakeCtxManager:
        async def __aenter__(self):
            nonlocal call_count
            call_count += 1
            mock_resp = AsyncMock()
            mock_resp.status = 429
            return mock_resp

        async def __aexit__(self, *args):
            pass

    mock_session = MagicMock()
    mock_session.get.return_value = FakeCtxManager()

    result = await _get_with_429_backoff(mock_session, "https://api.example.com", {})
    assert result is None
    assert call_count == 3
    assert mock_sleep.call_count == 2
