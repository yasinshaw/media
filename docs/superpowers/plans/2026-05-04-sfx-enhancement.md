# SFX Enhancement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace flat 13-type SFX enum with 3D taxonomy (mood × action × intensity), add multi-layer audio stacking to SFXLayer, and integrate smart file matching into the pipeline.

**Architecture:** `sfx-matcher.ts` is a pure-logic module that maps (mood, action, intensity) triples to file paths via a static manifest and fallback chain. `SFXLayer.tsx` consumes it and adds multi-layer volume balancing. Both `/video-script` and `/remotion-video` skills are updated to use the new enriched format while remaining backward compatible.

**Tech Stack:** TypeScript, Remotion 4.x, Vitest (for matcher tests), Bash (utility scripts)

**Spec:** `docs/superpowers/specs/2026-05-04-sfx-enhancement-design.md`

---

### Task 1: Add Vitest to Remotion project

**Files:**
- Modify: `remotion/package.json`
- Create: `remotion/vitest.config.ts`

- [ ] **Step 1: Install vitest**

```bash
cd remotion && pnpm add -D vitest
```

- [ ] **Step 2: Create vitest config**

```typescript
// remotion/vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
  },
})
```

- [ ] **Step 3: Add test script to package.json**

Add to `scripts` in `remotion/package.json`:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 4: Verify setup**

```bash
cd remotion && pnpm test
```

Expected: "No test files found" (not an error).

- [ ] **Step 5: Commit**

```bash
git add remotion/package.json remotion/pnpm-lock.yaml remotion/vitest.config.ts
git commit -m "chore: add vitest to remotion project"
```

---

### Task 2: Create sfx-matcher.ts with TDD

**Files:**
- Create: `remotion/src/components/sfx-matcher.test.ts`
- Create: `remotion/src/components/sfx-matcher.ts`

- [ ] **Step 1: Write failing tests for matchSFX()**

```typescript
// remotion/src/components/sfx-matcher.test.ts
import { describe, it, expect } from 'vitest'
import { matchSFX, translateLegacyType } from './sfx-matcher'

describe('matchSFX', () => {
  // Use a minimal mock manifest for testing
  const originalFiles = [
    'neutral-emphasis-medium.mp3',
    'neutral-transition-medium.mp3',
    'energetic-emphasis-strong.mp3',
    'neutral-emphasis-strong.mp3',
    'epic-transition-strong.mp3',
  ]

  it('returns exact match', () => {
    expect(matchSFX('energetic', 'emphasis', 'strong', originalFiles))
      .toBe('energetic-emphasis-strong.mp3')
  })

  it('falls back to mood+action with medium intensity', () => {
    // Add energetic-emphasis-medium to test this fallback path
    const filesWithMoodAction = [...originalFiles, 'energetic-emphasis-medium.mp3']
    expect(matchSFX('energetic', 'emphasis', 'subtle', filesWithMoodAction))
      .toBe('energetic-emphasis-medium.mp3')
  })

  it('falls back to neutral+action+intensity', () => {
    expect(matchSFX('calm', 'emphasis', 'strong', originalFiles))
      .toBe('neutral-emphasis-strong.mp3')
  })

  it('falls back to neutral+action+medium', () => {
    expect(matchSFX('calm', 'transition', 'strong', originalFiles))
      .toBe('neutral-transition-medium.mp3')
  })

  it('returns null when no match found', () => {
    expect(matchSFX('calm', 'exit', 'subtle', originalFiles))
      .toBeNull()
  })
})

describe('translateLegacyType', () => {
  it('translates impact to taxonomy triple', () => {
    const result = translateLegacyType('impact')
    expect(result).toEqual({
      mood: 'neutral',
      action: 'emphasis',
      intensity: 'strong',
      delay: 0.3,
      volume: 0.40,
    })
  })

  it('translates whoosh-in to taxonomy triple', () => {
    const result = translateLegacyType('whoosh-in')
    expect(result).toEqual({
      mood: 'neutral',
      action: 'entry',
      intensity: 'medium',
      delay: 0,
      volume: 0.50,
    })
  })

  it('returns null for unknown type', () => {
    expect(translateLegacyType('nonexistent')).toBeNull()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd remotion && pnpm test
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement sfx-matcher.ts**

```typescript
// remotion/src/components/sfx-matcher.ts

export interface SFXTriple {
  mood: string
  action: string
  intensity: string
  delay?: number
  volume?: number
}

export function matchSFX(
  mood: string,
  action: string,
  intensity: string,
  availableFiles: string[],
): string | null {
  const toFilename = (m: string, a: string, i: string) =>
    `${m}-${a}-${i}.mp3`

  const candidates = [
    toFilename(mood, action, intensity),        // exact
    toFilename(mood, action, 'medium'),          // mood+action
    toFilename('neutral', action, intensity),    // action+intensity
    toFilename('neutral', action, 'medium'),     // fallback
  ]

  return candidates.find((f) => availableFiles.includes(f)) ?? null
}

const LEGACY_MAP: Record<string, SFXTriple> = {
  'whoosh-in':  { mood: 'neutral', action: 'entry',      intensity: 'medium', delay: 0,   volume: 0.50 },
  'whoosh':     { mood: 'neutral', action: 'transition', intensity: 'medium', delay: 0,   volume: 0.50 },
  'swoosh':     { mood: 'energetic', action: 'transition', intensity: 'medium', delay: 0,   volume: 0.50 },
  'transition': { mood: 'neutral', action: 'transition', intensity: 'medium', delay: 0,   volume: 0.50 },
  'impact':     { mood: 'neutral', action: 'emphasis',   intensity: 'strong', delay: 0.3, volume: 0.40 },
  'text-pop':   { mood: 'playful', action: 'feedback',   intensity: 'medium', delay: 0.2, volume: 0.50 },
  'reveal':     { mood: 'playful', action: 'emphasis',   intensity: 'medium', delay: 0.2, volume: 0.50 },
  'ding':       { mood: 'playful', action: 'feedback',   intensity: 'subtle', delay: 0.1, volume: 0.50 },
  'click':      { mood: 'neutral', action: 'feedback',   intensity: 'subtle', delay: 0,   volume: 0.50 },
  'riser':      { mood: 'tense',   action: 'transition', intensity: 'medium', delay: 0,   volume: 0.45 },
  'glitch':     { mood: 'tense',   action: 'feedback',   intensity: 'medium', delay: 0,   volume: 0.35 },
  'success':    { mood: 'playful', action: 'feedback',   intensity: 'medium', delay: 0.1, volume: 0.50 },
  'outro':      { mood: 'epic',    action: 'exit',       intensity: 'medium', delay: 0,   volume: 0.55 },
}

export function translateLegacyType(type: string): SFXTriple | null {
  return LEGACY_MAP[type] ?? null
}

export function inferLayer(action: string): 'ambient' | 'action' | 'design' {
  if (action === 'ambient') return 'ambient'
  if (action === 'transition' || action === 'entry' || action === 'exit') return 'action'
  return 'design'
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
cd remotion && pnpm test
```

Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
git add remotion/src/components/sfx-matcher.ts remotion/src/components/sfx-matcher.test.ts
git commit -m "feat: add sfx-matcher with 3D taxonomy lookup and legacy translation"
```

---

### Task 3: Update constants.ts

**Files:**
- Modify: `remotion/src/components/constants.ts`

- [ ] **Step 1: Add new SFX constants to constants.ts**

Append after the existing `SFX_FILE_MAP` block (keep `SFX_FILE_MAP` for backward compat):

```typescript
// ── SFX 3D Taxonomy ──────────────────────────────────────────────

export const SFX_MOODS = ['energetic', 'calm', 'tense', 'playful', 'epic', 'neutral'] as const
export type SFXMood = (typeof SFX_MOODS)[number]

export const SFX_ACTIONS = ['transition', 'emphasis', 'entry', 'exit', 'ambient', 'feedback'] as const
export type SFXAction = (typeof SFX_ACTIONS)[number]

export const SFX_INTENSITIES = ['subtle', 'medium', 'strong'] as const
export type SFXIntensity = (typeof SFX_INTENSITIES)[number]

export type SFXLayerType = 'ambient' | 'action' | 'design'

export const SFX_LAYER_DEFAULTS: Record<SFXLayerType, { volume: number }> = {
  ambient: { volume: 0.10 },
  action: { volume: 0.35 },
  design: { volume: 0.45 },
} as const

export const SFX_LAYER_SCALE: Record<number, number> = {
  1: 1.0,
  2: 0.8,
  3: 0.7,
}

// Static manifest of available SFX files (taxonomy-named only).
// Legacy files (impact.mp3, whoosh.mp3) are handled by SFX_FILE_MAP, not this list.
// Update via: scripts/update-sfx-manifest.sh
export const SFX_AVAILABLE_FILES: string[] = [
  // Populated by update-sfx-manifest.sh — add taxonomy-named files here
]
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd remotion && npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add remotion/src/components/constants.ts
git commit -m "feat: add SFX 3D taxonomy types and layer defaults to constants"
```

---

### Task 4: Upgrade SFXLayer.tsx

**Files:**
- Modify: `remotion/src/components/SFXLayer.tsx`

- [ ] **Step 1: Rewrite SFXLayer.tsx**

Replace the entire file content with:

```typescript
import React from 'react'
import { Audio } from '@remotion/media'
import { staticFile, useCurrentFrame, useVideoConfig, interpolate } from 'remotion'
import { SFX, SFX_FILE_MAP, SFX_AVAILABLE_FILES, SFX_LAYER_DEFAULTS, SFX_LAYER_SCALE } from './constants'
import { matchSFX, translateLegacyType, inferLayer } from './sfx-matcher'
import type { SFXLayerType } from './constants'

export interface SFXConfig {
  // New format (preferred)
  mood?: string
  action?: string
  intensity?: string
  layer?: SFXLayerType
  // Legacy format (backward compatible)
  type?: string
  // Common
  delay?: number
  volume?: number
  duration?: number
}

interface ResolvedSFX {
  src: string
  layer: SFXLayerType
  delay: number
  volume: number
  duration?: number
}

interface SFXLayerProps {
  effects: SFXConfig[]
  startFrame?: number
}

const normalizeSrc = (s: string) => s.replace(/^\/audio\/sfx\//, '')

function resolveEffect(effect: SFXConfig, availableFiles: string[]): ResolvedSFX | null {
  // Guard: empty config produces no sound
  if (!effect.type && !effect.mood && !effect.action) return null

  // Legacy format: type field present
  if (effect.type) {
    const legacy = translateLegacyType(effect.type)
    if (!legacy) {
      const fallbackSrc = SFX_FILE_MAP[effect.type]
      if (!fallbackSrc) return null
      return {
        src: normalizeSrc(fallbackSrc),
        layer: inferLayer('transition'),
        delay: effect.delay ?? 0,
        volume: effect.volume ?? SFX.VOLUME,
      }
    }
    const src = matchSFX(legacy.mood, legacy.action, legacy.intensity, availableFiles)
      ?? (SFX_FILE_MAP[effect.type] ? normalizeSrc(SFX_FILE_MAP[effect.type]) : null)
    if (!src) return null
    return {
      src,
      layer: effect.layer ?? inferLayer(legacy.action),
      delay: effect.delay ?? legacy.delay ?? 0,
      volume: effect.volume ?? legacy.volume ?? SFX.VOLUME,
    }
  }

  // New format: mood/action/intensity
  const mood = effect.mood ?? 'neutral'
  const action = effect.action ?? 'emphasis'
  const intensity = effect.intensity ?? 'medium'
  const src = matchSFX(mood, action, intensity, availableFiles)
  if (!src) return null

  const layer = effect.layer ?? inferLayer(action)
  const layerDefaults = SFX_LAYER_DEFAULTS[layer]

  return {
    src,
    layer,
    delay: effect.delay ?? 0,
    volume: effect.volume ?? layerDefaults.volume,
    duration: effect.duration,
  }
}

export const SFXLayer: React.FC<SFXLayerProps> = ({ effects, startFrame = 0 }) => {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()

  const resolved = effects
    .map((e) => resolveEffect(e, SFX_AVAILABLE_FILES))
    .filter((r): r is ResolvedSFX => r !== null)

  if (resolved.length === 0) return null

  const scale = SFX_LAYER_SCALE[Math.min(resolved.length, 3)] ?? 0.7

  return (
    <>
      {resolved.map((effect, idx) => {
        const delayFrames = effect.delay * fps
        const absoluteStart = startFrame + delayFrames
        const fadeInFrames = 3

        let volume: number
        if (effect.layer === 'ambient' && effect.duration) {
          const durFrames = effect.duration * fps
          const ambientEnd = absoluteStart + durFrames
          const fadeOutStart = ambientEnd - 0.5 * fps
          const baseVol = effect.volume * scale
          volume =
            interpolate(frame, [absoluteStart, absoluteStart + fadeInFrames], [0, baseVol], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }) *
            interpolate(frame, [fadeOutStart, ambientEnd], [1, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            })
        } else {
          volume = delayFrames > 0
            ? interpolate(frame, [absoluteStart, absoluteStart + fadeInFrames], [0, effect.volume * scale], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              })
            : interpolate(frame, [startFrame, startFrame + fadeInFrames], [0, effect.volume * scale], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              })
        }

        return (
          <Audio
            key={`${effect.src}-${effect.delay}-${idx}`}
            src={staticFile(`/audio/sfx/${effect.src}`)}
            volume={volume}
          />
        )
      })}
    </>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd remotion && npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Update index.ts exports**

Update the Audio section in `remotion/src/components/index.ts`:

```typescript
// === Audio ===
export { BGMAudio, type BGMAudioConfig, type VoiceoverSegment } from './BGMAudio'
export { SFXLayer, type SFXConfig } from './SFXLayer'
export { matchSFX, translateLegacyType, inferLayer } from './sfx-matcher'
export type { SFXTriple } from './sfx-matcher'
```

Update the Constants section:

```typescript
// === Constants ===
export {
  SAFE_AREA, SUBTITLE, LAYOUT, BGM, BGM_STYLE_MAP,
  SFX, SFX_FILE_MAP,
  SFX_MOODS, SFX_ACTIONS, SFX_INTENSITIES,
  SFX_LAYER_DEFAULTS, SFX_LAYER_SCALE,
  SFX_AVAILABLE_FILES,
} from './constants'
export type { SFXMood, SFXAction, SFXIntensity, SFXLayerType } from './constants'
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
cd remotion && npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add remotion/src/components/SFXLayer.tsx remotion/src/components/index.ts
git commit -m "feat: upgrade SFXLayer with 3D taxonomy, multi-layer stacking, volume balancing"
```

---

### Task 5: Create utility scripts

**Files:**
- Create: `scripts/update-sfx-manifest.sh`
- Create: `scripts/rename-sfx.sh`

- [ ] **Step 1: Create update-sfx-manifest.sh**

```bash
#!/usr/bin/env bash
# Regenerates SFX_AVAILABLE_FILES in constants.ts from taxonomy-named files only.
# Files matching the pattern {mood}-{action}-{intensity}.mp3 are included.
# Legacy-named files (e.g., impact.mp3) are excluded.
# Usage: bash scripts/update-sfx-manifest.sh

SFX_DIR="remotion/public/audio/sfx"
CONSTANTS_FILE="remotion/src/components/constants.ts"

if [ ! -d "$SFX_DIR" ]; then
  echo "❌ Directory not found: $SFX_DIR"
  exit 1
fi

# Only include taxonomy-named files (contain two hyphens in the stem)
files=$(find "$SFX_DIR" -name '*.mp3' | while read f; do
  basename=$(basename "$f" .mp3)
  # Count hyphens: taxonomy names have exactly 2 (mood-action-intensity)
  count=$(echo "$basename" | tr -cd '-' | wc -c | tr -d ' ')
  if [ "$count" -eq 2 ]; then
    echo "$basename.mp3"
  fi
done | sort)

if [ -z "$files" ]; then
  echo "⚠️ No taxonomy-named SFX files found in $SFX_DIR"
  exit 0
fi

# Build the array entries
entries=""
while IFS= read -r f; do
  entries="${entries}  '${f}',\n"
done <<< "$files"

# Use Python for reliable file editing
python3 << PYEOF
import re

entries = """$(echo -e "$entries")"""

with open('$CONSTANTS_FILE', 'r') as f:
    content = f.read()

pattern = r'(export const SFX_AVAILABLE_FILES: string\[\] = \[).*?(\])'
new_block = r'\g<1>\n' + entries + r'\2'

result = re.sub(pattern, new_block, content, flags=re.DOTALL)

with open('$CONSTANTS_FILE', 'w') as f:
    f.write(result)

count = len(entries.strip().split(','))
print(f"✅ Updated SFX_AVAILABLE_FILES with {count} taxonomy-named files")
PYEOF
```

- [ ] **Step 2: Create rename-sfx.sh**

```bash
#!/usr/bin/env bash
# Renames SFX files to taxonomy format: mood-action-intensity.mp3
# Usage: bash scripts/rename-sfx.sh <source-dir> <dest-dir>
# Interactive: prompts for mood/action/intensity for each file

SRC_DIR="${1:?Usage: rename-sfx.sh <source-dir> <dest-dir>}"
DEST_DIR="${2:?Usage: rename-sfx.sh <source-dir> <dest-dir>}"

mkdir -p "$DEST_DIR"

for file in "$SRC_DIR"/*.mp3; do
  [ -f "$file" ] || continue
  basename=$(basename "$file")

  echo "📁 $basename"
  read -p "   mood (energetic/calm/tense/playful/epic/neutral): " mood
  read -p "   action (transition/emphasis/entry/exit/ambient/feedback): " action
  read -p "   intensity (subtle/medium/strong): " intensity

  new_name="${mood}-${action}-${intensity}.mp3"
  cp "$file" "$DEST_DIR/$new_name"
  echo "   → $new_name"
  echo ""
done

echo "✅ Renamed $(ls "$DEST_DIR"/*.mp3 2>/dev/null | wc -l | tr -d ' ') files to $DEST_DIR"
```

- [ ] **Step 3: Make scripts executable and commit**

```bash
chmod +x scripts/update-sfx-manifest.sh scripts/rename-sfx.sh
git add scripts/update-sfx-manifest.sh scripts/rename-sfx.sh
git commit -m "feat: add SFX utility scripts for manifest update and bulk rename"
```

---

### Task 6: Update video-script SKILL.md

**Files:**
- Modify: `.claude/skills/video-script/SKILL.md`

- [ ] **Step 1: Update the 音效标注指南 section**

Replace the existing `### 音效标注指南` section with:

```markdown
### 音效标注指南

为需要强调的镜头标注音效（留空 = 无音效）。

支持两种格式：

**旧格式**（向后兼容）：
| 镜头类型 | 推荐音效 | 说明 |
|---------|---------|------|
| 第 1 个镜头（钩子） | `whoosh-in` | 开场切入 |
| 最后 1 个镜头（CTA） | `outro` | 收尾 |
| 数据对比/跑分展示 | `impact` | 强调关键数据 |
| 有文字特效的镜头 | `text-pop` | 配合文字动画 |
| 其他镜头 | 留空 | 不标注 = 无音效 |

**新格式**（推荐，支持多层）：
格式为 `mood/action/intensity`，逗号分隔多个音效。

| 镜头类型 | 推荐标签 | 说明 |
|---------|---------|------|
| 钩子（开场） | `epic/transition/strong` | 震撼开场 |
| 数据/跑分 | `energetic/emphasis/strong` | 强调关键数据 |
| 文字特效 | `playful/feedback/medium` | 配合文字动画 |
| 情绪转折 | `tense/transition/medium` | 节奏变化 |
| 知识讲解 | `calm/ambient/subtle` | 柔和铺垫 |
| 产品对比 | `energetic/transition/medium` | 动态切换 |
| 警告/错误 | `tense/emphasis/strong` | 紧迫感 |
| CTA 收尾 | `epic/emphasis/medium` | 收束感 |

**多层示例**：`**音效**: calm/ambient/subtle, energetic/emphasis/medium`

Mood: energetic · calm · tense · playful · epic · neutral
Action: transition · emphasis · entry · exit · ambient · feedback
Intensity: subtle · medium · strong
```

- [ ] **Step 2: Update the Output Template section**

In the shot template (around line 323), change the 音效 line:

```markdown
- **音效**: mood/action/intensity 或旧格式(whoosh-in/impact/text-pop/outro) 或 留空不写
```

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/video-script/SKILL.md
git commit -m "docs: update video-script skill with 3D SFX taxonomy format"
```

---

### Task 7: Update remotion-video SKILL.md

**Files:**
- Modify: `.claude/skills/remotion-video/SKILL.md`

- [ ] **Step 1: Update Step 3.5 (Parse Audio Config) SFX section**

Replace the SFX-related content in Step 3.5 (around lines 340-361) with:

```markdown
3. **Parse SFX**: Scan each shot for `**音效**: <effect-list>`. Build an array of SFX configs per shot.

**New format parsing** (`mood/action/intensity`):
- Split by comma for multiple effects
- Split each by `/` into [mood, action, intensity] (defaults: neutral, emphasis, medium)
- Map to `SFXConfig`: `{ mood, action, intensity, layer: auto-inferred }`

**Legacy format** (`whoosh`, `impact`, etc.):
- Use as `type` field: `{ type: 'impact' }`
- Auto-translated to taxonomy triple by SFXLayer

4. **Check SFX assets**: For each parsed SFX config, use `matchSFX()` to resolve the file path. If `matchSFX()` returns null, fall back to `SFX_FILE_MAP` for legacy types. If still not found, warn and skip that effect (don't block render).
```

- [ ] **Step 2: Update the SFX file mapping table**

Replace the old SFX file mapping table with:

```markdown
**SFX resolution** (handled by `matchSFX()` + `SFX_FILE_MAP` fallback):

New files follow naming: `{mood}-{action}-{intensity}.mp3`
Legacy files kept at: `/audio/sfx/{old-name}.mp3`

| Effect | Resolved file (new) | Fallback (legacy) |
|--------|-------------------|-------------------|
| `epic/transition/strong` | `epic-transition-strong.mp3` | — |
| `energetic/emphasis/strong` | `energetic-emphasis-strong.mp3` | — |
| `impact` (legacy) | `neutral-emphasis-strong.mp3` | `/audio/sfx/impact.mp3` |
| `whoosh` (legacy) | `neutral-transition-medium.mp3` | `/audio/sfx/whoosh.mp3` |
```

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/remotion-video/SKILL.md
git commit -m "docs: update remotion-video skill with 3D SFX parsing and matchSFX integration"
```

---

### Task 8: Run full test suite and verify backward compat

**Files:**
- No new files

- [ ] **Step 1: Run all tests**

```bash
cd remotion && pnpm test
```

Expected: All tests PASS.

- [ ] **Step 2: Verify TypeScript compilation across project**

```bash
cd remotion && npx tsc --noEmit
```

Expected: No errors (including existing compositions that use old `SFXConfig.type` format).

- [ ] **Step 3: Verify an existing composition still works**

Open an existing composition that uses `<SFXLayer effects={[{ type: 'whoosh-in' }]}` and verify it renders without errors in Remotion Studio.

- [ ] **Step 4: Commit (if any fixes needed)**

```bash
git add remotion/src/components/ remotion/src/projects/ && git commit -m "fix: resolve backward compat issues in SFX system"
```
