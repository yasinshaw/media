import React from 'react'
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion'
import { CenteredStack } from '../../../components'
import { SubtitleSegment } from '../composition'

interface Shot6Props {
  subtitleSegments?: SubtitleSegment[]
  videoOffset?: number
}

export const Shot6: React.FC<Shot6Props> = ({ subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const titleScale = spring({ frame, fps, config: { damping: 15, stiffness: 80 } })
  const commentOpacity = interpolate(frame, [30, 50], [0, 1], { extrapolateRight: 'clamp' })
  const followScale = spring({ frame, fps, delay: 40, config: { damping: 12, stiffness: 150 } })

  return (
    <>
      <CenteredStack
        background="linear-gradient(180deg, #0f172a 0%, #1a1a2e 100%)"
        justify="center"
        gap={32}
        subtitleSegments={subtitleSegments}
        videoOffset={videoOffset}
      >
        {/* Main title */}
        <div
          style={{
            fontSize: 52,
            fontWeight: 900,
            color: '#ffffff',
            textAlign: 'center',
            transform: `scale(${titleScale})`,
            letterSpacing: 2,
          }}
        >
          AI 生图 = <span style={{ color: '#60a5fa' }}>生产力工具</span>
        </div>

        {/* Comment bubble */}
        <div
          style={{
            opacity: commentOpacity,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            backgroundColor: 'rgba(255,255,255,0.08)',
            borderRadius: 20,
            padding: '20px 32px',
          }}
        >
          <div style={{ fontSize: 40 }}>&#x1F4AC;</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#e2e8f0' }}>你生成了什么？评论区见</div>
        </div>

        {/* Follow button */}
        <div
          style={{
            transform: `scale(${followScale})`,
            backgroundColor: '#3b82f6',
            borderRadius: 40,
            padding: '16px 48px',
            boxShadow: '0 8px 30px rgba(59,130,246,0.4)',
          }}
        >
          <span style={{ fontSize: 32, fontWeight: 800, color: '#ffffff', letterSpacing: 2 }}>
            + 关注
          </span>
        </div>
      </CenteredStack>

      {/* Film grain overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.04,
          mixBlendMode: 'overlay',
          pointerEvents: 'none',
        }}
      >
        <svg width="100%" height="100%">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>
    </>
  )
}
