import React from 'react'
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import { CenteredStack } from '../../../components'
import { theme, FONT_FAMILY, backgrounds } from '../theme'

interface ShotProps {
  subtitleSegments?: Array<{ text: string; start: number; end: number; duration: number }>
}

export const Shot1: React.FC<ShotProps> = ({ subtitleSegments }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const subtitle = subtitleSegments?.find((s) => frame / fps >= s.start && frame / fps < s.end)?.text

  // blurIn for the title block
  const titleBlur = interpolate(frame, [0, 18], [20, 0], { extrapolateRight: 'clamp' })
  const titleOpacity = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: 'clamp' })

  // ❌ rotateIn after title appears
  const xProgress = spring({ frame, fps, config: { damping: 10, stiffness: 180 }, delay: 18 })
  const xRotate = interpolate(xProgress, [0, 1], [-25, 0])
  const xScale = interpolate(xProgress, [0, 1], [0.4, 1])
  const xOpacity = interpolate(xProgress, [0, 0.4], [0, 1])

  // ? mark rotateIn — comes in after ❌
  const qProgress = spring({ frame, fps, config: { damping: 8, stiffness: 160 }, delay: 32 })
  const qRotate = interpolate(qProgress, [0, 1], [-180, 0])
  const qScale = interpolate(qProgress, [0, 1], [0, 1])
  const qOpacity = interpolate(qProgress, [0, 0.4], [0, 1])

  // Highlight wipe under "GPT-5.5"
  const highlightProgress = spring({ frame, fps, config: { damping: 200 }, delay: 12 })

  // Subtle shake on the whole title for tension
  const shakeIntensity = interpolate(frame, [40, 80], [4, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const shakeX = Math.sin(frame * 0.9) * shakeIntensity

  return (
    <AbsoluteFill style={{ background: backgrounds[0] }}>
      {/* Noise grain overlay */}
      <AbsoluteFill style={{ opacity: 0.08, mixBlendMode: 'overlay', pointerEvents: 'none' }}>
        <svg width="100%" height="100%">
          <filter id="noise1">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise1)" />
        </svg>
      </AbsoluteFill>

      {/* Decorative scan lines */}
      <AbsoluteFill style={{
        background: 'repeating-linear-gradient(0deg, rgba(14,165,233,0.06) 0px, rgba(14,165,233,0.06) 1px, transparent 1px, transparent 4px)',
        pointerEvents: 'none',
      }} />

      <CenteredStack maxWidth={960} gap={60} subtitle={subtitle}>
        {/* Title block */}
        <div style={{
          opacity: titleOpacity,
          filter: `blur(${titleBlur}px)`,
          transform: `translateX(${shakeX}px)`,
          fontSize: 96,
          fontWeight: 900,
          color: theme.textOnDark,
          letterSpacing: '4px',
          position: 'relative',
          fontFamily: FONT_FAMILY,
        }}>
          <span style={{ position: 'relative', display: 'inline-block' }}>
            <span style={{
              position: 'absolute',
              left: -8,
              right: -8,
              top: '50%',
              height: '1.05em',
              transform: `translateY(-50%) scaleX(${highlightProgress})`,
              transformOrigin: 'left center',
              backgroundColor: theme.danger,
              opacity: 0.25,
              borderRadius: '0.15em',
            }} />
            <span style={{ position: 'relative', zIndex: 1 }}>GPT-5.5</span>
          </span>
          {/* Red X overlay */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) rotate(${xRotate}deg) scale(${xScale})`,
            opacity: xOpacity,
            fontSize: 200,
            color: theme.danger,
            fontWeight: 900,
            textShadow: `0 0 40px ${theme.danger}99, 0 0 80px ${theme.danger}55`,
            zIndex: 2,
            lineHeight: 1,
          }}>
            ✕
          </div>
        </div>

        {/* Floating ? */}
        <div style={{
          opacity: qOpacity,
          transform: `rotate(${qRotate}deg) scale(${qScale})`,
          fontSize: 180,
          fontWeight: 900,
          color: theme.accent,
          textShadow: `0 0 50px ${theme.accent}99`,
          lineHeight: 1,
        }}>
          ?
        </div>

        {/* Sub-caption */}
        <div style={{
          opacity: interpolate(frame, [50, 80], [0, 1], { extrapolateRight: 'clamp' }),
          fontSize: 38,
          color: theme.textSecondaryOnDark,
          fontWeight: 600,
          letterSpacing: '2px',
          fontFamily: FONT_FAMILY,
        }}>
          你调的，可能是假的
        </div>
      </CenteredStack>
    </AbsoluteFill>
  )
}
