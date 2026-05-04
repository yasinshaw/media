import { interpolate, Easing } from 'remotion'
import type { CSSProperties } from 'react'

interface StaggerParams {
  frame: number
  count: number
  delayBetween?: number
  duration?: number
}

interface StaggerItemResult {
  style: CSSProperties
}

const computeStagger = (params: StaggerParams): StaggerItemResult[] => {
  const { frame, count, delayBetween = 8, duration = 12 } = params

  return Array.from({ length: count }, (_, i) => {
    const itemDelay = i * delayBetween
    const progress = interpolate(frame, [itemDelay, itemDelay + duration], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.quad),
    })

    const opacity = interpolate(progress, [0, 1], [0, 1])
    const translateY = interpolate(progress, [0, 1], [20, 0])

    return {
      style: {
        opacity,
        transform: `translateY(${translateY}px)`,
      },
    }
  })
}

function useStagger(
  frame: number,
  count: number,
  delayBetween?: number,
  duration?: number,
): StaggerItemResult[] {
  return computeStagger({ frame, count, delayBetween, duration })
}

useStagger.compute = computeStagger

export { useStagger }
