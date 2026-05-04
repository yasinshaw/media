// Theme: Ocean — 技术调查 / 真相揭露 (red 仅用于语义警示)
import React from 'react'
import { AbsoluteFill, staticFile } from 'remotion'
import { Audio } from '@remotion/media'
import { TransitionSeries, linearTiming } from '@remotion/transitions'
import { fade } from '@remotion/transitions/fade'
import { slide } from '@remotion/transitions/slide'
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

// Shot durations from voiceover-manifest.json (seconds → frames)
const shotDurations = [3.86, 12.36, 14.74, 14.06, 11.91, 15.14, 13.32, 13.49] as const
const shotFrames = shotDurations.map((s) => Math.round(s * FPS))

// Transitions (between shot N and N+1) — read from script "转场效果"
const transitions = [
  { frames: 12, presentation: fade() },                              // 1→2: fade
  { frames: 15, presentation: flip() },                              // 2→3: flip
  { frames: 12, presentation: slide({ direction: 'from-right' }) },  // 3→4: slide(from-right)
  { frames: 12, presentation: fade() },                              // 4→5: fade
  { frames: 12, presentation: slide({ direction: 'from-bottom' }) }, // 5→6: slide(from-bottom)
  { frames: 12, presentation: fade() },                              // 6→7: fade
  { frames: 4,  presentation: fade() },                              // 7→8: none (mini fade for hard-cut feel)
] as const

// Sequence durations include transition overlap (keeps voiceover in sync)
const seqDurations = shotFrames.map((sf, i) =>
  i < transitions.length ? sf + transitions[i].frames : sf,
)

export const durationInFrames =
  seqDurations.reduce((a, b) => a + b, 0) -
  transitions.reduce((a, t) => a + t.frames, 0)

// Per-shot subtitle segments (local time, normalized so each shot starts at 0)
const shotSubtitleSegments = [
  // Shot 1
  [
    { text: '你花钱调的GPT-5.5，可能根本不是GPT-5.5。', start: 0, end: 3.86, duration: 3.86 },
  ],
  // Shot 2
  [
    { text: '很多国内开发者都在用AI中转站。', start: 0, end: 3.05, duration: 3.05 },
    { text: '便宜、方便、支付宝直付。', start: 3.05, end: 6.10, duration: 3.05 },
    { text: '但你有没有想过，你付的GPT-5.5的钱，背后跑的到底是什么模型？', start: 6.10, end: 12.36, duration: 6.26 },
  ],
  // Shot 3
  [
    { text: '德国CISPA是欧洲顶级的网络安全机构。', start: 0, end: 4.04, duration: 4.04 },
    { text: '他们审计了17家中转站，用模型指纹技术逐一检测，结果45%的模型身份验证失败。', start: 4.04, end: 12.48, duration: 8.45 },
    { text: '将近一半，都是假的。', start: 12.48, end: 14.74, duration: 2.26 },
  ],
  // Shot 4
  [
    { text: '三种套路：直接掉包，', start: 0, end: 2.42, duration: 2.42 },
    { text: '用便宜模型冒充贵的赚差价；', start: 2.42, end: 5.50, duration: 3.07 },
    { text: '随机路由，', start: 5.50, end: 6.72, duration: 1.22 },
    { text: '每次分配不同模型让你无法察觉；', start: 6.72, end: 9.55, duration: 2.83 },
    { text: '降级版本，', start: 9.55, end: 10.80, duration: 1.25 },
    { text: '用旧模型冒充新版。', start: 10.80, end: 14.06, duration: 3.26 },
  ],
  // Shot 5
  [
    { text: '你以为AI在帮你写高质量代码，实际拿到的可能是入门级回答。', start: 0, end: 4.83, duration: 4.83 },
    { text: '推理能力暴跌40%，这意味着什么？', start: 4.83, end: 8.69, duration: 3.86 },
    { text: '你让AI写的代码，逻辑可能全是错的。', start: 8.69, end: 11.91, duration: 3.22 },
  ],
  // Shot 6
  [
    { text: '除了模型造假，还有更大的坑：你的所有提示词和AI回复，中转站全都能看到。', start: 0, end: 6.84, duration: 6.84 },
    { text: '88%没有营业执照，只有1家有ICP备案。', start: 6.84, end: 11.28, duration: 4.44 },
    { text: '去年WildCard停服，30万用户突然没法用了。', start: 11.28, end: 15.14, duration: 3.86 },
  ],
  // Shot 7
  [
    { text: '怎么判断有没有被坑？', start: 0, end: 1.85, duration: 1.85 },
    { text: '推荐用LLMmap工具，发射24个探针查询就能验证模型真伪。', start: 1.85, end: 8.67, duration: 6.82 },
    { text: '还有个简单方法：问模型一些特征问题，套壳模型很容易露馅。', start: 8.67, end: 13.32, duration: 4.66 },
  ],
  // Shot 8
  [
    { text: '三条建议：敏感业务走官方API；', start: 0, end: 3.24, duration: 3.24 },
    { text: '必须用中转的，', start: 3.24, end: 4.71, duration: 1.46 },
    { text: '接上LLMmap做检测；', start: 4.71, end: 8.33, duration: 3.62 },
    { text: '充值别太多，', start: 8.33, end: 9.58, duration: 1.25 },
    { text: '防范跑路。', start: 9.58, end: 10.83, duration: 1.25 },
    { text: '关注我，避开AI开发路上的坑。', start: 10.83, end: 13.49, duration: 2.66 },
  ],
]

// SFX per shot (from script "音效")
const shotSfx: { type: string; delay?: number }[][] = [
  [{ type: 'whoosh-in' }],
  [{ type: 'text-pop', delay: 0.5 }],
  [{ type: 'impact', delay: 1.0 }],
  [{ type: 'text-pop' }],
  [{ type: 'impact', delay: 3.5 }],
  [],
  [],
  [{ type: 'outro' }],
]

export const AiZhongZhuanZhanZhenXiang: React.FC = () => {
  return (
    <AbsoluteFill>
      <Audio src={staticFile('/audio/ai中转站真相/voiceover-full.mp3')} volume={1} />
      {/* BGM: 紧张悬疑 — script asked for fast, but tense-fast doesn't exist. Using medium. */}
      <BGMAudio
        style="紧张悬疑"
        tempo="medium"
        volume={0.08}
        voiceoverSegments={[{ start: 0, end: 98.88 }]}
      />

      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={seqDurations[0]} premountFor={FPS}>
          <Shot1 subtitleSegments={shotSubtitleSegments[0]} />
          <SFXLayer effects={shotSfx[0]} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={transitions[0].presentation}
          timing={linearTiming({ durationInFrames: transitions[0].frames })}
        />

        <TransitionSeries.Sequence durationInFrames={seqDurations[1]} premountFor={FPS}>
          <Shot2 subtitleSegments={shotSubtitleSegments[1]} />
          <SFXLayer effects={shotSfx[1]} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={transitions[1].presentation}
          timing={linearTiming({ durationInFrames: transitions[1].frames })}
        />

        <TransitionSeries.Sequence durationInFrames={seqDurations[2]} premountFor={FPS}>
          <Shot3 subtitleSegments={shotSubtitleSegments[2]} />
          <SFXLayer effects={shotSfx[2]} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={transitions[2].presentation}
          timing={linearTiming({ durationInFrames: transitions[2].frames })}
        />

        <TransitionSeries.Sequence durationInFrames={seqDurations[3]} premountFor={FPS}>
          <Shot4 subtitleSegments={shotSubtitleSegments[3]} />
          <SFXLayer effects={shotSfx[3]} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={transitions[3].presentation}
          timing={linearTiming({ durationInFrames: transitions[3].frames })}
        />

        <TransitionSeries.Sequence durationInFrames={seqDurations[4]} premountFor={FPS}>
          <Shot5 subtitleSegments={shotSubtitleSegments[4]} />
          <SFXLayer effects={shotSfx[4]} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={transitions[4].presentation}
          timing={linearTiming({ durationInFrames: transitions[4].frames })}
        />

        <TransitionSeries.Sequence durationInFrames={seqDurations[5]} premountFor={FPS}>
          <Shot6 subtitleSegments={shotSubtitleSegments[5]} />
          <SFXLayer effects={shotSfx[5]} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={transitions[5].presentation}
          timing={linearTiming({ durationInFrames: transitions[5].frames })}
        />

        <TransitionSeries.Sequence durationInFrames={seqDurations[6]} premountFor={FPS}>
          <Shot7 subtitleSegments={shotSubtitleSegments[6]} />
          <SFXLayer effects={shotSfx[6]} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={transitions[6].presentation}
          timing={linearTiming({ durationInFrames: transitions[6].frames })}
        />

        <TransitionSeries.Sequence durationInFrames={seqDurations[7]} premountFor={FPS}>
          <Shot8 subtitleSegments={shotSubtitleSegments[7]} />
          <SFXLayer effects={shotSfx[7]} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  )
}
