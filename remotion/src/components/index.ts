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

// === Animations ===
export { useFadeIn, useScaleIn, useSlideIn } from './animations'
export { useStagger, useNumberRoll, useTextReveal } from './animations'
export { useFloat, usePulse, useRotate } from './animations'

// === Backgrounds ===
export { FloatingOrbs, GradientFlow, GridPattern, ParticleField } from './backgrounds'

// === Transitions ===
export { Transition } from './transitions'

// === Audio ===
export { BGMAudio, type BGMAudioConfig, type VoiceoverSegment } from './BGMAudio'
export { SFXLayer, type SFXConfig } from './SFXLayer'
export { matchSFX, translateLegacyType, inferLayer } from './sfx-matcher'
export type { SFXTriple } from './sfx-matcher'

// === Constants ===
export {
  SAFE_AREA, SUBTITLE, LAYOUT, BGM, BGM_STYLE_MAP,
  SFX, SFX_FILE_MAP,
  SFX_MOODS, SFX_ACTIONS, SFX_INTENSITIES,
  SFX_LAYER_DEFAULTS, SFX_LAYER_SCALE,
  SFX_AVAILABLE_FILES,
} from './constants'
export type { SFXMood, SFXAction, SFXIntensity, SFXLayerType } from './constants'
