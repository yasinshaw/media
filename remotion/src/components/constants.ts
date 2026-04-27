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

export const BGM = {
  DEFAULT_VOLUME: 0.08,
  MIN_VOLUME: 0.01,
  MAX_VOLUME: 0.20,
  FADE_IN_SECONDS: 2,
  FADE_OUT_SECONDS: 3,
} as const

export const SFX = {
  VOLUME: 0.15,
  DEFAULT_DELAYS: {
    'whoosh-in': 0,
    'whoosh': 0,
    'impact': 1,
    'text-pop': 0.5,
    'outro': 0,
  } as Record<string, number>,
} as const

export const BGM_STYLE_MAP: Record<string, string> = {
  '科技电子': 'tech',
  '轻松愉快': 'upbeat',
  '紧张悬疑': 'tense',
  '温馨抒情': 'warm',
  '史诗大气': 'epic',
} as const

export const SFX_FILE_MAP: Record<string, string> = {
  'whoosh-in': '/audio/sfx/whoosh-in.mp3',
  'whoosh': '/audio/sfx/whoosh.mp3',
  'impact': '/audio/sfx/impact.mp3',
  'text-pop': '/audio/sfx/text-pop.mp3',
  'outro': '/audio/sfx/outro.mp3',
} as const
