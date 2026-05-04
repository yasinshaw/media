import React from 'react'
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion'
import { SafeArea, ProgressiveSubtitle, useSlideIn, type SubtitleSegment } from '../../../components'

interface Shot1Props {
  subtitle?: string
  subtitleSegments?: SubtitleSegment[]
  videoOffset?: number
}

const FONT = 'Noto Sans SC, sans-serif'

export const Shot1: React.FC<Shot1Props> = ({ subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // --- Noise grain overlay ---
  const noiseOpacity = interpolate(frame, [0, 10], [0, 0.05], {
    extrapolateRight: 'clamp',
  })

  // --- Main text "复制" + "16次？" with word highlight ---
  const blurProgress = spring({ frame, fps, config: { damping: 18, stiffness: 100 } })
  const blur = interpolate(blurProgress, [0, 1], [20, 0], { extrapolateRight: 'clamp' })
  const titleOpacity = interpolate(blurProgress, [0, 0.6], [0, 1], { extrapolateRight: 'clamp' })

  // Highlighter wipe on "16次" using spring
  const highlightProgress = spring({
    frame: Math.max(0, frame - 15),
    fps,
    config: { damping: 14, stiffness: 120 },
  })
  const highlightPct = interpolate(highlightProgress, [0, 1], [0, 100], {
    extrapolateRight: 'clamp',
  })

  // --- Subtitle "1个skill → 16个代理" ---
  const subtitleEntry = useSlideIn(frame, 'down', 25, 40, 18)

  return (
    <AbsoluteFill
      style={{
        background: 'radial-gradient(circle at 50% 30%, #18181B, #27272A)',
        fontFamily: FONT,
      }}
    >
      {/* Noise grain overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: noiseOpacity,
          pointerEvents: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px',
        }}
      />

      <SafeArea
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Main title */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'center',
            marginBottom: 32,
            filter: `blur(${blur}px)`,
            opacity: titleOpacity,
          }}
        >
          <span
            style={{
              fontSize: 100,
              fontWeight: 900,
              color: '#F8FAFC',
              letterSpacing: 4,
            }}
          >
            {'复制'}
          </span>

          {/* "16次？" with highlighter */}
          <span style={{ position: 'relative', display: 'inline-block' }}>
            <span
              style={{
                position: 'absolute',
                bottom: 8,
                left: 0,
                width: `${highlightPct}%`,
                height: '40%',
                background: 'rgba(167, 139, 250, 0.35)',
                borderRadius: 6,
                zIndex: -1,
              }}
            />
            <span
              style={{
                fontSize: 100,
                fontWeight: 900,
                color: '#A78BFA',
                letterSpacing: 4,
              }}
            >
              {'16次？'}
            </span>
          </span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 42,
            fontWeight: 600,
            color: '#94A3B8',
            letterSpacing: 2,
            ...subtitleEntry.style,
          }}
        >
          1个skill → 16个代理
        </div>
      </SafeArea>

      {subtitleSegments && videoOffset !== undefined && (
        <ProgressiveSubtitle segments={subtitleSegments} videoOffset={videoOffset} />
      )}
    </AbsoluteFill>
  )
}
