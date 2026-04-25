import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion'
import React from 'react'
import { cleanSubtitleText } from './subtitle-utils'
import { SAFE_AREA, SUBTITLE } from './constants'

interface SubtitleProps {
  text: string
  fontSize?: number
}

export const Subtitle: React.FC<SubtitleProps> = ({ text, fontSize = SUBTITLE.FONT_SIZE }) => {
  const frame = useCurrentFrame()
  const opacity = interpolate(frame, [0, SUBTITLE.FADE_DURATION], [0, 1], {
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div
        style={{
          position: 'absolute',
          bottom: SAFE_AREA.SUBTITLE_BOTTOM,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          padding: `0 ${SUBTITLE.SIDE_PADDING}px`,
          opacity,
        }}
      >
        <span
          style={{
            color: '#FFFFFF',
            fontSize,
            fontWeight: 'bold',
            textAlign: 'center',
            lineHeight: 1.5,
            letterSpacing: '1px',
            textShadow:
              '2px 2px 6px rgba(0,0,0,0.95), 0 0 16px rgba(0,0,0,0.6)',
          }}
        >
          {cleanSubtitleText(text)}
        </span>
      </div>
    </AbsoluteFill>
  )
}
