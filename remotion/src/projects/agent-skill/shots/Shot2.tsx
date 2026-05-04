import React from 'react'
import { useCurrentFrame, interpolate } from 'remotion'
import { TwoColumnCompare } from '../../../components'

interface ShotProps {
  subtitleSegments?: Array<{ text: string; start: number; end: number; duration: number }>
  videoOffset?: number
}

const UserRequest: React.FC = () => (
  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 20 }}>
    <div
      style={{
        padding: '20px 28px',
        background: '#1e293b',
        borderRadius: 16,
        fontSize: 28,
        color: '#e2e8f0',
        borderLeft: '4px solid #3b82f6',
      }}
    >
      按我们团队规范写代码
    </div>
    <div
      style={{
        padding: '16px 28px',
        background: '#1e293b',
        borderRadius: 16,
        fontSize: 26,
        color: '#94a3b8',
        borderLeft: '4px solid #3b82f6',
      }}
    >
      TypeScript + React
    </div>
    <div
      style={{
        padding: '16px 28px',
        background: '#1e293b',
        borderRadius: 16,
        fontSize: 26,
        color: '#94a3b8',
        borderLeft: '4px solid #3b82f6',
      }}
    >
      遵循 ESLint + Prettier
    </div>
  </div>
)

const AiResponse: React.FC = () => (
  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 20 }}>
    <div
      style={{
        padding: '20px 28px',
        background: '#1e293b',
        borderRadius: 16,
        fontSize: 28,
        color: '#fca5a5',
        borderLeft: '4px solid #ef4444',
      }}
    >
      当然！这是个好问题...
    </div>
    <div
      style={{
        padding: '16px 28px',
        background: '#1e293b',
        borderRadius: 16,
        fontSize: 26,
        color: '#94a3b8',
        borderLeft: '4px solid #ef4444',
      }}
    >
      一般来说，你可以考虑...
    </div>
    <div style={{ textAlign: 'center', fontSize: 56, marginTop: 8 }}>❓</div>
  </div>
)

export const Shot2: React.FC<ShotProps> = ({ subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()

  const leftOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' })
  const rightOpacity = interpolate(frame, [10, 25], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <TwoColumnCompare
      background="linear-gradient(135deg, #0f172a, #1e293b)"
      left={{
        title: '你的需求',
        body: <UserRequest />,
        accent: '#3b82f6',
        opacity: leftOpacity,
      }}
      right={{
        title: 'AI 的回答',
        body: <AiResponse />,
        accent: '#ef4444',
        opacity: rightOpacity,
      }}
      footer={
        <div
          style={{
            fontSize: 36,
            fontWeight: 800,
            color: '#fbbf24',
            padding: '12px 36px',
            background: 'rgba(251, 191, 36, 0.1)',
            borderRadius: 20,
          }}
        >
          通用 AI ≠ 你的 AI
        </div>
      }
      subtitleSegments={subtitleSegments}
      videoOffset={videoOffset}
    />
  )
}
