import React from 'react'
import { useCurrentFrame, useVideoConfig, spring, interpolate, Easing, Img, staticFile } from 'remotion'
import { CenteredStack } from '../../../components'
import { SubtitleSegment } from '../composition'

interface Shot1Props {
  subtitleSegments?: SubtitleSegment[]
  videoOffset?: number
}

export const Shot1: React.FC<Shot1Props> = ({ subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const titleScale = spring({ frame, fps, config: { damping: 12, stiffness: 80 } })
  const subtitleOpacity = interpolate(frame, [15, 30], [0, 1], { extrapolateRight: 'clamp' })
  const dateOpacity = interpolate(frame, [25, 40], [0, 1], { extrapolateRight: 'clamp' })

  const glowScale = interpolate(frame, [0, 45], [0.6, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  })

  return (
    <>
      <Img
        src={staticFile('images/gpt-image2/shot1-bg.png')}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
        }}
      />
      {/* Radial glow behind title */}
      <div
        style={{
          position: 'absolute',
          top: '35%',
          left: '50%',
          width: 800,
          height: 800,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)',
          transform: `translate(-50%, -50%) scale(${glowScale})`,
          pointerEvents: 'none',
        }}
      />
      <CenteredStack
        justify="center"
        subtitleSegments={subtitleSegments}
        videoOffset={videoOffset}
      >
        <div
          style={{
            fontSize: 88,
            fontWeight: 900,
            color: '#ffffff',
            textAlign: 'center',
            transform: `scale(${titleScale})`,
            textShadow: '0 0 40px rgba(59,130,246,0.6), 0 4px 20px rgba(0,0,0,0.5)',
            letterSpacing: 2,
          }}
        >
          GPT Image 2
        </div>
        <div
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: '#60a5fa',
            textAlign: 'center',
            opacity: subtitleOpacity,
            letterSpacing: 3,
          }}
        >
          2026.04.21 正式发布
        </div>
        <div
          style={{
            fontSize: 44,
            fontWeight: 800,
            color: '#ffffff',
            textAlign: 'center',
            opacity: dateOpacity,
            marginTop: 16,
            letterSpacing: 1,
          }}
        >
          AI 生图又变天了
        </div>
      </CenteredStack>
    </>
  )
}

