import React from 'react'
import { useCurrentFrame, interpolate } from 'remotion'
import { TimelineFlow } from '../../../components'
import { theme, SHOT_SUBTITLES, SHOT_START_SECONDS } from '../theme'

const STEPS = [
  { icon: '📝', label: 'AI 写文案', detail: '通义千问 / DeepSeek / GPT' },
  { icon: '🎨', label: 'AI 配图', detail: 'FLUX 模型' },
  { icon: '🎙️', label: 'AI 配音', detail: 'Edge-TTS' },
  { icon: '🎵', label: '加 BGM', detail: '自动匹配' },
  { icon: '🎬', label: '合成视频', detail: '一键输出' },
]

export const Shot4: React.FC = () => {
  const frame = useCurrentFrame()

  // Header fadeSlideUp
  const headerOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' })
  const headerTranslate = interpolate(frame, [0, 15], [30, 0], { extrapolateRight: 'clamp' })

  const items = STEPS.map((step, i) => ({
    ...step,
    opacity: interpolate(frame, [10 + i * 15, 22 + i * 15], [0, 1], { extrapolateRight: 'clamp' }),
    color: theme.accent,
  }))

  return (
    <TimelineFlow
      items={items}
      direction="horizontal"
      accent={theme.accent}
      connectorStyle="arrow"
      background={theme.backgrounds[3]}
      textColor={theme.textPrimary}
      detailColor={theme.textSecondary}
      header={
        <div style={{
          fontSize: 48, fontWeight: 800, color: theme.textPrimary,
          opacity: headerOpacity, transform: `translateY(${headerTranslate}px)`,
        }}>
          全流程自动化
        </div>
      }
      subtitleSegments={SHOT_SUBTITLES[3]}
      videoOffset={SHOT_START_SECONDS[3]}
    />
  )
}
