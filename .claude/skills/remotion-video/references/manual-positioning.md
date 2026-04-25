# Manual Positioning (Escape Hatch)

**Read this only if no layout primitive (CenteredStack / HubLayout / TwoColumnCompare / TimelineFlow) fits.** 95% of shots should compose primitives. Hand-written absolute positioning is where misalignment bugs come from.

## When you must write your own absolute positioning

If you've decided no primitive fits — e.g. a one-off chart, custom diagram, infographic — these rules prevent the recurring bugs.

### Rule 1: Always use `SafeArea` wrapper

```tsx
import { SafeArea } from '../../../components'

<SafeArea style={{ background: '...' }}>
  {/* content */}
</SafeArea>
```

NEVER hand-write `padding: '120px 40px 200px'`. The constants in `SAFE_AREA` are the source of truth.

### Rule 2: Center elements with `transform: translate(-50%, -50%)`

```tsx
// ❌ Fixed offset breaks with variable content
<div style={{ position: 'absolute', left: x - 80, top: y - 40 }}>{text}</div>

// ✅ Centers regardless of content size
<div style={{
  position: 'absolute',
  left: x,
  top: y,
  transform: 'translate(-50%, -50%)',
}}>{text}</div>
```

### Rule 3: SVG and elements share the same coordinate system

If you draw an SVG line to an element, both must use the same coordinate basis.

**Best pattern: SVG with `viewBox` matching canvas, both elements and SVG use absolute pixels.**

```tsx
import { LAYOUT } from '../../../components'

<AbsoluteFill>
  <svg
    viewBox={`0 0 ${LAYOUT.WIDTH} ${LAYOUT.HEIGHT}`}
    style={{ position: 'absolute', width: '100%', height: '100%' }}
    preserveAspectRatio="none"
  >
    <line x1={540} y1={810} x2={nodeX} y2={nodeY} />
  </svg>

  {/* Element at the same coordinate */}
  <div style={{
    position: 'absolute',
    left: nodeX,
    top: nodeY,
    transform: 'translate(-50%, -50%)',
  }}>{label}</div>
</AbsoluteFill>
```

**Why `viewBox` + `preserveAspectRatio="none"`:** the SVG coordinate system is locked to canvas pixels (1080×1920) regardless of how the SVG is sized in CSS.

### Rule 4: NEVER mix flex layout with SVG-pixel coordinates

```tsx
// ❌ Hub centered by flex, SVG line uses guessed pixel coords
<AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
  <svg><line x1="540" y1="920" x2="232" y2="358" /></svg>  {/* broken if padding changes */}
  <div>Hub</div>
</AbsoluteFill>

// ✅ Use HubLayout — coordinates are computed from the same source of truth
<HubLayout
  center={{ node: <Hub /> }}
  surrounding={[{ position: 'top-left', node: <Node /> }]}
/>
```

### Rule 5: Content must NOT enter the subtitle zone

The subtitle zone is `bottom: 0 → 420px`. Content with `bottom < 420` overlaps the subtitle.

```tsx
// ❌ Content overlaps subtitle
<div style={{ position: 'absolute', bottom: 240 }}>caption</div>

// ✅ Stay above subtitle zone
<div style={{ position: 'absolute', bottom: SAFE_AREA.CONTENT_BOTTOM }}>caption</div>
// or use a layout primitive's `footer` slot
```

## Common patterns reference

### Hub / star layout (manual)

If you really must build a hub manually instead of using `HubLayout`:

```tsx
const centerX = LAYOUT.WIDTH / 2  // 540
const centerY = SAFE_AREA.TOP + (LAYOUT.HEIGHT - SAFE_AREA.TOP - SAFE_AREA.CONTENT_BOTTOM) / 2

const radius = 380
const positions = [
  { angle: -135, label: 'A' },  // top-left
  { angle: -45,  label: 'B' },  // top-right
  { angle: 135,  label: 'C' },  // bottom-left
  { angle: 45,   label: 'D' },  // bottom-right
]

const nodes = positions.map(p => {
  const rad = p.angle * Math.PI / 180
  return { ...p, x: centerX + Math.cos(rad) * radius, y: centerY + Math.sin(rad) * radius }
})
```

### Anchor-relative SVG (when SVG must scale with parent)

If parent dimensions are unknown at build time, anchor SVG inside the element it connects:

```tsx
<div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
  Anchor
  <svg style={{
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: 310,
    height: 200,
    overflow: 'visible',
    zIndex: -1,
  }}>
    {/* Origin (0,0) is now anchor's center via overflow: visible */}
    <line x1={0} y1={0} x2={-100} y2={150} />
  </svg>
</div>
```

**Critical: SVG width MUST match the connected row's full width** (`sum(elementWidths) + sum(gaps)`).

## Animation safety

### Never use boolean opacity for transitions

```tsx
// ❌ Hard cut at threshold
<div style={{ opacity: progress < 0.33 ? 1 : 0 }}>A</div>
<div style={{ opacity: progress >= 0.33 ? 1 : 0 }}>B</div>

// ✅ Smooth crossfade
const aOpacity = interpolate(progress, [0, 0.28, 0.32], [1, 1, 0], { extrapolateRight: 'clamp' })
const bOpacity = interpolate(progress, [0.30, 0.35, 0.62, 0.66], [0, 1, 1, 0], { extrapolateRight: 'clamp' })
```

Adjacent ranges should overlap by 0.03–0.05 progress for smooth crossfade.

### Always include `extrapolateRight: 'clamp'`

Without it, `interpolate` extends linearly past the last keyframe, causing visual drift after the animation ends.
