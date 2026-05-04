import React from 'react'
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion'
import { SafeArea, ProgressiveSubtitle, type SubtitleSegment } from '../../../components'

interface ShotProps {
  subtitleSegments?: SubtitleSegment[]
  videoOffset?: number
}

export const Shot2: React.FC<ShotProps> = ({ subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const badgeScale = spring({ frame, fps, config: { damping: 14, stiffness: 160 }, delay: 30 })
  const badgeOpacity = interpolate(badgeScale, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill style={{ backgroundColor: '#0F172A' }}>
      <Img
        src={staticFile('images/grok43-custom-voices/article-the-decoder.com-003.png')}
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
      <AbsoluteFill style={{ backgroundColor: 'rgba(15,23,42,0.5)' }} />

      <SafeArea>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'flex-end', paddingBottom: 80 }}>
          <div
            style={{
              padding: '12px 28px',
              background: 'rgba(34, 197, 94, 0.2)',
              border: '2px solid #22C55E',
              borderRadius: 20,
              fontSize: 28,
              fontWeight: 700,
              color: '#22C55E',
              whiteSpace: 'nowrap',
              opacity: badgeOpacity,
              transform: `scale(${badgeScale})`,
              boxShadow: '0 0 16px rgba(34, 197, 94, 0.3)',
              alignSelf: 'flex-start',
            }}
          >
            性价比最优
          </div>

          <div
            style={{
              fontSize: 24,
              color: 'rgba(255,255,255,0.6)',
              marginTop: 16,
            }}
          >
            数据来源: Artificial Analysis
          </div>
        </div>
      </SafeArea>

      {subtitleSegments && videoOffset !== undefined && (
        <ProgressiveSubtitle segments={subtitleSegments} videoOffset={videoOffset} />
      )}
    </AbsoluteFill>
  )
}
