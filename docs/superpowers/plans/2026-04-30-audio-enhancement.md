# Audio Enhancement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade audio from single-track BGM + manual SFX to role-aware BGM segmentation with crossfade, voiceover ducking, and auto-bound SFX effects.

**Architecture:** Rewrite `BGMAudio.tsx` to accept a segments array + voiceover timestamps. Add a pure `computeBgmVolume()` function for unit testing. SFX auto-binding is computed at skill generation time (no `SFXLayer.tsx` changes). The `**角色**` field in scripts drives both BGM track selection and SFX injection.

**Tech Stack:** Remotion 4, React 18, TypeScript

**Spec:** `docs/superpowers/specs/2026-04-30-audio-enhancement-design.md`

---

## File Structure

```
remotion/
├── public/audio/bgm/
│   ├── tense-slow.mp3                 # NEW (committed)
│   ├── tense-medium.mp3               # NEW (committed)
│   └── (existing files)
├── src/components/
│   ├── BGMAudio.tsx                   # REWRITE (segments + ducking; legacy preserved)
│   ├── computeBgmVolume.ts            # NEW (pure function, unit-testable)
│   ├── SFXLayer.tsx                   # UNCHANGED
│   └── constants.ts                   # MODIFY (+ 紧张悬疑 mapping)
└── src/components/index.ts            # MODIFY (export computeBgmVolume)

scripts/
└── download-tense-bgm.sh              # NEW (one-time setup)

.claude/skills/
├── video-script/SKILL.md              # MODIFY (mandatory **角色** field)
└── remotion-video/SKILL.md            # MODIFY (BGM segmentation + SFX auto + ducking)
```

---

### Task 1: Add 紧张悬疑 to BGM Style Map

**Files:**
- Modify: `remotion/src/components/constants.ts`

- [ ] **Step 1: Add the mapping**

In `BGM_STYLE_MAP`, add the `紧张悬疑` entry:

```ts
export const BGM_STYLE_MAP: Record<string, string> = {
  '科技电子': 'tech',
  '轻松愉快': 'upbeat',
  '紧张悬疑': 'tense',   // NEW
  '温馨抒情': 'warm',
  '史诗大气': 'epic',
  '轻快节奏': 'light',
} as const
```

- [ ] **Step 2: Commit**

```bash
git add remotion/src/components/constants.ts
git commit -m "feat: add 紧张悬疑 to BGM style map"
```

---

### Task 2: Create `computeBgmVolume` Pure Function

**Files:**
- Create: `remotion/src/components/computeBgmVolume.ts`

- [ ] **Step 1: Write the pure function with full JSDoc**

This is the core algorithm — a pure function that takes frame number, segment config, and voiceover data, returning the volume for that frame. It's fully unit-testable.

```ts
/**
 * Compute BGM volume for a single segment at a given frame.
 *
 * @param frame - Current frame number
 * @param segIndex - Index of the segment in the segments array
 * @param segments - Array of BGM segments with fromFrame, durationInFrames, track
 * @param options
 * @returns Volume between 0 and baseVolume (or duckVolume during voiceover)
 */
export interface BGMSegment {
  fromFrame: number
  durationInFrames: number
  track: string
}

export interface VoiceoverSegment {
  start: number  // seconds
  end: number    // seconds
}

export interface BgmVolumeOptions {
  fps: number
  videoDurationInFrames: number
  baseVolume?: number         // default 0.06
  duckVolume?: number         // default 0.02
  duckFadeFrames?: number     // default 9 (0.3s * 30fps)
  crossfadeFrames?: number    // default 30 (1s * 30fps)
  fadeInFrames?: number       // default 45 (1.5s * 30fps)
  fadeOutFrames?: number      // default 75 (2.5s * 30fps)
  voiceoverSegments?: VoiceoverSegment[]
}

export function computeBgmVolume(
  frame: number,
  segIndex: number,
  segments: BGMSegment[],
  options: BgmVolumeOptions,
): number {
  const {
    fps,
    videoDurationInFrames,
    baseVolume = 0.06,
    duckVolume = 0.02,
    duckFadeFrames = 9,
    crossfadeFrames = 30,
    fadeInFrames = 45,
    fadeOutFrames = 75,
    voiceoverSegments,
  } = options

  const seg = segments[segIndex]
  if (!seg) return 0

  const prev = segIndex > 0 ? segments[segIndex - 1] : undefined
  const next = segIndex < segments.length - 1 ? segments[segIndex + 1] : undefined

  // ── 1. Compute base envelope (fadeIn/fadeOut + crossfades) ──

  // DESIGN NOTE (intentional simplification vs spec):
  // The spec defines a 2*crossfadeFrames-wide crossfade region centered on the boundary,
  // where N+1 continues fading in past the boundary. This implementation uses a
  // crossfadeFrames-wide region that completes at the boundary instead.
  // Rationale: for contiguous segments, the new track should be at full volume
  // when new visual content starts at the boundary. Extending the crossfade past
  // the boundary would mean the new track is only at 50% when new content appears.

  // Determine the audio window for this segment:
  // - Extends crossfadeFrames before fromFrame (for crossfade-in from prev)
  // - Ends at next.fromFrame (not past it) — volume reaches 0 at the boundary
  const audioStart = prev
    ? seg.fromFrame - crossfadeFrames
    : seg.fromFrame
  const audioEnd = next
    ? next.fromFrame
    : seg.fromFrame + seg.durationInFrames

  // Outside audio window → 0
  if (frame < audioStart || frame > audioEnd) return 0

  // fadeInRamp: ramp from 0 → 1 at the start
  let fadeInRamp = 1
  if (segIndex === 0) {
    // First segment: fade in from video start
    fadeInRamp = frame < fadeInFrames
      ? frame / fadeInFrames
      : 1
  } else if (frame < seg.fromFrame) {
    // Crossfade-in from previous segment
    fadeInRamp = (frame - audioStart) / crossfadeFrames
  }

  // fadeOutRamp: ramp from 1 → 0 at the end
  let fadeOutRamp = 1
  if (segIndex === segments.length - 1) {
    // Last segment: fade out at video end
    const fadeOutStart = videoDurationInFrames - fadeOutFrames
    fadeOutRamp = frame > fadeOutStart
      ? Math.max(0, (videoDurationInFrames - frame) / fadeOutFrames)
      : 1
  } else if (next) {
    // Crossfade-out to next segment: fade starts crossfadeFrames BEFORE the boundary
    const crossfadeOutStart = next.fromFrame - crossfadeFrames
    if (frame > crossfadeOutStart) {
      fadeOutRamp = Math.max(0, (next.fromFrame - frame) / crossfadeFrames)
    }
  }

  const base = baseVolume * fadeInRamp * fadeOutRamp

  // ── 2. Apply ducking if voiceover segments provided ──

  if (!voiceoverSegments || voiceoverSegments.length === 0) {
    return base
  }

  // Find minimum distance from any voiceover segment edge
  let minDist = Infinity

  for (const v of voiceoverSegments) {
    const vStartFrame = v.start * fps
    const vEndFrame = v.end * fps

    if (frame >= vStartFrame && frame <= vEndFrame) {
      // Inside voiceover → fully ducked
      return Math.min(base, duckVolume)
    }

    // Distance to start edge
    if (frame < vStartFrame) {
      const dist = vStartFrame - frame
      if (dist < minDist) minDist = dist
    }

    // Distance to end edge
    if (frame > vEndFrame) {
      const dist = frame - vEndFrame
      if (dist < minDist) minDist = dist
    }
  }

  if (minDist >= duckFadeFrames) {
    return base
  }

  // Smooth ramp between duckVolume and baseVolume
  const duckedLevel = duckVolume + (baseVolume - duckVolume) * (minDist / duckFadeFrames)
  return Math.min(base, duckedLevel)
}

/**
 * Compute the full audio window for a segment (including crossfade extensions).
 * Used to determine which Audio elements need to be mounted for which frame range.
 */
export function getSegmentAudioWindow(
  segIndex: number,
  segments: BGMSegment[],
  crossfadeFrames: number,
  videoDurationInFrames: number,
): { start: number; end: number } {
  const seg = segments[segIndex]
  if (!seg) return { start: 0, end: 0 }

  const prev = segIndex > 0
  const next = segIndex < segments.length - 1

  const start = prev
    ? seg.fromFrame - crossfadeFrames
    : seg.fromFrame
  const end = next
    ? next.fromFrame
    : seg.fromFrame + seg.durationInFrames

  return {
    start: Math.max(0, start),
    end: Math.min(videoDurationInFrames, end),
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add remotion/src/components/computeBgmVolume.ts
git commit -m "feat: add computeBgmVolume pure function for BGM volume calculation"
```

---

### Task 2.5: Unit Tests for `computeBgmVolume`

**Files:**
- Create: `remotion/src/components/__tests__/computeBgmVolume.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
import { computeBgmVolume, getSegmentAudioWindow } from '../computeBgmVolume'
import type { BGMSegment } from '../computeBgmVolume'

const FPS = 30
const CROSSFADE = 30  // 1s
const FADE_IN = 45    // 1.5s
const FADE_OUT = 75   // 2.5s

const TWO_SEGMENTS: BGMSegment[] = [
  { fromFrame: 0, durationInFrames: 90, track: 'epic-slow' },
  { fromFrame: 90, durationInFrames: 90, track: 'tech-medium' },
]

const opts = {
  fps: FPS,
  videoDurationInFrames: 180,
  crossfadeFrames: CROSSFADE,
  fadeInFrames: FADE_IN,
  fadeOutFrames: FADE_OUT,
}

describe('computeBgmVolume', () => {
  it('returns 0 outside audio window', () => {
    expect(computeBgmVolume(-10, 0, TWO_SEGMENTS, opts)).toBe(0)
    expect(computeBgmVolume(200, 0, TWO_SEGMENTS, opts)).toBe(0)
  })

  it('fades in from video start for first segment', () => {
    // At frame 0, fadeInRamp = 0
    expect(computeBgmVolume(0, 0, TWO_SEGMENTS, opts)).toBe(0)
    // At frame 22 (half of fadeIn), should be ~50% of baseVolume
    const vol = computeBgmVolume(22, 0, TWO_SEGMENTS, opts)
    expect(vol).toBeCloseTo(0.03, 1)  // 0.06 * 0.489
  })

  it('crossfade midpoint: both segments at ~50%', () => {
    // Crossfade midpoint: frame 90 - 15 = 75
    // Segment 0 fadeOut: (90 - 75) / 30 = 0.5
    // Segment 1 fadeIn: (75 - 60) / 30 = 0.5
    const vol0 = computeBgmVolume(75, 0, TWO_SEGMENTS, opts)
    const vol1 = computeBgmVolume(75, 1, TWO_SEGMENTS, opts)
    expect(vol0).toBeCloseTo(0.03, 1)   // 0.06 * 0.5
    expect(vol1).toBeCloseTo(0.03, 1)   // 0.06 * 0.5
  })

  it('at boundary: segment 0 is 0%, segment 1 is 100%', () => {
    // At frame 90 (boundary)
    // Segment 0: fadeOutRamp = (90 - 90) / 30 = 0 → volume = 0
    // Segment 1: fadeInRamp = (90 - 60) / 30 = 1.0 → volume = baseVolume
    const vol0 = computeBgmVolume(90, 0, TWO_SEGMENTS, opts)
    const vol1 = computeBgmVolume(90, 1, TWO_SEGMENTS, opts)
    expect(vol0).toBe(0)
    expect(vol1).toBeCloseTo(0.06, 2)
  })

  it('ducks volume during voiceover', () => {
    const ducked = computeBgmVolume(45, 0, TWO_SEGMENTS, {
      ...opts,
      duckVolume: 0.02,
      duckFadeFrames: 9,
      voiceoverSegments: [{ start: 1.0, end: 2.0 }],
    })
    expect(ducked).toBeLessThanOrEqual(0.02)
  })

  it('returns 0 for missing segment', () => {
    expect(computeBgmVolume(0, 99, TWO_SEGMENTS, opts)).toBe(0)
  })

  it('last segment fades out at video end', () => {
    // At fadeOutStart (180 - 75 = 105): should start decreasing
    const vol105 = computeBgmVolume(105, 1, TWO_SEGMENTS, opts)
    expect(vol105).toBeLessThan(0.06)
    // At video end: should be 0
    expect(computeBgmVolume(180, 1, TWO_SEGMENTS, opts)).toBe(0)
  })

  it('crossfade sum at midpoint ≈ baseVolume (no overlap)', () => {
    // At midpoint (frame 75), both segments contribute.
    // Their sum should be approximately baseVolume since one fades out while other fades in.
    const vol0 = computeBgmVolume(75, 0, TWO_SEGMENTS, opts)
    const vol1 = computeBgmVolume(75, 1, TWO_SEGMENTS, opts)
    expect(vol0 + vol1).toBeCloseTo(0.06, 1)
  })

  it('duck ramp edges: smooth transition at voiceover boundaries', () => {
    // Just before voiceover starts (frame 29 = 1.0s * 30 - 1)
    const volBefore = computeBgmVolume(29, 0, TWO_SEGMENTS, {
      ...opts,
      duckVolume: 0.02,
      duckFadeFrames: 9,
      voiceoverSegments: [{ start: 1.0, end: 2.0 }],
    })
    // Just inside voiceover (frame 30 = 1.0s * 30)
    const volInside = computeBgmVolume(30, 0, TWO_SEGMENTS, {
      ...opts,
      duckVolume: 0.02,
      duckFadeFrames: 9,
      voiceoverSegments: [{ start: 1.0, end: 2.0 }],
    })
    expect(volBefore).toBeGreaterThan(volInside)
    expect(volInside).toBeLessThanOrEqual(0.02)
  })
})

describe('getSegmentAudioWindow', () => {
  it('first segment starts at fromFrame, ends at next boundary', () => {
    const win = getSegmentAudioWindow(0, TWO_SEGMENTS, CROSSFADE, 180)
    expect(win.start).toBe(0)
    expect(win.end).toBe(90)
  })

  it('middle segment extends crossfadeFrames before fromFrame', () => {
    const win = getSegmentAudioWindow(1, TWO_SEGMENTS, CROSSFADE, 180)
    expect(win.start).toBe(60)  // 90 - 30
    expect(win.end).toBe(180)   // end of video
  })
})
```

- [ ] **Step 2: Run tests to verify they fail (function not yet imported correctly)**

Run: `cd remotion && pnpm exec vitest run src/components/__tests__/computeBgmVolume.test.ts`

- [ ] **Step 3: Install vitest if needed and run tests**

```bash
cd remotion && pnpm add -D vitest
pnpm exec vitest run src/components/__tests__/computeBgmVolume.test.ts
```

Expected: All tests pass (pure function has no external deps).

- [ ] **Step 4: Commit**

```bash
git add remotion/src/components/__tests__/computeBgmVolume.test.ts remotion/package.json remotion/pnpm-lock.yaml
git commit -m "test: add unit tests for computeBgmVolume pure function"
```

---

### Task 3: Rewrite `BGMAudio.tsx`

**Files:**
- Modify: `remotion/src/components/BGMAudio.tsx`

- [ ] **Step 1: Rewrite to support both legacy and segmented modes**

The component detects which mode based on the props passed. Legacy mode (when `style` and `tempo` are provided) preserves existing behavior. Segmented mode (when `segments` is provided) uses `computeBgmVolume`.

```tsx
import React from 'react'
import { Audio } from '@remotion/media'
import { staticFile, useCurrentFrame, useVideoConfig, interpolate } from 'remotion'
import { BGM, BGM_STYLE_MAP } from './constants'
import {
  computeBgmVolume,
  getSegmentAudioWindow,
  type BGMSegment,
  type VoiceoverSegment,
  type BgmVolumeOptions,
} from './computeBgmVolume'

// ── Legacy mode props (backward compatible) ──
export interface LegacyBGMAudioProps {
  style: string
  tempo: string
  volume?: number
  fadeInSeconds?: number
  fadeOutSeconds?: number
  voiceoverSegments?: VoiceoverSegment[]
}

// ── Segmented mode props ──
export interface SegmentedBGMAudioProps {
  segments: BGMSegment[]
  voiceoverSegments?: VoiceoverSegment[]
  baseVolume?: number
  duckVolume?: number
  duckFadeFrames?: number
  crossfadeFrames?: number
  fadeInFrames?: number
  fadeOutFrames?: number
}

type BGMAudioProps = LegacyBGMAudioProps | SegmentedBGMAudioProps

function isLegacy(props: BGMAudioProps): props is LegacyBGMAudioProps {
  return 'style' in props && 'tempo' in props
}

/**
 * BGM audio component — supports both legacy single-track and segmented modes.
 *
 * Legacy: <BGMAudio style="科技电子" tempo="medium" volume={0.06} voiceoverSegments={...} />
 * Segmented: <BGMAudio segments={[...]} voiceoverSegments={...} baseVolume={0.06} />
 */
export const BGMAudio: React.FC<BGMAudioProps> = (props) => {
  if (isLegacy(props)) {
    return <LegacyBGMAudio {...props} />
  }
  return <SegmentedBGMAudio {...props} />
}

// ── Legacy implementation (unchanged from original) ──

const LegacyBGMAudio: React.FC<LegacyBGMAudioProps> = ({
  style,
  tempo,
  volume = BGM.DEFAULT_VOLUME,
  fadeInSeconds = BGM.FADE_IN_SECONDS,
  fadeOutSeconds = BGM.FADE_OUT_SECONDS,
  voiceoverSegments,
}) => {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()

  const bgmStyle = BGM_STYLE_MAP[style] ?? style
  const src = staticFile(`/audio/bgm/${bgmStyle}-${tempo}.mp3`)

  const fadeInFrames = fadeInSeconds * fps
  const fadeOutFrames = fadeOutSeconds * fps
  const fadeOutStart = durationInFrames - fadeOutFrames

  const volumeFactor = interpolate(frame, [0, fadeInFrames], [0, 1], {
    extrapolateRight: 'clamp',
  })

  const fadeOutFactor = interpolate(frame, [fadeOutStart, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const duckFactor = getDuckFactor(frame, fps, voiceoverSegments)

  const currentVolume = volume * volumeFactor * fadeOutFactor * duckFactor

  return <Audio src={src} volume={currentVolume} loop />
}

function getDuckFactor(
  frame: number,
  fps: number,
  segments?: VoiceoverSegment[],
): number {
  if (!segments || segments.length === 0) {
    return 1
  }

  const duckFadeFrames = BGM.DUCK_FADE_SECONDS * fps

  for (const seg of segments) {
    const segStartFrame = seg.start * fps
    const segEndFrame = seg.end * fps

    if (frame >= segStartFrame && frame <= segEndFrame) {
      return BGM.DUCKED_VOLUME / BGM.DEFAULT_VOLUME
    }

    if (frame > segEndFrame && frame < segEndFrame + duckFadeFrames) {
      const duckedRatio = BGM.DUCKED_VOLUME / BGM.DEFAULT_VOLUME
      return interpolate(
        frame,
        [segEndFrame, segEndFrame + duckFadeFrames],
        [duckedRatio, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
      )
    }

    if (frame < segStartFrame && frame > segStartFrame - duckFadeFrames) {
      const duckedRatio = BGM.DUCKED_VOLUME / BGM.DEFAULT_VOLUME
      return interpolate(
        frame,
        [segStartFrame - duckFadeFrames, segStartFrame],
        [1, duckedRatio],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
      )
    }
  }

  return 1
}

// ── Segmented implementation ──

const SegmentedBGMAudio: React.FC<SegmentedBGMAudioProps> = ({
  segments,
  voiceoverSegments,
  baseVolume = BGM.DEFAULT_VOLUME,
  duckVolume = BGM.DUCKED_VOLUME,
  duckFadeFrames,
  crossfadeFrames = 30,
  fadeInFrames,
  fadeOutFrames,
}) => {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()

  const resolvedDuckFadeFrames = duckFadeFrames ?? Math.round(BGM.DUCK_FADE_SECONDS * fps)
  const resolvedFadeInFrames = fadeInFrames ?? Math.round(BGM.FADE_IN_SECONDS * fps)
  const resolvedFadeOutFrames = fadeOutFrames ?? Math.round(BGM.FADE_OUT_SECONDS * fps)

  const options: BgmVolumeOptions = {
    fps,
    videoDurationInFrames: durationInFrames,
    baseVolume,
    duckVolume,
    duckFadeFrames: resolvedDuckFadeFrames,
    crossfadeFrames,
    fadeInFrames: resolvedFadeInFrames,
    fadeOutFrames: resolvedFadeOutFrames,
    voiceoverSegments,
  }

  return (
    <>
      {segments.map((seg, i) => {
        const window = getSegmentAudioWindow(i, segments, crossfadeFrames, durationInFrames)
        const volume = computeBgmVolume(frame, i, segments, options)
        const src = staticFile(`/audio/bgm/${seg.track}.mp3`)

        return (
          <Audio
            key={`${seg.track}-${i}`}
            src={src}
            volume={volume}
            loop
          />
        )
      })}
    </>
  )
}

// ── Exports ──

export interface BGMAudioConfig {
  style: string
  tempo: string
  volume: number
}
```

- [ ] **Step 2: Commit**

```bash
git add remotion/src/components/BGMAudio.tsx
git commit -m "feat: rewrite BGMAudio with segmented mode and ducking support"
```

---

### Task 4: Update `index.ts` Exports

**Files:**
- Modify: `remotion/src/components/index.ts`

- [ ] **Step 1: Add new exports**

Add after the existing Audio exports:

```ts
// === Audio (advanced) ===
export { computeBgmVolume, getSegmentAudioWindow, type BGMSegment, type BgmVolumeOptions } from './computeBgmVolume'
```

Also update the BGMAudio export to include new types:

```ts
export { BGMAudio, type BGMAudioConfig, type VoiceoverSegment, type SegmentedBGMAudioProps } from './BGMAudio'
```

- [ ] **Step 2: Commit**

```bash
git add remotion/src/components/index.ts
git commit -m "feat: export computeBgmVolume and new BGMAudio types"
```

---

### Task 5: Update `video-script/SKILL.md` — Mandatory `**角色**` Field

**Files:**
- Modify: `.claude/skills/video-script/SKILL.md`

- [ ] **Step 1: Add `**角色**` as a mandatory per-shot field**

In the "Output Template" section, add `**角色**` as the first field after the shot heading:

```markdown
### 镜头 1 — 钩子（0-Xs）
- **角色**: Hook / 痛点 / 核心 / 数据 / 金句 / CTA
- **画面类型**: ...
```

Add a new section explaining role classification:

```markdown
### Shot Role Classification (MANDATORY)

Every shot MUST have a `**角色**` field. This drives BGM track selection, SFX auto-injection, and decoration layer auto-application.

| Role | Meaning | Typical shot content |
|------|---------|---------------------|
| `Hook` | Opening hook, attention grabber | First shot, question, bold claim |
| `痛点` | Problem statement | Pain point, frustration, gap |
| `核心` | Core content / explanation | Feature demo, explanation, comparison |
| `数据` | Data / statistics / comparison | Numbers, benchmarks, charts |
| `金句` | Quote / takeaway / memorable line | Key insight, memorable phrase |
| `CTA` | Call to action / closing | Follow request, summary, next step |

Rules:
- First shot is almost always `Hook`
- Last shot is almost always `CTA`
- A typical 6-shot script: Hook → 痛点 → 核心 → 数据 → 核心 → CTA
- Roles are consumed by `/remotion-video` (BGM/SFX) and `/asset-pack` (media type)
```

- [ ] **Step 2: Commit**

```bash
git add .claude/skills/video-script/SKILL.md
git commit -m "docs: add mandatory **角色** field to video-script shot template"
```

---

### Task 6: Update `remotion-video/SKILL.md` — BGM Segmentation Section

**Files:**
- Modify: `.claude/skills/remotion-video/SKILL.md`

- [ ] **Step 1: Replace "BGM Integration" section with new segmented content**

Replace the existing "### BGM Integration" subsection (around lines 560-573) with:

```markdown
### BGM Integration (Segmented Mode)

When all shots have `**角色**` annotations, use segmented BGM. When no shots have `**角色**`, fall back to legacy single-track mode.

#### Auto-segmentation rule

Read each shot's `**角色**` and map to a BGM track:

| Shot role | Default BGM track |
|-----------|-------------------|
| Hook | `epic-slow` |
| 痛点 | `tense-medium` (falls back to `epic-slow` if file missing) |
| 核心 | `tech-medium` |
| 金句 | `warm-medium` |
| CTA | `upbeat-medium` |

Adjacent shots with the same mapped track merge into one segment.

#### Script override

```markdown
**BGM**: hook=epic-slow | core=tech-medium | cta=upbeat-medium
**BGM**: off   # disable BGM entirely
```

Legacy syntax still supported: `**BGM**: 科技电子 | medium | 0.08` → single-track mode.

#### Composition code (segmented mode)

```tsx
import { BGMAudio, type BGMSegment } from '../../../components'

const bgmSegments: BGMSegment[] = []
let cumFrame = 0

for (const shot of shots) {
  const track = ROLE_TO_TRACK[shot.role]
  // Merge with previous segment if same track
  if (bgmSegments.length > 0 && bgmSegments[bgmSegments.length - 1].track === track) {
    bgmSegments[bgmSegments.length - 1].durationInFrames += shot.durationInFrames
  } else {
    bgmSegments.push({ fromFrame: cumFrame, durationInFrames: shot.durationInFrames, track })
  }
  cumFrame += shot.durationInFrames
}

// In composition:
<BGMAudio segments={bgmSegments} voiceoverSegments={voiceoverTimings} />
```

#### Composition code (legacy mode — no roles)

```tsx
<BGMAudio style="科技电子" tempo="medium" voiceoverSegments={voiceoverTimings} />
```

#### Ducking

When `voiceover-manifest.json` exists, flatten all `segments[].subtitles[]` into `voiceoverTimings: { start, end }[]` and pass to `<BGMAudio>`. Ducking is automatic — BGM lowers during speech and rises during silence.

**FATAL RULE:** BGMAudio must receive `voiceoverSegments` whenever `voiceover-manifest.json` exists. Without ducking, BGM smothers voiceover.
```

- [ ] **Step 2: Commit**

```bash
git add .claude/skills/remotion-video/SKILL.md
git commit -m "docs: replace BGM Integration with segmented mode in remotion-video skill"
```

---

### Task 7: Update `remotion-video/SKILL.md` — SFX Auto-Binding Section

**Files:**
- Modify: `.claude/skills/remotion-video/SKILL.md`

- [ ] **Step 1: Replace "SFX Integration" section with auto-binding rules**

Replace the existing "### SFX Integration" subsection (around lines 575-589) with:

```markdown
### SFX Auto-Binding

SFX effects are auto-injected based on shot role. No manual `**音效**` declaration needed for standard patterns.

#### Auto-injection rules (applied in order, accumulate effects)

1. **First shot only**: If role = `Hook`, add `riser` at frame 0
2. **Transition** (every shot index ≥ 1): add `whoosh` at frame 0
3. **Role-specific** (replaces transition for CTA): if role = `CTA`, replace frame-0 with `reveal` at 0s + `success` at 1.0s
4. **Data emphasis**: If role = `数据`, add `ding` at 0.5s
5. **Typewriter emphasis**: If `**文字特效**: typewriter`, add `ding` at 0.3s and 1.5s (max 2 per shot)
6. **Last shot**: add `outro` at (shotDuration - 1.0s)

Resulting SFX per role:
- Hook (shot 0): `riser`
- 痛点/核心/金句 (mid): `whoosh`
- 数据 (mid): `whoosh` + `ding` @ 0.5s
- CTA: `reveal` + `success` @ 1.0s
- Last shot: all above + `outro`

#### Script `+/-` syntax

```markdown
**音效**: -whoosh, +ding @0.4s     # drop whoosh, add ding at 0.4s
**音效**: text-pop                  # bare: replace all auto with just text-pop
```

Parser rules:
1. Split on commas, trim
2. `+name` → ADD, `-name` → REMOVE, bare → replace all
3. If any bare token mixed with `+/-`: warn, use bare only
4. If only `+/-`: apply REMOVE first, then ADD

#### Composition code

```tsx
import { SFXLayer } from '../../../components'

// Auto-computed SFX list for each shot:
const sfxForShot = computeSfxForShot(shotIndex, shotRole, shotDuration, hasTypewriter, isLastShot, scriptSfxOverride)

// In Sequence:
{sfxForShot.length > 0 && (
  <SFXLayer effects={sfxForShot} />
)}
```

Helper function `computeSfxForShot` should be implemented inline in the composition file or extracted to a shared utility. See the spec for the full algorithm.
```

- [ ] **Step 2: Commit**

```bash
git add .claude/skills/remotion-video/SKILL.md
git commit -m "docs: add SFX auto-binding rules to remotion-video skill"
```

---

### Task 8: Download Tense BGM Tracks

**Files:**
- Create: `scripts/download-tense-bgm.sh`
- Create: `remotion/public/audio/bgm/tense-slow.mp3`
- Create: `remotion/public/audio/bgm/tense-medium.mp3`

- [ ] **Step 1: Find and download CC0 tense/suspense music**

Search Pixabay Music or Free Music Archive for "tense suspense" or "dark ambient" tracks. Pick 2 tracks:
- One slow tempo (~70-90 BPM)
- One medium tempo (~100-120 BPM)

Download to `remotion/public/audio/bgm/`:
- `tense-slow.mp3`
- `tense-medium.mp3`

Validate files are non-empty MP3:
```bash
file remotion/public/audio/bgm/tense-slow.mp3
file remotion/public/audio/bgm/tense-medium.mp3
```

- [ ] **Step 2: Create the download script for reproducibility**

```bash
#!/bin/bash
# One-time script to download tense BGM tracks from CC0 sources.
# Run from project root.

set -euo pipefail

BGMDIR="remotion/public/audio/bgm"
mkdir -p "$BGMDIR"

# Download tense-slow.mp3 (replace URL with actual CC0 source)
# curl -L -o "$BGMDIR/tense-slow.mp3" "<URL>" &

# Download tense-medium.mp3
# curl -L -o "$BGMDIR/tense-medium.mp3" "<URL>" &

wait

# Validate
for f in "$BGMDIR"/tense-*.mp3; do
  if [ ! -s "$f" ]; then
    echo "ERROR: $f is empty or missing"
    exit 1
  fi
  echo "OK: $f ($(du -h "$f" | cut -f1))"
done
```

- [ ] **Step 3: Listen to verify mood/tempo**

Manually verify the tracks fit the "tense / suspense" mood described in the spec.

- [ ] **Step 4: Commit**

```bash
git add scripts/download-tense-bgm.sh remotion/public/audio/bgm/tense-slow.mp3 remotion/public/audio/bgm/tense-medium.mp3
git commit -m "feat: add tense BGM tracks for 痛点 shot role"
```

---

### Task 9: TypeScript Verification

- [ ] **Step 1: Run type check**

```bash
cd remotion && pnpm exec tsc --noEmit
```

Expected: No errors.

- [ ] **Step 2: Fix any type errors**

Address any issues found.

---

### Task 10: Visual Verification

- [ ] **Step 1: Open Remotion Studio on an existing project**

```bash
cd remotion && npx remotion studio src/root.tsx &
```

Verify:
1. Legacy BGMAudio mode still works (existing projects)
2. No import errors
3. New types exported correctly

---

## Success Criteria

- [ ] `pnpm exec tsc --noEmit` passes
- [ ] `computeBgmVolume` pure function handles all 4 spec scenarios correctly
- [ ] Legacy BGMAudio mode unchanged (existing projects unaffected)
- [ ] Segmented mode accepts segments array and produces crossfade/ducking
- [ ] `**角色**` field mandatory in video-script template
- [ ] Tense BGM files committed to repo
- [ ] Skill file updated with BGM segmentation + SFX auto-binding + ducking docs
