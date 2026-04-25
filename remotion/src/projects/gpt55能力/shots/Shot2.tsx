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

export const Shot2: React.FC<ShotProps> = ({ subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()
  const progress = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
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
        gap: '40px'
      }}>
        <div style={{
          fontSize: '48px',
          fontWeight: 800,
          color: '#ffffff',
          textAlign: 'center',
          opacity: progress
        }}>
          GPT-5.4 vs GPT-5.5
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '20px',
          padding: '32px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px',
            background: 'rgba(37, 99, 235, 0.2)',
            borderRadius: '12px',
            opacity: interpolate(frame, [15, 45], [0, 1], { extrapolateRight: 'clamp' })
          }}>
            <span style={{ fontSize: '36px', color: '#e0e0e0', fontWeight: 600 }}>推理能力</span>
            <span style={{ fontSize: '40px', color: '#4ade80', fontWeight: 800 }}>+8%</span>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px',
            background: 'rgba(37, 99, 235, 0.2)',
            borderRadius: '12px',
            opacity: interpolate(frame, [30, 60], [0, 1], { extrapolateRight: 'clamp' })
          }}>
            <span style={{ fontSize: '36px', color: '#e0e0e0', fontWeight: 600 }}>代码能力</span>
            <span style={{ fontSize: '40px', color: '#4ade80', fontWeight: 800 }}>+9%</span>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px',
            background: 'rgba(37, 99, 235, 0.2)',
            borderRadius: '12px',
            opacity: interpolate(frame, [45, 75], [0, 1], { extrapolateRight: 'clamp' })
          }}>
            <span style={{ fontSize: '36px', color: '#e0e0e0', fontWeight: 600 }}>计算机操作</span>
            <span style={{ fontSize: '40px', color: '#4ade80', fontWeight: 800 }}>+5%</span>
          </div>
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
