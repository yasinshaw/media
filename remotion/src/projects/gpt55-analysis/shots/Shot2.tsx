import { AbsoluteFill, useCurrentFrame, spring, interpolate } from 'remotion'
import React from 'react'
import { Subtitle } from '../../../components/Subtitle'

interface ShotProps {
  subtitle?: string
}

export const Shot2: React.FC<ShotProps> = ({ subtitle }) => {
  const frame = useCurrentFrame()

  const improvements = [
    { label: '推理能力', value: '+8%', color: '#3b82f6', icon: '🧠' },
    { label: '代码能力', value: '+9%', color: '#22c55e', icon: '💻' },
    { label: '计算机操作', value: '+5%', color: '#a78bfa', icon: '🖥️' },
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
          fontSize: '40px',
          fontWeight: 'bold',
          color: 'white',
          textAlign: 'center',
          marginBottom: '16px',
          opacity: Math.min(1, frame / 15),
        }}
      >
        还在用 GPT-5.4？
      </div>

      <div
        style={{
          fontSize: '24px',
          color: '#94a3b8',
          marginBottom: '40px',
          opacity: Math.min(1, Math.max(0, (frame - 10) / 15)),
        }}
      >
        差距已经拉开了
      </div>

      {improvements.map((item, i) => {
        const delay = 20 + i * 25
        const scale = spring({
          frame: frame - delay,
          fps: 30,
          config: { damping: 10, stiffness: 100 },
        })
        const opacity = interpolate(frame - delay, [0, 15], [0, 1], {
          extrapolateRight: 'clamp',
        })

        const r = parseInt(item.color.slice(1, 3), 16)
        const g = parseInt(item.color.slice(3, 5), 16)
        const b = parseInt(item.color.slice(5, 7), 16)

        return (
          <div
            key={i}
            style={{
              background: `rgba(${r}, ${g}, ${b}, 0.1)`,
              border: `2px solid ${item.color}`,
              borderRadius: '16px',
              padding: '24px 40px',
              width: '100%',
              maxWidth: '500px',
              transform: `scale(${scale})`,
              opacity,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '36px' }}>{item.icon}</span>
              <span
                style={{ fontSize: '28px', color: 'white', fontWeight: 'bold' }}
              >
                {item.label}
              </span>
            </div>
            <span
              style={{
                fontSize: '36px',
                fontWeight: '900',
                color: item.color,
              }}
            >
              {item.value}
            </span>
          </div>
        )
      })}

      {subtitle && <Subtitle text={subtitle} />}
    </AbsoluteFill>
  )
}
