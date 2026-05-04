import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import { CenteredStack } from '../../../components'
import { theme, SHOT_SUBTITLES, SHOT_START_SECONDS } from '../theme'

const CAPABILITIES = [
  { icon: '🎬', title: 'AI 视频生成', detail: 'WAN 2.1 模型' },
  { icon: '🧑‍💻', title: '数字人口播', detail: '一张照片让角色动起来' },
  { icon: '💃', title: '动作迁移', detail: '前沿功能' },
]

export const Shot6: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Header rotateIn
  const headerProgress = spring({ frame, fps, config: { damping: 12, stiffness: 150 }, delay: 0 })
  const headerRotation = interpolate(headerProgress, [0, 1], [-10, 0])
  const headerScale = interpolate(headerProgress, [0, 1], [0.7, 1])
  const headerOpacity = interpolate(headerProgress, [0, 0.4], [0, 1])

  return (
    <CenteredStack
      background={theme.backgrounds[5]}
      subtitleSegments={SHOT_SUBTITLES[5]}
      videoOffset={SHOT_START_SECONDS[5]}
      justify="center"
      gap={32}
    >
      {/* Header */}
      <div style={{
        fontSize: 44, fontWeight: 800, color: theme.textPrimary,
        transform: `rotate(${headerRotation}deg) scale(${headerScale})`, opacity: headerOpacity,
      }}>
        前沿能力
      </div>

      {/* Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%', maxWidth: 800 }}>
        {CAPABILITIES.map((cap, i) => {
          const progress = spring({ frame, fps, config: { damping: 12, stiffness: 150 }, delay: 15 + i * 18 })
          const rotation = interpolate(progress, [0, 1], [-8, 0])
          const scale = interpolate(progress, [0, 1], [0.85, 1])
          const opacity = interpolate(progress, [0, 0.4], [0, 1])
          return (
            <div key={cap.title} style={{
              padding: 32, borderRadius: 20,
              background: theme.cardBg,
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              borderLeft: `6px solid ${theme.accent}`,
              display: 'flex', alignItems: 'center', gap: 24,
              transform: `rotate(${rotation}deg) scale(${scale})`, opacity,
            }}>
              <div style={{ fontSize: 52 }}>{cap.icon}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontSize: 36, fontWeight: 700, color: theme.textPrimary }}>{cap.title}</div>
                <div style={{ fontSize: 28, fontWeight: 500, color: theme.textSecondary }}>{cap.detail}</div>
              </div>
            </div>
          )
        })}
      </div>
    </CenteredStack>
  )
}
