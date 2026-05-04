import React from 'react'
import { useCurrentFrame, interpolate } from 'remotion'
import { CenteredStack } from '../../../components'
import { theme, SHOT_SUBTITLES, SHOT_START_SECONDS } from '../theme'

export const Shot9: React.FC = () => {
  const frame = useCurrentFrame()

  // fadeSlideDown for "GitHub 搜索"
  const labelOpacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp' })
  const labelTranslate = interpolate(frame, [0, 12], [-30, 0], { extrapolateRight: 'clamp' })

  // blurIn for "Pixelle-Video"
  const titleOpacity = interpolate(frame, [10, 28], [0, 1], { extrapolateRight: 'clamp' })
  const titleBlur = interpolate(frame, [10, 28], [20, 0], { extrapolateRight: 'clamp' })

  // fadeSlideUp for subtitle
  const subOpacity = interpolate(frame, [30, 45], [0, 1], { extrapolateRight: 'clamp' })
  const subTranslate = interpolate(frame, [30, 45], [30, 0], { extrapolateRight: 'clamp' })

  // Pulse for CTA badge
  const pulseScale = interpolate(Math.sin((frame - 50) * 0.08), [-1, 1], [1, 1.05])
  const badgeOpacity = interpolate(frame, [50, 60], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <CenteredStack
      background={theme.backgrounds[8]}
      subtitleSegments={SHOT_SUBTITLES[8]}
      videoOffset={SHOT_START_SECONDS[8]}
      justify="center"
      gap={48}
    >
      {/* Label */}
      <div style={{
        fontSize: 32, fontWeight: 600, color: theme.textLightSecondary,
        opacity: labelOpacity, transform: `translateY(${labelTranslate}px)`,
      }}>
        GitHub 搜索
      </div>

      {/* Title */}
      <div style={{
        fontSize: 80, fontWeight: 800, color: theme.textLight,
        opacity: titleOpacity, filter: `blur(${titleBlur}px)`,
        letterSpacing: '3px',
      }}>
        Pixelle-Video
      </div>

      {/* Subtitle */}
      <div style={{
        fontSize: 34, fontWeight: 600, color: theme.accent,
        opacity: subOpacity, transform: `translateY(${subTranslate}px)`,
      }}>
        开源免费 · 零门槛 · 一键出片
      </div>

      {/* CTA badge */}
      <div style={{
        fontSize: 30, fontWeight: 700, color: '#fff',
        background: `${theme.accent}cc`,
        borderRadius: 32, padding: '14px 36px',
        transform: `scale(${pulseScale})`, opacity: badgeOpacity,
      }}>
        ⭐ Star on GitHub
      </div>
    </CenteredStack>
  )
}
