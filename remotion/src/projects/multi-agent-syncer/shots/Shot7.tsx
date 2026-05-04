import React from 'react'
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion'
import { CenteredStack, type SubtitleSegment } from '../../../components'

interface Shot7Props {
  subtitleSegments?: SubtitleSegment[]
  videoOffset?: number
}

const FONT = 'Noto Sans SC, sans-serif'

const ADVANTAGES = [
  {
    title: 'Symlink 项目级同步',
    desc: '零拷贝 · 按项目精准管控',
    accent: '#A78BFA',
    large: true,
  },
  {
    title: '最轻量',
    desc: '~800行代码',
    accent: '#38BDF8',
    large: false,
  },
  {
    title: '全覆盖',
    desc: '16+ 代理',
    accent: '#34D399',
    large: false,
  },
  {
    title: '自举能力',
    desc: '管理自己',
    accent: '#F59E0B',
    large: false,
    recursive: true,
  },
]

export const Shot7: React.FC<Shot7Props> = ({ subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  return (
    <CenteredStack
      background="linear-gradient(135deg, #1E1B4B, #312E81)"
      justify="center"
      subtitleSegments={subtitleSegments}
      videoOffset={videoOffset}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 20,
          width: '100%',
          maxWidth: 820,
        }}
      >
        {ADVANTAGES.map((adv, i) => {
          // rotateIn animation via spring
          const springProgress = spring({
            frame: Math.max(0, frame - i * 10),
            fps,
            config: { damping: 12, stiffness: 150 },
          })
          const rotation = interpolate(springProgress, [0, 1], [-15, 0], { extrapolateRight: 'clamp' })
          const scale = interpolate(springProgress, [0, 1], [0.6, 1], { extrapolateRight: 'clamp' })
          const opacity = interpolate(springProgress, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' })

          // Pulse for the large card
          const pulseScale = adv.large
            ? interpolate(Math.sin((frame - i * 10) * 0.08), [-1, 1], [1, 1.03])
            : 1

          return (
            <div
              key={adv.title}
              style={{
                padding: adv.large ? '32px 28px' : '28px 24px',
                borderRadius: 20,
                background: adv.large
                  ? `linear-gradient(135deg, rgba(167, 139, 250, 0.15), rgba(167, 139, 250, 0.05))`
                  : 'rgba(255, 255, 255, 0.05)',
                border: `2px solid ${adv.accent}${adv.large ? '40' : '20'}`,
                boxShadow: adv.large ? `0 0 40px ${adv.accent}15` : 'none',
                transform: `rotate(${rotation}deg) scale(${scale * pulseScale})`,
                opacity,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <div
                style={{
                  fontSize: adv.large ? 34 : 30,
                  fontWeight: 800,
                  color: adv.accent,
                  fontFamily: FONT,
                }}
              >
                {adv.title}
              </div>
              <div
                style={{
                  fontSize: adv.large ? 26 : 24,
                  fontWeight: 500,
                  color: '#94A3B8',
                  fontFamily: FONT,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                {adv.desc}
                {adv.recursive && (
                  <span style={{ fontSize: 22 }}>🔄</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </CenteredStack>
  )
}
