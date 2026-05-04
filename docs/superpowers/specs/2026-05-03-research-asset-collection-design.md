# Research-Phase Asset Collection — Skill Design

## Summary

Extend `/video-script` with a new step `collect-research-assets` that runs after research summary is generated. The step collects images and videos from four sources in parallel — Tavily image search, top-N article HTML scraping, Pixabay theme search, and direct URL pickups noted by the user — and saves them into `projects/<slug>/assets/research/`. The collected media is split into two licensing buckets (`reference/` for external-licensed inspiration, `stock/` for Pixabay-licensed reusable media), and a `manifest.json` records full attribution. Downstream skills (`/video-script` writing, `/asset-pack`, `/remotion-video`) can reuse these assets.

## Problem

Today's research phase is text-only. Two pain points:

1. **Script writing has no visual grounding** — the writer sees article excerpts but no actual screenshots, product imagery, or topic-relevant photography. Visual decisions per shot (`画面` field) are imagined cold.
2. **`/asset-pack` runs too late** — it kicks in after `/script-review`, by which time visual decisions have already been made without seeing what's actually available. It also only knows Pixabay, missing topic-specific assets that show up inside research articles (official screenshots, benchmark charts, product photos).

Existing `/asset-pack` (designed in `2026-04-30-asset-pack-skill-design.md`) stays — it does shot-precision matching after script lock. This new step is **complementary**: it gathers a broad pool during research that informs script writing AND can be reused by `/asset-pack` and `/remotion-video`.

## Design Decisions

- **Run inside `/video-script`, not a separate skill** — research and asset gathering share input (search queries, article URLs, theme keywords). Splitting them adds friction and doubles the IO. A dedicated `/research-assets` skill is over-engineering.
- **Four sources, all async parallel** — Tavily images, article HTML, Pixabay, direct user URLs. No source is required; every source can fail gracefully.
- **Two buckets by license**:
  - `assets/research/reference/` — externally sourced (Tavily images, article `<img>`); reference-only, **not for direct video use**
  - `assets/research/stock/` — Pixabay only; freely usable in final video
- **Re-runnable, idempotent** — if `manifest.json` exists and is non-empty, skip download phase entirely unless `--refresh-assets` is passed.
- **Non-blocking** — failure of asset collection MUST NOT block research summary or script generation. Worst case: `manifest.json` is empty and skill prints a warning.
- **Reuse Tavily key, no new API surface** — use `tavily-search` skill's existing `TAVILY_API_KEY` and pass `include_images=True`. Use `aiohttp` + `beautifulsoup4` for article HTML scraping. Use `PIXABAY_API_KEY` already in `.env`.
- **Cap everything** — max 50 reference + 30 stock per project; max 200MB total disk; max 10 concurrent downloads. Refuse to grow unbounded.
- **English keyword extraction is one-shot** — take the research summary text, run a single LLM extraction pass to produce 3–5 English nouns/concepts, cache to `research.md`. Re-runs reuse the cache.
- **Position in pipeline**: extension to existing `/video-script` research phase, runs after summary is presented but before user confirmation gate. Asset count is included in the summary so user can see how much was collected before approving.

---

## Pipeline Position

```
/video-script
  ├── 1. Tavily search (text + include_images=True) ─┐
  ├── 2. Generate research.md summary               ─┘── existing
  ├── 3. collect-research-assets                     ── NEW
  │     ├── Tavily image URLs (from step 1)
  │     ├── Article HTML <img>/<video> scrape (aiohttp + bs4, parallel)
  │     ├── Pixabay search by keywords (parallel)
  │     └── Async download → assets/research/{reference,stock}/
  ├── 4. Append "## 视觉素材清单" to research.md
  ├── 5. Present summary + asset count to user
  └── 6. Continue to angle detection
```

---

## Data Sources

| Source | Tool | Bucket | License Tag | Why |
|---|---|---|---|---|
| Tavily `include_images=True` | tavily-search Python client | reference/ | `external — research-reference only` | High signal: image URLs already filtered by Tavily for query relevance |
| Article HTML `<img>` `<video>` | `aiohttp` direct GET + `beautifulsoup4` | reference/ | `external — research-reference only` | Topic-specific: official screenshots, benchmark charts, product photos. We use aiohttp directly (not `defuddle`) to keep the HTML schema deterministic — defuddle's `--json` shape is undocumented and it strips clutter we sometimes want |
| Pixabay search | aiohttp direct API call | stock/ | `Pixabay Content License` | Free B-roll, atmospheric shots, generic stock |
| Direct URLs (future) | `--add-url` CLI flag | reference/ | `external — research-reference only` | User can manually paste URLs when they spot something during conversation |

The "direct URLs" path is **deferred to v2**. v1 ships only sources 1–3.

---

## Directory Layout

```
projects/<YYYY-MM-DD-<slug>>/
├── research.md                            # MODIFIED — gains "## 视觉素材清单" section
└── assets/
    └── research/                          # NEW
        ├── reference/                     # external license, reference only
        │   ├── tavily-001.jpg
        │   ├── article-<host>-001.png
        │   └── ...
        ├── stock/                         # Pixabay, reusable
        │   ├── pixabay-img-001.jpg
        │   ├── pixabay-vid-001.mp4
        │   └── ...
        └── manifest.json
```

File-naming rules:

- `tavily-NNN.<ext>` — Tavily images, NNN = 001, 002, … (zero-padded, ordered by Tavily result rank)
- `article-<host>-NNN.<ext>` — `<host>` is the article's domain stripped of `www.` (e.g., `github.com`, `techcrunch.com`)
- `pixabay-img-NNN.<ext>` / `pixabay-vid-NNN.<ext>` — Pixabay results
- Extension preserved from source URL (`.jpg`, `.png`, `.webp`, `.mp4`)
- Conflicts resolved by NNN auto-increment; never overwrite

---

## `manifest.json` Schema

```json
{
  "generated_at": "2026-05-03T14:23:00+08:00",
  "topic": "DeepSeek V4 模型评测",
  "english_keywords": ["AI model", "neural network", "benchmark"],
  "limits": {
    "max_reference": 50,
    "max_stock": 30,
    "max_total_mb": 200
  },
  "stats": {
    "reference_count": 12,
    "stock_count": 8,
    "total_size_mb": 45.2,
    "tavily_count": 5,
    "article_count": 7,
    "pixabay_image_count": 6,
    "pixabay_video_count": 2,
    "skipped": 4
  },
  "items": [
    {
      "id": "tavily-001",
      "type": "image",
      "category": "reference",
      "source": "tavily",
      "source_url": "https://example.com/img.jpg",
      "page_url": "https://example.com/article",
      "page_title": "...",
      "local_path": "research/reference/tavily-001.jpg",
      "size_bytes": 234567,
      "width": 1920,
      "height": 1080,
      "license": "external — research-reference only"
    },
    {
      "id": "article-github.com-001",
      "type": "image",
      "category": "reference",
      "source": "article",
      "source_url": "https://github.com/.../benchmark.png",
      "page_url": "https://github.com/owner/repo",
      "page_title": "owner/repo",
      "alt": "benchmark chart",
      "local_path": "research/reference/article-github.com-001.png",
      "size_bytes": 156234,
      "width": 800,
      "height": 600,
      "license": "external — research-reference only"
    },
    {
      "id": "pixabay-img-001",
      "type": "image",
      "category": "stock",
      "source": "pixabay",
      "pixabay_id": 12345,
      "source_url": "https://cdn.pixabay.com/.../1234.jpg",
      "page_url": "https://pixabay.com/photos/12345/",
      "local_path": "research/stock/pixabay-img-001.jpg",
      "size_bytes": 567890,
      "width": 1920,
      "height": 1080,
      "credit": "Pixabay user XYZ",
      "tags": ["AI", "robot", "technology"],
      "license": "Pixabay Content License"
    }
  ],
  "skipped": [
    {"url": "https://...", "reason": "image too small (200x150)"},
    {"url": "https://...", "reason": "non-image content-type: text/html"},
    {"url": "https://...", "reason": "domain quota exceeded (>5)"}
  ]
}
```

---

## Filtering Heuristics

Applied per candidate URL **before** download (where possible) and per file **after** download:

### Pre-download (URL-level)
- Skip URLs ending in: `.svg`, `.gif` (animated GIFs are usually decorative)
- Skip URLs with path segments matching: `/icon`, `/logo`, `/avatar`, `/sprite`, `/emoji`, `/pixel`, `/tracking`, `/ad/`, `/ads/`
- Skip data URIs (`data:image/...`)
- Skip URLs without scheme `http(s)`
- Skip duplicate URLs (deduplicate per session)
- Per-domain cap: max 5 reference images per domain

### Post-download (file-level)
- Read image dimensions via Pillow (`PIL.Image.open(path).size`)
- Discard if width < 400 OR height < 400 (deletes file, records in `skipped`)
- For videos: check file size ≥ 100KB (avoid embed thumbnails masquerading as video)

### Pre-write (manifest-level)
- If reference count reaches 50, stop accepting reference candidates (Pixabay still proceeds)
- If stock count reaches 30, stop accepting stock candidates
- 200MB total disk usage: in v1, count caps (50 + 30) approximate this (≤ 80 items × ~2–5MB ≈ 160–400MB worst case). Post-download running-total enforcement is **deferred to v2**. Manifest's `stats.total_size_mb` lets users audit.

---

## Keyword Extraction

When the script does NOT yet have `english_keywords` cached in `research.md`:

1. Take the `## 核心发现` section of the research summary
2. Single LLM call (use the same provider chain as other skills — no new dependency):
   ```
   Extract 3–5 concrete, visual English nouns/concepts from this research summary.
   Return as comma-separated single-line. No prose, no quotes.
   Concrete and visual (good: "neural network, robot, server room"; bad: "innovation, future").

   Summary:
   <text>
   ```
3. Parse response → list of strings
4. Cache to `research.md` under a new section:
   ```markdown
   ## 视觉素材英文关键词
   - AI model
   - neural network
   - benchmark
   ```
5. Re-runs read this cache. Only re-extract if section is missing.

If LLM call fails: skip Pixabay phase entirely, print warning, continue with Tavily + article only.

---

## research.md Extension

After asset collection completes, append at the bottom:

```markdown
## 视觉素材清单

> 已下载到 `assets/research/`，详见 `manifest.json`

### 参考素材 (`research/reference/` — 外部版权，仅作脚本写作参考)
- `tavily-001.jpg` — [来源页面标题](page_url)
- `article-github.com-001.png` — alt: "benchmark chart" — [来源页面标题](page_url)
- ...

### 可用素材 (`research/stock/` — Pixabay 免费可商用)
- `pixabay-img-001.jpg` — tags: AI, robot, technology — [Pixabay 页面](page_url)
- `pixabay-vid-001.mp4` — tags: server, datacenter — [Pixabay 页面](page_url)
- ...

### 跳过项
- 共 4 项被跳过（尺寸过小 / 非图片内容 / 同源超额）。详见 manifest.json
```

---

## CLI Surface (script invoked by SKILL.md)

`collect_research_assets.py` — invoked by `/video-script` after research summary is generated.

```bash
python3 .claude/skills/video-script/scripts/collect_research_assets.py \
  --slug 2026-05-03-deepseek-v4 \
  --research-md projects/2026-05-03-deepseek-v4/research.md \
  --tavily-results-json /tmp/tavily-results.json \
  [--refresh]
```

Arguments:
- `--slug` — project slug (required, used to locate `projects/<slug>/`)
- `--research-md` — path to `research.md` (required, contains article URLs and keywords cache)
- `--tavily-results-json` — path to a temp file containing serialized Tavily results (the SKILL.md writes this from in-memory results before invoking the script)
- `--refresh` — force re-download even if `manifest.json` exists

Exit codes:
- `0` — success (manifest written)
- `0` — partial success (some sources failed, manifest still written, warning printed)
- `1` — fatal error (`.env` not found, write permission denied) — never blocks `/video-script` (skill catches and continues)

stdout: terminal-friendly summary table.

---

## Modifications to Existing Skills

| Skill | Change |
|---|---|
| `video-script/SKILL.md` | Add `collect-research-assets` step in research phase between summary generation and user confirmation. Document the new directory and how to read `assets/research/` when writing the script. |
| `asset-pack/SKILL.md` | (When `/asset-pack` lands) Add fallback: before tier-3 AI generation, try matching by keywords against `assets/research/stock/` and reuse if found. Out of scope for this spec. |
| `remotion-video/SKILL.md` | (Optional v2) Mention that shots can reference `staticFile('research-stock/<slug>/...')` if a research stock asset is desired as background. Out of scope for v1. |

v1 ships only the `video-script/SKILL.md` change.

---

## Error Handling

| Failure | Behavior |
|---|---|
| `TAVILY_API_KEY` missing | Skip Tavily images, continue with article + Pixabay; warn |
| `PIXABAY_API_KEY` missing | Skip Pixabay, continue with Tavily + article; warn |
| LLM keyword extraction fails | Skip Pixabay phase entirely; warn |
| Article URL 404/500 / non-HTML / timeout | Skip that article, continue with others |
| Pixabay 429 rate limited | Backoff 60s, retry 3×; if persistent, skip Pixabay |
| Single download fails | Log to manifest's `skipped` array, continue others |
| Disk quota (200MB) hit mid-run | Stop accepting new downloads, finalize manifest with what's done |
| Manifest write fails | Print error, exit 1, but never delete partial downloads |
| `--refresh` but `manifest.json` is corrupt | Archive as `manifest.<timestamp>.bak.json`, start fresh |
| Same script re-run without `--refresh`, manifest exists | Print summary of existing manifest, exit 0 (idempotent) |

---

## Testing Strategy

### Unit tests (`tests/test_collect_research_assets.py`)

- Filter heuristics: URL exclusion patterns, data-URI rejection, domain quota
- Image dimension check (mock PIL): reject < 400px, accept ≥ 400px
- Manifest serialization: required fields present, JSON parseable
- Filename generation: collision handling (NNN auto-increment)
- HTML image extraction: parse sample HTML with mixed `<img>` / `<video>` / inline SVG
- Tavily result parsing: handle missing `images` key (older API responses)
- Pixabay result parsing: handle empty `hits`
- Keyword extraction cache: read from `research.md`, fall through to LLM call

### Integration test (`tests/test_collect_research_assets_integration.py`)

- Run against a fixture: pre-downloaded HTML + recorded Pixabay JSON + Tavily JSON
- Verify directory created, manifest.json valid, expected counts
- Verify idempotency: second run without `--refresh` is no-op

### Manual test

- Run `/video-script` on a fresh topic, e.g., "Claude Sonnet 4.6 编程能力"
- Verify `assets/research/` populated, manifest reads correctly, research.md has visual section
- Visually inspect a sample of downloads to confirm filtering works (no logos/avatars)

---

## Out of Scope

- **Direct user URLs (`--add-url`)** — defer to v2
- **GitHub-specific README image extraction** — defer; defuddle's generic HTML scrape covers this
- **Video transcoding / dimension normalization** — store as-is
- **Auto-thumbnailing for browse UI** — manifest-only, no UI
- **Cross-project asset reuse / dedupe** — each project owns its copy
- **Modifying `/asset-pack` to consume research stock** — separate change once `/asset-pack` lands
- **Modifying `/remotion-video` to read research stock** — defer to v2
- **License compliance UI / audit** — manifest tags categories; user is responsible for downstream use

---

## Dependencies

- Existing: `TAVILY_API_KEY`, `PIXABAY_API_KEY` in `.env`
- New Python packages: `Pillow` (for dimension check), `aiohttp`, `beautifulsoup4`, `python-dotenv`
- Verify with: `python3 -c "import PIL, aiohttp, bs4, dotenv"`

---

## Success Criteria

- `/video-script` on a typical topic produces ≥ 10 reference images and ≥ 5 stock items
- Asset collection wall-clock time < 60s end-to-end on a 50Mbps connection
- Re-running `/video-script` without `--refresh` does not re-download
- `manifest.json` contains complete attribution for every item
- Filtering rejects ≥ 90% of logos/avatars/icons in real-world runs (manual sample)
- Total disk usage per project stays under 200MB
- Failure of any single source does not break the others
- Script writing phase visibly references `assets/research/` (verified by reading subsequent `script.md` and seeing `画面` fields aligned with downloaded materials)
