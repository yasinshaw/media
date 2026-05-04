import { interpolate } from 'remotion'
import type { CSSProperties } from 'react'

interface FadeInParams {
  frame: number
  delay?: number
  duration?: number
}

interface FadeInResult {
  style: CSSProperties
}

const computeFadeIn = (params: FadeInParams): FadeInResult => {
  const { frame, delay = 0, duration = 15 } = params

  const opacity = interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return { style: { opacity } }
}

function useFadeIn(
  frame: number,
  delay?: number,
  duration?: number,
): FadeInResult {
  return computeFadeIn({ frame, delay, duration })
}

useFadeIn.compute = computeFadeIn

export { useFadeIn }
