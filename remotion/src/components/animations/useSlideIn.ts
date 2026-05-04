import { interpolate, Easing } from 'remotion'
import type { CSSProperties } from 'react'

type SlideDirection = 'left' | 'right' | 'up' | 'down'

interface SlideInParams {
  frame: number
  direction: SlideDirection
  delay?: number
  distance?: number
  duration?: number
}

interface SlideInResult {
  style: CSSProperties
}

const DIRECTION_MAP: Record<
  SlideDirection,
  { axis: 'X' | 'Y'; sign: number }
> = {
  left: { axis: 'X', sign: -1 },
  right: { axis: 'X', sign: 1 },
  up: { axis: 'Y', sign: -1 },
  down: { axis: 'Y', sign: 1 },
}

const computeSlideIn = (params: SlideInParams): SlideInResult => {
  const {
    frame,
    direction,
    delay = 0,
    distance = 60,
    duration = 15,
  } = params

  const { axis, sign } = DIRECTION_MAP[direction]

  const progress = interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  })

  const offset = sign * distance * (1 - progress)
  const opacity = progress

  return {
    style: {
      opacity,
      transform: `translate${axis}(${offset}px)`,
    },
  }
}

function useSlideIn(
  frame: number,
  direction: SlideDirection,
  delay?: number,
  distance?: number,
  duration?: number,
): SlideInResult {
  return computeSlideIn({ frame, direction, delay, distance, duration })
}

useSlideIn.compute = computeSlideIn

export { useSlideIn }
export type { SlideDirection }
