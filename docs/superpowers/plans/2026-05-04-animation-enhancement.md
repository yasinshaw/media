# Animation Enhancement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a reusable animation hooks library, transition system, and background atmosphere components to make Remotion videos visually richer, then demonstrate with a deepseek-v4 retrofit and update related skills.

**Architecture:** Three new component modules (animations/, transitions/, backgrounds/) plus updates to 4 layout primitives (backgroundLayer prop). Animations use `@remotion/motion` for element-level effects. Transitions use pure Remotion interpolate. Backgrounds use CSS transform/opacity only. All hooks return `{ style }` objects for drop-in use.

**Tech Stack:** React, Remotion, @remotion/motion, Vitest

---

## File Structure

```
remotion/src/components/
├── animations/
│   ├── useSlideIn.ts          # Slide in from 4 directions
│   ├── useScaleIn.ts          # Elastic scale-in
│   ├── useFadeIn.ts           # Basic fade-in
│   ├── useStagger.ts          # Staggered reveal (returns array)
│   ├── useNumberRoll.ts       # Number 0 → target
│   ├── useTextReveal.ts       # Per-word reveal
│   ├── useFloat.ts            # Gentle vertical float
│   ├── usePulse.ts            # Pulsing scale
│   ├── useRotate.ts           # Continuous rotation
│   ├── animations.test.ts     # Tests for all hooks
│   └── index.ts               # Re-exports
├── transitions/
│   ├── Transition.tsx         # Shot transition wrapper
│   └── index.ts
├── backgrounds/
│   ├── FloatingOrbs.tsx       # Gradient orbs floating
│   ├── GradientFlow.tsx       # Animated gradient background
│   ├── GridPattern.tsx        # Subtle grid lines
│   ├── ParticleField.tsx      # Floating particles
│   └── index.ts
├── CenteredStack.tsx          # ADD: backgroundLayer prop
├── HubLayout.tsx              # ADD: backgroundLayer prop
├── TimelineFlow.tsx           # ADD: backgroundLayer prop
├── TwoColumnCompare.tsx       # ADD: backgroundLayer prop
└── index.ts                   # ADD: re-export new modules
```

---

### Task 1: Install @remotion/motion

**Files:**
- Modify: `remotion/package.json`

- [ ] **Step 1: Install dependency**

```bash
cd remotion && pnpm add @remotion/motion
```

- [ ] **Step 2: Verify install**

```bash
cd remotion && pnpm ls @remotion/motion
```

Expected: shows installed version

- [ ] **Step 3: Commit**

```bash
git add remotion/package.json remotion/pnpm-lock.yaml
git commit -m "chore: add @remotion/motion dependency"
```

---

### Task 2: Entry Animation Hooks (useFadeIn, useScaleIn, useSlideIn)

**Files:**
- Create: `remotion/src/components/animations/useFadeIn.ts`
- Create: `remotion/src/components/animations/useScaleIn.ts`
- Create: `remotion/src/components/animations/useSlideIn.ts`
- Create: `remotion/src/components/animations/animations.test.ts`

- [ ] **Step 1: Write failing tests**

```typescript
// animations.test.ts
import { describe, it, expect } from 'vitest'
import { useFadeIn } from './useFadeIn'
import { useScaleIn } from './useScaleIn'
import { useSlideIn } from './useSlideIn'

// Helper: simulate hook call at specific frame
// Hooks use useCurrentFrame internally, so we test the pure logic
// by extracting the compute function and testing it directly

describe('useFadeIn', () => {
  it('returns opacity 0 before delay', () => {
    const result = useFadeIn.compute({ frame: 0, delay: 10, duration: 15 })
    expect(result.opacity).toBe(0)
  })

  it('returns opacity 1 after delay + duration', () => {
    const result = useFadeIn.compute({ frame: 30, delay: 10, duration: 15 })
    expect(result.opacity).toBe(1)
  })

  it('returns partial opacity during transition', () => {
    const result = useFadeIn.compute({ frame: 15, delay: 10, duration: 10 })
    expect(result.opacity).toBeGreaterThan(0)
    expect(result.opacity).toBeLessThan(1)
  })
})

describe('useScaleIn', () => {
  it('returns scale 0 at frame 0', () => {
    const result = useScaleIn.compute({ frame: 0, delay: 0 })
    expect(result.transform).toContain('scale(0)')
  })

  it('returns scale 1 at high frame', () => {
    const result = useScaleIn.compute({ frame: 60, delay: 0 })
    expect(result.transform).toContain('scale(1)')
  })

  it('includes opacity 0 at start', () => {
    const result = useScaleIn.compute({ frame: 0, delay: 0 })
    expect(result.opacity).toBe(0)
  })
})

describe('useSlideIn', () => {
  it('slides from left at frame 0', () => {
    const result = useSlideIn.compute({ frame: 0, direction: 'left', delay: 0, distance: 60, duration: 15 })
    expect(result.transform).toContain('translateX(-60')
    expect(result.opacity).toBe(0)
  })

  it('settles at frame 30', () => {
    const result = useSlideIn.compute({ frame: 30, direction: 'left', delay: 0, distance: 60, duration: 15 })
    expect(result.transform).toContain('translateX(0)')
    expect(result.opacity).toBe(1)
  })

  it('slides from up correctly', () => {
    const result = useSlideIn.compute({ frame: 0, direction: 'up', delay: 0, distance: 60, duration: 15 })
    expect(result.transform).toContain('translateY(-60')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd remotion && pnpm vitest run src/components/animations/animations.test.ts
```

Expected: FAIL — modules not found

- [ ] **Step 3: Implement useFadeIn**

```typescript
// useFadeIn.ts
import { interpolate } from 'remotion'

interface FadeInConfig {
  frame: number
  delay?: number
  duration?: number
}

const DEFAULTS = { delay: 0, duration: 15 }

export function useFadeIn(frame: number, config: Omit<FadeInConfig, 'frame'> = {}) {
  const { delay, duration } = { ...DEFAULTS, ...config }
  return useFadeIn.compute({ frame, delay, duration })
}

useFadeIn.compute = ({ frame, delay = 0, duration = 15 }: FadeInConfig) => {
  const opacity = interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  return { style: { opacity } }
}
```

- [ ] **Step 4: Implement useScaleIn**

```typescript
// useScaleIn.ts
import { spring, interpolate } from 'remotion'

interface ScaleInConfig {
  frame: number
  fps?: number
  delay?: number
  config?: { damping?: number; stiffness?: number; mass?: number }
}

const DEFAULTS = { fps: 30, delay: 0 }

export function useScaleIn(frame: number, config: Omit<ScaleInConfig, 'frame'> = {}) {
  const merged = { ...DEFAULTS, ...config }
  return useScaleIn.compute({ frame, ...merged })
}

useScaleIn.compute = ({
  frame,
  fps = 30,
  delay = 0,
  config: springConfig = { damping: 15, stiffness: 120 },
}: ScaleInConfig) => {
  const progress = spring({ frame: Math.max(0, frame - delay), fps, config: springConfig })
  const scale = interpolate(progress, [0, 1], [0, 1])
  const opacity = interpolate(progress, [0, 0.5], [0, 1])
  return { style: { transform: `scale(${scale})`, opacity } }
}
```

- [ ] **Step 5: Implement useSlideIn**

```typescript
// useSlideIn.ts
import { interpolate, Easing } from 'remotion'

type Direction = 'left' | 'right' | 'up' | 'down'

interface SlideInConfig {
  frame: number
  direction: Direction
  delay?: number
  distance?: number
  duration?: number
}

const DIRECTION_MAP: Record<Direction, { prop: string; sign: number }> = {
  left:  { prop: 'translateX', sign: -1 },
  right: { prop: 'translateX', sign: 1 },
  up:    { prop: 'translateY', sign: -1 },
  down:  { prop: 'translateY', sign: 1 },
}

const DEFAULTS = { delay: 0, distance: 60, duration: 15 }

export function useSlideIn(frame: number, direction: Direction, config: Omit<SlideInConfig, 'frame' | 'direction'> = {}) {
  const merged = { ...DEFAULTS, ...config }
  return useSlideIn.compute({ frame, direction, ...merged })
}

useSlideIn.compute = ({
  frame,
  direction,
  delay = 0,
  distance = 60,
  duration = 15,
}: SlideInConfig) => {
  const { prop, sign } = DIRECTION_MAP[direction]
  const opacity = interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const offset = interpolate(
    frame, [delay, delay + duration], [distance * sign, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad) },
  )
  return { style: { opacity, transform: `${prop}(${offset}px)` } }
}
```

- [ ] **Step 6: Run tests to verify they pass**

```bash
cd remotion && pnpm vitest run src/components/animations/animations.test.ts
```

Expected: 9 tests PASS

- [ ] **Step 7: Commit**

```bash
git add remotion/src/components/animations/useFadeIn.ts remotion/src/components/animations/useScaleIn.ts remotion/src/components/animations/useSlideIn.ts remotion/src/components/animations/animations.test.ts
git commit -m "feat: add entry animation hooks (useFadeIn, useScaleIn, useSlideIn)"
```

---

### Task 3: Content Animation Hooks (useStagger, useNumberRoll, useTextReveal)

**Files:**
- Create: `remotion/src/components/animations/useStagger.ts`
- Create: `remotion/src/components/animations/useNumberRoll.ts`
- Create: `remotion/src/components/animations/useTextReveal.ts`
- Modify: `remotion/src/components/animations/animations.test.ts`

- [ ] **Step 1: Add failing tests to animations.test.ts**

```typescript
// Add to existing animations.test.ts
import { useStagger } from './useStagger'
import { useNumberRoll } from './useNumberRoll'
import { useTextReveal } from './useTextReveal'

describe('useStagger', () => {
  it('returns correct number of styles', () => {
    const result = useStagger.compute({ frame: 0, count: 3, delayBetween: 8 })
    expect(result).toHaveLength(3)
  })

  it('first item is visible before later items', () => {
    const result = useStagger.compute({ frame: 10, count: 3, delayBetween: 8, duration: 10 })
    expect(result[0].opacity).toBeGreaterThan(result[1].opacity)
  })

  it('all items visible at high frame', () => {
    const result = useStagger.compute({ frame: 100, count: 3, delayBetween: 8, duration: 10 })
    expect(result.every(s => s.opacity === 1)).toBe(true)
  })
})

describe('useNumberRoll', () => {
  it('returns 0 at frame 0', () => {
    const result = useNumberRoll.compute({ frame: 0, target: 100, duration: 60 })
    expect(result).toBe(0)
  })

  it('returns target at high frame', () => {
    const result = useNumberRoll.compute({ frame: 100, target: 100, duration: 60 })
    expect(result).toBe(100)
  })

  it('returns intermediate value during animation', () => {
    const result = useNumberRoll.compute({ frame: 30, target: 100, duration: 60 })
    expect(result).toBeGreaterThan(0)
    expect(result).toBeLessThan(100)
  })

  it('handles decimal targets', () => {
    const result = useNumberRoll.compute({ frame: 100, target: 0.14, duration: 60, decimals: 2 })
    expect(result).toBeCloseTo(0.14, 2)
  })
})

describe('useTextReveal', () => {
  it('returns 0 visible words at frame 0', () => {
    const result = useTextReveal.compute({ frame: 0, wordCount: 5, delayBetween: 6 })
    expect(result.visibleCount).toBe(0)
  })

  it('returns all words at high frame', () => {
    const result = useTextReveal.compute({ frame: 100, wordCount: 5, delayBetween: 6 })
    expect(result.visibleCount).toBe(5)
  })

  it('returns partial words during animation', () => {
    const result = useTextReveal.compute({ frame: 10, wordCount: 5, delayBetween: 6 })
    expect(result.visibleCount).toBeGreaterThan(0)
    expect(result.visibleCount).toBeLessThan(5)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd remotion && pnpm vitest run src/components/animations/animations.test.ts
```

- [ ] **Step 3: Implement useStagger**

```typescript
// useStagger.ts
import { interpolate, Easing } from 'remotion'

interface StaggerConfig {
  frame: number
  count: number
  delayBetween?: number
  duration?: number
}

const DEFAULTS = { delayBetween: 8, duration: 12 }

export function useStagger(frame: number, count: number, config: Omit<StaggerConfig, 'frame' | 'count'> = {}) {
  const merged = { ...DEFAULTS, ...config }
  return useStagger.compute({ frame, count, ...merged })
}

useStagger.compute = ({
  frame,
  count,
  delayBetween = 8,
  duration = 12,
}: StaggerConfig): Array<{ style: { opacity: number; transform: string } }> => {
  return Array.from({ length: count }, (_, i) => {
    const delay = i * delayBetween
    const opacity = interpolate(frame, [delay, delay + duration], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.quad),
    })
    const translateY = interpolate(frame, [delay, delay + duration], [20, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.quad),
    })
    return { style: { opacity, transform: `translateY(${translateY}px)` } }
  })
}
```

- [ ] **Step 4: Implement useNumberRoll**

```typescript
// useNumberRoll.ts
import { interpolate, Easing } from 'remotion'

interface NumberRollConfig {
  frame: number
  target: number
  duration?: number
  delay?: number
  decimals?: number
}

const DEFAULTS = { duration: 45, delay: 0, decimals: 0 }

export function useNumberRoll(frame: number, target: number, config: Omit<NumberRollConfig, 'frame' | 'target'> = {}) {
  const merged = { ...DEFAULTS, ...config }
  return useNumberRoll.compute({ frame, target, ...merged })
}

useNumberRoll.compute = ({
  frame,
  target,
  duration = 45,
  delay = 0,
  decimals = 0,
}: NumberRollConfig): number => {
  const progress = interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  })
  const value = progress * target
  return decimals > 0 ? Number(value.toFixed(decimals)) : Math.round(value)
}
```

- [ ] **Step 5: Implement useTextReveal**

```typescript
// useTextReveal.ts
import { interpolate } from 'remotion'

interface TextRevealConfig {
  frame: number
  wordCount: number
  delayBetween?: number
}

const DEFAULTS = { delayBetween: 6 }

export function useTextReveal(frame: number, wordCount: number, config: Omit<TextRevealConfig, 'frame' | 'wordCount'> = {}) {
  const merged = { ...DEFAULTS, ...config }
  return useTextReveal.compute({ frame, wordCount, ...merged })
}

useTextReveal.compute = ({
  frame,
  wordCount,
  delayBetween = 6,
}: TextRevealConfig): { visibleCount: number; getStyle: (index: number) => { opacity: number } } => {
  const visibleCount = Math.min(
    wordCount,
    Math.floor(frame / delayBetween),
  )
  return {
    visibleCount,
    getStyle: (index: number) => ({
      style: {
        opacity: index < visibleCount ? 1 : 0,
      },
    }),
  }
}
```

- [ ] **Step 6: Run all animation tests**

```bash
cd remotion && pnpm vitest run src/components/animations/animations.test.ts
```

Expected: all tests PASS (9 entry + 11 content = 20 total)

- [ ] **Step 7: Commit**

```bash
git add remotion/src/components/animations/useStagger.ts remotion/src/components/animations/useNumberRoll.ts remotion/src/components/animations/useTextReveal.ts remotion/src/components/animations/animations.test.ts
git commit -m "feat: add content animation hooks (useStagger, useNumberRoll, useTextReveal)"
```

---

### Task 4: Continuous Animation Hooks (useFloat, usePulse, useRotate)

**Files:**
- Create: `remotion/src/components/animations/useFloat.ts`
- Create: `remotion/src/components/animations/usePulse.ts`
- Create: `remotion/src/components/animations/useRotate.ts`
- Modify: `remotion/src/components/animations/animations.test.ts`

- [ ] **Step 1: Add failing tests**

```typescript
// Add to animations.test.ts
import { useFloat } from './useFloat'
import { usePulse } from './usePulse'
import { useRotate } from './useRotate'

describe('useFloat', () => {
  it('returns 0 translateY at frame 0', () => {
    const result = useFloat.compute({ frame: 0 })
    expect(result.transform).toContain('translateY(0')
  })

  it('returns non-zero translateY during animation', () => {
    const result = useFloat.compute({ frame: 15, amplitude: 10, speed: 0.05 })
    expect(result.transform).toBeDefined()
  })

  it('oscillates (returns to near 0 after full cycle)', () => {
    const result1 = useFloat.compute({ frame: 0, speed: 0.1 })
    const result2 = useFloat.compute({ frame: 63, speed: 0.1 }) // ~2π / 0.1 ≈ 63
    const y1 = parseFloat(result1.transform.match(/translateY\((.+?)px\)/)?.[1] ?? '999')
    const y2 = parseFloat(result2.transform.match(/translateY\((.+?)px\)/)?.[1] ?? '999')
    expect(Math.abs(y1 - y2)).toBeLessThan(2)
  })
})

describe('usePulse', () => {
  it('returns scale 1 at frame 0', () => {
    const result = usePulse.compute({ frame: 0 })
    expect(result.transform).toContain('scale(1)')
  })

  it('returns scale > 1 during pulse', () => {
    const result = usePulse.compute({ frame: 15, minScale: 1, maxScale: 1.05, speed: 0.1 })
    const scale = parseFloat(result.transform.match(/scale\((.+?)\)/)?.[1] ?? '1')
    expect(scale).toBeGreaterThan(1)
  })
})

describe('useRotate', () => {
  it('returns 0 rotation at frame 0', () => {
    const result = useRotate.compute({ frame: 0 })
    expect(result.transform).toContain('rotate(0deg)')
  })

  it('increases rotation over time', () => {
    const r1 = useRotate.compute({ frame: 0, speed: 1 })
    const r2 = useRotate.compute({ frame: 30, speed: 1 })
    const d1 = parseFloat(r1.transform.match(/rotate\((.+?)deg\)/)?.[1] ?? '0')
    const d2 = parseFloat(r2.transform.match(/rotate\((.+?)deg\)/)?.[1] ?? '0')
    expect(d2).toBeGreaterThan(d1)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd remotion && pnpm vitest run src/components/animations/animations.test.ts
```

- [ ] **Step 3: Implement all three hooks**

```typescript
// useFloat.ts
interface FloatConfig {
  frame: number
  amplitude?: number
  speed?: number
}

const DEFAULTS = { amplitude: 8, speed: 0.04 }

export function useFloat(frame: number, config: Omit<FloatConfig, 'frame'> = {}) {
  return useFloat.compute({ frame, ...DEFAULTS, ...config })
}

useFloat.compute = ({ frame, amplitude = 8, speed = 0.04 }: FloatConfig) => {
  const translateY = Math.sin(frame * speed) * amplitude
  return { style: { transform: `translateY(${translateY}px)` } }
}
```

```typescript
// usePulse.ts
interface PulseConfig {
  frame: number
  minScale?: number
  maxScale?: number
  speed?: number
}

const DEFAULTS = { minScale: 1, maxScale: 1.05, speed: 0.08 }

export function usePulse(frame: number, config: Omit<PulseConfig, 'frame'> = {}) {
  return usePulse.compute({ frame, ...DEFAULTS, ...config })
}

usePulse.compute = ({ frame, minScale = 1, maxScale = 1.05, speed = 0.08 }: PulseConfig) => {
  const scale = interpolate(Math.sin(frame * speed), [-1, 1], [minScale, maxScale])
  return { style: { transform: `scale(${scale})` } }
}

import { interpolate } from 'remotion'
```

> NOTE: `interpolate` import must be at the top of the file, not after the interface. Move it up when writing the file.

```typescript
// useRotate.ts
interface RotateConfig {
  frame: number
  speed?: number
}

const DEFAULTS = { speed: 0.5 }

export function useRotate(frame: number, config: Omit<RotateConfig, 'frame'> = {}) {
  return useRotate.compute({ frame, ...DEFAULTS, ...config })
}

useRotate.compute = ({ frame, speed = 0.5 }: RotateConfig) => {
  const rotation = frame * speed
  return { style: { transform: `rotate(${rotation}deg)` } }
}
```

- [ ] **Step 4: Run all animation tests**

```bash
cd remotion && pnpm vitest run src/components/animations/animations.test.ts
```

Expected: all tests PASS (20 + 7 = 27 total)

- [ ] **Step 5: Commit**

```bash
git add remotion/src/components/animations/useFloat.ts remotion/src/components/animations/usePulse.ts remotion/src/components/animations/useRotate.ts remotion/src/components/animations/animations.test.ts
git commit -m "feat: add continuous animation hooks (useFloat, usePulse, useRotate)"
```

---

### Task 5: Animation Index + Components Index Update

**Files:**
- Create: `remotion/src/components/animations/index.ts`
- Modify: `remotion/src/components/index.ts`

- [ ] **Step 1: Create animations/index.ts**

```typescript
export { useFadeIn } from './useFadeIn'
export { useScaleIn } from './useScaleIn'
export { useSlideIn } from './useSlideIn'
export { useStagger } from './useStagger'
export { useNumberRoll } from './useNumberRoll'
export { useTextReveal } from './useTextReveal'
export { useFloat } from './useFloat'
export { usePulse } from './usePulse'
export { useRotate } from './useRotate'
```

- [ ] **Step 2: Update components/index.ts**

Add after the "=== Visual elements ===" section:

```typescript
// === Animations ===
export { useFadeIn, useScaleIn, useSlideIn } from './animations'
export { useStagger, useNumberRoll, useTextReveal } from './animations'
export { useFloat, usePulse, useRotate } from './animations'
```

- [ ] **Step 3: Commit**

```bash
git add remotion/src/components/animations/index.ts remotion/src/components/index.ts
git commit -m "feat: add animation hooks index and re-export from components"
```

---

### Task 6: Background Components (FloatingOrbs, GradientFlow)

**Files:**
- Create: `remotion/src/components/backgrounds/FloatingOrbs.tsx`
- Create: `remotion/src/components/backgrounds/GradientFlow.tsx`

- [ ] **Step 1: Implement FloatingOrbs**

```typescript
// FloatingOrbs.tsx
import React from 'react'
import { useCurrentFrame } from 'remotion'

interface FloatingOrbsProps {
  count?: number
  colors?: string[]
  speed?: number
}

const DEFAULT_COLORS = ['#3b82f640', '#8b5cf630', '#06b6d428']

export const FloatingOrbs: React.FC<FloatingOrbsProps> = ({
  count = 3,
  colors = DEFAULT_COLORS,
  speed = 0.02,
}) => {
  const frame = useCurrentFrame()

  const orbs = Array.from({ length: count }, (_, i) => {
    const color = colors[i % colors.length]
    const size = 200 + (i * 80) % 300
    const x = ((i * 37 + 15) % 80) + 10 // pseudo-random x 10-90%
    const yBase = ((i * 53 + 25) % 60) + 20 // pseudo-random y 20-80%
    const yOffset = Math.sin(frame * speed + i * 2) * 40
    const xOffset = Math.cos(frame * speed * 0.7 + i * 1.5) * 30

    return (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: `${x}%`,
          top: `${yBase}%`,
          width: size,
          height: size,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          transform: `translate(${xOffset}px, ${yOffset}px)`,
          pointerEvents: 'none',
          filter: 'blur(40px)',
        }}
      />
    )
  })

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {orbs}
    </div>
  )
}
```

- [ ] **Step 2: Implement GradientFlow**

```typescript
// GradientFlow.tsx
import React from 'react'
import { useCurrentFrame, interpolate } from 'remotion'

interface GradientFlowProps {
  colors: string[]
  duration?: number
  angle?: number
}

export const GradientFlow: React.FC<GradientFlowProps> = ({
  colors,
  duration = 180,
  angle = 135,
}) => {
  const frame = useCurrentFrame()
  const progress = (frame % (duration * 2)) / duration // 0 → 2 cycle
  const angleOffset = interpolate(
    Math.sin(progress * Math.PI),
    [-1, 1],
    [-30, 30],
  )
  const currentAngle = angle + angleOffset

  // Shift color stops
  const shift = Math.floor(progress * colors.length) % colors.length
  const shifted = [...colors.slice(shift), ...colors.slice(0, shift)]
  const gradientColors = shifted.slice(0, 2)

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(${currentAngle}deg, ${gradientColors.join(', ')})`,
        pointerEvents: 'none',
      }}
    />
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add remotion/src/components/backgrounds/FloatingOrbs.tsx remotion/src/components/backgrounds/GradientFlow.tsx
git commit -m "feat: add FloatingOrbs and GradientFlow background components"
```

---

### Task 7: Background Components (GridPattern, ParticleField) + Index

**Files:**
- Create: `remotion/src/components/backgrounds/GridPattern.tsx`
- Create: `remotion/src/components/backgrounds/ParticleField.tsx`
- Create: `remotion/src/components/backgrounds/index.ts`
- Modify: `remotion/src/components/index.ts`

- [ ] **Step 1: Implement GridPattern**

```typescript
// GridPattern.tsx
import React from 'react'

interface GridPatternProps {
  color?: string
  opacity?: number
  spacing?: number
}

export const GridPattern: React.FC<GridPatternProps> = ({
  color = '#ffffff',
  opacity = 0.05,
  spacing = 60,
}) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      opacity,
      pointerEvents: 'none',
      backgroundImage: `
        linear-gradient(${color} 1px, transparent 1px),
        linear-gradient(90deg, ${color} 1px, transparent 1px)
      `,
      backgroundSize: `${spacing}px ${spacing}px`,
    }}
  />
)
```

- [ ] **Step 2: Implement ParticleField**

```typescript
// ParticleField.tsx
import React from 'react'
import { useCurrentFrame } from 'remotion'

interface ParticleFieldProps {
  count?: number
  color?: string
  speed?: number
}

export const ParticleField: React.FC<ParticleFieldProps> = ({
  count = 20,
  color = '#ffffff',
  speed = 0.01,
}) => {
  const frame = useCurrentFrame()

  // Deterministic pseudo-random positions based on index
  const particles = Array.from({ length: count }, (_, i) => {
    const x = ((i * 73 + 17) % 100)
    const yBase = ((i * 47 + 31) % 100)
    const yOffset = ((frame * speed * 30 + i * 50) % 110) - 5 // -5 to 105, wrapping
    const size = 2 + (i % 3)
    const particleOpacity = 0.1 + (i % 5) * 0.05

    return (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: `${x}%`,
          top: `${yOffset}%`,
          width: size,
          height: size,
          borderRadius: '50%',
          backgroundColor: color,
          opacity: particleOpacity,
          pointerEvents: 'none',
        }}
      />
    )
  })

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {particles}
    </div>
  )
}
```

- [ ] **Step 3: Create backgrounds/index.ts**

```typescript
export { FloatingOrbs } from './FloatingOrbs'
export { GradientFlow } from './GradientFlow'
export { GridPattern } from './GridPattern'
export { ParticleField } from './ParticleField'
```

- [ ] **Step 4: Update components/index.ts**

Add after the Animations export block:

```typescript
// === Backgrounds ===
export { FloatingOrbs, GradientFlow, GridPattern, ParticleField } from './backgrounds'
```

- [ ] **Step 5: Commit**

```bash
git add remotion/src/components/backgrounds/ remotion/src/components/index.ts
git commit -m "feat: add GridPattern, ParticleField backgrounds and index"
```

---

### Task 8: Add backgroundLayer Prop to Layout Primitives

**Files:**
- Modify: `remotion/src/components/CenteredStack.tsx`
- Modify: `remotion/src/components/HubLayout.tsx`
- Modify: `remotion/src/components/TimelineFlow.tsx`
- Modify: `remotion/src/components/TwoColumnCompare.tsx`

- [ ] **Step 1: Add to CenteredStack**

Add `backgroundLayer?: React.ReactNode` to the `CenteredStackProps` interface.

In the return JSX, add as the **first child** of `<SafeArea>` (before the content `<div>`):

```tsx
{backgroundLayer}
```

- [ ] **Step 2: Add to HubLayout**

Add `backgroundLayer?: React.ReactNode` to `HubLayoutProps`.

In the return JSX, add as the **first child** of `<AbsoluteFill>` (before the SVG):

```tsx
{backgroundLayer}
```

- [ ] **Step 3: Add to TimelineFlow**

Add `backgroundLayer?: React.ReactNode` to `TimelineFlowProps`.

In the return JSX, add as the **first child** of `<SafeArea>`:

```tsx
{backgroundLayer}
```

- [ ] **Step 4: Add to TwoColumnCompare**

Add `backgroundLayer?: React.ReactNode` to `TwoColumnCompareProps`.

In the return JSX, add as the **first child** of `<AbsoluteFill>`:

```tsx
{backgroundLayer}
```

- [ ] **Step 5: Commit**

```bash
git add remotion/src/components/CenteredStack.tsx remotion/src/components/HubLayout.tsx remotion/src/components/TimelineFlow.tsx remotion/src/components/TwoColumnCompare.tsx
git commit -m "feat: add backgroundLayer prop to layout primitives"
```

---

### Task 9: Transition Component

**Files:**
- Create: `remotion/src/components/transitions/Transition.tsx`
- Create: `remotion/src/components/transitions/index.ts`
- Modify: `remotion/src/components/index.ts`

- [ ] **Step 1: Implement Transition**

```typescript
// Transition.tsx
import React from 'react'
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion'

type TransitionType = 'fade' | 'slide-left' | 'slide-right' | 'slide-up' | 'slide-down' | 'zoom-in' | 'zoom-out'

interface TransitionProps {
  children: React.ReactNode
  type?: TransitionType
  duration?: number
}

const DIRECTION_OFFSETS: Record<string, { prop: string; from: number; to: number }> = {
  'slide-left':  { prop: 'translateX', from: 300, to: 0 },
  'slide-right': { prop: 'translateX', from: -300, to: 0 },
  'slide-up':    { prop: 'translateY', from: 300, to: 0 },
  'slide-down':  { prop: 'translateY', from: -300, to: 0 },
}

export const Transition: React.FC<TransitionProps> = ({
  children,
  type = 'fade',
  duration = 15,
}) => {
  const frame = useCurrentFrame()

  const entryStyle = getEntryStyle(type, frame, duration)

  return (
    <AbsoluteFill style={{ ...entryStyle }}>
      {children}
    </AbsoluteFill>
  )
}

function getEntryStyle(type: TransitionType, frame: number, duration: number): React.CSSProperties {
  const progress = interpolate(frame, [0, duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  if (type === 'fade') {
    return { opacity: progress }
  }

  if (type === 'zoom-in') {
    const scale = interpolate(progress, [0, 1], [0.85, 1])
    return { opacity: progress, transform: `scale(${scale})` }
  }

  if (type === 'zoom-out') {
    const scale = interpolate(progress, [0, 1], [1.1, 1])
    return { opacity: progress, transform: `scale(${scale})` }
  }

  const offset = DIRECTION_OFFSETS[type]
  if (offset) {
    const value = interpolate(progress, [0, 1], [offset.from, offset.to])
    return { opacity: progress, transform: `${offset.prop}(${value}px)` }
  }

  return { opacity: progress }
}
```

- [ ] **Step 2: Create transitions/index.ts**

```typescript
export { Transition } from './Transition'
export type { TransitionType } from './Transition'
```

- [ ] **Step 3: Update components/index.ts**

```typescript
// === Transitions ===
export { Transition } from './transitions'
```

- [ ] **Step 4: Commit**

```bash
git add remotion/src/components/transitions/ remotion/src/components/index.ts
git commit -m "feat: add Transition component for shot transitions"
```

---

### Task 10: Deepseek-v4 Shot Upgrades (Shot1, Shot2, Shot3)

**Files:**
- Modify: `remotion/src/projects/deepseek-v4/shots/Shot1.tsx`
- Modify: `remotion/src/projects/deepseek-v4/shots/Shot2.tsx`
- Modify: `remotion/src/projects/deepseek-v4/shots/Shot3.tsx`

- [ ] **Step 1: Upgrade Shot1**

Key changes:
- Import `useScaleIn`, `useTextReveal`, `useFloat`, `FloatingOrbs` from `../../../components`
- Replace raw spring with `useScaleIn`
- Add `useTextReveal` for subtitle text
- Add `useFloat` on decorative rings
- Add `FloatingOrbs` as first child of CenteredStack

Read current `Shot1.tsx`, then apply edits.

- [ ] **Step 2: Upgrade Shot2**

Key changes:
- Import `useStagger` from `../../../components`
- Replace per-bar spring with `useStagger(3, 10)` for staggered bar growth
- Price tag uses `useSlideIn('up', { delay: 60 })`

- [ ] **Step 3: Upgrade Shot3**

Key changes:
- Import `useStagger` from `../../../components`
- Replace flat `nodeFadeIn` with `useStagger(4, 12)` — apply staggered styles to surrounding nodes
- Connection lines opacity tied to last stagger item

- [ ] **Step 4: Commit**

```bash
git add remotion/src/projects/deepseek-v4/shots/Shot1.tsx remotion/src/projects/deepseek-v4/shots/Shot2.tsx remotion/src/projects/deepseek-v4/shots/Shot3.tsx
git commit -m "feat(deepseek-v4): upgrade Shot1-3 with animation hooks and backgrounds"
```

---

### Task 11: Deepseek-v4 Shot Upgrades (Shot4, Shot5, Shot6, Shot7)

**Files:**
- Modify: `remotion/src/projects/deepseek-v4/shots/Shot4.tsx`
- Modify: `remotion/src/projects/deepseek-v4/shots/Shot5.tsx`
- Modify: `remotion/src/projects/deepseek-v4/shots/Shot6.tsx`
- Modify: `remotion/src/projects/deepseek-v4/shots/Shot7.tsx`

- [ ] **Step 1: Upgrade Shot4**

Key changes:
- Import `useStagger`, `GradientFlow` from `../../../components`
- Replace manual fade1-4 with `useStagger(3, 12)` applied to TimelineFlow items
- Add `GradientFlow` via `backgroundLayer` prop or as first child

- [ ] **Step 2: Upgrade Shot5**

Key changes:
- Same stagger pattern as Shot4
- Footer conclusion uses `useScaleIn` for emphasis

- [ ] **Step 3: Upgrade Shot6**

Key changes:
- Import `useStagger`, `useNumberRoll`, `useFloat` from `../../../components`
- Replace per-circle spring with `useStagger(3, 10)` for staggered circle entry
- Price numbers use `useNumberRoll` — e.g., `useNumberRoll(frame, 0.14, { decimals: 2 })` instead of hardcoded "$0.14"
- Size hierarchy stays (140/180/240) but animated via stagger

- [ ] **Step 4: Upgrade Shot7**

Key changes:
- Import `useStagger`, `GradientFlow`, `FloatingOrbs` from `../../../components`
- Replace flat `nodeFadeIn` with `useStagger(4, 10)` for tag reveals
- Add `GradientFlow` + `FloatingOrbs` as background

- [ ] **Step 5: Commit**

```bash
git add remotion/src/projects/deepseek-v4/shots/Shot4.tsx remotion/src/projects/deepseek-v4/shots/Shot5.tsx remotion/src/projects/deepseek-v4/shots/Shot6.tsx remotion/src/projects/deepseek-v4/shots/Shot7.tsx
git commit -m "feat(deepseek-v4): upgrade Shot4-7 with animation hooks and backgrounds"
```

---

### Task 12: Deepseek-v4 Composition Transitions

**Files:**
- Modify: `remotion/src/projects/deepseek-v4/composition.tsx`

- [ ] **Step 1: Add Transition imports and wrap each Sequence**

```typescript
import { Transition } from '../../../components'
```

Wrap each shot in `<Transition type="...">`:

| Sequence | Transition type |
|----------|---------------|
| Shot1 | (no transition — opening) |
| Shot2 | `<Transition type="slide-left">` |
| Shot3 | `<Transition type="zoom-in">` |
| Shot4 | `<Transition type="slide-up">` |
| Shot5 | `<Transition type="fade">` |
| Shot6 | `<Transition type="slide-left">` |
| Shot7 | `<Transition type="zoom-in">` |

- [ ] **Step 2: Commit**

```bash
git add remotion/src/projects/deepseek-v4/composition.tsx
git commit -m "feat(deepseek-v4): add shot transitions"
```

---

### Task 13: Verify in Remotion Studio

**Files:** none

- [ ] **Step 1: Start Remotion Studio**

```bash
cd remotion && npx remotion studio src/root.tsx &
```

- [ ] **Step 2: Visual verification**

Open http://localhost:3000, navigate to DeepseekV4 composition:
- [ ] Shot1: Title scales in, decorative rings float, background orbs visible
- [ ] Shot2: Bar chart bars stagger in, price tag slides up
- [ ] Shot3: Hub nodes stagger in, connection lines draw sequentially
- [ ] Shot4: Timeline items stagger slide in, gradient background flows
- [ ] Shot5: Same stagger + footer emphasis
- [ ] Shot6: Price circles stagger in, numbers roll from 0
- [ ] Shot7: Tags stagger in, gradient + orbs background
- [ ] Transitions between shots are smooth (not hard cuts)

- [ ] **Step 3: Run all tests**

```bash
cd remotion && pnpm vitest run
```

Expected: all tests PASS

---

### Task 14: Update remotion-video Skill

**Files:**
- Modify: `.claude/skills/remotion-video/SKILL.md`

- [ ] **Step 1: Add "Reusable Animation Hooks" section**

Insert after the "## Remotion Best Practices" section, before "## VISUAL IDENTITY":

Add a section that:
- Lists all hooks with brief descriptions
- Shows import pattern: `import { useSlideIn, useStagger, useNumberRoll, useFloat } from '../../../components'`
- States that hooks are **preferred** over inline animation code
- Shows usage examples for each hook category
- Notes that existing inline patterns remain valid as reference

- [ ] **Step 2: Add background components to Background Style Variations table**

Add rows for:
- Floating orbs: `<FloatingOrbs>` component
- Gradient flow: `<GradientFlow>` component
- Grid pattern: `<GridPattern>` component

- [ ] **Step 3: Add backgroundLayer usage to layout primitive examples**

Show `<CenteredStack backgroundLayer={<FloatingOrbs />}>` pattern.

- [ ] **Step 4: Commit**

```bash
git add .claude/skills/remotion-video/SKILL.md
git commit -m "docs: update remotion-video skill with animation hooks and backgrounds"
```

---

### Task 15: Update video-review Skill

**Files:**
- Modify: `.claude/skills/video-review/SKILL.md`

- [ ] **Step 1: Add animation hooks checks to Section 7.5**

Add to the Visual Richness table:

| Check | Requirement |
|-------|-------------|
| Animation hooks used | Shots prefer hooks from `components/animations/` over inline interpolate/spring |
| Background atmosphere | ≥2 shots have background component or backgroundLayer prop |
| Number data animated | Data shots use `useNumberRoll` instead of static text |
| Stagger on lists | Timeline/Hub shots with 3+ items use `useStagger` |

- [ ] **Step 2: Add auto-fix rules**

Add to Auto-Fix Rules section:
- Replace manual per-item interpolate fade with `useStagger` when 3+ items with same pattern
- Replace static number display with `useNumberRoll` in data/comparison shots
- Suggest `FloatingOrbs` or `GradientFlow` when all shots use plain gradients

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/video-review/SKILL.md
git commit -m "docs: update video-review skill with animation and background checks"
```

---

## Summary

| Phase | Tasks | Key Deliverable |
|-------|-------|----------------|
| Dependencies | 1 | @remotion/motion installed |
| Animation Hooks | 2-5 | 9 hooks with 27 tests |
| Backgrounds | 6-7 | 4 components |
| Layout Primitives | 8 | backgroundLayer prop on 4 primitives |
| Transitions | 9 | Transition component |
| Deepseek-v4 Retrofit | 10-12 | 7 shots + composition upgraded |
| Verification | 13 | Visual + test verification |
| Skill Updates | 14-15 | remotion-video + video-review updated |
