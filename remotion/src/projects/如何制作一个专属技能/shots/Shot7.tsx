// Theme: Ocean — 技术/AI
import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import { CenteredStack, type SubtitleSegment } from '../../../components'

interface ShotProps {
  subtitleSegments?: SubtitleSegment[]
}

export const Shot7: React.FC<ShotProps> = ({ subtitleSegments }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const titleProgress = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 120 },
    delay: 0,
  })
  const titleScale = interpolate(titleProgress, [0, 1], [0.7, 1], { extrapolateRight: 'clamp' })
  const titleOpacity = interpolate(titleProgress, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' })

  const highlightProgress = spring({
    frame,
    fps,
    config: { damping: 200 },
    delay: 10,
  })

  const buttonProgress = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 100 },
    delay: 20,
  })

  const pulseScale = interpolate(
    Math.sin((frame - 20) * 0.08),
    [-1, 1],
    [1, 1.05],
    { extrapolateRight: 'clamp' },
  )
  const pulseOpacity = interpolate(
    (frame - 20) % 60,
    [0, 60],
    [0.3, 0],
    { extrapolateRight: 'clamp' },
  )

  return (
    <CenteredStack
      background="radial-gradient(circle at 50% 30%, #ECFEFF, #A5F3FC)"
      subtitleSegments={subtitleSegments}
      videoOffset={0}
      gap={48}
    >
      <div
        style={{
          position: 'relative',
          display: 'inline-block',
          transform: `scale(${titleScale})`,
          opacity: titleOpacity,
        }}
      >
        <span
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: '50%',
            height: '1.05em',
            transform: `translateY(-50%) scaleX(${highlightProgress})`,
            transformOrigin: 'left center',
            backgroundColor: '#0EA5E9',
            borderRadius: '0.18em',
            opacity: 0.25,
          }}
        />
        <span
          style={{
            position: 'relative',
            zIndex: 1,
            fontSize: 72,
            fontWeight: 900,
            color: '#0C4A6E',
            letterSpacing: 4,
          }}
        >
          3 分钟 · 专属技能
        </span>
      </div>

      <div style={{ position: 'relative' }}>
        <div
          style={{
            padding: '28px 80px',
            background: 'linear-gradient(135deg, #0EA5E9, #06B6D4)',
            borderRadius: 60,
            transform: `scale(${buttonProgress * pulseScale})`,
            boxShadow: '0 16px 48px rgba(14,165,233,0.35)',
          }}
        >
          <span
            style={{
              color: '#FFFFFF',
              fontSize: 44,
              fontWeight: 800,
              letterSpacing: 4,
            }}
          >
            关注
          </span>
        </div>
        <div
          style={{
            position: 'absolute',
            top: -10,
            left: -10,
            right: -10,
            bottom: -10,
            borderRadius: 70,
            border: '3px solid rgba(14,165,233,0.3)',
            transform: `scale(${1 + (frame % 60) / 120})`,
            opacity: pulseOpacity,
          }}
        />
      </div>
    </CenteredStack>
  )
}
