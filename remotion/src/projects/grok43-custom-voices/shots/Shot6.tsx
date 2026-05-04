import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import { CenteredStack, type SubtitleSegment } from '../../../components'

interface ShotProps {
  subtitleSegments?: SubtitleSegment[]
  videoOffset?: number
}

const CardBg = 'rgba(255,255,255,0.08)'

const dataCards = [
  { largeText: '80+', smallText: '预置声音', accent: '#A78BFA', delay: 15 },
  { largeText: '28', smallText: '种语言', accent: '#38BDF8', delay: 30 },
  { largeText: '$0', smallText: '克隆额外费用', accent: '#22C55E', delay: 45 },
] as const

/** rotateIn animation helper */
const useRotateIn = (delay: number, frame: number, fps: number) => {
  const progress = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 150 },
    delay,
  })
  const rotation = interpolate(progress, [0, 1], [-15, 0], { extrapolateRight: 'clamp' })
  const scale = interpolate(progress, [0, 1], [0.6, 1], { extrapolateRight: 'clamp' })
  const opacity = interpolate(progress, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' })

  return { transform: `rotate(${rotation}deg) scale(${scale})`, opacity }
}

/** fadeSlideDown animation helper */
const useFadeSlideDown = (delay: number, frame: number) => {
  const opacity = interpolate(frame, [delay, delay + 10], [0, 1], { extrapolateRight: 'clamp' })
  const translateY = interpolate(frame, [delay, delay + 10], [-30, 0], { extrapolateRight: 'clamp' })

  return { opacity, transform: `translateY(${translateY}px)` }
}

/** fadeSlideUp animation helper */
const useFadeSlideUp = (delay: number, frame: number) => {
  const opacity = interpolate(frame, [delay, delay + 10], [0, 1], { extrapolateRight: 'clamp' })
  const translateY = interpolate(frame, [delay, delay + 10], [30, 0], { extrapolateRight: 'clamp' })

  return { opacity, transform: `translateY(${translateY}px)` }
}

/** scaleIn animation helper */
const useScaleIn = (delay: number, frame: number, fps: number) => {
  const progress = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 180 },
    delay,
  })
  const scale = interpolate(progress, [0, 1], [0.5, 1], { extrapolateRight: 'clamp' })
  const opacity = interpolate(progress, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' })

  return { transform: `scale(${scale})`, opacity }
}

/** Single data card with accent border */
const DataCard: React.FC<{
  largeText: string
  smallText: string
  accent: string
  rotateInStyle: React.CSSProperties
}> = ({ largeText, smallText, accent, rotateInStyle }) => (
  <div
    style={{
      flex: 1,
      background: CardBg,
      border: `4px solid ${accent}`,
      borderRadius: 20,
      padding: 32,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      ...rotateInStyle,
    }}
  >
    <div
      style={{
        fontSize: 72,
        fontWeight: 900,
        color: '#F8FAFC',
        lineHeight: 1,
      }}
    >
      {largeText}
    </div>
    <div
      style={{
        fontSize: 28,
        color: '#94A3B8',
        fontWeight: 500,
      }}
    >
      {smallText}
    </div>
  </div>
)

export const Shot6: React.FC<ShotProps> = ({ subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Title animation
  const titleStyle = useFadeSlideDown(5, frame)

  // Card animations (staggered by 15 frames each)
  const cardStyles = dataCards.map((card) => useRotateIn(card.delay, frame, fps))

  // Pricing bar animation
  const pricingStyle = useFadeSlideUp(65, frame)

  // Starlink badge animation
  const badgeStyle = useScaleIn(80, frame, fps)

  return (
    <CenteredStack
      background="linear-gradient(135deg, #1A1A2E, #16213E)"
      gap={40}
      subtitleSegments={subtitleSegments}
      videoOffset={videoOffset}
    >
      {/* Title */}
      <div
        style={{
          fontSize: 64,
          fontWeight: 900,
          color: '#F8FAFC',
          textAlign: 'center',
          ...titleStyle,
        }}
      >
        Voice Library
      </div>

      {/* Data cards row */}
      <div
        style={{
          display: 'flex',
          width: '100%',
          gap: 20,
          position: 'relative',
        }}
      >
        {/* Starlink badge - absolute top-right */}
        <div
          style={{
            position: 'absolute',
            top: -12,
            right: 0,
            padding: '10px 24px',
            borderRadius: 24,
            background: 'rgba(167, 139, 250, 0.15)',
            border: '2px solid #A78BFA',
            fontSize: 24,
            fontWeight: 700,
            color: '#A78BFA',
            whiteSpace: 'nowrap',
            zIndex: 10,
            ...badgeStyle,
          }}
        >
          Starlink 已在用
        </div>

        {dataCards.map((card, i) => (
          <DataCard
            key={card.largeText}
            largeText={card.largeText}
            smallText={card.smallText}
            accent={card.accent}
            rotateInStyle={cardStyles[i]}
          />
        ))}
      </div>

      {/* Pricing bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
          fontSize: 30,
          fontWeight: 700,
          color: '#A78BFA',
          ...pricingStyle,
        }}
      >
        <span>TTS $4.20/M字符</span>
        <span style={{ color: '#475569' }}>|</span>
        <span style={{ color: '#38BDF8' }}>Voice Agent $3/小时</span>
      </div>
    </CenteredStack>
  )
}
