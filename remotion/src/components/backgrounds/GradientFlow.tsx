import React from 'react'
import { interpolate, useCurrentFrame } from 'remotion'

interface GradientFlowProps {
  colors: string[]
  duration?: number
  angle?: number
}

/**
 * GradientFlow — an animated gradient that slowly shifts angle and color stops.
 * Purely decorative background atmosphere component.
 */
export const GradientFlow: React.FC<GradientFlowProps> = ({
  colors,
  duration = 180,
  angle = 135,
}) => {
  const frame = useCurrentFrame()

  // Slowly oscillate the gradient angle
  const angleOffset = interpolate(
    Math.sin((frame / duration) * Math.PI * 2),
    [-1, 1],
    [-30, 30],
  )
  const currentAngle = angle + angleOffset

  // Shift color stops over time — rotate which color appears first
  const phase = (frame / duration) % 1
  const offsetIndex = Math.floor(phase * colors.length)
  const rotatedColors = [
    ...colors.slice(offsetIndex),
    ...colors.slice(0, offsetIndex),
  ]

  const gradientStops = rotatedColors.join(', ')

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        background: `linear-gradient(${currentAngle}deg, ${gradientStops})`,
      }}
    />
  )
}
