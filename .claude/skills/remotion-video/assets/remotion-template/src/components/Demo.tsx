import { useCurrentFrame, interpolate } from 'remotion'
import React from 'react'
import { SafeArea } from './SafeArea'

export const Demo: React.FC = () => {
  const frame = useCurrentFrame()
  const scale = interpolate(frame % 60, [0, 30, 60], [1, 1.1, 1], { extrapolateRight: 'clamp' })
  const rotation = interpolate(frame, [0, 300], [0, 360])

  return (
    <SafeArea style={{
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        width: 400,     // Larger for vertical (was 200)
        height: 400,
        transform: `scale(${scale}) rotate(${rotation}deg)`,
        borderRadius: 28,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 30px 80px rgba(102, 126, 234, 0.5)',
      }}>
        <div style={{ color: 'white', fontSize: 64, fontWeight: 'bold' }}>DEMO</div>
      </div>
    </SafeArea>
  )
}
