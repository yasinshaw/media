from __future__ import annotations

from typing import Any

from .filters import is_acceptable_url


def extract_image_urls(tavily_results: dict[str, Any]) -> list[str]:
    """Extract and deduplicate image URLs from Tavily search results.

    Applies URL filtering (skips logos, icons, SVGs, etc.) via
    ``is_acceptable_url`` and deduplicates entries.

    Args:
        tavily_results: Raw Tavily API response dict (may or may not
            contain an ``"images"`` key).

    Returns:
        A deduplicated list of acceptable image URL strings.
    """
    raw = tavily_results.get("images") or []
    seen: set[str] = set()
    out: list[str] = []
    for url in raw:
        if not isinstance(url, str):
            continue
        if url in seen:
            continue
        if not is_acceptable_url(url):
            continue
        seen.add(url)
        out.append(url)
    return out
