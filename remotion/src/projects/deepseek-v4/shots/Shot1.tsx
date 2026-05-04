import React from 'react'
import { useCurrentFrame } from 'remotion'
import { CenteredStack, useScaleIn, useFadeIn, FloatingOrbs } from '../../../components'

interface SubtitleSegment { text: string; start: number; end: number; duration: number }
interface Shot1Props { subtitleSegments?: SubtitleSegment[]; videoOffset?: number }

export const Shot1: React.FC<Shot1Props> = ({ subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()
  const titleEntry = useScaleIn(frame, { damping: 12, stiffness: 80 })
  const subtitleEntry = useFadeIn(frame, 30, 15)

  return (
    <CenteredStack
      background="linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
      justify="center"
      subtitleSegments={subtitleSegments}
      videoOffset={videoOffset}
      backgroundLayer={<FloatingOrbs colors={['#f59e0b30', '#fbbf2420']} count={3} />}
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
          ...titleEntry.style,
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
          textAlign: 'center',
          letterSpacing: 2,
          ...subtitleEntry.style,
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
          transform: `translate(-50%, -50%) translateY(${Math.sin(frame * 0.03) * 10}px)`,
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
          transform: `translate(-50%, -50%) translateY(${Math.sin(frame * 0.02) * 15}px)`,
          pointerEvents: 'none',
        }}
      />
    </CenteredStack>
  )
}
