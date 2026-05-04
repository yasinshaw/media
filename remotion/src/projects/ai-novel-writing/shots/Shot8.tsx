import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, Img, staticFile, AbsoluteFill } from 'remotion'
import { CenteredStack } from '../../../components'
import { theme, FONT_FAMILY } from '../theme'

interface ShotProps {
  subtitleSegments?: Array<{ text: string; start: number; end: number; duration: number }>
}

export const Shot8: React.FC<ShotProps> = ({ subtitleSegments }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const subtitle = subtitleSegments?.find((s) => frame / fps >= s.start && frame / fps < s.end)?.text

  const fadeSlideUp = (delay: number) => ({
    opacity: interpolate(frame, [delay, delay + 15], [0, 1], { extrapolateRight: 'clamp' }),
    transform: `translateY(${interpolate(frame, [delay, delay + 15], [30, 0], { extrapolateRight: 'clamp' })}px)`,
  })

  const pulse = (delay: number) => {
    const scale = interpolate(
      Math.sin((frame - delay) * 0.08),
      [-1, 1], [1, 1.04],
    )
    return { transform: `scale(${scale})` }
  }

  return (
    <AbsoluteFill>
      <Img
        src={staticFile('images/ai-novel-writing/shot8-bg.jpeg')}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <AbsoluteFill style={{ backgroundColor: 'rgba(0,0,0,0.4)' }} />
      <CenteredStack
        gap={48}
        subtitle={subtitle}
      >
        <div style={{
          ...fadeSlideUp(5),
          fontSize: 52, fontWeight: 900, color: '#FFFFFF',
          textAlign: 'center', lineHeight: 1.5, fontFamily: FONT_FAMILY,
          maxWidth: 800,
        }}>
          AI不会替你成为作家
          <br />
          <span style={{ color: theme.accent }}>
            但能让创作效率大幅提升
          </span>
        </div>

        <div style={{
          ...pulse(30),
          ...fadeSlideUp(25),
          fontSize: 44, fontWeight: 800, color: theme.accentAlt,
          textAlign: 'center', fontFamily: FONT_FAMILY,
          padding: '20px 48px',
          borderRadius: 24,
          background: `${theme.accentAlt}18`,
          border: `2px solid ${theme.accentAlt}44`,
        }}>
          关注我，分享更多AI创作技巧
        </div>
      </CenteredStack>
    </AbsoluteFill>
  )
}
