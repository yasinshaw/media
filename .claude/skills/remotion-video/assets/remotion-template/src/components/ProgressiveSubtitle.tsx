import React from 'react'
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion'
import { cleanSubtitleText } from './subtitle-utils'
import { SAFE_AREA, SUBTITLE, LAYOUT } from './constants'

export interface SubtitleSegment {
  text: string
  start: number // Start time relative to video start (seconds)
  end: number // End time relative to video start (seconds)
  duration: number // Duration in seconds
}

interface ProgressiveSubtitleProps {
  segments: SubtitleSegment[]
  videoOffset?: number // Shot's start time in the video (seconds) - needed for timing alignment
}

export const ProgressiveSubtitle: React.FC<ProgressiveSubtitleProps> = ({
  segments,
  videoOffset = 0,
}) => {
  const frame = useCurrentFrame()
  const fps = LAYOUT.FPS

  // Calculate current time relative to VIDEO start (not shot start)
  // This matches the timing in manifest (which is also relative to video start)
  const currentTime = frame / fps + videoOffset

  // Find which segment should be displayed
  // Segment times are relative to video start (from manifest)
  const activeSegment = segments.find((seg) => {
    return currentTime >= seg.start && currentTime < seg.end
  })

  if (!activeSegment) {
    return null
  }

  const timeIntoSegment = currentTime - activeSegment.start
  const fadeInDuration = SUBTITLE.FADE_DURATION / fps
  const fadeInProgress = Math.min(timeIntoSegment / fadeInDuration, 1)

  // For very short segments, adjust opacity curve
  const opacity =
    activeSegment.duration < fadeInDuration
      ? interpolate(fadeInProgress, [0, 1], [0.3, 1]) // Start at 30% for short segments
      : interpolate(fadeInProgress, [0, 1], [0, 1])

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
            fontSize: SUBTITLE.FONT_SIZE,
            fontWeight: 'bold',
            textAlign: 'center',
            lineHeight: SUBTITLE.LINE_HEIGHT,
            letterSpacing: '1px',
            textShadow: '2px 2px 6px rgba(0,0,0,0.95), 0 0 16px rgba(0,0,0,0.6)',
          }}
        >
          {cleanSubtitleText(activeSegment.text)}
        </span>
      </div>
    </AbsoluteFill>
  )
}
