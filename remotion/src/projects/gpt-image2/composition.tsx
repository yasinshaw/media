import React from 'react'
import { AbsoluteFill, Sequence, Audio, staticFile, useVideoConfig } from 'remotion'
import { Shot1 } from './shots/Shot1'
import { Shot2 } from './shots/Shot2'
import { Shot3 } from './shots/Shot3'
import { Shot4 } from './shots/Shot4'
import { Shot5 } from './shots/Shot5'
import { Shot6 } from './shots/Shot6'

export interface SubtitleSegment {
  text: string
  start: number
  end: number
  duration: number
}

// Per-shot subtitle segments (stable-ts aligned, relative to audio start)
const shot1Segments: SubtitleSegment[] = [
  { text: 'GPT Image 2 来了，', start: 0.46, end: 2.72, duration: 2.26 },
  { text: 'AI 生图又变天了', start: 2.72, end: 4.08, duration: 1.36 },
]

const shot2Segments: SubtitleSegment[] = [
  { text: '一年前 GPT Image 1 发布，', start: 0.44, end: 3.33, duration: 2.89 },
  { text: '首周 1.3 亿用户生成了 7 亿张图片，', start: 3.33, end: 6.52, duration: 3.19 },
  { text: '吉卜力风潮直接刷屏。', start: 6.52, end: 8.05, duration: 1.53 },
  { text: '但 AI 生图一直有个致命弱点。', start: 8.05, end: 10.48, duration: 2.43 },
]

const shot3Segments: SubtitleSegment[] = [
  { text: '文字。', start: 0.32, end: 0.79, duration: 0.47 },
  { text: '之前的模型生成的文字基本是乱码。', start: 0.79, end: 3.29, duration: 2.5 },
  { text: 'GPT Image 2 基本解决了这个问题，', start: 3.29, end: 6.73, duration: 3.44 },
  { text: '文本渲染准确率接近 99%。', start: 6.73, end: 8.92, duration: 2.19 },
]

const shot4Segments: SubtitleSegment[] = [
  { text: '分辨率从 1536 直接提升到 4K，', start: 0.48, end: 3.5, duration: 3.02 },
  { text: '速度从十几秒缩短到只要 3 秒，', start: 3.5, end: 6.04, duration: 2.54 },
  { text: '还支持了 16:9 宽屏。', start: 6.04, end: 8.1, duration: 2.06 },
]

const shot5Segments: SubtitleSegment[] = [
  { text: '新增 Thinking Mode 思考模式，', start: 0.52, end: 4.07, duration: 3.55 },
  { text: '能自检输出、', start: 4.07, end: 5.04, duration: 0.97 },
  { text: '保持多张图风格一致。', start: 5.04, end: 6.65, duration: 1.61 },
  { text: 'UI 截图生成更是逼真到离谱，', start: 6.65, end: 9.07, duration: 2.42 },
  { text: '设计师看了都得愣一下。', start: 9.07, end: 10.84, duration: 1.77 },
]

const shot6Segments: SubtitleSegment[] = [
  { text: 'AI 生图已经从玩具变成生产力工具了。', start: 0.44, end: 3.2, duration: 2.76 },
  { text: '你用 GPT Image 2 生成过什么？', start: 3.2, end: 6.24, duration: 3.04 },
  { text: '评论区聊聊。', start: 6.24, end: 7.11, duration: 0.87 },
  { text: '关注我，第一时间了解 AI 动态。', start: 7.11, end: 9.58, duration: 2.47 },
]

// Shot timing from voiceover manifest
const shotData = [
  { number: 1, duration: 4.27 },
  { number: 2, duration: 10.66 },
  { number: 3, duration: 9.22 },
  { number: 4, duration: 8.42 },
  { number: 5, duration: 11.06 },
  { number: 6, duration: 9.86 },
]

// Calculate cumulative frame positions
const fps = 30
let currentFrame = 0
const shotFrames = shotData.map((shot) => {
  const from = currentFrame
  const durationInFrames = Math.round(shot.duration * fps)
  currentFrame += durationInFrames
  return { ...shot, from, durationInFrames }
})

const durationInFrames = currentFrame

// Per-shot segment arrays for easy indexing
const allShotSegments: SubtitleSegment[][] = [
  shot1Segments,
  shot2Segments,
  shot3Segments,
  shot4Segments,
  shot5Segments,
  shot6Segments,
]

const shotComponents = [Shot1, Shot2, Shot3, Shot4, Shot5, Shot6]

export const GptImage2: React.FC = () => {
  const { fps } = useVideoConfig()

  return (
    <AbsoluteFill style={{ background: '#0f172a' }}>
      {shotFrames.map((shot, i) => {
        const ShotComponent = shotComponents[i]
        return (
          <Sequence
            key={i}
            from={shot.from}
            durationInFrames={shot.durationInFrames}
            premountFor={fps}
          >
            <ShotComponent
              subtitleSegments={allShotSegments[i]}
              videoOffset={0}
            />
            <Audio src={staticFile(`/audio/gpt-image2/voiceover-0${i + 1}.mp3`)} />
          </Sequence>
        )
      })}
    </AbsoluteFill>
  )
}

export { durationInFrames }
