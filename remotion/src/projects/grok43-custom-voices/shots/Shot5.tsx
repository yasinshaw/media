import React from 'react'
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion'
import { SafeArea, ProgressiveSubtitle, type SubtitleSegment } from '../../../components'

interface ShotProps {
  subtitleSegments?: SubtitleSegment[]
  videoOffset?: number
}

const STEPS = [
  { label: '录音 60秒', icon: '🎤' },
  { label: '生成 2分钟', icon: '⚡' },
  { label: '声纹验证 ✓ 安全', icon: '🛡️' },
] as const

export const Shot5: React.FC<ShotProps> = ({ subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const staggerReveal = (delay: number): React.CSSProperties => {
    const progress = spring({ frame, fps, config: { damping: 16, stiffness: 140 }, delay })
    const translateY = interpolate(progress, [0, 1], [20, 0], { extrapolateRight: 'clamp' })
    return {
      opacity: interpolate(progress, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' }),
      transform: `translateY(${translateY}px)`,
    }
  }

  return (
    <AbsoluteFill style={{ backgroundColor: '#18181B' }}>
      <Img
        src={staticFile('images/grok43-custom-voices/tavily-006.png')}
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(24,24,27,0.2) 0%, rgba(24,24,27,0.8) 100%)' }} />

      <SafeArea>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'flex-end', paddingBottom: 80, gap: 16 }}>
          {STEPS.map((step, index) => (
            <div
              key={step.label}
              style={{
                ...staggerReveal(10 + index * 12),
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 16,
                padding: '18px 28px',
                backdropFilter: 'blur(8px)',
                border: `1px solid ${index === 2 ? 'rgba(34, 197, 94, 0.4)' : 'rgba(255, 255, 255, 0.15)'}`,
              }}
            >
              <span style={{ fontSize: 32 }}>{step.icon}</span>
              <span
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: index === 2 ? '#22C55E' : '#F8FAFC',
                }}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </SafeArea>

      {subtitleSegments && videoOffset !== undefined && (
        <ProgressiveSubtitle segments={subtitleSegments} videoOffset={videoOffset} />
      )}
    </AbsoluteFill>
  )
}
