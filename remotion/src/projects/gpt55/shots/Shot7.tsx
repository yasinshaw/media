import { AbsoluteFill, interpolate, useCurrentFrame, spring } from 'remotion'
import React from 'react'
import { Subtitle } from '../../../components/Subtitle'

interface ShotProps {
  subtitle?: string
}

export const Shot7: React.FC<ShotProps> = ({ subtitle }) => {
  const frame = useCurrentFrame()

  const scale = spring({
    frame,
    fps: 30,
    config: { damping: 10, stiffness: 80 }
  })

  const buttonScale = interpolate(
    frame,
    [60, 90, 120],
    [1, 1.1, 1],
    { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }
  )

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
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
        alignItems: 'center',
        gap: '48px'
      }}>
        {/* Main CTA */}
        <div style={{
          padding: '48px 64px',
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(20px)',
          borderRadius: '32px',
          border: '3px solid rgba(255, 255, 255, 0.3)',
          textAlign: 'center',
          transform: `scale(${scale})`
        }}>
          <div style={{
            fontSize: '48px',
            fontWeight: 800,
            color: '#fff',
            lineHeight: '1.4',
            marginBottom: '16px'
          }}>
            想了解 GPT-5.5
          </div>
          <div style={{
            fontSize: '48px',
            fontWeight: 800,
            color: '#fef08a',
            lineHeight: '1.4'
          }}>
            怎么用最有效？
          </div>
        </div>

        {/* CTA Actions */}
        <div style={{
          display: 'flex',
          gap: '32px',
          marginTop: '20px'
        }}>
          {[
            { emoji: '❤️', label: '关注' },
            { emoji: '⭐', label: '点赞' },
            { emoji: '📌', label: '收藏' }
          ].map((action, index) => {
            const delay = index * 10
            const actionScale = spring({
              frame: frame - delay,
              fps: 30,
              config: { damping: 12, stiffness: 80 }
            })
            const clampedScale = Math.min(1, Math.max(0.6, actionScale))

            return (
              <div
                key={index}
                style={{
                  width: '140px',
                  height: '140px',
                  borderRadius: '24px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '3px solid rgba(255, 255, 255, 0.4)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '8px',
                  transform: `scale(${clampedScale})`
                }}
              >
                <div style={{ fontSize: '48px' }}>
                  {action.emoji}
                </div>
                <div style={{
                  fontSize: '28px',
                  fontWeight: 700,
                  color: '#fff'
                }}>
                  {action.label}
                </div>
              </div>
            )
          })}
        </div>

        {/* Teaser */}
        <div style={{
          padding: '24px 48px',
          background: 'rgba(253, 224, 71, 0.2)',
          borderRadius: '20px',
          border: '2px solid rgba(253, 224, 71, 0.4)',
          transform: `scale(${buttonScale})`
        }}>
          <div style={{
            fontSize: '32px',
            fontWeight: 700,
            color: '#fef08a',
            textAlign: 'center'
          }}>
            下期出实战教程
          </div>
        </div>

        {/* Sign off */}
        <div style={{
          fontSize: '28px',
          fontWeight: 600,
          color: 'rgba(255, 255, 255, 0.8)'
        }}>
          我们下期见 👋
        </div>
      </div>

      {subtitle && <Subtitle text={subtitle} />}
    </AbsoluteFill>
  )
}
