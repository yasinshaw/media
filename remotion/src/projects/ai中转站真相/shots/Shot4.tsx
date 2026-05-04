import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import { CenteredStack } from '../../../components'
import { theme, FONT_FAMILY, backgrounds } from '../theme'

interface ShotProps {
  subtitleSegments?: Array<{ text: string; start: number; end: number; duration: number }>
}

const tactics = [
  {
    num: '01',
    icon: '🔄',
    title: '直接掉包',
    desc: '国产平价模型 → GPT-5.5',
    sub: '冒充贵的赚差价',
  },
  {
    num: '02',
    icon: '🎲',
    title: '随机路由',
    desc: '每次分配不同模型',
    sub: '让你无法察觉',
  },
  {
    num: '03',
    icon: '⏪',
    title: '降级版本',
    desc: '旧版本 → 新版标签',
    sub: '冒充最新版',
  },
] as const

export const Shot4: React.FC<ShotProps> = ({ subtitleSegments }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const subtitle = subtitleSegments?.find((s) => frame / fps >= s.start && frame / fps < s.end)?.text

  const headerOpacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp' })
  const headerY = interpolate(frame, [0, 12], [-20, 0], { extrapolateRight: 'clamp' })

  return (
    <CenteredStack background={backgrounds[3]} maxWidth={960} gap={28} subtitle={subtitle}>
      <div style={{
        opacity: headerOpacity,
        transform: `translateY(${headerY}px)`,
        fontSize: 50,
        fontWeight: 900,
        color: theme.textOnLight,
        fontFamily: FONT_FAMILY,
        letterSpacing: '1px',
      }}>
        三种<span style={{ color: theme.danger }}>造假套路</span>
      </div>

      {tactics.map((t, i) => {
        const delay = 18 + i * 70
        const slideProgress = spring({ frame, fps, config: { damping: 14, stiffness: 140 }, delay })
        const opacity = interpolate(slideProgress, [0, 0.4], [0, 1])
        const x = interpolate(slideProgress, [0, 1], [120, 0])

        // Typewriter on the title
        const charsPerFrame = 0.5
        const charsVisible = Math.max(0, Math.floor((frame - delay - 8) * charsPerFrame))
        const visibleTitle = t.title.slice(0, charsVisible)

        return (
          <div key={t.num} style={{
            opacity,
            transform: `translateX(${x}px)`,
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            padding: '24px 28px',
            background: theme.cardBgLight,
            border: `2px solid ${theme.cardBorderLight}`,
            borderRadius: 20,
            boxShadow: '0 4px 20px rgba(14,165,233,0.08)',
            width: '100%',
            fontFamily: FONT_FAMILY,
          }}>
            {/* Number badge */}
            <div style={{
              width: 84, height: 84, borderRadius: 16,
              background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentAlt})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 36, fontWeight: 900, color: '#fff',
              flexShrink: 0,
              boxShadow: `0 4px 12px ${theme.accent}55`,
            }}>
              {t.num}
            </div>

            {/* Icon */}
            <div style={{
              fontSize: 64,
              flexShrink: 0,
              width: 84,
              textAlign: 'center',
            }}>
              {t.icon}
            </div>

            {/* Content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{
                fontSize: 38,
                fontWeight: 900,
                color: theme.textOnLight,
                minHeight: '1em',
                letterSpacing: '1px',
              }}>
                {visibleTitle}
              </div>
              <div style={{
                fontSize: 26,
                fontWeight: 600,
                color: theme.textSecondaryOnLight,
              }}>
                {t.desc}
              </div>
              <div style={{
                fontSize: 24,
                fontWeight: 600,
                color: theme.danger,
              }}>
                · {t.sub}
              </div>
            </div>
          </div>
        )
      })}
    </CenteredStack>
  )
}
