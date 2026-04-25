import React from 'react'
import { AbsoluteFill } from 'remotion'
import { SAFE_AREA, LAYOUT } from './constants'
import { Subtitle } from './Subtitle'
import { ProgressiveSubtitle, SubtitleSegment } from './ProgressiveSubtitle'

type HubPosition =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'

interface HubNode {
  /** ReactNode rendered as the node body */
  node: React.ReactNode
  /** Optional opacity / scale transform applied to wrapper */
  opacity?: number
  scale?: number
}

interface SurroundingNode extends HubNode {
  position: HubPosition
}

interface HubLayoutProps {
  /** Center node (always at hub center) */
  center: HubNode
  /** Surrounding nodes — each placed at one of 8 compass positions */
  surrounding: SurroundingNode[]
  /** Distance from hub center to each surrounding node (px). Default 380. */
  radius?: number
  /** Show connection lines from center to each surrounding node. Default true. */
  showConnections?: boolean
  connectionColor?: string
  connectionWidth?: number
  connectionDashed?: boolean
  /** Opacity of all connection lines (for animation). Default 1. */
  connectionsOpacity?: number
  background?: React.CSSProperties['background']
  /** Optional content slotted ABOVE the hub (e.g. title) */
  header?: React.ReactNode
  /** Optional content slotted BELOW the hub but above subtitle (e.g. caption) */
  footer?: React.ReactNode
  subtitle?: string
  subtitleSegments?: SubtitleSegment[]
  videoOffset?: number
}

const POSITION_ANGLES: Record<HubPosition, number> = {
  top: -90,
  'top-right': -45,
  right: 0,
  'bottom-right': 45,
  bottom: 90,
  'bottom-left': 135,
  left: 180,
  'top-left': -135,
}

/**
 * HubLayout — center node + surrounding nodes with auto-aligned connection lines.
 *
 * Solves the recurring problem: SVG line coordinates don't match flex-positioned
 * elements. Here, every element AND every line is computed from the same center
 * point, so they always align.
 *
 * Coordinate system:
 *  - Hub center = horizontal center of canvas, vertically centered in safe area
 *  - All nodes use `position: absolute` + `transform: translate(-50%, -50%)` so
 *    they remain centered on their target point regardless of content size.
 *  - SVG fills the entire 1080x1920 canvas, line endpoints use the same pixel
 *    coordinates as node centers — no flex/percentage drift.
 */
export const HubLayout: React.FC<HubLayoutProps> = ({
  center,
  surrounding,
  radius = 380,
  showConnections = true,
  connectionColor = '#64748b',
  connectionWidth = 4,
  connectionDashed = true,
  connectionsOpacity = 1,
  background,
  header,
  footer,
  subtitle,
  subtitleSegments,
  videoOffset,
}) => {
  const centerX = LAYOUT.WIDTH / 2
  // Hub center is the vertical midpoint of the content-safe area
  const safeTop = SAFE_AREA.TOP
  const safeBottom = SAFE_AREA.CONTENT_BOTTOM
  const centerY = safeTop + (LAYOUT.HEIGHT - safeTop - safeBottom) / 2

  const nodePositions = surrounding.map((s) => {
    const rad = (POSITION_ANGLES[s.position] * Math.PI) / 180
    return {
      ...s,
      x: centerX + Math.cos(rad) * radius,
      y: centerY + Math.sin(rad) * radius,
    }
  })

  return (
    <AbsoluteFill style={{ background }}>
      {/* Header slot (above hub) */}
      {header && (
        <div
          style={{
            position: 'absolute',
            top: SAFE_AREA.TOP,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {header}
        </div>
      )}

      {/* Connection lines — origin matches node coordinates exactly */}
      {showConnections && (
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            opacity: connectionsOpacity,
          }}
          viewBox={`0 0 ${LAYOUT.WIDTH} ${LAYOUT.HEIGHT}`}
          preserveAspectRatio="none"
        >
          {nodePositions.map((p, i) => (
            <line
              key={i}
              x1={centerX}
              y1={centerY}
              x2={p.x}
              y2={p.y}
              stroke={connectionColor}
              strokeWidth={connectionWidth}
              strokeDasharray={connectionDashed ? '8 8' : undefined}
            />
          ))}
        </svg>
      )}

      {/* Center node */}
      <div
        style={{
          position: 'absolute',
          left: centerX,
          top: centerY,
          transform: `translate(-50%, -50%) scale(${center.scale ?? 1})`,
          opacity: center.opacity ?? 1,
          zIndex: 10,
        }}
      >
        {center.node}
      </div>

      {/* Surrounding nodes */}
      {nodePositions.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: p.x,
            top: p.y,
            transform: `translate(-50%, -50%) scale(${p.scale ?? 1})`,
            opacity: p.opacity ?? 1,
            zIndex: 10,
          }}
        >
          {p.node}
        </div>
      ))}

      {/* Footer slot (below hub, above subtitle zone) */}
      {footer && (
        <div
          style={{
            position: 'absolute',
            bottom: SAFE_AREA.CONTENT_BOTTOM,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            paddingBottom: 40,
          }}
        >
          {footer}
        </div>
      )}

      {/* Subtitle */}
      {subtitleSegments && videoOffset !== undefined && (
        <ProgressiveSubtitle segments={subtitleSegments} videoOffset={videoOffset} />
      )}
      {!subtitleSegments && subtitle && <Subtitle text={subtitle} />}
    </AbsoluteFill>
  )
}
