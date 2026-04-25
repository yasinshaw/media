import { AbsoluteFill, interpolate, useCurrentFrame, spring } from 'remotion'
import React from 'react'
import { Subtitle } from '../../../components/Subtitle'

interface ShotProps {
  subtitle?: string
}

export const Shot5: React.FC<ShotProps> = ({ subtitle }) => {
  const frame = useCurrentFrame()

  const efficiencyData = [
    { label: 'GPT-5.5', value: 100, color: '#22c55e' },
    { label: 'GPT-5.4', value: 70, color: '#64748b' }
  ]

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(180deg, #14532d 0%, #166534 100%)',
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
        gap: '48px'
      }}>
        {/* Title */}
        <div style={{
          fontSize: '52px',
          fontWeight: 800,
          color: '#fff',
          textAlign: 'center',
          marginBottom: '10px'
        }}>
          Token 效率对比
        </div>

        {/* Bar Chart */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          gap: '80px',
          height: '400px',
          padding: '40px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '32px',
          border: '2px solid rgba(255, 255, 255, 0.1)'
        }}>
          {efficiencyData.map((item, index) => {
            const barHeight = spring({
              frame: frame - index * 10,
              fps: 30,
              config: { damping: 12, stiffness: 80 }
            })
            const clampedHeight = Math.min(1, Math.max(0, barHeight)) * item.value * 3

            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '24px'
                }}
              >
                {/* Bar */}
                <div style={{
                  width: '160px',
                  height: `${clampedHeight}px`,
                  background: `linear-gradient(180deg, ${item.color} 0%, ${item.color}dd 100%)`,
                  borderRadius: '16px',
                  position: 'relative',
                  boxShadow: `0 0 40px ${item.color}40`
                }}>
                  {/* Value Label */}
                  {clampedHeight > 50 && (
                    <div style={{
                      position: 'absolute',
                      top: '20px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontSize: '32px',
                      fontWeight: 800,
                      color: '#fff'
                    }}>
                      {item.value}%
                    </div>
                  )}
                </div>

                {/* Label */}
                <div style={{
                  fontSize: '32px',
                  fontWeight: 700,
                  color: '#fff'
                }}>
                  {item.label}
                </div>
              </div>
            )
          })}
        </div>

        {/* Highlight */}
        <div style={{
          padding: '28px 48px',
          background: 'rgba(34, 197, 94, 0.2)',
          borderRadius: '20px',
          border: '2px solid rgba(34, 197, 94, 0.4)',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '36px',
            fontWeight: 800,
            color: '#86efac',
            marginBottom: '8px'
          }}>
            性价比拉满
          </div>
          <div style={{
            fontSize: '24px',
            color: '#bbf7d0'
          }}>
            完成任务更省 Token
          </div>
        </div>
      </div>

      {subtitle && <Subtitle text={subtitle} />}
    </AbsoluteFill>
  )
}
