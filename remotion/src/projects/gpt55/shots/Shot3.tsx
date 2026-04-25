import { AbsoluteFill, interpolate, useCurrentFrame, spring } from 'remotion'
import React from 'react'
import { Subtitle } from '../../../components/Subtitle'

interface ShotProps {
  subtitle?: string
}

export const Shot3: React.FC<ShotProps> = ({ subtitle }) => {
  const frame = useCurrentFrame()

  const benchmarks = [
    { label: '编码测试', gpt55: 82.7, claude: 69.4 },
    { label: '数学推理', gpt55: 51.7, claude: null },
    { label: '高难数学', gpt55: 35.4, claude: null },
    { label: '网络安全', gpt55: 81.8, claude: 73.1 }
  ]

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
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
        gap: '32px'
      }}>
        {/* Title */}
        <div style={{
          fontSize: '48px',
          fontWeight: 800,
          color: '#fff',
          textAlign: 'center',
          marginBottom: '10px'
        }}>
          硬核数据对比
        </div>

        {/* Benchmark Bars */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '28px'
        }}>
          {benchmarks.map((item, index) => {
            const delay = index * 8
            const barProgress = spring({
              frame: frame - delay,
              fps: 30,
              config: { damping: 15, stiffness: 80 }
            })
            const clampedProgress = Math.min(1, Math.max(0, barProgress))

            return (
              <div key={index} style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{
                    fontSize: '28px',
                    fontWeight: 600,
                    color: '#cbd5e1'
                  }}>
                    {item.label}
                  </div>
                  {item.claude && (
                    <div style={{
                      fontSize: '24px',
                      color: '#94a3b8'
                    }}>
                      Claude: {item.claude}%
                    </div>
                  )}
                </div>

                {/* Bar Container */}
                <div style={{
                  width: '100%',
                  height: '48px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  {/* GPT-5.5 Bar */}
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    height: '100%',
                    width: `${item.gpt55 * clampedProgress}%`,
                    background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)',
                    borderRadius: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    paddingRight: '16px'
                  }}>
                    {clampedProgress > 0.8 && (
                      <div style={{
                        fontSize: '24px',
                        fontWeight: 700,
                        color: '#fff'
                      }}>
                        {item.gpt55}%
                      </div>
                    )}
                  </div>

                  {/* Claude Bar (if exists) */}
                  {item.claude && (
                    <div style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      height: '100%',
                      width: `${item.claude * clampedProgress}%`,
                      background: 'rgba(148, 163, 184, 0.3)',
                      borderRadius: '24px',
                      zIndex: 1
                    }} />
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Highlight */}
        <div style={{
          marginTop: '20px',
          padding: '20px 40px',
          background: 'rgba(59, 130, 246, 0.15)',
          borderRadius: '16px',
          border: '2px solid rgba(59, 130, 246, 0.3)',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '28px',
            fontWeight: 600,
            color: '#93c5fd'
          }}>
            编码测试遥遥领先
          </div>
        </div>
      </div>

      {subtitle && <Subtitle text={subtitle} />}
    </AbsoluteFill>
  )
}
