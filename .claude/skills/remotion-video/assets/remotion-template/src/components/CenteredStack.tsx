import React from 'react'
import { SafeArea } from './SafeArea'
import { Subtitle } from './Subtitle'
import { ProgressiveSubtitle, SubtitleSegment } from './ProgressiveSubtitle'

interface CenteredStackProps {
  children: React.ReactNode
  background?: React.CSSProperties['background']
  /** Max content width in px. Default 900 (≈85% of 1080). */
  maxWidth?: number
  /** Vertical gap between children. Default 32. */
  gap?: number
  /** Horizontal alignment of children. Default 'center'. */
  align?: 'center' | 'flex-start' | 'flex-end' | 'stretch'
  /** Vertical alignment within content area. Default 'center'. */
  justify?: 'center' | 'flex-start' | 'flex-end' | 'space-between'
  /** Voiceover subtitle (single string) */
  subtitle?: string
  /** Voiceover segments (multi-line progressive) */
  subtitleSegments?: SubtitleSegment[]
  /** Offset (s) when this shot starts in full audio */
  videoOffset?: number
}

/**
 * CenteredStack — the default container for any shot.
 *
 * Replaces hand-written `<AbsoluteFill style={{ padding: '120px 40px 200px', ... }}>`.
 * Guarantees:
 *  - Safe area padding (top 120, sides 40, bottom 420 — keeps subtitle zone clear)
 *  - Centered content column with maxWidth limit
 *  - Subtitle automatically rendered in the correct zone
 */
export const CenteredStack: React.FC<CenteredStackProps> = ({
  children,
  background,
  maxWidth = 900,
  gap = 32,
  align = 'center',
  justify = 'center',
  subtitle,
  subtitleSegments,
  videoOffset,
}) => (
  <SafeArea
    style={{
      background,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: justify,
    }}
  >
    <div
      style={{
        width: '100%',
        maxWidth,
        display: 'flex',
        flexDirection: 'column',
        alignItems: align,
        gap,
      }}
    >
      {children}
    </div>
    {subtitleSegments && videoOffset !== undefined && (
      <ProgressiveSubtitle segments={subtitleSegments} videoOffset={videoOffset} />
    )}
    {!subtitleSegments && subtitle && <Subtitle text={subtitle} />}
  </SafeArea>
)
