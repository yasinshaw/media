import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import { CenteredStack } from '../../../components'
import { theme, FONT_FAMILY } from '../theme'

interface ShotProps {
  subtitleSegments?: Array<{ text: string; start: number; end: number; duration: number }>
}

const CHECK_ITEMS = ['情节推进', '角色一致', '无矛盾']

export const Shot6: React.FC<ShotProps> = ({ subtitleSegments }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const subtitle = subtitleSegments?.find((s) => frame / fps >= s.start && frame / fps < s.end)?.text

  const rotateIn = (delay: number) => {
    const progress = spring({ frame, fps, config: { damping: 12, stiffness: 150 }, delay })
    return {
      transform: `rotate(${interpolate(progress, [0, 1], [-15, 0])}deg) scale(${interpolate(progress, [0, 1], [0.6, 1])})`,
      opacity: interpolate(progress, [0, 0.4], [0, 1]),
    }
  }

  const fadeSlideUp = (delay: number) => ({
    opacity: interpolate(frame, [delay, delay + 12], [0, 1], { extrapolateRight: 'clamp' }),
    transform: `translateY(${interpolate(frame, [delay, delay + 12], [20, 0], { extrapolateRight: 'clamp' })}px)`,
  })

  const headerStyle: React.CSSProperties = {
    ...fadeSlideUp(0),
    fontSize: 48, fontWeight: 900, color: theme.textPrimary, fontFamily: FONT_FAMILY,
  }

  const cycleSteps = ['生成', '审查', '修改', '下一章']

  return (
    <CenteredStack
      background="linear-gradient(135deg, #1A1A2E, #16213E)"
      gap={40}
      subtitle={subtitle}
    >
      <div style={headerStyle}>第4步 · 逐章生成</div>

      <div style={{
        ...rotateIn(8),
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 32, width: '100%', maxWidth: 800,
      }}>
        {cycleSteps.map((step, i) => (
          <React.Fragment key={step}>
            <div style={{
              width: 120, height: 120, borderRadius: 60,
              background: `linear-gradient(135deg, ${i % 2 === 0 ? theme.accent : theme.accentAlt}, ${i % 2 === 0 ? theme.accentAlt : theme.accent})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 32, fontWeight: 800, color: '#fff', fontFamily: FONT_FAMILY,
              boxShadow: `0 4px 24px ${i % 2 === 0 ? theme.accent : theme.accentAlt}44`,
            }}>
              {step}
            </div>
            {i < cycleSteps.length - 1 && (
              <div style={{
                width: 40, height: 4, borderRadius: 2,
                background: theme.cardBorder,
              }} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div style={{
        display: 'flex', flexDirection: 'column', gap: 16, width: '100%', maxWidth: 600,
      }}>
        {CHECK_ITEMS.map((item, i) => (
          <div
            key={item}
            style={{
              ...fadeSlideUp(25 + i * 10),
              display: 'flex', alignItems: 'center', gap: 16,
              background: theme.cardBg,
              borderRadius: 16,
              padding: '16px 28px',
              fontFamily: FONT_FAMILY,
            }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: 18,
              background: '#22C55E',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, color: '#fff', fontWeight: 700,
            }}>
              ✓
            </div>
            <span style={{ fontSize: 32, fontWeight: 700, color: theme.textPrimary }}>
              {item}
            </span>
          </div>
        ))}
      </div>
    </CenteredStack>
  )
}
