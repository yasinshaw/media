from __future__ import annotations

import json
import os
import shutil
from datetime import datetime
from pathlib import Path
from typing import Any

import aiohttp
from PIL import Image

from .article import extract_media_from_html, fetch_article
from .downloader import download_all, download_one
from .filename import build_local_path, extension_from_url, next_id
from .filters import (
    DEFAULT_DOMAIN_CAP,
    exceeds_domain_quota,
    is_acceptable_image_size,
    normalize_host,
)
from .keywords import read_cached_keywords
from .manifest import LIMITS, Manifest, read_manifest, write_manifest
from .pixabay import search_images, search_videos
from .research_md import append_visual_section
from .tavily import extract_image_urls

MIN_VIDEO_BYTES = 100 * 1024  # 100KB threshold for stub/thumbnail rejection


async def run(
    project_dir: Path,
    research_md: Path,
    tavily_results_json: Path,
    refresh: bool = False,
) -> None:
    research_dir = project_dir / "assets" / "research"
    manifest_path = research_dir / "manifest.json"

    # Idempotency: if manifest exists and not refreshing, exit early
    if manifest_path.exists() and not refresh:
        try:
            existing = read_manifest(manifest_path)
            s = existing.stats()
            print(f"Manifest exists ({s['reference_count']} ref + {s['stock_count']} stock). Skip.")
            return
        except (json.JSONDecodeError, KeyError):
            # Corrupt manifest -- archive and proceed as if --refresh
            print("Manifest corrupt; archiving and re-running.")
            ts = datetime.now().strftime("%Y%m%d-%H%M%S")
            manifest_path.rename(manifest_path.with_suffix(f".{ts}.bak.json"))

    # On --refresh (or after corrupt manifest archive), wipe asset dirs
    if manifest_path.exists() and refresh:
        ts = datetime.now().strftime("%Y%m%d-%H%M%S")
        manifest_path.rename(manifest_path.with_suffix(f".{ts}.bak.json"))
        for sub in ("reference", "stock"):
            d = research_dir / sub
            if d.exists():
                shutil.rmtree(d)

    research_dir.mkdir(parents=True, exist_ok=True)
    (research_dir / "reference").mkdir(exist_ok=True)
    (research_dir / "stock").mkdir(exist_ok=True)

    keywords = read_cached_keywords(research_md) or []
    topic = _extract_topic(research_md)
    tavily_data = _load_tavily(tavily_results_json)

    manifest = Manifest(topic=topic, english_keywords=keywords, items=[], skipped=[])
    used_ids: set[str] = set()
    domain_counts: dict[str, int] = {}

    async with aiohttp.ClientSession() as session:
        # Phase 1: collect all candidate (url, dest, meta) tuples
        candidates = await _collect_candidates(
            session, tavily_data, keywords, used_ids, domain_counts,
            research_dir,
        )

        # Phase 2: download in parallel
        jobs = [(c["url"], c["dest"]) for c in candidates]
        results = await download_all(session, jobs)

        # Phase 3: post-download verification (size check, dimension check)
        for ok, cand in zip(results, candidates):
            if not ok:
                manifest.skipped.append({"url": cand["url"], "reason": "download failed"})
                continue
            size = cand["dest"].stat().st_size

            if cand["type"] == "image":
                try:
                    with Image.open(cand["dest"]) as im:
                        w, h = im.size
                except Exception:
                    cand["dest"].unlink(missing_ok=True)
                    manifest.skipped.append({"url": cand["url"], "reason": "unreadable image"})
                    continue
                if not is_acceptable_image_size(w, h):
                    cand["dest"].unlink(missing_ok=True)
                    manifest.skipped.append({"url": cand["url"], "reason": f"too small {w}x{h}"})
                    continue
                cand["meta"]["width"] = w
                cand["meta"]["height"] = h
            elif cand["type"] == "video":
                if size < MIN_VIDEO_BYTES:
                    cand["dest"].unlink(missing_ok=True)
                    manifest.skipped.append({"url": cand["url"], "reason": f"video too small ({size} bytes)"})
                    continue

            cand["meta"]["size_bytes"] = size
            cand["meta"]["local_path"] = str(cand["dest"].relative_to(project_dir / "assets"))
            manifest.items.append(cand["meta"])

    write_manifest(manifest_path, manifest)
    append_visual_section(research_md, manifest)
    _print_summary(manifest)


def _extract_topic(research_md: Path) -> str:
    if not research_md.exists():
        return ""
    lines = research_md.read_text(encoding="utf-8").splitlines()
    if not lines:
        return ""
    return lines[0].lstrip("# ").strip().removeprefix("调研:").strip()


def _load_tavily(path: Path) -> dict[str, Any]:
    if not path.exists():
        return {}
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return {}


async def _collect_candidates(
    session: aiohttp.ClientSession,
    tavily_data: dict[str, Any],
    keywords: list[str],
    used_ids: set[str],
    domain_counts: dict[str, int],
    research_dir: Path,
) -> list[dict[str, Any]]:
    candidates: list[dict[str, Any]] = []
    ref_count = 0
    stock_count = 0

    # Build a {url -> title} map from Tavily results so we can populate page_title
    tavily_results = tavily_data.get("results", []) or []
    tavily_url_to_title = {r.get("url", ""): r.get("title", "") for r in tavily_results if r.get("url")}

    # -- Source 1: Tavily images --
    for url in extract_image_urls(tavily_data):
        if ref_count >= LIMITS["max_reference"]:
            break
        host = normalize_host(url)
        if exceeds_domain_quota(host, domain_counts):
            continue
        ext = extension_from_url(url, default=".jpg")
        item_id = next_id("tavily", used_ids)
        used_ids.add(item_id)
        domain_counts[host] = domain_counts.get(host, 0) + 1
        ref_count += 1
        candidates.append({
            "url": url,
            "type": "image",
            "dest": build_local_path(research_dir, "reference", item_id, ext),
            "meta": {
                "id": item_id, "type": "image", "category": "reference",
                "source": "tavily", "source_url": url,
                "page_url": "", "page_title": "",
                "license": "external -- research-reference only",
            },
        })

    # -- Source 2: Article HTML --
    article_urls = [r.get("url", "") for r in tavily_results][:3]
    for page_url in article_urls:
        if ref_count >= LIMITS["max_reference"]:
            break
        if not page_url:
            continue
        fetched = await fetch_article(session, page_url)
        if fetched is None:
            continue
        html, html_title = fetched
        page_title = html_title or tavily_url_to_title.get(page_url, "")
        host = normalize_host(page_url)
        for media in extract_media_from_html(html, page_url):
            if ref_count >= LIMITS["max_reference"]:
                break
            if exceeds_domain_quota(host, domain_counts):
                break
            url = media["url"]
            ext = extension_from_url(url, default=(".mp4" if media["type"] == "video" else ".jpg"))
            item_id = next_id(f"article-{host}", used_ids)
            used_ids.add(item_id)
            domain_counts[host] = domain_counts.get(host, 0) + 1
            ref_count += 1
            candidates.append({
                "url": url,
                "type": media["type"],
                "dest": build_local_path(research_dir, "reference", item_id, ext),
                "meta": {
                    "id": item_id, "type": media["type"], "category": "reference",
                    "source": "article", "source_url": url,
                    "page_url": page_url, "page_title": page_title,
                    "alt": media.get("alt", ""),
                    "license": "external -- research-reference only",
                },
            })

    # -- Source 3: Pixabay --
    pix_key = os.environ.get("PIXABAY_API_KEY")
    if pix_key and keywords:
        query = "+".join(keywords[:3])
        img_hits = await search_images(session, pix_key, query, per_page=5)
        vid_hits = await search_videos(session, pix_key, query, per_page=2)

        for hit in img_hits:
            if stock_count >= LIMITS["max_stock"]:
                break
            ext = extension_from_url(hit["url"], default=".jpg")
            item_id = next_id("pixabay-img", used_ids)
            used_ids.add(item_id)
            stock_count += 1
            candidates.append({
                "url": hit["url"],
                "type": "image",
                "dest": build_local_path(research_dir, "stock", item_id, ext),
                "meta": {
                    "id": item_id, "type": "image", "category": "stock",
                    "source": "pixabay", "source_url": hit["url"],
                    "page_url": hit["page_url"], "pixabay_id": hit["pixabay_id"],
                    "tags": hit["tags"], "credit": hit["credit"],
                    "license": "Pixabay Content License",
                },
            })
        for hit in vid_hits:
            if stock_count >= LIMITS["max_stock"]:
                break
            ext = extension_from_url(hit["url"], default=".mp4")
            item_id = next_id("pixabay-vid", used_ids)
            used_ids.add(item_id)
            stock_count += 1
            candidates.append({
                "url": hit["url"],
                "type": "video",
                "dest": build_local_path(research_dir, "stock", item_id, ext),
                "meta": {
                    "id": item_id, "type": "video", "category": "stock",
                    "source": "pixabay", "source_url": hit["url"],
                    "page_url": hit["page_url"], "pixabay_id": hit["pixabay_id"],
                    "tags": hit["tags"], "credit": hit["credit"],
                    "license": "Pixabay Content License",
                },
            })

    return candidates


def _print_summary(manifest: Manifest) -> None:
    s = manifest.stats()
    print(f"Downloaded: {s['reference_count']} reference + {s['stock_count']} stock ({s['total_size_mb']} MB), skipped {s['skipped']}")
