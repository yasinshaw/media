import React from 'react'
import { AbsoluteFill } from 'remotion'
import { SAFE_AREA } from './constants'
import { Subtitle } from './Subtitle'
import { ProgressiveSubtitle, SubtitleSegment } from './ProgressiveSubtitle'

interface ComparePanel {
  title: string
  /** Body content of the panel */
  body: React.ReactNode
  /** Caption shown below body */
  caption?: string
  /** Accent color for title, border, caption */
  accent: string
  /** Background tint (rgba). Defaults to translucent accent. */
  background?: string
  /** Opacity for fade-in animation */
  opacity?: number
}

interface TwoColumnCompareProps {
  left: ComparePanel
  right: ComparePanel
  /** Layout direction. Default 'vertical' (top/bottom — best for 9:16). */
  direction?: 'vertical' | 'horizontal'
  /** Gap between panels. Default 32. */
  gap?: number
  background?: React.CSSProperties['background']
  /** Optional content above panels (e.g. shared title). */
  header?: React.ReactNode
  /** Optional content below panels (above subtitle zone). */
  footer?: React.ReactNode
  subtitle?: string
  subtitleSegments?: SubtitleSegment[]
  videoOffset?: number
}

/**
 * TwoColumnCompare — standardized side-by-side comparison.
 *
 * Replaces hand-written `<div style={{ flex: 1, display: 'flex', gap: 40 }}>` blocks
 * with a structured "title + body + caption" layout. Each panel has equal flex sizing,
 * matching borders/padding, accent color theming.
 *
 * Default direction is 'vertical' (top/bottom) for 9:16 mobile — but supports
 * horizontal too. Layout primitives handle SafeArea, no manual padding required.
 */
export const TwoColumnCompare: React.FC<TwoColumnCompareProps> = ({
  left,
  right,
  direction = 'vertical',
  gap = 32,
  background,
  header,
  footer,
  subtitle,
  subtitleSegments,
  videoOffset,
}) => {
  const renderPanel = (panel: ComparePanel) => (
    <div
      style={{
        flex: 1,
        background: panel.background ?? `${panel.accent}1a`, // ~10% alpha
        border: `3px solid ${panel.accent}`,
        borderRadius: 24,
        padding: 40,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        opacity: panel.opacity ?? 1,
        minWidth: 0, // prevents flex overflow on horizontal
      }}
    >
      <div
        style={{
          fontSize: 52,
          fontWeight: 800,
          color: panel.accent,
          marginBottom: 32,
          textAlign: 'center',
        }}
      >
        {panel.title}
      </div>
      <div
        style={{
          flex: 1,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {panel.body}
      </div>
      {panel.caption && (
        <div
          style={{
            marginTop: 28,
            fontSize: 32,
            fontWeight: 600,
            color: panel.accent,
            textAlign: 'center',
            opacity: 0.9,
          }}
        >
          {panel.caption}
        </div>
      )}
    </div>
  )

  return (
    <AbsoluteFill
      style={{
        background,
        padding: `${SAFE_AREA.TOP}px ${SAFE_AREA.LEFT}px ${SAFE_AREA.CONTENT_BOTTOM}px`,
        boxSizing: 'border-box',
        flexDirection: 'column',
      }}
    >
      {header && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: 24,
          }}
        >
          {header}
        </div>
      )}

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: direction === 'vertical' ? 'column' : 'row',
          gap,
          minHeight: 0,
        }}
      >
        {renderPanel(left)}
        {renderPanel(right)}
      </div>

      {footer && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: 24,
          }}
        >
          {footer}
        </div>
      )}

      {subtitleSegments && videoOffset !== undefined && (
        <ProgressiveSubtitle segments={subtitleSegments} videoOffset={videoOffset} />
      )}
      {!subtitleSegments && subtitle && <Subtitle text={subtitle} />}
    </AbsoluteFill>
  )
}
