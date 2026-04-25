// Reusable Remotion components for Douyin vertical videos.
//
// PREFERRED: use Layout primitives (CenteredStack / HubLayout / TwoColumnCompare /
// TimelineFlow) — they encapsulate SafeArea + alignment + subtitles. Hand-written
// AbsoluteFill with manual padding should only appear when no primitive fits.

// === Layout primitives (use these first) ===
export { SafeArea } from './SafeArea'
export { CenteredStack } from './CenteredStack'
export { HubLayout } from './HubLayout'
export { TwoColumnCompare } from './TwoColumnCompare'
export { TimelineFlow } from './TimelineFlow'

// === Subtitles (auto-rendered by primitives, exported for custom shots) ===
export { Subtitle } from './Subtitle'
export { ProgressiveSubtitle, type SubtitleSegment } from './ProgressiveSubtitle'

// === Visual elements ===
export { Overlay } from './Overlay'
export { TalkingHead } from './TalkingHead'
export { ScreenRecording } from './ScreenRecording'
export { SplitScreen } from './SplitScreen'
export { CTA } from './CTA'
export { Demo } from './Demo'

// === Constants ===
export { SAFE_AREA, SUBTITLE, LAYOUT } from './constants'
