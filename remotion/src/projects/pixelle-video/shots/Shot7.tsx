import React from 'react'
import { useCurrentFrame, interpolate, Easing } from 'remotion'
import { TwoColumnCompare } from '../../../components'
import { theme, SHOT_SUBTITLES, SHOT_START_SECONDS } from '../theme'

const COMPARE_ROWS = ['AI 视频生成', '数字人', '模型热插拔', 'ComfyUI 生态']

export const Shot7: React.FC = () => {
  const frame = useCurrentFrame()

  const leftOpacity = interpolate(frame, [5, 20], [0, 1], { extrapolateRight: 'clamp' })
  const leftTranslate = interpolate(frame, [5, 20], [-60, 0], { extrapolateRight: 'clamp', easing: Easing.out(Easing.quad) })

  const rightOpacity = interpolate(frame, [15, 30], [0, 1], { extrapolateRight: 'clamp' })
  const rightTranslate = interpolate(frame, [15, 30], [60, 0], { extrapolateRight: 'clamp', easing: Easing.out(Easing.quad) })

  return (
    <TwoColumnCompare
      background={theme.backgrounds[6]}
      direction="vertical"
      left={{
        title: 'MoneyPrinterTurbo',
        accent: theme.danger,
        opacity: leftOpacity,
        body: (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%', transform: `translateX(${leftTranslate}px)` }}>
            {COMPARE_ROWS.map((row, i) => {
              const rowOpacity = interpolate(frame, [8 + i * 10, 18 + i * 10], [0, 1], { extrapolateRight: 'clamp' })
              return (
                <div key={row} style={{ display: 'flex', alignItems: 'center', gap: 16, opacity: rowOpacity, fontSize: 34, color: theme.textPrimary }}>
                  <span style={{ color: theme.danger, fontWeight: 800, fontSize: 38 }}>✗</span>
                  <span>{row}</span>
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
        caption: '真的在生成内容',
        body: (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%', transform: `translateX(${rightTranslate}px)` }}>
            {COMPARE_ROWS.map((row, i) => {
              const rowOpacity = interpolate(frame, [12 + i * 10, 22 + i * 10], [0, 1], { extrapolateRight: 'clamp' })
              return (
                <div key={row} style={{ display: 'flex', alignItems: 'center', gap: 16, opacity: rowOpacity, fontSize: 34, color: theme.textPrimary }}>
                  <span style={{ color: theme.success, fontWeight: 800, fontSize: 38 }}>✓</span>
                  <span>{row}</span>
                </div>
              )
            })}
          </div>
        ),
      }}
      subtitleSegments={SHOT_SUBTITLES[6]}
      videoOffset={SHOT_START_SECONDS[6]}
    />
  )
}
