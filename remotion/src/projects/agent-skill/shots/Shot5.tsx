import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import { HubLayout } from '../../../components'

interface ShotProps {
  subtitleSegments?: Array<{ text: string; start: number; end: number; duration: number }>
  videoOffset?: number
}

const platforms = [
  { name: 'Claude Code', color: '#d97757' },
  { name: 'Cursor', color: '#6366f1' },
  { name: 'Copilot', color: '#22c55e' },
  { name: 'Codex', color: '#10a37f' },
  { name: 'Windsurf', color: '#3b82f6' },
]

const positions: Array<'top' | 'top-right' | 'right' | 'bottom-right' | 'bottom-left'> = [
  'top',
  'top-right',
  'right',
  'bottom-right',
  'bottom-left',
]

const PlatformNode: React.FC<{
  name: string
  color: string
  frame: number
  fps: number
  delay: number
}> = ({ name, color, frame, fps, delay }) => {
  const nodeSpring = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 100 } })
  const checkOpacity = interpolate(frame, [delay + 15, delay + 25], [0, 1], { extrapolateRight: 'clamp' })
  const checkScale = spring({ frame: frame - delay - 15, fps, config: { damping: 8, stiffness: 150 } })

  return (
    <div
      style={{
        padding: '16px 28px',
        background: 'rgba(30, 41, 59, 0.9)',
        border: `2px solid ${color}`,
        borderRadius: 20,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        transform: `scale(${nodeSpring})`,
        opacity: nodeSpring,
        boxShadow: `0 4px 20px ${color}33`,
      }}
    >
      <span style={{ fontSize: 30, fontWeight: 700, color }}>{name}</span>
      <span
        style={{
          fontSize: 28,
          transform: `scale(${checkScale})`,
          opacity: checkOpacity,
        }}
      >
        ✅
      </span>
    </div>
  )
}

export const Shot5: React.FC<ShotProps> = ({ subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const centerSpring = spring({ frame, fps, config: { damping: 15, stiffness: 80 } })

  const surroundingNodes = platforms.map((platform, i) => ({
    position: positions[i],
    node: (
      <PlatformNode
        name={platform.name}
        color={platform.color}
        frame={frame}
        fps={fps}
        delay={i * 12}
      />
    ),
  }))

  const lineOpacity = interpolate(frame, [5, 20], [0, 0.6], { extrapolateRight: 'clamp' })

  return (
    <HubLayout
      background="linear-gradient(135deg, #0f172a, #1e293b)"
      center={{
        node: (
          <div
            style={{
              padding: '24px 36px',
              background: 'rgba(99, 102, 241, 0.2)',
              border: '3px solid #6366f1',
              borderRadius: 24,
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              transform: `scale(${centerSpring})`,
              opacity: centerSpring,
            }}
          >
            <span style={{ fontSize: 48 }}>📄</span>
            <span style={{ fontSize: 32, fontWeight: 800, color: '#a5b4fc' }}>SKILL.md</span>
          </div>
        ),
      }}
      surrounding={surroundingNodes}
      radius={360}
      showConnections
      connectionColor="#6366f1"
      connectionWidth={3}
      connectionsOpacity={lineOpacity}
      header={
        <div
          style={{
            fontSize: 48,
            fontWeight: 900,
            color: '#fff',
            textAlign: 'center',
            textShadow: '0 0 20px rgba(99, 102, 241, 0.5)',
          }}
        >
          写一次，到处跑
        </div>
      }
      footer={
        <div
          style={{
            fontSize: 30,
            color: '#64748b',
            padding: '8px 24px',
            background: 'rgba(100, 116, 139, 0.15)',
            borderRadius: 12,
          }}
        >
          30+ 平台支持
        </div>
      }
      subtitleSegments={subtitleSegments}
      videoOffset={videoOffset}
    />
  )
}
