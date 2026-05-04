import React from 'react'
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion'
import { CenteredStack } from '../../../components'
import { SubtitleSegment } from '../composition'

interface Shot5Props {
  subtitleSegments?: SubtitleSegment[]
  videoOffset?: number
}

const FeatureCard = ({
  icon,
  title,
  description,
  color,
  progress,
}: {
  icon: string
  title: string
  description: string
  color: string
  progress: number
}) => (
  <div
    style={{
      width: '100%',
      backgroundColor: `${color}12`,
      border: `2px solid ${color}40`,
      borderRadius: 20,
      padding: '28px 32px',
      display: 'flex',
      alignItems: 'center',
      gap: 24,
      opacity: progress,
      transform: `translateX(${(1 - progress) * 40}px)`,
    }}
  >
    <div
      style={{
        width: 72,
        height: 72,
        borderRadius: 16,
        backgroundColor: `${color}25`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 36,
        flexShrink: 0,
      }}
    >
      {icon}
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ fontSize: 36, fontWeight: 800, color }}>{title}</div>
      <div style={{ fontSize: 26, fontWeight: 600, color: '#94a3b8' }}>{description}</div>
    </div>
  </div>
)

const UIMockup = ({ progress }: { progress: number }) => (
  <div
    style={{
      width: 280,
      borderRadius: 24,
      border: '3px solid #64748b',
      backgroundColor: '#1e293b',
      overflow: 'hidden',
      opacity: progress,
      transform: `scale(${0.8 + progress * 0.2})`,
    }}
  >
    {/* Status bar */}
    <div
      style={{
        height: 32,
        backgroundColor: '#0f172a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ width: 60, height: 4, borderRadius: 2, backgroundColor: '#475569' }} />
    </div>
    {/* Content area */}
    <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ height: 16, width: '80%', borderRadius: 4, backgroundColor: '#334155' }} />
      <div style={{ height: 16, width: '60%', borderRadius: 4, backgroundColor: '#334155' }} />
      <div
        style={{
          height: 120,
          borderRadius: 12,
          backgroundColor: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
          marginTop: 8,
        }}
      />
      <div style={{ height: 16, width: '90%', borderRadius: 4, backgroundColor: '#334155' }} />
      <div style={{ height: 16, width: '40%', borderRadius: 4, backgroundColor: '#334155' }} />
    </div>
  </div>
)

export const Shot5: React.FC<Shot5Props> = ({ subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const titleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' })
  const card1 = spring({ frame, fps, delay: 10, config: { damping: 15, stiffness: 100 } })
  const card2 = spring({ frame, fps, delay: 20, config: { damping: 15, stiffness: 100 } })
  const mockupProgress = interpolate(frame, [50, 70], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <CenteredStack
      background="linear-gradient(180deg, #0f172a 0%, #1a1a2e 100%)"
      justify="center"
      gap={24}
      maxWidth={900}
      subtitleSegments={subtitleSegments}
      videoOffset={videoOffset}
    >
      {/* Title */}
      <div style={{ opacity: titleOpacity, textAlign: 'center' }}>
        <div style={{ fontSize: 44, fontWeight: 900, color: '#a78bfa' }}>Thinking Mode</div>
        <div style={{ fontSize: 28, fontWeight: 600, color: '#64748b', marginTop: 4 }}>思考模式</div>
      </div>

      {/* Feature cards */}
      <FeatureCard
        icon="&#x1F50D;"
        title="自检输出"
        description="生成后自动检查并修正结果"
        color="#3b82f6"
        progress={card1}
      />
      <FeatureCard
        icon="&#x1F5BC;"
        title="多图一致性"
        description="保持多张图风格统一"
        color="#a78bfa"
        progress={card2}
      />

      {/* UI mockup */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
        <UIMockup progress={mockupProgress} />
      </div>
    </CenteredStack>
  )
}
