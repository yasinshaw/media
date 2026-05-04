import React from 'react'
import { Img, staticFile, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion'
import { CenteredStack, useFadeIn, useSlideIn, useStagger, type SubtitleSegment } from '../../../components'

interface Shot5Props {
  subtitleSegments?: SubtitleSegment[]
  videoOffset?: number
}

const FONT = 'Noto Sans SC, sans-serif'

export const Shot5: React.FC<Shot5Props> = ({ subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Screenshot card entry
  const cardEntry = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 80 },
  })
  const cardScale = interpolate(cardEntry, [0, 1], [0.9, 1], { extrapolateRight: 'clamp' })
  const cardOpacity = interpolate(cardEntry, [0, 0.5], [0, 1], { extrapolateRight: 'clamp' })

  // Title above screenshot
  const titleStyle = useFadeIn(frame, 5, 15)

  // Project-level cards stagger (2 cards)
  const projectCards = useStagger(frame, 2, 10, 12)

  // Bottom tag
  const tagStyle = useSlideIn(frame, 'up', 20, 30, 15)

  return (
    <CenteredStack
      background="linear-gradient(135deg, #1A1A2E, #16213E)"
      justify="center"
      subtitleSegments={subtitleSegments}
      videoOffset={videoOffset}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
          width: '100%',
          maxWidth: 860,
        }}
      >
        {/* Title */}
        <div
          style={{
            fontSize: 38,
            fontWeight: 700,
            color: '#F8FAFC',
            fontFamily: FONT,
            ...titleStyle,
          }}
        >
          Web UI Dashboard
        </div>

        {/* Screenshot card */}
        <div
          style={{
            width: '100%',
            borderRadius: 20,
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4), 0 0 40px rgba(167, 139, 250, 0.08)',
            border: '2px solid rgba(167, 139, 250, 0.2)',
            opacity: cardOpacity,
            transform: `scale(${cardScale})`,
          }}
        >
          <Img
            src={staticFile('/images/multi-agent-syncer/webui-user-level.png')}
            style={{
              width: '100%',
              display: 'block',
            }}
          />
        </div>

        {/* Project-level cards */}
        <div
          style={{
            display: 'flex',
            gap: 20,
            width: '100%',
          }}
        >
          {/* Frontend project card */}
          <div
            style={{
              flex: 1,
              padding: '20px 24px',
              borderRadius: 16,
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              ...projectCards[0].style,
            }}
          >
            <div style={{ fontSize: 24, fontWeight: 700, color: '#38BDF8', fontFamily: FONT, marginBottom: 6 }}>
              前端项目
            </div>
            <div style={{ fontSize: 22, color: '#94A3B8', fontFamily: FONT }}>
              React · Vue · TypeScript
            </div>
          </div>

          {/* Backend project card */}
          <div
            style={{
              flex: 1,
              padding: '20px 24px',
              borderRadius: 16,
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(167, 139, 250, 0.2)',
              ...projectCards[1].style,
            }}
          >
            <div style={{ fontSize: 24, fontWeight: 700, color: '#A78BFA', fontFamily: FONT, marginBottom: 6 }}>
              后端项目
            </div>
            <div style={{ fontSize: 22, color: '#94A3B8', fontFamily: FONT }}>
              PostgreSQL · Redis · Go
            </div>
          </div>
        </div>

        {/* Bottom tag */}
        <div
          style={{
            fontSize: 26,
            fontWeight: 600,
            color: '#64748B',
            fontFamily: FONT,
            letterSpacing: 2,
            ...tagStyle.style,
          }}
        >
          CLI + Web UI · 用户级 + 项目级
        </div>
      </div>
    </CenteredStack>
  )
}
