# Research-Phase Asset Collection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend `/video-script` research phase with a `collect-research-assets` step that downloads images/videos from Tavily, article HTML, and Pixabay into `projects/<slug>/assets/research/{reference,stock}/`, producing a `manifest.json` and updating `research.md`.

**Architecture:** A standalone Python script (`collect_research_assets.py`) handles all four async-parallel sources, filtering, downloading, and manifest generation. The `/video-script` SKILL.md invokes the script after research summary is generated. Two licensing buckets (`reference/` for external, `stock/` for Pixabay). Idempotent via `manifest.json` existence check.

**Tech Stack:** Python 3.9+, `aiohttp`, `beautifulsoup4`, `Pillow`, `python-dotenv`, Tavily API, Pixabay API.

**Spec:** `docs/superpowers/specs/2026-05-03-research-asset-collection-design.md`

**Dependencies:** None (independent of `/asset-pack` plan).

---

## File Structure

```
.claude/skills/video-script/
├── SKILL.md                                      # MODIFY — add collect-research-assets step
└── scripts/
    └── collect_research_assets.py                # NEW — main script
    └── tests/
        ├── __init__.py
        ├── test_filters.py                       # NEW
        ├── test_filename.py                      # NEW
        ├── test_manifest.py                      # NEW
        ├── test_tavily.py                        # NEW
        ├── test_article.py                       # NEW
        ├── test_pixabay.py                       # NEW
        ├── test_downloader.py                    # NEW
        ├── test_keywords.py                      # NEW
        ├── test_research_md.py                   # NEW
        ├── test_orchestrator.py                  # NEW
        └── fixtures/
            ├── sample_tavily_results.json        # NEW
            ├── sample_article.html               # NEW
            └── sample_pixabay_response.json      # NEW

projects/<slug>/
└── assets/
    └── research/                                 # NEW per-project
        ├── reference/
        ├── stock/
        └── manifest.json
```

The Python script is sliced into modules under `collect_research_assets/` package so each piece is testable in isolation:

```
.claude/skills/video-script/scripts/
├── collect_research_assets/
│   ├── __init__.py
│   ├── __main__.py                # CLI entry (so `python3 -m collect_research_assets` works)
│   ├── filters.py                 # URL + image filtering pure functions
│   ├── filename.py                # ID generation + collision handling
│   ├── manifest.py                # manifest.json read/write
│   ├── tavily.py                  # Tavily image extraction
│   ├── article.py                 # HTML scraping via aiohttp + bs4
│   ├── pixabay.py                 # Pixabay API search
│   ├── downloader.py              # async download with retry + concurrency cap
│   ├── keywords.py                # research.md keyword cache + LLM extraction
│   ├── research_md.py             # append "## 视觉素材清单" section
│   └── orchestrator.py            # main async pipeline
└── tests/
    └── ...
```

---

## Task 1: Bootstrap Package + Manifest Module

**Files:**
- Create: `.claude/skills/video-script/scripts/collect_research_assets/__init__.py`
- Create: `.claude/skills/video-script/scripts/collect_research_assets/manifest.py`
- Create: `.claude/skills/video-script/scripts/tests/__init__.py`
- Create: `.claude/skills/video-script/scripts/tests/test_manifest.py`

- [ ] **Step 1: Write failing test for manifest write/read roundtrip**

```python
# tests/test_manifest.py
from pathlib import Path
import json
from collect_research_assets.manifest import write_manifest, read_manifest, Manifest

def test_manifest_roundtrip(tmp_path):
    manifest = Manifest(
        topic="测试主题",
        english_keywords=["AI", "robot"],
        items=[],
        skipped=[],
    )
    path = tmp_path / "manifest.json"
    write_manifest(path, manifest)
    loaded = read_manifest(path)
    assert loaded.topic == "测试主题"
    assert loaded.english_keywords == ["AI", "robot"]
    assert loaded.stats["reference_count"] == 0

def test_manifest_required_fields(tmp_path):
    manifest = Manifest(topic="x", english_keywords=[], items=[], skipped=[])
    path = tmp_path / "manifest.json"
    write_manifest(path, manifest)
    raw = json.loads(path.read_text())
    for key in ("generated_at", "topic", "english_keywords", "limits", "stats", "items", "skipped"):
        assert key in raw
```

- [ ] **Step 2: Run test, verify it fails**

Run: `cd .claude/skills/video-script/scripts && python3 -m pytest tests/test_manifest.py -v`
Expected: FAIL — `ModuleNotFoundError: No module named 'collect_research_assets'`

- [ ] **Step 3: Implement minimal manifest module**

```python
# collect_research_assets/manifest.py
from __future__ import annotations
import json
from dataclasses import dataclass, field, asdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

LIMITS = {"max_reference": 50, "max_stock": 30, "max_total_mb": 200}


@dataclass
class Manifest:
    topic: str
    english_keywords: list[str]
    items: list[dict[str, Any]] = field(default_factory=list)
    skipped: list[dict[str, Any]] = field(default_factory=list)

    def stats(self) -> dict[str, int | float]:
        ref = sum(1 for it in self.items if it.get("category") == "reference")
        stk = sum(1 for it in self.items if it.get("category") == "stock")
        tav = sum(1 for it in self.items if it.get("source") == "tavily")
        art = sum(1 for it in self.items if it.get("source") == "article")
        pix_img = sum(1 for it in self.items if it.get("source") == "pixabay" and it.get("type") == "image")
        pix_vid = sum(1 for it in self.items if it.get("source") == "pixabay" and it.get("type") == "video")
        total_bytes = sum(it.get("size_bytes", 0) for it in self.items)
        return {
            "reference_count": ref,
            "stock_count": stk,
            "total_size_mb": round(total_bytes / 1024 / 1024, 2),
            "tavily_count": tav,
            "article_count": art,
            "pixabay_image_count": pix_img,
            "pixabay_video_count": pix_vid,
            "skipped": len(self.skipped),
        }


def write_manifest(path: Path, manifest: Manifest) -> None:
    payload = {
        "generated_at": datetime.now(timezone.utc).astimezone().isoformat(timespec="seconds"),
        "topic": manifest.topic,
        "english_keywords": manifest.english_keywords,
        "limits": LIMITS,
        "stats": manifest.stats(),
        "items": manifest.items,
        "skipped": manifest.skipped,
    }
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")


def read_manifest(path: Path) -> Manifest:
    raw = json.loads(path.read_text(encoding="utf-8"))
    return Manifest(
        topic=raw["topic"],
        english_keywords=raw["english_keywords"],
        items=raw.get("items", []),
        skipped=raw.get("skipped", []),
    )
```

Also create empty `__init__.py` and `tests/__init__.py`.

- [ ] **Step 4: Run test, verify it passes**

Run: `python3 -m pytest tests/test_manifest.py -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add .claude/skills/video-script/scripts/
git commit -m "feat: add manifest module for research-asset collection"
```

---

## Task 2: URL & Image Filter Heuristics

**Files:**
- Create: `.claude/skills/video-script/scripts/collect_research_assets/filters.py`
- Create: `.claude/skills/video-script/scripts/tests/test_filters.py`

- [ ] **Step 1: Write failing tests for URL and image filters**

```python
# tests/test_filters.py
from collect_research_assets.filters import (
    is_acceptable_url, exceeds_domain_quota, is_acceptable_image_size, normalize_host
)

def test_skip_data_uri():
    assert not is_acceptable_url("data:image/png;base64,iVBORw0K...")

def test_skip_svg():
    assert not is_acceptable_url("https://example.com/icon.svg")

def test_skip_logo_path():
    assert not is_acceptable_url("https://example.com/assets/logo/brand.png")
    assert not is_acceptable_url("https://example.com/static/icons/menu.png")
    assert not is_acceptable_url("https://example.com/path/avatar.jpg")

def test_skip_non_http():
    assert not is_acceptable_url("ftp://example.com/x.jpg")

def test_accept_normal():
    assert is_acceptable_url("https://example.com/photos/2026/landscape.jpg")

def test_normalize_host():
    assert normalize_host("https://www.github.com/path") == "github.com"
    assert normalize_host("https://github.com/path") == "github.com"

def test_domain_quota():
    counts = {"github.com": 5}
    assert exceeds_domain_quota("github.com", counts, cap=5)
    counts2 = {"github.com": 4}
    assert not exceeds_domain_quota("github.com", counts2, cap=5)

def test_image_size_below_min():
    assert not is_acceptable_image_size(300, 600, min_dim=400)
    assert not is_acceptable_image_size(600, 300, min_dim=400)

def test_image_size_above_min():
    assert is_acceptable_image_size(800, 800, min_dim=400)
    assert is_acceptable_image_size(400, 400, min_dim=400)
```

- [ ] **Step 2: Run tests, verify they fail**

Run: `python3 -m pytest tests/test_filters.py -v`
Expected: FAIL — module missing

- [ ] **Step 3: Implement filters**

```python
# collect_research_assets/filters.py
from __future__ import annotations
from urllib.parse import urlparse

SKIP_EXTENSIONS = {".svg", ".gif"}
SKIP_PATH_FRAGMENTS = (
    "/icon", "/logo", "/avatar", "/sprite", "/emoji", "/pixel",
    "/tracking", "/ad/", "/ads/", "/spinner",
)
DEFAULT_DOMAIN_CAP = 5
DEFAULT_MIN_IMAGE_DIM = 400


def is_acceptable_url(url: str) -> bool:
    if not url or url.startswith("data:"):
        return False
    parsed = urlparse(url)
    if parsed.scheme not in ("http", "https"):
        return False
    path = parsed.path.lower()
    if any(path.endswith(ext) for ext in SKIP_EXTENSIONS):
        return False
    if any(frag in path for frag in SKIP_PATH_FRAGMENTS):
        return False
    return True


def normalize_host(url: str) -> str:
    host = urlparse(url).netloc.lower()
    if host.startswith("www."):
        host = host[4:]
    return host


def exceeds_domain_quota(host: str, counts: dict[str, int], cap: int = DEFAULT_DOMAIN_CAP) -> bool:
    return counts.get(host, 0) >= cap


def is_acceptable_image_size(width: int, height: int, min_dim: int = DEFAULT_MIN_IMAGE_DIM) -> bool:
    return width >= min_dim and height >= min_dim
```

- [ ] **Step 4: Run tests, verify pass**

Run: `python3 -m pytest tests/test_filters.py -v`
Expected: PASS (8 tests)

- [ ] **Step 5: Commit**

```bash
git commit -am "feat: add URL and image filter heuristics"
```

---

## Task 3: Filename Generator

**Files:**
- Create: `collect_research_assets/filename.py`
- Create: `tests/test_filename.py`

- [ ] **Step 1: Write failing tests**

```python
# tests/test_filename.py
from collect_research_assets.filename import next_id, extension_from_url, build_local_path
from pathlib import Path

def test_next_id_sequential():
    used = set()
    assert next_id("tavily", used) == "tavily-001"
    used.add("tavily-001")
    assert next_id("tavily", used) == "tavily-002"

def test_next_id_with_host():
    used = set()
    assert next_id("article-github.com", used) == "article-github.com-001"

def test_extension_from_url():
    assert extension_from_url("https://x.com/foo.jpg") == ".jpg"
    assert extension_from_url("https://x.com/path/photo.png?v=1") == ".png"
    assert extension_from_url("https://x.com/clip.MP4") == ".mp4"

def test_extension_default_image():
    assert extension_from_url("https://x.com/no-ext", default=".jpg") == ".jpg"

def test_build_local_path(tmp_path):
    base = tmp_path / "assets" / "research"
    p = build_local_path(base, "reference", "tavily-001", ".jpg")
    assert p == base / "reference" / "tavily-001.jpg"
```

- [ ] **Step 2: Run, verify fail**

- [ ] **Step 3: Implement**

```python
# collect_research_assets/filename.py
from __future__ import annotations
from pathlib import Path
from urllib.parse import urlparse

VIDEO_EXTS = {".mp4", ".webm", ".mov"}
IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp"}


def next_id(prefix: str, used_ids: set[str]) -> str:
    n = 1
    while True:
        candidate = f"{prefix}-{n:03d}"
        if candidate not in used_ids:
            return candidate
        n += 1


def extension_from_url(url: str, default: str = ".jpg") -> str:
    path = urlparse(url).path.lower()
    if "." in path:
        ext = "." + path.rsplit(".", 1)[1].split("?")[0]
        if ext in VIDEO_EXTS or ext in IMAGE_EXTS:
            return ext
    return default


def build_local_path(base: Path, category: str, item_id: str, ext: str) -> Path:
    return base / category / f"{item_id}{ext}"
```

- [ ] **Step 4: Run, verify pass**

- [ ] **Step 5: Commit**

```bash
git commit -am "feat: add filename generator with collision handling"
```

---

## Task 4: Async Downloader

**Files:**
- Create: `collect_research_assets/downloader.py`
- Create: `tests/test_downloader.py`

- [ ] **Step 1: Write failing tests**

```python
# tests/test_downloader.py
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

@pytest.mark.asyncio
async def test_download_all_concurrency_cap(tmp_path):
    """Concurrency semaphore prevents > N concurrent downloads."""
    # This is a structural test — verifies the semaphore is created with the right value.
    from collect_research_assets.downloader import _build_semaphore
    sem = _build_semaphore(3)
    assert sem._value == 3
```

- [ ] **Step 2: Run, verify fail**

- [ ] **Step 3: Implement**

```python
# collect_research_assets/downloader.py
from __future__ import annotations
import asyncio
from pathlib import Path
import aiohttp

DEFAULT_CONCURRENCY = 10
DEFAULT_RETRIES = 3
RETRY_BACKOFF_BASE = 2


def _build_semaphore(n: int) -> asyncio.Semaphore:
    return asyncio.Semaphore(n)


async def download_one(
    session: aiohttp.ClientSession,
    url: str,
    dest: Path,
    retries: int = DEFAULT_RETRIES,
) -> bool:
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
    sem = _build_semaphore(concurrency)

    async def _wrapped(url: str, dest: Path) -> bool:
        async with sem:
            return await download_one(session, url, dest)

    return await asyncio.gather(*[_wrapped(u, d) for u, d in jobs])
```

- [ ] **Step 4: Run, verify pass**

Run: `python3 -m pytest tests/test_downloader.py -v` (requires `pytest-asyncio`)

- [ ] **Step 5: Add `pytest-asyncio` to test deps and commit**

```bash
pip install pytest pytest-asyncio aiohttp Pillow beautifulsoup4 python-dotenv
git commit -am "feat: add async downloader with retry and concurrency cap"
```

---

## Task 5: Tavily Image Extraction

**Files:**
- Create: `collect_research_assets/tavily.py`
- Create: `tests/test_tavily.py`
- Create: `tests/fixtures/sample_tavily_results.json`

- [ ] **Step 1: Write failing tests + fixture**

`tests/fixtures/sample_tavily_results.json`:
```json
{
  "query": "DeepSeek V4",
  "answer": "...",
  "results": [
    {"title": "DeepSeek V4 Release", "url": "https://example.com/article1", "content": "..."},
    {"title": "Benchmark", "url": "https://example.com/article2", "content": "..."}
  ],
  "images": [
    "https://example.com/img1.jpg",
    "https://example.com/static/logo/brand.png",
    "https://example.com/img2.png"
  ]
}
```

`tests/test_tavily.py`:
```python
import json
from pathlib import Path
from collect_research_assets.tavily import extract_image_urls

def test_extract_filters_skipped(tmp_path):
    fixture = json.loads(
        (Path(__file__).parent / "fixtures" / "sample_tavily_results.json").read_text()
    )
    urls = extract_image_urls(fixture)
    assert "https://example.com/img1.jpg" in urls
    assert "https://example.com/img2.png" in urls
    assert "https://example.com/static/logo/brand.png" not in urls

def test_extract_handles_missing_key():
    assert extract_image_urls({"results": []}) == []

def test_extract_handles_empty():
    assert extract_image_urls({"images": []}) == []
```

- [ ] **Step 2: Run, verify fail**

- [ ] **Step 3: Implement**

```python
# collect_research_assets/tavily.py
from __future__ import annotations
from typing import Any
from .filters import is_acceptable_url


def extract_image_urls(tavily_results: dict[str, Any]) -> list[str]:
    raw = tavily_results.get("images") or []
    seen = set()
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
```

- [ ] **Step 4: Run, verify pass**

- [ ] **Step 5: Commit**

```bash
git commit -am "feat: add Tavily image URL extraction"
```

---

## Task 6: Article HTML Scraper

**Files:**
- Create: `collect_research_assets/article.py`
- Create: `tests/test_article.py`
- Create: `tests/fixtures/sample_article.html`

- [ ] **Step 1: Write failing tests + fixture**

`tests/fixtures/sample_article.html`:
```html
<html><body>
  <article>
    <h1>Title</h1>
    <img src="https://example.com/photo1.jpg" alt="hero">
    <img src="https://example.com/static/icons/share.png" alt="share">
    <img src="data:image/png;base64,abc" alt="inline">
    <video src="https://example.com/clip.mp4"></video>
  </article>
</body></html>
```

`tests/test_article.py`:
```python
from pathlib import Path
from collect_research_assets.article import extract_media_from_html, extract_title_from_html

def test_extract_images_and_videos():
    html = (Path(__file__).parent / "fixtures" / "sample_article.html").read_text()
    media = extract_media_from_html(html, page_url="https://example.com/article")
    urls = [m["url"] for m in media]
    assert "https://example.com/photo1.jpg" in urls
    assert "https://example.com/clip.mp4" in urls
    assert "https://example.com/static/icons/share.png" not in urls
    assert all(not u.startswith("data:") for u in urls)

def test_alt_text_preserved():
    html = (Path(__file__).parent / "fixtures" / "sample_article.html").read_text()
    media = extract_media_from_html(html, page_url="https://example.com/article")
    photo = next(m for m in media if m["url"].endswith("photo1.jpg"))
    assert photo["alt"] == "hero"
    assert photo["type"] == "image"

def test_relative_url_resolved():
    html = '<img src="/relative.jpg">'
    media = extract_media_from_html(html, page_url="https://example.com/sub/page")
    assert media[0]["url"] == "https://example.com/relative.jpg"

def test_extract_title():
    html = "<html><head><title>My Article</title></head><body></body></html>"
    assert extract_title_from_html(html) == "My Article"

def test_extract_title_missing():
    assert extract_title_from_html("<html></html>") == ""
```

- [ ] **Step 2: Run, verify fail**

- [ ] **Step 3: Implement (aiohttp direct, no defuddle dependency)**

We fetch HTML directly with `aiohttp` rather than going through `defuddle` because (a) defuddle's `--json` schema is undocumented and varies, and (b) defuddle strips clutter — but page-level images we want to filter ourselves are sometimes in that "clutter". Direct HTML gives us deterministic input.

```python
# collect_research_assets/article.py
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
    soup = BeautifulSoup(html, "html.parser")
    if soup.title and soup.title.string:
        return soup.title.string.strip()
    return ""


async def fetch_article(
    session: aiohttp.ClientSession, page_url: str
) -> tuple[str, str] | None:
    """Returns (html, title) or None on failure. Never raises."""
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
```

- [ ] **Step 4: Run, verify pass**

- [ ] **Step 5: Commit**

```bash
git commit -am "feat: add article HTML media extraction"
```

---

## Task 7: Pixabay Search

**Files:**
- Create: `collect_research_assets/pixabay.py`
- Create: `tests/test_pixabay.py`
- Create: `tests/fixtures/sample_pixabay_response.json`

- [ ] **Step 1: Write failing tests + fixture**

`tests/fixtures/sample_pixabay_response.json`:
```json
{
  "total": 100,
  "hits": [
    {
      "id": 12345,
      "pageURL": "https://pixabay.com/photos/12345/",
      "tags": "robot, ai, technology",
      "imageWidth": 1920,
      "imageHeight": 1080,
      "largeImageURL": "https://cdn.pixabay.com/photo/12345_1280.jpg",
      "user": "Alice"
    }
  ]
}
```

`tests/test_pixabay.py`:
```python
import json
import pytest
from pathlib import Path
from unittest.mock import AsyncMock, MagicMock
from collect_research_assets.pixabay import (
    parse_image_hits, parse_video_hits, build_image_search_params, build_video_search_params,
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
```

- [ ] **Step 2: Run, verify fail**

- [ ] **Step 3: Implement**

```python
# collect_research_assets/pixabay.py
from __future__ import annotations
from typing import Any
import aiohttp

PIXABAY_IMAGE_URL = "https://pixabay.com/api/"
PIXABAY_VIDEO_URL = "https://pixabay.com/api/videos/"


def build_image_search_params(api_key: str, query: str, per_page: int = 3) -> dict[str, Any]:
    return {
        "key": api_key,
        "q": query,
        "image_type": "photo",
        "orientation": "all",
        "per_page": per_page,
        "safesearch": "true",
    }


def build_video_search_params(api_key: str, query: str, per_page: int = 2) -> dict[str, Any]:
    return {
        "key": api_key,
        "q": query,
        "orientation": "vertical",
        "per_page": per_page,
        "safesearch": "true",
    }


def parse_image_hits(response: dict[str, Any]) -> list[dict[str, Any]]:
    out = []
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
    out = []
    for hit in response.get("hits", []):
        videos = hit.get("videos", {})
        # Prefer "medium" quality; fall back to "large", "small"
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


RATELIMIT_BACKOFF_SECONDS = 60
RATELIMIT_MAX_RETRIES = 3


async def _get_with_429_backoff(
    session: aiohttp.ClientSession, url: str, params: dict[str, Any]
) -> dict[str, Any] | None:
    """GET with 60s backoff on HTTP 429. Returns parsed JSON or None."""
    import asyncio
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
    data = await _get_with_429_backoff(
        session, PIXABAY_IMAGE_URL, build_image_search_params(api_key, query, per_page)
    )
    return parse_image_hits(data) if data else []


async def search_videos(
    session: aiohttp.ClientSession, api_key: str, query: str, per_page: int = 2
) -> list[dict[str, Any]]:
    data = await _get_with_429_backoff(
        session, PIXABAY_VIDEO_URL, build_video_search_params(api_key, query, per_page)
    )
    return parse_video_hits(data) if data else []
```

- [ ] **Step 4: Run, verify pass**

- [ ] **Step 5: Commit**

```bash
git commit -am "feat: add Pixabay image and video search"
```

---

## Task 8: Keyword Cache + LLM Extraction

**Files:**
- Create: `collect_research_assets/keywords.py`
- Create: `tests/test_keywords.py`

- [ ] **Step 1: Write failing tests**

```python
# tests/test_keywords.py
from pathlib import Path
from collect_research_assets.keywords import (
    read_cached_keywords, append_keywords_section, parse_llm_response,
)

def test_read_cached_keywords_present(tmp_path):
    md = tmp_path / "research.md"
    md.write_text("""# Research

## 视觉素材英文关键词
- AI model
- neural network
- benchmark

## 其他章节
""")
    assert read_cached_keywords(md) == ["AI model", "neural network", "benchmark"]

def test_read_cached_keywords_absent(tmp_path):
    md = tmp_path / "research.md"
    md.write_text("# Research\n\n没有缓存\n")
    assert read_cached_keywords(md) is None

def test_append_keywords_idempotent(tmp_path):
    md = tmp_path / "research.md"
    md.write_text("# Research\n")
    append_keywords_section(md, ["x", "y"])
    append_keywords_section(md, ["x", "y"])  # second call no-op
    content = md.read_text()
    assert content.count("## 视觉素材英文关键词") == 1

def test_parse_llm_response_csv():
    assert parse_llm_response("AI model, neural network, robot") == ["AI model", "neural network", "robot"]

def test_parse_llm_response_strips_quotes():
    assert parse_llm_response('"AI model", "robot"') == ["AI model", "robot"]
```

- [ ] **Step 2: Run, verify fail**

- [ ] **Step 3: Implement**

```python
# collect_research_assets/keywords.py
from __future__ import annotations
import re
from pathlib import Path

SECTION_HEADER = "## 视觉素材英文关键词"


def read_cached_keywords(research_md: Path) -> list[str] | None:
    if not research_md.exists():
        return None
    text = research_md.read_text(encoding="utf-8")
    match = re.search(rf"{re.escape(SECTION_HEADER)}\s*\n((?:- .+\n?)+)", text)
    if not match:
        return None
    lines = match.group(1).strip().splitlines()
    return [ln[2:].strip() for ln in lines if ln.startswith("- ")]


def append_keywords_section(research_md: Path, keywords: list[str]) -> None:
    text = research_md.read_text(encoding="utf-8") if research_md.exists() else ""
    if SECTION_HEADER in text:
        return
    block = f"\n\n{SECTION_HEADER}\n" + "\n".join(f"- {k}" for k in keywords) + "\n"
    research_md.write_text(text + block, encoding="utf-8")


def parse_llm_response(text: str) -> list[str]:
    cleaned = text.strip().strip('"\'')
    parts = [p.strip().strip('"\'') for p in cleaned.split(",")]
    return [p for p in parts if p]
```

LLM extraction is **invoked from `orchestrator.py`** using whichever Claude/LLM tool is available at runtime. The skill SKILL.md will use the existing pattern (in-conversation LLM call), not a Python-side API. The `keywords.py` module only handles cache and parsing.

- [ ] **Step 4: Run, verify pass**

- [ ] **Step 5: Commit**

```bash
git commit -am "feat: add keyword cache and LLM response parsing"
```

---

## Task 9: research.md Visual Section Appender

**Files:**
- Create: `collect_research_assets/research_md.py`
- Create: `tests/test_research_md.py`

- [ ] **Step 1: Write failing tests**

```python
# tests/test_research_md.py
from pathlib import Path
from collect_research_assets.research_md import append_visual_section
from collect_research_assets.manifest import Manifest

def test_append_visual_section(tmp_path):
    md = tmp_path / "research.md"
    md.write_text("# Research\n\n## 核心发现\n- ...\n")
    manifest = Manifest(
        topic="t",
        english_keywords=["x"],
        items=[
            {"id": "tavily-001", "category": "reference", "type": "image",
             "page_url": "https://e.com/a", "page_title": "Article",
             "alt": "hero", "local_path": "research/reference/tavily-001.jpg"},
            {"id": "pixabay-img-001", "category": "stock", "type": "image",
             "tags": ["AI", "robot"], "page_url": "https://pixabay.com/p/1/",
             "local_path": "research/stock/pixabay-img-001.jpg"},
        ],
        skipped=[{"url": "x", "reason": "too small"}],
    )
    append_visual_section(md, manifest)
    text = md.read_text()
    assert "## 视觉素材清单" in text
    assert "tavily-001.jpg" in text
    assert "pixabay-img-001.jpg" in text
    assert "共 1 项被跳过" in text

def test_append_idempotent(tmp_path):
    md = tmp_path / "research.md"
    md.write_text("# Research\n")
    manifest = Manifest(topic="t", english_keywords=[], items=[], skipped=[])
    append_visual_section(md, manifest)
    append_visual_section(md, manifest)
    assert md.read_text().count("## 视觉素材清单") == 1
```

- [ ] **Step 2: Run, verify fail**

- [ ] **Step 3: Implement**

```python
# collect_research_assets/research_md.py
from __future__ import annotations
from pathlib import Path
from .manifest import Manifest

SECTION_HEADER = "## 视觉素材清单"


def append_visual_section(research_md: Path, manifest: Manifest) -> None:
    text = research_md.read_text(encoding="utf-8") if research_md.exists() else ""
    if SECTION_HEADER in text:
        return

    refs = [it for it in manifest.items if it.get("category") == "reference"]
    stocks = [it for it in manifest.items if it.get("category") == "stock"]

    lines = [
        "",
        SECTION_HEADER,
        "",
        "> 已下载到 `assets/research/`，详见 `manifest.json`",
        "",
        "### 参考素材 (`research/reference/` — 外部版权，仅作脚本写作参考)",
    ]
    if refs:
        for it in refs:
            local = it["local_path"].rsplit("/", 1)[-1]
            page = it.get("page_url", "")
            title = it.get("page_title", page or "来源页")
            alt = it.get("alt") or ""
            extra = f" — alt: \"{alt}\"" if alt else ""
            lines.append(f"- `{local}`{extra} — [{title}]({page})")
    else:
        lines.append("- (无)")

    lines += ["", "### 可用素材 (`research/stock/` — Pixabay 免费可商用)"]
    if stocks:
        for it in stocks:
            local = it["local_path"].rsplit("/", 1)[-1]
            tags = ", ".join(it.get("tags", []))
            page = it.get("page_url", "")
            lines.append(f"- `{local}` — tags: {tags} — [Pixabay 页面]({page})")
    else:
        lines.append("- (无)")

    lines += ["", "### 跳过项", f"- 共 {len(manifest.skipped)} 项被跳过。详见 `manifest.json`", ""]

    research_md.write_text(text.rstrip() + "\n" + "\n".join(lines) + "\n", encoding="utf-8")
```

- [ ] **Step 4: Run, verify pass**

- [ ] **Step 5: Commit**

```bash
git commit -am "feat: append visual asset section to research.md"
```

---

## Task 10: Orchestrator + CLI Entry

**Files:**
- Create: `collect_research_assets/orchestrator.py`
- Create: `collect_research_assets/__main__.py`
- Create: `tests/test_orchestrator.py`

- [ ] **Step 1: Write end-to-end test (mocked sources)**

```python
# tests/test_orchestrator.py
import json
import pytest
from pathlib import Path
from unittest.mock import patch, AsyncMock
from collect_research_assets.orchestrator import run

@pytest.mark.asyncio
async def test_run_creates_manifest(tmp_path, monkeypatch):
    project_dir = tmp_path / "projects" / "2026-05-03-test"
    project_dir.mkdir(parents=True)
    research_md = project_dir / "research.md"
    research_md.write_text("""# Research

## 核心发现
- DeepSeek V4 released

## 视觉素材英文关键词
- AI model
- robot
""")

    tavily_json = tmp_path / "tavily.json"
    tavily_json.write_text(json.dumps({
        "results": [],
        "images": ["https://example.com/img1.jpg"]
    }))

    monkeypatch.setenv("PIXABAY_API_KEY", "fake-key")

    with patch("collect_research_assets.orchestrator.search_images", new=AsyncMock(return_value=[])), \
         patch("collect_research_assets.orchestrator.search_videos", new=AsyncMock(return_value=[])), \
         patch("collect_research_assets.orchestrator.fetch_article", new=AsyncMock(return_value=None)), \
         patch("collect_research_assets.orchestrator.download_one", new=AsyncMock(return_value=True)):
        await run(
            project_dir=project_dir,
            research_md=research_md,
            tavily_results_json=tavily_json,
            refresh=False,
        )

    manifest_path = project_dir / "assets" / "research" / "manifest.json"
    assert manifest_path.exists()
    data = json.loads(manifest_path.read_text())
    assert data["topic"]
    assert data["english_keywords"] == ["AI model", "robot"]


@pytest.mark.asyncio
async def test_idempotent_skip(tmp_path, monkeypatch):
    project_dir = tmp_path / "projects" / "2026-05-03-test"
    (project_dir / "assets" / "research").mkdir(parents=True)
    manifest_path = project_dir / "assets" / "research" / "manifest.json"
    manifest_path.write_text('{"topic":"x","english_keywords":[],"items":[],"skipped":[],"limits":{},"stats":{}, "generated_at":"2026-01-01T00:00:00+00:00"}')
    research_md = project_dir / "research.md"
    research_md.write_text("# r\n## 视觉素材英文关键词\n- x\n")
    tavily_json = tmp_path / "tavily.json"
    tavily_json.write_text("{}")

    with patch("collect_research_assets.orchestrator.download_one", new=AsyncMock(return_value=True)) as dl:
        await run(project_dir, research_md, tavily_json, refresh=False)
        dl.assert_not_called()


@pytest.mark.asyncio
async def test_refresh_archives_old_manifest_and_cleans_dirs(tmp_path, monkeypatch):
    project_dir = tmp_path / "projects" / "2026-05-03-test"
    research_dir = project_dir / "assets" / "research"
    (research_dir / "reference").mkdir(parents=True)
    (research_dir / "stock").mkdir()
    (research_dir / "manifest.json").write_text('{"topic":"x","english_keywords":[],"items":[],"skipped":[],"limits":{},"stats":{},"generated_at":"2026-01-01T00:00:00+00:00"}')
    (research_dir / "reference" / "old.jpg").write_bytes(b"old")
    research_md = project_dir / "research.md"
    research_md.write_text("# r\n")
    tavily_json = tmp_path / "tavily.json"
    tavily_json.write_text("{}")

    with patch("collect_research_assets.orchestrator.search_images", new=AsyncMock(return_value=[])), \
         patch("collect_research_assets.orchestrator.search_videos", new=AsyncMock(return_value=[])), \
         patch("collect_research_assets.orchestrator.fetch_article", new=AsyncMock(return_value=None)):
        await run(project_dir, research_md, tavily_json, refresh=True)

    # Old manifest archived
    archives = list(research_dir.glob("manifest.*.bak.json"))
    assert len(archives) == 1
    # Old asset gone
    assert not (research_dir / "reference" / "old.jpg").exists()
    # New manifest written
    assert (research_dir / "manifest.json").exists()


@pytest.mark.asyncio
async def test_corrupt_manifest_archived_and_rerun(tmp_path):
    project_dir = tmp_path / "projects" / "2026-05-03-test"
    research_dir = project_dir / "assets" / "research"
    research_dir.mkdir(parents=True)
    (research_dir / "manifest.json").write_text("not valid json {{{")
    research_md = project_dir / "research.md"
    research_md.write_text("# r\n")
    tavily_json = tmp_path / "tavily.json"
    tavily_json.write_text("{}")

    with patch("collect_research_assets.orchestrator.search_images", new=AsyncMock(return_value=[])), \
         patch("collect_research_assets.orchestrator.search_videos", new=AsyncMock(return_value=[])), \
         patch("collect_research_assets.orchestrator.fetch_article", new=AsyncMock(return_value=None)):
        await run(project_dir, research_md, tavily_json, refresh=False)

    archives = list(research_dir.glob("manifest.*.bak.json"))
    assert len(archives) == 1


@pytest.mark.asyncio
async def test_max_reference_cap_enforced(tmp_path, monkeypatch):
    """Tavily returns 100 images, only LIMITS['max_reference'] (50) candidates produced."""
    project_dir = tmp_path / "projects" / "2026-05-03-test"
    project_dir.mkdir(parents=True)
    research_md = project_dir / "research.md"
    research_md.write_text("# r\n## 视觉素材英文关键词\n- x\n")

    images = [f"https://host{i}.example.com/photo.jpg" for i in range(100)]
    tavily_json = tmp_path / "tavily.json"
    tavily_json.write_text(json.dumps({"results": [], "images": images}))

    monkeypatch.delenv("PIXABAY_API_KEY", raising=False)

    captured_jobs: list = []

    async def fake_download_all(session, jobs, concurrency=10):
        captured_jobs.extend(jobs)
        return [True] * len(jobs)

    with patch("collect_research_assets.orchestrator.download_all", new=fake_download_all), \
         patch("collect_research_assets.orchestrator.fetch_article", new=AsyncMock(return_value=None)), \
         patch("collect_research_assets.orchestrator.Image") as mock_image:
        # Mock PIL: pretend every image is 800x800
        mock_image.open.return_value.__enter__.return_value.size = (800, 800)
        await run(project_dir, research_md, tavily_json, refresh=False)

    # 50 cap (each on a unique host, so domain quota does not interfere)
    assert len(captured_jobs) == 50


@pytest.mark.asyncio
async def test_domain_quota_caps_per_host(tmp_path, monkeypatch):
    """10 images from one domain, only 5 (DEFAULT_DOMAIN_CAP) accepted."""
    project_dir = tmp_path / "projects" / "2026-05-03-test"
    project_dir.mkdir(parents=True)
    research_md = project_dir / "research.md"
    research_md.write_text("# r\n")

    images = [f"https://same-host.example.com/photo{i}.jpg" for i in range(10)]
    tavily_json = tmp_path / "tavily.json"
    tavily_json.write_text(json.dumps({"results": [], "images": images}))

    monkeypatch.delenv("PIXABAY_API_KEY", raising=False)

    captured_jobs: list = []

    async def fake_download_all(session, jobs, concurrency=10):
        captured_jobs.extend(jobs)
        return [True] * len(jobs)

    with patch("collect_research_assets.orchestrator.download_all", new=fake_download_all), \
         patch("collect_research_assets.orchestrator.fetch_article", new=AsyncMock(return_value=None)), \
         patch("collect_research_assets.orchestrator.Image") as mock_image:
        mock_image.open.return_value.__enter__.return_value.size = (800, 800)
        await run(project_dir, research_md, tavily_json, refresh=False)

    assert len(captured_jobs) == 5
```

- [ ] **Step 2: Run, verify fail**

- [ ] **Step 3: Implement orchestrator**

```python
# collect_research_assets/orchestrator.py
from __future__ import annotations
import asyncio
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
    DEFAULT_DOMAIN_CAP, exceeds_domain_quota, is_acceptable_image_size, normalize_host,
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
            print(f"✅ Manifest exists ({s['reference_count']} ref + {s['stock_count']} stock). Skip.")
            return
        except (json.JSONDecodeError, KeyError):
            # Corrupt manifest — archive and proceed as if --refresh
            print(f"⚠️  Manifest corrupt; archiving and re-running.")
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

    # ── Source 1: Tavily images ──
    # Tavily images are not tied to a specific article, so page_url and page_title
    # are best-effort empty (Tavily API does not currently expose per-image attribution)
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
                "license": "external — research-reference only",
            },
        })

    # ── Source 2: Article HTML (fetched directly with aiohttp; no defuddle dependency) ──
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
                    "license": "external — research-reference only",
                },
            })

    # ── Source 3: Pixabay ──
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
    print(f"📦 已下载: {s['reference_count']} reference + {s['stock_count']} stock ({s['total_size_mb']} MB), 跳过 {s['skipped']}")
```

```python
# collect_research_assets/__main__.py
import argparse
import asyncio
from pathlib import Path
from dotenv import load_dotenv
from .orchestrator import run

PROJECT_ROOT = Path(__file__).resolve().parents[5]


def main() -> None:
    load_dotenv(PROJECT_ROOT / ".env")
    parser = argparse.ArgumentParser(prog="collect-research-assets")
    parser.add_argument("--slug", required=True)
    parser.add_argument("--research-md", required=True, type=Path)
    parser.add_argument("--tavily-results-json", required=True, type=Path)
    parser.add_argument("--refresh", action="store_true")
    args = parser.parse_args()

    project_dir = next(
        (d for d in (PROJECT_ROOT / "projects").iterdir() if args.slug in d.name),
        None,
    )
    if not project_dir:
        raise SystemExit(f"project not found for slug: {args.slug}")

    asyncio.run(run(project_dir, args.research_md, args.tavily_results_json, args.refresh))


if __name__ == "__main__":
    main()
```

- [ ] **Step 4: Run integration test, verify pass**

Run: `python3 -m pytest tests/test_orchestrator.py -v`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git commit -am "feat: orchestrator + CLI entry for research-asset collection"
```

---

## Task 11: Modify `/video-script` SKILL.md

**Files:**
- Modify: `.claude/skills/video-script/SKILL.md`

- [ ] **Step 1: Read current research phase section**

Run: `Read .claude/skills/video-script/SKILL.md offset=20 limit=120`

Identify where research summary is presented (current step 4 in "How This Skill Works"). Insert new step 5: collect-research-assets.

- [ ] **Step 2: Edit SKILL.md to add the new step**

In "How This Skill Works" list, change:

```
4. Present research summary to user for review and confirmation
5. Analyze the idea ...
```

To:

```
4. Present research summary to user for review and confirmation
5. **Collect research assets**: Extract English keywords (LLM, cached to research.md), invoke collect-research-assets script to download images/videos from Tavily/articles/Pixabay into `projects/<slug>/assets/research/`. Append "## 视觉素材清单" to research.md. Failure here does NOT block subsequent steps.
6. Analyze the idea (informed by research) and determine if it has a clear angle
7. ...
```

Then add a new section after "## Research Phase":

```markdown
## Asset Collection (after research summary)

After research summary is generated and before angle detection, gather visual materials.

### Step 1: When invoking `tavily-search` skill, request images

For every Tavily search done in this skill, pass `include_images=True`. Example:

\`\`\`python
results = client.search(query, max_results=5, include_images=True)
# results["images"] is now a list of image URLs
\`\`\`

### Step 2: Extract English keywords (one-shot LLM call)

If `research.md` does NOT contain a `## 视觉素材英文关键词` section, generate one:

Prompt yourself:

> Extract 3–5 concrete, visual English nouns/concepts from this research summary. Return as comma-separated single-line. No prose, no quotes. Concrete and visual (good: "neural network, robot, server room"; bad: "innovation, future").

Then use the Edit/Write tool to append this section to `research.md`:

\`\`\`markdown
## 视觉素材英文关键词
- AI model
- neural network
- benchmark
\`\`\`

### Step 3: Serialize Tavily results to a temp file

Use the **Write tool** to save the Tavily search results to `/tmp/tavily-<slug>.json` with this exact shape:

\`\`\`json
{
  "results": [
    {"title": "...", "url": "https://...", "content": "..."},
    ...
  ],
  "images": [
    "https://example.com/img1.jpg",
    "https://example.com/img2.png"
  ]
}
\`\`\`

If you ran multiple Tavily queries during research, **merge** them: union the `images` arrays (deduplicate), and concatenate the `results` arrays. The script reads the `results[].url` field for top-3 article HTML scraping and the `images` array for direct image candidates.

### Step 4: Invoke the collection script

You MUST `cd` into the script directory first (the script uses `python3 -m`, which requires the package directory on `sys.path`):

\`\`\`bash
cd .claude/skills/video-script/scripts && python3 -m collect_research_assets \\
  --slug <YYYY-MM-DD-<slug>> \\
  --research-md ../../../../projects/<YYYY-MM-DD-<slug>>/research.md \\
  --tavily-results-json /tmp/tavily-<slug>.json
\`\`\`

Note paths to `--research-md` are relative to the `cd`'d directory. The script:
- Downloads to `projects/<slug>/assets/research/{reference,stock}/`
- Writes `manifest.json`
- Appends "## 视觉素材清单" to research.md
- Prints summary: `📦 已下载: X reference + Y stock (Z.Z MB), 跳过 N`

### Step 5: If script fails, continue gracefully

If the script exits non-zero or prints an error, **do not block**. Print a warning and proceed to angle detection.

### Asset reuse during script writing

When generating shots in the script, you can reference materials in `assets/research/`:
- `assets/research/stock/*` — Pixabay-licensed, **safe to use as `固定图片` shot 画面**
- `assets/research/reference/*` — external license, **only as inspiration for `画面` description; do NOT mark as `固定图片`**
```

- [ ] **Step 3: Verify markdown is valid by re-reading**

Run: `Read .claude/skills/video-script/SKILL.md`. Verify formatting.

- [ ] **Step 4: Commit**

```bash
git commit -am "docs: integrate collect-research-assets step into video-script SKILL.md"
```

---

## Task 12: Manual Integration Test

**Files:** None (manual verification)

- [ ] **Step 1: Pick a fresh topic and run `/video-script`**

In a new conversation, run:
```
/video-script Claude Sonnet 4.6 编程能力对比 Opus
```

Walk through research → confirm summary → collection → asset count printed.

- [ ] **Step 2: Verify directory + manifest**

Run:
```bash
ls projects/$(ls projects | grep claude-sonnet | tail -1)/assets/research/
cat projects/.../assets/research/manifest.json | jq '.stats'
```

Expected: `reference/` and `stock/` populated, manifest.json valid, ≥ 5 reference + ≥ 3 stock items.

- [ ] **Step 3: Verify research.md updated**

Run: `Read projects/.../research.md` — confirm `## 视觉素材英文关键词` and `## 视觉素材清单` sections present.

- [ ] **Step 4: Verify idempotency**

Re-run the same `/video-script` command. The script should print "Manifest exists, skip" and not re-download.

- [ ] **Step 5: Spot-check filtering**

Manually inspect 3–5 random files in `reference/` and `stock/` — confirm none are obvious logos/avatars/icons.

- [ ] **Step 6: Document outcome and commit**

If all checks pass, no commit needed (this is verification only). If issues found, fix the relevant Task and re-run.

---

## Test Running Reference

All Python tests use `pytest`:

```bash
cd .claude/skills/video-script/scripts/
python3 -m pytest tests/ -v
```

Async tests need `pytest-asyncio`. Add to `pyproject.toml` or install ad-hoc:
```bash
pip install pytest pytest-asyncio aiohttp Pillow beautifulsoup4 python-dotenv
```

---

## v1 Scope Notes

- **200MB total-disk quota**: enforced approximately via the `max_reference=50` + `max_stock=30` count caps (≤ 80 items × ~2–5MB ≈ 160–400MB worst case). Post-download size enforcement (stop when running total ≥ 200MB) is **deferred to v2**. Manifest stats include `total_size_mb` so users can audit.
- **Defuddle dependency**: removed from this plan. We fetch HTML directly via aiohttp, which avoids the undocumented `defuddle --json` schema. Defuddle remains available for other skills (e.g., text-content extraction).
- **Direct user URLs (`--add-url`)**: deferred to v2 per spec.

## Definition of Done

- [ ] All 12 tasks committed
- [ ] All unit tests pass (`pytest tests/ -v`)
- [ ] Manual integration test on a real topic produces ≥ 10 reference + ≥ 5 stock items
- [ ] Re-running `/video-script` is idempotent
- [ ] `--refresh` archives old manifest as `manifest.<timestamp>.bak.json` and clears stale `reference/` + `stock/` files
- [ ] `manifest.json` validates against schema described in spec (including `page_title` populated for article items)
- [ ] No source failure (Tavily down, Pixabay down, page fetch fails) causes total failure — other sources still complete
- [ ] `research.md` contains both `## 视觉素材英文关键词` and `## 视觉素材清单` sections after a run
