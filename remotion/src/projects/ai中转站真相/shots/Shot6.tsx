import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import { CenteredStack } from '../../../components'
import { theme, FONT_FAMILY, backgrounds } from '../theme'

interface ShotProps {
  subtitleSegments?: Array<{ text: string; start: number; end: number; duration: number }>
}

const risks = [
  {
    icon: '👁️',
    title: '数据全裸奔',
    headline: '提示词 + AI回复',
    sub: '中转站全都看得到',
    color: '#7C3AED', // purple
  },
  {
    icon: '⚖️',
    title: '无照经营',
    headline: '88% 无营业执照',
    sub: '仅 1 家有 ICP 备案',
    color: '#F59E0B',
  },
  {
    icon: '💸',
    title: '跑路风险',
    headline: 'WildCard 停服',
    sub: '30 万用户突然没法用',
    color: '#DC2626',
  },
] as const

export const Shot6: React.FC<ShotProps> = ({ subtitleSegments }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const subtitle = subtitleSegments?.find((s) => frame / fps >= s.start && frame / fps < s.end)?.text

  const headerOpacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp' })
  const headerY = interpolate(frame, [0, 12], [-20, 0], { extrapolateRight: 'clamp' })

  return (
    <CenteredStack background={backgrounds[5]} maxWidth={960} gap={28} subtitle={subtitle}>
      <div style={{
        opacity: headerOpacity,
        transform: `translateY(${headerY}px)`,
        fontSize: 48,
        fontWeight: 900,
        color: theme.textOnLight,
        fontFamily: FONT_FAMILY,
      }}>
        除了造假，还有<span style={{ color: theme.danger }}>更大的坑</span>
      </div>

      {risks.map((r, i) => {
        // rotateIn animation
        const delay = 18 + i * 80
        const progress = spring({ frame, fps, config: { damping: 12, stiffness: 150 }, delay })
        const rotation = interpolate(progress, [0, 1], [-12, 0])
        const scale = interpolate(progress, [0, 1], [0.7, 1])
        const opacity = interpolate(progress, [0, 0.4], [0, 1])

        // Typewriter on the headline
        const charsPerFrame = 0.6
        const charsVisible = Math.max(0, Math.floor((frame - delay - 8) * charsPerFrame))
        const visibleHeadline = r.headline.slice(0, charsVisible)

        return (
          <div key={i} style={{
            opacity,
            transform: `rotate(${rotation}deg) scale(${scale})`,
            display: 'flex',
            alignItems: 'center',
            gap: 22,
            padding: '22px 28px',
            background: '#fff',
            border: `2px solid ${r.color}33`,
            borderLeft: `8px solid ${r.color}`,
            borderRadius: 18,
            boxShadow: `0 6px 20px ${r.color}1A`,
            width: '100%',
            fontFamily: FONT_FAMILY,
          }}>
            <div style={{
              fontSize: 60,
              width: 84, height: 84,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: `${r.color}15`,
              borderRadius: 16,
              flexShrink: 0,
            }}>
              {r.icon}
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{
                fontSize: 24,
                fontWeight: 700,
                color: r.color,
                letterSpacing: '1px',
              }}>
                {r.title}
              </div>
              <div style={{
                fontSize: 36,
                fontWeight: 900,
                color: theme.textOnLight,
                minHeight: '1em',
              }}>
                {visibleHeadline}
              </div>
              <div style={{
                fontSize: 24,
                fontWeight: 600,
                color: theme.textSecondaryOnLight,
              }}>
                {r.sub}
              </div>
            </div>
          </div>
        )
      })}
    </CenteredStack>
  )
}
