// Theme: Ocean — 技术/AI/教程
import React from 'react'
import { AbsoluteFill, staticFile, useVideoConfig } from 'remotion'
import { Audio } from '@remotion/media'
import { TransitionSeries, linearTiming } from '@remotion/transitions'
import { fade } from '@remotion/transitions/fade'
import { slide } from '@remotion/transitions/slide'
import { wipe } from '@remotion/transitions/wipe'
import { Shot1 } from './shots/Shot1'
import { Shot2 } from './shots/Shot2'
import { Shot3 } from './shots/Shot3'
import { Shot4 } from './shots/Shot4'
import { Shot5 } from './shots/Shot5'
import { Shot6 } from './shots/Shot6'
import { Shot7 } from './shots/Shot7'
import { BGMAudio, SFXLayer } from '../../components'

const FPS = 30

// Shot durations from voiceover-manifest.json (seconds → frames)
const shotDurations = [8.21, 9.09, 13.16, 10.82, 15.17, 12.55, 6.29] as const
const shotFrames = shotDurations.map((s) => Math.round(s * FPS))

// Transitions (between shot N and N+1) — from script "转场效果"
const transitions = [
  { frames: 4, presentation: fade() },                               // 1→2: none → mini fade
  { frames: 12, presentation: slide({ direction: 'from-bottom' }) }, // 2→3: slide(from-bottom)
  { frames: 12, presentation: slide({ direction: 'from-right' }) },  // 3→4: slide(from-right)
  { frames: 12, presentation: wipe() },                              // 4→5: wipe
  { frames: 12, presentation: fade() },                              // 5→6: fade
  { frames: 12, presentation: fade() },                              // 6→7: fade
] as const

// Sequence durations include transition overlap
const seqDurations = shotFrames.map((sf, i) =>
  i < transitions.length ? sf + transitions[i].frames : sf,
)

export const durationInFrames =
  seqDurations.reduce((a, b) => a + b, 0) -
  transitions.reduce((a, t) => a + t.frames, 0)

// Per-shot subtitle segments (local time, starting from 0 for each shot)
const shotSubtitleSegments = [
  // Shot 1 (0-8.21s)
  [
    { text: '你知道吗？', start: 0, end: 1.06, duration: 1.06 },
    { text: 'Claude Code 里有一个功能，', start: 1.06, end: 3.1, duration: 2.04 },
    { text: '能让 AI 自动记住你的工作流程，', start: 3.1, end: 6.17, duration: 3.07 },
    { text: '每次都按你的方式干活。', start: 6.17, end: 8.21, duration: 2.04 },
  ],
  // Shot 2 (8.21-17.3s → local 0-9.09s)
  [
    { text: '很多人每天都在重复做同样的事——写同样的提示词，走同样的流程。', start: 0, end: 5.23, duration: 5.23 },
    { text: '其实只需要三分钟，就能把这些全部自动化。', start: 5.23, end: 9.09, duration: 3.86 },
  ],
  // Shot 3 (17.3-30.46s → local 0-13.16s)
  [
    { text: '第一步，先别急着动手。', start: 0, end: 2.42, duration: 2.42 },
    { text: '想想你每天最常重复的工作是什么？', start: 2.42, end: 5.88, duration: 3.46 },
    { text: '然后去搜一下，有没有人已经做好了。', start: 5.88, end: 9.12, duration: 3.24 },
    { text: 'GitHub 上有大量现成的技能，可以直接安装使用。', start: 9.12, end: 13.16, duration: 4.03 },
  ],
  // Shot 4 (30.46-41.28s → local 0-10.82s)
  [
    { text: '找不到现成的？', start: 0, end: 1.22, duration: 1.22 },
    { text: '那就自己做一个。', start: 1.22, end: 2.68, duration: 1.46 },
    { text: 'Claude Code 自带了 skill-creator 命令，', start: 2.68, end: 5.92, duration: 3.24 },
    { text: '你只需要告诉它你想要什么，', start: 5.92, end: 8.18, duration: 2.26 },
    { text: '它就能帮你生成完整的技能。', start: 8.18, end: 10.82, duration: 2.64 },
  ],
  // Shot 5 (41.28-56.45s → local 0-15.17s)
  [
    { text: '记住三个原则。', start: 0, end: 1.87, duration: 1.87 },
    { text: '第一，别做大而全，拆成小技能，每个只做一件事。', start: 1.87, end: 7.1, duration: 5.23 },
    { text: '第二，密钥不要写死，用环境变量。', start: 7.1, end: 10.73, duration: 3.62 },
    { text: '第三，技能需要迭代，用着不对就让 AI 调整。', start: 10.73, end: 15.17, duration: 4.44 },
  ],
  // Shot 6 (56.45-69.0s → local 0-12.55s)
  [
    { text: '什么时候用技能，什么时候写代码？', start: 0, end: 3.07, duration: 3.07 },
    { text: '如果你需要跟 AI 反复沟通、动态调整行为，用技能。', start: 3.07, end: 7.89, duration: 4.82 },
    { text: '如果追求百分百准确、或者需要可视化界面，写代码。', start: 7.89, end: 12.55, duration: 4.66 },
  ],
  // Shot 7 (69.0-75.29s → local 0-6.29s)
  [
    { text: '三分钟，把重复工作变成专属技能。', start: 0, end: 3.62, duration: 3.62 },
    { text: '关注我，每天一个 AI 实用技巧。', start: 3.62, end: 6.29, duration: 2.66 },
  ],
]

// SFX per shot (from script "音效")
const shotSfx: { type: string; delay?: number }[][] = [
  [{ type: 'whoosh-in' }],
  [{ type: 'text-pop', delay: 0.5 }],
  [],
  [],
  [{ type: 'impact', delay: 0.3 }],
  [],
  [{ type: 'outro' }],
]

export const CustomSkillGuide: React.FC = () => {
  const { fps } = useVideoConfig()
  return (
    <AbsoluteFill>
      <Audio src={staticFile('/audio/如何制作一个专属技能/voiceover-full.mp3')} volume={1} />
      <BGMAudio
        style="科技电子"
        tempo="medium"
        volume={0.08}
        voiceoverSegments={[{ start: 0, end: 75.29 }]}
      />

      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={seqDurations[0]} premountFor={1 * fps}>
          <Shot1 subtitleSegments={shotSubtitleSegments[0]} />
          <SFXLayer effects={shotSfx[0]} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={transitions[0].presentation}
          timing={linearTiming({ durationInFrames: transitions[0].frames })}
        />

        <TransitionSeries.Sequence durationInFrames={seqDurations[1]} premountFor={1 * fps}>
          <Shot2 subtitleSegments={shotSubtitleSegments[1]} />
          <SFXLayer effects={shotSfx[1]} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={transitions[1].presentation}
          timing={linearTiming({ durationInFrames: transitions[1].frames })}
        />

        <TransitionSeries.Sequence durationInFrames={seqDurations[2]} premountFor={1 * fps}>
          <Shot3 subtitleSegments={shotSubtitleSegments[2]} />
          <SFXLayer effects={shotSfx[2]} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={transitions[2].presentation}
          timing={linearTiming({ durationInFrames: transitions[2].frames })}
        />

        <TransitionSeries.Sequence durationInFrames={seqDurations[3]} premountFor={1 * fps}>
          <Shot4 subtitleSegments={shotSubtitleSegments[3]} />
          <SFXLayer effects={shotSfx[3]} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={transitions[3].presentation}
          timing={linearTiming({ durationInFrames: transitions[3].frames })}
        />

        <TransitionSeries.Sequence durationInFrames={seqDurations[4]} premountFor={1 * fps}>
          <Shot5 subtitleSegments={shotSubtitleSegments[4]} />
          <SFXLayer effects={shotSfx[4]} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={transitions[4].presentation}
          timing={linearTiming({ durationInFrames: transitions[4].frames })}
        />

        <TransitionSeries.Sequence durationInFrames={seqDurations[5]} premountFor={1 * fps}>
          <Shot6 subtitleSegments={shotSubtitleSegments[5]} />
          <SFXLayer effects={shotSfx[5]} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={transitions[5].presentation}
          timing={linearTiming({ durationInFrames: transitions[5].frames })}
        />

        <TransitionSeries.Sequence durationInFrames={seqDurations[6]} premountFor={1 * fps}>
          <Shot7 subtitleSegments={shotSubtitleSegments[6]} />
          <SFXLayer effects={shotSfx[6]} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  )
}
