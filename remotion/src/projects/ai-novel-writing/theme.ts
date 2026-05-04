import { loadFont } from '@remotion/google-fonts/NotoSansSC'

const { fontFamily } = loadFont()

export const FONT_FAMILY = fontFamily

export const theme = {
  accent: '#A78BFA',
  accentAlt: '#38BDF8',
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  cardBg: 'rgba(255,255,255,0.08)',
  cardBorder: 'rgba(255,255,255,0.12)',
  backgrounds: [
    'linear-gradient(135deg, #18181B, #27272A)',
    'linear-gradient(135deg, #1E1B4B, #312E81)',
    'linear-gradient(135deg, #0F172A, #1E293B)',
    'linear-gradient(135deg, #0C4A6E, #075985)',
    'linear-gradient(135deg, #1A1A2E, #16213E)',
  ],
} as const
