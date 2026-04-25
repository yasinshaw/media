import React from 'react'
import { useCurrentFrame, spring, interpolate } from 'remotion'
import { CenteredStack } from '../../../components'

interface SubtitleSegment {
  text: string
  start: number
  end: number
  duration: number
}

interface Shot6Props {
  subtitleSegments?: SubtitleSegment[]
  videoOffset?: number
}

export const Shot6: React.FC<Shot6Props> = ({ subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()

  const scale1 = spring({ frame, fps: 30, config: { damping: 12, stiffness: 80 } })
  const scale2 = spring({ frame: frame + 10, fps: 30, config: { damping: 12, stiffness: 80 } })
  const scale3 = spring({ frame: frame + 20, fps: 30, config: { damping: 12, stiffness: 80 } })
  const footerOpacity = interpolate(frame, [100, 140], [0, 1], { extrapolateRight: 'clamp' })

  const PriceCircle = ({
    size,
    price,
    label,
    color,
    scale,
  }: {
    size: number
    price: string
    label: string
    color: string
    scale: number
  }) => (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `scale(${scale})`,
        boxShadow: `0 20px 50px ${color}40`,
      }}
    >
      <div style={{ fontSize: size / 5, fontWeight: 900, color: '#fff' }}>{price}</div>
      <div style={{ fontSize: size / 9, fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>{label}</div>
    </div>
  )

  return (
    <CenteredStack
      background="linear-gradient(135deg, #1e293b 0%, #0f172a 100%)"
      justify="center"
      subtitleSegments={subtitleSegments}
      videoOffset={videoOffset}
    >
      <div style={{ fontSize: 52, fontWeight: 800, color: '#e2e8f0', marginBottom: 40 }}>价格革命</div>

      <div style={{ display: 'flex', flexDirection: 'row', gap: 40, alignItems: 'center' }}>
        <PriceCircle size={140} price="$0.14" label="V4 Flash" color="#22c55e" scale={scale1} />
        <PriceCircle size={180} price="$0.20" label="GPT-5.4 Nano" color="#f97316" scale={scale2} />
        <PriceCircle size={240} price="$1.00" label="Claude Haiku" color="#ef4444" scale={scale3} />
      </div>

      <div
        style={{
          fontSize: 32,
          fontWeight: 700,
          color: '#fbbf24',
          marginTop: 40,
          textAlign: 'center',
          opacity: footerOpacity,
        }}
      >
        V4 Pro $1.74 vs 竞品 $10+
      </div>

      <div
        style={{
          fontSize: 28,
          color: '#94a3b8',
          textAlign: 'center',
          opacity: footerOpacity,
        }}
      >
        每百万 token 价格对比
      </div>
    </CenteredStack>
  )
}
