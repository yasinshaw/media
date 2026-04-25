import { AbsoluteFill, useCurrentFrame, interpolate, spring } from 'remotion'
import React from 'react'
import { ProgressiveSubtitle } from '../../../components/ProgressiveSubtitle'

interface Shot2Props {
  subtitleSegments?: Array<{ text: string; start: number; end: number; duration: number }>
  videoOffset?: number
}

const AGENT_LABELS = ['代码审查', '测试', '架构设计']

export const Shot2: React.FC<Shot2Props> = ({ subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()

  const leftOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
  })
  const arrowProgress = interpolate(frame, [20, 50], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const rightOpacity = interpolate(frame, [40, 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '120px 40px 200px',
        gap: '32px',
      }}
    >
      <div style={{ width: '100%', maxWidth: '900px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Top panel: single window */}
        <div
          style={{
            opacity: leftOpacity,
            transform: `translateX(${interpolate(leftOpacity, [0, 1], [-30, 0])}px)`,
            background: 'rgba(30, 41, 59, 0.8)',
            borderRadius: 20,
            padding: '36px',
            borderWidth: 2,
            borderColor: '#475569',
            borderStyle: 'solid',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 200,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div style={{ fontSize: 48, color: '#94a3b8' }}>💬</div>
            <div style={{ fontSize: 36, fontWeight: 700, color: '#e2e8f0' }}>一个人干所有事</div>
          </div>
        </div>

        {/* Arrow */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 60 }}>
          <div style={{ fontSize: 56, opacity: arrowProgress, transform: `scale(${arrowProgress})` }}>⬇️</div>
        </div>

        {/* Bottom panel: multiple windows */}
        <div
          style={{
            opacity: rightOpacity,
            transform: `translateX(${interpolate(rightOpacity, [0, 1], [30, 0])}px)`,
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          {AGENT_LABELS.map((label, i) => {
            const delay = 50 + i * 10
            const itemSpring = spring({
              frame: frame - delay,
              fps: 30,
              config: { damping: 12, stiffness: 150 },
            })
            const colors = ['#3b82f6', '#10b981', '#f59e0b']
            return (
              <div
                key={i}
                style={{
                  opacity: itemSpring,
                  transform: `scale(${itemSpring})`,
                  background: `rgba(${i === 0 ? '59,130,246' : i === 1 ? '16,185,129' : '245,158,11'}, 0.15)`,
                  borderRadius: 16,
                  padding: '28px 24px',
                  borderWidth: 2,
                  borderColor: colors[i],
                  borderStyle: 'solid',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px',
                  minWidth: 200,
                }}
              >
                <div style={{ fontSize: 40 }}>
                  {i === 0 ? '🔍' : i === 1 ? '🧪' : '🏗️'}
                </div>
                <div style={{ fontSize: 28, fontWeight: 700, color: colors[i] }}>{label}</div>
              </div>
            )
          })}
        </div>

        {/* Label */}
        <div
          style={{
            opacity: interpolate(frame, [70, 85], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            textAlign: 'center',
            fontSize: 40,
            fontWeight: 800,
            color: '#facc15',
            textShadow: '0 0 20px rgba(250,204,21,0.4)',
            marginTop: 16,
          }}
        >
          多Agent协作
        </div>
      </div>

      {subtitleSegments && (
        <ProgressiveSubtitle segments={subtitleSegments} videoOffset={videoOffset ?? 0} />
      )}
    </AbsoluteFill>
  )
}
