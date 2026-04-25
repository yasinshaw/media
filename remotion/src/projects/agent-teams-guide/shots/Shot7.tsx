import React from 'react'
import { AbsoluteFill, useCurrentFrame, interpolate, spring } from 'remotion'
import { ProgressiveSubtitle } from '../../../components/ProgressiveSubtitle'

interface Shot7Props {
  subtitleSegments?: Array<{text: string, start: number, end: number, duration: number}>
  videoOffset?: number
}

export const Shot7: React.FC<Shot7Props> = ({ subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()
  const fps = 30

  // Main content fade in
  const fadeIn = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' })

  // Text animation
  const textScale = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 80 },
  })

  // Pulse animation for icons
  const pulse = spring({
    frame: frame % 60,
    fps,
    config: { damping: 10, stiffness: 100 },
  })

  // Arrow bounce
  const arrowBounce = interpolate(frame % 45, [0, 22, 44], [0, -10, 0], { extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%)',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '120px 40px 200px',
    }}>
      {/* Next Episode Title */}
      <div style={{
        fontSize: 36,
        fontWeight: 600,
        color: '#c4b5fd',
        marginBottom: 20,
        opacity: fadeIn,
      }}>
        下期预告
      </div>

      {/* Main Title */}
      <div style={{
        fontSize: 56,
        fontWeight: 900,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 60,
        transform: `scale(${0.9 + textScale * 0.1})`,
        opacity: fadeIn,
      }}>
        手把手配置 Agent Teams
      </div>

      {/* Arrow pointing to follow button */}
      <div style={{
        position: 'relative',
        marginBottom: 40,
      }}>
        {/* Thumbs up icon */}
        <div style={{
          width: 120,
          height: 120,
          borderRadius: 60,
          background: 'rgba(251, 191, 36, 0.2)',
          border: '4px solid #f59e0b',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: 64,
          transform: `scale(${1 + pulse * 0.1})`,
        }}>
          👍
        </div>

        {/* Bouncing arrow */}
        <div style={{
          position: 'absolute',
          right: -100,
          top: 40,
          fontSize: 64,
          transform: `translateY(${arrowBounce}px)`,
        }}>
          →
        </div>

        {/* Follow icon */}
        <div style={{
          position: 'absolute',
          right: -200,
          top: 20,
          width: 100,
          height: 100,
          borderRadius: 50,
          background: 'rgba(239, 68, 68, 0.2)',
          border: '4px solid #ef4444',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: 48,
          transform: `scale(${1 + pulse * 0.1})`,
        }}>
          ❤️
        </div>
      </div>

      {/* CTA Text */}
      <div style={{
        fontSize: 44,
        fontWeight: 700,
        color: '#fef08a',
        textAlign: 'center',
        marginBottom: 20,
        opacity: fadeIn,
      }}>
        点赞 + 关注
      </div>

      {/* Subtitle */}
      <div style={{
        fontSize: 28,
        color: '#ddd6fe',
        opacity: 0.8,
      }}>
        不迷路，下期见
      </div>

      {/* Progressive Subtitle */}
      {subtitleSegments && videoOffset !== undefined && (
        <ProgressiveSubtitle
          segments={subtitleSegments}
          videoOffset={videoOffset}
        />
      )}
    </AbsoluteFill>
  )
}
