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

export const Shot5: React.FC<ShotProps> = ({ subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()

  const bars = [
    { label: 'GPT-5.4', value: 70, color: '#94a3b8', startFrame: 0 },
    { label: 'GPT-5.5', value: 95, color: '#4ade80', startFrame: 30 }
  ]

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
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
        <div style={{
          fontSize: '48px',
          fontWeight: 800,
          color: '#ffffff',
          textAlign: 'center'
        }}>
          Token 效率对比
        </div>

        <div style={{
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '20px',
          padding: '40px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          {bars.map((bar, idx) => {
            const barProgress = interpolate(
              frame,
              [bar.startFrame, bar.startFrame + 45],
              [0, 1],
              { extrapolateRight: 'clamp' }
            )
            const width = bar.value * barProgress

            return (
              <div key={idx} style={{ marginBottom: idx < bars.length - 1 ? '32px' : '0' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '12px'
                }}>
                  <span style={{
                    fontSize: '32px',
                    color: '#ffffff',
                    fontWeight: 700
                  }}>{bar.label}</span>
                  <span style={{
                    fontSize: '36px',
                    color: bar.color,
                    fontWeight: 800
                  }}>{bar.value}%</span>
                </div>
                <div style={{
                  height: '56px',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${width}%`,
                    background: `linear-gradient(90deg, ${bar.color}88, ${bar.color})`,
                    borderRadius: '12px',
                    transition: 'width 0.3s',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    paddingRight: '16px'
                  }}>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div style={{
          fontSize: '40px',
          color: '#4ade80',
          fontWeight: 800,
          textAlign: 'center',
          opacity: interpolate(frame, [90, 120], [0, 1], { extrapolateRight: 'clamp' })
        }}>
          性价比拉满
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
