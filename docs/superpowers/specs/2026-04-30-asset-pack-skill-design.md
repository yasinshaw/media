# Asset Pack Skill — Pixabay Stock Media Collection

## Summary

Add a new skill `/asset-pack` that fetches stock images and videos from Pixabay for each shot in a script, falling back to AI image generation when search fails. Combined with `KenBurns` from the Animation Enhancement spec, this gives every shot a visual anchor that's more compelling than pure CSS gradients.

## Problem

Current videos rely almost entirely on Tailwind gradients + SVG diagrams. Real photographic or video B-roll is missing because:

1. **No collection skill exists** — creators must manually search and download per shot, which interrupts the writing flow.
2. **AI generation cost adds up** — every shot using `ai 背景图` runs Volcano Ark (paid). Pixabay is free for 95% of the cases.
3. **No structural keyword** — scripts don't carry English search keywords, so any tool would have to LLM-extract them at runtime, repeatedly, non-deterministically.

## Design Decisions

- **Pixabay over Pexels**: User has API key, 5000 req/hr limit (vs 200), images + videos in one API.
- **Run after `/script-review`, not before**: Script must be locked before spending search/download time.
- **Independent skill, also auto-suggested in pipeline**: `/asset-pack <slug>` can be re-run; `/script-review` completion message recommends it as the next step.
- **Structured keywords from `/video-script`**: Each shot carries `**素材关键词**: <english,csv>` produced by the script generator. `/asset-pack` reads these — no runtime LLM extraction (deterministic, re-runnable).
- **LLM fallback for old scripts**: When `**素材关键词**` field is missing, `/asset-pack` extracts keywords with a one-shot LLM pass and prompts the user to commit them back to the script.
- **Mixed media by shot role**: Hook/CTA prefer video (more punch); 核心 prefers image (more stable); 数据/对比 prefers image. Roles read from the `**角色**` field added in the Audio Enhancement spec.
- **Three-tier fallback**: Original keywords → simplified keywords (drop modifiers) → Volcano Ark AI generation. Always produces an asset.
- **Async parallel downloads**: All Pixabay fetches and downloads kicked off in parallel. No sequential waiting.

---

## Part 1: Pipeline Position

```
/video-script  →  /script-review  →  /asset-pack  →  /video-cover  →  /voiceover-tts  →  /remotion-video  →  /video-review  →  /douyin-publish
                                       ↑
                                NEW STEP HERE
```

`/script-review` completion message gains a line:
```
📦 Next: Run /asset-pack <slug> to fetch stock media for each shot
```

Users can skip `/asset-pack` entirely; `/remotion-video` falls back to gradients when `assets/stock/` is empty.

---

## Part 2: Script Format Extension

### `/video-script` adds the `**素材关键词**` field per shot

```markdown
### 镜头 1：标题亮相
**角色**: Hook
**素材关键词**: ai robot, neural network, futuristic technology
**镜头运动**: zoom-in
**口播**: ...
```

Generation rules:
- 2–4 English keywords per shot, comma-separated
- Concrete and visual (not abstract concepts: "innovation" → bad; "lightbulb on circuit board" → good)
- Match shot semantic, not just literal title
- Hook/CTA: visual hooks (cinematic shots, abstract motion). 核心/数据: literal subject.

### Backward compatibility

If a script lacks `**素材关键词**`, `/asset-pack` runs an LLM extraction pass:
1. Read each shot's title + 口播 + 字幕
2. Generate 2–4 English keywords per shot via Tavily-style prompt to a local LLM call
3. Print keywords to terminal for user review
4. Prompt: "Save these to script.md so future re-runs are deterministic? (Y/n)"
5. On Y, edit script.md in place, adding `**素材关键词**` to each shot

---

## Part 3: Skill Workflow

### Invocation
```
/asset-pack <slug>
/asset-pack <slug> --alts        # also download top 3 candidates per shot
/asset-pack <slug> --refresh     # re-download even if assets/stock/ exists
```

### Steps

1. **Locate script**: `projects/<YYYY-MM-DD-<slug>>/script.md`
2. **Parse keywords**: For each shot, read `**素材关键词**` (or run LLM extraction fallback)
3. **Determine media type per shot** (from `**角色**`):

   | Role | Preferred type | Fallback type |
   |------|---------------|----------------|
   | Hook | video | image |
   | 痛点 | image | video |
   | 核心 | image | video |
   | 数据 | image | (no fallback — abstract too hard) |
   | 金句 | image | video |
   | CTA | video | image |

4. **Search Pixabay** for each shot in parallel:
   - Build query: `keywords` joined with `+`
   - Filter: `orientation=vertical` for video, `orientation=all` for image
   - Sort: `popular`
   - Return top 1 (or top 3 if `--alts`)
5. **Fallback chain on empty results**:
   - Tier 1: original keywords
   - Tier 2: drop adjectives/modifiers (keep nouns) — e.g., "ai robot, neural network" → "robot, network"
   - Tier 3: Volcano Ark image generation with the original Chinese shot description
6. **Download in parallel**: All approved URLs downloaded concurrently to `assets/stock/`
7. **Generate manifest**: `assets/stock/manifest.json`
8. **Print summary**: Table of shot → media file → source → keywords used

### Pixabay API integration

Read `PIXABAY_API_KEY` from `.env` at project root.

```python
# Image search
GET https://pixabay.com/api/?key={key}&q={query}&image_type=photo&orientation=vertical&per_page=3

# Video search
GET https://pixabay.com/api/videos/?key={key}&q={query}&per_page=3
```

Respect rate limits (100 req/60s burst, 5000/hr). Skill batches all searches in parallel up to 50 concurrent — well within burst.

### File naming and directory layout

```
projects/<YYYY-MM-DD-<slug>>/
└── assets/
    └── stock/                          # NEW directory
        ├── shot1.mp4                   # primary asset (video for Hook)
        ├── shot1.alt1.mp4              # only with --alts
        ├── shot1.alt2.mp4
        ├── shot2.jpg                   # primary asset (image for 核心)
        ├── shot3.png                   # AI fallback (file extension preserved)
        └── manifest.json
```

`shot<N>.<ext>` — N is shot number (1-indexed). Extension preserved from source.

### `manifest.json` shape

```json
{
  "generated_at": "2026-04-30T12:00:00+08:00",
  "shots": [
    {
      "index": 1,
      "role": "Hook",
      "preferred_type": "video",
      "actual_type": "video",
      "primary": "shot1.mp4",
      "alternates": ["shot1.alt1.mp4", "shot1.alt2.mp4"],
      "source": "pixabay",
      "pixabay_id": 12345,
      "keywords_used": "ai robot, neural network",
      "tier": 1,
      "credit": "Pixabay user XYZ — https://pixabay.com/videos/12345/",
      "license": "Pixabay Content License"
    },
    {
      "index": 2,
      "role": "数据",
      "preferred_type": "image",
      "actual_type": "image",
      "primary": "shot2.png",
      "alternates": [],
      "source": "volcano-ark",
      "pixabay_id": null,
      "keywords_used": "中文场景描述（Volcano Ark 用中文）",
      "tier": 3,
      "credit": "AI-generated (Volcano Ark)",
      "license": "Generated content"
    }
  ]
}
```

---

## Part 4: Remotion Integration

### `/remotion-video` reads `assets/stock/manifest.json`

When generating a shot, check if `manifest.json` has an entry for this shot index:
- If yes: use `assets/stock/<primary>` as the background, wrapped in `<KenBurns>` (from Animation Enhancement spec)
- If no: fall back to existing gradient-only logic

### Asset linking

After `/remotion-video` generates the composition, link `projects/<slug>/assets/stock/` into `remotion/public/stock/<slug>/` so `staticFile()` resolves at render time:

```bash
mkdir -p remotion/public/stock
ln -sf "$(pwd)/projects/<YYYY-MM-DD-<slug>>/assets/stock" "remotion/public/stock/<slug>"
```

(Same pattern as the existing `audio/<slug>` symlink.)

### Shot code template (when stock asset exists)

```tsx
import { KenBurns } from '../../../components'
import { staticFile } from 'remotion'

const slug = '<slug>'
const stockFile = staticFile(`stock/${slug}/shot1.mp4`)

<CenteredStack background="..."  /* still pass theme color as overlay base */>
  <KenBurns
    src={stockFile}
    type="video"
    motion="zoom-in"
    duration={shotFrames}
  >
    {/* foreground text content */}
    <h1 style={{ ... }}>标题</h1>
  </KenBurns>
</CenteredStack>
```

(Note: This shot template integration assumes Animation Enhancement spec's `KenBurns` ships first. C depends on A.)

---

## Part 5: Skill Files

### New: `.claude/skills/asset-pack/SKILL.md`

Section structure:
- Description / when to use
- Pipeline position
- Invocation flags
- Workflow steps (mirroring Part 3)
- Pixabay API call format
- Fallback chain
- Manifest schema
- Error handling table
- Output format

### New: `.claude/skills/asset-pack/scripts/pixabay-fetch.{js|py}`

A standalone script the skill invokes. Decision: **Python** (matches existing `voiceover-tts` style; `tavily-search` is also Python; user's other tooling leans Python for API work).

```bash
python3 .claude/skills/asset-pack/scripts/pixabay_fetch.py \
  --slug 2026-04-30-example \
  --keywords-file projects/2026-04-30-example/script.md \
  --alts \
  --refresh
```

Internal flow: parse script → build search jobs → asyncio.gather all Pixabay searches → asyncio.gather all downloads → write manifest.

### Modifications to existing skills

| Skill | Change |
|-------|--------|
| `video-script/SKILL.md` | Add `**素材关键词**` to per-shot template (mandatory output) |
| `script-review/SKILL.md` | Add "Next: Run `/asset-pack <slug>`" to completion message |
| `remotion-video/SKILL.md` | Add "Stock Assets" section; teach the skill to read `manifest.json` and wrap assets in `<KenBurns>` |

---

## File Structure

```
.claude/skills/
└── asset-pack/                         # NEW skill
    ├── SKILL.md
    └── scripts/
        └── pixabay_fetch.py

projects/<slug>/
└── assets/
    └── stock/                          # NEW per-project
        ├── shot<N>.{mp4,jpg,png}
        ├── shot<N>.alt<M>.<ext>        # only with --alts
        └── manifest.json

remotion/public/
└── stock/                              # NEW shared
    └── <slug>/                         # symlinks per project
```

---

## Error Handling

| Failure | Behavior |
|---------|----------|
| `PIXABAY_API_KEY` missing in `.env` | Skill errors with clear message + link to https://pixabay.com/api/docs/ |
| `**素材关键词**` field missing for one or more shots | LLM extraction fallback runs, prompts user to commit |
| Pixabay API rate-limited (429) | Skill backs off 60s, retries; if persistent fails after 3 retries, falls to AI generation tier |
| All three tiers fail (no stock + AI fails) | Skill warns, leaves shot without stock asset; `/remotion-video` falls back to gradient |
| Download fails mid-way | Skill retries 3x with exponential backoff per file; persistently failed files marked in manifest with `error: true` |
| `--refresh` requested but `manifest.json` is from a different script structure | Skill warns and starts fresh, archives old manifest as `manifest.<timestamp>.json` |

---

## Testing Strategy

- **Unit tests**: Keyword parsing from script.md (regex robustness against variations); manifest serialization
- **Integration test**: Run `/asset-pack` against a known existing project (e.g., `2026-04-25-deepseek-v4`) with at least one shot per role; verify all roles get appropriate media types and the manifest is well-formed
- **Manual verification**: Re-render the test project with downloaded stock assets; confirm visuals are obviously richer than gradient-only baseline

---

## Out of Scope

- **Pexels integration** — Pixabay alone is sufficient for now
- **Unsplash integration** — same reason
- **Auto-cropping/aspect ratio fixing** — KenBurns handles aspect via `objectFit: cover`; assume Pixabay returns reasonable orientation
- **Audio asset fetching** — BGM/SFX library managed separately (in Audio Enhancement spec); `/asset-pack` is for visual stock only
- **Custom curation panel / preview UI** — terminal-only output for now; user manually inspects files in `assets/stock/`
- **Asset versioning / dedupe across projects** — each project owns its own copy

---

## Dependencies

- Existing: `PIXABAY_API_KEY` in `.env` (user-provided)
- Existing: `VOLCARK_API_KEY` in `.env` (already used by `/video-cover`)
- Python 3.9+ with `aiohttp` and `python-dotenv` (existing skill stack)
- This spec depends on **Animation Enhancement** spec (`KenBurns` component must exist before stock assets can be wrapped)

---

## Success Criteria

- `/asset-pack <slug>` produces stock media for every shot in a typical 6-shot script
- ≥80% of shots use Pixabay (Tier 1 or Tier 2) — only ≤20% fall to AI generation
- Wall-clock time for a 6-shot fetch < 30s end-to-end (parallelism working)
- Re-running `/asset-pack <slug>` without `--refresh` is a no-op (idempotent)
- `/remotion-video` integrates stock assets automatically when manifest exists
- Old scripts without `**素材关键词**` field run via LLM extraction without errors
- Manifest contains complete attribution for every Pixabay-sourced asset
