import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile, AbsoluteFill } from 'remotion'
import { CenteredStack } from '../../../components'
import { theme, FONT_FAMILY } from '../theme'

interface ShotProps {
  subtitleSegments?: Array<{ text: string; start: number; end: number; duration: number }>
}

export const Shot1: React.FC<ShotProps> = ({ subtitleSegments }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const subtitle = subtitleSegments?.find((s) => frame / fps >= s.start && frame / fps < s.end)?.text

  const blurIn = (delay: number) => ({
    opacity: interpolate(frame, [delay, delay + 15], [0, 1], { extrapolateRight: 'clamp' }),
    filter: `blur(${interpolate(frame, [delay, delay + 15], [20, 0], { extrapolateRight: 'clamp' })}px)`,
  })

  const highlightProgress = spring({ frame, fps, config: { damping: 200 }, delay: 20 })

  return (
    <AbsoluteFill>
      <Img
        src={staticFile('images/ai-novel-writing/shot1-bg.jpeg')}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <AbsoluteFill style={{ backgroundColor: 'rgba(0,0,0,0.45)' }} />
      <CenteredStack
        gap={40}
        subtitle={subtitle}
      >
        <div style={{
          ...blurIn(0),
          width: 160,
          height: 160,
          borderRadius: 80,
          background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentAlt})`,
          boxShadow: `0 0 80px ${theme.accent}66, 0 0 160px ${theme.accentAlt}33`,
        }} />

        <div style={{
          ...blurIn(8),
          fontSize: 88,
          fontWeight: 900,
          color: '#FFFFFF',
          letterSpacing: '6px',
          fontFamily: FONT_FAMILY,
        }}>
          <span style={{ position: 'relative', display: 'inline-block' }}>
            <span style={{
              position: 'absolute', left: 0, right: 0, top: '50%', height: '1.1em',
              transform: `translateY(-50%) scaleX(${highlightProgress})`,
              transformOrigin: 'left center',
              backgroundColor: theme.accent,
              borderRadius: '0.15em',
              opacity: 0.3,
            }} />
            <span style={{ position: 'relative', zIndex: 1 }}>AI写小说</span>
          </span>
        </div>

        <div style={{
          ...blurIn(20),
          fontSize: 34,
          color: '#CBD5E1',
          fontFamily: FONT_FAMILY,
        }}>
          不是输入「帮我写个故事」就完了
        </div>
      </CenteredStack>
    </AbsoluteFill>
  )
}
