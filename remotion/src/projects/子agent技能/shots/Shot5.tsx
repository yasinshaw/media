import { AbsoluteFill, useCurrentFrame, interpolate, spring } from 'remotion'
import React from 'react'
import { ProgressiveSubtitle } from '../../../components/ProgressiveSubtitle'

interface Shot5Props {
  subtitleSegments?: Array<{ text: string; start: number; end: number; duration: number }>
  videoOffset?: number
}

const MODELS = [
  { name: 'Opus', desc: '深度思考', color: '#8b5cf6', cost: 95, icon: '🧠' },
  { name: 'Sonnet', desc: '快速响应', color: '#3b82f6', cost: 55, icon: '⚡' },
  { name: 'Haiku', desc: '省成本', color: '#10b981', cost: 20, icon: '💨' },
]

export const Shot5: React.FC<Shot5Props> = ({ subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()

  const barProgress = interpolate(frame, [60, 120], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(180deg, #0f172a 0%, #1a0a2e 100%)',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '120px 40px 200px',
      }}
    >
      <div style={{ width: '100%', maxWidth: '900px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* Model cards */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          {MODELS.map((model, i) => {
            const cardSpring = spring({
              frame: frame - i * 12,
              fps: 30,
              config: { damping: 14, stiffness: 120 },
            })
            return (
              <div
                key={i}
                style={{
                  opacity: cardSpring,
                  transform: `translateY(${interpolate(cardSpring, [0, 1], [40, 0])}px)`,
                  background: `${model.color}15`,
                  borderRadius: 20,
                  padding: '28px 20px',
                  borderWidth: 2,
                  borderColor: model.color,
                  borderStyle: 'solid',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px',
                  flex: 1,
                  maxWidth: 260,
                }}
              >
                <div style={{ fontSize: 48 }}>{model.icon}</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: model.color }}>{model.name}</div>
                <div style={{ fontSize: 22, fontWeight: 600, color: '#94a3b8' }}>{model.desc}</div>
              </div>
            )
          })}
        </div>

        {/* Cost comparison bars */}
        <div
          style={{
            opacity: interpolate(frame, [40, 55], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            background: 'rgba(30,41,59,0.6)',
            borderRadius: 16,
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div style={{ fontSize: 24, fontWeight: 700, color: '#94a3b8', marginBottom: 8 }}>
            成本对比
          </div>
          {MODELS.map((model, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {/* Use same flex ratio as cards above for alignment */}
              <div style={{ flex: 1, fontSize: 22, fontWeight: 600, color: model.color, textAlign: 'center' }}>
                {model.name}
              </div>
              <div style={{ flex: 2, height: 36, background: '#1e293b', borderRadius: 8, overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${model.cost * barProgress}%`,
                    background: `linear-gradient(90deg, ${model.color}, ${model.color}88)`,
                    borderRadius: 8,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Label */}
        <div
          style={{
            opacity: interpolate(frame, [100, 115], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            textAlign: 'center',
            fontSize: 40,
            fontWeight: 800,
            color: '#facc15',
            textShadow: '0 0 20px rgba(250,204,21,0.4)',
          }}
        >
          按需选模型
        </div>
      </div>

      {subtitleSegments && (
        <ProgressiveSubtitle segments={subtitleSegments} videoOffset={videoOffset ?? 0} />
      )}
    </AbsoluteFill>
  )
}
