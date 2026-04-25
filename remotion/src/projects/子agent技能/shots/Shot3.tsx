import { AbsoluteFill, useCurrentFrame, interpolate, spring } from 'remotion'
import React from 'react'
import { ProgressiveSubtitle } from '../../../components/ProgressiveSubtitle'

interface Shot3Props {
  subtitleSegments?: Array<{ text: string; start: number; end: number; duration: number }>
  videoOffset?: number
}

const NODES = [
  { label: '代码审查员', icon: '🔍', color: '#3b82f6', angle: -90 },
  { label: '测试工程师', icon: '🧪', color: '#10b981', angle: 150 },
  { label: '架构师', icon: '🏗️', color: '#f59e0b', angle: 30 },
]

const RADIUS = 260

export const Shot3: React.FC<Shot3Props> = ({ subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()

  const centerScale = spring({
    frame,
    fps: 30,
    config: { damping: 14, stiffness: 120 },
  })

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(180deg, #0f172a 0%, #1a0a2e 100%)',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '120px 40px 200px',
      }}
    >
      <div style={{ position: 'relative', width: 700, height: 700 }}>
        {/* Connection lines */}
        {NODES.map((node, i) => {
          const x = 350 + RADIUS * Math.cos((node.angle * Math.PI) / 180)
          const y = 350 + RADIUS * Math.sin((node.angle * Math.PI) / 180)
          const lineProgress = interpolate(frame, [20 + i * 15, 40 + i * 15], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })
          return (
            <svg
              key={`line-${i}`}
              style={{ position: 'absolute', top: 0, left: 0, width: 700, height: 700 }}
            >
              <line
                x1={350}
                y1={350}
                x2={350 + (x - 350) * lineProgress}
                y2={350 + (y - 350) * lineProgress}
                stroke={node.color}
                strokeWidth={3}
                strokeDasharray="8 4"
                opacity={0.6}
              />
            </svg>
          )
        })}

        {/* Center node: Claude Code 主对话 */}
        <div
          style={{
            position: 'absolute',
            left: 350 - 90,
            top: 350 - 90,
            width: 180,
            height: 180,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `scale(${centerScale})`,
            boxShadow: '0 0 40px rgba(59,130,246,0.4)',
            zIndex: 2,
          }}
        >
          <div style={{ fontSize: 48 }}>🤖</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginTop: 8, textAlign: 'center' }}>
            主对话
          </div>
        </div>

        {/* Agent nodes */}
        {NODES.map((node, i) => {
          const x = 350 + RADIUS * Math.cos((node.angle * Math.PI) / 180)
          const y = 350 + RADIUS * Math.sin((node.angle * Math.PI) / 180)
          const nodeSpring = spring({
            frame: frame - 30 - i * 15,
            fps: 30,
            config: { damping: 12, stiffness: 150 },
          })
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: x - 80,
                top: y - 80,
                width: 160,
                height: 160,
                opacity: nodeSpring,
                transform: `scale(${nodeSpring})`,
              }}
            >
              <div
                style={{
                  width: 160,
                  height: 160,
                  borderRadius: '50%',
                  background: `rgba(${node.color === '#3b82f6' ? '59,130,246' : node.color === '#10b981' ? '16,185,129' : '245,158,11'}, 0.15)`,
                  borderWidth: 3,
                  borderColor: node.color,
                  borderStyle: 'solid',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                }}
              >
                <div style={{ fontSize: 36 }}>{node.icon}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#e2e8f0' }}>{node.label}</div>
                <div
                  style={{
                    fontSize: 14,
                    color: '#94a3b8',
                    background: 'rgba(148,163,184,0.15)',
                    padding: '2px 8px',
                    borderRadius: 8,
                  }}
                >
                  独立上下文
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {subtitleSegments && (
        <ProgressiveSubtitle segments={subtitleSegments} videoOffset={videoOffset ?? 0} />
      )}
    </AbsoluteFill>
  )
}
