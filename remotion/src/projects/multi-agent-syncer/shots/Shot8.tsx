import React from 'react'
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion'
import { SafeArea, ProgressiveSubtitle, useFadeIn, useSlideIn, usePulse, type SubtitleSegment } from '../../../components'

interface Shot8Props {
  subtitleSegments?: SubtitleSegment[]
  videoOffset?: number
}

const FONT = 'Noto Sans SC, sans-serif'

export const Shot8: React.FC<Shot8Props> = ({ subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Noise grain overlay
  const noiseOpacity = interpolate(frame, [0, 10], [0, 0.04], {
    extrapolateRight: 'clamp',
  })

  // Main text blurIn
  const blurProgress = spring({ frame, fps, config: { damping: 18, stiffness: 100 } })
  const blur = interpolate(blurProgress, [0, 1], [20, 0], { extrapolateRight: 'clamp' })
  const titleOpacity = interpolate(blurProgress, [0, 0.6], [0, 1], { extrapolateRight: 'clamp' })

  // Highlighter on "一键同步"
  const highlightProgress = spring({
    frame: Math.max(0, frame - 15),
    fps,
    config: { damping: 14, stiffness: 120 },
  })
  const highlightPct = interpolate(highlightProgress, [0, 1], [0, 100], {
    extrapolateRight: 'clamp',
  })

  // GitHub URL slideIn
  const urlStyle = useSlideIn(frame, 'up', 25, 50, 15)

  // Star pulse
  const starPulse = usePulse(frame, 1, 1.08, 0.06)
  const starEntry = useFadeIn(frame, 40, 15)

  return (
    <AbsoluteFill
      style={{
        background: 'radial-gradient(circle at 50% 30%, #0F172A, #1E293B)',
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
          gap: 40,
        }}
      >
        {/* Main title "一键同步" */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            filter: `blur(${blur}px)`,
            opacity: titleOpacity,
          }}
        >
          <span style={{ position: 'relative', display: 'inline-block' }}>
            <span
              style={{
                position: 'absolute',
                bottom: 6,
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
                color: '#F8FAFC',
                letterSpacing: 6,
              }}
            >
              一键同步
            </span>
          </span>
        </div>

        {/* GitHub URL */}
        <div
          style={{
            fontSize: 32,
            fontWeight: 600,
            color: '#A78BFA',
            fontFamily: 'monospace',
            letterSpacing: 1,
            ...urlStyle.style,
          }}
        >
          github.com/yasinshaw/multi-agent-syncer
        </div>

        {/* Star CTA */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            ...starEntry,
            ...starPulse.style,
          }}
        >
          <span style={{ fontSize: 56 }}>⭐</span>
          <span
            style={{
              fontSize: 40,
              fontWeight: 700,
              color: '#F8FAFC',
              fontFamily: FONT,
            }}
          >
            Star on GitHub
          </span>
        </div>
      </SafeArea>

      {subtitleSegments && videoOffset !== undefined && (
        <ProgressiveSubtitle segments={subtitleSegments} videoOffset={videoOffset} />
      )}
    </AbsoluteFill>
  )
}
