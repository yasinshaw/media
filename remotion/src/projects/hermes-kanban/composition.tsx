// Theme: Neon — 前沿/突破/震撼
import React from 'react'
import { AbsoluteFill, Sequence, staticFile, useVideoConfig } from 'remotion'
import { Audio } from '@remotion/media'
import { BGMAudio, SFXLayer, Transition } from '../../components'
import { Shot1 } from './shots/Shot1'
import { Shot2 } from './shots/Shot2'
import { Shot3 } from './shots/Shot3'
import { Shot4 } from './shots/Shot4'
import { Shot5 } from './shots/Shot5'

interface SubtitleSegment {
  text: string
  start: number
  end: number
  duration: number
}

const TRAILING_PUNCT = /[。！？.!?\s]+$/

const rawSegments: SubtitleSegment[] = [
  { text: '一个AI Agent，自己拆任务、找素材、剪视频，全程没人插手。', start: 0, end: 5.55, duration: 5.55 },
  { text: '多Agent协作听起来很酷，但实际用起来一塌糊涂。', start: 5.55, end: 9.88, duration: 4.33 },
  { text: '主Agent串行调度子Agent，谁先谁后全靠它判断。', start: 9.88, end: 14.56, duration: 4.68 },
  { text: '任务一复杂，主Agent自己就成瓶颈了，子Agent崩了整个流程就卡死。', start: 14.56, end: 20.8, duration: 6.24 },
  { text: 'Hermes的思路完全不一样：把任务扔上看板，让Agent自己去抢。', start: 20.8, end: 26.7, duration: 5.89 },
  { text: '底层SQLite加原子事务，', start: 26.7, end: 29.12, duration: 2.43 },
  { text: '多个Agent同时抢同一个任务，', start: 29.12, end: 31.9, duration: 2.77 },
  { text: '只有一个能拿到，', start: 31.9, end: 33.28, duration: 1.39 },
  { text: '不会重复执行。', start: 33.28, end: 34.5, duration: 1.21 },
  { text: '更厉害的是依赖引擎。', start: 34.5, end: 36.23, duration: 1.73 },
  { text: '上游任务完成，下游自动从待办提到就绪。', start: 36.23, end: 39.52, duration: 3.29 },
  { text: 'Worker之间交接走结构化的summary和metadata，不用翻聊天记录。', start: 39.52, end: 46.46, duration: 6.93 },
  { text: 'Agent挂了？', start: 46.46, end: 47.84, duration: 1.39 },
  { text: '自动释放回队列。', start: 47.84, end: 49.23, duration: 1.39 },
  { text: '连续失败三次？', start: 49.23, end: 50.44, duration: 1.21 },
  { text: '自动熔断，自动通知你。', start: 50.44, end: 52.35, duration: 1.91 },
  { text: '扇出并行、流水线、投票仲裁、人工介入，多种协作模式全都有。', start: 52.35, end: 57.38, duration: 5.03 },
  { text: 'MIT开源免费，想试试的话，评论区见。', start: 57.38, end: 60.67, duration: 3.29 },
]

const segments: SubtitleSegment[] = rawSegments.map((s) => ({
  ...s,
  text: s.text.replace(TRAILING_PUNCT, ''),
}))

const voiceoverTimings = segments.map(({ start, end }) => ({ start, end }))

const shotData = [
  { number: 1, duration: 5.55, startTime: 0 },
  { number: 2, duration: 15.25, startTime: 5.55 },
  { number: 3, duration: 13.7, startTime: 20.8 },
  { number: 4, duration: 17.85, startTime: 34.5 },
  { number: 5, duration: 8.32, startTime: 52.35 },
]

const fps = 30
let currentFrame = 0
const shotFrames = shotData.map((shot) => {
  const from = currentFrame
  const durationInFrames = Math.round(shot.duration * fps)
  currentFrame += durationInFrames
  return { ...shot, from, durationInFrames }
})

export const durationInFrames = currentFrame

export const HermesKanban: React.FC = () => {
  const { fps } = useVideoConfig()

  return (
    <AbsoluteFill style={{ background: '#0f172a' }}>
      <BGMAudio style="科技电子" tempo="medium" voiceoverSegments={voiceoverTimings} />

      <Audio src={staticFile('/audio/hermes-kanban/voiceover-full.mp3')} volume={1} />

      <Sequence from={shotFrames[0].from} durationInFrames={shotFrames[0].durationInFrames} premountFor={1 * fps}>
        <Shot1 subtitleSegments={segments} videoOffset={shotData[0].startTime} />
        <SFXLayer effects={[{ mood: 'epic', action: 'transition', intensity: 'strong' }]} />
      </Sequence>

      <Sequence from={shotFrames[1].from} durationInFrames={shotFrames[1].durationInFrames} premountFor={1 * fps}>
        <Transition type="slide-down">
          <Shot2 subtitleSegments={segments} videoOffset={shotData[1].startTime} />
        </Transition>
        <SFXLayer effects={[{ mood: 'tense', action: 'transition', intensity: 'medium' }]} />
      </Sequence>

      <Sequence from={shotFrames[2].from} durationInFrames={shotFrames[2].durationInFrames} premountFor={1 * fps}>
        <Transition type="fade">
          <Shot3 subtitleSegments={segments} videoOffset={shotData[2].startTime} />
        </Transition>
        <SFXLayer effects={[{ mood: 'energetic', action: 'emphasis', intensity: 'medium' }]} />
      </Sequence>

      <Sequence from={shotFrames[3].from} durationInFrames={shotFrames[3].durationInFrames} premountFor={1 * fps}>
        <Transition type="fade">
          <Shot4 subtitleSegments={segments} videoOffset={shotData[3].startTime} />
        </Transition>
        <SFXLayer effects={[
          { mood: 'calm', action: 'ambient', intensity: 'subtle' },
          { mood: 'energetic', action: 'emphasis', intensity: 'medium' },
        ]} />
      </Sequence>

      <Sequence from={shotFrames[4].from} durationInFrames={shotFrames[4].durationInFrames} premountFor={1 * fps}>
        <Transition type="slide-right">
          <Shot5 subtitleSegments={segments} videoOffset={shotData[4].startTime} />
        </Transition>
        <SFXLayer effects={[{ mood: 'epic', action: 'emphasis', intensity: 'medium' }]} />
      </Sequence>
    </AbsoluteFill>
  )
}
