// Theme: Ocean — 技术/AI
import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from 'remotion'
import { CenteredStack, type SubtitleSegment } from '../../../components'

interface ShotProps {
  subtitleSegments?: SubtitleSegment[]
}

const SKILLS = [
  { name: 'video-script', desc: '视频脚本生成' },
  { name: 'tavily-search', desc: 'AI 搜索' },
  { name: 'skill-creator', desc: '技能创建' },
]

export const Shot3: React.FC<ShotProps> = ({ subtitleSegments }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const searchBoxOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: 'clamp',
  })

  const searchTyping = '搜索技能...'
  const charsPerFrame = 0.6
  const visibleChars = Math.floor(frame * charsPerFrame)
  const displayText = searchTyping.slice(0, Math.min(visibleChars, searchTyping.length))

  const cursorOpacity = interpolate(frame % 16, [0, 8, 16], [1, 0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const repoOpacity = interpolate(frame, [40, 55], [0, 1], { extrapolateRight: 'clamp' })
  const repoY = interpolate(frame, [40, 55], [15, 0], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  })

  const cards = SKILLS.map((skill, i) => {
    const delay = 20 + i * 10
    const progress = spring({
      frame,
      fps,
      config: { damping: 20, stiffness: 200 },
      delay,
    })
    const opacity = interpolate(progress, [0, 0.5], [0, 1], { extrapolateRight: 'clamp' })
    const translateX = interpolate(progress, [0, 1], [-60, 0], { extrapolateRight: 'clamp' })
    return { ...skill, opacity, translateX }
  })

  return (
    <CenteredStack
      background="linear-gradient(135deg, #F0FDFA, #99F6E4)"
      subtitleSegments={subtitleSegments}
      videoOffset={0}
      gap={32}
    >
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          background: '#FFFFFF',
          borderRadius: 16,
          padding: '20px 32px',
          border: '2px solid #99F6E4',
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
          opacity: searchBoxOpacity,
        }}
      >
        <span style={{ fontSize: 36 }}>🔍</span>
        <span
          style={{
            fontSize: 32,
            fontWeight: 600,
            color: '#0C4A6E',
            fontFamily: 'monospace',
          }}
        >
          {displayText}
          <span style={{ opacity: cursorOpacity }}>▌</span>
        </span>
      </div>

      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
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
              transform: `translateX(${card.translateX}px)`,
              background: '#F0FDF4',
              borderRadius: 16,
              padding: '20px 32px',
              border: '2px solid #BBF7D0',
              boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
            }}
          >
            <span style={{ fontSize: 32 }}>📦</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 30, fontWeight: 700, color: '#06B6D4' }}>
                {card.name}
              </span>
              <span style={{ fontSize: 26, color: '#64748B' }}>{card.desc}</span>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          fontSize: 28,
          fontWeight: 600,
          color: '#64748B',
          opacity: repoOpacity,
          transform: `translateY(${repoY}px)`,
        }}
      >
        GitHub: awesome-claude-skills
      </div>
    </CenteredStack>
  )
}
