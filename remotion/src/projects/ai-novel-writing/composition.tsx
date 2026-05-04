// Theme: Neon — 前沿/突破/AI
import React from 'react'
import { AbsoluteFill, staticFile } from 'remotion'
import { Audio } from '@remotion/media'
import { TransitionSeries, linearTiming } from '@remotion/transitions'
import { fade } from '@remotion/transitions/fade'
import { slide } from '@remotion/transitions/slide'
import { wipe } from '@remotion/transitions/wipe'
import { flip } from '@remotion/transitions/flip'
import { Shot1 } from './shots/Shot1'
import { Shot2 } from './shots/Shot2'
import { Shot3 } from './shots/Shot3'
import { Shot4 } from './shots/Shot4'
import { Shot5 } from './shots/Shot5'
import { Shot6 } from './shots/Shot6'
import { Shot7 } from './shots/Shot7'
import { Shot8 } from './shots/Shot8'
import { BGMAudio, SFXLayer } from '../../components'

const FPS = 30

// Shot durations from voiceover manifest (seconds → frames)
const shotDurations = [4.27, 11.74, 11.95, 9.94, 11.49, 12.15, 11.83, 7.87] as const
const shotFrames = shotDurations.map((s) => Math.round(s * FPS))

// Transition durations (frames) — distributed to keep audio in sync
const transitions = [
  { frames: 15, presentation: fade() },
  { frames: 12, presentation: slide({ direction: 'from-right' }) },
  { frames: 15, presentation: fade() },
  { frames: 12, presentation: slide({ direction: 'from-bottom' }) },
  { frames: 15, presentation: wipe() },
  { frames: 15, presentation: fade() },
  { frames: 15, presentation: flip() },
] as const

// Sequence durations = audio frames + transition overlap (keeps audio timing aligned)
const seqDurations = shotFrames.map((sf, i) =>
  i < transitions.length ? sf + transitions[i].frames : sf,
)

export const durationInFrames =
  seqDurations.reduce((a, b) => a + b, 0) -
  transitions.reduce((a, t) => a + t.frames, 0)


// Subtitle segments per shot (from voiceover-manifest.json)
const manifestSegments = [
  { text: "用AI写小说，不是你输入一句'帮我写个故事'就完了。", start: 0, end: 4.27, duration: 4.27 },
  { text: '很多人第一次用AI写小说，得到的结果就是：文笔干巴巴、人物像纸片、情节全是套路。', start: 4.27, end: 11.74, duration: 7.46 },
  { text: '问题不在AI不行，是你缺一套系统方法。', start: 11.74, end: 16.01, duration: 4.27 },
  { text: '第一步，构建世界观。', start: 16.01, end: 18.26, duration: 2.26 },
  { text: '别急着写正文，先把时代背景、核心规则打磨好。', start: 18.26, end: 22.92, duration: 4.66 },
  { text: '这些设定会贯穿整部小说，是AI理解你故事的基础。', start: 22.92, end: 27.96, duration: 5.04 },
  { text: '第二步，设计角色。', start: 27.96, end: 29.98, duration: 2.02 },
  { text: '给每个角色写档案：性格、背景、说话方式。', start: 29.98, end: 33.62, duration: 3.65 },
  { text: '角色越立体，AI生成的对话和行动就越自然。', start: 33.62, end: 37.9, duration: 4.27 },
  { text: '第三步，列大纲。', start: 37.9, end: 39.74, duration: 1.85 },
  { text: '把故事拆成章节，每章写清楚：发生了什么、人物有什么变化、埋了什么伏笔。', start: 39.74, end: 46.56, duration: 6.82 },
  { text: '大纲越细，AI越不会跑偏。', start: 46.56, end: 49.39, duration: 2.83 },
  { text: '第四步，逐章生成。', start: 49.39, end: 51.65, duration: 2.26 },
  { text: '每次只写一章，写完立刻审查。', start: 51.65, end: 54.86, duration: 3.22 },
  { text: '重点检查：情节是否推进了、角色是否符合人设、和前文有没有矛盾。', start: 54.86, end: 61.54, duration: 6.67 },
  { text: '最关键的技能是上下文管理。', start: 61.54, end: 64.37, duration: 2.83 },
  { text: 'AI的记忆有限，', start: 64.37, end: 66.41, duration: 2.04 },
  { text: '每开新章节，', start: 66.41, end: 67.87, duration: 1.46 },
  { text: '要把前情提要和角色状态重新喂给它，', start: 67.87, end: 71.11, duration: 3.24 },
  { text: '否则人物会突然失忆。', start: 71.11, end: 73.37, duration: 2.26 },
  { text: 'AI不会替你成为作家，但能让你的创作效率大幅提升。', start: 73.37, end: 78.58, duration: 5.21 },
  { text: '关注我，分享更多AI创作技巧。', start: 78.58, end: 81.24, duration: 2.66 },
]

// Group segments by shot index (from manifest: shot 1-8)
const shotSegments = [
  manifestSegments.filter((s) => s.start >= 0 && s.start < 4.27),
  manifestSegments.filter((s) => s.start >= 4.27 && s.start < 16.01),
  manifestSegments.filter((s) => s.start >= 16.01 && s.start < 27.96),
  manifestSegments.filter((s) => s.start >= 27.96 && s.start < 37.9),
  manifestSegments.filter((s) => s.start >= 37.9 && s.start < 49.39),
  manifestSegments.filter((s) => s.start >= 49.39 && s.start < 61.54),
  manifestSegments.filter((s) => s.start >= 61.54 && s.start < 73.37),
  manifestSegments.filter((s) => s.start >= 73.37),
]

const shotSubtitleSegments = shotSegments.map((segs) => {
  const shotStart = segs[0].start
  return segs.map((s) => ({
    text: s.text,
    start: s.start - shotStart,
    end: s.end - shotStart,
    duration: s.duration,
  }))
})

// SFX per shot
const shotSfx: { type: string; delay?: number }[][] = [
  [{ type: 'whoosh-in' }],
  [{ type: 'impact', delay: 0.3 }],
  [{ type: 'text-pop' }],
  [{ type: 'text-pop' }],
  [{ type: 'text-pop' }],
  [{ type: 'impact' }],
  [{ type: 'impact', delay: 0.3 }, { type: 'text-pop', delay: 1.5 }],
  [{ type: 'outro' }],
]

export const AiNovelWriting: React.FC = () => {
  return (
    <AbsoluteFill>
      <Audio src={staticFile('/audio/ai-novel-writing/voiceover-full.mp3')} volume={1} />
      <BGMAudio
        style="科技电子"
        tempo="medium"
        volume={0.08}
        voiceoverSegments={[{ start: 0, end: 81.24 }]}
      />

      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={seqDurations[0]}>
          <Shot1 subtitleSegments={shotSubtitleSegments[0]} />
          <SFXLayer effects={shotSfx[0]} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={transitions[0].presentation}
          timing={linearTiming({ durationInFrames: transitions[0].frames })}
        />

        <TransitionSeries.Sequence durationInFrames={seqDurations[1]}>
          <Shot2 subtitleSegments={shotSubtitleSegments[1]} />
          <SFXLayer effects={shotSfx[1]} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={transitions[1].presentation}
          timing={linearTiming({ durationInFrames: transitions[1].frames })}
        />

        <TransitionSeries.Sequence durationInFrames={seqDurations[2]}>
          <Shot3 subtitleSegments={shotSubtitleSegments[2]} />
          <SFXLayer effects={shotSfx[2]} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={transitions[2].presentation}
          timing={linearTiming({ durationInFrames: transitions[2].frames })}
        />

        <TransitionSeries.Sequence durationInFrames={seqDurations[3]}>
          <Shot4 subtitleSegments={shotSubtitleSegments[3]} />
          <SFXLayer effects={shotSfx[3]} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={transitions[3].presentation}
          timing={linearTiming({ durationInFrames: transitions[3].frames })}
        />

        <TransitionSeries.Sequence durationInFrames={seqDurations[4]}>
          <Shot5 subtitleSegments={shotSubtitleSegments[4]} />
          <SFXLayer effects={shotSfx[4]} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={transitions[4].presentation}
          timing={linearTiming({ durationInFrames: transitions[4].frames })}
        />

        <TransitionSeries.Sequence durationInFrames={seqDurations[5]}>
          <Shot6 subtitleSegments={shotSubtitleSegments[5]} />
          <SFXLayer effects={shotSfx[5]} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={transitions[5].presentation}
          timing={linearTiming({ durationInFrames: transitions[5].frames })}
        />

        <TransitionSeries.Sequence durationInFrames={seqDurations[6]}>
          <Shot7 subtitleSegments={shotSubtitleSegments[6]} />
          <SFXLayer effects={shotSfx[6]} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={transitions[6].presentation}
          timing={linearTiming({ durationInFrames: transitions[6].frames })}
        />

        <TransitionSeries.Sequence durationInFrames={seqDurations[7]}>
          <Shot8 subtitleSegments={shotSubtitleSegments[7]} />
          <SFXLayer effects={shotSfx[7]} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  )
}
