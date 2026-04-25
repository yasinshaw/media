import { AbsoluteFill, useCurrentFrame, spring, interpolate } from 'remotion'
import React from 'react'
import { Subtitle } from '../../../components/Subtitle'

interface ShotProps {
  subtitle?: string
}

export const Shot1: React.FC<ShotProps> = ({ subtitle }) => {
  const frame = useCurrentFrame()

  const titleScale = spring({
    frame,
    fps: 30,
    config: { damping: 12, stiffness: 100 },
  })

  const twistOpacity = interpolate(frame, [90, 110], [0, 1], {
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '120px 40px 200px',
      }}
    >
      <div
        style={{
          fontSize: '72px',
          fontWeight: '900',
          background: 'linear-gradient(90deg, #60a5fa, #a78bfa)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          transform: `scale(${titleScale})`,
          marginBottom: '30px',
        }}
      >
        GPT-5.5 来了！
      </div>

      <div
        style={{
          fontSize: '32px',
          color: '#22c55e',
          fontWeight: 'bold',
          opacity: Math.min(1, frame / 20),
          background: 'rgba(34, 197, 94, 0.15)',
          border: '2px solid #22c55e',
          borderRadius: '16px',
          padding: '16px 32px',
          marginBottom: '40px',
        }}
      >
        多项基准领先
      </div>

      <div
        style={{
          fontSize: '36px',
          color: '#fbbf24',
          fontWeight: 'bold',
          opacity: twistOpacity,
          textAlign: 'center',
        }}
      >
        但有一个项目，它输了...
      </div>

      {subtitle && <Subtitle text={subtitle} />}
    </AbsoluteFill>
  )
}
