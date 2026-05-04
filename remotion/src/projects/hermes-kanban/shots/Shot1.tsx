import React from 'react'
import { useCurrentFrame, interpolate, Img, staticFile } from 'remotion'
import type { SubtitleSegment } from '../../../components'

interface ShotProps {
  subtitleSegments?: SubtitleSegment[]
  videoOffset?: number
}

export const Shot1: React.FC<ShotProps> = ({ subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()

  const titleChars = Math.floor(frame * 0.6)
  const titleText = 'AI Agent自己拍了个视频'
  const cursorOpacity = interpolate(frame % 16, [0, 8, 16], [1, 0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const subOpacity = interpolate(frame, [20, 35], [0, 1], { extrapolateRight: 'clamp' })
  const subTranslateY = interpolate(frame, [20, 35], [20, 0], { extrapolateRight: 'clamp' })

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Img
        src={staticFile('images/hermes-kanban/shot1-bg.png')}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(15,23,42,0.6) 0%, rgba(15,23,42,0.85) 100%)',
      }} />

      <div style={{
        position: 'absolute', top: 280, left: 60, right: 60,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24,
      }}>
        <div style={{
          fontSize: 76, fontWeight: 900, color: '#F8FAFC', letterSpacing: 2,
          textShadow: '0 0 40px rgba(167,139,250,0.5)',
        }}>
          {titleText.slice(0, titleChars)}
          <span style={{ opacity: cursorOpacity, color: '#A78BFA' }}>|</span>
        </div>

        <div style={{ opacity: subOpacity, transform: `translateY(${subTranslateY}px)` }}>
          <div style={{
            fontSize: 28, color: '#94A3B8', textAlign: 'center',
            backgroundColor: 'rgba(255,255,255,0.08)', padding: '12px 28px',
            borderRadius: 24, display: 'inline-block',
          }}>
            Hermes Agent × Nous Research
          </div>
        </div>
      </div>

      {subtitleSegments && videoOffset !== undefined && (
        <div style={{
          position: 'absolute', bottom: 240, left: 40, right: 40,
          display: 'flex', justifyContent: 'center',
        }}>
          <div style={{
            fontSize: 46, fontWeight: 700, color: '#ffffff',
            textShadow: '2px 2px 6px rgba(0,0,0,0.95), 0 0 16px rgba(0,0,0,0.6)',
            textAlign: 'center',
            opacity: interpolate(frame, [0, 6], [0, 1], { extrapolateRight: 'clamp' }),
          }}>
            {subtitleSegments
              .filter((s) => s.start >= videoOffset && s.start < videoOffset + 10)
              .map((s) => s.text)[0] ?? ''}
          </div>
        </div>
      )}
    </div>
  )
}
