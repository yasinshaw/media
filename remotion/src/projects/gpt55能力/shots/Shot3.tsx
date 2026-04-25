import React from 'react'
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion'
import { ProgressiveSubtitle } from '../../../components'

interface SubtitleSegment {
  text: string
  start: number
  end: number
  duration: number
}

interface ShotProps {
  subtitleSegments?: SubtitleSegment[]
  videoOffset?: number
}

export const Shot3: React.FC<ShotProps> = ({ subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()

  const bars = [
    { label: '编码测试', gpt: 82.7, claude: 69.4, startFrame: 0 },
    { label: '数学推理', gpt: 51.7, claude: 40, startFrame: 30 },
    { label: '高难数学', gpt: 35.4, claude: 28, startFrame: 60 },
    { label: '网络安全', gpt: 81.8, claude: 73.1, startFrame: 90 }
  ]

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
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
        <div style={{
          fontSize: '48px',
          fontWeight: 800,
          color: '#ffffff',
          textAlign: 'center'
        }}>
          硬核数据对比
        </div>

        <div style={{
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '20px',
          padding: '32px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          {bars.map((bar, idx) => {
            const barProgress = interpolate(
              frame,
              [bar.startFrame, bar.startFrame + 30],
              [0, 1],
              { extrapolateRight: 'clamp' }
            )
            return (
              <div key={idx} style={{ marginBottom: idx < bars.length - 1 ? '24px' : '0' }}>
                <div style={{
                  fontSize: '28px',
                  color: '#e0e0e0',
                  marginBottom: '12px',
                  fontWeight: 600
                }}>
                  {bar.label}
                </div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '24px',
                      color: '#60a5fa',
                      marginBottom: '4px'
                    }}>GPT-5.5</div>
                    <div style={{
                      height: '40px',
                      background: 'rgba(96, 165, 250, 0.3)',
                      borderRadius: '8px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${bar.gpt * barProgress}%`,
                        background: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
                        borderRadius: '8px',
                        transition: 'width 0.3s'
                      }} />
                    </div>
                    <div style={{
                      fontSize: '28px',
                      color: '#60a5fa',
                      fontWeight: 700,
                      marginTop: '4px'
                    }}>{bar.gpt}%</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '24px',
                      color: '#f97316',
                      marginBottom: '4px'
                    }}>Claude</div>
                    <div style={{
                      height: '40px',
                      background: 'rgba(249, 115, 22, 0.3)',
                      borderRadius: '8px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${bar.claude * barProgress}%`,
                        background: 'linear-gradient(90deg, #ea580c, #f97316)',
                        borderRadius: '8px'
                      }} />
                    </div>
                    <div style={{
                      fontSize: '28px',
                      color: '#f97316',
                      fontWeight: 700,
                      marginTop: '4px'
                    }}>{bar.claude}%</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {subtitleSegments && (
        <ProgressiveSubtitle
          segments={subtitleSegments}
          videoOffset={videoOffset || 0}
        />
      )}
    </AbsoluteFill>
  )
}
