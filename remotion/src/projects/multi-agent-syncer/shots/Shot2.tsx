import React from 'react'
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion'
import { CenteredStack, useStagger, type SubtitleSegment } from '../../../components'

interface Shot2Props {
  subtitleSegments?: SubtitleSegment[]
  videoOffset?: number
}

const FONT = 'Noto Sans SC, sans-serif'

const AGENTS = [
  { name: 'Claude Code', color: '#D97706', shape: 'circle' as const },
  { name: 'Cursor', color: '#3B82F6', shape: 'circle' as const },
  { name: 'Windsurf', color: '#06B6D4', shape: 'circle' as const },
  { name: 'Copilot', color: '#10B981', shape: 'circle' as const },
  { name: 'Codex', color: '#8B5CF6', shape: 'square' as const },
  { name: 'Kiro', color: '#F43F5E', shape: 'circle' as const },
  { name: 'Trae', color: '#F59E0B', shape: 'square' as const },
  { name: 'Amp', color: '#EC4899', shape: 'circle' as const },
]

export const Shot2: React.FC<Shot2Props> = ({ subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Staggered reveal for 8 agent cards, 6 frames apart
  const stagger = useStagger(frame, 8, 6, 10)

  // "×16" shake animation — starts after all 8 cards (frame ~54)
  const shakeStart = 8 * 6 + 15
  const shakeProgress = spring({
    frame: Math.max(0, frame - shakeStart),
    fps,
    config: { damping: 8, stiffness: 300 },
  })
  const shakeScale = interpolate(shakeProgress, [0, 1], [0, 1], { extrapolateRight: 'clamp' })
  const shakeX = interpolate(
    shakeProgress,
    [0, 0.3, 0.5, 0.7, 1],
    [0, -8, 8, -4, 0],
    { extrapolateRight: 'clamp' },
  )
  const shakeOpacity = interpolate(frame, [shakeStart, shakeStart + 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <CenteredStack
      background="linear-gradient(135deg, #1E1B4B, #312E81)"
      justify="center"
      subtitleSegments={subtitleSegments}
      videoOffset={videoOffset}
    >
      {/* Grid of agent cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 20,
          maxWidth: 800,
        }}
      >
        {AGENTS.map((agent, i) => {
          const entry = stagger[i]
          const cardScale = spring({
            frame: Math.max(0, frame - i * 6),
            fps,
            config: { damping: 14, stiffness: 160, mass: 0.6 },
          })

          return (
            <div
              key={agent.name}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
                ...entry.style,
              }}
            >
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: agent.shape === 'circle' ? '50%' : 16,
                  background: `linear-gradient(135deg, ${agent.color}, ${agent.color}bb)`,
                  transform: `scale(${cardScale})`,
                  boxShadow: `0 8px 24px ${agent.color}40`,
                }}
              />
              <span
                style={{
                  fontSize: 24,
                  fontWeight: 600,
                  color: '#94A3B8',
                  fontFamily: FONT,
                }}
              >
                {agent.name}
              </span>
            </div>
          )
        })}
      </div>

      {/* Red "×16" with shake */}
      <div
        style={{
          marginTop: 40,
          opacity: shakeOpacity,
          transform: `translateX(${shakeX}px) scale(${shakeScale})`,
        }}
      >
        <span
          style={{
            fontSize: 80,
            fontWeight: 900,
            color: '#EF4444',
            fontFamily: FONT,
            textShadow: '0 0 30px rgba(239, 68, 68, 0.5)',
          }}
        >
          ×16
        </span>
      </div>
    </CenteredStack>
  )
}
