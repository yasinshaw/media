import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import { CenteredStack } from '../../../components'
import { theme, FONT_FAMILY, backgrounds } from '../theme'

interface ShotProps {
  subtitleSegments?: Array<{ text: string; start: number; end: number; duration: number }>
}

export const Shot3: React.FC<ShotProps> = ({ subtitleSegments }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const subtitle = subtitleSegments?.find((s) => frame / fps >= s.start && frame / fps < s.end)?.text

  // Source label
  const sourceOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' })

  // Big "45%" — typewriter
  const numProgress = spring({ frame, fps, config: { damping: 10, stiffness: 180 }, delay: 30 })
  const numScale = interpolate(numProgress, [0, 1], [0.3, 1])
  const numOpacity = interpolate(numProgress, [0, 0.4], [0, 1])
  const numShakeIntensity = interpolate(frame, [50, 90], [10, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const numShake = Math.sin(frame * 1.4) * numShakeIntensity

  // Highlight wipe under "假模型"
  const highlightProgress = spring({ frame, fps, config: { damping: 200 }, delay: 60 })

  // Audit pipeline reveal (3 steps)
  const stepDelay = 90
  const steps = [
    { label: '审计 17 家中转站', icon: '🔍' },
    { label: '模型指纹技术检测', icon: '🧬' },
    { label: '45% 验证失败', icon: '❌' },
  ]

  // Progress bar reveal at end (45% width)
  const barProgress = spring({ frame, fps, config: { damping: 18, stiffness: 100 }, delay: 220 })

  return (
    <CenteredStack background={backgrounds[2]} maxWidth={980} gap={32} subtitle={subtitle}>
      <div style={{
        opacity: sourceOpacity,
        fontSize: 32,
        fontWeight: 700,
        color: theme.textSecondaryOnLight,
        fontFamily: FONT_FAMILY,
        letterSpacing: '1px',
      }}>
        🇩🇪 德国 CISPA · 欧洲顶级网络安全机构
      </div>

      {/* Big 45% block */}
      <div style={{
        opacity: numOpacity,
        transform: `scale(${numScale}) translateX(${numShake}px)`,
        display: 'flex',
        alignItems: 'baseline',
        gap: 12,
        fontFamily: FONT_FAMILY,
      }}>
        <div style={{
          fontSize: 220,
          fontWeight: 900,
          color: theme.danger,
          lineHeight: 1,
          letterSpacing: '-4px',
          textShadow: `0 4px 24px ${theme.danger}33`,
        }}>
          45<span style={{ fontSize: 140 }}>%</span>
        </div>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <span style={{
            position: 'absolute',
            left: -6, right: -6, top: '50%', height: '1.1em',
            transform: `translateY(-50%) scaleX(${highlightProgress})`,
            transformOrigin: 'left center',
            backgroundColor: theme.warning,
            opacity: 0.4,
            borderRadius: '0.12em',
          }} />
          <span style={{
            position: 'relative', zIndex: 1,
            fontSize: 64, fontWeight: 900, color: theme.textOnLight,
          }}>
            假模型
          </span>
        </div>
      </div>

      {/* Audit pipeline */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        width: '100%',
      }}>
        {steps.map((step, i) => {
          const d = stepDelay + i * 35
          const o = interpolate(frame, [d, d + 12], [0, 1], { extrapolateRight: 'clamp' })
          const x = interpolate(frame, [d, d + 12], [-30, 0], { extrapolateRight: 'clamp' })
          const isFail = i === steps.length - 1
          return (
            <div key={i} style={{
              opacity: o,
              transform: `translateX(${x}px)`,
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              padding: '18px 24px',
              background: isFail ? `${theme.danger}15` : theme.cardBgLight,
              border: `2px solid ${isFail ? theme.danger : theme.cardBorderLight}`,
              borderRadius: 14,
              fontFamily: FONT_FAMILY,
            }}>
              <div style={{
                fontSize: 36,
                width: 56, height: 56,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {step.icon}
              </div>
              <div style={{
                fontSize: 34,
                fontWeight: 700,
                color: isFail ? theme.danger : theme.textOnLight,
              }}>
                {step.label}
              </div>
            </div>
          )
        })}
      </div>

      {/* 45% red progress bar */}
      <div style={{
        width: '100%',
        height: 24,
        borderRadius: 12,
        background: theme.cardBgLight,
        border: `1px solid ${theme.cardBorderLight}`,
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${barProgress * 45}%`,
          height: '100%',
          background: `linear-gradient(90deg, ${theme.warning}, ${theme.danger})`,
          borderRadius: 12,
          boxShadow: `0 0 20px ${theme.danger}66`,
        }} />
      </div>
    </CenteredStack>
  )
}
