import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import { CenteredStack } from '../../../components'
import { theme, SHOT_SUBTITLES, SHOT_START_SECONDS } from '../theme'

const TAGS = ['阿里 AIDC 出品', 'GitHub 9.9k Stars', 'Apache 2.0 开源免费']

export const Shot3: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Scale-in for title
  const titleProgress = spring({ frame, fps, config: { damping: 12, stiffness: 200 }, delay: 0 })
  const titleScale = interpolate(titleProgress, [0, 1], [0.6, 1])
  const titleOpacity = interpolate(titleProgress, [0, 0.4], [0, 1])

  // fadeSlideUp for bottom text
  const bottomOpacity = interpolate(frame, [60, 75], [0, 1], { extrapolateRight: 'clamp' })
  const bottomTranslate = interpolate(frame, [60, 75], [30, 0], { extrapolateRight: 'clamp' })

  return (
    <CenteredStack
      background={theme.backgrounds[2]}
      subtitleSegments={SHOT_SUBTITLES[2]}
      videoOffset={SHOT_START_SECONDS[2]}
      justify="center"
      gap={40}
    >
      {/* Title */}
      <div style={{
        fontSize: 72, fontWeight: 800, color: theme.textPrimary,
        transform: `scale(${titleScale})`, opacity: titleOpacity,
      }}>
        Pixelle-Video
      </div>

      {/* Tags */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
        {TAGS.map((tag, i) => {
          const tagProgress = spring({ frame, fps, config: { damping: 14, stiffness: 180 }, delay: 15 + i * 12 })
          const tagScale = interpolate(tagProgress, [0, 1], [0.8, 1])
          const tagOpacity = interpolate(tagProgress, [0, 0.5], [0, 1])
          return (
            <div key={tag} style={{
              fontSize: 34, fontWeight: 600, color: theme.accent,
              background: `${theme.accent}22`,
              border: `2px solid ${theme.accent}`,
              borderRadius: 40,
              padding: '14px 32px',
              transform: `scale(${tagScale})`,
              opacity: tagOpacity,
            }}>
              {tag}
            </div>
          )
        })}
      </div>

      {/* Bottom line */}
      <div style={{
        fontSize: 30, fontWeight: 500, color: theme.textSecondary,
        opacity: bottomOpacity, transform: `translateY(${bottomTranslate}px)`,
      }}>
        输入主题 → AI 全自动生成完整视频
      </div>
    </CenteredStack>
  )
}
