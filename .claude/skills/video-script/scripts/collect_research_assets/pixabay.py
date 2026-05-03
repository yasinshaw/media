"""Pixabay image search with 429 backoff."""
from __future__ import annotations

import asyncio
from typing import Any

import aiohttp

PIXABAY_IMAGE_URL = "https://pixabay.com/api/"

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
