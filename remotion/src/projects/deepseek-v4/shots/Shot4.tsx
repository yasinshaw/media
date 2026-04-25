import React from 'react'
import { useCurrentFrame, interpolate } from 'remotion'
import { TimelineFlow } from '../../../components'

interface SubtitleSegment {
  text: string
  start: number
  end: number
  duration: number
}

interface Shot4Props {
  subtitleSegments?: SubtitleSegment[]
  videoOffset?: number
}

export const Shot4: React.FC<Shot4Props> = ({ subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()

  const fade1 = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' })
  const fade2 = interpolate(frame, [40, 70], [0, 1], { extrapolateRight: 'clamp' })
  const fade3 = interpolate(frame, [90, 120], [0, 1], { extrapolateRight: 'clamp' })
  const fade4 = interpolate(frame, [140, 170], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <TimelineFlow
      direction="vertical"
      background="linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)"
      accent="#fbbf24"
      showConnectors={false}
      header={
        <div
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: '#fbbf24',
            textAlign: 'center',
          }}
        >
          国内大模型跑分擂台
        </div>
      }
      items={[
        {
          label: 'SWE-Bench',
          detail: 'Kimi K2.5 76.8% 🏆 | V4 55.4%',
          icon: '📊',
          opacity: fade1,
        },
        {
          label: 'HumanEval',
          detail: 'V4 76.8% vs V3.2 62.8%',
          icon: '💻',
          opacity: fade2,
        },
        {
          label: '数学推理',
          detail: 'V4 领先国产对手',
          icon: '🧮',
          opacity: fade3,
        },
      ]}
      footer={
        <div
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: '#22c55e',
            textAlign: 'center',
            opacity: fade4,
            padding: 24,
            background: 'rgba(34, 197, 94, 0.1)',
            borderRadius: 16,
          }}
        >
          ✅ V4 = 最大开源 + 最便宜 + 数学领先
        </div>
      }
      subtitleSegments={subtitleSegments}
      videoOffset={videoOffset}
    />
  )
}
