import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import { CenteredStack } from '../../../components'

interface ShotProps {
  subtitleSegments?: Array<{ text: string; start: number; end: number; duration: number }>
  videoOffset?: number
}

const companies = [
  { name: 'Anthropic', color: '#d97757', fromX: -400, fromY: -350 },
  { name: 'OpenAI', color: '#10a37f', fromX: 400, fromY: -350 },
  { name: 'Google', color: '#4285f4', fromX: 0, fromY: 400 },
]

export const Shot1: React.FC<ShotProps> = ({ subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const logoSprings = companies.map((_, i) =>
    spring({ frame, fps, config: { damping: 12, stiffness: 80 }, delay: i * 4 })
  )

  const glowScale = interpolate(frame, [18, 30], [0, 1], { extrapolateRight: 'clamp' })
  const glowOpacity = interpolate(frame, [22, 40], [0.7, 0], { extrapolateRight: 'clamp' })

  const textSpring = spring({ frame: frame - 22, fps, config: { damping: 8, stiffness: 120 } })
  const textOpacity = interpolate(frame, [22, 32], [0, 1], { extrapolateRight: 'clamp' })

  const finalPositions = [
    { x: -100, y: -20 },
    { x: 100, y: -20 },
    { x: 0, y: 60 },
  ]

  return (
    <CenteredStack
      background="linear-gradient(135deg, #0a0a0f, #1a1a2e)"
      gap={50}
      subtitleSegments={subtitleSegments}
      videoOffset={videoOffset}
    >
      <div style={{ position: 'relative', width: 600, height: 200 }}>
        {companies.map((company, i) => {
          const x = interpolate(logoSprings[i], [0, 1], [company.fromX, finalPositions[i].x])
          const y = interpolate(logoSprings[i], [0, 1], [company.fromY, finalPositions[i].y])
          return (
            <div
              key={company.name}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                padding: '14px 32px',
                background: company.color,
                borderRadius: 36,
                fontSize: 34,
                fontWeight: 800,
                color: '#fff',
                whiteSpace: 'nowrap',
                boxShadow: `0 4px 20px ${company.color}66`,
              }}
            >
              {company.name}
            </div>
          )
        })}

        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: `translate(-50%, -50%) scale(${glowScale})`,
            width: 350,
            height: 350,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)',
            opacity: glowOpacity,
          }}
        />
      </div>

      <div
        style={{
          fontSize: 72,
          fontWeight: 900,
          color: '#fff',
          textAlign: 'center',
          transform: `scale(${textSpring})`,
          opacity: textOpacity,
          textShadow: '0 0 30px rgba(255, 255, 255, 0.3)',
        }}
      >
        联手了？！
      </div>
    </CenteredStack>
  )
}
