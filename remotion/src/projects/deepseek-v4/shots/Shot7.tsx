import React from 'react'
import { useCurrentFrame, spring, interpolate } from 'remotion'
import { HubLayout } from '../../../components'

interface SubtitleSegment {
  text: string
  start: number
  end: number
  duration: number
}

interface Shot7Props {
  subtitleSegments?: SubtitleSegment[]
  videoOffset?: number
}

export const Shot7: React.FC<Shot7Props> = ({ subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()

  const centerScale = spring({ frame, fps: 30, config: { damping: 10, stiffness: 80 } })
  const nodeFadeIn = interpolate(frame, [20, 50], [0, 1], { extrapolateRight: 'clamp' })
  const lineFadeIn = interpolate(frame, [30, 60], [0, 1], { extrapolateRight: 'clamp' })

  const Tag = ({ label, color }: { label: string; color: string }) => (
    <div
      style={{
        padding: '16px 28px',
        background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`,
        borderRadius: 30,
        fontSize: 32,
        fontWeight: 700,
        color: '#fff',
        boxShadow: `0 10px 30px ${color}40`,
      }}
    >
      {label}
    </div>
  )

  return (
    <HubLayout
      background="linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)"
      center={{
        node: (
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: 72,
                fontWeight: 900,
                background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              DeepSeek V4
            </div>
          </div>
        ),
        scale: centerScale,
      }}
      surrounding={[
        { position: 'top-left', node: <Tag label="开源" color="#22c55e" />, opacity: nodeFadeIn },
        { position: 'top-right', node: <Tag label="最大模型" color="#3b82f6" />, opacity: nodeFadeIn },
        { position: 'bottom-left', node: <Tag label="最便宜" color="#fbbf24" />, opacity: nodeFadeIn },
        { position: 'bottom-right', node: <Tag label="数学领先" color="#a855f7" />, opacity: nodeFadeIn },
      ]}
      radius={280}
      connectionColor="#60a5fa"
      connectionsOpacity={lineFadeIn}
      footer={
        <div
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: '#fff',
            textAlign: 'center',
            padding: '24px 48px',
            background: 'rgba(96, 165, 250, 0.2)',
            borderRadius: 40,
            border: '2px solid rgba(96, 165, 250, 0.5)',
          }}
        >
          关注我，第一时间解读最新 AI 动态
        </div>
      }
      subtitleSegments={subtitleSegments}
      videoOffset={videoOffset}
    />
  )
}
