"""Pixabay image and video search with 429 backoff."""
from __future__ import annotations

import asyncio
from typing import Any

import aiohttp

PIXABAY_IMAGE_URL = "https://pixabay.com/api/"
PIXABAY_VIDEO_URL = "https://pixabay.com/api/videos/"

RATELIMIT_BACKOFF_SECONDS = 60
RATELIMIT_MAX_RETRIES = 3


def build_image_search_params(api_key: str, query: str, per_page: int = 3) -> dict[str, Any]:
    """Build query parameters for Pixabay image search."""
    return {
        "key": api_key,
        "q": query,
        "image_type": "photo",
        "orientation": "all",
        "per_page": per_page,
        "safesearch": "true",
    }


def build_video_search_params(api_key: str, query: str, per_page: int = 2) -> dict[str, Any]:
    """Build query parameters for Pixabay video search."""
    return {
        "key": api_key,
        "q": query,
        "orientation": "vertical",
        "per_page": per_page,
        "safesearch": "true",
    }


def parse_image_hits(response: dict[str, Any]) -> list[dict[str, Any]]:
    """Parse Pixabay image search response into normalized items."""
    out: list[dict[str, Any]] = []
    for hit in response.get("hits", []):
        out.append({
            "pixabay_id": hit["id"],
            "url": hit["largeImageURL"],
            "page_url": hit["pageURL"],
            "tags": [t.strip() for t in (hit.get("tags") or "").split(",") if t.strip()],
            "width": hit.get("imageWidth", 0),
            "height": hit.get("imageHeight", 0),
            "credit": f"Pixabay user {hit.get('user', 'unknown')}",
            "type": "image",
        })
    return out


def parse_video_hits(response: dict[str, Any]) -> list[dict[str, Any]]:
    """Parse Pixabay video search response into normalized items."""
    out: list[dict[str, Any]] = []
    for hit in response.get("hits", []):
        videos = hit.get("videos", {})
        chosen = videos.get("medium") or videos.get("large") or videos.get("small") or {}
        if not chosen.get("url"):
            continue
        out.append({
            "pixabay_id": hit["id"],
            "url": chosen["url"],
            "page_url": hit["pageURL"],
            "tags": [t.strip() for t in (hit.get("tags") or "").split(",") if t.strip()],
            "width": chosen.get("width", 0),
            "height": chosen.get("height", 0),
            "credit": f"Pixabay user {hit.get('user', 'unknown')}",
            "type": "video",
        })
    return out


async def _get_with_429_backoff(
    session: aiohttp.ClientSession, url: str, params: dict[str, Any]
) -> dict[str, Any] | None:
    """GET with automatic retry on 429 (rate-limit) responses."""
    for attempt in range(RATELIMIT_MAX_RETRIES):
        try:
            async with session.get(url, params=params) as resp:
                if resp.status == 429:
                    if attempt < RATELIMIT_MAX_RETRIES - 1:
                        await asyncio.sleep(RATELIMIT_BACKOFF_SECONDS)
                        continue
                    return None
                if resp.status != 200:
                    return None
                return await resp.json()
        except Exception:
            return None
    return None


async def search_images(
    session: aiohttp.ClientSession, api_key: str, query: str, per_page: int = 3
) -> list[dict[str, Any]]:
    """Search Pixabay for images matching the query."""
    data = await _get_with_429_backoff(
        session, PIXABAY_IMAGE_URL, build_image_search_params(api_key, query, per_page)
    )
    return parse_image_hits(data) if data else []


async def search_videos(
    session: aiohttp.ClientSession, api_key: str, query: str, per_page: int = 2
) -> list[dict[str, Any]]:
    """Search Pixabay for videos matching the query."""
    data = await _get_with_429_backoff(
        session, PIXABAY_VIDEO_URL, build_video_search_params(api_key, query, per_page)
    )
    return parse_video_hits(data) if data else []
