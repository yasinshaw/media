import { AbsoluteFill } from 'remotion'
import React from 'react'

// Douyin vertical format overlay style
const overlayStyle = {
  color: 'white',
  fontSize: '64px',          // Larger for vertical screens
  fontWeight: '900',
  textAlign: 'center' as const,
  textShadow: '3px 3px 12px rgba(0, 0, 0, 0.9)',
  letterSpacing: '3px',
  maxWidth: '85%',
  margin: '0 auto',
}

interface OverlayProps {
  text: string
}

export const Overlay: React.FC<OverlayProps> = ({ text }) => {
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', pointerEvents: 'none' }}>
      <div style={overlayStyle}>{text}</div>
    </AbsoluteFill>
  )
}
