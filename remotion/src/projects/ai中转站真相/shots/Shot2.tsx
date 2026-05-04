import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import { CenteredStack } from '../../../components'
import { theme, FONT_FAMILY, backgrounds } from '../theme'

interface ShotProps {
  subtitleSegments?: Array<{ text: string; start: number; end: number; duration: number }>
}

const advantages = ['便宜', '方便', '支付宝直付'] as const

export const Shot2: React.FC<ShotProps> = ({ subtitleSegments }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const subtitle = subtitleSegments?.find((s) => frame / fps >= s.start && frame / fps < s.end)?.text

  const headerOpacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp' })
  const headerY = interpolate(frame, [0, 12], [-20, 0], { extrapolateRight: 'clamp' })

  // ❓ pulse breathing
  const pulseScale = interpolate(Math.sin(frame * 0.12), [-1, 1], [1, 1.08])
  const qProgress = spring({ frame, fps, config: { damping: 10, stiffness: 160 }, delay: 18 })
  const qScaleIn = interpolate(qProgress, [0, 1], [0, 1])
  const qOpacity = interpolate(qProgress, [0, 0.4], [0, 1])

  // Footer text reveals after items appear
  const footerOpacity = interpolate(frame, [180, 210], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <CenteredStack background={backgrounds[1]} maxWidth={960} gap={40} subtitle={subtitle}>
      <div style={{
        opacity: headerOpacity,
        transform: `translateY(${headerY}px)`,
        fontSize: 44,
        fontWeight: 800,
        color: theme.textOnLight,
        fontFamily: FONT_FAMILY,
      }}>
        国内开发者都在用 <span style={{ color: theme.accent }}>AI 中转站</span>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        width: '100%',
        gap: 40,
      }}>
        {/* Advantages list (left) */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}>
          {advantages.map((label, i) => {
            const itemDelay = 24 + i * 16
            const checkProgress = spring({ frame, fps, config: { damping: 12, stiffness: 200 }, delay: itemDelay })
            const itemOpacity = interpolate(checkProgress, [0, 0.5], [0, 1])
            const itemX = interpolate(checkProgress, [0, 1], [-20, 0])
            // Typewriter — chars per frame for label
            const charsVisible = Math.max(0, Math.floor((frame - itemDelay - 6) * 0.6))
            const visibleText = label.slice(0, charsVisible)
            const checkScale = interpolate(checkProgress, [0, 1], [0, 1])
            return (
              <div key={label} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 18,
                padding: '18px 24px',
                background: theme.cardBgLight,
                border: `2px solid ${theme.cardBorderLight}`,
                borderRadius: 16,
                boxShadow: '0 4px 16px rgba(14,165,233,0.08)',
                opacity: itemOpacity,
                transform: `translateX(${itemX}px)`,
                fontFamily: FONT_FAMILY,
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 24,
                  background: theme.success,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 30, fontWeight: 900, color: '#fff',
                  flexShrink: 0,
                  transform: `scale(${checkScale})`,
                }}>
                  ✓
                </div>
                <div style={{
                  fontSize: 36,
                  fontWeight: 700,
                  color: theme.textOnLight,
                  minHeight: '1em',
                }}>
                  {visibleText}
                </div>
              </div>
            )
          })}
        </div>

        {/* Big ❓ on the right */}
        <div style={{
          width: 300,
          height: 300,
          opacity: qOpacity,
          transform: `scale(${qScaleIn * pulseScale})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <div style={{
            width: 260, height: 260, borderRadius: 130,
            background: `radial-gradient(circle, ${theme.accent}, ${theme.accentAlt})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 200, fontWeight: 900, color: '#fff',
            boxShadow: `0 0 80px ${theme.accent}55`,
            fontFamily: FONT_FAMILY,
          }}>
            ?
          </div>
        </div>
      </div>

      {/* Footer question */}
      <div style={{
        opacity: footerOpacity,
        fontSize: 38,
        fontWeight: 700,
        color: theme.danger,
        fontFamily: FONT_FAMILY,
        textAlign: 'center',
        marginTop: 16,
      }}>
        你付的钱，背后跑的到底是什么？
      </div>
    </CenteredStack>
  )
}
