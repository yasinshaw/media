import React from 'react'
import { useCurrentFrame, spring, interpolate } from 'remotion'
import { CenteredStack } from '../../../components'

interface SubtitleSegment {
  text: string
  start: number
  end: number
  duration: number
}

interface Shot1Props {
  subtitleSegments?: SubtitleSegment[]
  videoOffset?: number
}

export const Shot1: React.FC<Shot1Props> = ({ subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()

  const scale = spring({
    frame,
    fps: 30,
    config: { damping: 12, stiffness: 80 },
  })

  const subtitleOpacity = interpolate(frame, [30, 60], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <CenteredStack
      background="linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
      justify="center"
      subtitleSegments={subtitleSegments}
      videoOffset={videoOffset}
    >
      <h1
        style={{
          fontSize: 96,
          fontWeight: 900,
          background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #f59e0b 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textAlign: 'center',
          transform: `scale(${scale})`,
          textShadow: '0 0 60px rgba(245, 158, 11, 0.5)',
          marginBottom: 24,
        }}
      >
        DeepSeek V4
      </h1>

      <div
        style={{
          fontSize: 42,
          fontWeight: 700,
          color: '#fbbf24',
          opacity: subtitleOpacity,
          textAlign: 'center',
          letterSpacing: 2,
        }}
      >
        1.6万亿参数
      </div>

      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 600,
          height: 600,
          borderRadius: '50%',
          border: '3px solid rgba(245, 158, 11, 0.3)',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 700,
          height: 700,
          borderRadius: '50%',
          border: '2px solid rgba(245, 158, 11, 0.15)',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }}
      />
    </CenteredStack>
  )
}
