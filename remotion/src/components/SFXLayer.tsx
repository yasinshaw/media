import React from 'react'
import { Audio } from '@remotion/media'
import { staticFile, useCurrentFrame, useVideoConfig, interpolate } from 'remotion'
import { SFX, SFX_FILE_MAP, SFX_AVAILABLE_FILES, SFX_LAYER_DEFAULTS, SFX_LAYER_SCALE } from './constants'
import { matchSFX, translateLegacyType, inferLayer } from './sfx-matcher'
import type { SFXLayerType } from './constants'

export interface SFXConfig {
  // New format (preferred)
  mood?: string
  action?: string
  intensity?: string
  layer?: SFXLayerType
  // Legacy format (backward compatible)
  type?: string
  // Common
  delay?: number
  volume?: number
  duration?: number
}

interface ResolvedSFX {
  src: string
  layer: SFXLayerType
  delay: number
  volume: number
  duration?: number
}

interface SFXLayerProps {
  effects: SFXConfig[]
  startFrame?: number
}

const normalizeSrc = (s: string) => s.replace(/^\/audio\/sfx\//, '')

function resolveEffect(effect: SFXConfig, availableFiles: string[]): ResolvedSFX | null {
  // Guard: empty config produces no sound
  if (!effect.type && !effect.mood && !effect.action) return null

  // Legacy format: type field present
  if (effect.type) {
    const legacy = translateLegacyType(effect.type)
    if (!legacy) {
      const fallbackSrc = SFX_FILE_MAP[effect.type]
      if (!fallbackSrc) return null
      return {
        src: normalizeSrc(fallbackSrc),
        layer: inferLayer('transition'),
        delay: effect.delay ?? 0,
        volume: effect.volume ?? SFX.VOLUME,
      }
    }
    const src = matchSFX(legacy.mood, legacy.action, legacy.intensity, availableFiles)
      ?? (SFX_FILE_MAP[effect.type] ? normalizeSrc(SFX_FILE_MAP[effect.type]) : null)
    if (!src) return null
    return {
      src,
      layer: effect.layer ?? inferLayer(legacy.action),
      delay: effect.delay ?? legacy.delay ?? 0,
      volume: effect.volume ?? legacy.volume ?? SFX.VOLUME,
    }
  }

  // New format: mood/action/intensity
  const mood = effect.mood ?? 'neutral'
  const action = effect.action ?? 'emphasis'
  const intensity = effect.intensity ?? 'medium'
  const src = matchSFX(mood, action, intensity, availableFiles)
  if (!src) return null

  const layer = effect.layer ?? inferLayer(action)
  const layerDefaults = SFX_LAYER_DEFAULTS[layer]

  return {
    src,
    layer,
    delay: effect.delay ?? 0,
    volume: effect.volume ?? layerDefaults.volume,
    duration: effect.duration,
  }
}

export const SFXLayer: React.FC<SFXLayerProps> = ({ effects, startFrame = 0 }) => {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()

  const resolved = effects
    .map((e) => resolveEffect(e, SFX_AVAILABLE_FILES))
    .filter((r): r is ResolvedSFX => r !== null)

  if (resolved.length === 0) return null

  const scale = SFX_LAYER_SCALE[Math.min(resolved.length, 3)] ?? 0.7

  return (
    <>
      {resolved.map((effect, idx) => {
        const delayFrames = effect.delay * fps
        const absoluteStart = startFrame + delayFrames
        const fadeInFrames = 3

        let volume: number
        if (effect.layer === 'ambient' && effect.duration) {
          const durFrames = effect.duration * fps
          const ambientEnd = absoluteStart + durFrames
          const fadeOutStart = ambientEnd - 0.5 * fps
          const baseVol = effect.volume * scale
          volume =
            interpolate(frame, [absoluteStart, absoluteStart + fadeInFrames], [0, baseVol], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }) *
            interpolate(frame, [fadeOutStart, ambientEnd], [1, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            })
        } else {
          volume = delayFrames > 0
            ? interpolate(frame, [absoluteStart, absoluteStart + fadeInFrames], [0, effect.volume * scale], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              })
            : interpolate(frame, [startFrame, startFrame + fadeInFrames], [0, effect.volume * scale], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              })
        }

        return (
          <Audio
            key={`${effect.src}-${effect.delay}-${idx}`}
            src={staticFile(`/audio/sfx/${effect.src}`)}
            volume={volume}
          />
        )
      })}
    </>
  )
}
