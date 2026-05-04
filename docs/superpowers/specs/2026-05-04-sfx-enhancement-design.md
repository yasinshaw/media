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
- **Smart file matching**: Fallback chain from exact match → mood+action → action only → neutral default
- **Multi-layer stacking**: Up to 3 concurrent SFX layers (ambient, action, design) with auto volume balancing
- **Local library + free sources**: Curate ~40 files from Pixabay/Mixkit/Freesound, no API dependency
- **Backward compatible**: Old format `impact` still works, auto-maps to `neutral-emphasis-medium`
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

### Smart matching fallback chain

Given a `(mood, action, intensity)` triple:

1. Exact match → `{mood}-{action}-{intensity}.mp3`
2. Mood + Action (fallback to medium) → `{mood}-{action}-medium.mp3`
3. Action + Intensity (fallback to neutral) → `neutral-{action}-{intensity}.mp3`
4. Action only (neutral + medium) → `neutral-{action}-medium.mp3`
5. Not found → skip with warning, don't block render

### Backward compatibility

Old script format `impact` maps to:

| Old type | mood | action | intensity |
|----------|------|--------|-----------|
| `whoosh-in` | neutral | entry | medium |
| `whoosh` | neutral | transition | medium |
| `swoosh` | energetic | transition | medium |
| `transition` | neutral | transition | medium |
| `impact` | neutral | emphasis | strong |
| `text-pop` | playful | feedback | medium |
| `reveal` | playful | emphasis | medium |
| `ding` | playful | feedback | subtle |
| `click` | neutral | feedback | subtle |
| `riser` | tense | transition | medium |
| `glitch` | tense | feedback | medium |
| `success` | playful | feedback | medium |
| `outro` | epic | exit | medium |

---

## Part 2: Multi-Layer SFXLayer

### Layer architecture

Each shot supports up to 3 concurrent SFX layers:

| Layer | Type | Purpose | Volume range |
|-------|------|---------|-------------|
| **Ambient** | `ambient` | Continuous atmosphere, underlay | 0.05–0.15 |
| **Action** | `transition` · `entry` · `exit` | Event-triggered, mid-layer | 0.20–0.50 |
| **Design** | `emphasis` · `feedback` | Highlight, top-layer | 0.30–0.60 |

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
  duration?: number     // seconds (for ambient layer)
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

When multiple layers play simultaneously, scale down to prevent clipping:

| Active layers | Scale factor |
|--------------|-------------|
| 1 layer | ×1.0 |
| 2 layers | ×0.8 |
| 3 layers | ×0.7 |

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
| `remotion/src/components/constants.ts` | Replace flat `SFX_FILE_MAP` with 3D taxonomy + matching function |
| `remotion/src/components/SFXLayer.tsx` | Multi-layer stacking, auto volume balancing, new `SFXConfig` |
| `.claude/skills/video-script/SKILL.md` | Update 音效标注指南, new script format |
| `.claude/skills/remotion-video/SKILL.md` | Update Step 3.5 to parse new format, smart file lookup |

### Files to add

| File | Purpose |
|------|---------|
| `remotion/src/components/sfx-matcher.ts` | Smart matching function: `(mood, action, intensity) → file path` |

### Files to populate

| Directory | Content |
|-----------|---------|
| `remotion/public/audio/sfx/` | ~40 curated SFX files with new naming convention |

### Migration path

1. Keep old SFX files alongside new ones during transition
2. Old `SFX_FILE_MAP` entries map to new taxonomy (see backward compat table)
3. Old scripts continue to work without changes
4. New scripts use the enriched format
