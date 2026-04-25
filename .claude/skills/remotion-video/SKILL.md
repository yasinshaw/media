---
name: remotion-video
description: Convert video-script generated storyboard scripts into Remotion React compositions. Use when user asks to convert a script to Remotion, generate video code, or create Remotion compositions from scripts/. Generates code and starts Studio preview; does NOT render MP4. Run /video-review after this to review code and render video.
---

You are a Remotion specialist who converts video scripts into production-ready React video code for Douyin (1080×1920, 30fps).

---

## ⚠️ FATAL RULES — read before generating any shot

These rules cause the most recurring layout bugs. Violating any one of them is a Critical issue in `/video-review`.

1. **Compose Layout Primitives first.** Every shot must start from one of:
   `CenteredStack` · `HubLayout` · `TwoColumnCompare` · `TimelineFlow`.
   Hand-written `AbsoluteFill` with manual padding is allowed only when no primitive fits — and you must follow [references/manual-positioning.md](references/manual-positioning.md).

2. **NEVER hand-write `padding: '120px 40px 200px'`.** Use `<SafeArea>` or a layout primitive (which wraps it). Constants live in `components/constants.ts` as the single source of truth.

3. **Content must NOT enter the subtitle zone (`bottom < 420`).** That space is reserved for subtitles + Douyin UI. Any content `<div style={{ bottom: 200|240|... }}>caption</div>` is wrong — use a primitive's `footer` slot, or `bottom: SAFE_AREA.CONTENT_BOTTOM` (= 420).

4. **NEVER mix flex centering with hand-coded SVG pixel coordinates.** If a parent uses `justifyContent: 'center'`, you cannot reliably write `<line x1="540" y1="920" />` — the line breaks the moment any padding/sibling changes. Use `HubLayout` instead (it computes node + line coordinates from the same source).

5. **Always center absolute elements with `transform: translate(-50%, -50%)`.** Never use `left: x - width/2` — the moment text length changes, alignment breaks.

6. **NEVER use `opacity: bool ? 1 : 0` for transitions.** Always `interpolate(...)` with overlapping ranges between adjacent elements. See [references/manual-positioning.md](references/manual-positioning.md#animation-safety).

7. **Always pass `extrapolateRight: 'clamp'` to `interpolate`.** Otherwise values drift past the last keyframe.

8. **Always use `staticFile()` for audio paths.** Plain strings 404 during CLI render.

---

## Quick Start

```
/remotion-video <script-file-or-slug>
```

Example: `/remotion-video 2026-04-22-gpt-image2-compare`

## Workflow

### Step 1: Locate Script
Search `projects/` for the matching `script.md` (use slug if no full path provided).

### Step 2: Parse Script
Extract from video-script format:
- Video title → composition name
- Each shot/镜头 → component + duration
- 画面 → layout primitive choice (see "Picking a Layout Primitive" below)
- 口播 → subtitle text/segments
- 字幕 → on-screen text overlay (use Layout primitive `header`/`footer` slots)

### Step 3: Check Voiceover Audio
Look in `projects/<YYYY-MM-DD-<slug>>/assets/audio/`. Detection priority:
1. **Split files**: `voiceover-01.mp3, voiceover-02.mp3, ...` — one per shot
2. **Full file**: `voiceover-full.mp3` — single audio for whole video
3. **None**: add placeholder comment in composition

If `voiceover-manifest.json` exists, use its `duration_seconds` for shot timing.

### Step 4: Project Setup (First Time Only)
If `remotion/` doesn't exist:
1. Copy `assets/remotion-template`
2. `cd remotion && pnpm install`
3. `npx remotion add @remotion/media`

### Step 5: Generate Components
For each shot:

1. **Pick a layout primitive** based on 画面 description (see table below).
2. **Compute duration** from audio manifest (preferred) or script timing label.
3. **Write `src/projects/<slug>/shots/Shot<N>.tsx`** — wrap content in the chosen primitive.
4. **Pass subtitle props** — `subtitle` (single string) or `subtitleSegments + videoOffset` (progressive).

### Step 6: Generate Composition
Create `src/projects/<slug>/composition.tsx`:
- Sequence shots in order
- Total duration = sum of shot durations
- Add audio according to detection (see Audio System)

### Step 7: Register Composition
Add to `src/root.tsx`. Width=1080, height=1920, fps=30.

### Step 8: Link Audio Directory (If Found)
```bash
mkdir -p remotion/public/audio
ln -sf "$(pwd)/projects/<YYYY-MM-DD-<slug>>/assets/audio" remotion/public/audio/<slug>
```

### Step 9: Preview Only (NO Render)
1. Start Studio in background:
   ```bash
   cd remotion && npx remotion studio src/root.tsx &
   ```
2. Report studio URL + composition summary.
3. Remind user to run `/video-review <slug>` for review + render.

**Do NOT render MP4 here.** Rendering is `/video-review`'s job.

---

## Layout Primitives (use these first)

Every shot should start from one of these. They handle SafeArea, alignment, subtitle rendering, and SVG/connection-line math.

### Picking a Primitive

| Script 画面 pattern | Primitive | Why |
|--------------------|-----------|-----|
| 主播面对镜头 / 单一标题 / 列表说明 | `CenteredStack` | Vertical content stack, default for most shots |
| 中心 + 周围 / 队长队友 / hub-spoke / 星形 | `HubLayout` | Center + 8-position surrounding, auto SVG lines |
| 对比 / 左右对比 / 上下对比 / 优劣分析 | `TwoColumnCompare` | Two equal panels with title+body+caption |
| 流程 / 步骤 / 时间线 / 顺序 | `TimelineFlow` | Sequential items with badges and connectors |
| 切到 X 界面 / 演示 | `CenteredStack` + `<ScreenRecording>` | Stack the screen-recording mock as the body |
| 关注按钮 / CTA | `CenteredStack` + `<CTA>` | Stack the CTA component as the body |

If nothing fits, use `<SafeArea>` directly and follow [references/manual-positioning.md](references/manual-positioning.md).

### CenteredStack — default container

```tsx
import { CenteredStack } from '../../../components'

export const Shot1: React.FC<ShotProps> = ({ subtitle }) => (
  <CenteredStack
    background="linear-gradient(135deg, #0f172a, #1e293b)"
    maxWidth={900}
    gap={32}
    subtitle={subtitle}
  >
    <h1 style={{ fontSize: 72, fontWeight: 900, color: '#fff' }}>标题</h1>
    <p style={{ fontSize: 36, color: '#94a3b8' }}>说明文字</p>
  </CenteredStack>
)
```

Props: `background`, `maxWidth` (default 900), `gap` (default 32), `align`, `justify`, `subtitle`, `subtitleSegments`, `videoOffset`.

### HubLayout — center + surrounding nodes

Solves the recurring "SVG line doesn't align with element" bug. Both nodes AND lines are computed from the same hub center.

```tsx
import { HubLayout } from '../../../components'

<HubLayout
  background="linear-gradient(135deg, #0c4a6e, #075985)"
  center={{
    node: <Circle size={200} color="#f59e0b">队长</Circle>,
    scale: centerScale,
  }}
  surrounding={[
    { position: 'top-left',     node: <Circle size={140} color="#3b82f6">队友1</Circle>, opacity: fadeIn },
    { position: 'top-right',    node: <Circle size={140} color="#3b82f6">队友2</Circle>, opacity: fadeIn },
    { position: 'bottom-left',  node: <Circle size={140} color="#3b82f6">队友3</Circle>, opacity: fadeIn },
    { position: 'bottom-right', node: <Circle size={140} color="#3b82f6">队友4</Circle>, opacity: fadeIn },
  ]}
  radius={380}
  connectionsOpacity={lineFadeIn}
  footer={<Caption>队友间直接交流</Caption>}
  subtitle={subtitle}
/>
```

Positions: `top` · `top-right` · `right` · `bottom-right` · `bottom` · `bottom-left` · `left` · `top-left`.

### TwoColumnCompare — side-by-side comparison

Default `direction="vertical"` (top/bottom — best for 9:16). Use `horizontal` only when both panels are very narrow.

```tsx
import { TwoColumnCompare } from '../../../components'

<TwoColumnCompare
  background="linear-gradient(135deg, #1e293b, #334155)"
  left={{
    title: '子Agent',
    body: <DiagramSubAgent />,
    caption: '只汇报结果',
    accent: '#ef4444',
    opacity: leftOpacity,
  }}
  right={{
    title: 'Agent Teams',
    body: <DiagramTeams />,
    caption: '队友间直接交流',
    accent: '#22c55e',
    opacity: rightOpacity,
  }}
  footer={<Note>Token 成本更高，但协作更灵活</Note>}
  subtitle={subtitle}
/>
```

### TimelineFlow — sequential / process flow

```tsx
import { TimelineFlow } from '../../../components'

<TimelineFlow
  background="linear-gradient(135deg, #1e1b4b, #312e81)"
  accent="#6366f1"
  items={[
    { label: '前端', detail: '生成组件代码', opacity: fade1 },
    { label: '后端', detail: '生成 API 代码', opacity: fade2 },
    { label: '测试', detail: '编写单元测试', opacity: fade3 },
    { label: '文档', detail: '生成使用说明', opacity: fade4 },
  ]}
  header={<Title>串行执行 = 效率瓶颈</Title>}
  subtitle={subtitle}
/>
```

`direction`: `'vertical'` (default, mobile-friendly) or `'horizontal'`.

---

## Douyin Vertical Format (REQUIRED)

| Setting | Value |
|---------|-------|
| Resolution | 1080×1920 |
| FPS | 30 |
| Codec | H.264 (`--pixel-format=yuv420p`) |
| JPEG Quality | 90 |

### Composition Registration
```tsx
<Composition
  id="GptImage2Compare"
  component={GptImage2Compare}
  durationInFrames={2550}
  fps={30}
  width={1080}
  height={1920}
  defaultProps={{}}
/>
```

### Safe Area Constants

Defined in `components/constants.ts`:

| Constant | Value | Purpose |
|----------|-------|---------|
| `SAFE_AREA.TOP` | 120 | Status bar / notch |
| `SAFE_AREA.LEFT/RIGHT` | 40 | Side margins |
| `SAFE_AREA.BOTTOM` | 200 | Douyin UI overlays |
| `SAFE_AREA.SUBTITLE_BOTTOM` | 240 | Subtitle position |
| `SAFE_AREA.CONTENT_BOTTOM` | 420 | Content lower bound |

You normally don't touch these directly — Layout primitives apply them. If you must hand-position something, reference the constant, not a literal.

### Mobile-First Typography

| Element | Font Size | Weight |
|---------|-----------|--------|
| Hero title | 64–80px | 900 |
| Section title | 48–56px | 800 |
| Body / cards | 32–40px | 600–700 |
| Data labels | 28–36px | 700 |
| Small labels | 24–28px | 600 |

**Minimum: 24px.** Anything below is unreadable on mobile.

---

## Audio System

### Always use `staticFile()`

```tsx
import { Audio } from '@remotion/media'
import { staticFile } from 'remotion'

<Audio src={staticFile('/audio/<slug>/voiceover-full.mp3')} />
```

Plain string paths 404 during CLI render.

### One Audio Per Sequence

Multiple `<Audio>` in the same `<Sequence>` play simultaneously. Either:
- One audio at composition level (recommended for ProgressiveSubtitle), OR
- One audio per `<Sequence>` (only when each shot has exactly one audio file)

### Pattern: Split files (one per shot)

```tsx
<AbsoluteFill>
  <Sequence from={0} durationInFrames={150}>
    <Shot1 subtitle="第一句话" />
    <Audio src={staticFile('/audio/<slug>/voiceover-01.mp3')} />
  </Sequence>
  <Sequence from={150} durationInFrames={180}>
    <Shot2 subtitle="第二句话" />
    <Audio src={staticFile('/audio/<slug>/voiceover-02.mp3')} />
  </Sequence>
</AbsoluteFill>
```

### Pattern: Full audio (single track)

```tsx
<AbsoluteFill>
  <Audio src={staticFile('/audio/<slug>/voiceover-full.mp3')} volume={1} />
  <Sequence from={0} durationInFrames={shot1Frames}>
    <Shot1 subtitleSegments={shots[1].segments} videoOffset={shots[1].startTime} />
  </Sequence>
  <Sequence from={shot1Frames} durationInFrames={shot2Frames}>
    <Shot2 subtitleSegments={shots[2].segments} videoOffset={shots[2].startTime} />
  </Sequence>
</AbsoluteFill>
```

### Audio-Driven Timing

When `voiceover-manifest.json` has `duration_seconds`, compute frames from audio:

```javascript
const shotDuration = segments
  .filter(s => s.shot === shotNumber)
  .reduce((sum, s) => sum + s.duration_seconds, 0)
const durationInFrames = Math.round(shotDuration * 30)
```

For multi-segment shots, also compute `videoOffset` (start time in seconds within the full video) for `ProgressiveSubtitle` timing.

---

## Subtitles (always include for 口播 shots)

Layout primitives auto-render subtitles when you pass `subtitle` (string) or `subtitleSegments + videoOffset` (progressive). You should not manually place a `<Subtitle>` inside a primitive's children — the primitive does it for you.

### When to use which

| Audio shape | Subtitle prop |
|-------------|---------------|
| Single `<Audio>` per shot | `subtitle="full text"` |
| Single `voiceover-full.mp3` + manifest segments | `subtitleSegments={segments} videoOffset={shotStartSec}` |
| No audio | omit both |

### Auto-cleaned punctuation

`Subtitle` and `ProgressiveSubtitle` strip `，。．、；;：:！!`. Question marks (`？?`) are kept.

### Subtitle style (already enforced by component)

| Property | Value |
|----------|-------|
| Position | `bottom: 240` (above 200 UI + 40 gap) |
| Font | 46px bold, white, letter-spacing 1px |
| Shadow | `2px 2px 6px rgba(0,0,0,0.95), 0 0 16px rgba(0,0,0,0.6)` |
| Background | none (text-shadow only) |
| Fade in | 6 frames |

---

## Code Conventions

### Imports (every shot)

```tsx
import React from 'react'
import { useCurrentFrame, interpolate, spring, staticFile } from 'remotion'
import { CenteredStack /* or HubLayout / TwoColumnCompare / TimelineFlow */ } from '../../../components'
```

Only import primitives you actually use.

### Shot signature

```tsx
interface ShotProps {
  subtitle?: string
  subtitleSegments?: SubtitleSegment[]
  videoOffset?: number
}

export const Shot1: React.FC<ShotProps> = ({ subtitle, subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()
  const fadeIn = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <CenteredStack
      background="..."
      subtitle={subtitle}
      subtitleSegments={subtitleSegments}
      videoOffset={videoOffset}
    >
      {/* content with `opacity: fadeIn`, etc. */}
    </CenteredStack>
  )
}
```

### Duration

`durationInFrames = seconds × 30` (FPS=30).

### File layout

| File | Path |
|------|------|
| Shot | `src/projects/<slug>/shots/Shot<N>.tsx` |
| Composition | `src/projects/<slug>/composition.tsx` |
| Registration | `src/root.tsx` |

Slug is lowercase kebab-case derived from the project directory (date prefix removed).

---

## Output Format

After generating components and starting Studio:

```
✅ Remotion composition created: src/projects/<slug>/composition.tsx
📁 Generated N shot components (using primitives: CenteredStack×3, HubLayout×1, ...)
🎬 Total duration: X seconds (Y frames at 30fps)
📱 Format: Douyin vertical 1080×1920

🎙️ Audio: <split N files | voiceover-full.mp3 | none>
📂 Audio linked to: remotion/public/audio/<slug>/

🖥️  Preview: http://localhost:3000 (Remotion Studio running)
📋 Next: Run /video-review <slug> to review code and render MP4
```

---

## Error Handling

```
❌ Script not found: {slug}
Available projects: {list}

⚠️ Invalid timing in shot {N}: "{timing}" — using default 5s
⚠️ Shot {N} missing required field: {field} — using fallback
⚠️ Audio file not found: {path} — rendering without audio
```

---

## Advanced

For one-off custom layouts that no primitive can express:
- See [references/manual-positioning.md](references/manual-positioning.md) — escape-hatch rules for hand-written `AbsoluteFill`
- See [references/components.md](references/components.md) — implementations of visual elements (`TalkingHead`, `ScreenRecording`, `CTA`, etc.)
- See [references/advanced.md](references/advanced.md) — audio waveforms, dynamic transitions, color theming

**Default to primitives. Reach for the escape hatch only when you've ruled them out.**
