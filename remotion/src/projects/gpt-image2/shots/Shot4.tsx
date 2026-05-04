import React from 'react'
import { useCurrentFrame, useVideoConfig, spring } from 'remotion'
import { CenteredStack } from '../../../components'
import { SubtitleSegment } from '../composition'

interface Shot4Props {
  subtitleSegments?: SubtitleSegment[]
  videoOffset?: number
}

const DataCard = ({
  label,
  before,
  after,
  unit,
  color,
  progress,
  maxValue,
}: {
  label: string
  before: number
  after: number
  unit: string
  color: string
  progress: number
  maxValue: number
}) => {
  const barWidth = progress * (after / maxValue) * 100
  const oldBarWidth = progress * (before / maxValue) * 100

  return (
    <div
      style={{
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 20,
        padding: '24px 32px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        opacity: progress,
      }}
    >
      <div style={{ fontSize: 28, fontWeight: 700, color: '#94a3b8' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16 }}>
        <div style={{ fontSize: 56, fontWeight: 900, color }}>{after}</div>
        <div style={{ fontSize: 24, fontWeight: 600, color: '#64748b', marginBottom: 8 }}>{unit}</div>
      </div>
      {/* Bar chart */}
      <div style={{ position: 'relative', height: 16, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.1)' }}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: `${oldBarWidth}%`,
            backgroundColor: '#475569',
            borderRadius: 8,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: `${barWidth}%`,
            backgroundColor: color,
            borderRadius: 8,
            boxShadow: `0 0 20px ${color}60`,
          }}
        />
      </div>
      <div style={{ fontSize: 22, color: '#64748b' }}>
        <span style={{ color: '#475569' }}>{before}</span>
        <span style={{ color: '#94a3b8', margin: '0 8px' }}>→</span>
        <span style={{ color }}>{after}</span>
      </div>
    </div>
  )
}

const AspectRatioBadge = ({ progress }: { progress: number }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      opacity: progress,
    }}
  >
    <div
      style={{
        width: 160,
        height: 90,
        border: '3px solid #a78bfa',
        borderRadius: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(167,139,250,0.1)',
      }}
    >
      <span style={{ fontSize: 28, fontWeight: 800, color: '#a78bfa' }}>16:9</span>
    </div>
    <div style={{ fontSize: 26, fontWeight: 600, color: '#a78bfa' }}>新增宽屏</div>
  </div>
)

export const Shot4: React.FC<Shot4Props> = ({ subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const card1 = spring({ frame, fps, delay: 5, config: { damping: 15, stiffness: 100 } })
  const card2 = spring({ frame, fps, delay: 15, config: { damping: 15, stiffness: 100 } })
  const card3 = spring({ frame, fps, delay: 25, config: { damping: 15, stiffness: 100 } })

  return (
    <CenteredStack
      background="linear-gradient(180deg, #0f172a 0%, #1a1a2e 100%)"
      justify="center"
      gap={28}
      maxWidth={940}
      subtitleSegments={subtitleSegments}
      videoOffset={videoOffset}
    >
      <DataCard
        label="分辨率"
        before={1536}
        after={4096}
        unit="px"
        color="#3b82f6"
        progress={card1}
        maxValue={5000}
      />
      <DataCard
        label="生成速度"
        before={18}
        after={3}
        unit="秒"
        color="#22c55e"
        progress={card2}
        maxValue={25}
      />
      <AspectRatioBadge progress={card3} />
    </CenteredStack>
  )
}
