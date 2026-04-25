import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion'
import React from 'react'
import { Subtitle } from '../../../components/Subtitle'

interface ShotProps {
  subtitle?: string
}

export const Shot6: React.FC<ShotProps> = ({ subtitle }) => {
  const frame = useCurrentFrame()

  const browseData = [
    { name: 'Gemini 3.1 Pro', score: 85.9, isWinner: true },
    { name: 'GPT-5.5', score: 84.4, isWinner: false }
  ]

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
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
          fontSize: '48px',
          fontWeight: 800,
          color: '#fff',
          textAlign: 'center'
        }}>
          BrowseComp 网页浏览测试
        </div>

        {/* Comparison */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '60px'
        }}>
          {browseData.map((item, index) => {
            const delay = index * 15
            const progress = interpolate(
              frame,
              [delay, delay + 25],
              [0, 1],
              { extrapolateRight: 'clamp' }
            )
            const scale = interpolate(progress, [0, 1], [0.8, 1])

            return (
              <div
                key={index}
                style={{
                  width: '320px',
                  padding: '48px 32px',
                  background: item.isWinner
                    ? 'rgba(234, 179, 8, 0.15)'
                    : 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '28px',
                  border: `3px solid ${item.isWinner ? 'rgba(234, 179, 8, 0.5)' : 'rgba(255, 255, 255, 0.1)'}`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '20px',
                  transform: `scale(${scale})`,
                  position: 'relative'
                }}
              >
                {/* Winner Badge */}
                {item.isWinner && progress > 0.5 && (
                  <div style={{
                    position: 'absolute',
                    top: '-20px',
                    padding: '8px 24px',
                    background: 'rgba(234, 179, 8, 0.9)',
                    borderRadius: '20px',
                    fontSize: '20px',
                    fontWeight: 700,
                    color: '#1f2937'
                  }}>
                    反超！
                  </div>
                )}

                {/* Score */}
                <div style={{
                  fontSize: '80px',
                  fontWeight: 900,
                  color: item.isWinner ? '#fbbf24' : '#9ca3af'
                }}>
                  {item.score}%
                </div>

                {/* Name */}
                <div style={{
                  fontSize: '28px',
                  fontWeight: 600,
                  color: '#e5e7eb',
                  textAlign: 'center'
                }}>
                  {item.name}
                </div>
              </div>
            )
          })}
        </div>

        {/* Alert Message */}
        <div style={{
          padding: '32px 48px',
          background: 'rgba(251, 191, 36, 0.15)',
          borderRadius: '20px',
          border: '2px solid rgba(251, 191, 36, 0.3)',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '32px',
            fontWeight: 700,
            color: '#fde68a',
            marginBottom: '8px'
          }}>
            GPT-5.5 并非无敌
          </div>
          <div style={{
            fontSize: '24px',
            color: '#fef3c7'
          }}>
            选 AI 工具，别只看综合分
          </div>
        </div>
      </div>

      {subtitle && <Subtitle text={subtitle} />}
    </AbsoluteFill>
  )
}
