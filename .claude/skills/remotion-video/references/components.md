# Remotion Components Reference

Complete implementations of reusable components for video generation — **optimized for Douyin vertical format (1080×1920)**.

## Mobile-First Typography Rules

**Minimum font size: 24px** — anything smaller is unreadable on mobile.

| Element | Font Size | Usage |
|---------|-----------|-------|
| Hero title | 64-80px | Main titles, hook text |
| Section title | 48-56px | Sub-headings, category labels |
| Body text | 32-40px | Content in cards, descriptions |
| Data labels | 28-36px | Chart labels, stats, metrics |
| Small tags | 24-28px | Timestamps, tags — **minimum 24px** |

## Subtitle Component

Douyin-friendly subtitle component for spoken text — positioned above safe area with text shadow for readability on any background.

```tsx
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion'
import React from 'react'

interface SubtitleProps {
  text: string
  fontSize?: number
}

export const Subtitle: React.FC<SubtitleProps> = ({ text, fontSize = 46 }) => {
  const frame = useCurrentFrame()
  const opacity = interpolate(frame, [0, 6], [0, 1], {
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div
        style={{
          position: 'absolute',
          bottom: 240, // 200px safe area + 40px gap
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          padding: '0 60px',
          opacity,
        }}
      >
        <span
          style={{
            color: '#FFFFFF',
            fontSize,
            fontWeight: 'bold',
            textAlign: 'center',
            lineHeight: 1.5,
            letterSpacing: '1px',
            textShadow:
              '2px 2px 6px rgba(0,0,0,0.95), 0 0 16px rgba(0,0,0,0.6)',
          }}
        >
          {text}
        </span>
      </div>
    </AbsoluteFill>
  )
}
```

### Style Notes
- **No background box**: Uses text shadow instead, matching Douyin's native subtitle style
- **Safe area gap**: Positioned at 240px from bottom (200px safe + 40px breathing room)
- **Fade in**: 6 frames (0.2s) smooth entrance
- **White text**: Works on any background with strong text shadow

## Overlay Component

On-screen text overlay for key messages — centered and large.

```tsx
import { AbsoluteFill } from 'remotion'
import React from 'react'

// Douyin vertical format overlay style
const overlayStyle = {
  color: 'white',
  fontSize: '64px',          // Larger for vertical screens
  fontWeight: '900',
  textAlign: 'center' as const,
  textShadow: '3px 3px 12px rgba(0, 0, 0, 0.9)',
  letterSpacing: '3px',
  maxWidth: '85%',
  margin: '0 auto',
}

interface OverlayProps {
  text: string
}

export const Overlay: React.FC<OverlayProps> = ({ text }) => {
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', pointerEvents: 'none' }}>
      <div style={overlayStyle}>{text}</div>
    </AbsoluteFill>
  )
}
```

## TalkingHead Component

For "主播面对镜头" shots — large avatar with safe area padding.

```tsx
import { AbsoluteFill } from 'remotion'
import React from 'react'

interface TalkingHeadProps {
  children?: React.ReactNode
}

export const TalkingHead: React.FC<TalkingHeadProps> = ({ children }) => {
  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '120px 40px 200px'  // Douyin safe area
    }}>
      {/* Larger avatar for vertical format (500x500) */}
      <div style={{
        width: 500,
        height: 500,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 30px 80px rgba(102, 126, 234, 0.5)',
      }}>
        <div style={{
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: '#fff',
          opacity: 0.3,
        }} />
      </div>
      {children}
    </AbsoluteFill>
  )
}
```

## SplitScreen Component

For comparison shots — **defaults to vertical (top/bottom) split for mobile**.

```tsx
import { AbsoluteFill } from 'remotion'
import React from 'react'

interface SplitScreenProps {
  left?: React.ReactNode        // Top content (when vertical=true)
  right?: React.ReactNode       // Bottom content (when vertical=true)
  leftLabel?: string
  rightLabel?: string
  children?: React.ReactNode
  vertical?: boolean             // Default: true for mobile
}

export const SplitScreen: React.FC<SplitScreenProps> = ({
  left,
  right,
  leftLabel = 'TOP',
  rightLabel = 'BOTTOM',
  children,
  vertical = true  // Default to vertical for Douyin
}) => {
  if (vertical) {
    // Vertical split (top/bottom) - mobile-friendly
    return (
      <AbsoluteFill style={{ background: '#1a1a2e', flexDirection: 'column' }}>
        <div style={{
          position: 'absolute',
          top: 0, left: 0, width: '100%', height: '50%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          borderBottom: '4px solid #1a1a2e',
        }}>
          {left || <div style={{ fontSize: 48, fontWeight: 'bold', color: 'white' }}>{leftLabel}</div>}
        </div>
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, width: '100%', height: '50%',
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          {right || <div style={{ fontSize: 48, fontWeight: 'bold', color: 'white' }}>{rightLabel}</div>}
        </div>
        {children}
      </AbsoluteFill>
    )
  }

  // Horizontal split (left/right) - for specific comparison use cases
  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      {/* Left Panel */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '50%', height: '100%', ... }}>
        {left || <div style={{ fontSize: 48, ... }}>{leftLabel}</div>}
      </div>
      {/* Right Panel */}
      <div style={{ position: 'absolute', top: 0, right: 0, width: '50%', height: '100%', ... }}>
        {right || <div style={{ fontSize: 48, ... }}>{rightLabel}</div>}
      </div>
      {children}
    </AbsoluteFill>
  )
}
```

## Usage in Shot Components

```tsx
import { TalkingHead, Subtitle, Overlay } from '../../../components/TalkingHead'

export const Shot1: React.FC = () => {
  return (
    <TalkingHead>
      <Subtitle text="这是口播内容" />
      <Overlay text="这是字幕" />
    </TalkingHead>
  )
}
```

## Vertical Layout Template

Copy this pattern for all custom shots:

```tsx
<AbsoluteFill style={{
  background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '120px 40px 200px'   // MANDATORY safe area
}}>
  <div style={{ width: '100%', maxWidth: '900px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
    {/* Content here — always vertical stack */}
  </div>
</AbsoluteFill>
```
