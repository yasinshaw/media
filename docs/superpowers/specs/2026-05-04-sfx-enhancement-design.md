# SFX Enhancement: 3D Taxonomy + Multi-Layer Architecture

## Summary

Upgrade the SFX system from a flat 13-type enum to a 3D taxonomy (mood × action × intensity) with multi-layer audio stacking in `SFXLayer`. Expand the local SFX library to ~40 curated files from free sources, and integrate smart matching into the `/remotion-video` pipeline. Backward compatible with existing scripts.

## Problem

Three issues with the current SFX system:

1. **Material quality**: 13 stock sound effects sound generic ("free素材"), low recognition
2. **Poor matching**: Fixed types (whoosh/impact/text-pop) don't correlate with shot content — sounds disconnected
3. **No layering**: Only one SFX plays per shot, lacks depth (ambient + action + design)

## Design Decisions

- **3D taxonomy**: Replace flat enum with (mood, action, intensity) triples — richer, more expressive
- **Smart file matching**: Fallback chain from exact match → mood+action → action only → neutral default, backed by a static file manifest (no runtime fs checks)
- **Multi-layer stacking**: Up to 3 concurrent SFX layers (ambient, action, design) with conservative base volumes and auto volume scaling
- **Local library + free sources**: Curate ~40 files from Pixabay/Mixkit/Freesound, with a download + rename workflow
- **Backward compatible**: Old format `impact` still works, auto-maps to taxonomy triple with inherited delay/volume
- **Integration point**: SFX parsing and file lookup happens in `/remotion-video` Step 3.5

---

## Part 1: 3D Taxonomy

### Dimensions

| Dimension | Values | Description |
|-----------|--------|-------------|
| **Mood** | `energetic` · `calm` · `tense` · `playful` · `epic` · `neutral` | Emotional color |
| **Action** | `transition` · `emphasis` · `entry` · `exit` · `ambient` · `feedback` | What's happening on screen |
| **Intensity** | `subtle` · `medium` · `strong` | Loudness / impact level |

### File naming convention

```
remotion/public/audio/sfx/{mood}-{action}-{intensity}.mp3
```

Examples:
- `energetic-transition-strong.mp3`
- `calm-ambient-subtle.mp3`
- `neutral-emphasis-medium.mp3`

### Static file manifest

`sfx-matcher.ts` imports a `SFX_AVAILABLE_FILES` string array from `constants.ts`. This is a hardcoded list of all SFX files present in `remotion/public/audio/sfx/`. The matching function checks against this list instead of attempting runtime `fs.existsSync()` (which doesn't work in Remotion Studio or headless Chrome).

```typescript
// In constants.ts
export const SFX_AVAILABLE_FILES: string[] = [
  'neutral-emphasis-medium.mp3',
  'neutral-transition-medium.mp3',
  // ... all available files
]
```

When new SFX files are added, this array must be updated. A `scripts/update-sfx-manifest.sh` script can auto-generate it from the directory.

### Smart matching fallback chain

Given a `(mood, action, intensity)` triple, `matchSFX()` checks `SFX_AVAILABLE_FILES` for:

1. Exact match → `{mood}-{action}-{intensity}.mp3`
2. Mood + Action (fallback to medium) → `{mood}-{action}-medium.mp3`
3. Action + Intensity (fallback to neutral) → `neutral-{action}-{intensity}.mp3`
4. Action only (neutral + medium) → `neutral-{action}-medium.mp3`
5. Not found → return `null`, caller skips with warning (don't block render)

### Backward compatibility mapping

Old `type` string → taxonomy triple + inherited delay/volume:

| Old type | mood | action | intensity | delay (s) | volume |
|----------|------|--------|-----------|-----------|--------|
| `whoosh-in` | neutral | entry | medium | 0 | 0.50 |
| `whoosh` | neutral | transition | medium | 0 | 0.50 |
| `swoosh` | energetic | transition | medium | 0 | 0.50 |
| `transition` | neutral | transition | medium | 0 | 0.50 |
| `impact` | neutral | emphasis | strong | 0.3 | 0.40 |
| `text-pop` | playful | feedback | medium | 0.2 | 0.50 |
| `reveal` | playful | emphasis | medium | 0.2 | 0.50 |
| `ding` | playful | feedback | subtle | 0.1 | 0.50 |
| `click` | neutral | feedback | subtle | 0 | 0.50 |
| `riser` | tense | transition | medium | 0 | 0.45 |
| `glitch` | tense | feedback | medium | 0 | 0.35 |
| `success` | playful | feedback | medium | 0.1 | 0.50 |
| `outro` | epic | exit | medium | 0 | 0.55 |

When `SFXLayer` receives `type: 'impact'`, it translates to `{ mood: 'neutral', action: 'emphasis', intensity: 'strong', delay: 0.3, volume: 0.40, layer: 'design' }` before passing to `matchSFX()`.

Old `SFX_FILE_MAP` is **deprecated but kept** during migration. `sfx-matcher.ts` falls back to `SFX_FILE_MAP[type]` if the new taxonomy lookup fails for legacy types.

---

## Part 2: Multi-Layer SFXLayer

### Layer architecture

Each shot supports up to 3 concurrent SFX layers:

| Layer | Type | Purpose | Default volume |
|-------|------|---------|---------------|
| **Ambient** | `ambient` | Continuous atmosphere, underlay | 0.10 |
| **Action** | `transition` · `entry` · `exit` | Event-triggered, mid-layer | 0.35 |
| **Design** | `emphasis` · `feedback` | Highlight, top-layer | 0.45 |

### SFXConfig interface

```typescript
interface SFXConfig {
  // New format (preferred)
  mood?: string         // 'energetic' | 'calm' | 'tense' | 'playful' | 'epic' | 'neutral'
  action?: string       // 'transition' | 'emphasis' | 'entry' | 'exit' | 'ambient' | 'feedback'
  intensity?: string    // 'subtle' | 'medium' | 'strong'
  layer?: 'ambient' | 'action' | 'design'

  // Legacy format (backward compatible)
  type?: string         // old enum name, e.g. 'impact'

  // Common
  delay?: number        // seconds before playing
  volume?: number       // override default volume
  duration?: number     // seconds (for ambient layer — see below)
}
```

### Auto layer inference

When `layer` is omitted, infer from `action`:

| action | inferred layer |
|--------|---------------|
| `ambient` | ambient |
| `transition` · `entry` · `exit` | action |
| `emphasis` · `feedback` | design |

### Auto volume balancing

The `SFXLayer` component counts how many effects are in the current render and applies a scale factor to all volumes:

```typescript
const LAYER_SCALE: Record<number, number> = {
  1: 1.0,
  2: 0.8,
  3: 0.7,
}
const scale = LAYER_SCALE[Math.min(effects.length, 3)] ?? 0.7
// Apply: finalVolume = baseVolume * scale
```

Base volumes are intentionally conservative (ambient 0.10, action 0.35, design 0.45) so that even with 3 layers the combined peak stays well below clipping. This avoids the need for real-time mixing or post-render normalization.

### Ambient duration handling

Ambient SFX files may be longer than the shot. Use Remotion's `volume` callback to fade out near the end:

```typescript
// For ambient effects with duration:
const fadeOutStart = shotDurationFrames - 0.5 * fps
const ambientVolume = interpolate(frame, [fadeOutStart, shotDurationFrames], [baseVolume, 0], {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
})
```

If `duration` is not specified, the ambient plays for the full shot length with a 0.5s fade-out.

### Audio clipping prevention

Conservative volume design ensures no clipping with typical content:
- 3 SFX layers max: 0.10 + 0.35 + 0.45 = 0.90 raw → ×0.7 = 0.63 peak
- Plus BGM (0.06 default, ducked to 0.02 during voiceover): well within headroom
- Plus voiceover (1.0): voiceover dominates, SFX + BGM are supporting

If clipping is detected in post-production, the FFmpeg loudness normalization pass (separate future enhancement) can handle it.

---

## Part 3: Script Integration

### New script format

```markdown
# Old format (still works)
**音效**: impact

# New format — single effect
**音效**: energetic/transition/strong

# New format — multiple layers (comma-separated)
**音效**: calm/ambient/subtle, energetic/emphasis/medium
```

### Parsing rules

- Slash-separated: `mood/action/intensity` (all optional, default to `neutral`/`emphasis`/`medium`)
- Comma-separated for multiple effects per shot
- Empty / omitted = no SFX
- Old type names (`whoosh`, `impact`, etc.) are valid in the old format but NOT in the new slash format. New slash format must use taxonomy values only.

### Updated 音效标注指南 (for /video-script)

| Shot type | Recommended tag | Reason |
|-----------|----------------|--------|
| Hook (opening) | `epic/transition/strong` | Dramatic entrance |
| Data / stats reveal | `energetic/emphasis/strong` | Emphasize key numbers |
| Text animation | `playful/feedback/medium` | Match text motion |
| Mood shift | `tense/transition/medium` | Rhythm change |
| Educational content | `calm/ambient/subtle` | Soft underlay |
| CTA (closing) | `epic/emphasis/medium` | Wrap-up feel |
| Product comparison | `energetic/transition/medium` | Dynamic switch |
| Warning / error | `tense/emphasis/strong` | Urgency |

---

## Part 4: SFX Library Curation

### Target: ~40 files

| Source | License | Notes |
|--------|---------|-------|
| **Pixabay SFX** | Free | Already integrated, API available for batch download |
| **Mixkit** | Free | High quality, browse by category |
| **Freesound.org** | CC0/CC-BY | Community contributed, needs curation |

### Download workflow

1. **Search**: Use Pixabay SFX API to search by keyword (e.g., "whoosh", "impact", "ambient"). The existing Pixabay integration in the project handles API auth and rate limiting.
2. **Download**: Batch download candidates to a temp directory
3. **Curate**: Human listens and selects the best file per (mood, action) combination
4. **Rename**: `scripts/rename-sfx.sh <src-dir> <dest-dir>` — bulk renames approved files from original names to taxonomy format: `energetic-transition-strong.mp3`
5. **Update manifest**: Run `scripts/update-sfx-manifest.sh` to regenerate `SFX_AVAILABLE_FILES` in `constants.ts`

### Minimum coverage

Every (mood × action) combination needs at least one `medium` intensity file:

- 5 moods × 6 actions = 30 base files (medium)
- Plus ~10 strong/subtle variants for key combinations
- Total: ~40 files

### Priority files (download first)

Must-have for common shot types:

1. `neutral-emphasis-medium` — generic emphasis (replaces current `impact`)
2. `neutral-transition-medium` — generic transition (replaces current `whoosh`)
3. `neutral-entry-medium` — generic entry (replaces current `whoosh-in`)
4. `epic-transition-strong` — dramatic opening
5. `energetic-emphasis-strong` — data reveal
6. `calm-ambient-subtle` — educational content
7. `playful-feedback-medium` — text pop
8. `tense-transition-medium` — mood shift
9. `epic-exit-medium` — outro
10. `neutral-feedback-subtle` — click/ding

---

## Part 5: Implementation Changes

### Files to modify

| File | Change |
|------|--------|
| `remotion/src/components/constants.ts` | Add `SFX_AVAILABLE_FILES` array, add backward compat map (type → triple + delay + volume), deprecate `SFX_FILE_MAP` (keep during migration) |
| `remotion/src/components/SFXLayer.tsx` | Multi-layer stacking, auto volume balancing, new `SFXConfig`, legacy `type` translation |
| `remotion/src/components/index.ts` | Export `SFXConfig` type and `matchSFX` from new module |
| `.claude/skills/video-script/SKILL.md` | Update 音效标注指南 table, new script format docs |
| `.claude/skills/remotion-video/SKILL.md` | Update Step 3.5 to parse new slash format, call `matchSFX()`, warn on missing files |

### Files to add

| File | Purpose |
|------|---------|
| `remotion/src/components/sfx-matcher.ts` | `matchSFX(mood, action, intensity): string | null` — checks `SFX_AVAILABLE_FILES`, applies fallback chain |
| `scripts/rename-sfx.sh` | Bulk rename curated SFX files to taxonomy format |
| `scripts/update-sfx-manifest.sh` | Scan `public/audio/sfx/` and regenerate `SFX_AVAILABLE_FILES` |

### Files to populate

| Directory | Content |
|-----------|---------|
| `remotion/public/audio/sfx/` | ~40 curated SFX files with new naming convention |

### Migration path

1. Phase 1: Add new code (`sfx-matcher.ts`, updated `SFXLayer.tsx`, `constants.ts`) alongside existing code
2. Phase 2: Download and curate ~40 SFX files, update `SFX_AVAILABLE_FILES`
3. Phase 3: Update `/video-script` and `/remotion-video` SKILL.md files
4. Phase 4: Existing compositions continue to work via backward compat map; new scripts use enriched format
5. Phase 5 (later): Remove deprecated `SFX_FILE_MAP` and old SFX files once all compositions are migrated

### BGM + SFX interaction (future enhancement)

The current `BGMAudio` ducking only responds to voiceover segments. With multi-layer SFX, BGM should also duck when loud design SFX play. Priority: voiceover > design SFX > action SFX > ambient SFX > BGM. This is acknowledged but out of scope for this design — can be added as a follow-up.
