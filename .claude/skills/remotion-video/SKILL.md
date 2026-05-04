---
name: remotion-video
description: Convert video-script generated storyboard scripts into Remotion React compositions. Use when user asks to convert a script to Remotion, generate video code, or create Remotion compositions from scripts/. Generates code and starts Studio preview; does NOT render MP4. Run /video-review after this to review code and render video.
---

You are a Remotion specialist who converts video scripts into production-ready React video code for Douyin (1080×1920, 30fps).

## Remotion Best Practices

**Before generating any code, invoke the `remotion-best-practices` skill** to load authoritative Remotion knowledge. Key rules to follow:

- **All animations MUST use `useCurrentFrame()`. CSS transitions and Tailwind animation classes are FORBIDDEN** — they will not render correctly. See `rules/animations.md`.
- **Get `fps` from `useVideoConfig()`, never hardcode `30`.** This makes code portable across formats.
- **Read relevant rules as needed:**
  - `rules/timing.md` — spring presets (smooth/snappy/bouncy/heavy), easing curves
  - `rules/transitions.md` — `TransitionSeries` with fade/slide/wipe/flip
  - `rules/sequencing.md` — `premountFor` on every `<Sequence>`, `<Series>` for sequential content
  - `rules/audio.md` — trimBefore/trimAfter, volume callback, playbackRate, toneFrequency
  - `rules/fonts.md` — `@remotion/google-fonts` for Google Fonts, `@remotion/fonts` for local fonts
  - `rules/measuring-text.md` — `measureText()`, `fitText()` for responsive text sizing
  - `rules/text-animations.md` — typewriter effect, word highlighting
  - `rules/compositions.md` — `<Folder>` for organizing compositions in root.tsx
  - `rules/subtitles.md` — `@remotion/captions` TikTok-style captions with word highlighting

---

## VISUAL IDENTITY — Color Theme System (MANDATORY)

**Every project MUST receive a unique ColorTheme before any shot code is generated.** This prevents template-ification. Two consecutive projects MUST NOT use the same theme.

### Step 1: Pick a Theme

Analyze the script topic and mood, then assign ONE theme:

| Theme | Mood | Backgrounds | Accent | AccentAlt | CardBg | TextPrimary | TextSecondary | Animation |
|-------|------|-------------|--------|-----------|--------|-------------|---------------|-----------|
| **Sunrise** | 效率/数据/成长 | `#FFF7ED → #FED7AA`, `#FFFBEB → #FDE68A`, `#FEF3C7 → #FCD34D`, `#FFF1F2 → #FECDD3`, `#ECFDF5 → #A7F3D0` | `#F97316` | `#EAB308` | `#FFFBEB` | `#1C1917` | `#78716C` | bouncy |
| **Ocean** | 技术/产品/AI | `#F0F9FF → #BAE6FD`, `#ECFEFF → #A5F3FC`, `#F0FDFA → #99F6E4`, `#EFF6FF → #BFDBFE`, `#E0F2FE → #7DD3FC` | `#0EA5E9` | `#06B6D4` | `#F0F9FF` | `#0C4A6E` | `#64748B` | snappy |
| **Sakura** | 人文/创意/故事 | `#FDF2F8 → #FBCFE8`, `#FAF5FF → #D8B4FE`, `#F5F3FF → #C4B5FD`, `#FFF1F2 → #FECDD3`, `#FCE7F3 → #F9A8D4` | `#EC4899` | `#A855F7` | `#FDF2F8` | `#4A1D6A` | `#6B7280` | smooth |
| **Neon** | 前沿/突破/震撼 | `#18181B → #27272A`, `#1E1B4B → #312E81`, `#0F172A → #1E293B`, `#0C4A6E → #075985`, `#1A1A2E → #16213E` | `#A78BFA` | `#38BDF8` | `rgba(255,255,255,0.08)` | `#F8FAFC` | `#94A3B8` | snappy |
| **Forest** | 教程/方法论/实用 | `#F0FDF4 → #BBF7D0`, `#ECFDF5 → #A7F3D0`, `#FEFCE8 → #FEF08A`, `#F0FDF4 → #86EFAC`, `#ECFDF5 → #6EE7B7` | `#22C55E` | `#84CC16` | `#F0FDF4` | `#14532D` | `#6B7280` | bouncy |

### Step 2: Distribute Backgrounds

Assign a DIFFERENT background from the theme's palette to each shot. Cycle through them so no two adjacent shots share the same background.

Example with Sunrise theme (6 shots):
- Shot 1: `#FFF7ED → #FED7AA`
- Shot 2: `#FFFBEB → #FDE68A`
- Shot 3: `#FEF3C7 → #FCD34D`
- Shot 4: `#FFF1F2 → #FECDD3`
- Shot 5: `#ECFDF5 → #A7F3D0`
- Shot 6: `#FFF7ED → #FED7AA` (cycle back)

### Step 3: Use Theme Colors in ALL shot code

- `background` → pick from theme's backgrounds
- `color` on titles → `theme.textPrimary`
- `color` on subtitles/captions → `theme.textSecondary`
- `accent` / `border` / `highlight` → `theme.accent` or `theme.accentAlt`
- `cardBg` / `panelBg` → `theme.cardBg`
- `borderRadius` → use `16`–`24`px on cards for the playful style
- `boxShadow` → add `0 8px 32px rgba(0,0,0,0.08)` on cards for depth

### Step 4: Declare the Theme

Add a comment at the top of `composition.tsx`:
```tsx
// Theme: Sunrise — 效率/数据/成长
```

### Background Style Variations

Within the theme system, vary background styles across shots. Don't use `linear-gradient` for every shot:

| Style | CSS Pattern | When |
|-------|-------------|------|
| Gradient (default) | `linear-gradient(135deg, A, B)` | Most shots |
| Radial glow | `radial-gradient(circle at 50% 30%, A, B)` | Title/hook shots |
| Solid + decorative circles | `background: solidColor` + absolute positioned `<div>` circles with `opacity: 0.15` | CTA shots, data shots |
| Dot grid pattern | `background: color` + SVG `<pattern>` of dots | Timeline/process shots |
| AI background image | `<Img>` + overlay | When script specifies `画面类型: ai背景图` |

---

## Reusable Animation Hooks (PREFERRED)

**Hooks are the preferred way to add animations.** Use a hook first — fall back to inline `interpolate`/`spring` patterns (see ANIMATION LIBRARY below) only when no hook covers the need.

All hooks return `{ style: React.CSSProperties }` for direct use with `<div style={...}>`, except `useNumberRoll` which returns a `number` and `useTextReveal` which returns `{ visibleCount, getStyle }`. All hooks have a `.compute()` static method for testing.

### Import

```tsx
import { useSlideIn, useStagger, useNumberRoll, useFloat, useFadeIn, useScaleIn, useTextReveal, usePulse, useRotate } from '../../../components'
```

### Hook Reference

| Hook | Purpose | Key Params |
|------|---------|------------|
| `useFadeIn(frame, { delay?, duration? })` | Basic fade-in | delay: 0, duration: 15 |
| `useScaleIn(frame, { delay?, damping?, stiffness? })` | Elastic scale-in with opacity | Uses spring physics |
| `useSlideIn(frame, direction, { delay?, distance?, duration? })` | Slide from direction + fade | direction: `'left'` \| `'right'` \| `'up'` \| `'down'` |
| `useStagger(frame, count, delayBetween?, duration?)` | Staggered reveal for lists | Returns style array |
| `useNumberRoll(frame, target, { delay?, duration?, decimals? })` | Animate number 0 → target | Returns number, not style |
| `useTextReveal(frame, wordCount, delayBetween?)` | Per-word reveal | Returns `{ visibleCount, getStyle }` |
| `useFloat(frame, { amplitude?, speed? })` | Gentle vertical float | Continuous, sine-based |
| `usePulse(frame, { minScale?, maxScale?, speed? })` | Pulsing scale | Continuous |
| `useRotate(frame, { speed? })` | Continuous rotation | degrees/frame |

### Usage Examples

```tsx
// Fade in a title
const titleStyle = useFadeIn(frame, { delay: 5, duration: 15 })
<h1 style={{ fontSize: 72, ...titleStyle }}>标题</h1>

// Slide in from left
const cardStyle = useSlideIn(frame, 'left', { delay: 10, distance: 80 })
<div style={{ ...cardStyle }}>Card content</div>

// Staggered list items
const itemStyles = useStagger(frame, 4, 8) // 4 items, 8 frames between each
items.map((item, i) => <div key={i} style={itemStyles[i]}>{item}</div>)

// Number roll animation
const count = useNumberRoll(frame, 1600, { delay: 10, duration: 30 })
<span>{count}万粉丝</span>

// Per-word text reveal
const { visibleCount, getStyle } = useTextReveal(frame, 5, 4)
const words = ['这是', '一个', '精彩', '的视频', '标题']
<div>{words.slice(0, visibleCount).map((w, i) => <span key={i} style={getStyle(i)}>{w}</span>)}</div>

// Floating decorative element
const floatStyle = useFloat(frame, { amplitude: 15, speed: 0.05 })
<div style={{ ...floatStyle }}>Floating icon</div>
```

### Background Components

Rich background effects that work as the `backgroundLayer` prop on layout primitives.

**Import:**
```tsx
import { FloatingOrbs, GradientFlow, GridPattern, ParticleField } from '../../../components'
```

| Component | Effect | Usage |
|-----------|--------|-------|
| `FloatingOrbs` | Blurred gradient orbs floating | `<FloatingOrbs colors={['#3b82f640']} count={3} />` |
| `GradientFlow` | Animated gradient background | `<GradientFlow colors={['#0f172a', '#1e293b']} />` |
| `GridPattern` | Subtle grid lines | `<GridPattern color="#fff" opacity={0.05} />` |
| `ParticleField` | Floating particles | `<ParticleField count={20} color="#fff" />` |

**Usage pattern** — pass as `backgroundLayer` prop to layout primitives:
```tsx
<CenteredStack backgroundLayer={<FloatingOrbs colors={['#0ea5e940']} count={3} />}>
  {/* content */}
</CenteredStack>
```

---

## ANIMATION LIBRARY — Mandatory Variety

**Rule: Each video MUST use at least 3 DIFFERENT animation patterns across its shots.** Using `fadeIn` on every shot is forbidden.

### Animation Patterns

#### 1. fadeSlideUp — default for text blocks
```tsx
const fadeSlideUp = (delay: number) => {
  const opacity = interpolate(frame, [delay, delay + 12], [0, 1], { extrapolateRight: 'clamp' })
  const translateY = interpolate(frame, [delay, delay + 12], [30, 0], { extrapolateRight: 'clamp' })
  return { opacity, transform: `translateY(${translateY}px)` }
}
```

#### 2. scaleIn — for emphasis elements (data, icons)
```tsx
const scaleIn = (delay: number) => {
  const progress = spring({ frame, fps, config: { damping: 12, stiffness: 200 }, delay })
  const scale = interpolate(progress, [0, 1], [0.5, 1])
  const opacity = interpolate(progress, [0, 0.5], [0, 1])
  return { transform: `scale(${scale})`, opacity }
}
```

#### 3. slideInFromLeft / slideInFromRight — for list items, comparisons
```tsx
const slideInFromLeft = (delay: number) => {
  const opacity = interpolate(frame, [delay, delay + 15], [0, 1], { extrapolateRight: 'clamp' })
  const translateX = interpolate(frame, [delay, delay + 15], [-60, 0], {
    extrapolateRight: 'clamp', easing: Easing.out(Easing.quad),
  })
  return { opacity, transform: `translateX(${translateX}px)` }
}
```

#### 4. staggerReveal — for multiple parallel items
```tsx
// Apply to items with increasing delay
items.map((_, i) => fadeSlideUp(10 + i * 8))
```

#### 5. blurIn — for dramatic scene transitions
```tsx
const blurIn = (delay: number) => {
  const opacity = interpolate(frame, [delay, delay + 15], [0, 1], { extrapolateRight: 'clamp' })
  const blur = interpolate(frame, [delay, delay + 15], [20, 0], { extrapolateRight: 'clamp' })
  return { opacity, filter: `blur(${blur}px)` }
}
```

#### 6. typewriter — for numbers, titles
```tsx
const text = '1600万粉丝'
const visibleChars = Math.floor(frame * 0.8)
<span>{text.slice(0, visibleChars)}<Cursor /></span>
```

#### 7. fadeSlideDown — for headers, notifications, labels
```tsx
const fadeSlideDown = (delay: number) => {
  const opacity = interpolate(frame, [delay, delay + 12], [0, 1], { extrapolateRight: 'clamp' })
  const translateY = interpolate(frame, [delay, delay + 12], [-30, 0], { extrapolateRight: 'clamp' })
  return { opacity, transform: `translateY(${translateY}px)` }
}
```

#### 8. rotateIn — for dramatic emphasis, icon reveals
```tsx
const rotateIn = (delay: number) => {
  const progress = spring({ frame, fps, config: { damping: 12, stiffness: 150 }, delay })
  const rotation = interpolate(progress, [0, 1], [-15, 0])
  const scale = interpolate(progress, [0, 1], [0.6, 1])
  const opacity = interpolate(progress, [0, 0.4], [0, 1])
  return { transform: `rotate(${rotation}deg) scale(${scale})`, opacity }
}
```

#### 9. wordHighlight — spring-animated highlighter wipe on key terms
```tsx
const wordHighlight = (delay: number) => {
  const progress = spring({ frame, fps, config: { damping: 200 }, delay })
  return { scaleX: progress, transformOrigin: 'left center' }
}
// Usage:
<span style={{ position: 'relative', display: 'inline-block' }}>
  <span style={{
    position: 'absolute', left: 0, right: 0, top: '50%', height: '1.05em',
    transform: `translateY(-50%) scaleX(${highlightProgress})`,
    transformOrigin: 'left center', backgroundColor: theme.accent, borderRadius: '0.18em',
    opacity: 0.3,
  }} />
  <span style={{ position: 'relative', zIndex: 1 }}>关键词</span>
</span>
```

#### 10. pulse — breathing/pulsing effect for CTA, attention
```tsx
const pulse = (delay: number) => {
  const scale = interpolate(
    Math.sin((frame - delay) * 0.08),
    [-1, 1], [1, 1.05],
  )
  return { transform: `scale(${scale})` }
}
```

#### 11. revealExpand — width/height expand from zero, good for progress bars, underlines, cards
```tsx
const revealExpand = (delay: number) => {
  const progress = spring({ frame, fps, config: { damping: 15, stiffness: 120 }, delay })
  return { transform: `scaleX(${progress})`, transformOrigin: 'left center' }
}
// Usage on a container or underline:
<div style={{ width: '100%', height: 4, backgroundColor: theme.accent, ...revealExpand(10) }} />
```

#### 12. shake — horizontal shake for emphasis, warning
```tsx
const shake = (delay: number, intensity = 5) => {
  const shakeProgress = interpolate(frame, [delay, delay + 20], [0, 1], { extrapolateRight: 'clamp' })
  const decay = 1 - shakeProgress
  const offset = Math.sin(frame * 1.2) * intensity * decay
  return { transform: `translateX(${offset}px)` }
}
```

### Animation Distribution Strategy

Assign animations per shot type:

| Shot Type | Recommended Animation | Alternative |
|-----------|----------------------|-------------|
| Hook/Title | `typewriter` + `blurIn` | `rotateIn` |
| Data/Stats | `scaleIn` + `typewriter` | `fadeSlideUp` with stagger |
| Comparison | `slideInFromLeft` + `slideInFromRight` | `blurIn` |
| Process/Steps | `staggerReveal` (items appear one by one) | `fadeSlideDown` cascade |
| Quote/Highlight | `scaleIn` (dramatic) | `wordHighlight` |
| CTA | `pulse` + `scaleIn` | `fadeSlideUp` |
| Warning/Error | `shake` | `rotateIn` |
| Progress/Ranking | `revealExpand` + `staggerReveal` | `scaleIn` |

---

## FATAL RULES — read before generating any shot

These rules cause the most recurring layout bugs. Violating any one of them is a Critical issue in `/video-review`.

1. **CSS transitions/animations are FORBIDDEN.** Use `useCurrentFrame()` + `interpolate()`/`spring()`. CSS `transition`, `animation`, and Tailwind animation classes will NOT render correctly. See `remotion-best-practices` → `rules/animations.md`.

2. **Get `fps` from `useVideoConfig()`, never hardcode `30`.** This makes code portable across formats (Douyin 30fps, YouTube 60fps, etc.).

3. **Compose Layout Primitives first.** Every shot must start from one of:
   `CenteredStack` · `HubLayout` · `TwoColumnCompare` · `TimelineFlow`.
   Hand-written `AbsoluteFill` with manual padding is allowed only when no primitive fits — and you must follow [references/manual-positioning.md](references/manual-positioning.md).

4. **NEVER hand-write `padding: '120px 40px 200px'`.** Use `<SafeArea>` or a layout primitive (which wraps it). Constants live in `components/constants.ts` as the single source of truth.

5. **Content must NOT enter the subtitle zone (`bottom < 420`).** That space is reserved for subtitles + Douyin UI. Any content `<div style={{ bottom: 200|240|... }}>caption</div>` is wrong — use a primitive's `footer` slot, or `bottom: SAFE_AREA.CONTENT_BOTTOM` (= 420).

6. **NEVER mix flex centering with hand-coded SVG pixel coordinates.** If a parent uses `justifyContent: 'center'`, you cannot reliably write `<line x1="540" y1="920" />` — the line breaks the moment any padding/sibling changes. Use `HubLayout` instead (it computes node + line coordinates from the same source).

7. **Always center absolute elements with `transform: translate(-50%, -50%)`.** Never use `left: x - width/2` — the moment text length changes, alignment breaks.

8. **NEVER use `opacity: bool ? 1 : 0` for transitions.** Always `interpolate(...)` with overlapping ranges between adjacent elements. See [references/manual-positioning.md](references/manual-positioning.md#animation-safety).

9. **Always pass `extrapolateRight: 'clamp'` to `interpolate`.** Otherwise values drift past the last keyframe.

10. **Always use `staticFile()` for audio paths.** Plain strings 404 during CLI render.

11. **Always add `premountFor={1 * fps}` to `<Sequence>`.** This loads the component before it plays, preventing blank frames. See `remotion-best-practices` → `rules/sequencing.md`.

12. **Use `TransitionSeries` for scene transitions** instead of custom fade/slide wrappers. See `remotion-best-practices` → `rules/transitions.md`.

13. **`TransitionSeries.Overlay` and `TransitionSeries.Transition` are MUTUALLY EXCLUSIVE at the same gap.** Between any two Sequences, you may use EITHER an Overlay OR a Transition — NEVER both. If you need both a visual effect (like LightLeak) AND a transition (like flip), put the effect INSIDE the Sequence as a child element, not between Sequences:
    ```tsx
    // WRONG — Overlay + Transition at same gap = runtime error
    <TransitionSeries.Sequence>...</TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={flip()} />
    <TransitionSeries.Overlay><LightLeak /></TransitionSeries.Overlay>
    <TransitionSeries.Sequence>...</TransitionSeries.Sequence>

    // CORRECT — effect inside Sequence, transition between Sequences
    <TransitionSeries.Sequence>
      <Shot5 />
      <LightLeak />  {/* effect as child of Sequence */}
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={flip()} />
    <TransitionSeries.Sequence>...</TransitionSeries.Sequence>
    ```

13. **Visual Variety is MANDATORY.** Assign a ColorTheme (see Visual Identity section above). Each video MUST use ≥3 different animation patterns. No two adjacent shots may share the same background. All colors must come from the assigned theme — NEVER hardcode `#0f172a`, `#1e293b`, `#94a3b8`, or `#fff` as defaults.

---

## Quick Start

```
/remotion-video <script-file-or-slug>
```

Example: `/remotion-video 2026-04-22-gpt-image2-compare`

## Workflow

### Step 1: Locate Script
Search `projects/` for the matching `script.md` (use slug if no full path provided).

### Step 2: Parse Script + Assign Theme
Extract from video-script format:
- Video title → composition name
- Each shot/镜头 → component + duration
- 画面 → layout primitive choice (see "Picking a Layout Primitive" below)
- 口播 → subtitle text/segments
- 字幕 → on-screen text overlay (use Layout primitive `header`/`footer` slots)

**Then assign a ColorTheme** (see "VISUAL IDENTITY" section above):
1. Analyze the script topic and mood
2. Pick the best matching theme from the 5 options (Sunrise/Ocean/Sakura/Neon/Forest)
3. Distribute backgrounds from the theme's palette across shots (no adjacent duplicates)
4. Record the theme choice for use in all shot code generation

### Step 3: Check Voiceover Audio (MANDATORY — HARD GATE)

**This step MUST complete before any code generation.** If no audio files are found, STOP and ask the user to generate voiceover first. Do NOT proceed to Step 4.

Look in `projects/<YYYY-MM-DD-<slug>>/assets/audio/`. Detection priority:
1. **Manifest + split files**: `voiceover-manifest.json` + `voiceover-01.mp3, voiceover-02.mp3, ...` — one per shot, with Whisper-aligned subtitle timing
2. **Full file only**: `voiceover-full.mp3` — single audio, no per-shot timing

**If neither is found, STOP immediately and output:**
```
❌ 未找到语音文件

在 `projects/<YYYY-MM-DD-<slug>>/assets/audio/` 目录下未检测到语音文件。

请先生成语音文件：
  /voiceover-tts <project-slug>

生成完成后再重新运行 /remotion-video。
```
Do NOT continue to Step 4 or generate any code.

If `voiceover-manifest.json` exists, read it to get:
- `segments[].duration_seconds` → shot duration
- `segments[].subtitles[]` → per-sentence subtitle timing with `start`, `end`, `duration`
- `segments[].file` → per-shot audio file name

### Step 3.5: Parse Audio Config

Parse BGM and SFX annotations from the script.

1. **Parse BGM**: Look for `**BGM**: <style> | <tempo> | <volume>` after the title. If missing, skip BGM entirely.
2. **Check BGM asset**: Verify `remotion/public/audio/bgm/<mapped-style>-<tempo>.mp3` exists. If missing, warn user and skip BGM (do NOT download at render time).
3. **Parse SFX**: Scan each shot for `**音效**: <effect-list>`. Build an array of SFX configs per shot.

**New format parsing** (`mood/action/intensity`):
- Split by comma for multiple effects
- Split each by `/` into [mood, action, intensity] (defaults: neutral, emphasis, medium)
- Map to `SFXConfig`: `{ mood, action, intensity, layer: auto-inferred }`

**Legacy format** (`whoosh`, `impact`, etc.):
- Use as `type` field: `{ type: 'impact' }`
- Auto-translated to taxonomy triple by SFXLayer

4. **Check SFX assets**: For each parsed SFX config, use `matchSFX()` to resolve the file path. If `matchSFX()` returns null, fall back to `SFX_FILE_MAP` for legacy types. If still not found, warn and skip that effect (don't block render).

**BGM style mapping** (Chinese → directory name):

| Script | Directory |
|--------|-----------|
| 科技电子 | `tech` |
| 轻松愉快 | `upbeat` |
| 紧张悬疑 | `tense` |
| 温馨抒情 | `warm` |
| 史诗大气 | `epic` |

**SFX resolution** (handled by `matchSFX()` + `SFX_FILE_MAP` fallback):

New files follow naming: `{mood}-{action}-{intensity}.mp3`
Legacy files kept at: `/audio/sfx/{old-name}.mp3`

| Effect | Resolved file (new) | Fallback (legacy) |
|--------|-------------------|-------------------|
| `epic/transition/strong` | `epic-transition-strong.mp3` | — |
| `energetic/emphasis/strong` | `energetic-emphasis-strong.mp3` | — |
| `impact` (legacy) | `neutral-emphasis-strong.mp3` | `/audio/sfx/impact.mp3` |
| `whoosh` (legacy) | `neutral-transition-medium.mp3` | `/audio/sfx/whoosh.mp3` |

### Step 3.6: Load Research Assets (if available)

Check for `projects/<YYYY-MM-DD-<slug>>/assets/research/manifest.json`. If it exists:

1. **Read the manifest** — catalog all `reference` category images:
   ```json
   { "items": [{ "id": "tavily-001", "local_path": "research/reference/tavily-001.png", "source_url": "...", "width": 1920, "height": 1200 }] }
   ```
   Only use items with `"category": "reference"`. Ignore `"category": "stock"` unless the script explicitly says `使用 stock 素材: <filename>`.

2. **Match images to shots** — for each shot, compare its `画面` description to available reference images. A reference image is a good match when:
   - The shot describes product UI, actual interface screenshots, or feature demos that the image depicts
   - Example: shot says "6列看板" → manifest has kanban board screenshot → match

3. **Copy matched images to public/** so Remotion can access them via `staticFile()`:
   ```bash
   mkdir -p remotion/public/images/<slug>/research
   cp projects/<YYYY-MM-DD-<slug>>/assets/research/reference/<filename> remotion/public/images/<slug>/research/
   ```

4. **Record the mapping** (shot index → image file list) for use in Step 5.

**How to use research images in shots:**

Use research screenshots as **visual evidence panels** — show the actual product UI alongside the animated explanation. Pattern:

```tsx
import { Img, staticFile } from 'remotion'

// Research screenshot panel (framed card, not full-screen)
<div style={{
  borderRadius: 20, overflow: 'hidden',
  boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
  border: '1px solid rgba(255,255,255,0.15)',
  opacity: screenshotOpacity,
  transform: `scale(${screenshotScale})`,
}}>
  <Img
    src={staticFile(`images/<slug>/research/<filename>`)}
    style={{ width: '100%', height: 'auto', display: 'block' }}
  />
</div>
```

**Layout strategies:**
- **Side panel**: Place screenshot in a `TwoColumnCompare` or as a side card in `CenteredStack`
- **Background overlay**: Use as full-screen background with `rgba(0,0,0,0.6)` overlay for text readability (same as `ai背景图` pattern)
- **Inset card**: Float as an animated card within the shot, revealing as the narrator explains the feature

**When to use:**
- Shot showcases actual product/tool UI that reference images depict
- Reference image adds visual proof that matches the spoken content
- Prefer using images for shots that would otherwise be plain text/icons

**When NOT to use:**
- Don't replace a rich animated Remotion visualization (hub, timeline, compare) with a static screenshot unless the image is clearly more informative
- Don't use images that are irrelevant to the shot's 画面 description
- Don't cover research image licenses — they are for production use as visual references

### Step 4: Project Setup (First Time Only)
If `remotion/` doesn't exist:
1. Copy `assets/remotion-template`
2. `cd remotion && pnpm install`
3. `npx remotion add @remotion/media`

### Step 5: Generate Components
For each shot:

1. **Pick a layout primitive** based on 画面 description (see table below).
2. **Check for `画面类型: 固定图片`** — if present, resolve the image:
   - If the shot references a stock asset (e.g., `使用 stock 素材: pixabay-xxx.jpg`):
     a. Verify the file exists in `projects/<YYYY-MM-DD-<slug>>/assets/research/stock/`
     b. Copy it to `remotion/public/images/<slug>/` so `staticFile()` can access it:
        ```bash
        mkdir -p remotion/public/images/<slug>
        cp projects/<YYYY-MM-DD-<slug>>/assets/research/stock/<filename> remotion/public/images/<slug>/
        ```
     c. Use the `<Img>` + overlay pattern (same as `ai背景图`) with `staticFile(`images/<slug>/<filename>`)`
   - If the shot references a user-provided image (e.g., from `assets/images/`):
     a. Copy to `remotion/public/images/<slug>/` and use `staticFile()`
3. **Check for `画面类型: ai背景图`** — if present, generate the background image BEFORE writing the shot component:
   - Read `**背景图提示词**` from the script shot
   - Call `scripts/generate_image.py` to generate a portrait background (see "AI-Generated Background Images" section)
   - Output path: `remotion/public/images/<slug>/shot<N>-bg.png`
4. **Compute duration** from audio manifest (preferred) or script timing label.
5. **Write `src/projects/<slug>/shots/Shot<N>.tsx`** — wrap content in the chosen primitive.
   - For `固定图片` or `ai背景图` shots: use `<Img>` + overlay pattern instead of `background` prop (see code example below)
   - For `remotion` shots: use the primitive's `background` prop as normal
6. **Pass subtitle props** — `subtitle` (single string) or `subtitleSegments + videoOffset` (progressive).

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
| 固定图片 / ai背景图 / 需要视觉冲击 | `<Img>` + overlay (see AI-Generated Background Images) | Stock photo from research or AI-generated background |
| 产品截图 / 调研图 / 展示真实界面 | `CenteredStack` + research screenshot panel (see Step 3.6) | Research reference images from manifest.json as framed evidence cards |
| 切到 X 界面 / 演示 | `CenteredStack` + `<ScreenRecording>` | Stack the screen-recording mock as the body |
| 关注按钮 / CTA | `CenteredStack` + `<CTA>` | Stack the CTA component as the body |

If nothing fits, use `<SafeArea>` directly and follow [references/manual-positioning.md](references/manual-positioning.md).

### CenteredStack — default container

```tsx
import { CenteredStack } from '../../../components'

export const Shot1: React.FC<ShotProps> = ({ subtitle }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const titleAnim = scaleIn(5)

  return (
    <CenteredStack
      background="linear-gradient(135deg, #FFF7ED, #FED7AA)"  // from theme palette
      maxWidth={900}
      gap={32}
      subtitle={subtitle}
    >
      <h1 style={{ fontSize: 72, fontWeight: 900, color: '#1C1917', ...titleAnim }}>标题</h1>
      <p style={{ fontSize: 36, color: '#78716C' }}>说明文字</p>
    </CenteredStack>
  )
}
```

Props: `background`, `maxWidth` (default 900), `gap` (default 32), `align`, `justify`, `subtitle`, `subtitleSegments`, `videoOffset`.

### HubLayout — center + surrounding nodes

Solves the recurring "SVG line doesn't align with element" bug. Both nodes AND lines are computed from the same hub center.

```tsx
import { HubLayout } from '../../../components'

<HubLayout
  background="linear-gradient(135deg, #F0F9FF, #BAE6FD)"  // Ocean theme
  center={{
    node: <Circle size={200} color="#0EA5E9">队长</Circle>,
    scale: centerScale,
  }}
  surrounding={[
    { position: 'top-left',     node: <Circle size={140} color="#06B6D4">队友1</Circle>, opacity: fadeIn },
    { position: 'top-right',    node: <Circle size={140} color="#06B6D4">队友2</Circle>, opacity: fadeIn },
    { position: 'bottom-left',  node: <Circle size={140} color="#06B6D4">队友3</Circle>, opacity: fadeIn },
    { position: 'bottom-right', node: <Circle size={140} color="#06B6D4">队友4</Circle>, opacity: fadeIn },
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
  background="linear-gradient(135deg, #FFF7ED, #FFFBEB)"  // Sunrise theme
  left={{
    title: '子Agent',
    body: <DiagramSubAgent />,
    caption: '只汇报结果',
    accent: '#F97316',  // theme.accent
    opacity: leftOpacity,
  }}
  right={{
    title: 'Agent Teams',
    body: <DiagramTeams />,
    caption: '队友间直接交流',
    accent: '#EAB308',  // theme.accentAlt
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
  background="linear-gradient(135deg, #F0FDF4, #BBF7D0)"  // Forest theme
  accent="#22C55E"
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

Use `<Folder>` to organize compositions in Remotion Studio sidebar. See `remotion-best-practices` → `rules/compositions.md`.

```tsx
import { Composition, Folder } from 'remotion'

// In root.tsx:
<Folder name="Projects">
  <Composition
    id="GptImage2Compare"
    component={GptImage2Compare}
    durationInFrames={2550}
    fps={30}
    width={1080}
    height={1920}
    defaultProps={{}}
  />
</Folder>
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

<Audio src={staticFile('/audio/<slug>/voiceover-01.mp3')} />
```

Plain string paths 404 during CLI render.

### Recommended: One Audio Per Sequence (per-shot files)

When manifest has per-shot audio files (`voiceover-01.mp3`, `voiceover-02.mp3`, ...), place one `<Audio>` per `<Sequence>`. Each shot is self-contained — no timing offset math needed.

```tsx
const { fps } = useVideoConfig()

<AbsoluteFill>
  <Sequence from={0} durationInFrames={shot1Frames} premountFor={1 * fps}>
    <Shot1 subtitleSegments={manifest.segments[0].subtitles} videoOffset={0} />
    <Audio src={staticFile('/audio/<slug>/voiceover-01.mp3')} />
  </Sequence>
  <Sequence from={shot1Frames} durationInFrames={shot2Frames} premountFor={1 * fps}>
    <Shot2 subtitleSegments={manifest.segments[1].subtitles} videoOffset={shot1Duration} />
    <Audio src={staticFile('/audio/<slug>/voiceover-02.mp3')} />
  </Sequence>
</AbsoluteFill>
```

### Fallback: Full audio (single track)

Use `voiceover-full.mp3` at composition level when per-shot files aren't available. Requires `videoOffset` on every shot.

```tsx
<AbsoluteFill>
  <Audio src={staticFile('/audio/<slug>/voiceover-full.mp3')} volume={1} />
  <Sequence from={0} durationInFrames={shot1Frames} premountFor={30}>
    <Shot1 subtitleSegments={shots[1].segments} videoOffset={shots[1].startTime} />
  </Sequence>
  <Sequence from={shot1Frames} durationInFrames={shot2Frames} premountFor={30}>
    <Shot2 subtitleSegments={shots[2].segments} videoOffset={shots[2].startTime} />
  </Sequence>
</AbsoluteFill>
```

### Always add `premountFor`

```tsx
<Sequence from={0} durationInFrames={150} premountFor={30}>
  <Shot1 subtitle="第一句话" />
</Sequence>
```

This loads the component before it plays, preventing blank frames. See `remotion-best-practices` → `rules/sequencing.md`.

### Advanced Audio (from `remotion-best-practices` → `rules/audio.md`)

```tsx
// Fade in audio over 1 second
<Audio src={staticFile('/audio/slug/voiceover-full.mp3')}
  volume={(f) => interpolate(f, [0, 1 * fps], [0, 1], { extrapolateRight: 'clamp' })}
/>

// Trim silence from start/end
<Audio src={staticFile('/audio/slug/voiceover-full.mp3')}
  trimBefore={0.5 * fps}  // Skip first 0.5s
  trimAfter={30 * fps}    // End at 30s mark
/>

// Playback speed
<Audio src={staticFile('/audio/slug/voiceover-full.mp3')} playbackRate={1.5} />

// Pitch shift (server-side render only)
<Audio src={staticFile('/audio/slug/voiceover-full.mp3')} toneFrequency={1.2} />
```

### BGM Integration

If BGM config was parsed in Step 3.5, add `<BGMAudio>` at the top of the composition, before the voiceover `<Audio>`:

```tsx
import { BGMAudio } from '../../../components'

// Inside the composition, before voiceover Audio:
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

If a shot has no SFX effects, omit `<SFXLayer>` entirely.

### Audio-Driven Timing

When `voiceover-manifest.json` exists, compute shot durations and subtitle timing from it:

```javascript
// Each segment = one shot, with Whisper-aligned subtitle timing
const shotFrames = manifest.segments.map(s => Math.round(s.duration_seconds * fps))
const totalFrames = shotFrames.reduce((a, b) => a + b, 0)

// Subtitle segments come directly from manifest — no manual assembly needed
const shot1Subtitles = manifest.segments[0].subtitles
// [{ text: "...", start: 0, end: 4.94, duration: 4.94 }, ...]
```

No need to manually assemble subtitle segments across shots. Each shot's `subtitles` array contains its own Whisper-aligned timing.

---

## Subtitles (always include for 口播 shots)

Layout primitives auto-render subtitles when you pass `subtitle` (string) or `subtitleSegments + videoOffset` (progressive). You should not manually place a `<Subtitle>` inside a primitive's children — the primitive does it for you.

### When to use which

| Audio shape | Subtitle prop |
|-------------|---------------|
| Per-shot files + manifest subtitles | `subtitleSegments={manifest.segments[i].subtitles} videoOffset={shotStartSec}` |
| Single `voiceover-full.mp3` + manifest segments | `subtitleSegments={segments} videoOffset={shotStartSec}` |
| Single `<Audio>` per shot, no manifest | `subtitle="full text"` |
| No audio | omit both |

### Punctuation handling

`Subtitle` and `ProgressiveSubtitle` call `cleanSubtitleText()` from `components/subtitle-utils.ts`. This function strips **only periods** (`。` and `.`). All other punctuation (commas `，,`、spaces、semicolons、colons、exclamation marks、question marks) MUST be preserved — they are essential for readability and natural speech rhythm.

**NEVER modify `cleanSubtitleText` to strip commas, spaces, or other punctuation.** If you need to adjust it, the regex in `subtitle-utils.ts` must remain `/[。.]/g` (periods only).

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
import { useCurrentFrame, useVideoConfig, interpolate, spring, staticFile, Easing } from 'remotion'
import { CenteredStack /* or HubLayout / TwoColumnCompare / TimelineFlow */ } from '../../../components'
```

Only import primitives you actually use. Always import `useVideoConfig` — never hardcode `fps`.

### Shot signature

```tsx
interface ShotProps {
  subtitle?: string
  subtitleSegments?: SubtitleSegment[]
  videoOffset?: number
}

export const Shot1: React.FC<ShotProps> = ({ subtitle, subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  // Pick animation from Animation Library — NOT always fadeIn!
  const titleAnim = fadeSlideUp(5)

  return (
    <CenteredStack
      background="..."  // from assigned theme palette
      subtitle={subtitle}
      subtitleSegments={subtitleSegments}
      videoOffset={videoOffset}
    >
      {/* content with themed colors and varied animations */}
    </CenteredStack>
  )
}
```

### Duration

`durationInFrames = Math.round(seconds * fps)` — use `fps` from `useVideoConfig()`, not hardcoded `30`.

### File layout

| File | Path |
|------|------|
| Shot | `src/projects/<slug>/shots/Shot<N>.tsx` |
| Composition | `src/projects/<slug>/composition.tsx` |
| Registration | `src/root.tsx` |

Slug is lowercase kebab-case derived from the project directory (date prefix removed).

---

## Scene Transitions

**`TransitionSeries` is the DEFAULT composition pattern.** Always use it unless the script has no transitions. See `remotion-best-practices` → `rules/transitions.md` for full docs.

### Prerequisites

```bash
cd remotion && npx remotion add @remotion/transitions
```

### Reading transitions from script

Each shot in the script specifies `**转场效果**` (e.g., `fade`, `slide`, `wipe`, `flip`, `clock-wipe`, `none`). Map these to the corresponding Remotion transition:

| Script value | Import | Notes |
|--------------|--------|-------|
| `fade` | `@remotion/transitions/fade` | Default, smooth |
| `slide` | `@remotion/transitions/slide` | Use script context to pick direction |
| `slide(from-right)` | `@remotion/transitions/slide` | Explicit direction |
| `wipe` | `@remotion/transitions/wipe` | Horizontal wipe |
| `flip` | `@remotion/transitions/flip` | 3D card flip |
| `clock-wipe` | `@remotion/transitions/clock-wipe` | Radial clock wipe |
| `none` | No transition | Direct cut |

### Default transition when script doesn't specify

Use `fade()` with 15 frames for most transitions. Use `slide()` with alternating directions for variety between core content shots.

### Composition with transitions

```tsx
import { TransitionSeries, linearTiming } from '@remotion/transitions'
import { fade } from '@remotion/transitions/fade'
import { slide } from '@remotion/transitions/slide'

<TransitionSeries>
  <TransitionSeries.Sequence durationInFrames={shot1Frames}>
    <Shot1 subtitleSegments={shots[1]} videoOffset={0} />
  </TransitionSeries.Sequence>
  <TransitionSeries.Transition
    presentation={fade()}
    timing={linearTiming({ durationInFrames: 15 })}
  />
  <TransitionSeries.Sequence durationInFrames={shot2Frames}>
    <Shot2 subtitleSegments={shots[2]} videoOffset={shot1Duration} />
  </TransitionSeries.Sequence>
  <TransitionSeries.Transition
    presentation={slide({ direction: 'from-right' })}
    timing={linearTiming({ durationInFrames: 12 })}
  />
  <TransitionSeries.Sequence durationInFrames={shot3Frames}>
    <Shot3 subtitleSegments={shots[3]} videoOffset={shot1Duration + shot2Duration} />
  </TransitionSeries.Sequence>
</TransitionSeries>
```

### Transition Wrapper Component

For simpler per-shot transitions without `TransitionSeries`, use the `Transition` wrapper component:

```tsx
import { Transition } from '../../../components'

// In composition, wrap each shot in Transition:
<Sequence from={shotFrames[1].from} durationInFrames={shotFrames[1].durationInFrames} premountFor={1 * fps}>
  <Transition type="slide-left">
    <Shot2 ... />
  </Transition>
</Sequence>
```

**Available types:** `fade` (default), `slide-left`, `slide-right`, `slide-up`, `slide-down`, `zoom-in`, `zoom-out`

Use `TransitionSeries` for complex multi-scene compositions (recommended). Use the `Transition` wrapper for simple one-off transitions or when you need per-shot control without a full `TransitionSeries` setup.

**Important:** Transitions overlap adjacent scenes, so total duration = sum(durations) - sum(transition durations). Use `timing.getDurationInFrames({ fps })` to calculate.

### Light Leak Overlay (RECOMMENDED)

Add `<LightLeak>` overlays at major scene transitions (e.g., hook → pain point, core → CTA) for cinematic polish.

```bash
cd remotion && npx remotion add @remotion/light-leaks
```

**Pattern A — LightLeak only (no Transition at same gap):**
```tsx
import { LightLeak } from '@remotion/light-leaks'

// Between major scene changes where there's NO TransitionSeries.Transition:
<TransitionSeries.Sequence>...</TransitionSeries.Sequence>
<TransitionSeries.Overlay durationInFrames={30}>
  <LightLeak seed={3} hueShift={240} />
</TransitionSeries.Overlay>
<TransitionSeries.Sequence>...</TransitionSeries.Sequence>
```

**Pattern B — LightLeak + Transition (put LightLeak INSIDE the Sequence):**
```tsx
// When you need BOTH a transition AND a light leak:
<TransitionSeries.Sequence durationInFrames={shotFrames[4]}>
  <Shot5 subtitleSegments={segments[5]} videoOffset={shotStartSeconds[4]} />
  <SFXLayer effects={sfxByShot[5]} />
  <LightLeak seed={5} hueShift={240} />
</TransitionSeries.Sequence>
<TransitionSeries.Transition presentation={flip()} timing={TRANSITION_FRAMES['5→6']} />
<TransitionSeries.Sequence durationInFrames={shotFrames[5]}>
  <Shot6 ... />
</TransitionSeries.Sequence>
```

**Usage guidelines:**
- Use at 1-2 key transition points per video (not every transition)
- `hueShift`: 0 = warm orange/yellow (default), 120 = green, 240 = blue
- Different `seed` values produce different light patterns
- Match hue to the video's color scheme
- **NEVER put `TransitionSeries.Overlay` and `TransitionSeries.Transition` at the same gap** — they are mutually exclusive

---

## Spring Animation Presets

From `remotion-best-practices` → `rules/timing.md`. Use named presets instead of magic numbers:

| Preset | Config | Use Case |
|--------|--------|----------|
| **smooth** | `{ damping: 200 }` | Subtle reveals, no bounce |
| **snappy** | `{ damping: 20, stiffness: 200 }` | UI elements, quick entrance |
| **bouncy** | `{ damping: 8 }` | Playful animations, emphasis |
| **heavy** | `{ damping: 15, stiffness: 80, mass: 2 }` | Slow, weighty elements |

```tsx
const { fps } = useVideoConfig()
const scale = spring({ frame, fps, config: { damping: 200 } }) // smooth
```

Combine spring with interpolate for custom ranges:

```tsx
const springProgress = spring({ frame, fps })
const rotation = interpolate(springProgress, [0, 1], [0, 360])
```

### Easing curves

For non-spring animations, use the `Easing` API:

```tsx
import { Easing } from 'remotion'

const value = interpolate(frame, [0, 100], [0, 1], {
  easing: Easing.inOut(Easing.quad),
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
})
```

Curves: `Easing.quad` · `Easing.sin` · `Easing.exp` · `Easing.circle`
Convexities: `Easing.in` (slow start) · `Easing.out` (fast start) · `Easing.inOut`

---

## Text Animation Patterns

From `remotion-best-practices` → `rules/text-animations.md`. Each shot may specify `**文字特效**` in the script.

### Typewriter effect (script: `typewriter`)

Always use string slicing, never per-character opacity:

```tsx
const text = 'Hello World'
const charsPerFrame = 0.5
const visibleChars = Math.floor(frame * charsPerFrame)
<span>{text.slice(0, visibleChars)}</span>
```

Add a blinking cursor for extra polish:
```tsx
const cursorOpacity = interpolate(frame % 16, [0, 8, 16], [1, 0, 1], {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
})
<span style={{ opacity: cursorOpacity }}>▌</span>
```

### Word highlighting (script: `highlight`)

Spring-animated highlighter wipe on key words:

```tsx
const highlightProgress = spring({ frame, fps, config: { damping: 200 }, delay: 20 })
<span style={{ position: 'relative', display: 'inline-block' }}>
  <span style={{
    position: 'absolute', left: 0, right: 0, top: '50%', height: '1.05em',
    transform: `translateY(-50%) scaleX(${highlightProgress})`,
    transformOrigin: 'left center', backgroundColor: '#A7C7E7', borderRadius: '0.18em',
  }} />
  <span style={{ position: 'relative', zIndex: 1 }}>关键词</span>
</span>
```

### When to use which

| Script value | Use for | Shot type |
|-------------|---------|-----------|
| `typewriter` | Data reveals, number countdowns, step-by-step | Data/stat shots |
| `highlight` | Key terms, product names, core concepts | Any shot with emphasis words |
| `none` | Standard fade-in text | Most shots |

---

## Fonts

From `remotion-best-practices` → `rules/fonts.md`.

### Google Fonts (recommended)

```bash
cd remotion && pnpm exec remotion add @remotion/google-fonts
```

```tsx
import { loadFont } from '@remotion/google-fonts/NotoSansSC'

const { fontFamily } = loadFont('normal', {
  weights: ['400', '700'],
  subsets: ['chinese-simplified', 'latin'],
})

// Use in components:
<div style={{ fontFamily, fontSize: 48 }}>中文标题</div>
```

### Responsive text sizing

Use `fitText()` to auto-size text within a container. See `remotion-best-practices` → `rules/measuring-text.md`:

```tsx
import { fitText } from '@remotion/layout-utils'

const { fontSize } = fitText({
  text: 'Long title that needs to fit',
  withinWidth: 900,
  fontFamily: 'Noto Sans SC',
  fontWeight: 'bold',
})

<div style={{ fontSize: Math.min(fontSize, 80), fontFamily: 'Noto Sans SC' }}>
  Long title that needs to fit
</div>
```

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
❌ Audio not found: {path} — STOP and ask user to run /voiceover-tts first
```

---

## AI-Generated Background Images

When the script specifies `画面类型: ai背景图`, generate a background image via the shared
`scripts/generate_image.py` helper (same script as `/video-cover`).

### When to use

- Hook/title shots that need visual impact beyond gradients
- Concept illustration shots where a photographic background enhances the message
- Any shot where `linear-gradient` feels too plain

### Generation workflow

1. Read the `**背景图提示词**` from the script shot
2. Call `scripts/generate_image.py` with a portrait size (best fit for 1080x1920 output)
3. The script writes directly to `remotion/public/images/<slug>/shot<N>-bg.png`
4. Reference in the shot component with `<Img src={staticFile(`images/${slug}/shot${N}-bg.png`)} />`

### Script call

```bash
python scripts/generate_image.py \
  remotion/public/images/<slug>/shot<N>-bg.png \
  "<背景图提示词 from script, no text, no orientation>" \
  --size 1024x1536
```

Provider/key/model are read from `.env` (`IMAGE_API_KEY`, `IMAGE_API_BASE_URL`, `IMAGE_MODEL`).
For vertical Douyin shots, prefer a portrait size like `1024x1536` so the image already
matches the 1080x1920 frame after `objectFit: cover`.

### Usage in shot component

```tsx
import { Img, staticFile } from 'remotion'

// As full-screen background:
<AbsoluteFill>
  <Img
    src={staticFile(`images/${slug}/shot1-bg.png`)}
    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
  />
  {/* Dark overlay for text readability */}
  <AbsoluteFill style={{ backgroundColor: 'rgba(0,0,0,0.4)' }} />
  {/* Foreground content */}
  <CenteredStack subtitle={subtitle}>
    <h1 style={{ fontSize: 80, color: '#fff' }}>标题</h1>
  </CenteredStack>
</AbsoluteFill>
```

**Important:** Background prompts must NOT contain text or orientation keywords. The image will be used as a backdrop with overlaid Remotion content.

---

## Lottie Animations

Use Lottie animations for decorative elements that enhance visual richness. See `remotion-best-practices` → `rules/lottie.md`.

### Prerequisites

```bash
cd remotion && pnpm exec remotion add @remotion/lottie
```

### When to use

- Decorative tech particles / data flow animations for background ambiance
- Animated icons for feature highlights
- Loading / processing indicators
- Any complex vector animation that's impractical to code manually

### Usage

```tsx
import { Lottie, LottieAnimationData } from '@remotion/lottie'
import { useEffect, useState, cancelRender, continueRender, delayRender } from 'remotion'

const MyShot: React.FC = () => {
  const [handle] = useState(() => delayRender('Loading Lottie'))
  const [animationData, setAnimationData] = useState<LottieAnimationData | null>(null)

  useEffect(() => {
    fetch(staticFile('animations/particles.json'))
      .then((data) => data.json())
      .then((json) => { setAnimationData(json); continueRender(handle) })
      .catch((err) => cancelRender(err))
  }, [handle])

  if (!animationData) return null

  return (
    <AbsoluteFill>
      <Lottie animationData={animationData} style={{ width: '100%', height: '100%' }} />
      {/* Foreground content */}
    </AbsoluteFill>
  )
}
```

**Note:** Place Lottie JSON files in `remotion/public/animations/`. Find free Lottie animations at [LottieFiles](https://lottiefiles.com/).

---

## Animated Charts (for data comparison shots)

When a shot presents data comparisons, use animated charts instead of static numbers. See `remotion-best-practices` → `rules/charts.md`.

### Bar chart with staggered spring animation

```tsx
const bars = data.map((item, i) => {
  const height = spring({ frame, fps, delay: i * 5, config: { damping: 200 } })
  return (
    <div key={i} style={{ height: height * item.value, backgroundColor: item.color }}>
      <span>{item.label}</span>
    </div>
  )
})
```

### Animated line chart with path drawing

```tsx
import { evolvePath } from '@remotion/paths'

const progress = interpolate(frame, [0, 2 * fps], [0, 1], {
  extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  easing: Easing.out(Easing.quad),
})
const { strokeDasharray, strokeDashoffset } = evolvePath(progress, path)
```

---

## Motion Blur & Trail Effects

Add cinematic motion blur to fast-moving elements.

### Prerequisites

```bash
cd remotion && pnpm exec remotion add @remotion/motion-blur
```

### Trail (layered afterimage)

Best for fast-moving objects, screen transitions, and emphasis animations:

```tsx
import { Trail } from '@remotion/motion-blur'

<Trail layers={6} lagInFrames={3} trailOpacity={0.4}>
  <div style={{ /* your moving element */ }}>Content</div>
</Trail>
```

- `layers`: Number of copies (3-8 recommended)
- `lagInFrames`: Delay between layers (2-5 recommended)
- `trailOpacity`: Opacity of trailing copies (0.2-0.5 recommended)

### Camera Motion Blur

Apply blur to the entire scene during camera movements:

```tsx
import { CameraMotionBlur } from '@remotion/motion-blur'

<CameraMotionBlur samples={8} shutterAngle={180}>
  <SceneContent />
</CameraMotionBlur>
```

- `samples`: Quality (5-10 recommended, higher = slower render)
- `shutterAngle`: Blur intensity (180 = standard, 360 = max)

**Use sparingly** — only for dramatic fast movements or camera pans.

---

## SVG Shapes

Use pre-built SVG shape components for diagrams, decorations, and visual elements. See `remotion-best-practices` → `rules/3d.md` (some shape info may be there).

### Prerequisites

```bash
cd remotion && pnpm exec remotion add @remotion/shapes
```

### Available shapes

```tsx
import { Circle, Rect, Polygon, Pie, Arrow, Triangle, Heart } from '@remotion/shapes'
```

| Shape | Props | Use Case |
|-------|-------|----------|
| `Circle` | `radius`, `fill`, `stroke`, `strokeWidth` | Avatar placeholders, node indicators, decorative dots |
| `Rect` | `width`, `height`, `cornerRadius`, `fill` | Cards, badges, backgrounds |
| `Polygon` | `points` (array of [x,y]), `fill` | Custom shapes, hexagons |
| `Pie` | `radius`, `from`, `to`, `fill` | Pie charts, progress arcs |
| `Arrow` | `points` (array of [x,y]), `fill`, `strokeWidth` | Diagram arrows, flow indicators |
| `Triangle` | `size`, `fill` | Warning icons, decorative elements |
| `Heart` | `size`, `fill` | Like/favorite indicators |

### Example: Animated pie chart

```tsx
const progress = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' })

<Pie
  radius={120}
  from={0}
  to={progress * 270} // 75% of circle
  fill="#3b82f6"
  stroke="#1e3a5f"
  strokeWidth={2}
/>
```

---

## Starburst (retro ray pattern)

WebGL-based retro sun ray effect. Great for emphasis backgrounds and transitions.

### Prerequisites

```bash
cd remotion && pnpm exec remotion add @remotion/starburst
```

### Usage

```tsx
import { Starburst } from '@remotion/starburst'

<AbsoluteFill>
  <Starburst
    numRays={20}
    rotation={frame * 2}
    color="#f59e0b"
    opacity={0.3}
    innerRadius={100}
    outerRadius={1080}
  />
  {/* Foreground content on top */}
</AbsoluteFill>
```

**Props:** `numRays`, `rotation`, `color`, `opacity`, `innerRadius`, `outerRadius`

**Use cases:**
- Behind key statistics or product reveals
- CTA shots for visual emphasis
- Background ambiance for tech/business videos
- Keep `opacity` low (0.15-0.35) — it's a background element

---

## Noise & Grain Overlay

Add film grain or noise texture for cinematic feel. Pure functions — no WebGL.

### Prerequisites

```bash
cd remotion && pnpm exec remotion add @remotion/noise
```

### Usage

```tsx
import { noise2D } from '@remotion/noise'

const MyShot: React.FC = () => {
  const frame = useCurrentFrame()

  return (
    <AbsoluteFill>
      {/* Your content */}
      <AbsoluteFill style={{ opacity: 0.05, mixBlendMode: 'overlay', pointerEvents: 'none' }}>
        <svg width="100%" height="100%">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
```

**Note:** `noise2D(x, y)`, `noise3D(x, y, z)`, `noise4D(x, y, z, w)` are pure functions returning 0-1 values. Use them for procedural animations:

```tsx
// Animated noise value for a shaking/floating effect
const noiseValue = noise2D(frame * 0.02, 0) * 10 - 5
const translateY = noiseValue
```

**Use cases:**
- Film grain overlay (opacity 0.03-0.08)
- Subtle floating/shaking animations via noise-driven positioning
- Procedural background patterns

---

## Advanced

For one-off custom layouts that no primitive can express:
- See [references/manual-positioning.md](references/manual-positioning.md) — escape-hatch rules for hand-written `AbsoluteFill`
- See [references/components.md](references/components.md) — implementations of visual elements (`TalkingHead`, `ScreenRecording`, `CTA`, etc.)
- See [references/advanced.md](references/advanced.md) — audio waveforms, dynamic transitions, color theming

**Default to primitives. Reach for the escape hatch only when you've ruled them out.**
