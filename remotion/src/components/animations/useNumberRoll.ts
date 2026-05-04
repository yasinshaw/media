import { interpolate, Easing } from 'remotion'

interface NumberRollParams {
  frame: number
  target: number
  duration?: number
  delay?: number
  decimals?: number
}

const computeNumberRoll = (params: NumberRollParams): number => {
  const { frame, target, duration = 45, delay = 0, decimals = 0 } = params

  const value = interpolate(frame, [delay, delay + duration], [0, target], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  })

  return decimals > 0 ? Number(value.toFixed(decimals)) : Math.round(value)
}

function useNumberRoll(
  frame: number,
  target: number,
  duration?: number,
  delay?: number,
  decimals?: number,
): number {
  return computeNumberRoll({ frame, target, duration, delay, decimals })
}

useNumberRoll.compute = computeNumberRoll

export { useNumberRoll }
