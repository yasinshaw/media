import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import { CenteredStack } from '../../../components'
import { theme, FONT_FAMILY } from '../theme'

interface ShotProps {
  subtitleSegments?: Array<{ text: string; start: number; end: number; duration: number }>
}

export const Shot4: React.FC<ShotProps> = ({ subtitleSegments }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const subtitle = subtitleSegments?.find((s) => frame / fps >= s.start && frame / fps < s.end)?.text

  const fadeSlideUp = (delay: number) => ({
    opacity: interpolate(frame, [delay, delay + 12], [0, 1], { extrapolateRight: 'clamp' }),
    transform: `translateY(${interpolate(frame, [delay, delay + 12], [30, 0], { extrapolateRight: 'clamp' })}px)`,
  })

  const cardScale = spring({ frame, fps, config: { damping: 12, stiffness: 200 }, delay: 5 })
  const cardStyle: React.CSSProperties = {
    transform: `scale(${interpolate(cardScale, [0, 1], [0.85, 1])})`,
    opacity: interpolate(cardScale, [0, 0.5], [0, 1]),
    background: theme.cardBg,
    border: `2px solid ${theme.cardBorder}`,
    borderRadius: 24,
    padding: '40px 48px',
    width: '100%',
    maxWidth: 800,
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
  }

  const fields = [
    { label: '姓名', value: '林默', color: theme.accent },
    { label: '性格', value: '狡猾 · 忠诚 · 隐忍', color: theme.accentAlt },
    { label: '背景', value: '前朝遗孤，隐姓埋名', color: '#F87171' },
    { label: '说话风格', value: '话少，但每句都有深意', color: '#34D399' },
  ]

  return (
    <CenteredStack
      background="linear-gradient(135deg, #0F172A, #1E293B)"
      gap={36}
      subtitle={subtitle}
    >
      <div style={{
        ...fadeSlideUp(0),
        fontSize: 48, fontWeight: 900, color: theme.textPrimary, fontFamily: FONT_FAMILY,
      }}>
        第2步 · 角色设计
      </div>

      <div style={cardStyle}>
        {fields.map((field, i) => (
          <div
            key={field.label}
            style={{
              ...fadeSlideUp(15 + i * 8),
              display: 'flex', alignItems: 'center', gap: 20,
              padding: '18px 0',
              borderBottom: i < fields.length - 1 ? `1px solid ${theme.cardBorder}` : 'none',
              fontFamily: FONT_FAMILY,
            }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: 22, flexShrink: 0,
              background: `linear-gradient(135deg, ${field.color}, ${field.color}88)`,
            }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ fontSize: 24, color: theme.textSecondary, fontWeight: 600 }}>
                {field.label}
              </div>
              <div style={{ fontSize: 32, color: theme.textPrimary, fontWeight: 700 }}>
                {field.value}
              </div>
            </div>
          </div>
        ))}
      </div>
    </CenteredStack>
  )
}
