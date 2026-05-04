import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import { CenteredStack } from '../../../components'

interface ShotProps {
  subtitleSegments?: Array<{ text: string; start: number; end: number; duration: number }>
  videoOffset?: number
}

export const Shot6: React.FC<ShotProps> = ({ subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const iconSpring = spring({ frame, fps, config: { damping: 10, stiffness: 80 } })

  const titleOpacity = interpolate(frame, [15, 30], [0, 1], { extrapolateRight: 'clamp' })
  const titleSpring = spring({ frame: frame - 15, fps, config: { damping: 12, stiffness: 100 } })

  const ctaSpring = spring({ frame: frame - 40, fps, config: { damping: 8, stiffness: 100 } })

  const skillIcons = ['🔧', '📝', '🎨', '⚡', '🧪']
  const orbitRadius = 140

  return (
    <CenteredStack
      background="linear-gradient(135deg, #0f172a, #1e293b)"
      gap={48}
      subtitleSegments={subtitleSegments}
      videoOffset={videoOffset}
    >
      {/* App Store icon with orbiting skills */}
      <div style={{ position: 'relative', width: 400, height: 400 }}>
        {/* Center robot icon */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: `translate(-50%, -50%) scale(${iconSpring})`,
            width: 120,
            height: 120,
            borderRadius: 28,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 64,
            boxShadow: '0 8px 32px rgba(99, 102, 241, 0.4)',
          }}
        >
          🤖
        </div>

        {/* Orbiting skill icons */}
        {skillIcons.map((icon, i) => {
          const angle = (frame * 0.5 + (i * 360) / skillIcons.length) * (Math.PI / 180)
          const x = Math.cos(angle) * orbitRadius
          const y = Math.sin(angle) * orbitRadius
          const iconOpacity = interpolate(frame, [5 + i * 4, 15 + i * 4], [0, 1], { extrapolateRight: 'clamp' })

          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                fontSize: 40,
                opacity: iconOpacity,
              }}
            >
              {icon}
            </div>
          )
        })}
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: 56,
          fontWeight: 900,
          color: '#fff',
          textAlign: 'center',
          transform: `scale(${titleSpring})`,
          opacity: titleOpacity,
          textShadow: '0 0 20px rgba(99, 102, 241, 0.4)',
        }}
      >
        AI 的技能商店时代来了
      </div>

      {/* CTA button */}
      <div
        style={{
          padding: '20px 64px',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          borderRadius: 50,
          transform: `scale(${ctaSpring})`,
          boxShadow: '0 8px 32px rgba(99, 102, 241, 0.4)',
        }}
      >
        <span style={{ fontSize: 36, fontWeight: 800, color: '#fff', letterSpacing: 2 }}>
          ❤️ 关注 + 👍 点赞
        </span>
      </div>
    </CenteredStack>
  )
}
