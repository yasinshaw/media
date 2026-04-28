import React from 'react'
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import { CenteredStack } from '../../../components'
import type { SubtitleSegment } from '../../../components'

interface ShotProps {
  subtitleSegments?: SubtitleSegment[]
  videoOffset?: number
}

// Theme: Sunrise — 效率/数据/成长
// Background: radial-gradient(circle at 50% 40%, #FFF7ED, #FED7AA)
// Animation: snappy scaleIn for title, bouncy scaleIn for CTA

const SUBTITLE_SEGMENTS: SubtitleSegment[] = [
  { text: '从选题到复盘，', start: 54.22, end: 55.34, duration: 1.12 },
  { text: 'AI已经渗透到影视飓风的每个创作环节。', start: 55.34, end: 58.39, duration: 3.05 },
  { text: '想看更多AI创作干货，', start: 58.39, end: 60.16, duration: 1.77 },
  { text: '关注我。', start: 60.16, end: 60.8, duration: 0.64 },
]

const VIDEO_OFFSET = 53.86

export const Shot6: React.FC<ShotProps> = ({
  subtitleSegments = SUBTITLE_SEGMENTS,
  videoOffset = VIDEO_OFFSET,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Snappy scaleIn for title
  const titleScale = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 200 },
    delay: 5,
  })

  // Bouncy scaleIn for CTA button
  const ctaScale = spring({
    frame,
    fps,
    config: { damping: 8, stiffness: 150 },
    delay: 30,
  })

  // Fade in for footer
  const footerFade = interpolate(frame, [60, 80], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Subtle pulse on CTA
  const pulseScale = interpolate(Math.sin(frame * 0.08), [-1, 1], [1, 1.05])

  return (
    <AbsoluteFill
      style={{
        background: 'radial-gradient(circle at 50% 40%, #FFF7ED, #FED7AA)',
      }}
    >
      {/* Decorative circles */}
      <div
        style={{
          position: 'absolute',
          width: 300,
          height: 300,
          borderRadius: '50%',
          backgroundColor: 'rgba(249,115,22,0.1)',
          top: 200,
          right: -80,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 200,
          height: 200,
          borderRadius: '50%',
          backgroundColor: 'rgba(234,179,8,0.1)',
          bottom: 500,
          left: -60,
        }}
      />

      <CenteredStack
        background="transparent"
        maxWidth={900}
        gap={40}
        subtitleSegments={subtitleSegments}
        videoOffset={videoOffset}
      >
        <div
          style={{
            fontSize: 44,
            fontWeight: 700,
            color: '#1C1917',
            textAlign: 'center',
            opacity: titleScale,
            transform: `scale(${interpolate(titleScale, [0, 1], [0.7, 1])})`,
          }}
        >
          AI已渗透到每个创作环节
        </div>

        {/* Custom CTA button — Ocean gradient */}
        <div
          style={{
            opacity: ctaScale,
            transform: `scale(${interpolate(ctaScale, [0, 1], [0.5, 1]) * pulseScale})`,
          }}
        >
          <div
            style={{
              padding: '28px 80px',
              background: 'linear-gradient(135deg, #F97316, #EAB308)',
              borderRadius: 60,
              boxShadow: '0 16px 48px rgba(249,115,22,0.35)',
            }}
          >
            <span
              style={{
                color: '#FFFFFF',
                fontSize: 48,
                fontWeight: 800,
                letterSpacing: 3,
              }}
            >
              关注我
            </span>
          </div>
        </div>

        <div
          style={{
            fontSize: 30,
            fontWeight: 600,
            color: '#78716C',
            textAlign: 'center',
            opacity: footerFade,
          }}
        >
          AI创作干货持续更新
        </div>
      </CenteredStack>
    </AbsoluteFill>
  )
}
