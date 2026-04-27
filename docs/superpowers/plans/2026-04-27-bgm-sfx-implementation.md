# BGM & Sound Effects System — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add background music and sound effects to Remotion video compositions via script annotations, reusable components, and a local asset library.

**Architecture:** Two new Remotion components (`BGMAudio` for full-video BGM, `SFXLayer` for per-shot sound effects) driven by new `**BGM**` and `**音效**` fields in script.md. The `/video-script` skill auto-infers these fields; `/remotion-video` parses them and generates the audio components; `/video-review` validates audio integration.

**Tech Stack:** Remotion `@remotion/media` `<Audio>` component, `staticFile()`, `interpolate()` for volume fading, TypeScript React components.

**Spec:** `docs/superpowers/specs/2026-04-27-bgm-sfx-design.md`

---

## File Structure

```
remotion/src/components/
├── BGMAudio.tsx          # NEW — full-video background music
├── SFXLayer.tsx          # NEW — per-shot sound effects
├── constants.ts          # MODIFY — add BGM/SFX constants
└── index.ts              # MODIFY — export new components

remotion/public/audio/
├── bgm/                  # NEW — background music files (manual fill)
└── sfx/                  # NEW — sound effect files (manual fill)

.claude/skills/video-script/SKILL.md      # MODIFY — add BGM/SFX to output template
.claude/skills/remotion-video/SKILL.md    # MODIFY — add Step 3.5 audio config parsing
.claude/skills/video-review/SKILL.md      # MODIFY — add audio check items
```

---

### Task 1: Add BGM/SFX constants to constants.ts

**Files:**
- Modify: `remotion/src/components/constants.ts`

- [ ] **Step 1: Add audio constants**

Append to `remotion/src/components/constants.ts`:

```typescript
export const BGM = {
  DEFAULT_VOLUME: 0.08,
  MIN_VOLUME: 0.01,
  MAX_VOLUME: 0.20,
  FADE_IN_SECONDS: 2,
  FADE_OUT_SECONDS: 3,
} as const

export const SFX = {
  VOLUME: 0.15,
  DEFAULT_DELAYS: {
    'whoosh-in': 0,
    'whoosh': 0,
    'impact': 1,
    'text-pop': 0.5,
    'outro': 0,
  } as Record<string, number>,
} as const

export const BGM_STYLE_MAP: Record<string, string> = {
  '科技电子': 'tech',
  '轻松愉快': 'upbeat',
  '紧张悬疑': 'tense',
  '温馨抒情': 'warm',
  '史诗大气': 'epic',
} as const

export const SFX_FILE_MAP: Record<string, string> = {
  'whoosh-in': '/audio/sfx/whoosh-in.mp3',
  'whoosh': '/audio/sfx/whoosh.mp3',
  'impact': '/audio/sfx/impact.mp3',
  'text-pop': '/audio/sfx/text-pop.mp3',
  'outro': '/audio/sfx/outro.mp3',
} as const
```

- [ ] **Step 2: Export new constants from index.ts**

In `remotion/src/components/index.ts`, add to the `// === Constants ===` section:

```typescript
export { SAFE_AREA, SUBTITLE, LAYOUT, BGM, SFX, BGM_STYLE_MAP, SFX_FILE_MAP } from './constants'
```

- [ ] **Step 3: Commit**

```bash
git add remotion/src/components/constants.ts remotion/src/components/index.ts
git commit -m "feat: add BGM/SFX constants and style mapping"
```

---

### Task 2: Create BGMAudio component

**Files:**
- Create: `remotion/src/components/BGMAudio.tsx`
- Modify: `remotion/src/components/index.ts`

- [ ] **Step 1: Create BGMAudio.tsx**

```tsx
import React from 'react'
import { Audio } from '@remotion/media'
import { staticFile, useCurrentFrame, useVideoConfig, interpolate } from 'remotion'
import { BGM, BGM_STYLE_MAP } from './constants'

interface BGMAudioProps {
  style: string
  tempo: string
  volume: number
  fadeInSeconds?: number
  fadeOutSeconds?: number
}

export const BGMAudio: React.FC<BGMAudioProps> = ({
  style,
  tempo,
  volume = BGM.DEFAULT_VOLUME,
  fadeInSeconds = BGM.FADE_IN_SECONDS,
  fadeOutSeconds = BGM.FADE_OUT_SECONDS,
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

  const currentVolume = volume * volumeFactor * fadeOutFactor

  return <Audio src={src} volume={currentVolume} loop />
}

export interface BGMAudioConfig {
  style: string
  tempo: string
  volume: number
}
```

- [ ] **Step 2: Export from index.ts**

In `remotion/src/components/index.ts`, add before `// === Constants ===`:

```typescript
// === Audio ===
export { BGMAudio, type BGMAudioConfig } from './BGMAudio'
```

- [ ] **Step 3: Commit**

```bash
git add remotion/src/components/BGMAudio.tsx remotion/src/components/index.ts
git commit -m "feat: add BGMAudio component for background music"
```

---

### Task 3: Create SFXLayer component

**Files:**
- Create: `remotion/src/components/SFXLayer.tsx`
- Modify: `remotion/src/components/index.ts`

- [ ] **Step 1: Create SFXLayer.tsx**

```tsx
import React from 'react'
import { Audio } from '@remotion/media'
import { staticFile, useCurrentFrame, useVideoConfig } from 'remotion'
import { SFX, SFX_FILE_MAP } from './constants'

export interface SFXConfig {
  type: string
  delay?: number
}

interface SFXLayerProps {
  effects: SFXConfig[]
}

export const SFXLayer: React.FC<SFXLayerProps> = ({ effects }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  return (
    <>
      {effects.map((effect) => {
        const delay = effect.delay ?? SFX.DEFAULT_DELAYS[effect.type] ?? 0
        const delayFrames = delay * fps
        const src = SFX_FILE_MAP[effect.type]

        if (!src) {
          return null
        }

        return (
          <Audio
            key={effect.type}
            src={staticFile(src)}
            volume={SFX.VOLUME}
            startFrom={delayFrames > 0 ? delayFrames : undefined}
          />
        )
      })}
    </>
  )
}
```

- [ ] **Step 2: Export from index.ts**

In `remotion/src/components/index.ts`, add after the `BGMAudio` export:

```typescript
export { SFXLayer, type SFXConfig } from './SFXLayer'
```

- [ ] **Step 3: Commit**

```bash
git add remotion/src/components/SFXLayer.tsx remotion/src/components/index.ts
git commit -m "feat: add SFXLayer component for per-shot sound effects"
```

---

### Task 4: Create local asset library directories

**Files:**
- Create: `remotion/public/audio/bgm/.gitkeep`
- Create: `remotion/public/audio/sfx/.gitkeep`

- [ ] **Step 1: Create directory structure**

```bash
mkdir -p remotion/public/audio/bgm remotion/public/audio/sfx
touch remotion/public/audio/bgm/.gitkeep remotion/public/audio/sfx/.gitkeep
```

- [ ] **Step 2: Add to .gitignore note**

Check if `remotion/public/audio/bgm/` and `remotion/public/audio/sfx/` need `.gitkeep` files to preserve the directory structure. The `.gitkeep` files are needed since empty directories aren't tracked by git.

- [ ] **Step 3: Commit**

```bash
git add remotion/public/audio/bgm/.gitkeep remotion/public/audio/sfx/.gitkeep
git commit -m "chore: create BGM/SFX asset directories"
```

---

### Task 5: Update /video-script skill — add BGM/SFX to output template

**Files:**
- Modify: `.claude/skills/video-script/SKILL.md`

- [ ] **Step 1: Add BGM field to script output template**

In `.claude/skills/video-script/SKILL.md`, find the output template section (around line 213):

```markdown
# 视频标题（≤15字）

## 元信息
```

Add after the title line and before `## 元信息`:

```markdown
**BGM**: <根据话题推断的风格> | medium | 0.08
```

- [ ] **Step 2: Add 音效 field to shot template**

In the shot template (around line 223-230), add a new line after `**文字特效**`:

```markdown
- **音效**: <whoosh-in / whoosh / impact / text-pop / outro / 留空不写>
```

- [ ] **Step 3: Add BGM inference rules**

After the 文字特效指南 section (around line 287), add:

```markdown
### BGM 风格推断

根据视频话题自动选择 BGM 风格：

| 话题类型 | BGM 风格 | 节奏 |
|---------|---------|------|
| AI/科技/编程 | 科技电子 | medium |
| 产品评测/教程 | 轻松愉快 | medium |
| 竞争/对比/对抗 | 紧张悬疑 | fast |
| 人物故事/访谈 | 温馨抒情 | slow |
| 重大发布/年度盘点 | 史诗大气 | medium |

格式：`**BGM**: <风格> | <节奏> | <音量>`，音量默认 0.08。

### 音效标注指南

为需要强调的镜头标注音效（留空 = 无音效）：

| 镜头类型 | 推荐音效 | 说明 |
|---------|---------|------|
| 第 1 个镜头（钩子） | `whoosh-in` | 开场切入 |
| 最后 1 个镜头（CTA） | `outro` | 收尾 |
| 数据对比/跑分展示 | `impact` | 强调关键数据 |
| 有文字特效的镜头 | `text-pop` | 配合文字动画 |
| 其他镜头 | 留空 | 不标注 = 无音效 |

多个音效用逗号分隔：`**音效**: impact, text-pop`
```

- [ ] **Step 4: Commit**

```bash
git add .claude/skills/video-script/SKILL.md
git commit -m "docs: add BGM/SFX annotations to video-script skill"
```

---

### Task 6: Update /remotion-video skill — add audio config parsing and generation

**Files:**
- Modify: `.claude/skills/remotion-video/SKILL.md`

- [ ] **Step 1: Add new Step 3.5 (Parse Audio Config)**

In `.claude/skills/remotion-video/SKILL.md`, find the section between "Step 3: Check Voiceover Audio" and "Step 4: Project Setup". Insert a new step:

```markdown
### Step 3.5: Parse Audio Config

Parse BGM and SFX annotations from the script.

1. **Parse BGM**: Look for `**BGM**: <style> | <tempo> | <volume>` after the title. If missing, skip BGM entirely.
2. **Check BGM asset**: Verify `remotion/public/audio/bgm/<mapped-style>-<tempo>.mp3` exists. If missing, warn user and skip BGM (do NOT download at render time).
3. **Parse SFX**: Scan each shot for `**音效**: <effect-list>`. Build an array of SFX configs per shot.
4. **Check SFX assets**: Verify each referenced SFX file exists in `remotion/public/audio/sfx/`. If missing, warn and skip that effect.

**BGM style mapping** (Chinese → directory name):

| Script | Directory |
|--------|-----------|
| 科技电子 | `tech` |
| 轻松愉快 | `upbeat` |
| 紧张悬疑 | `tense` |
| 温馨抒情 | `warm` |
| 史诗大气 | `epic` |

**SFX file mapping:**

| Effect | File |
|--------|------|
| `whoosh-in` | `/audio/sfx/whoosh-in.mp3` |
| `whoosh` | `/audio/sfx/whoosh.mp3` |
| `impact` | `/audio/sfx/impact.mp3` |
| `text-pop` | `/audio/sfx/text-pop.mp3` |
| `outro` | `/audio/sfx/outro.mp3` |
```

- [ ] **Step 2: Update Step 6 (Generate Composition)**

In the "Modified Step 6: Generate Composition" section of the Audio System, add instructions for integrating BGMAudio and SFXLayer:

Add after the existing Audio system section:

```markdown
### BGM Integration

If BGM config was parsed in Step 3.5, add `<BGMAudio>` at the top of the composition, before the voiceover `<Audio>`:

```tsx
import { BGMAudio } from '../../../components'

// Inside the composition:
<BGMAudio
  style={bgmConfig.style}
  tempo={bgmConfig.tempo}
  volume={bgmConfig.volume}
/>
```

### SFX Integration

For each shot that has SFX effects, add `<SFXLayer>` inside the `<Sequence>`:

```tsx
import { SFXLayer } from '../../../components'

// Inside a Sequence with SFX:
<Sequence from={shotFrom} durationInFrames={shotDuration} premountFor={1 * fps}>
  <ShotN ... />
  <SFXLayer effects={sfxConfigs[n]} />
</Sequence>
```

If a shot has no SFX effects (empty array), omit `<SFXLayer>` entirely.
```

- [ ] **Step 3: Update the imports convention**

In the "Imports (every shot)" section, add `BGMAudio` and `SFXLayer` to the comment about available imports.

- [ ] **Step 4: Commit**

```bash
git add .claude/skills/remotion-video/SKILL.md
git commit -m "docs: add BGM/SFX parsing and generation to remotion-video skill"
```

---

### Task 7: Update /video-review skill — add audio check items

**Files:**
- Modify: `.claude/skills/video-review/SKILL.md`

- [ ] **Step 1: Add audio checks to Code Review Checklist**

In `.claude/skills/video-review/SKILL.md`, find the "Step 4: Script-to-Code Consistency" section. Add after the existing checks:

```markdown
### Step 4.5: Audio Integration Checks

If the script contains `**BGM**` or `**音效**` annotations:

- [ ] BGMAudio component present in composition (if `**BGM**` declared in script)
- [ ] BGM volume in range 0.05–0.15
- [ ] BGM asset file exists at `remotion/public/audio/bgm/<style>-<tempo>.mp3`
- [ ] SFXLayer present in shots that have `**音效**` annotations
- [ ] All referenced SFX files exist in `remotion/public/audio/sfx/`
- [ ] SFX effects inside `<Sequence>` (not floating outside)
```

- [ ] **Step 2: Commit**

```bash
git add .claude/skills/video-review/SKILL.md
git commit -m "docs: add audio integration checks to video-review skill"
```

---

### Task 8: Manual — download initial BGM and SFX assets

This task is manual and requires the user to source audio files. It is NOT automated.

**Files:**
- Download to: `remotion/public/audio/bgm/*.mp3`
- Download to: `remotion/public/audio/sfx/*.mp3`

- [ ] **Step 1: Download SFX files (5 files, < 1s each)**

Source: Pixabay Sound Effects (https://pixabay.com/sound-effects/)

| File | Search query | Requirements |
|------|-------------|-------------|
| `whoosh-in.mp3` | "whoosh intro" | < 1s, clean, no reverb |
| `whoosh.mp3` | "whoosh transition" | < 1s, clean |
| `impact.mp3` | "impact bass hit" | < 1s, punchy |
| `text-pop.mp3` | "pop click" | < 0.5s, subtle |
| `outro.mp3` | "outro swoosh" | < 1s, closing feel |

- [ ] **Step 2: Download BGM files (start with tech-medium.mp3)**

Source: Pixabay Music (https://pixabay.com/music/)

| File | Search query | Requirements |
|------|-------------|-------------|
| `tech-medium.mp3` | "technology electronic ambient" | 60-120s, loopable, 320kbps |

Add more BGM styles as needed (tech-fast, tech-slow, upbeat-medium, etc.).

- [ ] **Step 3: Verify files**

```bash
ls -la remotion/public/audio/bgm/ remotion/public/audio/sfx/
```

- [ ] **Step 4: Commit assets**

```bash
git add remotion/public/audio/bgm/ remotion/public/audio/sfx/
git commit -m "chore: add initial BGM and SFX audio assets"
```

---

### Task 9: End-to-end test on an existing project

**Goal:** Verify the full pipeline works by adding BGM/SFX annotations to an existing script and regenerating its composition.

- [ ] **Step 1: Pick a test project**

Use `deepseek-v4` as the test subject (AI/tech topic → 科技电子 style).

**Prerequisite:** Task 8 must be completed first — at minimum `tech-medium.mp3` and all 5 SFX files must exist.

- [ ] **Step 2: Manually add BGM/SFX to its script.md**

Add after the title line:
```
**BGM**: 科技电子 | medium | 0.08
```

Add to shot 1 (after `**口播**` line):
```
- **音效**: whoosh-in
```

Add to shot 5 (international benchmarks):
```
- **音效**: impact
```

Add to shot 7 (CTA):
```
- **音效**: outro
```

- [ ] **Step 3: Start Remotion Studio**

```bash
cd remotion && npx remotion studio src/root.tsx &
```

- [ ] **Step 4: Verify**

- BGMAudio plays with fade in/out
- SFX effects play at correct times
- Voiceover remains clear (BGM not too loud)
- No audio clipping or distortion

- [ ] **Step 5: Commit test changes**

```bash
git add projects/2026-04-25-deepseek-v4/script.md
git commit -m "test: add BGM/SFX annotations to deepseek-v4 script"
```
