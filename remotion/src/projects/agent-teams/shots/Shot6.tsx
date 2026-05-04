import React from 'react'
import { useCurrentFrame, interpolate } from 'remotion'
import { CenteredStack } from '../../../components'

interface ShotProps {
  subtitleSegments?: Array<{ text: string; start: number; end: number; duration: number }>
  videoOffset?: number
}

const WarningCard: React.FC<{
  icon: string
  title: string
  delay: number
  frame: number
}> = ({ icon, title, delay, frame }) => {
  const fade = interpolate(frame, [delay, delay + 15], [0, 1], { extrapolateRight: 'clamp' })
  const slide = interpolate(frame, [delay, delay + 15], [-50, 0], { extrapolateRight: 'clamp' })

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '20px 24px',
        background: 'rgba(239, 68, 68, 0.15)',
        borderLeft: '4px solid #ef4444',
        borderRadius: 8,
        opacity: fade,
        transform: `translateX(${slide}px)`,
      }}
    >
      <span style={{ fontSize: 36 }}>{icon}</span>
      <span style={{ fontSize: 32, color: '#fecaca', fontWeight: 'bold' }}>{title}</span>
    </div>
  )
}

export const Shot6: React.FC<ShotProps> = ({ subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()

  const fadeIn = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <CenteredStack
      background="linear-gradient(135deg, #1f1515, #2d1f1f)"
      gap={32}
      subtitleSegments={subtitleSegments}
      videoOffset={videoOffset}
    >
      <div style={{ fontSize: 48, fontWeight: 'bold', color: '#ef4444', opacity: fadeIn }}>
        ⚠️ 三个坑
      </div>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <WarningCard icon="📝" title="指令要具体" delay={30} frame={frame} />
        <WarningCard icon="🚫" title="别同时改同一文件" delay={120} frame={frame} />
        <WarningCard icon="💰" title="简单任务别开一堆 agent" delay={210} frame={frame} />
      </div>
    </CenteredStack>
  )
}
