# Animation Enhancement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Lift Remotion videos from static layouts to continuous motion by adding KenBurns camera motion, persistent micro-animations in layout primitives, and auto-applied Lottie/Starburst decorations.

**Architecture:** Three new components (KenBurns, LottieDecorator, Starburst), two new hooks (useBreathing, useFloat), and modifications to four existing layout primitives to accept a `persistentAnim` prop. All auto-application logic lives in the skill file, not in components. Lottie JSON files are pre-staged in `remotion/public/animations/`.

**Tech Stack:** Remotion 4, React 18, @remotion/lottie, @remotion/starburst, TypeScript

**Spec:** `docs/superpowers/specs/2026-04-30-animation-enhancement-design.md`

---

## File Structure

```
remotion/
├── public/
│   └── animations/                    # NEW — 8 Lottie JSON files
│       ├── celebration.json
│       ├── tech-particles.json
│       ├── data-flow.json
│       ├── success-check.json
│       ├── question-mark.json
│       ├── warning.json
│       ├── loading.json
│       └── sparkle.json
├── src/
│   ├── components/
│   │   ├── KenBurns.tsx               # NEW
│   │   ├── LottieDecorator.tsx        # NEW
│   │   ├── Starburst.tsx              # NEW
│   │   ├── CenteredStack.tsx          # MODIFY (persistentAnim prop)
│   │   ├── HubLayout.tsx              # MODIFY (persistentAnim prop)
│   │   ├── TwoColumnCompare.tsx       # MODIFY (persistentAnim prop)
│   │   ├── TimelineFlow.tsx           # MODIFY (persistentAnim prop)
│   │   └── index.ts                   # MODIFY (re-export new components)
│   └── hooks/                         # NEW directory
│       ├── useBreathing.ts            # NEW
│       └── useFloat.ts                # NEW
└── package.json                       # MODIFY (+2 deps)

.claude/skills/
├── remotion-video/SKILL.md            # MODIFY (3 new sections, replace Lottie section)
└── video-script/SKILL.md              # MODIFY (3 new optional fields)
```

---

### Task 1: Install Dependencies

**Files:**
- Modify: `remotion/package.json`

- [ ] **Step 1: Install @remotion/lottie and @remotion/starburst**

Run:
```bash
cd remotion && pnpm exec remotion add @remotion/lottie @remotion/starburst
```

Expected: Both packages added to `package.json` dependencies, `pnpm-lock.yaml` updated.

- [ ] **Step 2: Commit**

```bash
git add remotion/package.json remotion/pnpm-lock.yaml
git commit -m "chore: add @remotion/lottie and @remotion/starburst dependencies"
```

---

### Task 2: Create `useBreathing` Hook

**Files:**
- Create: `remotion/src/hooks/useBreathing.ts`

- [ ] **Step 1: Create the hook**

```ts
import { useCurrentFrame } from 'remotion'

interface UseBreathingOptions {
  amplitude?: number   // default 0.015 (1.5%)
  period?: number      // default 90 frames (3s @ 30fps)
}

export function useBreathing(opts?: UseBreathingOptions): { transform: string } {
  const frame = useCurrentFrame()
  const amplitude = opts?.amplitude ?? 0.015
  const period = opts?.period ?? 90

  const scale = 1 + Math.sin((2 * Math.PI * frame) / period) * amplitude

  return { transform: `scale(${scale})` }
}
```

- [ ] **Step 2: Commit**

```bash
git add remotion/src/hooks/useBreathing.ts
git commit -m "feat: add useBreathing hook for subtle scale oscillation"
```

---

### Task 3: Create `useFloat` Hook

**Files:**
- Create: `remotion/src/hooks/useFloat.ts`

- [ ] **Step 1: Create the hook**

```ts
import { useCurrentFrame } from 'remotion'

interface UseFloatOptions {
  amplitude?: number   // default 4 (px)
  period?: number      // default 120 frames (4s @ 30fps)
  phase?: number       // default 0
}

export function useFloat(opts?: UseFloatOptions): { transform: string } {
  const frame = useCurrentFrame()
  const amplitude = opts?.amplitude ?? 4
  const period = opts?.period ?? 120
  const phase = opts?.phase ?? 0

  const translateY = Math.sin((2 * Math.PI * frame) / period + phase) * amplitude

  return { transform: `translateY(${translateY}px)` }
}
```

Also export the raw math for use in loops (hooks can't be called inside `.map()`):
```ts
export function computeFloatY(frame: number, amplitude: number, period: number, phase: number): number {
  return Math.sin((2 * Math.PI * frame) / period + phase) * amplitude
}
```

- [ ] **Step 2: Commit**

```bash
git add remotion/src/hooks/useFloat.ts
git commit -m "feat: add useFloat hook for subtle vertical drift"
```

---

### Task 4: Create `KenBurns` Component

**Files:**
- Create: `remotion/src/components/KenBurns.tsx`

- [ ] **Step 1: Create the component**

```tsx
import React from 'react'
import { AbsoluteFill, Img, useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion'
import { Video } from '@remotion/media'
import { LAYOUT } from './constants'

type KenBurnsMotion = 'zoom-in' | 'zoom-out' | 'pan-left' | 'pan-right'
type KenBurnsIntensity = 'subtle' | 'normal'

interface KenBurnsProps {
  src: string
  type?: 'image' | 'video'
  motion?: KenBurnsMotion | 'random' | 'none'
  intensity?: KenBurnsIntensity
  duration: number        // frames
  shotIndex?: number      // for 'random' motion selection
  children?: React.ReactNode
}

const ALL_MOTIONS: KenBurnsMotion[] = ['zoom-in', 'zoom-out', 'pan-left', 'pan-right']

function resolveMotion(motion: KenBurnsMotion | 'random' | 'none' | undefined, shotIndex = 0): KenBurnsMotion | 'none' {
  if (motion === 'none' || !motion) return 'none'
  if (motion === 'random') {
    const idx = shotIndex % ALL_MOTIONS.length
    return ALL_MOTIONS[idx]
  }
  return motion
}

const ZOOM_RANGE: Record<KenBurnsIntensity, [number, number]> = {
  subtle: [1.0, 1.08],
  normal: [1.0, 1.18],
}

const PAN_RANGE: Record<KenBurnsIntensity, number> = {
  subtle: 0.04,  // 4% of width
  normal: 0.08,
}

export const KenBurns: React.FC<KenBurnsProps> = ({
  src,
  type = 'image',
  motion,
  intensity = 'subtle',
  duration,
  shotIndex = 0,
  children,
}) => {
  const frame = useCurrentFrame()

  const resolvedMotion = resolveMotion(motion, shotIndex)

  const baseStyle: React.CSSProperties = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
  }

  if (resolvedMotion === 'none') {
    return (
      <AbsoluteFill style={{ overflow: 'hidden' }}>
        {type === 'image'
          ? <Img src={src} style={baseStyle} />
          : <Video src={src} style={baseStyle} muted loop />}
        {children}
      </AbsoluteFill>
    )
  }

  const easing = Easing.inOut(Easing.quad)

  let mediaStyle: React.CSSProperties = { ...baseStyle }

  if (resolvedMotion.startsWith('zoom')) {
    const [from, to] = ZOOM_RANGE[intensity]
    const scale = interpolate(frame, [0, duration], [from, to], {
      extrapolateRight: 'clamp',
      easing,
    })
    mediaStyle.transform = `scale(${scale})`
  } else {
    const range = PAN_RANGE[intensity]
    const px = LAYOUT.WIDTH * range
    if (resolvedMotion === 'pan-left') {
      const tx = interpolate(frame, [0, duration], [0, -px], {
        extrapolateRight: 'clamp',
        easing,
      })
      mediaStyle.transform = `translateX(${tx}px) scale(1.08)`
    } else {
      const tx = interpolate(frame, [0, duration], [-px, 0], {
        extrapolateRight: 'clamp',
        easing,
      })
      mediaStyle.transform = `translateX(${tx}px) scale(1.08)`
    }
  }

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      {type === 'image'
        ? <Img src={src} style={mediaStyle} />
        : <Video src={src} style={mediaStyle} muted loop />}
      {children}
    </AbsoluteFill>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add remotion/src/components/KenBurns.tsx
git commit -m "feat: add KenBurns component for camera motion on backgrounds"
```

---

### Task 5: Download 8 Lottie JSON Files

**NOTE:** This task is placed before LottieDecorator (Task 6) so assets exist when the component is created.

**Files:**
- Create: `remotion/public/animations/*.json` (8 files)

- [ ] **Step 1: Create the animations directory**

```bash
mkdir -p remotion/public/animations
```

- [ ] **Step 2: Download Lottie files in parallel**

Download these 8 Lottie files from LottieFiles (search for each name, pick the most popular free animation). Use the browser or curl to download.

Target files:
1. `celebration.json` — confetti/fireworks (search: "celebration confetti")
2. `tech-particles.json` — floating tech particles (search: "tech particles")
3. `data-flow.json` — animated data lines (search: "data flow")
4. `success-check.json` — animated checkmark (search: "success checkmark")
5. `question-mark.json` — bouncing question mark (search: "question mark")
6. `warning.json` — pulsing warning icon (search: "warning alert")
7. `loading.json` — spinning loader (search: "loading spinner")
8. `sparkle.json` — subtle sparkles (search: "sparkle")

For each file:
1. Visit https://lottiefiles.com and search
2. Find a free (no attribution required if possible) animation
3. Download the JSON
4. Save to `remotion/public/animations/<name>.json`
5. Validate it's valid JSON: `python3 -c "import json; json.load(open('path'))"`

**Important: Download all 8 files in parallel to save time (see memory: async asset download).**

- [ ] **Step 3: Verify all files are valid JSON**

```bash
for f in remotion/public/animations/*.json; do
  python3 -c "import json; json.load(open('$f'))" && echo "OK: $f" || echo "INVALID: $f"
done
```

Expected: All 8 files report "OK".

- [ ] **Step 4: Commit**

```bash
git add remotion/public/animations/
git commit -m "feat: add 8 pre-staged Lottie animation files for decoration system"
```

---

### Task 6: Create `LottieDecorator` Component

**Files:**
- Create: `remotion/src/components/LottieDecorator.tsx`

- [ ] **Step 1: Create the component**

```tsx
import React, { useEffect, useState } from 'react'
import { Lottie, LottieAnimationData } from '@remotion/lottie'
import { staticFile, delayRender, continueRender, cancelRender } from 'remotion'
import { LAYOUT } from './constants'

type LottieName =
  | 'celebration'
  | 'tech-particles'
  | 'data-flow'
  | 'success-check'
  | 'question-mark'
  | 'warning'
  | 'loading'
  | 'sparkle'

type DecoratorPosition =
  | 'background'
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'
  | 'center'

interface LottieDecoratorProps {
  animation: LottieName
  position?: DecoratorPosition
  size?: number          // default 300 (corners) or fullscreen (background)
  opacity?: number       // default 0.3 (background), 0.85 (corners)
}

const POSITION_STYLES: Record<DecoratorPosition, React.CSSProperties> = {
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
  },
  'top-right': {
    position: 'absolute',
    top: 60,
    right: 40,
    pointerEvents: 'none',
  },
  'top-left': {
    position: 'absolute',
    top: 60,
    left: 40,
    pointerEvents: 'none',
  },
  'bottom-right': {
    position: 'absolute',
    bottom: 420,
    right: 40,
    pointerEvents: 'none',
  },
  'bottom-left': {
    position: 'absolute',
    bottom: 420,
    left: 40,
    pointerEvents: 'none',
  },
  center: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
  },
}

export const LottieDecorator: React.FC<LottieDecoratorProps> = ({
  animation,
  position = 'background',
  size,
  opacity,
}) => {
  const [handle] = useState(() => delayRender(`Loading Lottie: ${animation}`))
  const [animationData, setAnimationData] = useState<LottieAnimationData | null>(null)

  const isBackground = position === 'background'
  const defaultSize = isBackground ? undefined : 300
  const defaultOpacity = isBackground ? 0.3 : 0.85

  useEffect(() => {
    fetch(staticFile(`animations/${animation}.json`))
      .then((res) => res.json())
      .then((json) => {
        setAnimationData(json)
        continueRender(handle)
      })
      .catch((err) => cancelRender(err))
  }, [animation, handle])

  if (!animationData) return null

  const posStyle = POSITION_STYLES[position]
  const resolvedSize = size ?? defaultSize

  // Background Lottie fills the full canvas; corner/center Lottie uses explicit size.
  const lottieStyle: React.CSSProperties = resolvedSize
    ? { width: resolvedSize, height: resolvedSize }
    : { width: LAYOUT.WIDTH, height: LAYOUT.HEIGHT }

  return (
    <div style={{ ...posStyle, opacity: opacity ?? defaultOpacity }}>
      <Lottie
        animationData={animationData}
        style={lottieStyle}
        loop
      />
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add remotion/src/components/LottieDecorator.tsx
git commit -m "feat: add LottieDecorator component for auto-applied decorative animations"
```

---

### Task 7: Create `Starburst` Component

**NOTE:** This task MUST be completed AFTER Task 1 (install `@remotion/starburst`). After installing, verify the real API props by running `pnpm exec tsc --noEmit` and inspecting the installed package's type definitions. The component below is a template — replace placeholder props with verified ones.

**Known real API (v4.x):** `rays`, `colors` (string[]), `rotation`, `smoothness`, `vignette`, `width`, `height`, `durationInFrames` (required).

**Files:**
- Create: `remotion/src/components/Starburst.tsx`

- [ ] **Step 1: Create the component**

```tsx
import React from 'react'
import { useCurrentFrame } from 'remotion'
import { LAYOUT } from './constants'

/**
 * Wrapper around @remotion/starburst.
 *
 * NOTE: The real @remotion/starburst API varies by version. After installing,
 * verify the available props with `pnpm exec remotion add @remotion/starburst`
 * and check the installed package's type definitions. Adjust props below to match.
 *
 * Known real API (v4.x): rays, colors (string[]), rotation, smoothness, vignette,
 * width, height, durationInFrames (required).
 */
interface StarburstProps {
  color?: string           // default '#a78bfa' — mapped to colors array internally
  opacity?: number         // default 0.2
  rays?: number            // default 16
  durationInFrames?: number // required by @remotion/starburst
}

export const Starburst: React.FC<StarburstProps> = ({
  color = '#a78bfa',
  opacity = 0.2,
  rays = 16,
  durationInFrames = 150,
}) => {
  // Dynamic import to handle API differences gracefully
  // The implementer should verify these props match the installed version
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {/* @ts-expect-error — props vary by @remotion/starburst version, verify after install */}
      <div style={{ width: '100%', height: '100%' }}>
        {/*
          Implement with verified real API props. Example pattern:
          import { Starburst } from '@remotion/starburst'
          <Starburst
            rays={rays}
            colors={[color, '#ffffff']}
            rotation={0}
            smoothness={0.5}
            vignette={opacity}
            width={LAYOUT.WIDTH}
            height={LAYOUT.HEIGHT}
            durationInFrames={durationInFrames}
          />
        */}
      </div>
    </AbsoluteFill>
  )
}
```

**IMPORTANT:** After installing `@remotion/starburst`, the implementer MUST:
1. Check the real prop types: `pnpm exec tsc --noEmit`
2. Replace the placeholder comment above with actual verified props
3. Test in Remotion Studio to confirm the starburst renders correctly

- [ ] **Step 2: Commit**

```bash
git add remotion/src/components/Starburst.tsx
git commit -m "feat: add Starburst component wrapping @remotion/starburst"
```

---

### Task 8: Add `persistentAnim` to `CenteredStack`

**Files:**
- Modify: `remotion/src/components/CenteredStack.tsx`

- [ ] **Step 1: Add the prop and apply breathing to the first heading child**

Add `persistentAnim?: 'off' | 'breathing' | 'float' | 'auto'` to the props interface (default `'auto'`). When `auto`, apply `useBreathing()` to the first child if it is a heading element (`h1`–`h6`).

Implementation approach: Wrap the content children in a container that conditionally receives the breathing transform. Since we can't easily inspect React children types at runtime in a type-safe way, the pragmatic approach is to expose the animation transform via a wrapper `div` that the skill can also override:

```tsx
import { useBreathing } from '../hooks/useBreathing'
import { useFloat } from '../hooks/useFloat'

interface CenteredStackProps {
  children: React.ReactNode
  background?: React.CSSProperties['background']
  maxWidth?: number
  gap?: number
  align?: 'center' | 'flex-start' | 'flex-end' | 'stretch'
  justify?: 'center' | 'flex-start' | 'flex-end' | 'space-between'
  subtitle?: string
  subtitleSegments?: SubtitleSegment[]
  videoOffset?: number
  persistentAnim?: 'off' | 'breathing' | 'float' | 'auto'
}

export const CenteredStack: React.FC<CenteredStackProps> = ({
  children,
  background,
  maxWidth = 900,
  gap = 32,
  align = 'center',
  justify = 'center',
  subtitle,
  subtitleSegments,
  videoOffset,
  persistentAnim = 'auto',
}) => {
  // Hooks MUST be called unconditionally (React Rules of Hooks).
  // Results are applied conditionally based on persistentAnim.
  const breathing = useBreathing()
  const floating = useFloat()

  const animStyle = persistentAnim === 'off'
    ? {}
    : persistentAnim === 'breathing'
      ? breathing
      : persistentAnim === 'float'
        ? floating
        : breathing  // 'auto' → breathing

  return (
    <SafeArea
      style={{
        background,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: justify,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth,
          display: 'flex',
          flexDirection: 'column',
          alignItems: align,
          gap,
          ...animStyle,
        }}
      >
        {children}
      </div>
      {subtitleSegments && videoOffset !== undefined && (
        <ProgressiveSubtitle segments={subtitleSegments} videoOffset={videoOffset} />
      )}
      {!subtitleSegments && subtitle && <Subtitle text={subtitle} />}
    </SafeArea>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add remotion/src/components/CenteredStack.tsx
git commit -m "feat: add persistentAnim prop to CenteredStack"
```

---

### Task 9: Add `persistentAnim` to `HubLayout`

**Files:**
- Modify: `remotion/src/components/HubLayout.tsx`

- [ ] **Step 1: Add prop and apply breathing to center, float to surrounding**

Add `persistentAnim?: 'off' | 'breathing' | 'float' | 'auto'` (default `'auto'`).

When `auto`: center node gets `useBreathing()`, surrounding nodes get `useFloat()` with staggered phases (`phase = i * (Math.PI / 2)`).

When `off`: no transforms applied.
When `breathing`: all nodes get breathing.
When `float`: all nodes get float with staggered phases.

Apply the animation to the existing `style.transform` on the center node div and each surrounding node div by merging with the existing `translate(-50%, -50%) scale(...)`:

```tsx
import { useCurrentFrame } from 'remotion'
import { useBreathing } from '../hooks/useBreathing'
import { useFloat, computeFloatY } from '../hooks/useFloat'

// Inside component — hooks MUST be called unconditionally at top level:
const frame = useCurrentFrame()
const breathing = useBreathing()
const centerFloating = useFloat()

const centerAnim = persistentAnim === 'off'
  ? {}
  : persistentAnim === 'breathing'
    ? breathing
    : persistentAnim === 'float'
      ? centerFloating
      : breathing  // 'auto' → breathing

// In center node div, merge transforms:
style={{
  position: 'absolute',
  left: centerX,
  top: centerY,
  transform: `translate(-50%, -50%) scale(${center.scale ?? 1}) ${centerAnim.transform ?? ''}`,
  opacity: center.opacity ?? 1,
  zIndex: 10,
}}

// For surrounding nodes — use computeFloatY (pure function) instead of hooks in .map().
// Hooks cannot be called inside loops or conditionally.
const getSurroundingAnim = (index: number): React.CSSProperties => {
  if (persistentAnim === 'off') return {}
  if (persistentAnim === 'breathing') return breathing
  // float or 'auto' → staggered float using pure function
  const floatY = computeFloatY(frame, 4, 120, index * (Math.PI / 2))
  return { transform: `translateY(${floatY}px)` }
}
```

- [ ] **Step 2: Commit**

```bash
git add remotion/src/components/HubLayout.tsx
git commit -m "feat: add persistentAnim prop to HubLayout"
```

---

### Task 10: Add `persistentAnim` to `TwoColumnCompare`

**Files:**
- Modify: `remotion/src/components/TwoColumnCompare.tsx`

- [ ] **Step 1: Add prop and apply breathing to panel titles**

Add `persistentAnim?: 'off' | 'breathing' | 'float' | 'auto'` (default `'auto'`).

When `auto` or `breathing`: apply `useBreathing()` to the panel title divs.
When `float`: apply `useFloat()` to panel title divs.
When `off`: no animation.

Add the transform to the title div's existing style:

```tsx
// Hooks MUST be called unconditionally at top level (React Rules of Hooks).
const breathing = useBreathing()
const floating = useFloat()

const animStyle = persistentAnim === 'off'
  ? {}
  : persistentAnim === 'float'
    ? floating
    : breathing

// In renderPanel, merge into title div:
<div style={{
  fontSize: 52,
  fontWeight: 800,
  color: panel.accent,
  marginBottom: 32,
  textAlign: 'center',
  ...animStyle,
}}>
  {panel.title}
</div>
```

- [ ] **Step 2: Commit**

```bash
git add remotion/src/components/TwoColumnCompare.tsx
git commit -m "feat: add persistentAnim prop to TwoColumnCompare"
```

---

### Task 11: Add `persistentAnim` to `TimelineFlow`

**Files:**
- Modify: `remotion/src/components/TimelineFlow.tsx`

- [ ] **Step 1: Add prop and activeIndex, apply float to active step**

Add `persistentAnim?: 'off' | 'breathing' | 'float' | 'auto'` (default `'auto'`).
Add `activeIndex?: number` (optional — if not provided, compute from `Math.floor(frame / framesPerStep)`).

When `auto` or `float`: apply `useFloat()` to the currently active item's wrapper div.
When `breathing`: apply `useBreathing()` to the active item.
When `off`: no animation.

```tsx
import { useCurrentFrame } from 'remotion'
import { useBreathing } from '../hooks/useBreathing'
import { useFloat } from '../hooks/useFloat'

interface TimelineFlowProps {
  // ... existing props ...
  persistentAnim?: 'off' | 'breathing' | 'float' | 'auto'
  activeIndex?: number
}

// Inside component — hooks MUST be called unconditionally at top level:
const frame = useCurrentFrame()
const breathing = useBreathing()
const floating = useFloat()

// getAnimStyle is a pure function (no hooks) — safe to call in .map() / conditionals.
const getAnimStyle = (index: number): React.CSSProperties => {
  if (persistentAnim === 'off' || activeIndex === undefined) return {}
  if (index !== activeIndex) return {}
  if (persistentAnim === 'breathing') return breathing
  if (persistentAnim === 'float') return floating
  return floating  // 'auto' → float
}

// Apply to each item wrapper div:
<div style={{ display: 'flex', flexDirection: ..., alignItems: 'center', gap: 24, ...getAnimStyle(i), ... }}>
```

- [ ] **Step 2: Commit**

```bash
git add remotion/src/components/TimelineFlow.tsx
git commit -m "feat: add persistentAnim and activeIndex props to TimelineFlow"
```

---

### Task 12: Update `index.ts` Exports

**Files:**
- Modify: `remotion/src/components/index.ts`

- [ ] **Step 1: Add new exports**

Add these lines after the existing exports:

```ts
// === Camera Motion ===
export { KenBurns } from './KenBurns'

// === Decorations ===
export { LottieDecorator } from './LottieDecorator'
export { Starburst } from './Starburst'
```

- [ ] **Step 2: Commit**

```bash
git add remotion/src/components/index.ts
git commit -m "feat: export KenBurns, LottieDecorator, and Starburst components"
```

---

### Task 13: Update `remotion-video/SKILL.md` — Camera Motion Section

**Files:**
- Modify: `.claude/skills/remotion-video/SKILL.md`

- [ ] **Step 1: Add "Camera Motion" section after "AI-Generated Background Images"**

Insert the following section after the "AI-Generated Background Images" section (around line 996):

```markdown
---

## Camera Motion (KenBurns)

Use `<KenBurns>` to wrap any background `<Img>` or `<Video>` for cinematic camera motion.

### Auto-application rules

| Background type | Default motion | Script override |
|-----------------|----------------|-----------------|
| AI background image (`画面类型: ai背景图`) | `zoom-in` (subtle) | `**镜头运动**: pan-left \| zoom-out \| none` |
| Pixabay video (from `/asset-pack`) | None (video itself moves) | `**镜头运动**: zoom-in` |
| Pixabay image (from `/asset-pack`) | `random` (alternates by shot index) | Same field |
| Pure gradient / solid | None | `**镜头运动**: <type>` to opt in |

### Usage

```tsx
import { KenBurns } from '../../../components'

// AI background image with auto zoom-in:
<KenBurns
  src={staticFile(`images/${slug}/shot1-bg.png`)}
  type="image"
  motion="zoom-in"
  duration={shotFrames}
>
  {/* Dark overlay for text readability */}
  <AbsoluteFill style={{ backgroundColor: 'rgba(0,0,0,0.4)' }} />
  {/* Foreground content */}
  <CenteredStack subtitle={subtitle}>
    <h1>标题</h1>
  </CenteredStack>
</KenBurns>
```

### FATAL RULE

**Use `<KenBurns>` to wrap any `<Img>` or `<Video>` from `assets/stock/` or AI background images. Naked `<Img>` for backgrounds is forbidden.**
```

- [ ] **Step 2: Commit**

```bash
git add .claude/skills/remotion-video/SKILL.md
git commit -m "docs: add Camera Motion section to remotion-video skill"
```

---

### Task 14: Update `remotion-video/SKILL.md` — Persistent Animation Section

**Files:**
- Modify: `.claude/skills/remotion-video/SKILL.md`

- [ ] **Step 1: Add "Persistent Animation" section after Camera Motion**

```markdown
---

## Persistent Animation (Micro-Animations)

Layout primitives accept a `persistentAnim` prop that applies continuous subtle motion to content elements.

### Auto-application

| Primitive | `auto` behavior |
|-----------|----------------|
| `CenteredStack` | Content container gets `breathing` |
| `HubLayout` | Center node gets `breathing`; surrounding nodes get `float` with staggered phases |
| `TwoColumnCompare` | Both panel titles get `breathing` |
| `TimelineFlow` | Active step (by `activeIndex`) gets `float`; requires `activeIndex` prop |

### Script override

```markdown
**持续动画**: off          # disable for this shot
**持续动画**: breathing    # force breathing
**持续动画**: float        # force float
```

### Usage

```tsx
// Default (auto) — no changes needed:
<CenteredStack background="..." subtitle={subtitle}>
  <h1>标题</h1>
</CenteredStack>

// Override to disable:
<CenteredStack background="..." persistentAnim="off" subtitle={subtitle}>
  <h1>标题</h1>
</CenteredStack>

// TimelineFlow with activeIndex:
<TimelineFlow
  background="..."
  items={items}
  activeIndex={Math.floor(frame / framesPerStep)}
/>
```

**Default is `'auto'`** — existing shots get persistent animation automatically. No script changes needed.
```

- [ ] **Step 2: Commit**

```bash
git add .claude/skills/remotion-video/SKILL.md
git commit -m "docs: add Persistent Animation section to remotion-video skill"
```

---

### Task 15: Update `remotion-video/SKILL.md` — Decoration Layers Section

**Files:**
- Modify: `.claude/skills/remotion-video/SKILL.md`

- [ ] **Step 1: Replace existing "Lottie Animations" section with "Decoration Layers"**

Replace the entire "## Lottie Animations" section (lines ~999-1044) with:

```markdown
---

## Decoration Layers (Lottie & Starburst)

Auto-applied decorative animations based on shot role. No manual Lottie wiring needed.

### Auto-application rules

When generating a shot, inspect the shot's role:

| Shot role | Auto-decorator |
|-----------|---------------|
| Hook | One of: `<Starburst>` (50%) or `<LottieDecorator animation="tech-particles" position="background">` (50%); alternates by project |
| Hook with 为什么/到底/真的吗 in title | `<LottieDecorator animation="question-mark" position="top-right">` (overrides above) |
| 痛点 | `<LottieDecorator animation="warning" position="top-right" size={200}>` |
| 数据 / 统计 / 对比 | `<LottieDecorator animation="data-flow" position="background" opacity={0.15}>` |
| CTA | `<LottieDecorator animation="celebration" position="background">` + `<LottieDecorator animation="success-check" position="top-right">` |
| 金句 | `<LottieDecorator animation="sparkle" position="background" opacity={0.2}>` |
| Default | None |

### Script override

```markdown
**装饰层**: off          # disable auto decorator
**装饰层**: starburst    # force starburst
**装饰层**: question-mark @ top-right size=200
**装饰层**: data-flow @ background opacity=0.15
```

### Usage

```tsx
import { LottieDecorator, Starburst } from '../../../components'

// Starburst background:
<AbsoluteFill>
  <Starburst color="#a78bfa" opacity={0.2} />
  {/* content on top */}
</AbsoluteFill>

// Lottie decoration:
<AbsoluteFill>
  <LottieDecorator animation="warning" position="top-right" size={200} opacity={0.85} />
  {/* content on top */}
</AbsoluteFill>
```

**Prerequisites:** Lottie JSON files are pre-staged in `remotion/public/animations/`. `@remotion/lottie` and `@remotion/starburst` must be installed.
```

- [ ] **Step 2: Commit**

```bash
git add .claude/skills/remotion-video/SKILL.md
git commit -m "docs: replace Lottie section with Decoration Layers in remotion-video skill"
```

---

### Task 16: Update `remotion-video/SKILL.md` — FATAL RULES

**Files:**
- Modify: `.claude/skills/remotion-video/SKILL.md`

- [ ] **Step 1: Add KenBurns FATAL RULE to the rules list**

Add as rule #14 in the FATAL RULES section (after rule #13):

```markdown
14. **Use `<KenBurns>` to wrap any `<Img>` or `<Video>` from `assets/stock/` or AI background images.** Naked `<Img>` for backgrounds is forbidden — always wrap in `<KenBurns>` for cinematic camera motion.
```

- [ ] **Step 2: Commit**

```bash
git add .claude/skills/remotion-video/SKILL.md
git commit -m "docs: add KenBurns FATAL RULE to remotion-video skill"
```

---

### Task 17: Update `video-script/SKILL.md` — New Optional Fields

**Files:**
- Modify: `.claude/skills/video-script/SKILL.md`

- [ ] **Step 1: Add three new optional fields to the shot template**

In the "Output Template" section (around line 225), add these fields after `**背景图提示词**`:

```markdown
- **镜头运动**: zoom-in / zoom-out / pan-left / pan-right / none （仅 ai背景图 / Pixabay素材 时需标注，默认 zoom-in）
- **持续动画**: off / breathing / float （默认 auto，通常不需要标注）
- **装饰层**: off / starburst / celebration / tech-particles / data-flow / ... （默认按角色自动，通常不需要标注）
```

Also add a note at the top of the template explaining auto-effects:

```markdown
<!-- 自动效果由 remotion-video 根据 **角色** 和素材类型自动应用:
  - KenBurns 镜头运动: ai背景图 → zoom-in, Pixabay图 → random, 渐变 → none
  - 持续动画: 所有布局默认 auto (breathing/float)
  - 装饰层: Hook → Starburst/tech-particles, 痛点 → warning, 数据 → data-flow, CTA → celebration+success-check
  - 需要覆盖默认行为时才标注对应字段
-->
```

- [ ] **Step 2: Commit**

```bash
git add .claude/skills/video-script/SKILL.md
git commit -m "docs: add 镜头运动/持续动画/装饰层 optional fields to video-script skill"
```

---

### Task 18: Visual Verification

- [ ] **Step 1: Re-render an existing project with the new components**

Open Remotion Studio and verify on an existing project (e.g., `deepseek-v4`):

```bash
cd remotion && npx remotion studio src/root.tsx &
```

Check:
1. Layout primitives render without errors
2. No TypeScript compilation errors
3. KenBurns component available in imports
4. Lottie/Starburst components available in imports

- [ ] **Step 2: Fix any issues found**

Address any compilation errors or visual issues.

---

## Success Criteria

- [ ] `pnpm exec tsc --noEmit` passes in `remotion/`
- [ ] All four layout primitives accept `persistentAnim` prop
- [ ] KenBurns, LottieDecorator, Starburst exported from `components/index.ts`
- [ ] 8 Lottie JSON files in `remotion/public/animations/`
- [ ] Skill file updated with 3 new sections + FATAL RULE
- [ ] Re-rendering existing project produces no errors
