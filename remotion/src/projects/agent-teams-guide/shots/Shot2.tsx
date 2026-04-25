import React from 'react'
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion'
import { ProgressiveSubtitle } from '../../../components/ProgressiveSubtitle'

interface Shot2Props {
  subtitleSegments?: Array<{text: string, start: number, end: number, duration: number}>
  videoOffset?: number
}

export const Shot2: React.FC<Shot2Props> = ({ subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()

  // Fade in
  const fadeIn = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' })

  // Progress bar animation
  const progress = interpolate(frame, [0, 224], [0, 100], { extrapolateRight: 'clamp' })

  // Task sequence animation
  const task1Opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' })
  const task2Opacity = interpolate(frame, [30, 50], [0, 1], { extrapolateRight: 'clamp' })
  const task3Opacity = interpolate(frame, [60, 80], [0, 1], { extrapolateRight: 'clamp' })
  const task4Opacity = interpolate(frame, [90, 110], [0, 1], { extrapolateRight: 'clamp' })

  const tasks = [
    { name: '前端', opacity: task1Opacity, delay: 0 },
    { name: '后端', opacity: task2Opacity, delay: 30 },
    { name: '测试', opacity: task3Opacity, delay: 60 },
    { name: '文档', opacity: task4Opacity, delay: 90 },
  ]

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '120px 40px 200px',
    }}>
      {/* Title */}
      <div style={{
        fontSize: 56,
        fontWeight: 800,
        color: '#f87171',
        marginBottom: 80,
        opacity: fadeIn,
      }}>
        串行执行 = 效率瓶颈
      </div>

      {/* Single AI Icon */}
      <div style={{
        width: 200,
        height: 200,
        borderRadius: 100,
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 60,
        opacity: fadeIn,
      }}>
        <span style={{ fontSize: 80, color: '#fff' }}>AI</span>
      </div>

      {/* Timeline with tasks */}
      <div style={{
        width: '100%',
        maxWidth: 800,
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        opacity: fadeIn,
      }}>
        {tasks.map((task, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            opacity: task.opacity,
          }}>
            <div style={{
              width: 160,
              fontSize: 36,
              fontWeight: 600,
              color: '#e2e8f0',
              textAlign: 'right',
            }}>
              {task.name}
            </div>
            <div style={{
              flex: 1,
              height: 48,
              background: 'rgba(99, 102, 241, 0.2)',
              borderRadius: 8,
              overflow: 'hidden',
              position: 'relative',
            }}>
              {/* Animated progress bar for each task */}
              <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                height: '100%',
                width: `${Math.min(progress, (i + 1) * 25)}%`,
                background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
                borderRadius: 8,
              }} />
            </div>
            {/* Arrow */}
            <div style={{
              fontSize: 32,
              color: '#94a3b8',
            }}>
              ↓
            </div>
          </div>
        ))}
      </div>

      {/* Slow progress indicator */}
      <div style={{
        marginTop: 60,
        fontSize: 32,
        color: '#fbbf24',
        fontWeight: 600,
        opacity: fadeIn,
      }}>
        处理中...
      </div>

      {/* Progressive Subtitle */}
      {subtitleSegments && videoOffset !== undefined && (
        <ProgressiveSubtitle
          segments={subtitleSegments}
          videoOffset={videoOffset}
        />
      )}
    </AbsoluteFill>
  )
}
