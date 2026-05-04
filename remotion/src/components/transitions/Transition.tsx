import React from 'react'
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion'

type TransitionType =
  | 'fade'
  | 'slide-left'
  | 'slide-right'
  | 'slide-up'
  | 'slide-down'
  | 'zoom-in'
  | 'zoom-out'

interface TransitionProps {
  children: React.ReactNode
  type?: TransitionType
  duration?: number
}

const DIRECTION_OFFSETS: Record<
  string,
  { prop: string; from: number; to: number }
> = {
  'slide-left': { prop: 'translateX', from: 300, to: 0 },
  'slide-right': { prop: 'translateX', from: -300, to: 0 },
  'slide-up': { prop: 'translateY', from: 300, to: 0 },
  'slide-down': { prop: 'translateY', from: -300, to: 0 },
}

const getEntryStyle = (
  type: TransitionType,
  frame: number,
  duration: number,
): React.CSSProperties => {
  const progress = interpolate(frame, [0, duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  if (type === 'fade') return { opacity: progress }

  if (type === 'zoom-in') {
    const scale = interpolate(progress, [0, 1], [0.85, 1])
    return { opacity: progress, transform: `scale(${scale})` }
  }

  if (type === 'zoom-out') {
    const scale = interpolate(progress, [0, 1], [1.1, 1])
    return { opacity: progress, transform: `scale(${scale})` }
  }

  const offset = DIRECTION_OFFSETS[type]
  if (offset) {
    const value = interpolate(progress, [0, 1], [offset.from, offset.to])
    return { opacity: progress, transform: `${offset.prop}(${value}px)` }
  }

  return { opacity: progress }
}

const Transition: React.FC<TransitionProps> = ({
  children,
  type = 'fade',
  duration = 15,
}) => {
  const frame = useCurrentFrame()
  const entryStyle = getEntryStyle(type, frame, duration)

  return <AbsoluteFill style={{ ...entryStyle }}>{children}</AbsoluteFill>
}

export { Transition }
export type { TransitionType }
