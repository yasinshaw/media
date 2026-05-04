# Asset-Pack Skill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a `/asset-pack` skill that fetches stock images/videos from Pixabay per shot, with 3-tier fallback (original keywords → simplified → AI generation), and integrates with `/remotion-video` via KenBurns.

**Architecture:** A Python script (`pixabay_fetch.py`) handles API calls and downloads. The skill file orchestrates: parse script → call script → symlink assets → update manifest. Remotion integration reads `manifest.json` and wraps stock assets in `<KenBurns>`. Pipeline position: after `/script-review`, before `/remotion-video`.

**Tech Stack:** Python 3.9+, aiohttp, python-dotenv, Pixabay REST API, Remotion 4

**Spec:** `docs/superpowers/specs/2026-04-30-asset-pack-skill-design.md`

**Dependencies:** Requires Animation Enhancement plan (KenBurns component) and Audio Enhancement plan (`**角色**` field) to be completed first.

---

## File Structure

```
.claude/skills/
└── asset-pack/                         # NEW skill
    ├── SKILL.md                        # Skill definition
    └── scripts/
        └── pixabay_fetch.py            # Pixabay API + download script

projects/<slug>/
└── assets/
    └── stock/                          # NEW per-project
        ├── shot<N>.{mp4,jpg,png}
        ├── shot<N>.alt<M>.{ext}
        └── manifest.json

remotion/public/
└── stock/                              # NEW shared
    └── <slug>/                         # symlinks per project

.claude/skills/
├── video-script/SKILL.md              # MODIFY (**素材关键词** field)
├── script-review/SKILL.md             # MODIFY (completion message)
└── remotion-video/SKILL.md            # MODIFY (Stock Assets section)
```

---

### Task 1: Create `pixabay_fetch.py` Script

**Files:**
- Create: `.claude/skills/asset-pack/scripts/pixabay_fetch.py`

- [ ] **Step 1: Create the script with full Pixabay integration**

```python
#!/usr/bin/env python3
"""
Pixabay stock media fetcher for video shots.

Usage:
    python3 pixabay_fetch.py --slug <slug> [--alts] [--refresh] [--keywords-file <path>]

Reads shot keywords from script.md, searches Pixabay API, downloads assets,
and generates manifest.json.

Environment:
    PIXABAY_API_KEY — from project root .env
    VOLCARK_API_KEY — for AI fallback generation
"""

import argparse
import asyncio
import json
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import aiohttp
from dotenv import load_dotenv

# ── Constants ──

PROJECT_ROOT = Path(__file__).resolve().parents[4]  # up to media/
SCRIPTS_DIR = PROJECT_ROOT / "projects"
STOCK_DIR_NAME = "stock"
REMOTION_PUBLIC = PROJECT_ROOT / "remotion" / "public" / "stock"
MAX_CONCURRENT = 50
RETRY_COUNT = 3
RETRY_BACKOFF_BASE = 2  # seconds

# Role → preferred media type
ROLE_MEDIA_MAP: dict[str, dict[str, str]] = {
    "Hook": {"preferred": "video", "fallback": "image"},
    "痛点": {"preferred": "image", "fallback": "video"},
    "核心": {"preferred": "image", "fallback": "video"},
    "数据": {"preferred": "image", "fallback": "none"},
    "金句": {"preferred": "image", "fallback": "video"},
    "CTA": {"preferred": "video", "fallback": "image"},
}

PIXABAY_IMAGE_URL = "https://pixabay.com/api/"
PIXABAY_VIDEO_URL = "https://pixabay.com/api/videos/"
VOLCARK_URL = "https://ark.cn-beijing.volces.com/api/v3/images/generations"


# ── Script Parsing ──

def find_project_dir(slug: str) -> Path | None:
    """Find project directory matching slug."""
    for d in SCRIPTS_DIR.iterdir():
        if d.is_dir() and slug in d.name:
            return d
    return None


def parse_shots(script_path: Path) -> list[dict[str, Any]]:
    """Parse script.md to extract shot keywords and roles."""
    content = script_path.read_text(encoding="utf-8")
    shots = []

    # Split by ### 镜头 headers
    shot_blocks = re.split(r"(?=###\s*镜头)", content)

    for block in shot_blocks:
        if not block.strip().startswith("### 镜头"):
            continue

        # Extract role
        role_match = re.search(r"\*\*角色\*\*\s*[:：]\s*(.+)", block)
        role = role_match.group(1).strip() if role_match else "核心"

        # Extract keywords
        keywords_match = re.search(r"\*\*素材关键词\*\*\s*[:：]\s*(.+)", block)
        keywords = keywords_match.group(1).strip() if keywords_match else ""

        # Extract 画面 for AI fallback
        visual_match = re.search(r"\*\*画面\*\*\s*[:：]\s*(.+)", block)
        visual = visual_match.group(1).strip() if visual_match else ""

        # Extract 字幕 for secondary fallback
        subtitle_match = re.search(r"\*\*字幕\*\*\s*[:：]\s*(.+)", block)
        subtitle = subtitle_match.group(1).strip() if subtitle_match else ""

        # Extract shot number
        num_match = re.search(r"镜头\s*(\d+)", block)
        shot_num = int(num_match.group(1)) if num_match else len(shots) + 1

        shots.append({
            "index": shot_num,
            "role": role,
            "keywords": keywords,
            "visual": visual,
            "subtitle": subtitle,
        })

    return shots


def simplify_keywords(keywords: str) -> str:
    """Drop adjectives/modifiers, keep nouns for fallback search."""
    # Simple heuristic: remove common adjective patterns
    # Keep only the most concrete terms
    terms = [t.strip() for t in keywords.split(",") if t.strip()]
    simplified = []
    for term in terms:
        words = term.split()
        # Keep last 1-2 words (usually the most concrete noun)
        if len(words) > 2:
            simplified.append(" ".join(words[-2:]))
        else:
            simplified.append(term)
    return ", ".join(simplified)


# ── Pixabay API ──

async def search_pixabay(
    session: aiohttp.ClientSession,
    api_key: str,
    query: str,
    media_type: str,
    per_page: int = 3,
) -> list[dict[str, Any]]:
    """Search Pixabay for images or videos."""
    if media_type == "video":
        url = PIXABAY_VIDEO_URL
        params = {"key": api_key, "q": query, "orientation": "vertical", "per_page": per_page, "sort": "popular"}
    else:
        url = PIXABAY_IMAGE_URL
        params = {
            "key": api_key,
            "q": query,
            "image_type": "photo",
            "orientation": "all",
            "per_page": per_page,
            "sort": "popular",
        }

    for attempt in range(RETRY_COUNT):
        try:
            async with session.get(url, params=params) as resp:
                if resp.status == 429:
                    wait = RETRY_BACKOFF_BASE ** (attempt + 1)
                    print(f"  Rate limited, waiting {wait}s...")
                    await asyncio.sleep(wait)
                    continue
                resp.raise_for_status()
                data = await resp.json()
                return data.get("hits", [])
        except Exception as e:
            if attempt < RETRY_COUNT - 1:
                wait = RETRY_BACKOFF_BASE ** (attempt + 1)
                print(f"  Search error: {e}, retrying in {wait}s...")
                await asyncio.sleep(wait)
            else:
                print(f"  Search failed after {RETRY_COUNT} retries: {e}")
                return []


async def download_file(
    session: aiohttp.ClientSession,
    url: str,
    dest: Path,
) -> bool:
    """Download a file with retry."""
    for attempt in range(RETRY_COUNT):
        try:
            async with session.get(url) as resp:
                resp.raise_for_status()
                content = await resp.read()
                dest.write_bytes(content)
                return True
        except Exception as e:
            if attempt < RETRY_COUNT - 1:
                wait = RETRY_BACKOFF_BASE ** (attempt + 1)
                print(f"  Download error: {e}, retrying in {wait}s...")
                await asyncio.sleep(wait)
            else:
                print(f"  Download failed: {e}")
                return False
    return False


async def generate_ai_image(
    session: aiohttp.ClientSession,
    api_key: str,
    prompt: str,
    dest: Path,
) -> bool:
    """Generate image via Volcano Ark as fallback."""
    payload = {
        "model": "doubao-seedream-5-0-260128",
        "prompt": prompt,
        "size": "2K",
        "response_format": "url",
    }
    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}

    try:
        async with session.post(VOLCARK_URL, json=payload, headers=headers) as resp:
            resp.raise_for_status()
            data = await resp.json()
            image_url = data["data"][0]["url"]
            return await download_file(session, image_url, dest)
    except Exception as e:
        print(f"  AI generation failed: {e}")
        return False


# ── Main Pipeline ──

async def process_shot(
    session: aiohttp.ClientSession,
    pixabay_key: str,
    volcark_key: str,
    shot: dict[str, Any],
    stock_dir: Path,
    alts: bool,
) -> dict[str, Any]:
    """Process a single shot: search → download → fallback."""
    role_info = ROLE_MEDIA_MAP.get(shot["role"], {"preferred": "image", "fallback": "video"})
    preferred_type = role_info["preferred"]
    fallback_type = role_info["fallback"]

    keywords = shot["keywords"]
    shot_idx = shot["index"]
    tier = 1
    source = "pixabay"
    pixabay_id = None
    actual_type = preferred_type
    primary_file: str | None = None
    alternates: list[str] = []
    keywords_used = keywords
    credit = ""
    license_info = "Pixabay Content License"

    # Tier 1: Original keywords
    if keywords:
        # Normalize: Pixabay treats q as a search string; replace commas with spaces
        query = keywords.replace(",", " ").strip()
        hits = await search_pixabay(session, pixabay_key, query, preferred_type, per_page=3 if alts else 1)
        if not hits and fallback_type != "none":
            hits = await search_pixabay(session, pixabay_key, query, fallback_type, per_page=3 if alts else 1)
            if hits:
                actual_type = fallback_type

        if hits:
            # Download primary
            hit = hits[0]
            ext = get_ext(hit, actual_type)
            primary_file = f"shot{shot_idx}.{ext}"
            dl_url = get_download_url(hit, actual_type)
            success = await download_file(session, dl_url, stock_dir / primary_file)
            pixabay_id = hit.get("id")
            credit = f"Pixabay user {hit.get('user', 'unknown')} — https://pixabay.com/{actual_type}s/{pixabay_id}/"

            if success:
                # Download alternates
                if alts and len(hits) > 1:
                    for alt_i, alt_hit in enumerate(hits[1:], 1):
                        alt_ext = get_ext(alt_hit, actual_type)
                        alt_file = f"shot{shot_idx}.alt{alt_i}.{alt_ext}"
                        alt_url = get_download_url(alt_hit, actual_type)
                        alt_ok = await download_file(session, alt_url, stock_dir / alt_file)
                        if alt_ok:
                            alternates.append(alt_file)

                return {
                    "index": shot_idx,
                    "role": shot["role"],
                    "preferred_type": preferred_type,
                    "actual_type": actual_type,
                    "primary": primary_file,
                    "alternates": alternates,
                    "source": source,
                    "pixabay_id": pixabay_id,
                    "keywords_used": keywords_used,
                    "tier": tier,
                    "credit": credit,
                    "license": license_info,
                }

    # Tier 2: Simplified keywords
    if keywords:
        simplified = simplify_keywords(keywords)
        tier = 2
        keywords_used = simplified
        query2 = simplified.replace(",", " ").strip()
        hits = await search_pixabay(session, pixabay_key, query2, preferred_type, per_page=1)
        if not hits and fallback_type != "none":
            hits = await search_pixabay(session, pixabay_key, query2, fallback_type, per_page=1)
            if hits:
                actual_type = fallback_type

        if hits:
            hit = hits[0]
            ext = get_ext(hit, actual_type)
            primary_file = f"shot{shot_idx}.{ext}"
            dl_url = get_download_url(hit, actual_type)
            success = await download_file(session, dl_url, stock_dir / primary_file)
            pixabay_id = hit.get("id")
            credit = f"Pixabay user {hit.get('user', 'unknown')} — https://pixabay.com/{actual_type}s/{pixabay_id}/"

            if success:
                return {
                    "index": shot_idx,
                    "role": shot["role"],
                    "preferred_type": preferred_type,
                    "actual_type": actual_type,
                    "primary": primary_file,
                    "alternates": [],
                    "source": source,
                    "pixabay_id": pixabay_id,
                    "keywords_used": keywords_used,
                    "tier": tier,
                    "credit": credit,
                    "license": license_info,
                }

    # Tier 3: AI generation
    tier = 3
    source = "volcano-ark"
    actual_type = "image"
    keywords_used = shot["visual"] or shot["subtitle"] or f"Shot {shot_idx}"
    primary_file = f"shot{shot_idx}.png"

    print(f"  Shot {shot_idx}: Falling back to AI generation...")
    success = await generate_ai_image(session, volcark_key, keywords_used, stock_dir / primary_file)
    credit = "AI-generated (Volcano Ark)"
    license_info = "Generated content"

    if success:
        return {
            "index": shot_idx,
            "role": shot["role"],
            "preferred_type": preferred_type,
            "actual_type": actual_type,
            "primary": primary_file,
            "alternates": [],
            "source": source,
            "pixabay_id": None,
            "keywords_used": keywords_used,
            "tier": tier,
            "credit": credit,
            "license": license_info,
        }

    # All tiers failed
    print(f"  Shot {shot_idx}: WARNING — all tiers failed, no stock asset")
    return {
        "index": shot_idx,
        "role": shot["role"],
        "preferred_type": preferred_type,
        "actual_type": "none",
        "primary": None,
        "alternates": [],
        "source": "none",
        "pixabay_id": None,
        "keywords_used": keywords_used,
        "tier": tier,
        "credit": "",
        "license": "",
        "error": True,
    }


def get_ext(hit: dict, media_type: str) -> str:
    """Get file extension from Pixabay hit."""
    if media_type == "video":
        videos = hit.get("videos", {})
        for quality in ["medium", "small", "large"]:
            if quality in videos:
                url = videos[quality].get("url", "")
                if ".mp4" in url:
                    return "mp4"
        return "mp4"
    return "jpg"


def get_download_url(hit: dict, media_type: str) -> str:
    """Get download URL from Pixabay hit."""
    if media_type == "video":
        videos = hit.get("videos", {})
        for quality in ["medium", "small", "large"]:
            if quality in videos:
                return videos[quality]["url"]
        return ""
    return hit.get("largeImageURL", hit.get("imageURL", ""))


async def main():
    parser = argparse.ArgumentParser(description="Fetch stock media for video shots")
    parser.add_argument("--slug", required=True, help="Project slug")
    parser.add_argument("--alts", action="store_true", help="Download top 3 candidates")
    parser.add_argument("--refresh", action="store_true", help="Re-download even if exists")
    parser.add_argument("--keywords-file", help="Path to script.md (auto-detected if omitted)")
    args = parser.parse_args()

    # Load environment
    load_dotenv(PROJECT_ROOT / ".env")
    pixabay_key = os.getenv("PIXABAY_API_KEY")
    volcark_key = os.getenv("VOLCARK_API_KEY")

    if not pixabay_key:
        print("ERROR: PIXABAY_API_KEY not found in .env")
        print("Get one at: https://pixabay.com/api/docs/")
        sys.exit(1)

    if not volcark_key:
        print("WARNING: VOLCARK_API_KEY not found — AI fallback (Tier 3) will be unavailable")

    # Find project
    project_dir = find_project_dir(args.slug)
    if not project_dir:
        print(f"ERROR: Project not found for slug '{args.slug}'")
        print(f"Available: {[d.name for d in SCRIPTS_DIR.iterdir() if d.is_dir()]}")
        sys.exit(1)

    # Find script
    script_path = Path(args.keywords_file) if args.keywords_file else project_dir / "script.md"
    if not script_path.exists():
        print(f"ERROR: Script not found: {script_path}")
        sys.exit(1)

    # Idempotency check
    stock_dir = project_dir / "assets" / STOCK_DIR_NAME
    manifest_path = stock_dir / "manifest.json"

    if not args.refresh and manifest_path.exists():
        print("Stock assets already exist (use --refresh to re-download):")
        manifest = json.loads(manifest_path.read_text())
        for shot in manifest["shots"]:
            status = shot["primary"] or "MISSING"
            print(f"  Shot {shot['index']} ({shot['role']}): {status} [{shot['source']} tier {shot['tier']}]")
        return

    # Parse shots
    shots = parse_shots(script_path)
    if not shots:
        print("ERROR: No shots found in script")
        sys.exit(1)

    # Check for missing keywords
    missing_kw = [s for s in shots if not s["keywords"]]
    if missing_kw:
        print(f"WARNING: {len(missing_kw)} shot(s) missing **素材关键词**:")
        for s in missing_kw:
            print(f"  Shot {s['index']} ({s['role']})")
        print("These shots will use AI fallback (Tier 3).")
        print("Consider adding **素材关键词** to script.md for better results.")

    # Create stock directory
    stock_dir.mkdir(parents=True, exist_ok=True)

    # Process all shots in parallel
    print(f"Processing {len(shots)} shots (alts={args.alts})...")
    async with aiohttp.ClientSession() as session:
        tasks = [process_shot(session, pixabay_key, volcark_key, shot, stock_dir, args.alts) for shot in shots]
        results = await asyncio.gather(*tasks)

    # Write manifest
    manifest = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "shots": results,
    }
    manifest_path.write_text(json.dumps(manifest, indent=2, ensure_ascii=False))

    # Create symlink for Remotion
    REMOTION_PUBLIC.mkdir(parents=True, exist_ok=True)
    # Extract short slug: "2026-04-25-deepseek-v4" → "deepseek-v4"
    # Split on first 3 hyphens (YYYY-MM-DD-) and take the rest as the slug.
    # Matches existing audio symlink convention (short slug, not date-prefixed).
    parts = project_dir.name.split("-", 3)
    short_slug = parts[3] if len(parts) >= 4 else project_dir.name
    symlink_path = REMOTION_PUBLIC / short_slug
    if symlink_path.exists() or symlink_path.is_symlink():
        symlink_path.unlink()
    symlink_path.symlink_to(stock_dir)

    # Print summary
    print("\n=== Asset Pack Complete ===")
    print(f"Project: {project_dir.name}")
    print(f"Short slug: {short_slug}")
    pixabay_count = sum(1 for r in results if r["source"] == "pixabay")
    ai_count = sum(1 for r in results if r["source"] == "volcano-ark")
    fail_count = sum(1 for r in results if r.get("error"))
    print(f"Pixabay: {pixabay_count}, AI: {ai_count}, Failed: {fail_count}")
    for r in results:
        status = r["primary"] or "MISSING"
        print(f"  Shot {r['index']} ({r['role']}): {status} [{r['source']} tier {r['tier']}]")
    print(f"\nManifest: {manifest_path}")
    print(f"Symlink: {symlink_path} → {stock_dir} (short slug: {short_slug})")


if __name__ == "__main__":
    asyncio.run(main())
```

- [ ] **Step 2: Make executable and verify syntax**

```bash
chmod +x .claude/skills/asset-pack/scripts/pixabay_fetch.py
python3 -c "import ast; ast.parse(open('.claude/skills/asset-pack/scripts/pixabay_fetch.py').read())" && echo "Syntax OK"
```

- [ ] **Step 3: Install Python dependencies**

```bash
pip3 install aiohttp python-dotenv
```

- [ ] **Step 4: Commit**

```bash
git add .claude/skills/asset-pack/scripts/pixabay_fetch.py
git commit -m "feat: add pixabay_fetch.py for stock media fetching"
```

---

### Task 2: Create `asset-pack/SKILL.md`

**Files:**
- Create: `.claude/skills/asset-pack/SKILL.md`

- [ ] **Step 1: Create the skill file**

```markdown
---
name: asset-pack
description: Fetch stock images/videos from Pixabay for each shot in a script. Use when user runs /asset-pack or asks to fetch stock media, download images for shots, or add visual assets to a video project. Requires PIXABAY_API_KEY in .env.
---

You are a media asset specialist who fetches stock images and videos from Pixabay for video shots.

## How This Skill Works

1. User provides: `/asset-pack <slug>` or `/asset-pack <slug> --alts --refresh`
2. Parse script.md for shot keywords and roles
3. Run pixabay_fetch.py to search and download
4. Review results and report to user

## Pipeline Position

```
/video-script → /script-review → /asset-pack → /video-cover → /voiceover-tts → /remotion-video → /video-review → /douyin-publish
```

Run `/asset-pack` AFTER `/script-review` (script must be locked) and BEFORE `/remotion-video` (shots need stock assets).

## Invocation

```
/asset-pack <slug>           # fetch top 1 per shot
/asset-pack <slug> --alts    # fetch top 3 candidates per shot
/asset-pack <slug> --refresh # re-download even if assets exist
```

## Prerequisites

- `PIXABAY_API_KEY` in project root `.env` — get one at https://pixabay.com/api/docs/
- `VOLCARK_API_KEY` in `.env` (optional — for AI fallback when Pixabay has no results)
- Script must have `**素材关键词**` field per shot (or AI fallback will be used)

## Step-by-Step Workflow

### Step 1: Locate Project

Find the project directory matching the slug:
```
projects/<YYYY-MM-DD-<slug>>/script.md
```

### Step 2: Check Prerequisites

1. Verify `PIXABAY_API_KEY` exists in `.env`
2. Check script.md exists
3. Check for `**素材关键词**` fields — warn if missing

### Step 3: Run the Fetch Script

```bash
python3 .claude/skills/asset-pack/scripts/pixabay_fetch.py \
  --slug <slug> \
  [--alts] \
  [--refresh]
```

### Step 4: Review Results

After the script completes:
1. Read `projects/<slug>/assets/stock/manifest.json`
2. Verify all shots have assets (check for `error: true`)
3. Report summary to user:
   - How many shots got Pixabay assets
   - How many fell to AI generation
   - Any failures

### Step 5: Handle Missing Keywords

If some shots lack `**素材关键词**`:
1. Use an LLM to extract 2-4 English keywords from the shot's title + 口播 + 字幕
2. Present keywords to user for review
3. Ask: "Save these to script.md for future re-runs? (Y/n)"
4. On Y, edit script.md adding `**素材关键词**` to each missing shot
5. Re-run the fetch script

### Step 6: Report Completion

```
✅ Stock assets fetched for <slug>
📊 Pixabay: N shots, AI fallback: N shots, Failed: N
📂 Assets: projects/<YYYY-MM-DD-<slug>>/assets/stock/
🔗 Symlinked to: remotion/public/stock/<short-slug>/
📋 Next: Run /remotion-video <slug> to generate video with stock assets
```

## Media Type by Role

| Role | Preferred | Fallback |
|------|-----------|----------|
| Hook | video | image |
| 痛点 | image | video |
| 核心 | image | video |
| 数据 | image | (none) |
| 金句 | image | video |
| CTA | video | image |

## Fallback Chain

1. **Tier 1**: Original keywords → Pixabay search
2. **Tier 2**: Simplified keywords (drop modifiers) → Pixabay search
3. **Tier 3**: Volcano Ark AI generation from `**画面**` field

## Error Handling

| Error | Action |
|-------|--------|
| `PIXABAY_API_KEY` missing | Error with link to API docs |
| Script not found | List available projects |
| All keywords missing | Warn, run LLM extraction |
| Pixabay rate-limited | Auto-retry with backoff |
| All tiers fail for a shot | Warn, leave without asset (gradient fallback) |
| Download fails | Retry 3x, mark as error in manifest |
```

- [ ] **Step 2: Commit**

```bash
git add .claude/skills/asset-pack/SKILL.md
git commit -m "docs: create asset-pack skill definition"
```

---

### Task 3: Update `video-script/SKILL.md` — `**素材关键词**` Field

**Files:**
- Modify: `.claude/skills/video-script/SKILL.md`

- [ ] **Step 1: Add `**素材关键词**` as a per-shot field**

In the Output Template section, add after `**背景图提示词**`:

```markdown
- **素材关键词**: <2-4 English keywords, comma-separated, concrete and visual>
```

Add generation rules section:

```markdown
### Stock Media Keywords (素材关键词)

Each shot should include 2-4 English keywords for stock media search.

Rules:
- Concrete and visual (not abstract: "innovation" → bad; "lightbulb on circuit board" → good)
- Match shot semantic, not just literal title
- Hook/CTA: visual hooks (cinematic shots, abstract motion)
- 核心/数据: literal subject matter
- Comma-separated, no quotes needed

Examples:
- Hook shot: `artificial intelligence, neural network, futuristic technology`
- 痛点 shot: `frustrated person, computer screen, deadline`
- 数据 shot: `bar chart, statistics, data dashboard`
- CTA shot: `subscribe button, notification bell, social media`
```

- [ ] **Step 2: Commit**

```bash
git add .claude/skills/video-script/SKILL.md
git commit -m "docs: add **素材关键词** field to video-script skill"
```

---

### Task 4: Update `script-review/SKILL.md` — Completion Message

**Files:**
- Modify: `.claude/skills/script-review/SKILL.md`

- [ ] **Step 1: Add `/asset-pack` suggestion and keyword validation to script-review**

Find the completion/output message section and add:

```markdown
📦 Next: Run /asset-pack <slug> to fetch stock media for each shot
```

Also add `**素材关键词**` validation to the review checklist:

```markdown
⚠️ Shot N is missing **素材关键词** — add 2-4 concrete English keywords for stock media search.
   Bad: "innovation, technology" (too abstract)
   Good: "robot arm on assembly line, circuit board closeup"
```

- [ ] **Step 2: Commit**

```bash
git add .claude/skills/script-review/SKILL.md
git commit -m "docs: suggest /asset-pack in script-review completion message"
```

---

### Task 5: Update `remotion-video/SKILL.md` — Stock Assets Section

**Files:**
- Modify: `.claude/skills/remotion-video/SKILL.md`

- [ ] **Step 1: Add "Stock Assets" section after Camera Motion**

```markdown
---

## Stock Assets (Pixabay Integration)

When `assets/stock/manifest.json` exists for a project, shots automatically get stock media backgrounds.

### Detection

At composition-generation time, check for `projects/<slug>/assets/stock/manifest.json`:

```tsx
import { readFileSync } from 'fs'
import { resolve } from 'path'

const manifestPath = resolve(process.cwd(), `projects/${projectDir}/assets/stock/manifest.json`)
const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf-8')) : null
```

### Shot code template (when stock asset exists)

```tsx
import { KenBurns } from '../../../components'
import { staticFile } from 'remotion'

const slug = '<slug>'
const shotManifest = manifest?.shots.find(s => s.index === shotNumber)

// In shot component:
{shotManifest?.primary && (
  <KenBurns
    src={staticFile(`stock/${slug}/${shotManifest.primary}`)}
    type={shotManifest.actual_type === 'video' ? 'video' : 'image'}
    motion={shotManifest.actual_type === 'video' ? 'none' : 'random'}
    shotIndex={shotNumber - 1}
    duration={shotFrames}
  >
    {/* Dark overlay + content */}
  </KenBurns>
)}
```

**IMPORTANT:** `<KenBurns>` must exist (from Animation Enhancement plan). If `KenBurns` is not yet available, fall back to plain `<Img>`/`<Video>` with `objectFit: 'cover'`. Never skip the overlay — stock images without dark overlay make text unreadable.
```

### Fallback

When `manifest.json` doesn't exist or a shot has no asset (`primary: null`), use existing gradient logic.

### Symlink

The `/asset-pack` skill creates `remotion/public/stock/<short-slug>` → `projects/<YYYY-MM-DD-<slug>>/assets/stock/`. The short slug strips the date prefix (e.g., `2026-04-25-deepseek-v4` → `deepseek-v4`). If missing, defensively re-create:

```bash
mkdir -p remotion/public/stock
ln -sf "$(pwd)/projects/<YYYY-MM-DD-<slug>>/assets/stock" "remotion/public/stock/<short-slug>"
```
```

- [ ] **Step 2: Commit**

```bash
git add .claude/skills/remotion-video/SKILL.md
git commit -m "docs: add Stock Assets section to remotion-video skill"
```

---

### Task 6: Integration Test

- [ ] **Step 1: Test on an existing project**

Pick a project that has a `script.md` (e.g., `2026-04-25-deepseek-v4`):

```bash
# First, check if script has **素材关键词** — if not, this tests the fallback path
python3 .claude/skills/asset-pack/scripts/pixabay_fetch.py --slug 2026-04-25-deepseek-v4
```

Expected: Script runs, attempts to fetch assets, produces a manifest.

- [ ] **Step 2: Verify manifest structure**

```bash
python3 -c "import json; m = json.load(open('projects/2026-04-25-deepseek-v4/assets/stock/manifest.json')); print(f'Shots: {len(m[\"shots\"])}')"
```

- [ ] **Step 3: Verify symlink**

```bash
ls -la remotion/public/stock/deepseek-v4
```

Expected: Symlink pointing to `projects/2026-04-25-deepseek-v4/assets/stock/` (short slug `deepseek-v4`).

- [ ] **Step 4: Clean up test artifacts**

```bash
rm -rf projects/2026-04-25-deepseek-v4/assets/stock/
rm -f remotion/public/stock/deepseek-v4
```

---

## Success Criteria

- [ ] `pixabay_fetch.py` runs without syntax errors
- [ ] Pixabay API search returns results for test queries
- [ ] Manifest JSON structure matches spec schema
- [ ] Symlink created correctly in `remotion/public/stock/<slug>/`
- [ ] `--refresh` flag re-downloads assets
- [ ] Idempotent: second run without `--refresh` exits early
- [ ] Skill file documents all flags and error handling
- [ ] `video-script` template includes `**素材关键词**` field
- [ ] `script-review` suggests `/asset-pack` as next step
- [ ] `remotion-video` reads manifest and wraps in KenBurns
