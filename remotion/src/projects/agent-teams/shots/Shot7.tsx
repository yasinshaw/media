import React from 'react'
import { useCurrentFrame, interpolate, spring } from 'remotion'
import { CenteredStack } from '../../../components'
import { CTA } from '../../../components'

interface ShotProps {
  subtitleSegments?: Array<{ text: string; start: number; end: number; duration: number }>
  videoOffset?: number
}

export const Shot7: React.FC<ShotProps> = ({ subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()

  const titleFade = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' })
  const ctaFade = interpolate(frame, [40, 60], [0, 1], { extrapolateRight: 'clamp' })

  const titleScale = spring({
    frame,
    fps: 30,
    config: { damping: 12, stiffness: 80 },
  })

  return (
    <CenteredStack
      background="linear-gradient(135deg, #1e1b4b, #4c1d95)"
      gap={40}
      justify="center"
      subtitleSegments={subtitleSegments}
      videoOffset={videoOffset}
    >
      <h1
        style={{
          fontSize: 64,
          fontWeight: 900,
          color: '#fff',
          textAlign: 'center',
          transform: `scale(${titleScale})`,
          opacity: titleFade,
          textShadow: '0 0 40px rgba(139, 92, 246, 0.5)',
        }}
      >
        Agent Teams
      </h1>
      <p
        style={{
          fontSize: 40,
          color: '#c4b5fd',
          textAlign: 'center',
          opacity: titleFade,
        }}
      >
        = AI 编程的未来
      </p>
      <div style={{ opacity: ctaFade }}>
        <CTA />
      </div>
    </CenteredStack>
  )
}
