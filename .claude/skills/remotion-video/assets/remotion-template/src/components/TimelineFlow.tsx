import React from 'react'
import { SafeArea } from './SafeArea'
import { Subtitle } from './Subtitle'
import { ProgressiveSubtitle, SubtitleSegment } from './ProgressiveSubtitle'

interface TimelineItem {
  /** Main label of the item */
  label: React.ReactNode
  /** Optional secondary text below label */
  detail?: React.ReactNode
  /** Optional icon/emoji rendered in the left badge */
  icon?: React.ReactNode
  /** Accent color for badge & connector. Defaults to accent prop. */
  color?: string
  /** Per-item opacity (for staggered fade-in) */
  opacity?: number
}

interface TimelineFlowProps {
  items: TimelineItem[]
  /** Direction of flow. Default 'vertical'. */
  direction?: 'vertical' | 'horizontal'
  /** Default accent color. Default '#6366f1'. */
  accent?: string
  /** Show arrow/line connectors between items. Default true. */
  showConnectors?: boolean
  /** Connector style. Default 'arrow' (↓ or →). */
  connectorStyle?: 'arrow' | 'line'
  /** Gap between items (px). Default 24. */
  gap?: number
  background?: React.CSSProperties['background']
  /** Optional header above timeline (e.g. title) */
  header?: React.ReactNode
  /** Optional footer below timeline */
  footer?: React.ReactNode
  subtitle?: string
  subtitleSegments?: SubtitleSegment[]
  videoOffset?: number
}

/**
 * TimelineFlow — sequential / process-flow layout.
 *
 * Replaces ad-hoc `tasks.map(...)` blocks with a uniform timeline:
 *  - Each item: badge (icon) + label + optional detail
 *  - Auto connector between items (arrow or line)
 *  - Vertical (default, mobile-friendly) or horizontal direction
 *  - SafeArea + maxWidth handled internally
 */
export const TimelineFlow: React.FC<TimelineFlowProps> = ({
  items,
  direction = 'vertical',
  accent = '#6366f1',
  showConnectors = true,
  connectorStyle = 'arrow',
  gap = 24,
  background,
  header,
  footer,
  subtitle,
  subtitleSegments,
  videoOffset,
}) => {
  const isVertical = direction === 'vertical'
  const arrowChar = isVertical ? '↓' : '→'

  return (
    <SafeArea
      style={{
        background,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {header && <div style={{ marginBottom: 32 }}>{header}</div>}

      <div
        style={{
          width: '100%',
          maxWidth: isVertical ? 800 : '100%',
          display: 'flex',
          flexDirection: isVertical ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap,
        }}
      >
        {items.map((item, i) => {
          const itemColor = item.color ?? accent
          const isLast = i === items.length - 1
          return (
            <React.Fragment key={i}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: isVertical ? 'row' : 'column',
                  alignItems: 'center',
                  gap: 24,
                  opacity: item.opacity ?? 1,
                  width: isVertical ? '100%' : 'auto',
                }}
              >
                {/* Badge */}
                <div
                  style={{
                    width: 80,
                    height: 80,
                    minWidth: 80,
                    borderRadius: 40,
                    background: `linear-gradient(135deg, ${itemColor}, ${itemColor}cc)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 36,
                    fontWeight: 700,
                    color: '#fff',
                  }}
                >
                  {item.icon ?? i + 1}
                </div>

                {/* Label + detail */}
                <div
                  style={{
                    flex: isVertical ? 1 : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                    textAlign: isVertical ? 'left' : 'center',
                  }}
                >
                  <div
                    style={{
                      fontSize: 36,
                      fontWeight: 700,
                      color: '#f1f5f9',
                    }}
                  >
                    {item.label}
                  </div>
                  {item.detail && (
                    <div
                      style={{
                        fontSize: 28,
                        color: '#94a3b8',
                        fontWeight: 500,
                      }}
                    >
                      {item.detail}
                    </div>
                  )}
                </div>
              </div>

              {/* Connector */}
              {showConnectors && !isLast && (
                <div
                  style={{
                    fontSize: connectorStyle === 'arrow' ? 36 : 0,
                    color: accent,
                    opacity: 0.7,
                    width: connectorStyle === 'line' && !isVertical ? 64 : 'auto',
                    height: connectorStyle === 'line' && isVertical ? 32 : 'auto',
                    background:
                      connectorStyle === 'line'
                        ? `linear-gradient(${isVertical ? '180deg' : '90deg'}, ${accent}, transparent)`
                        : 'transparent',
                  }}
                >
                  {connectorStyle === 'arrow' ? arrowChar : null}
                </div>
              )}
            </React.Fragment>
          )
        })}
      </div>

      {footer && <div style={{ marginTop: 32 }}>{footer}</div>}

      {subtitleSegments && videoOffset !== undefined && (
        <ProgressiveSubtitle segments={subtitleSegments} videoOffset={videoOffset} />
      )}
      {!subtitleSegments && subtitle && <Subtitle text={subtitle} />}
    </SafeArea>
  )
}
