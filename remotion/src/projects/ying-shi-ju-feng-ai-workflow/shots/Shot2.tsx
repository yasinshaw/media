import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import { TwoColumnCompare } from '../../../components'
import type { SubtitleSegment } from '../../../components'

interface ShotProps {
  subtitleSegments?: SubtitleSegment[]
  videoOffset?: number
}

// Theme: Sunrise — 效率/数据/成长
// Background: linear-gradient(135deg, #FFFBEB, #FDE68A)
// Animation: snappy (damping: 20, stiffness: 200)

const SUBTITLE_SEGMENTS: SubtitleSegment[] = [
  { text: '影视飓风一年做150期视频，', start: 5.25, end: 7.88, duration: 2.63 },
  { text: '项目周期从30多天压缩到5天。', start: 7.88, end: 10.7, duration: 2.82 },
  { text: '最新工作流分享的主题，', start: 10.7, end: 12.77, duration: 2.07 },
  { text: '就是AI。', start: 12.77, end: 13.71, duration: 0.94 },
]

const VIDEO_OFFSET = 4.85

const THEME = {
  textPrimary: '#1C1917',
  textSecondary: '#78716C',
  accent: '#F97316',
  accentAlt: '#EAB308',
  cardBg: '#FFFBEB',
  redAccent: '#DC2626',
  greenAccent: '#16A34A',
} as const

const SPRING_CONFIG = { damping: 20, stiffness: 200 } as const

export const Shot2: React.FC<ShotProps> = ({
  subtitleSegments = SUBTITLE_SEGMENTS,
  videoOffset = VIDEO_OFFSET,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Left panel slide-in
  const leftAnim = spring({ frame, fps, config: SPRING_CONFIG, delay: 5 })

  // Right panel slide-in
  const rightAnim = spring({ frame, fps, config: SPRING_CONFIG, delay: 25 })

  // Typewriter effect for left number "30"
  const leftNumberChars = Math.max(0, Math.floor((frame - 10) * 0.6))
  const leftNumber = '30'.slice(0, leftNumberChars)

  // Typewriter effect for right number "5"
  const rightNumberChars = Math.max(0, Math.floor((frame - 35) * 0.8))
  const rightNumber = '5'.slice(0, rightNumberChars)

  // Cursor blink (shared)
  const cursorOpacity = interpolate(
    frame % 16,
    [0, 8, 16],
    [1, 0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  // Multiplier scaleIn
  const multiplierScale = spring({ frame, fps, config: SPRING_CONFIG, delay: 70 })

  return (
    <TwoColumnCompare
      background="linear-gradient(135deg, #FFFBEB, #FDE68A)"
      left={{
        title: '过去',
        body: (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            <div
              style={{
                fontSize: 80,
                fontWeight: 900,
                color: THEME.redAccent,
                transform: `translateX(${interpolate(leftAnim, [0, 1], [-40, 0])}px)`,
                opacity: leftAnim,
              }}
            >
              {leftNumber}
              {leftNumberChars < 2 && (
                <span style={{ opacity: cursorOpacity, color: THEME.redAccent }}>|</span>
              )}
              <span style={{ fontSize: 44, fontWeight: 600, color: THEME.redAccent }}>
                天
              </span>
            </div>
            <div
              style={{
                fontSize: 28,
                color: THEME.textSecondary,
                transform: `translateX(${interpolate(leftAnim, [0, 1], [-40, 0])}px)`,
                opacity: leftAnim,
              }}
            >
              传统工作流
            </div>
          </div>
        ),
        accent: THEME.redAccent,
        opacity: leftAnim,
      }}
      right={{
        title: '现在',
        body: (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            <div
              style={{
                fontSize: 80,
                fontWeight: 900,
                color: THEME.greenAccent,
                transform: `translateX(${interpolate(rightAnim, [0, 1], [40, 0])}px)`,
                opacity: rightAnim,
              }}
            >
              {rightNumber}
              {rightNumberChars < 1 && (
                <span style={{ opacity: cursorOpacity, color: THEME.greenAccent }}>|</span>
              )}
              <span style={{ fontSize: 44, fontWeight: 600, color: THEME.greenAccent }}>
                天
              </span>
            </div>
            <div
              style={{
                fontSize: 28,
                color: THEME.textSecondary,
                transform: `translateX(${interpolate(rightAnim, [0, 1], [40, 0])}px)`,
                opacity: rightAnim,
              }}
            >
              AI赋能工作流
            </div>
          </div>
        ),
        accent: THEME.greenAccent,
        opacity: rightAnim,
      }}
      footer={
        <div
          style={{
            opacity: multiplierScale,
            transform: `scale(${interpolate(multiplierScale, [0, 1], [0.6, 1])})`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <div style={{ fontSize: 40, fontWeight: 800, color: THEME.textPrimary }}>
            效率提升{' '}
            <span
              style={{
                fontSize: 56,
                background: 'linear-gradient(135deg, #F97316, #EAB308)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              7倍
            </span>
          </div>
          <div style={{ fontSize: 26, color: THEME.textSecondary }}>
            150期/年
          </div>
        </div>
      }
      subtitleSegments={subtitleSegments}
      videoOffset={videoOffset}
    />
  )
}
