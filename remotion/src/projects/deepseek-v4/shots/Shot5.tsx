import React from 'react'
import { useCurrentFrame, interpolate } from 'remotion'
import { TimelineFlow } from '../../../components'

interface SubtitleSegment {
  text: string
  start: number
  end: number
  duration: number
}

interface Shot5Props {
  subtitleSegments?: SubtitleSegment[]
  videoOffset?: number
}

export const Shot5: React.FC<Shot5Props> = ({ subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()

  const fade1 = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: 'clamp' })
  const fade2 = interpolate(frame, [50, 80], [0, 1], { extrapolateRight: 'clamp' })
  const fade3 = interpolate(frame, [100, 130], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <TimelineFlow
      direction="vertical"
      background="linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
      accent="#22c55e"
      showConnectors={true}
      header={
        <div
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: '#fff',
            textAlign: 'center',
          }}
        >
          国际擂台
        </div>
      }
      items={[
        {
          label: 'BrowseComp 83.4%',
          detail: '超 Claude Opus 4.7 (79.3%)',
          icon: '🌐',
          color: '#22c55e',
          opacity: fade1,
        },
        {
          label: 'SWE-Bench 55.4%',
          detail: '接近 GPT-5.5 (58.6%)',
          icon: '📊',
          color: '#fbbf24',
          opacity: fade2,
        },
        {
          label: '数学推理',
          detail: '超越 GPT-5',
          icon: '🧮',
          color: '#22c55e',
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
          }}
        >
          搜索 + 数学 = 世界第一梯队
        </div>
      }
      subtitleSegments={subtitleSegments}
      videoOffset={videoOffset}
    />
  )
}
