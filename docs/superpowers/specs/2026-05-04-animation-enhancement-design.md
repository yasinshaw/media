# Animation Enhancement Design

## Goal

Systematically improve video layout and animation quality across the Remotion video toolkit. Create reusable animation hooks, a transition system, and background atmosphere components, then demonstrate with a deepseek-v4 retrofit.

## Scope

- **New animation hooks library** (`remotion/src/components/animations/`)
- **Shot transition system** (`remotion/src/components/transitions/`)
- **Background atmosphere components** (`remotion/src/components/backgrounds/`)
- **Deepseek-v4 retrofit** — upgrade all 7 shots as reference implementation
- **Layout primitives** — add optional `backgroundLayer` prop

## Approach

Use `@remotion/motion` (Remotion's official animation library, wraps Framer Motion API) for element-level animations. Transitions use Remotion-native `AbsoluteFill` + opacity/transform (container-level, no motion needed).

## Section 1: Animation Hooks

Location: `remotion/src/components/animations/`

All hooks return `{ style: React.CSSProperties }` for direct use with `<div style={...}>`.

### Entry Hooks

| Hook | Purpose | Params |
|------|---------|--------|
| `useSlideIn(direction, delay)` | Slide in from direction + fade | direction: 'left'\|'right'\|'up'\|'down', delay?: number |
| `useScaleIn(delay)` | Elastic scale-in (replaces raw spring) | delay?: number |
| `useFadeIn(delay)` | Basic fade-in | delay?: number |

### Content Hooks

| Hook | Purpose | Params |
|------|---------|--------|
| `useStagger(count, delayBetween)` | Staggered reveal, returns per-item style array | count: number, delayBetween?: number |
| `useNumberRoll(target, duration)` | Animate number from 0 to target | target: number, duration?: number |
| `useTextReveal(wordCount, delayBetween)` | Per-word/line reveal | wordCount: number, delayBetween?: number |

### Continuous Hooks

| Hook | Purpose | Params |
|------|---------|--------|
| `useFloat(amplitude, speed)` | Gentle vertical float | amplitude?: number, speed?: number |
| `usePulse(minScale, maxScale, speed)` | Pulsing scale | minScale?: number, maxScale?: number, speed?: number |
| `useRotate(speed)` | Continuous rotation | speed?: number (degrees/frame) |

All hooks accept optional `config` for spring/tween customization. Defaults tuned for "smooth modern" style (Apple/Linear-like).

### Index

`animations/index.ts` re-exports all hooks and the `motion` import for convenience.

## Section 2: Transition System

Location: `remotion/src/components/transitions/`

### Transition Component

```tsx
<Transition type="slide-left" duration={15}>
  <ShotContent />
</Transition>
```

Wraps shot content. Renders transition effect in the first `duration` frames (default 15 = 0.5s at 30fps) and the last `duration` frames.

### Supported Types

| type | Effect | Best For |
|------|--------|----------|
| `fade` | Cross dissolve (default) | General purpose |
| `slide-left` | Content slides in from right | Topic switches |
| `slide-right` | Content slides in from left | Topic switches |
| `slide-up` | Content slides in from bottom | List/progression |
| `slide-down` | Content slides in from top | List/progression |
| `zoom-in` | Content scales up from center | Emphasis, key points |
| `zoom-out` | Content shrinks out | Chapter transitions |

### Implementation

Pure Remotion `AbsoluteFill` + opacity/transform via `interpolate`. No `@remotion/motion` dependency — transitions are container-level.

### Composition Integration

```tsx
// Each Sequence wraps content in Transition
<Sequence from={shotFrames[1].from} durationInFrames={shotFrames[1].durationInFrames}>
  <Transition type="slide-up">
    <Shot2 ... />
  </Transition>
</Sequence>
```

Per-shot transition type override, with `fade` as default.

## Section 3: Background Atmosphere

Location: `remotion/src/components/backgrounds/`

### Components

| Component | Effect | Props |
|-----------|--------|-------|
| `FloatingOrbs` | Semi-transparent gradient orbs slowly floating | count?: number, colors?: string[], speed?: number |
| `GradientFlow` | Background gradient slowly shifts/rotates | colors: string[], duration?: number, angle?: number |
| `GridPattern` | Subtle grid lines | color?: string, opacity?: number, spacing?: number |
| `ParticleField` | Lightweight floating particles | count?: number, color?: string, speed?: number |

### Design Principles

- **Non-intrusive**: Default opacity 0.1-0.3, pure decoration
- **Zero layout impact**: CSS transform/opacity only, no reflow
- **Composable**: Multiple backgrounds can stack
- **Performance**: No layout thrashing, GPU-accelerated transforms

### Usage Pattern

Backgrounds go inside layout primitives as the first child (renders behind content):

```tsx
<CenteredStack background="linear-gradient(135deg, #0f172a, #1e293b)">
  <FloatingOrbs colors={['#3b82f640', '#8b5cf630']} count={3} />
  {/* existing content */}
</CenteredStack>
```

### Layout Primitive Changes

Add optional `backgroundLayer?: React.ReactNode` prop to:
- `CenteredStack`
- `HubLayout`
- `TimelineFlow`
- `TwoColumnCompare`

When provided, renders as the first absolute-positioned layer (behind all content).

## Section 4: Deepseek-v4 Retrofit

### Shot Upgrades

| Shot | Current | Upgraded |
|------|---------|----------|
| Shot1 | spring scale + fade | `useScaleIn` + word reveal + `FloatingOrbs` + floating decorative rings |
| Shot2 | spring bar growth | `useStagger` bars pop in + price tag `useSlideIn('up')` |
| Shot3 | spring + fade hub | `useStagger` nodes + connection lines draw sequentially |
| Shot4 | fade timeline | `useStagger` items slide in + `GradientFlow` bg |
| Shot5 | fade timeline | Same + conclusion `useScaleIn` emphasis |
| Shot6 | spring price circles | `useStagger` circles + `useNumberRoll` prices + visual size hierarchy |
| Shot7 | spring + fade hub | `useStagger` tags + `GradientFlow` + `FloatingOrbs` |

### Transition Plan

| Cut | Type |
|-----|------|
| Shot1 → Shot2 | `slide-left` |
| Shot2 → Shot3 | `zoom-in` |
| Shot3 → Shot4 | `slide-up` |
| Shot4 → Shot5 | `fade` |
| Shot5 → Shot6 | `slide-left` |
| Shot6 → Shot7 | `zoom-in` |

### Unchanged

- Layout primitive structure/logic
- ProgressiveSubtitle, SafeArea
- SFXLayer, BGMAudio
- Composition timing/duration calculation

## Dependencies

- `@remotion/motion` — new dependency for element-level animations
- All other code uses existing Remotion APIs

## File Structure

```
remotion/src/components/
├── animations/
│   ├── useSlideIn.ts
│   ├── useScaleIn.ts
│   ├── useFadeIn.ts
│   ├── useStagger.ts
│   ├── useNumberRoll.ts
│   ├── useTextReveal.ts
│   ├── useFloat.ts
│   ├── usePulse.ts
│   ├── useRotate.ts
│   └── index.ts
├── transitions/
│   ├── Transition.tsx
│   └── index.ts
├── backgrounds/
│   ├── FloatingOrbs.tsx
│   ├── GradientFlow.tsx
│   ├── GridPattern.tsx
│   ├── ParticleField.tsx
│   └── index.ts
├── CenteredStack.tsx      # add backgroundLayer prop
├── HubLayout.tsx          # add backgroundLayer prop
├── TimelineFlow.tsx       # add backgroundLayer prop
├── TwoColumnCompare.tsx   # add backgroundLayer prop
└── index.ts               # re-export new modules
```
