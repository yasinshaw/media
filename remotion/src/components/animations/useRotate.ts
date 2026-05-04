import type { CSSProperties } from 'react'

interface RotateParams {
  frame: number
  speed?: number
}

interface RotateResult {
  style: CSSProperties
}

const computeRotate = (params: RotateParams): RotateResult => {
  const { frame, speed = 0.5 } = params
  const degrees = frame * speed

  return { style: { transform: `rotate(${degrees}deg)` } }
}

function useRotate(frame: number, speed?: number): RotateResult {
  return computeRotate({ frame, speed })
}

useRotate.compute = computeRotate

export { useRotate }
