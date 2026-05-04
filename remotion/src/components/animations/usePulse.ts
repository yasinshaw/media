import { interpolate } from 'remotion'
import type { CSSProperties } from 'react'

interface PulseParams {
  frame: number
  minScale?: number
  maxScale?: number
  speed?: number
}

interface PulseResult {
  style: CSSProperties
}

const computePulse = (params: PulseParams): PulseResult => {
  const { frame, minScale = 1, maxScale = 1.05, speed = 0.08 } = params
  const sineValue = Math.sin(frame * speed)
  const scale = interpolate(sineValue, [-1, 1], [minScale, maxScale], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return { style: { transform: `scale(${scale})` } }
}

function usePulse(
  frame: number,
  minScale?: number,
  maxScale?: number,
  speed?: number,
): PulseResult {
  return computePulse({ frame, minScale, maxScale, speed })
}

usePulse.compute = computePulse

export { usePulse }
