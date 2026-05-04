import type { CSSProperties } from 'react'

interface FloatParams {
  frame: number
  amplitude?: number
  speed?: number
}

interface FloatResult {
  style: CSSProperties
}

const computeFloat = (params: FloatParams): FloatResult => {
  const { frame, amplitude = 8, speed = 0.04 } = params
  const translateY = Math.sin(frame * speed) * amplitude

  return { style: { transform: `translateY(${translateY}px)` } }
}

function useFloat(
  frame: number,
  amplitude?: number,
  speed?: number,
): FloatResult {
  return computeFloat({ frame, amplitude, speed })
}

useFloat.compute = computeFloat

export { useFloat }
