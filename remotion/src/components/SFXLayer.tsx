import React from 'react'
import { Audio } from '@remotion/media'
import { staticFile, useCurrentFrame, useVideoConfig } from 'remotion'
import { SFX, SFX_FILE_MAP } from './constants'

export interface SFXConfig {
  type: string
  delay?: number
}

interface SFXLayerProps {
  effects: SFXConfig[]
}

export const SFXLayer: React.FC<SFXLayerProps> = ({ effects }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  return (
    <>
      {effects.map((effect) => {
        const delay = effect.delay ?? SFX.DEFAULT_DELAYS[effect.type] ?? 0
        const delayFrames = delay * fps
        const src = SFX_FILE_MAP[effect.type]

        if (!src) {
          return null
        }

        return (
          <Audio
            key={effect.type}
            src={staticFile(src)}
            volume={SFX.VOLUME}
            startFrom={delayFrames > 0 ? delayFrames : undefined}
          />
        )
      })}
    </>
  )
}
