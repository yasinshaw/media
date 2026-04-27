import React from 'react'
import { Audio } from '@remotion/media'
import { staticFile, useCurrentFrame, useVideoConfig, interpolate } from 'remotion'
import { BGM, BGM_STYLE_MAP } from './constants'

interface BGMAudioProps {
  style: string
  tempo: string
  volume: number
  fadeInSeconds?: number
  fadeOutSeconds?: number
}

export const BGMAudio: React.FC<BGMAudioProps> = ({
  style,
  tempo,
  volume = BGM.DEFAULT_VOLUME,
  fadeInSeconds = BGM.FADE_IN_SECONDS,
  fadeOutSeconds = BGM.FADE_OUT_SECONDS,
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

  const currentVolume = volume * volumeFactor * fadeOutFactor

  return <Audio src={src} volume={currentVolume} loop />
}

export interface BGMAudioConfig {
  style: string
  tempo: string
  volume: number
}
