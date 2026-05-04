import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile, Easing } from 'remotion'
import type { SubtitleSegment } from '../../../components'

interface ShotProps {
  subtitleSegments?: SubtitleSegment[]
  videoOffset?: number
}

export const Shot3: React.FC<ShotProps> = ({ subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const accent = '#A78BFA'
  const accentAlt = '#38BDF8'
  const green = '#4ADE80'

  const titleOpacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp' })
  const titleSlide = interpolate(frame, [0, 12], [-20, 0], { extrapolateRight: 'clamp' })

  const screenshotScale = spring({ frame, fps, config: { damping: 20, stiffness: 150 }, delay: 20 })
  const screenshotOpacity = interpolate(screenshotScale, [0, 0.5], [0, 1])

  const tag1Opacity = interpolate(frame, [80, 95], [0, 1], { extrapolateRight: 'clamp' })
  const tag1SlideX = interpolate(frame, [80, 95], [20, 0], {
    extrapolateRight: 'clamp', easing: Easing.out(Easing.quad),
  })

  const tag2Opacity = interpolate(frame, [100, 115], [0, 1], { extrapolateRight: 'clamp' })
  const tag2SlideX = interpolate(frame, [100, 115], [20, 0], {
    extrapolateRight: 'clamp', easing: Easing.out(Easing.quad),
  })

  const lockProgress = spring({ frame, fps, config: { damping: 15, stiffness: 200 }, delay: 140 })
  const lockScale = interpolate(lockProgress, [0, 1], [0.5, 1])
  const lockOpacity = interpolate(lockProgress, [0, 0.4], [0, 1])

  const currentSeconds = (videoOffset ?? 0) + frame / fps
  const subtitleText = subtitleSegments
    ?.find((s) => s.start <= currentSeconds && s.end > currentSeconds)
    ?.text ?? ''

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #1E1B4B, #312E81)' }}>
      <div style={{
        position: 'absolute', top: 120, left: 40, right: 40,
        display: 'flex', flexDirection: 'column', gap: 20,
        bottom: 420,
      }}>
        <div style={{
          fontSize: 44, fontWeight: 900, color: '#F8FAFC', textAlign: 'center',
          opacity: titleOpacity, transform: `translateY(${titleSlide}px)`,
          textShadow: `0 0 30px ${accent}40`,
        }}>
          Hermes看板：任务上板，自己抢
        </div>

        {/* Kanban board screenshot */}
        <div style={{
          borderRadius: 20, overflow: 'hidden',
          boxShadow: `0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(167,139,250,0.2)`,
          opacity: screenshotOpacity,
          transform: `scale(${interpolate(screenshotScale, [0, 1], [0.92, 1])})`,
          flex: 1,
        }}>
          <Img
            src={staticFile('images/hermes-kanban/research/tavily-001.png')}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, transparent 50%, rgba(30,27,75,0.85) 100%)',
          }} />
        </div>

        {/* Annotation tags */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <div style={{
            padding: '8px 20px', borderRadius: 24,
            backgroundColor: `${accent}25`, border: `1px solid ${accent}60`,
            fontSize: 26, fontWeight: 700, color: accent,
            opacity: tag1Opacity, transform: `translateX(${tag1SlideX}px)`,
          }}>
            📋 任务上板
          </div>
          <div style={{
            padding: '8px 20px', borderRadius: 24,
            backgroundColor: `${accentAlt}25`, border: `1px solid ${accentAlt}60`,
            fontSize: 26, fontWeight: 700, color: accentAlt,
            opacity: tag2Opacity, transform: `translateX(${tag2SlideX}px)`,
          }}>
            🤖 Agent自己认领
          </div>
          <div style={{
            padding: '8px 20px', borderRadius: 24,
            backgroundColor: `${green}25`, border: `1px solid ${green}60`,
            fontSize: 26, fontWeight: 700, color: green,
            opacity: lockOpacity, transform: `scale(${lockScale})`,
          }}>
            🔒 原子锁
          </div>
        </div>
      </div>

      {subtitleText && (
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
            {subtitleText}
          </div>
        </div>
      )}
    </div>
  )
}
