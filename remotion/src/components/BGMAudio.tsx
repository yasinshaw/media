import React from 'react'
import { Audio } from '@remotion/media'
import { staticFile, useCurrentFrame, useVideoConfig, interpolate } from 'remotion'
import { BGM, BGM_STYLE_MAP } from './constants'

export interface VoiceoverSegment {
  start: number
  end: number
}

interface BGMAudioProps {
  style: string
  tempo: string
  volume?: number
  fadeInSeconds?: number
  fadeOutSeconds?: number
  voiceoverSegments?: VoiceoverSegment[]
}

export const BGMAudio: React.FC<BGMAudioProps> = ({
  style,
  tempo,
  volume = BGM.DEFAULT_VOLUME,
  fadeInSeconds = BGM.FADE_IN_SECONDS,
  fadeOutSeconds = BGM.FADE_OUT_SECONDS,
  voiceoverSegments,
}) => {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()

  const bgmStyle = BGM_STYLE_MAP[style] ?? style
  const src = staticFile(`/audio/bgm/${bgmStyle}-${tempo}.mp3`)

  const fadeInFrames = fadeInSeconds * fps
  const fadeOutFrames = fadeOutSeconds * fps
  const fadeOutStart = durationInFrames - fadeOutFrames

  const volumeFactor = interpolate(frame, [0, fadeInFrames], [0, 1], {
    extrapolateRight: 'clamp',
  })

  const fadeOutFactor = interpolate(frame, [fadeOutStart, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const duckFactor = getDuckFactor(frame, fps, voiceoverSegments)

  const currentVolume = volume * volumeFactor * fadeOutFactor * duckFactor

  return <Audio src={src} volume={currentVolume} loop />
}

function getDuckFactor(
  frame: number,
  fps: number,
  segments?: VoiceoverSegment[],
): number {
  if (!segments || segments.length === 0) {
    return 1
  }

  const duckFadeFrames = BGM.DUCK_FADE_SECONDS * fps

  for (const seg of segments) {
    const segStartFrame = seg.start * fps
    const segEndFrame = seg.end * fps

    if (frame >= segStartFrame && frame <= segEndFrame) {
      return BGM.DUCKED_VOLUME / BGM.DEFAULT_VOLUME
    }

    if (frame > segEndFrame && frame < segEndFrame + duckFadeFrames) {
      const duckedRatio = BGM.DUCKED_VOLUME / BGM.DEFAULT_VOLUME
      return interpolate(
        frame,
        [segEndFrame, segEndFrame + duckFadeFrames],
        [duckedRatio, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
      )
    }

    if (frame < segStartFrame && frame > segStartFrame - duckFadeFrames) {
      const duckedRatio = BGM.DUCKED_VOLUME / BGM.DEFAULT_VOLUME
      return interpolate(
        frame,
        [segStartFrame - duckFadeFrames, segStartFrame],
        [1, duckedRatio],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
      )
    }
  }

  return 1
}

export interface BGMAudioConfig {
  style: string
  tempo: string
  volume: number
}
