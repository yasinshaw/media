import React from 'react'
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import { CenteredStack } from '../../../components'
import type { SubtitleSegment } from '../../../components'

interface ShotProps {
  subtitleSegments?: SubtitleSegment[]
  videoOffset?: number
}

// Theme: Sunrise — 效率/数据/成长
// Animation: typewriter + blurIn + scaleIn

export const Shot1: React.FC<ShotProps> = ({ subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const titleText = '1600万粉丝'
  const subtitleText = '影视飓风'
  const taglineText = 'AI工作流'

  // Typewriter effect for "1600万粉丝"
  const charsPerFrame = 0.8
  const visibleChars = Math.floor(frame * charsPerFrame)
  const displayedTitle = titleText.slice(0, visibleChars)
  const titleComplete = visibleChars >= titleText.length
  const cursorOpacity = interpolate(frame % 16, [0, 8, 16], [1, 0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // blurIn for "影视飓风" — fade in + blur from 10px → 0
  const subtitleSpring = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 150 },
    delay: 5,
  })
  const subtitleOpacity = interpolate(subtitleSpring, [0, 1], [0, 1])
  const subtitleBlur = interpolate(subtitleSpring, [0, 1], [10, 0])

  // scaleIn for "AI工作流" with gradient text
  const taglineSpring = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 200 },
    delay: 40,
  })
  const taglineOpacity = interpolate(taglineSpring, [0, 1], [0, 1])
  const taglineScale = interpolate(taglineSpring, [0, 1], [0.7, 1])

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background: 'radial-gradient(circle at 50% 30%, #FFF7ED, #FED7AA)',
        }}
      />

      <CenteredStack
        background="transparent"
        maxWidth={900}
        gap={24}
        subtitleSegments={subtitleSegments}
        videoOffset={videoOffset}
      >
        <div
          style={{
            opacity: subtitleOpacity,
            filter: `blur(${subtitleBlur}px)`,
          }}
        >
          <div
            style={{
              fontSize: 36,
              fontWeight: 700,
              color: '#78716C',
              letterSpacing: 4,
              textAlign: 'center',
            }}
          >
            {subtitleText}
          </div>
        </div>

        <div
          style={{
            fontSize: 80,
            fontWeight: 900,
            color: '#1C1917',
            textAlign: 'center',
            lineHeight: 1.2,
          }}
        >
          {displayedTitle}
          {!titleComplete && (
            <span
              style={{
                opacity: cursorOpacity,
                color: '#F97316',
              }}
            >
              |
            </span>
          )}
        </div>

        <div
          style={{
            opacity: taglineOpacity,
            transform: `scale(${taglineScale})`,
          }}
        >
          <div
            style={{
              fontSize: 56,
              fontWeight: 800,
              textAlign: 'center',
              letterSpacing: 6,
              background: 'linear-gradient(135deg, #F97316, #EAB308)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {taglineText}
          </div>
        </div>
      </CenteredStack>
    </AbsoluteFill>
  )
}
