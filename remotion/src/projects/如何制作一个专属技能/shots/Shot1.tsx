// Theme: Ocean — 技术/AI
import React from 'react'
import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion'
import { ProgressiveSubtitle, type SubtitleSegment } from '../../../components'

interface ShotProps {
  subtitleSegments?: SubtitleSegment[]
}

export const Shot1: React.FC<ShotProps> = ({ subtitleSegments }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' })
  const blur = interpolate(frame, [0, 15], [20, 0], { extrapolateRight: 'clamp' })

  const highlightProgress = spring({
    frame,
    fps,
    config: { damping: 200 },
    delay: 20,
  })

  const subScale = spring({
    frame,
    fps,
    config: { damping: 200 },
    delay: 15,
  })

  return (
    <AbsoluteFill>
      <Img
        src={staticFile('images/如何制作一个专属技能/shot1-bg.png')}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <AbsoluteFill style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} />
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          opacity,
          filter: `blur(${blur}px)`,
        }}
      >
        <div style={{ position: 'relative', display: 'inline-block' }}>
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
              opacity: 0.3,
            }}
          />
          <span
            style={{
              position: 'relative',
              zIndex: 1,
              fontSize: 96,
              fontWeight: 900,
              color: '#FFFFFF',
              letterSpacing: 8,
            }}
          >
            专属技能
          </span>
        </div>
        <div
          style={{
            fontSize: 40,
            color: '#64748B',
            fontWeight: 600,
            marginTop: 24,
            transform: `scale(${subScale})`,
            opacity: subScale,
          }}
        >
          Claude Code
        </div>
      </AbsoluteFill>
      {subtitleSegments && <ProgressiveSubtitle segments={subtitleSegments} />}
    </AbsoluteFill>
  )
}
