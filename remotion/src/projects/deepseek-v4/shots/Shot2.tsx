import React from 'react'
import { useCurrentFrame, interpolate, spring } from 'remotion'
import { TwoColumnCompare } from '../../../components'

interface SubtitleSegment {
  text: string
  start: number
  end: number
  duration: number
}

interface Shot2Props {
  subtitleSegments?: SubtitleSegment[]
  videoOffset?: number
}

export const Shot2: React.FC<Shot2Props> = ({ subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()

  const leftHeight = spring({
    frame,
    fps: 30,
    config: { damping: 15, stiffness: 80 },
  })

  const rightHeight = spring({
    frame: frame + 10,
    fps: 30,
    config: { damping: 15, stiffness: 80 },
  })

  const priceTagOpacity = interpolate(frame, [60, 100], [0, 1], { extrapolateRight: 'clamp' })

  const BarChart = ({ height, color, label }: { height: number; color: string; label: string }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
      <div
        style={{
          width: 100,
          height: 200 * height,
          background: `linear-gradient(180deg, ${color} 0%, ${color}cc 100%)`,
          borderRadius: 12,
          minHeight: 20,
        }}
      />
      <div style={{ fontSize: 28, fontWeight: 600, color: '#e2e8f0' }}>{label}</div>
    </div>
  )

  return (
    <TwoColumnCompare
      direction="vertical"
      background="linear-gradient(135deg, #1e293b 0%, #334155 100%)"
      left={{
        title: '美国前沿模型',
        body: (
          <div style={{ display: 'flex', flexDirection: 'row', gap: 40, justifyContent: 'center', alignItems: 'flex-end' }}>
            <BarChart height={leftHeight} color="#ef4444" label="GPT-5.5" />
            <BarChart height={leftHeight * 0.95} color="#f97316" label="Claude Opus" />
          </div>
        ),
        caption: '性能顶尖',
        accent: '#ef4444',
      }}
      right={{
        title: 'DeepSeek V4',
        body: (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <BarChart height={rightHeight} color="#22c55e" label="V4" />
          </div>
        ),
        caption: '性能逼近对手',
        accent: '#22c55e',
      }}
      footer={
        <div
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: '#fbbf24',
            opacity: priceTagOpacity,
            textAlign: 'center',
          }}
        >
          💰 价格仅 1/6
        </div>
      }
      subtitleSegments={subtitleSegments}
      videoOffset={videoOffset}
    />
  )
}
