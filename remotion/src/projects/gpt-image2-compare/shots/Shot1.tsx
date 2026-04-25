import { AbsoluteFill, useCurrentFrame, spring } from 'remotion'
import React from 'react'

export const Shot1: React.FC = () => {
  const frame = useCurrentFrame()

  const scale = spring({
    frame,
    fps: 30,
    config: { damping: 12, stiffness: 100 }
  })

  const opacity = spring({
    frame,
    fps: 30,
    config: { damping: 10, stiffness: 80 }
  })

  return (
    <AbsoluteFill style={{
      background: '#0a0a0a',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '60px 40px'
    }}>
      {/* Header */}
      <div style={{
        fontSize: '48px',
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: '40px',
        opacity: Math.min(1, frame / 15)
      }}>
        LM Arena 神秘事件
      </div>

      {/* Date badge */}
      <div style={{
        background: 'rgba(59, 130, 246, 0.2)',
        border: '2px solid #3b82f6',
        borderRadius: '16px',
        padding: '16px 32px',
        marginBottom: '30px',
        transform: `scale(${scale})`,
        opacity
      }}>
        <div style={{ fontSize: '36px', color: '#60a5fa', fontWeight: 'bold' }}>
          📅 2026年4月4日
        </div>
      </div>

      {/* Event cards stacked vertically for better vertical layout */}
      <div style={{ width: '100%', maxWidth: '600px', gap: '20px' }}>
        {[
          { emoji: '🚀', text: '三个匿名模型突然出现', color: '#3b82f6' },
          { emoji: '⏱️', text: '几小时后神秘消失', color: '#ef4444' },
          { emoji: '🔥', text: '社区确认：GPT-Image-2', color: '#22c55e' }
        ].map((item, i) => {
          const delay = i * 10
          const itemScale = spring({
            frame: frame - delay,
            fps: 30,
            config: { damping: 12, stiffness: 100 }
          })
          const itemOpacity = spring({
            frame: frame - delay,
            fps: 30,
            config: { damping: 10, stiffness: 80 }
          })

          return (
            <div key={i} style={{
              background: `rgba(${parseInt(item.color.slice(1, 3), 16)}, ${parseInt(item.color.slice(3, 5), 16)}, ${parseInt(item.color.slice(5, 7), 16)}, 0.15)`,
              border: `2px solid ${item.color}`,
              borderRadius: '16px',
              padding: '24px 32px',
              transform: `scale(${itemScale})`,
              opacity: itemOpacity,
              display: 'flex',
              alignItems: 'center',
              gap: '20px'
            }}>
              <span style={{ fontSize: '40px' }}>{item.emoji}</span>
              <span style={{ fontSize: '28px', color: 'white', fontWeight: 'bold' }}>
                {item.text}
              </span>
            </div>
          )
        })}
      </div>
    </AbsoluteFill>
  )
}
