import React from 'react'
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import { CenteredStack } from '../../../components'
import { theme, FONT_FAMILY, backgrounds } from '../theme'

interface ShotProps {
  subtitleSegments?: Array<{ text: string; start: number; end: number; duration: number }>
}

const tips = [
  { icon: '🛡️', title: '敏感业务', body: '走官方 API' },
  { icon: '🔬', title: '必须用中转', body: '接 LLMmap 检测' },
  { icon: '💰', title: '充值别太多', body: '防范跑路' },
] as const

export const Shot8: React.FC<ShotProps> = ({ subtitleSegments }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const subtitle = subtitleSegments?.find((s) => frame / fps >= s.start && frame / fps < s.end)?.text

  // Header
  const headerProgress = spring({ frame, fps, config: { damping: 12, stiffness: 180 } })
  const headerOpacity = interpolate(headerProgress, [0, 0.4], [0, 1])
  const headerScale = interpolate(headerProgress, [0, 1], [0.85, 1])

  // Starburst rotation in background
  const burstRotate = frame * 0.3

  // Follow CTA pulse
  const followPulse = interpolate(Math.sin(frame * 0.18), [-1, 1], [1, 1.06])
  const followProgress = spring({ frame, fps, config: { damping: 10, stiffness: 200 }, delay: 280 })
  const followOpacity = interpolate(followProgress, [0, 0.4], [0, 1])
  const followScaleIn = interpolate(followProgress, [0, 1], [0.6, 1])

  // Highlight wipe under "关注我"
  const highlightProgress = spring({ frame, fps, config: { damping: 200 }, delay: 310 })

  return (
    <AbsoluteFill style={{ background: backgrounds[7] }}>
      {/* Decorative starburst rays */}
      <AbsoluteFill style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        <div style={{
          width: 1600, height: 1600,
          opacity: 0.18,
          transform: `rotate(${burstRotate}deg)`,
          background: `repeating-conic-gradient(from 0deg, ${theme.accent} 0deg 4deg, transparent 4deg 16deg)`,
          borderRadius: '50%',
        }} />
      </AbsoluteFill>

      <CenteredStack maxWidth={960} gap={28} subtitle={subtitle}>
        <div style={{
          opacity: headerOpacity,
          transform: `scale(${headerScale})`,
          fontSize: 56,
          fontWeight: 900,
          color: theme.textOnDark,
          fontFamily: FONT_FAMILY,
          letterSpacing: '2px',
        }}>
          三条<span style={{ color: theme.accent }}>建议</span>
        </div>

        {tips.map((tip, i) => {
          const delay = 30 + i * 60
          const progress = spring({ frame, fps, config: { damping: 12, stiffness: 200 }, delay })
          const opacity = interpolate(progress, [0, 0.4], [0, 1])
          const scale = interpolate(progress, [0, 1], [0.85, 1])

          return (
            <div key={i} style={{
              opacity,
              transform: `scale(${scale})`,
              display: 'flex',
              alignItems: 'center',
              gap: 24,
              padding: '20px 28px',
              background: theme.cardBgDark,
              border: `2px solid ${theme.cardBorderDark}`,
              borderRadius: 18,
              backdropFilter: 'blur(8px)',
              width: '100%',
              fontFamily: FONT_FAMILY,
            }}>
              <div style={{
                fontSize: 60,
                width: 84, height: 84,
                background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentAlt})`,
                borderRadius: 18,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                boxShadow: `0 4px 16px ${theme.accent}55`,
              }}>
                {tip.icon}
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{
                  fontSize: 30,
                  fontWeight: 700,
                  color: theme.accent,
                }}>
                  {tip.title}
                </div>
                <div style={{
                  fontSize: 38,
                  fontWeight: 900,
                  color: theme.textOnDark,
                }}>
                  {tip.body}
                </div>
              </div>
            </div>
          )
        })}

        {/* Follow CTA */}
        <div style={{
          opacity: followOpacity,
          transform: `scale(${followScaleIn * followPulse})`,
          marginTop: 12,
          padding: '20px 56px',
          background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentAlt})`,
          borderRadius: 60,
          boxShadow: `0 8px 32px ${theme.accent}77`,
          fontFamily: FONT_FAMILY,
        }}>
          <div style={{
            fontSize: 48,
            fontWeight: 900,
            color: '#fff',
            letterSpacing: '4px',
            position: 'relative',
            display: 'inline-block',
          }}>
            <span style={{
              position: 'absolute',
              left: -12, right: -12, top: '50%', height: '1.05em',
              transform: `translateY(-50%) scaleX(${highlightProgress})`,
              transformOrigin: 'left center',
              backgroundColor: '#fff',
              opacity: 0.2,
              borderRadius: '0.15em',
            }} />
            <span style={{ position: 'relative', zIndex: 1 }}>+ 关注我</span>
          </div>
        </div>

        <div style={{
          opacity: interpolate(frame, [340, 370], [0, 1], { extrapolateRight: 'clamp' }),
          fontSize: 28,
          fontWeight: 600,
          color: theme.textSecondaryOnDark,
          fontFamily: FONT_FAMILY,
          letterSpacing: '1px',
        }}>
          避开 AI 开发路上的坑
        </div>
      </CenteredStack>
    </AbsoluteFill>
  )
}
