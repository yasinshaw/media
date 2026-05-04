// Theme: Ocean — 技术/AI
import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from 'remotion'
import { CenteredStack, type SubtitleSegment } from '../../../components'

interface ShotProps {
  subtitleSegments?: SubtitleSegment[]
}

const PRINCIPLES = [
  {
    num: '①',
    title: '拆小',
    desc: '别做大而全，每个技能只做一件事',
    icon: '🔨',
    accent: '#0EA5E9',
  },
  {
    num: '②',
    title: '别写死',
    desc: '密钥用环境变量，不硬编码',
    icon: '🔐',
    accent: '#06B6D4',
  },
  {
    num: '③',
    title: '迭代优化',
    desc: '用着不对就让 AI 调整',
    icon: '🔄',
    accent: '#0891B2',
  },
]

export const Shot5: React.FC<ShotProps> = ({ subtitleSegments }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const titleOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: 'clamp',
  })
  const titleScale = spring({
    frame,
    fps,
    config: { damping: 200 },
    delay: 0,
  })

  const cards = PRINCIPLES.map((principle, i) => {
    const delay = 15 + i * 15
    const progress = spring({
      frame,
      fps,
      config: { damping: 15, stiffness: 150 },
      delay,
    })
    const opacity = interpolate(progress, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' })
    const translateX = interpolate(progress, [0, 1], [-80, 0], {
      easing: Easing.out(Easing.quad),
    })
    return { ...principle, opacity, translateX }
  })

  return (
    <CenteredStack
      background="linear-gradient(135deg, #E0F2FE, #7DD3FC)"
      subtitleSegments={subtitleSegments}
      videoOffset={0}
      gap={32}
    >
      <div
        style={{
          fontSize: 48,
          fontWeight: 800,
          color: '#0C4A6E',
          opacity: titleOpacity,
          transform: `scale(${titleScale})`,
        }}
      >
        三个原则
      </div>

      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        {cards.map((card, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 24,
              opacity: card.opacity,
              transform: `translateX(${card.translateX}px)`,
              background: '#FFFFFF',
              borderRadius: 20,
              padding: '28px 36px',
              border: `2px solid ${card.accent}40`,
              boxShadow: `0 8px 24px ${card.accent}15`,
            }}
          >
            <span style={{ fontSize: 48 }}>{card.icon}</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 24, color: card.accent, fontWeight: 700 }}>
                  {card.num}
                </span>
                <span style={{ fontSize: 36, fontWeight: 800, color: '#0C4A6E' }}>
                  {card.title}
                </span>
              </div>
              <span style={{ fontSize: 28, color: '#64748B', fontWeight: 500 }}>
                {card.desc}
              </span>
            </div>
          </div>
        ))}
      </div>
    </CenteredStack>
  )
}
