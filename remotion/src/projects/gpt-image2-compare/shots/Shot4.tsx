import { AbsoluteFill, useCurrentFrame, interpolate, spring } from 'remotion'
import React from 'react'

export const Shot4: React.FC = () => {
  const frame = useCurrentFrame()

  const competitors = [
    { name: 'Midjourney', strength: '艺术感', weakness: '文字弱', color: '#8b5cf6', icon: '🎨' },
    { name: 'FLUX', strength: '灵活', weakness: '需调参', color: '#f59e0b', icon: '⚙️' },
    { name: 'Nano Banana', strength: '信息图', weakness: '单一场景', color: '#3b82f6', icon: '📊' },
  ]

  const gptImage2 = {
    name: 'GPT-Image-2',
    strengths: ['文字', '世界知识', '指令跟随'],
    color: '#22c55e',
    icon: '🚀'
  }

  // Animate competitors appearing first
  const showGptImage2 = frame > 60

  const gptScale = spring({
    frame: frame - 60,
    fps: 30,
    config: { damping: 10, stiffness: 80 }
  })

  return (
    <AbsoluteFill style={{
      background: '#0f172a',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '120px 40px 200px'  // Safe areas
    }}>
      <div style={{
        fontSize: '40px',
        fontWeight: 'bold',
        color: 'white',
        marginBottom: '30px'
      }}>
        竞品对比
      </div>

      {/* Competitors - stacked vertically */}
      <div style={{ width: '100%', maxWidth: '700px', gap: '16px', marginBottom: '30px' }}>
        {competitors.map((comp, i) => {
          const delay = i * 15
          const scale = spring({
            frame: frame - delay,
            fps: 30,
            config: { damping: 12, stiffness: 100 }
          })
          const opacity = interpolate(
            frame - delay,
            [0, 15],
            [0, 1],
            { extrapolateRight: 'clamp' }
          )

          return (
            <div key={comp.name} style={{
              background: `rgba(${parseInt(comp.color.slice(1, 3), 16)}, ${parseInt(comp.color.slice(3, 5), 16)}, ${parseInt(comp.color.slice(5, 7), 16)}, 0.15)`,
              border: `2px solid ${comp.color}`,
              borderRadius: '16px',
              padding: '20px 28px',
              transform: `scale(${scale})`,
              opacity,
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '36px' }}>{comp.icon}</span>
                <span style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: 'white'
                }}>
                  {comp.name}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '16px', fontSize: '16px' }}>
                <span style={{ color: '#4ade80' }}>✅ {comp.strength}</span>
                <span style={{ color: '#f87171' }}>❌ {comp.weakness}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* GPT-Image-2 - The Winner */}
      <div style={{
        background: 'rgba(34, 197, 94, 0.2)',
        border: '3px solid #22c55e',
        borderRadius: '20px',
        padding: '24px 32px',
        transform: `scale(${showGptImage2 ? gptScale : 0.8})`,
        opacity: showGptImage2 ? 1 : 0,
        transition: 'all 0.3s',
        textAlign: 'center',
        boxShadow: '0 0 30px rgba(34, 197, 94, 0.3)',
        width: '100%',
        maxWidth: '700px'
      }}>
        <div style={{ fontSize: '40px', marginBottom: '8px' }}>
          {gptImage2.icon}
        </div>
        <div style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#22c55e',
          marginBottom: '12px'
        }}>
          {gptImage2.name}
        </div>
        <div style={{ fontSize: '18px', color: 'white', marginBottom: '12px' }}>
          全能型选手
        </div>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          justifyContent: 'center'
        }}>
          {gptImage2.strengths.map((s, i) => (
            <span key={i} style={{
              background: 'rgba(34, 197, 94, 0.3)',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '16px',
              color: 'white'
            }}>
              {s}
            </span>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  )
}
