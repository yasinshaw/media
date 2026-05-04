import React from 'react'
import { useCurrentFrame } from 'remotion'
import { CenteredStack, useStagger, useNumberRoll, useFadeIn } from '../../../components'

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

  const stagger = useStagger(frame, 3, 10, 15)
  const footer = useFadeIn(frame, 100, 20)

  const price1 = useNumberRoll(frame, 0.14, 45, 10, 2)
  const price2 = useNumberRoll(frame, 0.20, 45, 20, 2)
  const price3 = useNumberRoll(frame, 1.00, 45, 30, 2)

  const PriceCircle = ({
    size,
    price,
    label,
    color,
    staggerStyle,
  }: {
    size: number
    price: string
    label: string
    color: string
    staggerStyle: React.CSSProperties
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
        ...staggerStyle,
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
        <PriceCircle size={140} price={`$${price1.toFixed(2)}`} label="V4 Flash" color="#22c55e" staggerStyle={stagger[0].style} />
        <PriceCircle size={180} price={`$${price2.toFixed(2)}`} label="GPT-5.4 Nano" color="#f97316" staggerStyle={stagger[1].style} />
        <PriceCircle size={240} price={`$${price3.toFixed(2)}`} label="Claude Haiku" color="#ef4444" staggerStyle={stagger[2].style} />
      </div>

      <div
        style={{
          fontSize: 32,
          fontWeight: 700,
          color: '#fbbf24',
          marginTop: 40,
          textAlign: 'center',
          opacity: footer.style.opacity,
        }}
      >
        V4 Pro $1.74 vs 竞品 $10+
      </div>

      <div
        style={{
          fontSize: 28,
          color: '#94a3b8',
          textAlign: 'center',
          opacity: footer.style.opacity,
        }}
      >
        每百万 token 价格对比
      </div>
    </CenteredStack>
  )
}
