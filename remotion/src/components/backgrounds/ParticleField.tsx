import React from 'react'
import { useCurrentFrame } from 'remotion'

interface ParticleFieldProps {
  count?: number
  color?: string
  speed?: number
}

/**
 * ParticleField — tiny dots that slowly drift upward.
 * Purely decorative background atmosphere component.
 * Uses deterministic pseudo-random positions (no Math.random).
 */
export const ParticleField: React.FC<ParticleFieldProps> = ({
  count = 20,
  color = '#ffffff',
  speed = 0.01,
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
        const size = 2 + ((seed * 1.7) % 4)
        const opacity = 0.2 + ((seed * 0.5) % 0.6)

        // Drift upward, wrapping around
        const yRange = 1200 // larger than 1080 frame height
        const rawY = baseY * (yRange / 100) - frame * speed * (20 + (seed % 30))
        const wrappedY = ((rawY % yRange) + yRange) % yRange

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${baseX}%`,
              top: wrappedY,
              width: size,
              height: size,
              borderRadius: '50%',
              backgroundColor: color,
              opacity,
              pointerEvents: 'none',
            }}
          />
        )
      })}
    </div>
  )
}
