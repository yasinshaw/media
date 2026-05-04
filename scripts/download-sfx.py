"""Download SFX from Mixkit by scraping their sfx pages.

Mixkit provides free SFX with predictable URLs:
  https://mixkit.co/free-sound-effects/{category}/

Each SFX page has a download button that links to:
  https://assets.mixkit.co/active_storage/sfx/xxxx.wav
"""
from __future__ import annotations
import asyncio
import os
import re
from typing import Optional
import sys
from pathlib import Path

import aiohttp

SFX_DIR = Path(__file__).parent.parent / "remotion" / "public" / "audio" / "sfx"

# Mixkit SFX category URLs and the taxonomy files we need from each
# Format: (mixkit_category_slug, [(taxonomy_name, search_hint), ...])
MIXKIT_TARGETS = [
    # Transition sounds
    ("whoosh", [
        ("calm-transition-medium.mp3", "soft whoosh"),
        ("tense-transition-medium.mp3", None),  # already copied from riser
        ("playful-transition-medium.mp3", "bouncy"),
        ("epic-transition-medium.mp3", "cinematic"),
        ("neutral-transition-strong.mp3", "heavy"),
        ("energetic-transition-strong.mp3", "fast"),
    ]),
    ("sweep", [
        ("calm-transition-medium.mp3", "soft sweep"),
        ("epic-transition-medium.mp3", "cinematic sweep"),
        ("tense-transition-medium.mp3", "dark sweep"),
    ]),
    # Impact/hit sounds
    ("hit", [
        ("energetic-emphasis-medium.mp3", "medium hit"),
        ("calm-emphasis-medium.mp3", "soft hit"),
        ("tense-emphasis-medium.mp3", "dark hit"),
        ("playful-emphasis-medium.mp3", None),  # already copied from reveal
        ("epic-emphasis-medium.mp3", "cinematic hit"),
        ("neutral-emphasis-medium.mp3", "neutral hit"),
        ("energetic-emphasis-strong.mp3", "heavy hit"),
        ("tense-emphasis-strong.mp3", "dramatic boom"),
        ("epic-emphasis-strong.mp3", "cinematic boom"),
        ("calm-emphasis-strong.mp3", "strong chime"),
        ("playful-emphasis-strong.mp3", "big pop"),
    ]),
    # UI/interface sounds
    ("interface", [
        ("neutral-feedback-medium.mp3", "click"),
        ("energetic-feedback-medium.mp3", "pop notification"),
        ("calm-feedback-medium.mp3", "soft click"),
        ("calm-feedback-subtle.mp3", "subtle"),
        ("epic-feedback-medium.mp3", "reveal"),
        ("neutral-feedback-subtle.mp3", None),  # already copied from click
    ]),
    # Entry/exit sounds
    ("rise", [
        ("energetic-entry-medium.mp3", "rise enter"),
        ("epic-entry-medium.mp3", "cinematic rise"),
        ("tense-entry-medium.mp3", "dark rise"),
        ("calm-entry-medium.mp3", "gentle rise"),
    ]),
    # Ambient sounds
    ("ambient", [
        ("calm-ambient-subtle.mp3", "calm pad"),
        ("energetic-ambient-subtle.mp3", "energetic hum"),
        ("tense-ambient-subtle.mp3", "dark drone"),
        ("epic-ambient-subtle.mp3", "orchestral swell"),
    ]),
]

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
}


async def get_mixkit_sfx_page(
    session: aiohttp.ClientSession, category: str
) -> list[dict]:
    """Scrape Mixkit SFX category page for available sounds."""
    url = f"https://mixkit.co/free-sound-effects/{category}/"
    try:
        async with session.get(url, headers=HEADERS) as resp:
            if resp.status != 200:
                return []
            text = await resp.text()

        # Extract SFX items: name, preview URL, download URL
        items = []
        # Look for data attributes or links containing SFX info
        # Mixkit uses JavaScript rendering, so we need to find embedded data
        # Pattern: sfx items often have data-preview-url or similar
        patterns = [
            r'"name"\s*:\s*"([^"]+)"',
            r'"previewUrl"\s*:\s*"([^"]+)"',
            r'"downloadUrl"\s*:\s*"([^"]+)"',
            r'"id"\s*:\s*(\d+)',
        ]

        names = re.findall(r'"name"\s*:\s*"([^"]+)"', text)
        preview_urls = re.findall(r'"previewUrl"\s*:\s*"([^"]+)"', text)
        download_urls = re.findall(r'"downloadUrl"\s*:\s*"([^"]+)"', text)
        ids = re.findall(r'"id"\s*:\s*(\d+)', text)

        for i in range(min(len(names), len(preview_urls))):
            items.append({
                "name": names[i],
                "preview_url": preview_urls[i] if i < len(preview_urls) else None,
                "download_url": download_urls[i] if i < len(download_urls) else None,
                "id": ids[i] if i < len(ids) else None,
            })

        return items
    except Exception as e:
        print(f"  Error scraping {category}: {e}")
        return []


async def try_download_mixkit(
    session: aiohttp.ClientSession, sfx_id: str, dest: Path
) -> bool:
    """Try to download from Mixkit using known URL patterns."""
    # Mixkit asset URLs follow patterns like:
    # https://assets.mixkit.co/active_storage/sfx/preview/xxxx.wav
    # or via download endpoint
    url_patterns = [
        f"https://assets.mixkit.co/active_storage/sfx/preview/{sfx_id}.wav",
        f"https://assets.mixkit.co/active_storage/sfx/{sfx_id}.wav",
        f"https://assets.mixkit.co/sfx/download/mixkit-sfx-{sfx_id}.wav",
    ]

    for url in url_patterns:
        try:
            async with session.get(url, headers=HEADERS, allow_redirects=True) as resp:
                if resp.status == 200:
                    content_type = resp.headers.get("Content-Type", "")
                    if "audio" in content_type or "octet-stream" in content_type:
                        data = await resp.read()
                        if len(data) > 5000:
                            dest.write_bytes(data)
                            return True
        except Exception:
            continue
    return False


async def download_from_mixkit_page(
    session: aiohttp.ClientSession, category: str
) -> list[dict]:
    """Download SFX from a Mixkit category page."""
    print(f"  Scraping mixkit.co/free-sound-effects/{category}/...")
    items = await get_mixkit_sfx_page(session, category)
    print(f"  Found {len(items)} items")

    downloaded = []
    for item in items:
        if not item.get("preview_url") and not item.get("id"):
            continue

        # Try download URL first
        if item.get("download_url"):
            try:
                async with session.get(
                    item["download_url"], headers=HEADERS, allow_redirects=True
                ) as resp:
                    if resp.status == 200:
                        data = await resp.read()
                        if len(data) > 5000:
                            downloaded.append({
                                "name": item["name"],
                                "data": data,
                                "id": item.get("id"),
                            })
                            continue
            except Exception:
                pass

        # Try preview URL
        if item.get("preview_url"):
            try:
                async with session.get(
                    item["preview_url"], headers=HEADERS, allow_redirects=True
                ) as resp:
                    if resp.status == 200:
                        data = await resp.read()
                        if len(data) > 5000:
                            downloaded.append({
                                "name": item["name"],
                                "data": data,
                                "id": item.get("id"),
                            })
            except Exception:
                pass

    return downloaded


def match_sfx_to_target(sfx_name: str, target_name: str, hint: Optional[str]) -> int:
    """Score how well an SFX matches a target. Higher = better match."""
    score = 0
    sfx_lower = sfx_name.lower()
    target_parts = target_name.replace(".mp3", "").split("-")

    if hint and hint.lower() in sfx_lower:
        score += 10

    # Match mood
    if target_parts[0] in sfx_lower:
        score += 3
    # Match action
    if target_parts[1] in sfx_lower:
        score += 3
    # Match intensity
    if target_parts[2] in sfx_lower:
        score += 2

    return score


async def main():
    SFX_DIR.mkdir(parents=True, exist_ok=True)

    connector = aiohttp.TCPConnector(limit=5)
    timeout = aiohttp.ClientTimeout(total=30)

    async with aiohttp.ClientSession(connector=connector, timeout=timeout) as session:
        total_downloaded = 0
        total_failed = 0

        for category, targets in MIXKIT_TARGETS:
            print(f"\n--- Category: {category} ---")
            available = await download_from_mixkit_page(session, category)

            if not available:
                # Try direct asset URL pattern
                print(f"  Trying direct URL pattern for {category}...")
                total_failed += len(targets)
                continue

            for target_name, hint in targets:
                dest = SFX_DIR / target_name
                if dest.exists() and dest.stat().st_size > 1000:
                    print(f"  [skip] {target_name} (exists)")
                    continue

                # Find best match
                best = None
                best_score = -1
                for sfx in available:
                    score = match_sfx_to_target(sfx["name"], target_name, hint)
                    if score > best_score:
                        best_score = score
                        best = sfx

                if best and best_score >= 0:
                    # Convert wav to mp3 if needed (just save as is for now)
                    ext = "wav" if best["data"][:4] == b"RIFF" else "mp3"
                    final_name = target_name.replace(".mp3", f".{ext}")
                    final_dest = SFX_DIR / final_name

                    final_dest.write_bytes(best["data"])
                    size_kb = len(best["data"]) / 1024
                    print(f"  [done] {final_name} ({size_kb:.0f} KB) <- '{best['name']}'")
                    total_downloaded += 1
                else:
                    print(f"  [fail] {target_name} - no match")
                    total_failed += 1

        print(f"\n{'='*50}")
        print(f"Downloaded: {total_downloaded}, Failed: {total_failed}")


if __name__ == "__main__":
    asyncio.run(main())
