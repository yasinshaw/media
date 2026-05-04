import { spring, interpolate } from 'remotion'
import type { CSSProperties } from 'react'

interface ScaleInConfig {
  frame: number
  fps?: number
  delay?: number
  damping?: number
  stiffness?: number
  mass?: number
}

interface ScaleInResult {
  style: CSSProperties
}

const DEFAULTS = { fps: 30, delay: 0, damping: 15, stiffness: 120 }

const computeScaleIn = (params: ScaleInConfig): ScaleInResult => {
  const { frame, fps, delay, damping, stiffness, mass } = { ...DEFAULTS, ...params }
  const adjustedFrame = Math.max(0, frame - delay)

  const springConfig = { damping, stiffness, ...(mass !== undefined && { mass }) }

  const progress = spring({ frame: adjustedFrame, fps, config: springConfig })
  const scale = interpolate(progress, [0, 1], [0, 1])
  const opacity = interpolate(progress, [0, 0.5], [0, 1], {
    extrapolateRight: 'clamp',
  })

  return {
    style: { transform: `scale(${scale})`, opacity },
  }
}

function useScaleIn(frame: number, config?: Omit<ScaleInConfig, 'frame'>): ScaleInResult {
  return computeScaleIn({ frame, ...DEFAULTS, ...config })
}

useScaleIn.compute = computeScaleIn

export { useScaleIn }
