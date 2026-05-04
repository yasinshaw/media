// Theme: Ocean — 技术/产品/AI
import type { SubtitleSegment } from '../../components/ProgressiveSubtitle'

export const theme = {
  backgrounds: [
    'radial-gradient(circle at 50% 30%, #0C4A6E, #0F172A)',  // Shot 1 — dark hook
    'linear-gradient(135deg, #F0F9FF, #BAE6FD)',              // Shot 2 — light
    'linear-gradient(135deg, #ECFEFF, #A5F3FC)',              // Shot 3 — cyan
    'linear-gradient(135deg, #F0FDFA, #99F6E4)',              // Shot 4 — teal
    'linear-gradient(135deg, #EFF6FF, #BFDBFE)',              // Shot 5 — blue
    'linear-gradient(135deg, #E0F2FE, #7DD3FC)',              // Shot 6 — medium blue
    'linear-gradient(135deg, #F0F9FF, #BAE6FD)',              // Shot 7 — light
    'linear-gradient(135deg, #ECFEFF, #A5F3FC)',              // Shot 8 — cyan
    'radial-gradient(circle at 50% 70%, #075985, #0F172A)',  // Shot 9 — dark CTA
  ],
  accent: '#0EA5E9',
  accentAlt: '#06B6D4',
  textPrimary: '#0C4A6E',
  textSecondary: '#64748B',
  textLight: '#F8FAFC',
  textLightSecondary: '#94A3B8',
  cardBg: 'rgba(255,255,255,0.85)',
  cardBgDark: 'rgba(255,255,255,0.08)',
  success: '#22C55E',
  danger: '#EF4444',
} as const

// Raw durations from audio manifest. Padded by subsequent transition frames
// so TransitionSeries compressed duration matches audio length (3395 frames).
// Each shot gains the transition frames that follow it (except the last shot).
// Transition frames: 15+15+15+15+18+15+15+15 = 123
export const SHOT_DURATIONS = [136, 232, 326, 526, 568, 439, 503, 495, 293] as const
export const TOTAL_FRAMES = 3395
export const SHOT_START_SECONDS = [0, 4.03, 11.26, 21.6, 38.62, 56.93, 71.06, 87.31, 103.3] as const

export const SHOT_SUBTITLES: SubtitleSegment[][] = [
  [{ text: '输入一个关键词，AI 帮你生成一条完整的短视频。', start: 0, end: 4.03, duration: 4.03 }],
  [{ text: '做一条短视频，你要写文案、找素材、配音、剪辑、加字幕，搞下来大半天没了。', start: 4.03, end: 11.26, duration: 7.23 }],
  [
    { text: '今天介绍一个阿里开源的项目——Pixelle-Video。', start: 11.26, end: 14.5, duration: 3.24 },
    { text: 'GitHub 将近一万颗星，完全免费。', start: 14.5, end: 17.74, duration: 3.24 },
    { text: '你只需要输入一个主题，它自动帮你搞定一切。', start: 17.74, end: 21.6, duration: 3.86 },
  ],
  [
    { text: '整个流程是这样的：AI 先帮你写文案，支持通义千问、DeepSeek、GPT。', start: 21.6, end: 27.48, duration: 5.88 },
    { text: '然后自动生成配图，用 FLUX 模型画插图。', start: 27.48, end: 31.92, duration: 4.44 },
    { text: '接着合成语音配音，加上背景音乐，最后直接输出成片。', start: 31.92, end: 37.15, duration: 5.23 },
    { text: '全程自动化。', start: 37.15, end: 38.62, duration: 1.47 },
  ],
  [
    { text: '但这个项目最厉害的地方，是它的架构。', start: 38.62, end: 41.86, duration: 3.24 },
    { text: '它基于 ComfyUI 工作流，每个环节都是独立模块。', start: 41.86, end: 45.72, duration: 3.86 },
    { text: '你想换生图模型？', start: 45.72, end: 47.35, duration: 1.63 },
    { text: '把 FLUX 换成 Stable Diffusion。', start: 47.35, end: 51.0, duration: 3.65 },
    { text: '想换语音？', start: 51.0, end: 52.22, duration: 1.22 },
    { text: '换成 ChatTTS。', start: 52.22, end: 54.1, duration: 1.88 },
    { text: '像搭积木一样，灵活组合。', start: 54.1, end: 56.93, duration: 2.83 },
  ],
  [
    { text: '更厉害的是，', start: 56.93, end: 58.15, duration: 1.22 },
    { text: '它还支持 AI 视频生成，', start: 58.15, end: 60.6, duration: 2.45 },
    { text: '用阿里的万相 2.1 模型直接生成动态视频。', start: 60.6, end: 65.02, duration: 4.42 },
    { text: '还有数字人口播、动作迁移这些前沿功能，一张照片就能让角色动起来。', start: 65.02, end: 71.06, duration: 6.04 },
  ],
  [
    { text: '跟同类工具 MoneyPrinterTurbo 比一下。', start: 71.06, end: 74.3, duration: 3.24 },
    { text: '基础功能两者差不多，', start: 74.3, end: 76.34, duration: 2.04 },
    { text: '但 Pixelle 多了 AI 视频生成、', start: 76.34, end: 79.18, duration: 2.84 },
    { text: '数字人、', start: 79.18, end: 80.4, duration: 1.22 },
    { text: '还有整个 ComfyUI 生态的支持。', start: 80.4, end: 83.06, duration: 2.66 },
    { text: '简单说，它不只是拼接素材，是真的在生成内容。', start: 83.06, end: 87.31, duration: 4.25 },
  ],
  [
    { text: '成本方面，三种方案随你选。', start: 87.31, end: 90.36, duration: 3.05 },
    { text: '用 Ollama 加本地 ComfyUI，完全免费，零成本运行。', start: 90.36, end: 95.4, duration: 5.04 },
    { text: '想省事可以用通义千问，成本极低。', start: 95.4, end: 98.64, duration: 3.24 },
    { text: '甚至有 Windows 一键整合包和 Docker 部署，开箱即用。', start: 98.64, end: 103.3, duration: 4.66 },
  ],
  [
    { text: '想做自媒体但不会剪视频？', start: 103.3, end: 105.72, duration: 2.42 },
    { text: '去 GitHub 搜索 Pixelle-Video，', start: 105.72, end: 108.96, duration: 3.24 },
    { text: '完全开源免费，', start: 108.96, end: 110.59, duration: 1.63 },
    { text: '零门槛上手，', start: 110.59, end: 111.82, duration: 1.23 },
    { text: '赶紧试试吧。', start: 111.82, end: 113.04, duration: 1.22 },
  ],
]
