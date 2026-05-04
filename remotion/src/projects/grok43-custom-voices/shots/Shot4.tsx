import React from 'react'
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion'
import { SafeArea, ProgressiveSubtitle, type SubtitleSegment } from '../../../components'

interface ShotProps {
  subtitleSegments?: SubtitleSegment[]
  videoOffset?: number
}

const USE_CASES = ['一分钟短片', '漫画集', '产品故事'] as const

export const Shot4: React.FC<ShotProps> = ({ subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const staggerReveal = (delay: number): React.CSSProperties => {
    const progress = spring({ frame, fps, config: { damping: 16, stiffness: 140 }, delay })
    const translateY = interpolate(progress, [0, 1], [20, 0], { extrapolateRight: 'clamp' })
    return {
      opacity: interpolate(progress, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' }),
      transform: `translateY(${translateY}px)`,
    }
  }

  return (
    <AbsoluteFill style={{ backgroundColor: '#0C4A6E' }}>
      <Img
        src={staticFile('images/grok43-custom-voices/tavily-002.jpg')}
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(12,74,110,0.3) 0%, rgba(12,74,110,0.8) 100%)' }} />

      <SafeArea>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'flex-end', paddingBottom: 80, gap: 20 }}>
          {USE_CASES.map((useCase, index) => (
            <div
              key={useCase}
              style={{
                ...staggerReveal(15 + index * 10),
                background: 'rgba(167, 139, 250, 0.2)',
                borderRadius: 999,
                padding: '16px 32px',
                fontSize: 28,
                fontWeight: 600,
                color: '#A78BFA',
                border: '1px solid rgba(167, 139, 250, 0.3)',
                alignSelf: 'center',
                backdropFilter: 'blur(4px)',
              }}
            >
              {useCase}
            </div>
          ))}
        </div>
      </SafeArea>

      {subtitleSegments && videoOffset !== undefined && (
        <ProgressiveSubtitle segments={subtitleSegments} videoOffset={videoOffset} />
      )}
    </AbsoluteFill>
  )
}
