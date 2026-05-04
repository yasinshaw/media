import React from 'react'
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion'
import { CenteredStack } from '../../../components'
import { SubtitleSegment } from '../composition'

interface Shot2Props {
  subtitleSegments?: SubtitleSegment[]
  videoOffset?: number
}

const StatCard = ({
  value,
  label,
  color,
  progress,
}: {
  value: string
  label: string
  color: string
  progress: number
}) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8,
      opacity: progress,
    }}
  >
    <div
      style={{
        fontSize: 64,
        fontWeight: 900,
        color,
        textShadow: `0 0 30px ${color}40`,
      }}
    >
      {value}
    </div>
    <div style={{ fontSize: 28, fontWeight: 600, color: '#94a3b8' }}>{label}</div>
  </div>
)

export const Shot2: React.FC<Shot2Props> = ({ subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const timelineOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' })
  const stat1 = spring({ frame, fps, delay: 10, config: { damping: 15, stiffness: 120 } })
  const stat2 = spring({ frame, fps, delay: 20, config: { damping: 15, stiffness: 120 } })
  const tagOpacity = interpolate(frame, [60, 80], [0, 1], { extrapolateRight: 'clamp' })
  const warningScale = spring({ frame, fps, delay: 55, config: { damping: 10, stiffness: 200 } })

  return (
    <CenteredStack
      background="linear-gradient(180deg, #0f172a 0%, #1a1a2e 100%)"
      justify="center"
      gap={40}
      subtitleSegments={subtitleSegments}
      videoOffset={videoOffset}
    >
      {/* Timeline */}
      <div style={{ opacity: timelineOpacity, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <div
          style={{
            fontSize: 48,
            fontWeight: 800,
            color: '#60a5fa',
          }}
        >
          GPT Image 1
        </div>
        <div style={{ fontSize: 28, fontWeight: 600, color: '#64748b' }}>2025.03.25 发布</div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 48 }}>
        <StatCard value="1.3亿" label="首周用户" color="#f59e0b" progress={stat1} />
        <StatCard value="7亿+" label="生成图片" color="#f59e0b" progress={stat2} />
      </div>

      {/* Ghibli tag */}
      <div
        style={{
          opacity: tagOpacity,
          fontSize: 32,
          fontWeight: 700,
          color: '#a78bfa',
          textAlign: 'center',
        }}
      >
        吉卜力风潮刷屏全网
      </div>

      {/* Warning badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          backgroundColor: 'rgba(239,68,68,0.15)',
          border: '2px solid #ef4444',
          borderRadius: 16,
          padding: '16px 32px',
          transform: `scale(${warningScale})`,
        }}
      >
        <div style={{ fontSize: 36, color: '#ef4444' }}>&#9888;</div>
        <div style={{ fontSize: 36, fontWeight: 800, color: '#ef4444' }}>致命弱点：文字</div>
      </div>
    </CenteredStack>
  )
}
