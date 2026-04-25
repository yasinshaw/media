import { AbsoluteFill, useCurrentFrame, interpolate, spring } from 'remotion'
import React from 'react'
import { ProgressiveSubtitle } from '../../../components/ProgressiveSubtitle'

interface Shot6Props {
  subtitleSegments?: Array<{ text: string; start: number; end: number; duration: number }>
  videoOffset?: number
}

export const Shot6: React.FC<Shot6Props> = ({ subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()

  const heartScale = spring({
    frame: frame - 5,
    fps: 30,
    config: { damping: 8, stiffness: 200 },
  })

  const likePulse = interpolate(
    Math.sin(frame * 0.2) * 0.5 + 0.5,
    [0, 1],
    [1, 1.15],
  )

  const subtitleOpacity = interpolate(frame, [20, 35], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(180deg, #0f172a 0%, #1a0a2e 50%, #0f172a 100%)',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '120px 40px 200px',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '48px',
        }}
      >
        {/* CTA icons */}
        <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
          {/* Like button */}
          <div
            style={{
              transform: `scale(${heartScale * likePulse})`,
              fontSize: 80,
              filter: 'drop-shadow(0 0 20px rgba(239,68,68,0.4))',
            }}
          >
            👍
          </div>
          {/* Subscribe */}
          <div
            style={{
              transform: `scale(${heartScale})`,
              background: 'linear-gradient(135deg, #ef4444, #f97316)',
              borderRadius: 40,
              padding: '20px 40px',
              fontSize: 36,
              fontWeight: 800,
              color: '#ffffff',
              boxShadow: '0 0 30px rgba(239,68,68,0.3)',
            }}
          >
            + 关注
          </div>
        </div>

        {/* Next episode teaser */}
        <div
          style={{
            opacity: subtitleOpacity,
            transform: `translateY(${interpolate(subtitleOpacity, [0, 1], [20, 0])}px)`,
            background: 'rgba(59,130,246,0.1)',
            borderRadius: 16,
            padding: '24px 32px',
            borderWidth: 1,
            borderColor: 'rgba(59,130,246,0.3)',
            borderStyle: 'solid',
            textAlign: 'center',
            maxWidth: 800,
          }}
        >
          <div style={{ fontSize: 24, color: '#3b82f6', fontWeight: 600, marginBottom: 8 }}>
            下期预告
          </div>
          <div style={{ fontSize: 30, fontWeight: 700, color: '#e2e8f0', lineHeight: 1.5 }}>
            用子Agent搭自动化代码审查流水线
          </div>
        </div>
      </div>

      {subtitleSegments && (
        <ProgressiveSubtitle segments={subtitleSegments} videoOffset={videoOffset ?? 0} />
      )}
    </AbsoluteFill>
  )
}
