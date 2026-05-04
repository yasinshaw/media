import React from 'react'
import { useCurrentFrame, interpolate } from 'remotion'
import { TimelineFlow } from '../../../components'

interface ShotProps {
  subtitleSegments?: Array<{ text: string; start: number; end: number; duration: number }>
  videoOffset?: number
}

export const Shot3: React.FC<ShotProps> = ({ subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()

  const item1Fade = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' })
  const item2Fade = interpolate(frame, [30, 45], [0, 1], { extrapolateRight: 'clamp' })
  const item3Fade = interpolate(frame, [60, 75], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <TimelineFlow
      background="linear-gradient(135deg, #1e1b4b, #312e81)"
      accent="#6366f1"
      direction="horizontal"
      items={[
        {
          icon: '🔥',
          label: 'CrewAI',
          detail: '带火 Agent Teams 概念 · 2023',
          opacity: item1Fade,
        },
        {
          icon: '🎓',
          label: 'Andrew Ng',
          detail: '提出 Agentic 设计模式 · 2024',
          opacity: item2Fade,
        },
        {
          icon: '⚡',
          label: 'Claude Code',
          detail: '内置 Agent Teams 功能 · 2025',
          opacity: item3Fade,
        },
      ]}
      footer={
        <div style={{ fontSize: 24, color: '#a5b4fc', textAlign: 'center' }}>
          从概念到产品，Agent Teams 逐渐成熟
        </div>
      }
      subtitleSegments={subtitleSegments}
      videoOffset={videoOffset}
    />
  )
}
