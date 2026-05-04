import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion'
import { CenteredStack } from '../../../components'
import { theme, SHOT_SUBTITLES, SHOT_START_SECONDS } from '../theme'

export const Shot1: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const title = '一个关键词 → 一条短视频'
  const visibleChars = Math.floor(frame * 0.8)

  // Blinking cursor
  const cursorVisible = frame % Math.round(fps / 2) < Math.round(fps / 4)

  // blurIn for "Pixelle-Video" subtitle
  const subOpacity = interpolate(frame, [15, 30], [0, 1], { extrapolateRight: 'clamp' })
  const subBlur = interpolate(frame, [15, 30], [20, 0], { extrapolateRight: 'clamp' })

  return (
    <CenteredStack
      background={theme.backgrounds[0]}
      subtitleSegments={SHOT_SUBTITLES[0]}
      videoOffset={SHOT_START_SECONDS[0]}
      justify="center"
      gap={48}
    >
      <div style={{ fontSize: 72, fontWeight: 800, color: theme.textLight, letterSpacing: '2px' }}>
        {title.slice(0, visibleChars)}
        <span style={{ opacity: cursorVisible ? 1 : 0, color: theme.accent }}>|</span>
      </div>
      <div style={{
        fontSize: 36, fontWeight: 600, color: theme.textLightSecondary,
        opacity: subOpacity, filter: `blur(${subBlur}px)`,
      }}>
        Pixelle-Video
      </div>
    </CenteredStack>
  )
}
