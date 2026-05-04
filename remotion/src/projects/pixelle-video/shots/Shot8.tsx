import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import { CenteredStack } from '../../../components'
import { theme, SHOT_SUBTITLES, SHOT_START_SECONDS } from '../theme'

const PLANS = [
  { title: '完全免费', detail: 'Ollama + ComfyUI 本地', badge: '0 元', pulse: true },
  { title: '推荐方案', detail: '通义千问 + 本地', badge: '极低成本', pulse: false },
  { title: '一键部署', detail: 'Windows / Docker', badge: '开箱即用', pulse: false },
]

export const Shot8: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Header fadeSlideUp
  const headerOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' })
  const headerTranslate = interpolate(frame, [0, 15], [30, 0], { extrapolateRight: 'clamp' })

  return (
    <CenteredStack
      background={theme.backgrounds[7]}
      subtitleSegments={SHOT_SUBTITLES[7]}
      videoOffset={SHOT_START_SECONDS[7]}
      justify="center"
      gap={32}
    >
      {/* Header */}
      <div style={{
        fontSize: 48, fontWeight: 800, color: theme.textPrimary,
        opacity: headerOpacity, transform: `translateY(${headerTranslate}px)`,
      }}>
        三种方案随你选
      </div>

      {/* Plan cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%', maxWidth: 800 }}>
        {PLANS.map((plan, i) => {
          const progress = spring({ frame, fps, config: { damping: 12, stiffness: 200 }, delay: 10 + i * 15 })
          const scale = interpolate(progress, [0, 1], [0.85, 1])
          const opacity = interpolate(progress, [0, 0.5], [0, 1])

          // Pulse for first card
          const pulseScale = plan.pulse
            ? interpolate(Math.sin((frame - 40) * 0.08), [-1, 1], [1, 1.04])
            : 1

          return (
            <div key={plan.title} style={{
              padding: 28, borderRadius: 20,
              background: theme.cardBg,
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              borderTop: `4px solid ${theme.accent}`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              transform: `scale(${scale * pulseScale})`, opacity,
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontSize: 36, fontWeight: 700, color: theme.textPrimary }}>{plan.title}</div>
                <div style={{ fontSize: 26, fontWeight: 500, color: theme.textSecondary }}>{plan.detail}</div>
              </div>
              <div style={{
                fontSize: 28, fontWeight: 700, color: '#fff',
                background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentAlt})`,
                borderRadius: 24, padding: '10px 24px',
              }}>
                {plan.badge}
              </div>
            </div>
          )
        })}
      </div>
    </CenteredStack>
  )
}
