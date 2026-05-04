// Safe area constants for Douyin vertical videos (1080×1920)
export const SAFE_AREA = {
  // UI overlay safe zone
  TOP: 120,           // Status bar, notch
  LEFT: 40,           // Side margins
  RIGHT: 40,          // Side margins
  BOTTOM: 200,        // Douyin UI overlays (like, comment, share)

  // Subtitle zone (sits above Douyin UI)
  SUBTITLE_BOTTOM: 240,  // BOTTOM (200) + 40 gap

  // Content safe zone (above subtitle area)
  // Subtitle top ≈ SUBTITLE_BOTTOM (240) + 2 lines × 46px × 1.5 line-height (138) = 378
  // Plus 42px gap above subtitle → 420
  CONTENT_BOTTOM: 420,
} as const

export const SUBTITLE = {
  FONT_SIZE: 46,
  LINE_HEIGHT: 1.5,
  SIDE_PADDING: 60,
  FADE_DURATION: 6, // frames (0.2s at 30fps)
} as const

export const LAYOUT = {
  WIDTH: 1080,
  HEIGHT: 1920,
  FPS: 30,
} as const

// ── BGM ──────────────────────────────────────────────────────────
export const BGM = {
  DEFAULT_VOLUME: 0.06,
  DUCKED_VOLUME: 0.02,
  MIN_VOLUME: 0.01,
  MAX_VOLUME: 0.15,
  FADE_IN_SECONDS: 1.5,
  FADE_OUT_SECONDS: 2.5,
  DUCK_FADE_SECONDS: 0.3,
  TEMPOS: ['slow', 'medium', 'fast'] as const,
} as const

export const BGM_STYLE_MAP: Record<string, string> = {
  '科技电子': 'tech',
  '轻松愉快': 'upbeat',
  '温馨抒情': 'warm',
  '史诗大气': 'epic',
  '轻快节奏': 'light',
  '紧张悬疑': 'tense',
} as const

// ── SFX ──────────────────────────────────────────────────────────
export const SFX = {
  VOLUME: 0.50,
  DEFAULT_DELAYS: {
    'whoosh-in': 0,
    'whoosh': 0,
    'swoosh': 0,
    'impact': 0.3,
    'text-pop': 0.2,
    'ding': 0.1,
    'click': 0,
    'riser': 0,
    'glitch': 0,
    'reveal': 0.2,
    'transition': 0,
    'success': 0.1,
    'outro': 0,
  } as Record<string, number>,
  VOLUME_OVERRIDES: {
    'impact': 0.40,
    'glitch': 0.35,
    'riser': 0.45,
    'outro': 0.55,
  } as Record<string, number>,
} as const

export const SFX_FILE_MAP: Record<string, string> = {
  // Transitions
  'whoosh-in': '/audio/sfx/whoosh-in.mp3',
  'whoosh': '/audio/sfx/whoosh.mp3',
  'swoosh': '/audio/sfx/swoosh.mp3',
  'transition': '/audio/sfx/transition.mp3',
  'riser': '/audio/sfx/riser.mp3',
  // Emphasis
  'impact': '/audio/sfx/impact.mp3',
  'text-pop': '/audio/sfx/text-pop.mp3',
  'reveal': '/audio/sfx/reveal.mp3',
  'ding': '/audio/sfx/ding.mp3',
  'click': '/audio/sfx/click.mp3',
  // Feedback
  'success': '/audio/sfx/success.mp3',
  'glitch': '/audio/sfx/glitch.mp3',
  'outro': '/audio/sfx/outro.mp3',
} as const

// ── SFX 3D Taxonomy ──────────────────────────────────────────────

export const SFX_MOODS = ['energetic', 'calm', 'tense', 'playful', 'epic', 'neutral'] as const
export type SFXMood = (typeof SFX_MOODS)[number]

export const SFX_ACTIONS = ['transition', 'emphasis', 'entry', 'exit', 'ambient', 'feedback'] as const
export type SFXAction = (typeof SFX_ACTIONS)[number]

export const SFX_INTENSITIES = ['subtle', 'medium', 'strong'] as const
export type SFXIntensity = (typeof SFX_INTENSITIES)[number]

export type SFXLayerType = 'ambient' | 'action' | 'design'

export const SFX_LAYER_DEFAULTS: Record<SFXLayerType, { volume: number }> = {
  ambient: { volume: 0.10 },
  action: { volume: 0.35 },
  design: { volume: 0.45 },
} as const

export const SFX_LAYER_SCALE: Record<number, number> = {
  1: 1.0,
  2: 0.8,
  3: 0.7,
}

// Static manifest of available SFX files (taxonomy-named only).
// Legacy files (impact.mp3, whoosh.mp3) are handled by SFX_FILE_MAP, not this list.
// Update via: scripts/update-sfx-manifest.sh
export const SFX_AVAILABLE_FILES: string[] = [
  // Populated by update-sfx-manifest.sh — add taxonomy-named files here
]
