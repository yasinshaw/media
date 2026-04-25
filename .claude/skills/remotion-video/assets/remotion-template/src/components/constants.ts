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
