import React from 'react'
import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion'
import { Starburst } from '@remotion/starburst'
import { CenteredStack, type SubtitleSegment } from '../../../components'

interface Shot7Props {
  subtitleSegments?: SubtitleSegment[]
  videoOffset?: number
}

export const Shot7: React.FC<Shot7Props> = ({ subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const accent = '#A78BFA'
  const textPrimary = '#F8FAFC'
  const textSecondary = '#94A3B8'

  const fadeSlideUp = (delay: number) => ({
    opacity: interpolate(frame, [delay, delay + 15], [0, 1], {
      extrapolateRight: 'clamp',
    }),
    transform: `translateY(${interpolate(frame, [delay, delay + 15], [30, 0], {
      extrapolateRight: 'clamp',
    })}px)`,
  })

  const highlightProgress = spring({
    frame,
    fps,
    config: { damping: 200 },
    delay: 25,
  })

  const ctaScale = interpolate(
    Math.sin((frame - 40) * 0.08),
    [-1, 1],
    [1, 1.05],
  )

  const ctaFadeSlideUp = fadeSlideUp(40)

  const cornerDotPulse = (delay: number) =>
    interpolate(
      Math.sin((frame - delay) * 0.06),
      [-1, 1],
      [0.2, 0.5],
    )

  return (
    <AbsoluteFill>
      {/* Background image */}
      <Img
        src={staticFile('images/grok43-custom-voices/shot7-bg.png')}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />

      {/* Dark overlay for text readability */}
      <AbsoluteFill style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} />

      <CenteredStack
        subtitleSegments={subtitleSegments}
        videoOffset={videoOffset}
        gap={40}
      >
        {/* Content wrapper with relative positioning for corner dots */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 40,
          }}
        >
          {/* Starburst decoration behind main text */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 1200,
              height: 1200,
              pointerEvents: 'none',
              opacity: 0.2,
            }}
          >
            <Starburst
              rays={16}
              colors={[accent, '#7C3AED']}
              rotation={frame * 0.5}
            />
          </div>

          {/* Main text with word highlight */}
          <div
            style={{
              ...fadeSlideUp(10),
              fontSize: 72,
              fontWeight: 900,
              color: textPrimary,
              textAlign: 'center',
              lineHeight: 1.4,
              position: 'relative',
              zIndex: 1,
            }}
          >
            <span>xAI 打</span>
            <span style={{ position: 'relative', display: 'inline-block' }}>
              {/* Highlight bar behind keyword */}
              <span
                style={{
                  position: 'absolute',
                  left: -8,
                  right: -8,
                  top: 4,
                  bottom: 4,
                  backgroundColor: accent,
                  opacity: 0.3,
                  borderRadius: 8,
                  transform: `scaleX(${highlightProgress})`,
                  transformOrigin: 'left center',
                }}
              />
              <span style={{ position: 'relative', zIndex: 1 }}>
                价格战
              </span>
            </span>
            <span>抢开发者</span>
          </div>

          {/* CTA text with pulse animation */}
          <div
            style={{
              ...ctaFadeSlideUp,
              fontSize: 36,
              color: textSecondary,
              textAlign: 'center',
              transform: `scale(${ctaScale}) translateY(${interpolate(frame, [40, 55], [30, 0], {
                extrapolateRight: 'clamp',
              })}px)`,
            }}
          >
            关注我 | 持续追踪 AI 动态
          </div>

          {/* Decorative corner dots */}
          {[
            { top: -120, left: -60 },
            { top: -120, right: -60 },
            { bottom: -120, left: -60 },
            { bottom: -120, right: -60 },
          ].map((pos, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                ...pos,
                width: 16,
                height: 16,
                borderRadius: '50%',
                backgroundColor: accent,
                opacity: cornerDotPulse(i * 10),
                filter: 'blur(4px)',
              }}
            />
          ))}
        </div>
      </CenteredStack>
    </AbsoluteFill>
  )
}
