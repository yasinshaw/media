import React from 'react'
import { AbsoluteFill, useCurrentFrame, interpolate, spring } from 'remotion'
import { ProgressiveSubtitle } from '../../../components'

interface SubtitleSegment {
  text: string
  start: number
  end: number
  duration: number
}

interface ShotProps {
  subtitleSegments?: SubtitleSegment[]
  videoOffset?: number
}

export const Shot7: React.FC<ShotProps> = ({ subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()

  const actions = [
    { icon: '👍', label: '点赞', color: '#ff6b6b', delay: 0 },
    { icon: '⭐', label: '收藏', color: '#ffd93d', delay: 20 },
    { icon: '👀', label: '关注', color: '#6bcf7f', delay: 40 }
  ]

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '120px 40px 200px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '900px',
        display: 'flex',
        flexDirection: 'column',
        gap: '56px',
        alignItems: 'center'
      }}>
        <div style={{
          fontSize: '56px',
          fontWeight: 800,
          color: '#ffffff',
          textAlign: 'center',
          opacity: interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' })
        }}>
          想了解更多？
        </div>

        <div style={{
          display: 'flex',
          gap: '48px',
          justifyContent: 'center'
        }}>
          {actions.map((action, idx) => {
            const spr = spring({
              frame: frame - action.delay,
              fps: 30,
              config: { damping: 12, stiffness: 80 }
            })
            const scale = interpolate(spr, [0, 1], [0, 1])
            const opacity = interpolate(spr, [0, 1], [0, 1])

            return (
              <div key={idx} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px',
                opacity,
                transform: `scale(${scale})`
              }}>
                <div style={{
                  width: '140px',
                  height: '140px',
                  borderRadius: '50%',
                  background: action.color,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: '72px',
                  boxShadow: `0 10px 40px ${action.color}88`
                }}>
                  {action.icon}
                </div>
                <div style={{
                  fontSize: '36px',
                  color: '#ffffff',
                  fontWeight: 700
                }}>
                  {action.label}
                </div>
              </div>
            )
          })}
        </div>

        <div style={{
          fontSize: '40px',
          color: '#ffffff',
          textAlign: 'center',
          fontWeight: 600,
          opacity: interpolate(frame, [100, 130], [0, 1], { extrapolateRight: 'clamp' })
        }}>
          下期出实战教程
        </div>
      </div>

      {subtitleSegments && (
        <ProgressiveSubtitle
          segments={subtitleSegments}
          videoOffset={videoOffset || 0}
        />
      )}
    </AbsoluteFill>
  )
}
