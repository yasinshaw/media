# Animation Enhancement for Remotion Videos

## Summary

Lift the visual density of Remotion-generated Douyin videos from "static layouts + entrance animations only" to "continuous motion + cinematic camera + decorative layers". Three additions: KenBurns/CameraPan motion on background images, persistent micro-animations baked into layout primitives, and pre-staged Lottie + Starburst decoration that activates automatically by shot role.

## Problem

Current videos suffer from three symptoms:

1. **Static after first second**: Each shot has an entrance animation, then the frame freezes for 4–8 seconds. AI-generated background images and gradients sit motionless.
2. **Lottie / Starburst documented but unused**: `remotion-video/SKILL.md` describes both, yet zero past projects actually ship them. Friction is too high — every use requires manual JSON sourcing, fetch wiring in shot code, and explicit script declaration.
3. **No persistent life signal**: Titles, hub centers, and accent elements never breathe or float. The result reads as a slideshow, not a video.

## Design Decisions

- **Half-automatic by default**: Effects activate from shot role / asset type without script changes; scripts can opt out per shot.
- **Bake into Layout primitives, not shot code**: Persistent animations live inside `CenteredStack`/`HubLayout`/`TwoColumnCompare`/`TimelineFlow`. Old projects re-render with improvements automatically — no shot rewrites.
- **Pre-stage Lottie assets, never lazy-fetch**: Eight curated Lottie JSON files ship in `remotion/public/animations/`. Components consume `staticFile()`. No runtime `fetch` against external URLs during render.
- **Motion intensity stays subtle**: Persistent animations cap at ~1.5% scale / 4px translate to avoid distraction. KenBurns spans the full shot duration with eased zoom (1.0 → 1.08).

---

## Part 1: KenBurns / Camera Motion Component

### Component: `remotion/src/components/KenBurns.tsx`

Wraps `<Img>` or `<Video>` to apply slow zoom or pan over the shot's lifetime.

```tsx
interface KenBurnsProps {
  src: string  // staticFile path
  type?: 'image' | 'video'  // default 'image'
  motion?: 'zoom-in' | 'zoom-out' | 'pan-left' | 'pan-right' | 'random'  // default 'zoom-in'
  duration: number  // frames; usually shot duration from useVideoConfig
  intensity?: 'subtle' | 'normal'  // default 'subtle' (zoom 1.0→1.08, pan 8% width)
  children?: React.ReactNode  // optional foreground overlay (text, etc.)
}
```

Implementation: `useCurrentFrame()` + `interpolate()` with `Easing.inOut(Easing.quad)` over the full `duration`. Motion stops cleanly at the last frame (no overshoot via `extrapolateRight: 'clamp'`).

### Auto-application rule (modifies `remotion-video/SKILL.md`)

When generating a shot:

| Background type | Default motion | Script override |
|-----------------|----------------|-----------------|
| AI background image (`画面类型: ai背景图`) | `zoom-in` (intensity: subtle) | `**镜头运动**: pan-left \| zoom-out \| none` |
| Pixabay video (from `/asset-pack`) | None (the video itself moves) | `**镜头运动**: zoom-in` to add subtle zoom |
| Pixabay image (from `/asset-pack`) | `random` (alternates per shot) | Same field |
| Pure gradient / solid | None | `**镜头运动**: <type>` to opt in |

`random` deterministically picks from `[zoom-in, zoom-out, pan-left, pan-right]` based on shot index, ensuring consecutive shots don't repeat motion.

---

## Part 2: Persistent Micro-Animations

### Hooks: `remotion/src/hooks/useBreathing.ts` & `useFloat.ts`

```tsx
// Breathing: subtle scale oscillation
useBreathing(opts?: { amplitude?: number; period?: number }): { transform: string }
// default amplitude 0.015 (1.5%), period 90 frames (3s @ 30fps)

// Float: subtle vertical drift
useFloat(opts?: { amplitude?: number; period?: number; phase?: number }): { transform: string }
// default amplitude 4 (px), period 120 frames (4s @ 30fps)
```

Both use `Math.sin(2 * Math.PI * frame / period)` so they're deterministic and loop seamlessly.

### Layout primitive integration

Each primitive accepts a new prop `persistentAnim?: 'off' | 'breathing' | 'float' | 'auto'` (default `'auto'`):

| Primitive | `auto` behavior |
|-----------|----------------|
| `CenteredStack` | Title (first child if heading) gets `breathing` |
| `HubLayout` | Center node gets `breathing`; surrounding nodes get `float` with staggered phases |
| `TwoColumnCompare` | Both panel titles get `breathing` |
| `TimelineFlow` | Currently active step (computed from frame timing) gets `float`; others static |

### Script field

```markdown
### 镜头 1：标题亮相
**持续动画**: off
```

Values: `off` | `breathing` | `float` | `auto` (default). `off` disables for that shot.

---

## Part 3: Lottie & Starburst Decoration

### Lottie pre-staged assets

Eight Lottie JSON files under `remotion/public/animations/`, hand-picked from LottieFiles, downloaded **asynchronously and in parallel** during initial setup:

| File | Use case | Auto-bind shot role |
|------|----------|---------------------|
| `celebration.json` | Confetti / fireworks | CTA |
| `tech-particles.json` | Floating tech particles | Hook (alternative to starburst) |
| `data-flow.json` | Animated data lines | Data / 统计 / 对比 shots |
| `success-check.json` | Animated checkmark | CTA secondary, success states |
| `question-mark.json` | Bouncing question mark | Hook (when title contains 为什么/到底/真的吗) |
| `warning.json` | Pulsing warning icon | 痛点 shots |
| `loading.json` | Spinning loader | Process / 等待 shots |
| `sparkle.json` | Subtle sparkles | Quote / 金句 shots |

### Component: `remotion/src/components/LottieDecorator.tsx`

```tsx
interface LottieDecoratorProps {
  animation: 'celebration' | 'tech-particles' | 'data-flow' | 'success-check' |
             'question-mark' | 'warning' | 'loading' | 'sparkle'
  position?: 'background' | 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center'
  size?: number  // default 300px (corner) or full-screen (background)
  opacity?: number  // default 0.3 for background, 0.85 for icon corners
}
```

Loads via `useEffect` + `delayRender`/`continueRender`. JSON read via `staticFile('animations/X.json')` (no remote fetch during render).

### Component: `remotion/src/components/Starburst.tsx`

Thin wrapper around `@remotion/starburst`:

```tsx
interface StarburstProps {
  numRays?: number  // default 16
  rotationSpeed?: number  // default 0.5 (degrees per frame)
  color?: string  // default theme.accent
  opacity?: number  // default 0.2
}
```

### Auto-application rule (modifies `remotion-video/SKILL.md`)

When generating a shot, inspect the shot's role and content:

| Shot role | Auto-decorator |
|-----------|---------------|
| Hook | One of: `<Starburst>` (50%) or `<LottieDecorator animation="tech-particles" position="background">` (50%); alternates by project |
| Hook with 为什么/到底/真的吗 in title | `<LottieDecorator animation="question-mark" position="top-right">` overrides above |
| 痛点 | `<LottieDecorator animation="warning" position="top-right" size={200}>` |
| Data / 统计 / 对比 | `<LottieDecorator animation="data-flow" position="background" opacity={0.15}>` |
| CTA | `<LottieDecorator animation="celebration" position="background">` + `<LottieDecorator animation="success-check" position="top-right">` |
| 金句 | `<LottieDecorator animation="sparkle" position="background" opacity={0.2}>` |
| Default | None |

### Script override

```markdown
**装饰层**: off          # disable auto decorator
**装饰层**: starburst    # force starburst regardless of role
**装饰层**: question-mark @ top-right size=200
```

Format: `<animation-name> [@ <position>] [size=<n>] [opacity=<n>]` or `off`.

---

## Part 4: Skill Integration

### Modifications to `remotion-video/SKILL.md`

Add three new sections:
- **Camera Motion** — KenBurns auto-application table + script field
- **Persistent Animation** — primitive prop documentation
- **Decoration Layers** — Lottie/Starburst auto-binding table + script field

Update the FATAL RULES list to include:
- "Use `<KenBurns>` to wrap any `<Img>` or `<Video>` from `assets/stock/` or AI background images. Naked `<Img>` for backgrounds is forbidden."

### Modifications to `video-script/SKILL.md`

Add optional script fields (the skill emits them when relevant):
- `**镜头运动**` — only when overriding default
- `**持续动画**` — only when disabling
- `**装饰层**` — only when overriding default

The script generator emits a comment block at the top listing the auto-applied effects so users can see what will happen without reading the code:

```markdown
<!-- 自动效果（auto-applied by remotion-video）:
  Shot 1 (Hook): KenBurns zoom-in + Starburst background
  Shot 2 (痛点): warning Lottie top-right
  Shot 3 (数据): data-flow Lottie background
  Shot 4 (核心): no decorator
  Shot 5 (CTA): celebration + success-check Lotties
-->
```

---

## File Structure

```
remotion/
├── public/
│   └── animations/                    # NEW
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
│   │   ├── CenteredStack.tsx          # MODIFIED (persistent anim)
│   │   ├── HubLayout.tsx              # MODIFIED (persistent anim)
│   │   ├── TwoColumnCompare.tsx       # MODIFIED (persistent anim)
│   │   ├── TimelineFlow.tsx           # MODIFIED (persistent anim)
│   │   └── index.ts                   # MODIFIED (re-export)
│   └── hooks/                         # NEW directory
│       ├── useBreathing.ts            # NEW
│       └── useFloat.ts                # NEW
└── package.json                       # MODIFIED (+ @remotion/lottie, @remotion/starburst)

.claude/skills/
├── remotion-video/SKILL.md            # MODIFIED (3 new sections + FATAL rule)
└── video-script/SKILL.md              # MODIFIED (3 new optional fields)
```

---

## Error Handling

| Failure | Behavior |
|---------|----------|
| Lottie JSON file missing | Skill warns at generation time, omits decorator from shot code, render proceeds without it |
| `@remotion/lottie` or `@remotion/starburst` not installed | Skill auto-runs `pnpm exec remotion add` before generating shots |
| Script declares unknown decorator name | Skill warns, falls back to auto-rule for that shot's role |
| KenBurns wraps a missing image | `<Img>` 404 surfaces from Remotion as usual; KenBurns adds no extra error path |

---

## Testing Strategy

This is React + Remotion code. Unit tests for hooks (`useBreathing`, `useFloat`) verify deterministic output for given frame inputs. Visual verification via Remotion Studio preview on a representative project (re-render `2026-04-25-deepseek-v4` with the new pipeline and visually confirm motion).

No automated visual regression — manual eyeball check, since "looks good" is the success criterion.

---

## Dependencies

- `@remotion/lottie` (new)
- `@remotion/starburst` (new)

Installed via `pnpm exec remotion add` during setup. Lottie JSON files downloaded from LottieFiles **asynchronously and in parallel** (8 files, ~30s wall time if serial, ~5s parallel).

---

## Out of Scope

- Camera 3D rotation / parallax effects (could be Phase 2)
- Animated transitions between Lottie animations within a shot (single decorator per shot)
- AI-generated Lottie (use only the 8 curated set)
- Video-driven motion (use the video's motion as-is, don't re-animate)

---

## Success Criteria

- All four layout primitives accept `persistentAnim` prop and apply default `auto` behavior
- KenBurns wraps every AI background image and Pixabay-sourced media without manual script declaration
- At least 4 of 8 Lottie animations show up automatically in a typical 6-shot script (hook + 痛点 + data + CTA covers 4 already)
- Re-rendering an existing project (e.g., `2026-04-25-deepseek-v4`) produces visibly more dynamic output without script edits
- New scripts can opt out per shot with `**持续动画**: off` / `**镜头运动**: none` / `**装饰层**: off`
