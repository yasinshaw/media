import React from 'react'
import { useCurrentFrame, interpolate } from 'remotion'
import { CenteredStack } from '../../../components'

interface ShotProps {
  subtitleSegments?: Array<{ text: string; start: number; end: number; duration: number }>
  videoOffset?: number
}

const Terminal: React.FC = () => {
  const frame = useCurrentFrame()

  const line1Fade = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' })
  const line2Fade = interpolate(frame, [30, 45], [0, 1], { extrapolateRight: 'clamp' })
  const line3Fade = interpolate(frame, [60, 75], [0, 1], { extrapolateRight: 'clamp' })

  const spin1 = frame * 12
  const spin2 = frame * 12
  const spin3 = frame * 12

  const lines = [
    {
      text: 'Agent({subagent_type: "Explore"})',
      fade: line1Fade,
      delay: 0,
      spin: spin1,
    },
    {
      text: 'Agent({subagent_type: "general-purpose"})',
      fade: line2Fade,
      delay: 30,
      spin: spin2,
    },
    {
      text: 'Agent({subagent_type: "code-reviewer"})',
      fade: line3Fade,
      delay: 60,
      spin: spin3,
    },
  ]

  return (
    <div
      style={{
        width: '100%',
        background: '#0d1117',
        borderRadius: 12,
        padding: 24,
        fontFamily: 'monospace',
        fontSize: 22,
      }}
    >
      {lines.map((line, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 16,
            opacity: line.fade,
          }}
        >
          <span style={{ color: '#58a6ff' }}>$</span>
          <span style={{ color: '#79c0ff' }}>{line.text}</span>
          {frame >= line.delay + 15 && (
            <span
              style={{
                marginLeft: 'auto',
                transform: `rotate(${line.spin}deg)`,
                display: 'inline-block',
              }}
            >
              ⏳
            </span>
          )}
        </div>
      ))}
      <div style={{ marginTop: 24, fontSize: 20, color: '#7ee787' }}>
        ✓ 3 agents 并行执行中...
      </div>
    </div>
  )
}

export const Shot5: React.FC<ShotProps> = ({ subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()

  const fadeIn = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <CenteredStack
      background="linear-gradient(135deg, #0c4a6e, #075985)"
      gap={32}
      subtitleSegments={subtitleSegments}
      videoOffset={videoOffset}
    >
      <div style={{ fontSize: 48, fontWeight: 'bold', color: '#fff' }}>
        Claude Code 实战
      </div>
      <div style={{ opacity: fadeIn }}>
        <Terminal />
      </div>
    </CenteredStack>
  )
}
