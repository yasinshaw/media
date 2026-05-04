import React from 'react'

interface GridPatternProps {
  color?: string
  opacity?: number
  spacing?: number
}

/**
 * GridPattern — a subtle CSS grid overlay.
 * Purely decorative background atmosphere component.
 * No hooks needed — pure CSS implementation.
 */
export const GridPattern: React.FC<GridPatternProps> = ({
  color = '#ffffff',
  opacity = 0.05,
  spacing = 60,
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        opacity,
        backgroundImage: [
          `linear-gradient(${color} 1px, transparent 1px)`,
          `linear-gradient(90deg, ${color} 1px, transparent 1px)`,
        ].join(', '),
        backgroundSize: `${spacing}px ${spacing}px`,
      }}
    />
  )
}
