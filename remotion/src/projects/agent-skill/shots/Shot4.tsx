import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import { CenteredStack } from '../../../components'

interface ShotProps {
  subtitleSegments?: Array<{ text: string; start: number; end: number; duration: number }>
  videoOffset?: number
}

const StatCard: React.FC<{
  value: string
  label: string
  accent: string
  delay: number
  frame: number
  fps: number
}> = ({ value, label, accent, delay, frame, fps }) => {
  const cardSpring = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 100 } })

  return (
    <div
      style={{
        background: 'rgba(30, 41, 59, 0.8)',
        border: `2px solid ${accent}44`,
        borderRadius: 24,
        padding: '32px 48px',
        textAlign: 'center',
        transform: `scale(${cardSpring})`,
        opacity: cardSpring,
        minWidth: 280,
      }}
    >
      <div
        style={{
          fontSize: 64,
          fontWeight: 900,
          color: accent,
          lineHeight: 1.2,
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 28, color: '#94a3b8', marginTop: 12, fontWeight: 600 }}>
        {label}
      </div>
    </div>
  )
}

const Terminal: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const terminalSpring = spring({ frame: frame - 50, fps, config: { damping: 15, stiffness: 100 } })
  const command = 'npx skills add owner/repo'
  const charsPerFrame = 0.6
  const startFrame = 60
  const visibleChars = Math.max(0, Math.floor((frame - startFrame) * charsPerFrame))
  const visibleText = command.slice(0, visibleChars)
  const cursorVisible = frame % 30 < 15

  return (
    <div
      style={{
        background: '#0d1117',
        borderRadius: 16,
        border: '1px solid #30363d',
        overflow: 'hidden',
        transform: `scale(${terminalSpring})`,
        opacity: terminalSpring,
        width: '100%',
        maxWidth: 700,
      }}
    >
      <div
        style={{
          background: '#161b22',
          padding: '12px 20px',
          display: 'flex',
          gap: 8,
        }}
      >
        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57' }} />
        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#febc2e' }} />
        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840' }} />
      </div>
      <div style={{ padding: '24px 28px', fontSize: 30, color: '#7ee787', fontFamily: 'monospace' }}>
        <span style={{ color: '#8b949e' }}>$ </span>
        {visibleText}
        {cursorVisible && visibleChars < command.length && (
          <span style={{ color: '#7ee787' }}>▊</span>
        )}
      </div>
    </div>
  )
}

export const Shot4: React.FC<ShotProps> = ({ subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const captionOpacity = interpolate(frame, [130, 145], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <CenteredStack
      background="linear-gradient(135deg, #0f172a, #1e293b)"
      gap={40}
      subtitleSegments={subtitleSegments}
      videoOffset={videoOffset}
    >
      <div style={{ display: 'flex', gap: 32 }}>
        <StatCard value="28,000+" label="技能包" accent="#6366f1" delay={0} frame={frame} fps={fps} />
        <StatCard value="1.2M+" label="累计安装" accent="#22c55e" delay={8} frame={frame} fps={fps} />
      </div>

      <Terminal frame={frame} fps={fps} />

      <div
        style={{
          fontSize: 36,
          fontWeight: 700,
          color: '#fbbf24',
          textAlign: 'center',
          opacity: captionOpacity,
          padding: '12px 32px',
          background: 'rgba(251, 191, 36, 0.1)',
          borderRadius: 16,
        }}
      >
        一行命令，装上即用
      </div>
    </CenteredStack>
  )
}
