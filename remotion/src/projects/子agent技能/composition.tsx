import { AbsoluteFill, Sequence, staticFile } from 'remotion'
import { Audio } from '@remotion/media'
import React from 'react'
import { Shot1 } from './shots/Shot1'
import { Shot2 } from './shots/Shot2'
import { Shot3 } from './shots/Shot3'
import { Shot4 } from './shots/Shot4'
import { Shot5 } from './shots/Shot5'
import { Shot6 } from './shots/Shot6'

// Frame calculations from audio manifest (30fps)
// Shot 1: 3.46s × 30 = 104 frames
// Shot 2: (3.46 + 6.65)s × 30 = 303 frames
// Shot 3: (3.62 + 5.47 + 4.25)s × 30 = 400 frames
// Shot 4: 13.35s × 30 = 401 frames
// Shot 5: 15.86s × 30 = 476 frames
// Shot 6: 8.13s × 30 = 244 frames
// Total: 1928 frames

const SHOT1_FRAMES = 104
const SHOT2_FRAMES = 303
const SHOT3_FRAMES = 400
const SHOT4_FRAMES = 401
const SHOT5_FRAMES = 476
const SHOT6_FRAMES = 244

export const durationInFrames = SHOT1_FRAMES + SHOT2_FRAMES + SHOT3_FRAMES + SHOT4_FRAMES + SHOT5_FRAMES + SHOT6_FRAMES

// Subtitle segments from audio manifest
const shot1Segments = [
  { text: '你知道 Claude Code 里藏着一支 AI 军团吗？', start: 0, end: 3.46, duration: 3.46 },
]
const shot2Segments = [
  { text: '大多数人只用一个对话窗口干所有事。', start: 3.46, end: 6.91, duration: 3.46 },
  { text: '但其实你可以把任务分发给多个子Agent，它们各有专长，还有独立的上下文窗口。', start: 6.91, end: 13.56, duration: 6.65 },
]
const shot3Segments = [
  { text: '子Agent 是 Claude Code 内置的专属助手。', start: 13.56, end: 17.18, duration: 3.62 },
  { text: '你可以配置一个代码审查专家、一个测试工程师、一个架构师，各司其职。', start: 17.18, end: 22.66, duration: 5.47 },
  { text: '关键是，它们的对话不会占用你的主窗口上下文。', start: 22.66, end: 26.9, duration: 4.25 },
]
const shot4Segments = [
  { text: '配置超简单。', start: 26.9, end: 28.54, duration: 1.63 },
  { text: '在 .claude/agents/ 下建一个 md 文件，', start: 28.54, end: 32.59, duration: 4.06 },
  { text: '写上名字、', start: 32.59, end: 33.84, duration: 1.25 },
  { text: '描述、', start: 33.84, end: 34.9, duration: 1.06 },
  { text: '可用工具，', start: 34.9, end: 36.53, duration: 1.63 },
  { text: '下面用自然语言描述它的职责。', start: 36.53, end: 39.19, duration: 2.66 },
  { text: '就这么多。', start: 39.19, end: 40.25, duration: 1.06 },
]
const shot5Segments = [
  { text: '更厉害的是，每个子Agent还能单独选模型。', start: 40.25, end: 44.5, duration: 4.25 },
  { text: '复杂的架构决策用 Opus 深度思考，', start: 44.5, end: 48.36, duration: 3.86 },
  { text: '日常编码用 Sonnet 快速响应，', start: 48.36, end: 51.43, duration: 3.07 },
  { text: '简单检查用 Haiku 省成本。', start: 51.43, end: 53.86, duration: 2.42 },
  { text: '按需分配，效率拉满。', start: 53.86, end: 56.11, duration: 2.26 },
]
const shot6Segments = [
  { text: '想看更多 Claude Code 的高级玩法？', start: 56.11, end: 59.18, duration: 3.07 },
  { text: '关注我，下期教你用子Agent搭一个自动化代码审查流水线。', start: 59.18, end: 64.25, duration: 5.06 },
]

export const 子agent技能: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Single audio track for entire composition */}
      <Audio src={staticFile('/audio/子agent技能/voiceover-full.mp3')} />

      <Sequence from={0} durationInFrames={SHOT1_FRAMES}>
        <Shot1 subtitleSegments={shot1Segments} videoOffset={0} />
      </Sequence>

      <Sequence from={SHOT1_FRAMES} durationInFrames={SHOT2_FRAMES}>
        <Shot2 subtitleSegments={shot2Segments} videoOffset={3.46} />
      </Sequence>

      <Sequence from={SHOT1_FRAMES + SHOT2_FRAMES} durationInFrames={SHOT3_FRAMES}>
        <Shot3 subtitleSegments={shot3Segments} videoOffset={13.56} />
      </Sequence>

      <Sequence from={SHOT1_FRAMES + SHOT2_FRAMES + SHOT3_FRAMES} durationInFrames={SHOT4_FRAMES}>
        <Shot4 subtitleSegments={shot4Segments} videoOffset={26.9} />
      </Sequence>

      <Sequence from={SHOT1_FRAMES + SHOT2_FRAMES + SHOT3_FRAMES + SHOT4_FRAMES} durationInFrames={SHOT5_FRAMES}>
        <Shot5 subtitleSegments={shot5Segments} videoOffset={40.25} />
      </Sequence>

      <Sequence
        from={SHOT1_FRAMES + SHOT2_FRAMES + SHOT3_FRAMES + SHOT4_FRAMES + SHOT5_FRAMES}
        durationInFrames={SHOT6_FRAMES}
      >
        <Shot6 subtitleSegments={shot6Segments} videoOffset={56.11} />
      </Sequence>
    </AbsoluteFill>
  )
}
