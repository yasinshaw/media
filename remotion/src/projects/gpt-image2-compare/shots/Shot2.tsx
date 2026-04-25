import { AbsoluteFill, useCurrentFrame, interpolate, spring } from 'remotion'
import React from 'react'

export const Shot2: React.FC = () => {
  const frame = useCurrentFrame()

  const examples = [
    { text: '海报 "SALE" → "5AL∑"', model: 'Midjourney' },
    { text: '招牌 "OPEN" → "OP3N"', model: 'FLUX' },
    { text: 'UI "设置" → "5ett1ng5"', model: 'DALL-E' },
  ]

  return (
    <AbsoluteFill style={{
      background: '#1a1a1a',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '120px 40px 200px'  // Safe areas: top 120px, bottom 200px
    }}>
      {/* Main heading - vertically centered */}
      <div style={{
        fontSize: '52px',
        fontWeight: 'bold',
        color: '#ef4444',
        textAlign: 'center',
        marginBottom: '50px'
      }}>
        ❌ AI 生图最大痛点
      </div>

      {/* Examples stacked vertically for vertical format */}
      <div style={{ width: '100%', maxWidth: '700px', gap: '20px' }}>
        {examples.map((ex, i) => {
          const delay = i * 12
          const scale = spring({
            frame: frame - delay,
            fps: 30,
            config: { damping: 12, stiffness: 80 }
          })
          const opacity = interpolate(
            frame - delay,
            [0, 15],
            [0, 1],
            { extrapolateRight: 'clamp' }
          )

          return (
            <div key={i} style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '2px solid #ef4444',
              borderRadius: '16px',
              padding: '20px 28px',
              transform: `scale(${scale})`,
              opacity,
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <div style={{
                fontSize: '18px',
                color: '#fca5a5',
                fontWeight: 'bold'
              }}>
                {ex.model}
              </div>
              <div style={{
                fontSize: '26px',
                fontWeight: 'bold',
                color: 'white',
                fontFamily: 'monospace'
              }}>
                {ex.text}
              </div>
            </div>
          )
        })}
      </div>

      {/* Conclusion */}
      <div style={{
        marginTop: '40px',
        fontSize: '42px',
        color: '#fbbf24',
        fontWeight: 'bold',
        textAlign: 'center'
      }}>
        = 文字乱码
      </div>
    </AbsoluteFill>
  )
}
