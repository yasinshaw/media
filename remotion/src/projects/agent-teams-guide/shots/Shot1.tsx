import React from 'react'
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion'
import { ProgressiveSubtitle } from '../../../components/ProgressiveSubtitle'

interface Shot1Props {
  subtitleSegments?: Array<{text: string, start: number, end: number, duration: number}>
  videoOffset?: number
}

export const Shot1: React.FC<Shot1Props> = ({ subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()

  // Use frame directly for precise timing (shot is 340 frames ≈ 11.3s)
  // 16个AI: 0-150 frames (5s) full, 150-180 frames (1s) fade out
  // 10万行代码: 170-200 frames fade in, 200-260 frames full, 260-290 frames fade out
  // C编译器: 280-310 frames fade in, then stay

  const firstOpacity = interpolate(frame, [0, 150, 180], [1, 1, 0], { extrapolateRight: 'clamp' })
  const secondOpacity = interpolate(frame, [170, 200, 260, 290], [0, 1, 1, 0], { extrapolateRight: 'clamp' })
  const thirdOpacity = interpolate(frame, [280, 310], [0, 1], { extrapolateRight: 'clamp' })

  // Scale animation
  const firstScale = interpolate(frame, [0, 170], [1, 0.9], { extrapolateRight: 'clamp' })
  const secondScale = interpolate(frame, [170, 200, 260], [0.9, 0.95, 1], { extrapolateRight: 'clamp' })
  const thirdScale = interpolate(frame, [280, 310], [0.9, 1], { extrapolateRight: 'clamp' })

  // Fade in for subtitle
  const fadeIn = interpolate(frame, [0, 6], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '120px 40px 200px',
    }}>
      {/* VS Title */}
      <div style={{
        fontSize: 48,
        fontWeight: 700,
        color: '#94a3b8',
        marginBottom: 60,
        opacity: fadeIn,
      }}>
        1个AI vs 16个AI
      </div>

      {/* Number Flip Animation */}
      <div style={{ position: 'relative', width: 600, height: 400 }}>
        {/* First: 16个AI */}
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          transform: `scale(${firstScale})`,
          opacity: firstOpacity,
        }}>
          <div style={{
            fontSize: 180,
            fontWeight: 900,
            background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            16
          </div>
          <div style={{ fontSize: 48, color: '#cbd5e1', marginTop: 16 }}>个AI</div>
        </div>

        {/* Second: 10万行代码 */}
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          transform: `scale(${secondScale})`,
          opacity: secondOpacity,
        }}>
          <div style={{
            fontSize: 180,
            fontWeight: 900,
            background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            10万
          </div>
          <div style={{ fontSize: 48, color: '#cbd5e1', marginTop: 16 }}>行代码</div>
        </div>

        {/* Third: C编译器 */}
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          transform: `scale(${thirdScale})`,
          opacity: thirdOpacity,
        }}>
          <div style={{
            fontSize: 140,
            fontWeight: 900,
            background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            C编译器
          </div>
        </div>
      </div>

      {/* Bottom badge */}
      <div style={{
        marginTop: 60,
        padding: '16px 32px',
        background: 'rgba(251, 191, 36, 0.15)',
        border: '2px solid #f59e0b',
        borderRadius: 12,
        fontSize: 32,
        color: '#f59e0b',
        fontWeight: 700,
        opacity: fadeIn,
      }}>
        Anthropic 实测
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
