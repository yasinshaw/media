import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import { SafeArea } from '../../../components'
import type { SubtitleSegment } from '../../../components'

interface ShotProps {
  subtitleSegments?: SubtitleSegment[]
  videoOffset?: number
}

const MODES = [
  { icon: '🔀', label: '扇出并行' },
  { icon: '🔗', label: '流水线' },
  { icon: '🗳️', label: '投票仲裁' },
  { icon: '👤', label: '人工介入' },
]

export const Shot5: React.FC<ShotProps> = ({ subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const accent = '#A78BFA'
  const accentAlt = '#38BDF8'

  const modeStyles = MODES.map((_, i) => {
    const delay = 10 + i * 12
    const progress = spring({ frame, fps, config: { damping: 12, stiffness: 200 }, delay })
    const scale = interpolate(progress, [0, 1], [0.5, 1])
    const opacity = interpolate(progress, [0, 0.5], [0, 1])
    return { scale, opacity }
  })

  const logoScale = spring({ frame, fps, config: { damping: 15, stiffness: 120 }, delay: 70 })
  const logoOpacity = interpolate(logoScale, [0, 0.4], [0, 1])

  const pulse = interpolate(
    Math.sin((frame - 80) * 0.08),
    [-1, 1], [1, 1.06],
  )

  const currentSeconds = (videoOffset ?? 0) + frame / fps
  const subtitleText = subtitleSegments
    ?.find((s) => s.start <= currentSeconds && s.end > currentSeconds)
    ?.text ?? ''

  return (
    <SafeArea style={{
      background: 'linear-gradient(135deg, #1A1A2E, #16213E)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', gap: 36,
    }}>
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20,
        maxWidth: 600,
      }}>
        {MODES.map((m, i) => (
          <div key={m.label} style={{
            padding: '20px 16px', borderRadius: 20,
            backgroundColor: 'rgba(255,255,255,0.08)',
            border: `1px solid ${i % 2 === 0 ? accent + '40' : accentAlt + '40'}`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
            ...modeStyles[i],
            transform: `scale(${modeStyles[i].scale})`,
          }}>
            <div style={{ fontSize: 36 }}>{m.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#F8FAFC' }}>
              {m.label}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
        opacity: logoOpacity, transform: `scale(${logoScale})`,
      }}>
        <div style={{
          fontSize: 44, fontWeight: 900, color: accent,
          textShadow: `0 0 40px ${accent}50`,
          transform: `scale(${pulse})`,
        }}>
          MIT 开源免费
        </div>
        <div style={{
          fontSize: 26, color: '#94A3B8',
          padding: '10px 24px', borderRadius: 20,
          backgroundColor: 'rgba(255,255,255,0.06)',
        }}>
          hermes-agent.nousresearch.com
        </div>
      </div>

      {subtitleText && (
        <div style={{
          position: 'absolute', bottom: 240, left: 40, right: 40,
          display: 'flex', justifyContent: 'center',
        }}>
          <div style={{
            fontSize: 46, fontWeight: 700, color: '#ffffff',
            textShadow: '2px 2px 6px rgba(0,0,0,0.95), 0 0 16px rgba(0,0,0,0.6)',
            textAlign: 'center',
          }}>
            {subtitleText}
          </div>
        </div>
      )}
    </SafeArea>
  )
}
