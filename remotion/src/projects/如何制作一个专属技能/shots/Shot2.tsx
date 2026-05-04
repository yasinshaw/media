// Theme: Ocean — 技术/AI
import React from 'react'
import { useCurrentFrame, interpolate, Easing } from 'remotion'
import { CenteredStack, type SubtitleSegment } from '../../../components'

interface ShotProps {
  subtitleSegments?: SubtitleSegment[]
}

const PROMPTS = ['写同样的提示词', '走同样的流程', '调同样的参数']

export const Shot2: React.FC<ShotProps> = ({ subtitleSegments }) => {
  const frame = useCurrentFrame()

  const titleOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: 'clamp',
  })
  const titleY = interpolate(frame, [0, 12], [20, 0], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  })

  const cards = PROMPTS.map((text, i) => {
    const delay = 10 + i * 12
    const opacity = interpolate(frame, [delay, delay + 10], [0, 1], {
      extrapolateRight: 'clamp',
    })
    const translateX = interpolate(frame, [delay, delay + 10], [-80, 0], {
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.quad),
    })
    const floatOffset = Math.sin((frame - delay) * 0.06 + i * 2) * 6
    return { text, opacity, translateX, floatOffset }
  })

  return (
    <CenteredStack
      background="linear-gradient(135deg, #ECFEFF, #A5F3FC)"
      subtitleSegments={subtitleSegments}
      videoOffset={0}
      gap={40}
    >
      <div
        style={{
          fontSize: 52,
          fontWeight: 800,
          color: '#0C4A6E',
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        每天重复？
      </div>

      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}
      >
        {cards.map((card, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              opacity: card.opacity,
              transform: `translateX(${card.translateX + card.floatOffset}px)`,
              background: '#F0F9FF',
              borderRadius: 16,
              padding: '24px 36px',
              border: `2px solid #BAE6FD`,
              boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
            }}
          >
            <span style={{ fontSize: 36, opacity: 0.5 }}>⏱️</span>
            <span
              style={{
                fontSize: 34,
                fontWeight: 600,
                color: '#0C4A6E',
                fontFamily: 'monospace',
              }}
            >
              {card.text}
            </span>
          </div>
        ))}
      </div>
    </CenteredStack>
  )
}
