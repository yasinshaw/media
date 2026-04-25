import React from 'react'
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion'
import { ProgressiveSubtitle } from '../../../components'

interface SubtitleSegment {
  text: string
  start: number
  end: number
  duration: number
}

interface ShotProps {
  subtitleSegments?: SubtitleSegment[]
  videoOffset?: number
}

export const Shot4: React.FC<ShotProps> = ({ subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()

  const tools = [
    { name: '写代码', icon: '💻', startFrame: 0 },
    { name: '做研究', icon: '📊', startFrame: 20 },
    { name: '分析数据', icon: '📈', startFrame: 40 }
  ]

  const centerProgress = interpolate(frame, [0, 60], [0, 1], { extrapolateRight: 'clamp' })
  const ringProgress = interpolate(frame, [60, 120], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(135deg, #1a1a2e 0%, #4a0e4e 100%)',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '120px 40px 200px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '900px',
        display: 'flex',
        flexDirection: 'column',
        gap: '48px',
        alignItems: 'center'
      }}>
        <div style={{
          fontSize: '52px',
          fontWeight: 800,
          color: '#ffffff',
          textAlign: 'center',
          opacity: centerProgress
        }}>
          Agent 自主协作
        </div>

        <div style={{ position: 'relative', width: '400px', height: '400px' }}>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) scale(${centerProgress})`,
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '72px',
            boxShadow: '0 0 60px rgba(102, 126, 234, 0.6)'
          }}>
            🤖
          </div>

          {tools.map((tool, idx) => {
            const angle = (idx * 120 - 90) * Math.PI / 180
            const radius = 140
            const x = Math.cos(angle) * radius
            const y = Math.sin(angle) * radius
            const toolProgress = interpolate(
              frame,
              [tool.startFrame, tool.startFrame + 30],
              [0, 1],
              { extrapolateRight: 'clamp' }
            )

            return (
              <div key={idx} style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: `translate(calc(-50% + ${x * ringProgress}px), calc(-50% + ${y * ringProgress}px))`,
                opacity: toolProgress,
                scale: toolProgress
              }}>
                <div style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '20px',
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <div style={{ fontSize: '40px' }}>{tool.icon}</div>
                  <div style={{ fontSize: '20px', color: '#ffffff', fontWeight: 600 }}>{tool.name}</div>
                </div>
              </div>
            )
          })}

          <svg style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: ringProgress * 0.5
          }}>
            <circle
              cx="200"
              cy="200"
              r="140"
              fill="none"
              stroke="rgba(102, 126, 234, 0.4)"
              strokeWidth="2"
              strokeDasharray="8 8"
            />
          </svg>
        </div>

        <div style={{
          fontSize: '36px',
          color: '#e0e0e0',
          textAlign: 'center',
          opacity: ringProgress
        }}>
          跨工具协作 · 一条龙搞定
        </div>
      </div>

      {subtitleSegments && (
        <ProgressiveSubtitle
          segments={subtitleSegments}
          videoOffset={videoOffset || 0}
        />
      )}
    </AbsoluteFill>
  )
}
