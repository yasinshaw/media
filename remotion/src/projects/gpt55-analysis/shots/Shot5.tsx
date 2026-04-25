import { AbsoluteFill, useCurrentFrame, spring, interpolate } from 'remotion'
import React from 'react'
import { Subtitle } from '../../../components/Subtitle'

interface ShotProps {
  subtitle?: string
}

export const Shot5: React.FC<ShotProps> = ({ subtitle }) => {
  const frame = useCurrentFrame()

  const stats = [
    { label: '速度和 5.4 一样快', icon: '⚡', color: '#fbbf24' },
    { label: 'Token 效率更高', icon: '💰', color: '#22c55e' },
    { label: '性价比拉满', icon: '📈', color: '#60a5fa' },
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
          fontSize: '42px',
          fontWeight: 'bold',
          color: '#60a5fa',
          textAlign: 'center',
          marginBottom: '40px',
          opacity: Math.min(1, frame / 15),
        }}
      >
        更省 Token
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          width: '100%',
          maxWidth: '500px',
        }}
      >
        {stats.map((stat, i) => {
          const delay = 25 + i * 30
          const scale = spring({
            frame: frame - delay,
            fps: 30,
            config: { damping: 10, stiffness: 100 },
          })
          const opacity = interpolate(frame - delay, [0, 15], [0, 1], {
            extrapolateRight: 'clamp',
          })

          const r = parseInt(stat.color.slice(1, 3), 16)
          const g = parseInt(stat.color.slice(3, 5), 16)
          const b = parseInt(stat.color.slice(5, 7), 16)

          return (
            <div
              key={i}
              style={{
                background: `rgba(${r}, ${g}, ${b}, 0.15)`,
                border: `2px solid ${stat.color}`,
                borderRadius: '16px',
                padding: '22px 32px',
                transform: `scale(${scale})`,
                opacity,
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                width: '100%',
              }}
            >
              <span style={{ fontSize: '40px' }}>{stat.icon}</span>
              <span
                style={{
                  fontSize: '28px',
                  color: 'white',
                  fontWeight: 'bold',
                }}
              >
                {stat.label}
              </span>
            </div>
          )
        })}
      </div>

      {subtitle && <Subtitle text={subtitle} />}
    </AbsoluteFill>
  )
}
