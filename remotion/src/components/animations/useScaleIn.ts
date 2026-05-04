import { spring, interpolate } from 'remotion'
import type { CSSProperties } from 'react'

interface SpringConfig {
  damping?: number
  stiffness?: number
  mass?: number
}

interface ScaleInParams {
  frame: number
  fps?: number
  delay?: number
  config?: SpringConfig
}

interface ScaleInResult {
  style: CSSProperties
}

const DEFAULT_SPRING_CONFIG = {
  damping: 15,
  stiffness: 120,
}

const computeScaleIn = (params: ScaleInParams): ScaleInResult => {
  const {
    frame,
    fps = 30,
    delay = 0,
    config = DEFAULT_SPRING_CONFIG,
  } = params

  const adjustedFrame = frame - delay

  const springConfig: Record<string, number | boolean> = {
    damping: config.damping ?? DEFAULT_SPRING_CONFIG.damping,
    stiffness: config.stiffness ?? DEFAULT_SPRING_CONFIG.stiffness,
  }
  if (config.mass !== undefined) {
    springConfig.mass = config.mass
  }

  const progress = spring({
    frame: adjustedFrame,
    fps,
    config: springConfig,
  })

  const scale = interpolate(progress, [0, 1], [0, 1])
  const opacity = interpolate(progress, [0, 0.5], [0, 1], {
    extrapolateRight: 'clamp',
  })

  return {
    style: {
      transform: `scale(${scale})`,
      opacity,
    },
  }
}

function useScaleIn(
  frame: number,
  fps?: number,
  delay?: number,
  config?: SpringConfig,
): ScaleInResult {
  return computeScaleIn({ frame, fps, delay, config })
}

useScaleIn.compute = computeScaleIn

export { useScaleIn }
