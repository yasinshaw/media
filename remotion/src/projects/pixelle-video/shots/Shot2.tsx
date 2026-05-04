import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from 'remotion'
import { TwoColumnCompare } from '../../../components'
import { theme, SHOT_SUBTITLES, SHOT_START_SECONDS } from '../theme'

const STEPS = ['写文案', '找素材', '配音', '剪辑', '加字幕']

export const Shot2: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Left panel slide-in
  const leftOpacity = interpolate(frame, [5, 20], [0, 1], { extrapolateRight: 'clamp' })
  const leftTranslate = interpolate(frame, [5, 20], [-60, 0], { extrapolateRight: 'clamp', easing: Easing.out(Easing.quad) })

  // Right panel slide-in
  const rightOpacity = interpolate(frame, [20, 35], [0, 1], { extrapolateRight: 'clamp' })
  const rightTranslate = interpolate(frame, [20, 35], [60, 0], { extrapolateRight: 'clamp', easing: Easing.out(Easing.quad) })

  // Scale-in for right panel content
  const scaleProgress = spring({ frame, fps, config: { damping: 12, stiffness: 200 }, delay: 30 })
  const rightScale = interpolate(scaleProgress, [0, 1], [0.5, 1])

  return (
    <TwoColumnCompare
      background={theme.backgrounds[1]}
      direction="vertical"
      left={{
        title: '传统方式',
        accent: theme.danger,
        opacity: leftOpacity,
        body: (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%', transform: `translateX(${leftTranslate}px)` }}>
            {STEPS.map((step, i) => {
              const itemOpacity = interpolate(frame, [10 + i * 6, 18 + i * 6], [0, 1], { extrapolateRight: 'clamp' })
              return (
                <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 16, opacity: itemOpacity, fontSize: 36, color: theme.textPrimary }}>
                  <span style={{ color: theme.danger, fontWeight: 800, fontSize: 40 }}>✗</span>
                  <span>{step}</span>
                </div>
              )
            })}
          </div>
        ),
      }}
      right={{
        title: 'Pixelle-Video',
        accent: theme.success,
        opacity: rightOpacity,
        caption: '一键出片',
        body: (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, transform: `translateX(${rightTranslate}px) scale(${rightScale})` }}>
            <div style={{ fontSize: 48, fontWeight: 800, color: theme.success }}>✓</div>
            <div style={{ fontSize: 44, fontWeight: 700, color: theme.textPrimary }}>AI 全自动</div>
          </div>
        ),
      }}
      subtitleSegments={SHOT_SUBTITLES[1]}
      videoOffset={SHOT_START_SECONDS[1]}
    />
  )
}
