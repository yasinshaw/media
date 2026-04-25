import { AbsoluteFill, useCurrentFrame, interpolate, spring } from 'remotion'
import React from 'react'
import { ProgressiveSubtitle } from '../../../components/ProgressiveSubtitle'

interface Shot1Props {
  subtitleSegments?: Array<{ text: string; start: number; end: number; duration: number }>
  videoOffset?: number
}

const HERO_CHARS = ['A', 'I', ' ', '军', '团', '？']

export const Shot1: React.FC<Shot1Props> = ({ subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()

  const charElements = HERO_CHARS.map((char, i) => {
    const charSpring = spring({
      frame: frame - i * 4,
      fps: 30,
      config: { damping: 12, stiffness: 200 },
    })
    const scale = interpolate(charSpring, [0, 1], [0, 1])
    const opacity = interpolate(charSpring, [0, 1], [0, 1])
    const isLast = i === HERO_CHARS.length - 1

    return (
      <span
        key={i}
        style={{
          display: 'inline-block',
          opacity,
          transform: `scale(${scale})`,
          fontSize: isLast ? 120 : 100,
          fontWeight: 900,
          color: isLast ? '#facc15' : '#ffffff',
          textShadow: isLast
            ? '0 0 40px rgba(250,204,21,0.6), 0 0 80px rgba(250,204,21,0.3)'
            : '0 0 20px rgba(59,130,246,0.5)',
        }}
      >
        {char}
      </span>
    )
  })

  const subtitleOpacity = interpolate(frame, [20, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const pulseScale = interpolate(
    Math.sin(frame * 0.15) * 0.5 + 0.5,
    [0, 1],
    [1, 1.02],
  )

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #0a0a1a 0%, #0f172a 50%, #1a0a2e 100%)',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '120px 40px 200px',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '40px',
          transform: `scale(${pulseScale})`,
        }}
      >
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {charElements}
        </div>
        <div
          style={{
            opacity: subtitleOpacity,
            fontSize: 36,
            fontWeight: 600,
            color: '#94a3b8',
            letterSpacing: '4px',
            textTransform: 'uppercase',
          }}
        >
          Claude Code 隐藏功能
        </div>
      </div>
      {subtitleSegments && (
        <ProgressiveSubtitle segments={subtitleSegments} videoOffset={videoOffset ?? 0} />
      )}
    </AbsoluteFill>
  )
}
