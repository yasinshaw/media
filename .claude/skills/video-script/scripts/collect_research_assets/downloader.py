"""Async downloader with retry logic and concurrency cap."""
from __future__ import annotations

import asyncio
from pathlib import Path

import aiohttp

DEFAULT_CONCURRENCY = 10
DEFAULT_RETRIES = 3
RETRY_BACKOFF_BASE = 2


def _build_semaphore(n: int) -> asyncio.Semaphore:
    """Build an asyncio.Semaphore with the given capacity."""
    return asyncio.Semaphore(n)


async def download_one(
    session: aiohttp.ClientSession,
    url: str,
    dest: Path,
    retries: int = DEFAULT_RETRIES,
) -> bool:
    """Download a single URL to *dest* with exponential-backoff retry.

    Returns True on success, False after all retries exhausted.
    """
    for attempt in range(retries):
        try:
            async with session.get(url) as resp:
                resp.raise_for_status()
                content = await resp.read()
                dest.parent.mkdir(parents=True, exist_ok=True)
                dest.write_bytes(content)
                return True
        except Exception:
            if attempt < retries - 1:
                await asyncio.sleep(RETRY_BACKOFF_BASE ** (attempt + 1))
    return False


async def download_all(
    session: aiohttp.ClientSession,
    jobs: list[tuple[str, Path]],
    concurrency: int = DEFAULT_CONCURRENCY,
) -> list[bool]:
    """Download multiple URLs in parallel, capped at *concurrency*.

    Returns a list of booleans -- one per job -- in the same order.
    """
    sem = _build_semaphore(concurrency)

    async def _wrapped(url: str, dest: Path) -> bool:
        async with sem:
            return await download_one(session, url, dest)

    return await asyncio.gather(*[_wrapped(u, d) for u, d in jobs])
