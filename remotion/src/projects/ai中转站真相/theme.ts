// Theme: Ocean — 技术调查 / 揭露
// 配色策略：用 Ocean 蓝色调表达"科技调查/真相"语感，红色作为语义警示色用于 ❌ 和"假模型"等告警节点。
import { loadFont } from '@remotion/google-fonts/NotoSansSC'

const { fontFamily } = loadFont()

export const FONT_FAMILY = fontFamily

export const theme = {
  // Primary palette
  accent: '#0EA5E9',     // electric blue
  accentAlt: '#06B6D4',  // cyan
  // Semantic colors (sparingly, for danger / success markers)
  danger: '#DC2626',
  dangerSoft: '#F87171',
  success: '#10B981',
  warning: '#F59E0B',
  // Text
  textOnLight: '#0C4A6E',
  textSecondaryOnLight: '#475569',
  textOnDark: '#F0F9FF',
  textSecondaryOnDark: '#94A3B8',
  // Cards
  cardBgLight: 'rgba(14,165,233,0.08)',
  cardBorderLight: 'rgba(14,165,233,0.18)',
  cardBgDark: 'rgba(255,255,255,0.06)',
  cardBorderDark: 'rgba(255,255,255,0.12)',
} as const

// Background distribution per shot (Ocean palette + dark variants for emphasis shots)
export const backgrounds = [
  'linear-gradient(135deg, #0C1E2E, #0C4A6E)', // Shot 1: hook (dark, dramatic)
  'linear-gradient(135deg, #F0F9FF, #BAE6FD)', // Shot 2: pain point
  'linear-gradient(135deg, #ECFEFF, #A5F3FC)', // Shot 3: data
  'linear-gradient(135deg, #EFF6FF, #BFDBFE)', // Shot 4: 套路
  'linear-gradient(135deg, #0C2A4A, #075985)', // Shot 5: 后果 (dark)
  'linear-gradient(135deg, #E0F2FE, #7DD3FC)', // Shot 6: 更多风险
  'linear-gradient(135deg, #F0FDFA, #99F6E4)', // Shot 7: 自保方法
  'linear-gradient(135deg, #082F49, #0C4A6E)', // Shot 8: CTA (dark, finale)
] as const
