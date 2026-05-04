import React from 'react'
import { useCurrentFrame } from 'remotion'

interface FloatingOrbsProps {
  count?: number
  colors?: string[]
  speed?: number
}

const DEFAULT_COLORS = ['#3b82f640', '#8b5cf630', '#06b6d428']

/**
 * FloatingOrbs — soft, blurred orbs that drift gently across the frame.
 * Purely decorative background atmosphere component.
 * Uses deterministic pseudo-random positions (no Math.random).
 */
export const FloatingOrbs: React.FC<FloatingOrbsProps> = ({
  count = 3,
  colors = DEFAULT_COLORS,
  speed = 0.02,
}) => {
  const frame = useCurrentFrame()

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {Array.from({ length: count }, (_, i) => {
        // Deterministic pseudo-random based on index
        const seed = (i * 137.508 + 42) % 100
        const baseX = (seed * 9.3) % 100
        const baseY = (seed * 7.7) % 100
        const size = 200 + ((seed * 3.1) % 200)

        const xOffset = Math.cos(frame * speed * 0.7 + i * 1.5) * 30
        const yOffset = Math.sin(frame * speed + i * 2) * 40

        const color = colors[i % colors.length]

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${baseX}%`,
              top: `${baseY}%`,
              width: size,
              height: size,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${color}, transparent 70%)`,
              filter: 'blur(40px)',
              pointerEvents: 'none',
              transform: `translate(${xOffset}px, ${yOffset}px) translate(-50%, -50%)`,
            }}
          />
        )
      })}
    </div>
  )
}
