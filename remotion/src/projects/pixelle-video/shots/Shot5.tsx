import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import { HubLayout } from '../../../components'
import { theme, SHOT_SUBTITLES, SHOT_START_SECONDS } from '../theme'

const MODULES = [
  { position: 'top' as const, label: 'AI 写文案', sub: '通义千问' },
  { position: 'right' as const, label: 'AI 配图', sub: 'FLUX' },
  { position: 'bottom' as const, label: 'AI 配音', sub: 'Edge-TTS' },
  { position: 'left' as const, label: 'AI 视频', sub: 'WAN 2.1' },
]

export const Shot5: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Center scale-in
  const centerProgress = spring({ frame, fps, config: { damping: 12, stiffness: 200 }, delay: 0 })
  const centerScale = interpolate(centerProgress, [0, 1], [0.5, 1])
  const centerOpacity = interpolate(centerProgress, [0, 0.4], [0, 1])

  // Connection lines fade in
  const connOpacity = interpolate(frame, [5, 25], [0, 0.4], { extrapolateRight: 'clamp' })

  // Footer fadeSlideUp
  const footerOpacity = interpolate(frame, [120, 135], [0, 1], { extrapolateRight: 'clamp' })
  const footerTranslate = interpolate(frame, [120, 135], [30, 0], { extrapolateRight: 'clamp' })

  const moduleNode = (label: string, sub: string, delay: number) => {
    const progress = spring({ frame, fps, config: { damping: 14, stiffness: 180 }, delay })
    const scale = interpolate(progress, [0, 1], [0.7, 1])
    const opacity = interpolate(progress, [0, 0.5], [0, 1])
    return (
      <div style={{
        width: 180, height: 120, borderRadius: 20,
        background: theme.cardBg,
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        border: `3px solid ${theme.accent}`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
        transform: `scale(${scale})`, opacity,
      }}>
        <div style={{ fontSize: 28, fontWeight: 700, color: theme.textPrimary }}>{label}</div>
        <div style={{ fontSize: 22, fontWeight: 500, color: theme.accent }}>{sub}</div>
      </div>
    )
  }

  return (
    <HubLayout
      center={{
        node: (
          <div style={{
            width: 160, height: 160, borderRadius: 80,
            background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentAlt})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 8px 32px ${theme.accent}44`,
            transform: `scale(${centerScale})`, opacity: centerOpacity,
          }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#fff' }}>视频输出</div>
          </div>
        ),
      }}
      surrounding={MODULES.map((m, i) => ({
        position: m.position,
        node: moduleNode(m.label, m.sub, 10 + i * 12),
      }))}
      radius={340}
      showConnections
      connectionColor={theme.accent}
      connectionWidth={3}
      connectionDashed
      connectionsOpacity={connOpacity}
      background={theme.backgrounds[4]}
      header={
        <div style={{
          fontSize: 44, fontWeight: 800, color: theme.textPrimary,
          opacity: centerOpacity,
        }}>
          ComfyUI 模块化架构
        </div>
      }
      footer={
        <div style={{
          fontSize: 32, fontWeight: 600, color: theme.textSecondary,
          opacity: footerOpacity, transform: `translateY(${footerTranslate}px)`,
        }}>
          像搭积木一样，灵活组合
        </div>
      }
      subtitleSegments={SHOT_SUBTITLES[4]}
      videoOffset={SHOT_START_SECONDS[4]}
    />
  )
}
