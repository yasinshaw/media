import React from 'react'
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion'
import { SafeArea, ProgressiveSubtitle, type SubtitleSegment } from '../../../components'

interface ShotProps {
  subtitleSegments?: SubtitleSegment[]
  videoOffset?: number
}

export const Shot3: React.FC<ShotProps> = ({ subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const slideInFromRight = (delay: number): React.CSSProperties => {
    const progress = spring({ frame, fps, config: { damping: 18, stiffness: 100 }, delay })
    const translateX = interpolate(progress, [0, 1], [200, 0], { extrapolateRight: 'clamp' })
    return {
      opacity: progress,
      transform: `translateX(${translateX}px)`,
    }
  }

  return (
    <AbsoluteFill style={{ backgroundColor: '#1E1B4B' }}>
      <Img
        src={staticFile('images/grok43-custom-voices/article-the-decoder.com-002.png')}
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
      <AbsoluteFill style={{ backgroundColor: 'rgba(30,27,75,0.5)' }} />

      <SafeArea>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'flex-end', paddingBottom: 80 }}>
          {/* Orange highlight bar on Grok 4.3 row */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: '58%',
              width: '100%',
              height: 48,
              backgroundColor: 'rgba(249, 115, 22, 0.25)',
              borderLeft: '4px solid #F97316',
              opacity: interpolate(frame, [10, 25], [0, 1], { extrapolateRight: 'clamp' }),
            }}
          />

          {/* Quote bubble */}
          <div
            style={{
              ...slideInFromRight(40),
              background: 'rgba(255, 255, 255, 0.12)',
              borderLeft: '4px solid #F97316',
              borderRadius: 12,
              padding: '24px 28px',
              width: '100%',
              backdropFilter: 'blur(8px)',
            }}
          >
            <div
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: '#F8FAFC',
                lineHeight: 1.5,
                fontStyle: 'italic',
              }}
            >
              "和 Sonnet 一样聪明，但便宜 5 倍"
            </div>
            <div
              style={{
                fontSize: 24,
                color: '#94A3B8',
                marginTop: 12,
              }}
            >
              — Bindu Reddy, Abacus AI CEO
            </div>
          </div>
        </div>
      </SafeArea>

      {subtitleSegments && videoOffset !== undefined && (
        <ProgressiveSubtitle segments={subtitleSegments} videoOffset={videoOffset} />
      )}
    </AbsoluteFill>
  )
}
