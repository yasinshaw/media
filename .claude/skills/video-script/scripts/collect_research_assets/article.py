from __future__ import annotations

import asyncio
from typing import Any
from urllib.parse import urljoin

import aiohttp
from bs4 import BeautifulSoup

from .filters import is_acceptable_url

USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"
FETCH_TIMEOUT = 15


def extract_media_from_html(html: str, page_url: str) -> list[dict[str, Any]]:
    """Extract images and videos from HTML, filtering out UI chrome."""
    soup = BeautifulSoup(html, "html.parser")
    out: list[dict[str, Any]] = []
    seen: set[str] = set()

    for img in soup.find_all("img"):
        src = img.get("src") or img.get("data-src") or ""
        abs_url = urljoin(page_url, src)
        if not is_acceptable_url(abs_url) or abs_url in seen:
            continue
        seen.add(abs_url)
        out.append({
            "url": abs_url,
            "type": "image",
            "alt": (img.get("alt") or "").strip(),
        })

    for vid in soup.find_all("video"):
        src = vid.get("src") or ""
        if not src:
            source_tag = vid.find("source")
            if source_tag:
                src = source_tag.get("src") or ""
        abs_url = urljoin(page_url, src) if src else ""
        if not abs_url or not is_acceptable_url(abs_url) or abs_url in seen:
            continue
        seen.add(abs_url)
        out.append({
            "url": abs_url,
            "type": "video",
            "alt": "",
        })

    return out


def extract_title_from_html(html: str) -> str:
    """Extract the <title> text from HTML."""
    soup = BeautifulSoup(html, "html.parser")
    if soup.title and soup.title.string:
        return soup.title.string.strip()
    return ""


async def fetch_article(
    session: aiohttp.ClientSession, page_url: str
) -> tuple[str, str] | None:
    """Fetch an article page and return (html, title) or None on failure."""
    try:
        async with session.get(
            page_url,
            headers={"User-Agent": USER_AGENT},
            timeout=aiohttp.ClientTimeout(total=FETCH_TIMEOUT),
            allow_redirects=True,
        ) as resp:
            if resp.status != 200:
                return None
            ctype = resp.headers.get("Content-Type", "")
            if "text/html" not in ctype.lower():
                return None
            html = await resp.text(errors="replace")
            return html, extract_title_from_html(html)
    except Exception:
        return None
