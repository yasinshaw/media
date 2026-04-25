import { useCurrentFrame, interpolate, spring } from 'remotion'
import React from 'react'
import { SafeArea } from './SafeArea'

interface CTAProps {
  text?: string
  children?: React.ReactNode
}

export const CTA: React.FC<CTAProps> = ({ text = '关注我们', children }) => {
  const frame = useCurrentFrame()
  const scale = spring({
    frame,
    fps: 30,
    config: {
      damping: 10,
      stiffness: 100,
    },
  })

  const arrowOffset = interpolate(
    Math.sin(frame * 0.1),
    [-1, 1],
    [-15, 15]
  )

  return (
    <SafeArea style={{
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 50,
    }}>
      {/* Arrow - larger for vertical */}
      <div style={{
        fontSize: 100,     // Was 80
        transform: `translateX(${arrowOffset}px)`,
        color: '#667eea',
      }}>
        ➤
      </div>

      {/* Button - larger for mobile */}
      <div style={{
        padding: '28px 80px',   // Was 20px 60px
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: 60,        // Was 50
        transform: `scale(${scale})`,
        boxShadow: '0 25px 70px rgba(102, 126, 234, 0.5)',
      }}>
        <span style={{
          color: 'white',
          fontSize: 48,          // Was 32
          fontWeight: 'bold',
          letterSpacing: 3,
        }}>{text}</span>
      </div>

      {/* Pulse ring - larger */}
      <div style={{
        position: 'absolute',
        width: 400,              // Was 300
        height: 400,
        borderRadius: '50%',
        border: '5px solid rgba(102, 126, 234, 0.3)',  // Was 4px
        transform: `scale(${1 + (frame % 60) / 120})`,
        opacity: 1 - (frame % 60) / 60,
      }} />

      {children}
    </SafeArea>
  )
}
