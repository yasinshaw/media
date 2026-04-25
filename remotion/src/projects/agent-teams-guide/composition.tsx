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

// Subtitle segments from voiceover manifest
const shot1Segments = [
  {text: "你还在让一个AI从早干到晚吗？", start: 0, end: 2.83, duration: 2.83},
  {text: "Claude的Agent Teams功能，", start: 2.83, end: 5.28, duration: 2.45},
  {text: "可以让多个AI组队并行干活，", start: 5.28, end: 8.11, duration: 2.83},
  {text: "16个AI协作写出了10万行代码。", start: 8.11, end: 11.35, duration: 3.24}
]
const shot1Offset = 0

const shot2Segments = [
  {text: "以前用Claude Code，", start: 11.35, end: 13.39, duration: 2.04},
  {text: "写前端、", start: 13.39, end: 14.62, duration: 1.22},
  {text: "后端、", start: 14.62, end: 15.67, duration: 1.06},
  {text: "测试全是一个AI串着来，", start: 15.67, end: 18.12, duration: 2.45},
  {text: "效率低，", start: 18.12, end: 19.18, duration: 1.06},
  {text: "上下文还容易爆。", start: 19.18, end: 20.81, duration: 1.63}
]
const shot2Offset = 11.35

const shot3Segments = [
  {text: "Agent Teams是Claude Code的实验功能。", start: 20.81, end: 24.26, duration: 3.46},
  {text: "一个会话当队长，同时派出多个独立的AI队友。", start: 24.26, end: 28.7, duration: 4.44},
  {text: "关键是，队友之间可以直接沟通、共享任务列表、自主分工协调。", start: 28.7, end: 34.15, duration: 5.45}
]
const shot3Offset = 20.81

const shot4Segments = [
  {text: "开启方法很简单。", start: 34.15, end: 36.0, duration: 1.85},
  {text: "装好tmux，设置一个环境变量就能用。", start: 36.0, end: 39.86, duration: 3.86},
  {text: "你可以让一个队友写前端，一个写后端，一个跑测试，各干各的互不干扰。", start: 39.86, end: 45.74, duration: 5.88}
]
const shot4Offset = 34.15

const shot5Segments = [
  {text: "它和子Agent最大的区别是通信方式。", start: 45.74, end: 48.96, duration: 3.22},
  {text: "子Agent干完活只能向主Agent汇报，队友之间不能交流。", start: 48.96, end: 54.19, duration: 5.23},
  {text: "但Agent Teams里，队友之间可以直接对话、互相配合，就像真正的团队。", start: 54.19, end: 60.05, duration: 5.86}
]
const shot5Offset = 45.74

const shot6Segments = [
  {text: "不只是Claude，整个AI行业都在走向多智能体协作。", start: 60.05, end: 64.49, duration: 4.44},
  {text: "LangGraph、", start: 64.49, end: 65.71, duration: 1.22},
  {text: "AutoGen、", start: 65.71, end: 66.94, duration: 1.22},
  {text: "CrewAI，", start: 66.94, end: 68.57, duration: 1.63},
  {text: "核心思路都一样：让AI像团队一样分工合作。", start: 68.57, end: 72.43, duration: 3.86}
]
const shot6Offset = 60.05

const shot7Segments = [
  {text: "想让AI帮你组队干活？", start: 72.43, end: 74.47, duration: 2.04},
  {text: "点赞关注，下期手把手教你配置Agent Teams。", start: 74.47, end: 78.31, duration: 3.84}
]
const shot7Offset = 72.43

// Shot durations (calculated from audio manifest)
const shot1Duration = 340
const shot2Duration = 284
const shot3Duration = 400
const shot4Duration = 348
const shot5Duration = 429
const shot6Duration = 371
const shot7Duration = 176

// Total duration
export const durationInFrames = shot1Duration + shot2Duration + shot3Duration + shot4Duration + shot5Duration + shot6Duration + shot7Duration

export const AgentTeamsGuide: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Full audio track */}
      <Audio src={staticFile('/audio/agent-teams-guide/voiceover-full.mp3')} volume={1} />

      {/* Shot 1: Hook - 1 vs 16 AI */}
      <Sequence from={0} durationInFrames={shot1Duration}>
        <Shot1 subtitleSegments={shot1Segments} videoOffset={shot1Offset} />
      </Sequence>

      {/* Shot 2: Pain point - Serial execution */}
      <Sequence from={shot1Duration} durationInFrames={shot2Duration}>
        <Shot2 subtitleSegments={shot2Segments} videoOffset={shot2Offset} />
      </Sequence>

      {/* Shot 3: Agent Teams concept */}
      <Sequence from={shot1Duration + shot2Duration} durationInFrames={shot3Duration}>
        <Shot3 subtitleSegments={shot3Segments} videoOffset={shot3Offset} />
      </Sequence>

      {/* Shot 4: Setup tutorial */}
      <Sequence from={shot1Duration + shot2Duration + shot3Duration} durationInFrames={shot4Duration}>
        <Shot4 subtitleSegments={shot4Segments} videoOffset={shot4Offset} />
      </Sequence>

      {/* Shot 5: Agent Teams vs Subagent */}
      <Sequence from={shot1Duration + shot2Duration + shot3Duration + shot4Duration} durationInFrames={shot5Duration}>
        <Shot5 subtitleSegments={shot5Segments} videoOffset={shot5Offset} />
      </Sequence>

      {/* Shot 6: Multi-agent landscape */}
      <Sequence from={shot1Duration + shot2Duration + shot3Duration + shot4Duration + shot5Duration} durationInFrames={shot6Duration}>
        <Shot6 subtitleSegments={shot6Segments} videoOffset={shot6Offset} />
      </Sequence>

      {/* Shot 7: CTA */}
      <Sequence from={shot1Duration + shot2Duration + shot3Duration + shot4Duration + shot5Duration + shot6Duration} durationInFrames={shot7Duration}>
        <Shot7 subtitleSegments={shot7Segments} videoOffset={shot7Offset} />
      </Sequence>
    </AbsoluteFill>
  )
}
