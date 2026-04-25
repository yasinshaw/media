# Advanced Remotion Features

**All examples optimized for Douyin vertical format (1080×1920)**.

## Audio Waveform Visualization

```tsx
import { useCurrentFrame, useVideoConfig, Audio } from 'remotion'
import { visualizeAudio } from '@remotion/media-utils'

const AudioWaveform: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  return (
    <Audio src={audioFile} />
  )
}
```

## Transitions Between Shots

### Fade Transition

```tsx
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion'

export const FadeTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame()
  const opacity = interpolate(frame, [0, 15], [0, 1])

  return (
    <AbsoluteFill style={{ opacity }}>
      {children}
    </AbsoluteFill>
  )
}
```

### Slide Transition (Vertical Format)

**For Douyin vertical (1080×1920), use height (1920px) for slide distance:**

```tsx
export const SlideTransition: React.FC<{ children: React.ReactNode; direction: 'up' | 'down' | 'left' | 'right' }> = ({ children, direction }) => {
  const frame = useCurrentFrame()

  // Vertical slide distance for 1920px height
  const translateY = interpolate(frame, [0, 15],
    direction === 'up' ? [1920, 0] : direction === 'down' ? [-1920, 0] : [0, 0],
    { extrapolateRight: 'clamp' }
  )

  // Horizontal slide distance for 1080px width
  const translateX = interpolate(frame, [0, 15],
    direction === 'left' ? [1080, 0] : direction === 'right' ? [-1080, 0] : [0, 0],
    { extrapolateRight: 'clamp' }
  )

  return (
    <AbsoluteFill style={{ transform: `translate(${translateX}px, ${translateY}px)` }}>
      {children}
    </AbsoluteFill>
  )
}
```

**Default direction for vertical videos: `up` or `down`** — horizontal slides feel awkward on mobile portrait.

## Color Themes

### Theme System

```tsx
const themes = {
  default: {
    primary: '#667eea',
    secondary: '#764ba2',
    background: '#1a1a2e',
    text: '#ffffff',
  },
  warm: {
    primary: '#f093fb',
    secondary: '#f5576c',
    background: '#2d1e1e',
    text: '#ffffff',
  },
  cool: {
    primary: '#4facfe',
    secondary: '#00f2fe',
    background: '#1e2d2d',
    text: '#ffffff',
  },
}

interface ThemeContextProps {
  theme: keyof typeof themes
}

export const useTheme = (theme: keyof typeof themes) => themes[theme]
```

## Export Configuration

### Quality Presets

```json
{
  "codec": "h264",
  "crf": 18,
  "audioBitrate": "320k",
  "pixelFormat": "yuv420p"
}
```

### Platform-Specific Exports

```bash
# Douyin (TikTok China) - 9:16 vertical (DEFAULT)
npx remotion render MyComp out/video.mp4 --size=1080x1920 --fps=30 --pixel-format=yuv420p

# YouTube - 16:9 horizontal
npx remotion render MyComp out/video.mp4 --size=1920x1080 --fps=30

# Instagram Square
npx remotion render MyComp out/video.mp4 --size=1080x1080 --fps=30
```

## Performance Optimization

### Lazy Loading Components

```tsx
import { lazy } from 'react'

const HeavyComponent = lazy(() => import('./HeavyComponent'))
```

### Memoization

```tsx
import { memo } from 'react'

export const ExpensiveShot = memo(() => {
  // Component logic
})
```

### Frame Caching

```tsx
import { useCurrentFrame, useMemo } from 'remotion'

export const CachedShot: React.FC = () => {
  const frame = useCurrentFrame()

  const expensiveValue = useMemo(() => {
    return heavyComputation(frame)
  }, [frame % 10]) // Cache every 10 frames

  return <div>{expensiveValue}</div>
}
```

## Mobile-First Animation Tips

### Spring Physics for Vertical Content

```tsx
import { spring } from 'remotion'

const scale = spring({
  frame,
  fps: 30,
  config: {
    damping: 12,      // Lower = more bounce
    stiffness: 100,   // Higher = faster
  },
})
```

### Scale-Based Entrance

For vertical videos, scale animations feel more natural than slide:

```tsx
const scale = spring({ frame, fps: 30, config: { damping: 10, stiffness: 100 } })
const opacity = interpolate(frame, [0, 15], [0, 1])

return (
  <div style={{ transform: `scale(${scale})`, opacity }}>
    {content}
  </div>
)
```

### Text Animation on Vertical

Avoid horizontal sliding text on vertical format — use fade + vertical slide:

```tsx
const translateY = interpolate(frame, [0, 20], [50, 0], { extrapolateRight: 'clamp' })
const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' })

return (
  <div style={{ transform: `translateY(${translateY}px)`, opacity }}>
    {text}
  </div>
)
```

## Visual Alignment Patterns

### Star/Hub Layout (Center + Radiating Nodes)

**Use case:** Agent Teams, multi-agent diagrams, centralized concepts

```tsx
import React from 'react'
import { AbsoluteFill } from 'remotion'

interface Node {
  label: string
  angle: number // Degrees from center
  color: string
}

export const HubLayout: React.FC = () => {
  const centerX = 540  // Half of container width (1080)
  const centerY = 960  // Half of container height (1920)
  const radius = 220   // Distance from center to outer nodes

  const centerNode: Node = { label: '队长', angle: 0, color: '#f59e0b' }
  const outerNodes: Node[] = [
    { label: '队友1', angle: -45, color: '#3b82f6' },
    { label: '队友2', angle: 45, color: '#3b82f6' },
    { label: '队友3', angle: 135, color: '#3b82f6' },
    { label: '队友4', angle: 225, color: '#3b82f6' },
  ]

  // Calculate position from center using angle
  const getNodePosition = (angle: number, distance: number) => {
    const radians = angle * (Math.PI / 180)
    return {
      x: centerX + Math.cos(radians) * distance,
      y: centerY + Math.sin(radians) * distance,
    }
  }

  return (
    <AbsoluteFill style={{ background: '#0c4a6e' }}>
      {/* SVG Connection Lines — draw FIRST so they're behind */}
      <svg style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 0 }}>
        {outerNodes.map((node) => {
          const pos = getNodePosition(node.angle, radius)
          return (
            <line
              key={node.label}
              x1={centerX}
              y1={centerY}
              x2={pos.x}
              y2={pos.y}
              stroke="#64748b"
              strokeWidth="4"
              strokeDasharray="8,8"
            />
          )
        })}
      </svg>

      {/* Center Node — positioned with explicit zIndex */}
      <div style={{
        position: 'absolute',
        left: centerX - 100,  // Center minus half width
        top: centerY - 100,   // Center minus half height
        width: 200,
        height: 200,
        borderRadius: 100,
        background: `linear-gradient(135deg, ${centerNode.color} 0%, #ea580c 100%)`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 48,
        fontWeight: 800,
        color: '#fff',
        zIndex: 10,  // Above SVG lines
      }}>
        {centerNode.label}
      </div>

      {/* Outer Nodes — each positioned with calculated coordinates */}
      {outerNodes.map((node) => {
        const pos = getNodePosition(node.angle, radius)
        return (
          <div
            key={node.label}
            style={{
              position: 'absolute',
              left: pos.x - 70,   // Center minus half width (140/2)
              top: pos.y - 70,    // Center minus half height (140/2)
              width: 140,
              height: 140,
              borderRadius: 70,
              background: `linear-gradient(135deg, ${node.color} 0%, #2563eb 100%)`,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: 36,
              fontWeight: 700,
              color: '#fff',
              zIndex: 10,  // Above SVG lines
            }}
          >
            {node.label}
          </div>
        )
      })}
    </AbsoluteFill>
  )
}
```

### Left-Right Comparison Layout

**Use case:** Feature comparison, before/after, pros/cons

```tsx
import React from 'react'
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion'

export const ComparisonLayout: React.FC = () => {
  const frame = useCurrentFrame()
  const leftOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' })
  const rightOpacity = interpolate(frame, [10, 30], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
      flexDirection: 'row',  // Horizontal split
      padding: '120px 40px 200px',
    }}>
      {/* Left Panel */}
      <div style={{
        flex: 1,
        background: 'rgba(239, 68, 68, 0.1)',
        border: '3px solid #ef4444',
        borderRadius: 20,
        padding: 40,
        display: 'flex',
        flexDirection: 'column',
        opacity: leftOpacity,
      }}>
        <div style={{ fontSize: 48, fontWeight: 800, color: '#ef4444', marginBottom: 40, textAlign: 'center' }}>
          方案 A
        </div>
        {/* Content */}
      </div>

      {/* Right Panel */}
      <div style={{
        flex: 1,
        background: 'rgba(34, 197, 94, 0.1)',
        border: '3px solid #22c55e',
        borderRadius: 20,
        padding: 40,
        display: 'flex',
        flexDirection: 'column',
        opacity: rightOpacity,
      }}>
        <div style={{ fontSize: 48, fontWeight: 800, color: '#22c55e', marginBottom: 40, textAlign: 'center' }}>
          方案 B
        </div>
        {/* Content */}
      </div>
    </AbsoluteFill>
  )
}
```

### Vertical Stack with Connected Steps

**Use case:** Process flow, tutorial steps, sequential content

```tsx
import React from 'react'
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion'

export const StepFlowLayout: React.FC = () => {
  const frame = useCurrentFrame()

  const steps = [
    { title: '步骤 1', description: '准备环境' },
    { title: '步骤 2', description: '配置参数' },
    { title: '步骤 3', description: '启动服务' },
  ]

  return (
    <AbsoluteFill style={{
      background: '#0f172a',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '120px 40px 200px',
    }}>
      <div style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {steps.map((step, i) => {
          const opacity = interpolate(frame, [i * 20, i * 20 + 15], [0, 1], { extrapolateRight: 'clamp' })

          return (
            <div key={i} style={{ opacity }}>
              {/* Step Card */}
              <div style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '2px solid #3b82f6',
                borderRadius: 16,
                padding: '24px 32px',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
              }}>
                {/* Step Number */}
                <div style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  background: '#3b82f6',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: 28,
                  fontWeight: 700,
                  color: '#fff',
                }}>
                  {i + 1}
                </div>

                {/* Step Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 36, fontWeight: 700, color: '#fff', marginBottom: 8 }}>
                    {step.title}
                  </div>
                  <div style={{ fontSize: 28, color: '#94a3b8' }}>
                    {step.description}
                  </div>
                </div>
              </div>

              {/* Arrow Between Steps (not after last step) */}
              {i < steps.length - 1 && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  fontSize: 32,
                  color: '#64748b',
                  margin: '8px 0',
                }}>
                  ↓
                </div>
              )}
            </div>
          )
        })}
      </div>
    </AbsoluteFill>
  )
}
```

### Alignment Troubleshooting Guide

| Problem | Cause | Solution |
|---------|-------|----------|
| Lines don't connect to elements | SVG uses %, elements use flex | Use pixel values for SVG coordinates |
| Lines render on top of elements | Missing zIndex | Set `zIndex: 0` for SVG, `zIndex: 10` for elements |
| Circular nodes uneven | Angle calculation inconsistent | Use same `Math.cos/sin` formula for all nodes and lines |
| Elements shift on different screen sizes | Mixed positioning methods | Use consistent method (all flex OR all absolute) |
| Center element off-center | Padding/margin not accounted for | Subtract padding from position: `left: 540 - 100` |

### Debug Alignment Issues

**Temporarily add borders to see actual element positions:**
```tsx
<div style={{
  border: '2px solid red',  // Debug border
  background: 'rgba(255,0,0,0.1)',
}}>
  {/* Content */}
</div>
```

**Log calculated positions:**
```tsx
const pos = getNodePosition(angle, radius)
console.log(`Node at angle ${angle}: x=${pos.x.toFixed(0)}, y=${pos.y.toFixed(0)}`)
```
