import { AbsoluteFill, useCurrentFrame, interpolate, spring } from 'remotion'
import React from 'react'

export const Shot3: React.FC = () => {
  const frame = useCurrentFrame()

  const successExamples = [
    { label: '中文海报', text: '春节特惠 5折起', icon: '🎨' },
    { label: '产品标签', text: 'Ingredients: Water, Sugar', icon: '🏷️' },
    { label: 'UI截图', text: '设置 · 隐私 · 通用', icon: '📱' },
    { label: '手表时间', text: '14:35', icon: '⌚' },
  ]

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '24px'
    }}>
      <div style={{
        fontSize: '42px',
        fontWeight: 'bold',
        color: '#22c55e',
        textAlign: 'center',
        marginBottom: '20px'
      }}>
        ✅ GPT-Image-2 文字渲染
      </div>

      <div style={{
        fontSize: '72px',
        fontWeight: 'bold',
        background: 'linear-gradient(90deg, #22c55e, #10b981)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '10px'
      }}>
        准确率 &gt; 99%
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '16px',
        marginTop: '20px',
        padding: '0 40px'
      }}>
        {successExamples.map((ex, i) => {
          const delay = i * 15
          const scale = spring({
            frame: frame - delay,
            fps: 30,
            config: { damping: 10, stiffness: 100 }
          })
          const opacity = interpolate(
            frame - delay,
            [0, 15],
            [0, 1],
            { extrapolateRight: 'clamp' }
          )

          return (
            <div key={i} style={{
              background: 'rgba(34, 197, 94, 0.1)',
              border: '2px solid rgba(34, 197, 94, 0.3)',
              borderRadius: '16px',
              padding: '20px',
              transform: `scale(${scale})`,
              opacity,
              width: '100%'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                {ex.icon}
              </div>
              <div style={{
                fontSize: '16px',
                color: '#86efac',
                marginBottom: '8px'
              }}>
                {ex.label}
              </div>
              <div style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: 'white'
              }}>
                {ex.text}
              </div>
            </div>
          )
        })}
      </div>

      <div style={{
        marginTop: '20px',
        fontSize: '24px',
        color: '#94a3b8',
        fontStyle: 'italic'
      }}>
        十年难题，一朝解决
      </div>
    </AbsoluteFill>
  )
}
