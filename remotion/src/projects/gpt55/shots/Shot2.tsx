import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion'
import React from 'react'
import { Subtitle } from '../../../components/Subtitle'

interface ShotProps {
  subtitle?: string
}

export const Shot2: React.FC<ShotProps> = ({ subtitle }) => {
  const frame = useCurrentFrame()
  const progress = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' })

  const improvements = [
    { label: '推理能力', value: '+8%' },
    { label: '代码能力', value: '+9%' },
    { label: '计算机操作', value: '+5%' }
  ]

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '120px 40px 200px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '900px',
        display: 'flex',
        flexDirection: 'column',
        gap: '40px'
      }}>
        {/* Title */}
        <div style={{
          fontSize: '56px',
          fontWeight: 800,
          color: '#fff',
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          GPT-5.4 vs GPT-5.5
        </div>

        {/* Comparison Cards */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '32px'
        }}>
          {improvements.map((item, index) => {
            const delay = index * 10
            const itemProgress = interpolate(
              frame,
              [delay, delay + 20],
              [0, 1],
              { extrapolateRight: 'clamp' }
            )
            const offsetX = interpolate(itemProgress, [0, 1], [-50, 0])
            const opacity = interpolate(itemProgress, [0, 1], [0, 1])

            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '32px 40px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '24px',
                  border: '2px solid rgba(255, 255, 255, 0.1)',
                  transform: `translateX(${offsetX}px)`,
                  opacity
                }}
              >
                <div style={{
                  fontSize: '36px',
                  fontWeight: 600,
                  color: '#e2e8f0'
                }}>
                  {item.label}
                </div>
                <div style={{
                  fontSize: '48px',
                  fontWeight: 900,
                  color: '#10b981',
                  textShadow: '0 0 30px rgba(16, 185, 129, 0.5)'
                }}>
                  {item.value}
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom Alert */}
        <div style={{
          marginTop: '20px',
          padding: '24px 48px',
          background: 'rgba(239, 68, 68, 0.15)',
          borderRadius: '16px',
          border: '2px solid rgba(239, 68, 68, 0.3)',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '32px',
            fontWeight: 700,
            color: '#fca5a5'
          }}>
            差距已经拉开了
          </div>
        </div>
      </div>

      {subtitle && <Subtitle text={subtitle} />}
    </AbsoluteFill>
  )
}
