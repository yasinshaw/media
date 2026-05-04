import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import { CenteredStack } from '../../../components'
import { theme, FONT_FAMILY, backgrounds } from '../theme'

interface ShotProps {
  subtitleSegments?: Array<{ text: string; start: number; end: number; duration: number }>
}

const probes = [
  '你是哪家公司训练的？',
  '你的版本号是多少？',
  '你的训练截止时间？',
  '你支持多少 token？',
] as const

export const Shot7: React.FC<ShotProps> = ({ subtitleSegments }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const subtitle = subtitleSegments?.find((s) => frame / fps >= s.start && frame / fps < s.end)?.text

  const headerOpacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp' })
  const headerY = interpolate(frame, [0, 12], [-20, 0], { extrapolateRight: 'clamp' })

  // LLMmap tool card
  const toolProgress = spring({ frame, fps, config: { damping: 14, stiffness: 140 }, delay: 18 })
  const toolOpacity = interpolate(toolProgress, [0, 0.4], [0, 1])
  const toolScale = interpolate(toolProgress, [0, 1], [0.85, 1])

  // 24 探针 typewriter counter
  const probeNumStart = 60
  const probeCount = Math.min(24, Math.max(0, Math.floor((frame - probeNumStart) * 0.7)))

  // Progress bar (24 probes filling up)
  const barProgress = spring({ frame, fps, config: { damping: 18, stiffness: 100 }, delay: 80 })

  // Right card — 特征 prompt 测试
  const rightDelay = 200
  const rightProgress = spring({ frame, fps, config: { damping: 14, stiffness: 140 }, delay: rightDelay })
  const rightOpacity = interpolate(rightProgress, [0, 0.4], [0, 1])
  const rightX = interpolate(rightProgress, [0, 1], [40, 0])

  return (
    <CenteredStack background={backgrounds[6]} maxWidth={980} gap={28} subtitle={subtitle}>
      <div style={{
        opacity: headerOpacity,
        transform: `translateY(${headerY}px)`,
        fontSize: 44,
        fontWeight: 900,
        color: theme.textOnLight,
        fontFamily: FONT_FAMILY,
      }}>
        🔍 怎么<span style={{ color: theme.accent }}>判断真假</span>？
      </div>

      {/* LLMmap tool card */}
      <div style={{
        opacity: toolOpacity,
        transform: `scale(${toolScale})`,
        width: '100%',
        background: '#fff',
        borderRadius: 20,
        padding: '28px 32px',
        border: `2px solid ${theme.accent}33`,
        boxShadow: `0 8px 24px ${theme.accent}1A`,
        fontFamily: FONT_FAMILY,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          marginBottom: 16,
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 12,
            background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentAlt})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 30, color: '#fff', fontWeight: 900,
          }}>
            ⚡
          </div>
          <div>
            <div style={{ fontSize: 36, fontWeight: 900, color: theme.textOnLight }}>
              LLMmap 工具
            </div>
            <div style={{ fontSize: 22, fontWeight: 600, color: theme.textSecondaryOnLight }}>
              指纹探针 · 验证模型真伪
            </div>
          </div>
        </div>

        {/* Probe counter */}
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 10,
          marginBottom: 14,
        }}>
          <span style={{ fontSize: 90, fontWeight: 900, color: theme.accent, lineHeight: 1 }}>
            {probeCount}
          </span>
          <span style={{ fontSize: 32, fontWeight: 700, color: theme.textSecondaryOnLight }}>
            / 24 个探针查询
          </span>
        </div>

        {/* Progress bar */}
        <div style={{
          width: '100%',
          height: 16,
          borderRadius: 8,
          background: theme.cardBgLight,
          overflow: 'hidden',
        }}>
          <div style={{
            width: `${barProgress * 100}%`,
            height: '100%',
            background: `linear-gradient(90deg, ${theme.accent}, ${theme.accentAlt})`,
            borderRadius: 8,
          }} />
        </div>
      </div>

      {/* Right: simple 特征 prompt method */}
      <div style={{
        opacity: rightOpacity,
        transform: `translateX(${rightX}px)`,
        width: '100%',
        background: '#fff',
        border: `2px solid ${theme.success}33`,
        borderLeft: `8px solid ${theme.success}`,
        borderRadius: 18,
        padding: '20px 24px',
        fontFamily: FONT_FAMILY,
      }}>
        <div style={{
          fontSize: 28,
          fontWeight: 800,
          color: theme.success,
          marginBottom: 10,
        }}>
          💡 简单方法 · 特征 Prompt 测试
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {probes.slice(0, 3).map((p, i) => {
            const d = rightDelay + 20 + i * 12
            const o = interpolate(frame, [d, d + 10], [0, 1], { extrapolateRight: 'clamp' })
            return (
              <div key={i} style={{
                opacity: o,
                fontSize: 24,
                fontWeight: 600,
                color: theme.textOnLight,
                paddingLeft: 8,
              }}>
                · {p}
              </div>
            )
          })}
        </div>
      </div>
    </CenteredStack>
  )
}
