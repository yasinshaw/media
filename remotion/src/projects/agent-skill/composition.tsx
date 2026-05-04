import React from 'react'
import { AbsoluteFill, staticFile, useVideoConfig } from 'remotion'
import { Audio } from '@remotion/media'
import { TransitionSeries, linearTiming } from '@remotion/transitions'
import { fade } from '@remotion/transitions/fade'
import { Shot1 } from './shots/Shot1'
import { Shot2 } from './shots/Shot2'
import { Shot3 } from './shots/Shot3'
import { Shot4 } from './shots/Shot4'
import { Shot5 } from './shots/Shot5'
import { Shot6 } from './shots/Shot6'

// Timing from voiceover-manifest.json (Whisper-aligned, per-shot)
const segments = [
  { duration: 5.26, start: 0 },
  { duration: 6.05, start: 5.26 },
  { duration: 9.86, start: 11.3 },
  { duration: 6.22, start: 21.17 },
  { duration: 8.83, start: 27.38 },
  { duration: 6.05, start: 36.22 },
]

// Subtitle timing from Whisper alignment (absolute video time)
// Last subtitle in each shot is extended to cover until audio ends
const subtitles: Record<number, Array<{ text: string; start: number; end: number; duration: number }>> = {
  1: [
    { text: 'Anthropic、OpenAI、Google，三个竞争对手，罕见地走到了一起。', start: 0, end: 5.26, duration: 5.26 },
  ],
  2: [
    { text: '你问 AI 什么都能答，但让它按你们团队的规范写代码、做部署，它就不行了。', start: 5.26, end: 11.3, duration: 6.05 },
  ],
  3: [
    { text: '所以他们做了一个开放标准，叫 Agent Skills。', start: 11.3, end: 15.92, duration: 4.62 },
    { text: '本质上就是一个文件夹，里面放一个 SKILL.md 文件，AI 就能学会新技能。', start: 15.92, end: 21.17, duration: 5.24 },
  ],
  4: [
    { text: '现在已经有数万个技能包，累计安装数百万次。', start: 21.17, end: 25.49, duration: 4.32 },
    { text: '一行命令，给你的 AI 装上。', start: 25.49, end: 27.38, duration: 1.89 },
  ],
  5: [
    { text: '最关键的是跨平台。', start: 27.38, end: 29.52, duration: 2.14 },
    { text: '你在 Claude Code 写的技能，', start: 29.52, end: 32.08, duration: 2.56 },
    { text: '在 Codex、', start: 32.34, end: 33.12, duration: 0.78 },
    { text: 'Cursor、', start: 33.12, end: 33.68, duration: 0.56 },
    { text: 'Copilot 上直接能用。写一次，到处跑。', start: 33.68, end: 36.22, duration: 2.54 },
  ],
  6: [
    { text: 'AI 的技能商店时代，已经来了。', start: 36.22, end: 40.48, duration: 4.26 },
    { text: '关注我，带你跟上 AI 最前沿。', start: 40.48, end: 42.26, duration: 1.78 },
  ],
}

// Shot durations with 0.5s padding for animation tail + transition overlap
const PADDING_FRAMES = 15
const TRANSITION_FRAMES = 15

const shotDurations = segments.map(s => s.duration)
// Each shot gets padding, last shot gets extra for tail
const shotFramesWithPadding = shotDurations.map((d, i) =>
  Math.round(d * 30) + PADDING_FRAMES + (i === shotDurations.length - 1 ? PADDING_FRAMES : 0)
)

// TransitionSeries: total = sum(durations) - (N-1) * transitionFrames
const transitionCount = shotDurations.length - 1
export const durationInFrames =
  shotFramesWithPadding.reduce((a, b) => a + b, 0) - transitionCount * TRANSITION_FRAMES

const shots = [Shot1, Shot2, Shot3, Shot4, Shot5, Shot6]

export const AgentSkill: React.FC = () => {
  const { fps } = useVideoConfig()

  return (
    <AbsoluteFill>
      <Audio src={staticFile('/audio/agent-skill/voiceover-full.mp3')} volume={1} />

      <TransitionSeries>
        {shots.map((ShotComponent, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <TransitionSeries.Transition
                presentation={fade()}
                timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
              />
            )}
            <TransitionSeries.Sequence durationInFrames={shotFramesWithPadding[index]} premountFor={fps}>
              <ShotComponent
                subtitleSegments={subtitles[index + 1]}
                videoOffset={segments[index].start}
              />
            </TransitionSeries.Sequence>
          </React.Fragment>
        ))}
      </TransitionSeries>
    </AbsoluteFill>
  )
}
