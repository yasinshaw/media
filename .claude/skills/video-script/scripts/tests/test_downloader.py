"""Tests for async downloader with retry and concurrency cap."""
import pytest
from pathlib import Path
from unittest.mock import AsyncMock, MagicMock, patch

from collect_research_assets.downloader import download_one, download_all


@pytest.mark.asyncio
async def test_download_one_success(tmp_path):
    dest = tmp_path / "out.jpg"
    mock_session = MagicMock()
    mock_resp = AsyncMock()
    mock_resp.read = AsyncMock(return_value=b"fake-bytes")
    mock_resp.raise_for_status = MagicMock()
    mock_resp.__aenter__ = AsyncMock(return_value=mock_resp)
    mock_resp.__aexit__ = AsyncMock(return_value=None)
    mock_session.get = MagicMock(return_value=mock_resp)

    ok = await download_one(mock_session, "https://x.com/a.jpg", dest)
    assert ok is True
    assert dest.read_bytes() == b"fake-bytes"


@pytest.mark.asyncio
async def test_download_one_handles_exception(tmp_path):
    dest = tmp_path / "out.jpg"
    mock_session = MagicMock()
    mock_resp = AsyncMock()
    mock_resp.__aenter__ = AsyncMock(side_effect=Exception("net"))
    mock_resp.__aexit__ = AsyncMock(return_value=None)
    mock_session.get = MagicMock(return_value=mock_resp)

    ok = await download_one(mock_session, "https://x.com/a.jpg", dest, retries=1)
    assert ok is False
    assert not dest.exists()


def test_build_semaphore():
    from collect_research_assets.downloader import _build_semaphore
    sem = _build_semaphore(3)
    assert sem._value == 3
