// Theme: Neon — 前沿/突破/震撼
import React from 'react'
import { AbsoluteFill, staticFile, useVideoConfig } from 'remotion'
import { Audio } from '@remotion/media'
import { TransitionSeries, linearTiming } from '@remotion/transitions'
import { fade } from '@remotion/transitions/fade'
import { slide } from '@remotion/transitions/slide'
import { flip } from '@remotion/transitions/flip'
import { LightLeak } from '@remotion/light-leaks'
import { BGMAudio, SFXLayer } from '../../components'
import { Shot1 } from './shots/Shot1'
import { Shot2 } from './shots/Shot2'
import { Shot3 } from './shots/Shot3'
import { Shot4 } from './shots/Shot4'
import { Shot5 } from './shots/Shot5'
import { Shot6 } from './shots/Shot6'
import { Shot7 } from './shots/Shot7'

// Shot durations from voiceover-manifest.json (seconds → frames at 30fps)
const SHOT_DURATIONS_SECONDS = [4.03, 15.55, 12.20, 13.10, 11.30, 11.69, 9.39]

// Subtitle segments per shot (from manifest, keyed by shot number)
const segmentsByShot: Record<number, Array<{ text: string; start: number; end: number; duration: number }>> = {
  1: [
    { text: 'xAI一夜连发两个大招，直接掀桌子了。', start: 0, end: 4.03, duration: 4.03 },
  ],
  2: [
    { text: '先说Grok 4.3，输入价格砍掉40%，输出砍掉60%。', start: 4.03, end: 9.89, duration: 5.86 },
    { text: '跑一轮完整benchmark只要395美元，', start: 9.89, end: 13.51, duration: 3.62 },
    { text: 'GPT-5.5要花将近4000，', start: 13.51, end: 16.75, duration: 3.24 },
    { text: 'Claude Opus 4.7要4800。', start: 16.75, end: 19.58, duration: 2.83 },
  ],
  3: [
    { text: '性能上Intelligence Index拿了53分排第八，', start: 19.58, end: 23.86, duration: 4.27 },
    { text: '刚好压过Claude Sonnet 4.6。', start: 23.86, end: 26.71, duration: 2.86 },
    { text: 'Abacus AI的CEO直接说，和Sonnet一样聪明但便宜五倍。', start: 26.71, end: 31.78, duration: 5.06 },
  ],
  4: [
    { text: '还有个Imagine Agent模式，', start: 31.78, end: 34.63, duration: 2.86 },
    { text: '不是一次生图，', start: 34.63, end: 36.1, duration: 1.46 },
    { text: '而是能自己规划、', start: 36.1, end: 37.73, duration: 1.63 },
    { text: '生成、', start: 37.73, end: 38.95, duration: 1.22 },
    { text: '编辑、', start: 38.95, end: 40.01, duration: 1.06 },
    { text: '修订，', start: 40.01, end: 40.85, duration: 0.84 },
    { text: '做短片、', start: 40.85, end: 42.07, duration: 1.22 },
    { text: '漫画集这种创意项目都能搞定。', start: 42.07, end: 44.88, duration: 2.81 },
  ],
  5: [
    { text: '第二个大招是声音克隆。', start: 44.88, end: 47.3, duration: 2.42 },
    { text: '录一分钟你的声音，两分钟就出模型。', start: 47.3, end: 50.54, duration: 3.24 },
    { text: '双重验证机制，先朗读再比对声纹，防止拿录音克隆别人。', start: 50.54, end: 56.18, duration: 5.64 },
  ],
  6: [
    { text: 'Voice Library有80多种预置声音覆盖28种语言，克隆不额外收费。', start: 56.18, end: 61.82, duration: 5.64 },
    { text: 'TTS每百万字符4.2美元，语音Agent每小时才3美元。', start: 61.82, end: 67.87, duration: 6.05 },
  ],
  7: [
    { text: 'xAI这波明显在打价格战抢开发者。', start: 67.87, end: 71.52, duration: 3.65 },
    { text: '你觉得Grok能卷动市场吗？', start: 71.52, end: 74.18, duration: 2.66 },
    { text: '关注我，持续追踪AI最新动态。', start: 74.18, end: 77.26, duration: 3.07 },
  ],
}

// SFX per shot
const sfxByShot: Record<number, Array<{ type: string }>> = {
  1: [{ type: 'whoosh-in' }, { type: 'impact' }],
  2: [{ type: 'text-pop' }],
  3: [{ type: 'impact' }],
  4: [{ type: 'text-pop' }],
  5: [{ type: 'whoosh' }],
  6: [{ type: 'text-pop' }],
  7: [{ type: 'outro' }],
}

// Transition timing configs
const TRANSITION_FRAMES = {
  '2→3': linearTiming({ durationInFrames: 15 }),
  '3→4': linearTiming({ durationInFrames: 15 }),
  '4→5': linearTiming({ durationInFrames: 12 }),
  '5→6': linearTiming({ durationInFrames: 20 }),
  '6→7': linearTiming({ durationInFrames: 15 }),
} as const

// Pre-compute total duration at 30fps for root.tsx registration
const FPS = 30
const shotFramesStatic = SHOT_DURATIONS_SECONDS.map((s) => Math.round(s * FPS))
const transitionOverlapsStatic = Object.values(TRANSITION_FRAMES).map((t) =>
  t.getDurationInFrames({ fps: FPS }),
)
export const durationInFrames =
  shotFramesStatic.reduce((a, b) => a + b, 0) -
  transitionOverlapsStatic.reduce((a, b) => a + b, 0)

export const Grok43CustomVoices: React.FC = () => {
  const { fps } = useVideoConfig()

  const shotFrames = shotFramesStatic

  // Compute videoOffset per shot (accounting for transition overlaps)
  const shotStartSeconds: number[] = []
  let cumulativeFrames = 0
  for (let i = 0; i < shotFrames.length; i++) {
    shotStartSeconds.push(cumulativeFrames / fps)
    cumulativeFrames += shotFrames[i]
    if (i < transitionOverlapsStatic.length) {
      cumulativeFrames -= transitionOverlapsStatic[i]
    }
  }

  return (
    <AbsoluteFill>
      {/* BGM */}
      <BGMAudio style="科技电子" tempo="medium" volume={0.08} />

      {/* Full voiceover audio */}
      <Audio
        src={staticFile('/audio/grok43-custom-voices/voiceover-full.mp3')}
        volume={1}
      />

      <TransitionSeries>
        {/* Shot 1 — Hook */}
        <TransitionSeries.Sequence durationInFrames={shotFrames[0]}>
          <Shot1
            subtitleSegments={segmentsByShot[1]}
            videoOffset={shotStartSeconds[0]}
          />
          <SFXLayer effects={sfxByShot[1]} />
        </TransitionSeries.Sequence>

        {/* Shot 1→2: no transition (direct cut) */}

        {/* Shot 2 — Grok 4.3 Pricing */}
        <TransitionSeries.Sequence durationInFrames={shotFrames[1]}>
          <Shot2
            subtitleSegments={segmentsByShot[2]}
            videoOffset={shotStartSeconds[1]}
          />
          <SFXLayer effects={sfxByShot[2]} />
        </TransitionSeries.Sequence>

        {/* Shot 2→3: slide from bottom */}
        <TransitionSeries.Transition
          presentation={slide({ direction: 'from-bottom' })}
          timing={TRANSITION_FRAMES['2→3']}
        />

        {/* Shot 3 — Intelligence Index Ranking */}
        <TransitionSeries.Sequence durationInFrames={shotFrames[2]}>
          <Shot3
            subtitleSegments={segmentsByShot[3]}
            videoOffset={shotStartSeconds[2]}
          />
          <SFXLayer effects={sfxByShot[3]} />
        </TransitionSeries.Sequence>

        {/* Shot 3→4: fade */}
        <TransitionSeries.Transition
          presentation={fade()}
          timing={TRANSITION_FRAMES['3→4']}
        />

        {/* Shot 4 — Imagine Agent */}
        <TransitionSeries.Sequence durationInFrames={shotFrames[3]}>
          <Shot4
            subtitleSegments={segmentsByShot[4]}
            videoOffset={shotStartSeconds[3]}
          />
          <SFXLayer effects={sfxByShot[4]} />
        </TransitionSeries.Sequence>

        {/* Shot 4→5: slide from right */}
        <TransitionSeries.Transition
          presentation={slide({ direction: 'from-right' })}
          timing={TRANSITION_FRAMES['4→5']}
        />

        {/* Shot 5 — Custom Voices */}
        <TransitionSeries.Sequence durationInFrames={shotFrames[4]}>
          <Shot5
            subtitleSegments={segmentsByShot[5]}
            videoOffset={shotStartSeconds[4]}
          />
          <SFXLayer effects={sfxByShot[5]} />
        </TransitionSeries.Sequence>

        {/* Shot 5→6: flip */}
        <TransitionSeries.Transition
          presentation={flip()}
          timing={TRANSITION_FRAMES['5→6']}
        />

        {/* Shot 6 — Voice Library */}
        <TransitionSeries.Sequence durationInFrames={shotFrames[5]}>
          <Shot6
            subtitleSegments={segmentsByShot[6]}
            videoOffset={shotStartSeconds[5]}
          />
          <AbsoluteFill style={{ pointerEvents: 'none' }}>
            <LightLeak seed={5} hueShift={240} style={{ opacity: 0.15 }} />
          </AbsoluteFill>
          <SFXLayer effects={sfxByShot[6]} />
        </TransitionSeries.Sequence>

        {/* Shot 6→7: fade */}
        <TransitionSeries.Transition
          presentation={fade()}
          timing={TRANSITION_FRAMES['6→7']}
        />

        {/* Shot 7 — CTA */}
        <TransitionSeries.Sequence durationInFrames={shotFrames[6]}>
          <Shot7
            subtitleSegments={segmentsByShot[7]}
            videoOffset={shotStartSeconds[6]}
          />
          <SFXLayer effects={sfxByShot[7]} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  )
}
