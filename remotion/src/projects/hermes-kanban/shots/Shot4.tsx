import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile, Easing } from 'remotion'
import type { SubtitleSegment } from '../../../components'

interface ShotProps {
  subtitleSegments?: SubtitleSegment[]
  videoOffset?: number
}

const FEATURES = [
  { icon: '🔗', label: '依赖引擎', desc: '上游完成自动推进下游', delay: 120, color: '#38BDF8' },
  { icon: '📋', label: '结构化交接', desc: 'summary + metadata 传递', delay: 160, color: '#A78BFA' },
  { icon: '🔄', label: '崩溃恢复', desc: 'Agent挂了自动释放回队列', delay: 210, color: '#4ADE80' },
  { icon: '⚡', label: '熔断通知', desc: '连续失败3次自动熔断', delay: 260, color: '#FB923C' },
]

export const Shot4: React.FC<ShotProps> = ({ subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const accentAlt = '#38BDF8'

  const titleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' })
  const titleSlide = interpolate(frame, [0, 15], [-24, 0], { extrapolateRight: 'clamp' })

  const screenshotProgress = spring({ frame, fps, config: { damping: 18, stiffness: 130 }, delay: 18 })
  const screenshotOpacity = interpolate(screenshotProgress, [0, 0.5], [0, 1])
  const screenshotScale = interpolate(screenshotProgress, [0, 1], [0.93, 1])

  const featureStyles = FEATURES.map((f) => {
    const progress = spring({ frame, fps, config: { damping: 20, stiffness: 200 }, delay: f.delay })
    return {
      opacity: interpolate(progress, [0, 0.4], [0, 1]),
      transform: `translateY(${interpolate(progress, [0, 1], [20, 0], { extrapolateRight: 'clamp' })}px)`,
    }
  })

  const dividerOpacity = interpolate(frame, [100, 115], [0, 1], { extrapolateRight: 'clamp' })
  const dividerScaleX = interpolate(frame, [100, 115], [0, 1], {
    extrapolateRight: 'clamp', easing: Easing.out(Easing.quad),
  })

  const currentSeconds = (videoOffset ?? 0) + frame / fps
  const subtitleText = subtitleSegments
    ?.find((s) => s.start <= currentSeconds && s.end > currentSeconds)
    ?.text ?? ''

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, #0C4A6E 0%, #1E293B 60%, #0F172A 100%)' }}>
      <div style={{
        position: 'absolute',
        top: 120, left: 40, right: 40, bottom: 420,
        display: 'flex', flexDirection: 'column', gap: 24,
      }}>
        {/* Title */}
        <div style={{
          fontSize: 44, fontWeight: 900, color: '#F8FAFC', textAlign: 'center',
          opacity: titleOpacity, transform: `translateY(${titleSlide}px)`,
          textShadow: `0 0 32px ${accentAlt}50`,
          letterSpacing: 1,
        }}>
          依赖引擎 + 崩溃恢复
        </div>

        {/* Screenshot — full width, portrait-friendly tall card */}
        <div style={{
          borderRadius: 20, overflow: 'hidden',
          boxShadow: `0 12px 48px rgba(0,0,0,0.7), 0 0 0 1px rgba(56,189,248,0.3)`,
          opacity: screenshotOpacity,
          transform: `scale(${screenshotScale})`,
          height: 360,
          flexShrink: 0,
        }}>
          <Img
            src={staticFile('images/hermes-kanban/research/tavily-007.png')}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
          />
          {/* Bottom gradient to blend into features */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 80,
            background: 'linear-gradient(transparent, rgba(15,23,42,0.9))',
          }} />
          {/* Label badge */}
          <div style={{
            position: 'absolute', top: 14, left: 14,
            padding: '6px 14px', borderRadius: 20,
            backgroundColor: 'rgba(56,189,248,0.2)', border: '1px solid rgba(56,189,248,0.5)',
            fontSize: 22, fontWeight: 700, color: accentAlt,
            opacity: screenshotOpacity,
          }}>
            任务抽屉 · 结构化数据
          </div>
        </div>

        {/* Divider */}
        <div style={{
          height: 2, backgroundColor: accentAlt,
          opacity: dividerOpacity,
          transform: `scaleX(${dividerScaleX})`,
          transformOrigin: 'left center',
          borderRadius: 1,
        }} />

        {/* Feature list — full width, vertical */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
          {FEATURES.map((f, i) => (
            <div key={f.label} style={{
              display: 'flex', alignItems: 'center', gap: 16,
              padding: '14px 20px', borderRadius: 16,
              backgroundColor: 'rgba(255,255,255,0.06)',
              border: `1px solid ${f.color}30`,
              ...featureStyles[i],
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                backgroundColor: `${f.color}18`,
                border: `1px solid ${f.color}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 26,
              }}>
                {f.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#F8FAFC' }}>{f.label}</div>
                <div style={{ fontSize: 22, color: '#94A3B8', marginTop: 2 }}>{f.desc}</div>
              </div>
              <div style={{
                width: 10, height: 10, borderRadius: '50%',
                backgroundColor: f.color,
                boxShadow: `0 0 8px ${f.color}`,
                opacity: interpolate(featureStyles[i].opacity as unknown as number, [0, 1], [0, 1]),
              }} />
            </div>
          ))}
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
