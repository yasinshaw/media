// Theme: Ocean — 技术/AI
import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import { CenteredStack, type SubtitleSegment } from '../../../components'

interface ShotProps {
  subtitleSegments?: SubtitleSegment[]
}

const TERMINAL_LINES = [
  { text: '$ /skill-creator', delay: 0, isCommand: true },
  { text: 'name: my-skill', delay: 60, isCommand: false },
  { text: 'description: 自动化...', delay: 120, isCommand: false },
  { text: '✅ 技能已生成!', delay: 180, isCommand: false },
]

export const Shot4: React.FC<ShotProps> = ({ subtitleSegments }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const terminalOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: 'clamp',
  })
  const terminalScale = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 200 },
    delay: 0,
  })
  const scale = interpolate(terminalScale, [0, 1], [0.9, 1])

  const cursorOpacity = interpolate(frame % 16, [0, 8, 16], [1, 0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const fileScale = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 150 },
    delay: 80,
  })

  return (
    <CenteredStack
      background="linear-gradient(135deg, #EFF6FF, #BFDBFE)"
      subtitleSegments={subtitleSegments}
      videoOffset={0}
      gap={32}
    >
      <div
        style={{
          width: '100%',
          background: '#0F172A',
          borderRadius: 20,
          padding: '32px',
          border: '2px solid #334155',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          opacity: terminalOpacity,
          transform: `scale(${scale})`,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 20,
          }}
        >
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#EF4444' }} />
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#EAB308' }} />
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#22C55E' }} />
          <span style={{ fontSize: 24, color: '#94A3B8', marginLeft: 12, fontWeight: 600 }}>
            Terminal
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {TERMINAL_LINES.map((line, i) => {
            const lineOpacity = interpolate(
              frame,
              [line.delay, line.delay + 10],
              [0, 1],
              { extrapolateRight: 'clamp' },
            )
            const lineTyping = line.text
            const charsVisible = Math.max(
              0,
              Math.floor((frame - line.delay) * 0.8),
            )
            const displayText = lineTyping.slice(
              0,
              Math.min(charsVisible, lineTyping.length),
            )

            return (
              <div
                key={i}
                style={{
                  opacity: lineOpacity,
                  fontFamily: 'monospace',
                  fontSize: 28,
                  color: line.isCommand ? '#22D3EE' : i === 3 ? '#4ADE80' : '#CBD5E1',
                  fontWeight: line.isCommand ? 700 : 400,
                }}
              >
                {displayText}
                {i === 0 && charsVisible < lineTyping.length && (
                  <span style={{ opacity: cursorOpacity }}>▌</span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div
        style={{
          width: '100%',
          background: '#F0F9FF',
          borderRadius: 16,
          padding: '24px 32px',
          border: '2px solid #BAE6FD',
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
          transform: `scale(${fileScale})`,
          opacity: fileScale,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <span style={{ fontSize: 40 }}>📄</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 30, fontWeight: 700, color: '#0EA5E9' }}>
            SKILL.md
          </span>
          <span style={{ fontSize: 24, color: '#64748B', fontFamily: 'monospace' }}>
            name + description → 完整技能
          </span>
        </div>
      </div>
    </CenteredStack>
  )
}
