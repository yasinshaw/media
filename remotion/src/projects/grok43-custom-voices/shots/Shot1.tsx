import React from 'react'
import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from 'remotion'
import { CenteredStack, type SubtitleSegment } from '../../../components'

interface ShotProps {
  subtitleSegments?: SubtitleSegment[]
  videoOffset?: number
}

// ── Animation helpers ──────────────────────────────────────────────

const scaleIn = (frame: number, fps: number, delay: number) => {
  const s = spring({ frame: frame - delay, fps, config: { damping: 10, stiffness: 150 } })
  const opacity = interpolate(frame, [delay, delay + 10], [0, 1], {
    extrapolateRight: 'clamp',
  })
  return { scale: s, opacity }
}

const typewriter = (frame: number, text: string, startFrame: number) => {
  const charsShown = interpolate(frame, [startFrame, startFrame + text.length * 2], [0, text.length], {
    extrapolateRight: 'clamp',
  })
  return text.slice(0, Math.round(charsShown))
}

const fadeSlideUp = (frame: number, delay: number) => {
  const opacity = interpolate(frame, [delay, delay + 15], [0, 1], {
    extrapolateRight: 'clamp',
  })
  const translateY = interpolate(frame, [delay, delay + 15], [30, 0], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  })
  return { opacity, translateY }
}

// ── Component ──────────────────────────────────────────────────────

export const Shot1: React.FC<ShotProps> = ({ subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const xaiAnim = scaleIn(frame, fps, 5)

  const num40 = typewriter(frame, '40%↓', 15)
  const num60 = typewriter(frame, '60%↓', 35)

  const titleAnim = fadeSlideUp(frame, 50)

  return (
    <AbsoluteFill>
      {/* AI background image */}
      <Img
        src={staticFile('images/grok43-custom-voices/shot1-bg.png')}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />

      {/* Dark overlay */}
      <AbsoluteFill
        style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.80) 100%)',
        }}
      />

      {/* Content */}
      <CenteredStack
        justify="center"
        gap={40}
        subtitleSegments={subtitleSegments}
        videoOffset={videoOffset}
      >
        {/* xAI logo text with glow */}
        <div
          style={{
            fontSize: 88,
            fontWeight: 900,
            color: '#F8FAFC',
            textAlign: 'center',
            letterSpacing: 6,
            transform: `scale(${xaiAnim.scale})`,
            opacity: xaiAnim.opacity,
            textShadow: `
              0 0 20px rgba(167, 139, 250, 0.8),
              0 0 40px rgba(167, 139, 250, 0.5),
              0 0 80px rgba(167, 139, 250, 0.3)
            `,
          }}
        >
          xAI
        </div>

        {/* Alternating numbers: 40%↓ and 60%↓ */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              color: '#A78BFA',
              textShadow: '0 0 20px rgba(167, 139, 250, 0.6)',
              minHeight: 80,
              textAlign: 'center',
            }}
          >
            {num40}
          </div>
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              color: '#38BDF8',
              textShadow: '0 0 20px rgba(56, 189, 248, 0.6)',
              minHeight: 80,
              textAlign: 'center',
            }}
          >
            {num60}
          </div>
        </div>

        {/* "Grok 4.3 + Custom Voices" bottom title */}
        <div
          style={{
            fontSize: 42,
            fontWeight: 700,
            color: '#F8FAFC',
            textAlign: 'center',
            letterSpacing: 2,
            opacity: titleAnim.opacity,
            transform: `translateY(${titleAnim.translateY}px)`,
            textShadow: '0 0 16px rgba(248, 250, 252, 0.3)',
          }}
        >
          Grok 4.3 + Custom Voices
        </div>
      </CenteredStack>
    </AbsoluteFill>
  )
}
