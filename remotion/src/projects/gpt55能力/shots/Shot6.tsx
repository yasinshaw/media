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

export const Shot6: React.FC<ShotProps> = ({ subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()

  const data = [
    { label: 'GPT-5.5', value: 84.4, color: '#3b82f6' },
    { label: 'Gemini 3.1 Pro', value: 85.9, color: '#f59e0b' }
  ]

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
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
        gap: '32px'
      }}>
        <div style={{
          fontSize: '48px',
          fontWeight: 800,
          color: '#ffffff',
          textAlign: 'center'
        }}>
          BrowseComp 网页浏览测试
        </div>

        <div style={{
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '20px',
          padding: '48px',
          border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          gap: '40px',
          alignItems: 'flex-end'
        }}>
          {data.map((item, idx) => {
            const barProgress = interpolate(
              frame,
              [idx * 30, idx * 30 + 60],
              [0, 1],
              { extrapolateRight: 'clamp' }
            )
            const height = item.value * 4 * barProgress

            return (
              <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  fontSize: '48px',
                  color: item.color,
                  fontWeight: 800,
                  marginBottom: '16px',
                  opacity: barProgress
                }}>
                  {item.value}%
                </div>
                <div style={{
                  width: '100%',
                  height: `${height}px`,
                  minHeight: '40px',
                  background: `linear-gradient(180deg, ${item.color}, ${item.color}88)`,
                  borderRadius: '12px 12px 0 0',
                  transition: 'height 0.3s'
                }} />
                <div style={{
                  fontSize: '28px',
                  color: '#ffffff',
                  fontWeight: 600,
                  marginTop: '16px',
                  textAlign: 'center'
                }}>
                  {item.label}
                </div>
              </div>
            )
          })}
        </div>

        <div style={{
          fontSize: '44px',
          color: '#f59e0b',
          fontWeight: 800,
          textAlign: 'center',
          opacity: interpolate(frame, [120, 150], [0, 1], { extrapolateRight: 'clamp' })
        }}>
          Gemini 反超！
        </div>

        <div style={{
          fontSize: '32px',
          color: '#e0e0e0',
          textAlign: 'center',
          opacity: interpolate(frame, [150, 180], [0, 1], { extrapolateRight: 'clamp' })
        }}>
          选 AI 工具，别只看综合分
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
