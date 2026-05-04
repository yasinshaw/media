import React from 'react'
import { useCurrentFrame, interpolate, spring } from 'remotion'
import { CenteredStack } from '../../../components'

interface ShotProps {
  subtitleSegments?: Array<{ text: string; start: number; end: number; duration: number }>
  videoOffset?: number
}

export const Shot1: React.FC<ShotProps> = ({ subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()

  const titleScale = spring({
    frame,
    fps: 30,
    config: { damping: 10, stiffness: 100 },
  })

  const subtitleFade = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <CenteredStack
      background="linear-gradient(135deg, #0f172a, #1e293b)"
      gap={40}
      subtitleSegments={subtitleSegments}
      videoOffset={videoOffset}
    >
      <h1
        style={{
          fontSize: 80,
          fontWeight: 900,
          color: '#fff',
          textAlign: 'center',
          transform: `scale(${titleScale})`,
          opacity: titleScale,
          textShadow: '0 0 40px rgba(59, 130, 246, 0.5)',
        }}
      >
        Agent Teams
      </h1>
      <p
        style={{
          fontSize: 36,
          color: '#94a3b8',
          textAlign: 'center',
          opacity: subtitleFade,
        }}
      >
        一个 AI 搞不定？用一群！
      </p>
    </CenteredStack>
  )
}
