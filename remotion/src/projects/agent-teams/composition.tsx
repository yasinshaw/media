import React from 'react'
import { AbsoluteFill, Sequence, staticFile } from 'remotion'
import { Audio } from '@remotion/media'
import { Shot1 } from './shots/Shot1'
import { Shot2 } from './shots/Shot2'
import { Shot3 } from './shots/Shot3'
import { Shot4 } from './shots/Shot4'
import { Shot5 } from './shots/Shot5'
import { Shot6 } from './shots/Shot6'
import { Shot7 } from './shots/Shot7'

// Audio-driven timing from manifest (30fps)
const SHOT_1_FRAMES = 177 // 5.9s
const SHOT_2_FRAMES = 488 // 16.27s
const SHOT_3_FRAMES = 371 // 12.38s
const SHOT_4_FRAMES = 371 // 12.38s
const SHOT_5_FRAMES = 400 // 13.35s
const SHOT_6_FRAMES = 456 // 15.19s
const SHOT_7_FRAMES = 237 // 7.89s

export const AgentTeams: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Full audio track for ProgressiveSubtitle timing */}
      <Audio src={staticFile('/audio/agent-teams/voiceover-full.mp3')} volume={1} />

      {/* Shot 1: Hook (0-5.9s) */}
      <Sequence from={0} durationInFrames={SHOT_1_FRAMES}>
        <Shot1 subtitleSegments={shots[1]} videoOffset={0} />
      </Sequence>

      {/* Shot 2: Concept comparison (5.9-22.18s) */}
      <Sequence from={SHOT_1_FRAMES} durationInFrames={SHOT_2_FRAMES}>
        <Shot2 subtitleSegments={shots[2]} videoOffset={5.9} />
      </Sequence>

      {/* Shot 3: Timeline (22.18-34.56s) */}
      <Sequence from={SHOT_1_FRAMES + SHOT_2_FRAMES} durationInFrames={SHOT_3_FRAMES}>
        <Shot3 subtitleSegments={shots[3]} videoOffset={22.18} />
      </Sequence>

      {/* Shot 4: Infographic (34.56-46.94s) */}
      <Sequence from={SHOT_1_FRAMES + SHOT_2_FRAMES + SHOT_3_FRAMES} durationInFrames={SHOT_4_FRAMES}>
        <Shot4 subtitleSegments={shots[4]} videoOffset={34.56} />
      </Sequence>

      {/* Shot 5: Claude Code demo (46.94-60.31s) */}
      <Sequence
        from={SHOT_1_FRAMES + SHOT_2_FRAMES + SHOT_3_FRAMES + SHOT_4_FRAMES}
        durationInFrames={SHOT_5_FRAMES}
      >
        <Shot5 subtitleSegments={shots[5]} videoOffset={46.94} />
      </Sequence>

      {/* Shot 6: Pitfalls (60.31-75.5s) */}
      <Sequence
        from={
          SHOT_1_FRAMES + SHOT_2_FRAMES + SHOT_3_FRAMES + SHOT_4_FRAMES + SHOT_5_FRAMES
        }
        durationInFrames={SHOT_6_FRAMES}
      >
        <Shot6 subtitleSegments={shots[6]} videoOffset={60.31} />
      </Sequence>

      {/* Shot 7: CTA (75.5-83.4s) */}
      <Sequence
        from={
          SHOT_1_FRAMES +
          SHOT_2_FRAMES +
          SHOT_3_FRAMES +
          SHOT_4_FRAMES +
          SHOT_5_FRAMES +
          SHOT_6_FRAMES
        }
        durationInFrames={SHOT_7_FRAMES}
      >
        <Shot7 subtitleSegments={shots[7]} videoOffset={75.5} />
      </Sequence>
    </AbsoluteFill>
  )
}

// Subtitle segments by shot (from voiceover manifest)
const shots: Record<
  number,
  Array<{ text: string; start: number; end: number; duration: number }>
> = {
  1: [
    { text: '一个 AI 搞不定的事，一群 AI 能搞定吗？', start: 0, end: 3.62, duration: 3.62 },
    { text: '这就是 Agent Teams。', start: 3.62, end: 5.9, duration: 2.28 },
  ],
  2: [
    { text: '先说清楚，Agent Teams 不等于 Multi-Agent。', start: 5.9, end: 9.74, duration: 3.84 },
    { text: 'Multi-Agent 是 90 年代的学术概念，泛指多个 AI 交互。', start: 9.74, end: 14.18, duration: 4.44 },
    { text: '而 Agent Teams 强调的是像人类团队一样，', start: 14.18, end: 17.66, duration: 3.48 },
    { text: '有明确的角色分工、', start: 17.66, end: 19.51, duration: 1.85 },
    { text: '层级协调和共享目标。', start: 19.51, end: 22.18, duration: 2.67 },
  ],
  3: [
    { text: '这个概念是 CrewAI 在 2023 年带火的。', start: 22.18, end: 26.04, duration: 3.86 },
    { text: '吴恩达 2024 年提出的 Agentic 设计模式进一步推动了它。', start: 26.04, end: 31.49, duration: 5.45 },
    { text: '现在 Claude Code 也内置了这个能力。', start: 31.49, end: 34.56, duration: 3.07 },
  ],
  4: [
    { text: '你看这张图，', start: 34.56, end: 36.02, duration: 1.46 },
    { text: '一个 Manager Agent 统筹协调，', start: 36.02, end: 39.26, duration: 3.24 },
    { text: '多个 Worker Agent 各司其职。', start: 39.26, end: 42.91, duration: 3.65 },
    { text: '从任务分解到结果分析，一整套流程都有。', start: 42.91, end: 46.94, duration: 4.03 },
  ],
  5: [
    { text: '在 Claude Code 里直接就能用。', start: 46.94, end: 49.22, duration: 2.28 },
    { text: '用 Agent 工具派发子任务，', start: 49.22, end: 51.89, duration: 2.67 },
    { text: '一个搜代码，', start: 51.89, end: 53.11, duration: 1.22 },
    { text: '一个跑测试，', start: 53.11, end: 54.34, duration: 1.23 },
    { text: '一个做 review，', start: 54.34, end: 55.8, duration: 1.46 },
    { text: '三个 agent 并行工作，', start: 55.8, end: 58.46, duration: 2.66 },
    { text: '效率大幅提升。', start: 58.46, end: 60.31, duration: 1.85 },
  ],
  6: [
    { text: '但有三个坑。', start: 60.31, end: 61.54, duration: 1.23 },
    { text: '第一，指令一定要具体，模糊委派是最常见的失败原因。', start: 61.54, end: 66.79, duration: 5.25 },
    { text: '第二，别让多个 agent 同时改同一个文件，会冲突。', start: 66.79, end: 71.47, duration: 4.68 },
    { text: '第三，简单任务别开一堆 agent，浪费 token。', start: 71.47, end: 75.5, duration: 4.03 },
  ],
  7: [
    { text: 'Agent Teams 是 AI 编程的未来方向。', start: 75.5, end: 79.37, duration: 3.87 },
    { text: '关注我，下期教你从零配置自己的 Agent 团队。', start: 79.37, end: 83.4, duration: 4.03 },
  ],
}
