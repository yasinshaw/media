import { AbsoluteFill, useCurrentFrame, spring, interpolate } from 'remotion'
import React from 'react'
import { Subtitle } from '../../../components/Subtitle'

interface ShotProps {
  subtitle?: string
}

export const Shot7: React.FC<ShotProps> = ({ subtitle }) => {
  const frame = useCurrentFrame()

  const actions = [
    { label: '关注', icon: '➕', color: '#ef4444' },
    { label: '点赞', icon: '❤️', color: '#f472b6' },
    { label: '收藏', icon: '⭐', color: '#fbbf24' },
  ]

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '120px 40px 200px',
      }}
    >
      <div
        style={{
          fontSize: '34px',
          fontWeight: 'bold',
          color: 'white',
          textAlign: 'center',
          marginBottom: '14px',
          opacity: Math.min(1, frame / 15),
        }}
      >
        想了解 GPT-5.5 怎么用最有效？
      </div>

      <div
        style={{
          fontSize: '22px',
          color: '#94a3b8',
          marginBottom: '45px',
          opacity: Math.min(1, Math.max(0, (frame - 10) / 15)),
        }}
      >
        关注我，下期出实战教程
      </div>

      <div style={{ display: 'flex', gap: '22px' }}>
        {actions.map((action, i) => {
          const delay = 20 + i * 16
          const scale = spring({
            frame: frame - delay,
            fps: 30,
            config: { damping: 8, stiffness: 100 },
          })
          const opacity = interpolate(frame - delay, [0, 15], [0, 1], {
            extrapolateRight: 'clamp',
          })

          const pulse = interpolate(frame - delay - 40, [0, 15, 30], [1, 1.1, 1], {
            extrapolateRight: 'clamp',
          })

          const r = parseInt(action.color.slice(1, 3), 16)
          const g = parseInt(action.color.slice(3, 5), 16)
          const b = parseInt(action.color.slice(5, 7), 16)

          return (
            <div
              key={i}
              style={{
                background: `rgba(${r}, ${g}, ${b}, 0.15)`,
                border: `2px solid ${action.color}`,
                borderRadius: '18px',
                padding: '20px 28px',
                transform: `scale(${scale * (pulse || 1)})`,
                opacity,
                textAlign: 'center',
                minWidth: '100px',
              }}
            >
              <div style={{ fontSize: '34px', marginBottom: '6px' }}>
                {action.icon}
              </div>
              <div
                style={{
                  fontSize: '20px',
                  color: action.color,
                  fontWeight: 'bold',
                }}
              >
                {action.label}
              </div>
            </div>
          )
        })}
      </div>

      <div
        style={{
          fontSize: '30px',
          color: '#60a5fa',
          fontWeight: 'bold',
          marginTop: '40px',
          opacity: interpolate(frame - 100, [0, 20], [0, 1], {
            extrapolateRight: 'clamp',
          }),
        }}
      >
        我们下期见 👋
      </div>

      {subtitle && <Subtitle text={subtitle} />}
    </AbsoluteFill>
  )
}
