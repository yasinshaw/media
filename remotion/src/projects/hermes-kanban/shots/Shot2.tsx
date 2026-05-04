import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from 'remotion'
import { SafeArea } from '../../../components'
import type { SubtitleSegment } from '../../../components'

interface ShotProps {
  subtitleSegments?: SubtitleSegment[]
  videoOffset?: number
}

export const Shot2: React.FC<ShotProps> = ({ subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const accent = '#A78BFA'
  const danger = '#EF4444'

  const titleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' })
  const titleSlide = interpolate(frame, [0, 15], [30, 0], { extrapolateRight: 'clamp' })

  const mainOpacity = interpolate(frame, [30, 45], [0, 1], { extrapolateRight: 'clamp' })
  const mainScale = spring({ frame, fps, config: { damping: 20, stiffness: 200 }, delay: 30 })
  const mainTransform = interpolate(mainScale, [0, 1], [0.8, 1])

  const subAgents = ['子Agent A', '子Agent B', '子Agent C']
  const subStyles = subAgents.map((_, i) => {
    const delay = 80 + i * 25
    const opacity = interpolate(frame, [delay, delay + 15], [0, 0.7], { extrapolateRight: 'clamp' })
    const slideX = interpolate(frame, [delay, delay + 15], [-40, 0], {
      extrapolateRight: 'clamp', easing: Easing.out(Easing.quad),
    })
    return { opacity, transform: `translateX(${slideX}px)` }
  })

  const shakeProgress = interpolate(frame, [200, 240], [0, 1], { extrapolateRight: 'clamp' })
  const decay = 1 - shakeProgress
  const shakeOffset = Math.sin(frame * 1.2) * 6 * decay
  const dangerOpacity = interpolate(frame, [200, 220], [0, 1], { extrapolateRight: 'clamp' })

  const currentSeconds = (videoOffset ?? 0) + frame / fps
  const subtitleText = subtitleSegments
    ?.find((s) => s.start <= currentSeconds && s.end > currentSeconds)
    ?.text ?? ''

  return (
    <SafeArea style={{
      background: 'linear-gradient(135deg, #18181B, #27272A)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40,
    }}>
      <div style={{
        opacity: titleOpacity, transform: `translateY(${titleSlide}px)`,
        fontSize: 52, fontWeight: 800, color: '#F8FAFC',
      }}>
        传统方式：主Agent串行调度
      </div>

      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20,
        opacity: mainOpacity, transform: `scale(${mainTransform})`,
      }}>
        <div style={{
          width: 120, height: 120, borderRadius: '50%',
          backgroundColor: accent, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28, fontWeight: 800, color: '#18181B',
          boxShadow: `0 0 30px ${accent}40`,
        }}>
          主Agent
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
          {subAgents.map((label, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 20, ...subStyles[i] }}>
              <div style={{ width: 3, height: 40, backgroundColor: `${accent}40` }} />
              <div style={{
                width: 160, height: 60, borderRadius: 16,
                backgroundColor: 'rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 26, fontWeight: 700, color: '#94A3B8',
                border: `1px solid rgba(255,255,255,0.1)`,
              }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        <div style={{
          opacity: dangerOpacity,
          transform: `translateX(${shakeOffset}px)`,
          display: 'flex', gap: 16, alignItems: 'center',
        }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            backgroundColor: danger, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 40, color: '#fff', fontWeight: 900,
            boxShadow: `0 0 30px ${danger}60`,
          }}>
            ✕
          </div>
          <div style={{
            fontSize: 32, fontWeight: 800, color: danger,
          }}>
            瓶颈
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
          }}>
            {subtitleText}
          </div>
        </div>
      )}
    </SafeArea>
  )
}
