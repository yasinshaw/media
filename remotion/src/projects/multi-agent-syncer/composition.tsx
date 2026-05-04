// Theme: Neon — 前沿/突破/震撼
import React from 'react'
import { AbsoluteFill, Sequence, staticFile } from 'remotion'
import { Audio } from '@remotion/media'
import { BGMAudio, SFXLayer, Transition } from '../../components'
import { Shot1 } from './shots/Shot1'
import { Shot2 } from './shots/Shot2'
import { Shot3 } from './shots/Shot3'
import { Shot4 } from './shots/Shot4'
import { Shot5 } from './shots/Shot5'
import { Shot6 } from './shots/Shot6'
import { Shot7 } from './shots/Shot7'
import { Shot8 } from './shots/Shot8'

export interface SubtitleSegment {
  text: string
  start: number
  end: number
  duration: number
}

// Subtitle segments from voiceover manifest (absolute video timing in seconds)
const segments: SubtitleSegment[] = [
  { text: '你写了一个超好用的AI技能，结果得复制16次才能给所有代理用上？', start: 0, end: 5.23, duration: 5.23 },
  { text: '2026年AI编程代理大爆发，15个以上。', start: 5.23, end: 9.5, duration: 4.27 },
  { text: '每个都有自己的skills目录，格式还差不多。', start: 9.5, end: 13.15, duration: 3.65 },
  { text: '更新一次？', start: 13.15, end: 14.21, duration: 1.06 },
  { text: '对不起，再复制16次。', start: 14.21, end: 16.85, duration: 2.64 },
  { text: '所以我做了这个工具：multi-agent-syncer。', start: 16.85, end: 20.33, duration: 3.48 },
  { text: '核心思路——符号链接。', start: 20.33, end: 22.37, duration: 2.04 },
  { text: '中央仓库放一份，所有代理用symlink指向它。', start: 22.37, end: 26.02, duration: 3.65 },
  { text: '改一次，全部生效，零拷贝。', start: 26.02, end: 29.26, duration: 3.24 },
  { text: '用法超简单。', start: 29.26, end: 31.13, duration: 1.87 },
  { text: '装好之后，', start: 31.13, end: 32.35, duration: 1.22 },
  { text: '一条命令同步多个代理：sync --skills tavily-search --to claude,cursor，', start: 32.35, end: 38.21, duration: 5.86 },
  { text: '搞定。', start: 38.21, end: 39.26, duration: 1.06 },
  { text: '想看状态？', start: 39.26, end: 40.32, duration: 1.06 },
  { text: 'status一目了然。', start: 40.32, end: 42.36, duration: 2.04 },
  { text: '不需要了？', start: 42.36, end: 43.42, duration: 1.06 },
  { text: 'unsync直接取消。', start: 43.42, end: 45.26, duration: 1.85 },
  { text: '不喜欢命令行？', start: 45.26, end: 46.73, duration: 1.46 },
  { text: '打开浏览器，Web UI矩阵视图，直接勾选就行。', start: 46.73, end: 51.17, duration: 4.44 },
  { text: '最关键的是项目级同步。', start: 51.17, end: 53.42, duration: 2.26 },
  { text: '给前端项目同步React技能，给后端项目同步数据库技能，互不干扰。', start: 53.42, end: 59.45, duration: 6.02 },
  { text: '市面上有类似工具。', start: 59.45, end: 60.91, duration: 1.46 },
  { text: 'agent-skills-manager是桌面应用，11个代理，也有项目级。', start: 60.91, end: 66.58, duration: 5.66 },
  { text: 'skillshare支持50多个代理，更全面。', start: 66.58, end: 70.03, duration: 3.46 },
  { text: 'claude-skills有232个技能但同步脚本分散。', start: 70.03, end: 74.47, duration: 4.44 },
  { text: '它们各有优势。', start: 74.47, end: 75.94, duration: 1.46 },
  { text: '核心优势：用symlink做项目级同步，零拷贝，按项目精准管控技能。', start: 75.94, end: 82.8, duration: 6.86 },
  { text: '最轻量，800行代码。', start: 82.8, end: 85.08, duration: 2.28 },
  { text: '代理覆盖16个以上。', start: 85.08, end: 87.34, duration: 2.26 },
  { text: '而且它能管理自己——工具本身就是一个skill。', start: 87.34, end: 91.2, duration: 3.86 },
  { text: '开源免费，GitHub链接放评论区。', start: 91.2, end: 94.44, duration: 3.24 },
  { text: '觉得好用，去给个star吧，你的star是开源最大的动力。', start: 94.44, end: 98.71, duration: 4.27 },
  { text: '你用几个AI编程代理？', start: 98.71, end: 101.14, duration: 2.42 },
  { text: '评论区告诉我。', start: 101.14, end: 102.36, duration: 1.22 },
]

const voiceoverTimings = segments.map(({ start, end }) => ({ start, end }))

// Shot timing from voiceover manifest
const shotData = [
  { number: 1, duration: 5.23, startTime: 0 },
  { number: 2, duration: 11.62, startTime: 5.23 },
  { number: 3, duration: 12.41, startTime: 16.85 },
  { number: 4, duration: 16.00, startTime: 29.26 },
  { number: 5, duration: 14.19, startTime: 45.26 },
  { number: 6, duration: 16.49, startTime: 59.45 },
  { number: 7, duration: 15.26, startTime: 75.94 },
  { number: 8, duration: 11.16, startTime: 91.20 },
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

export const MultiAgentSyncer: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#0f172a' }}>
      {/* Background music */}
      <BGMAudio style="科技电子" tempo="medium" voiceoverSegments={voiceoverTimings} />

      {/* Full audio for ProgressiveSubtitle timing */}
      <Audio src={staticFile('/audio/multi-agent-syncer/voiceover-full.mp3')} volume={1} />

      {/* Shot 1 — Hook */}
      <Sequence from={shotFrames[0].from} durationInFrames={shotFrames[0].durationInFrames} premountFor={fps}>
        <Shot1 subtitleSegments={segments} videoOffset={shotData[0].startTime} />
        <SFXLayer effects={[{ mood: 'epic', action: 'transition', intensity: 'strong' }]} />
      </Sequence>

      {/* Shot 2 — Pain point */}
      <Sequence from={shotFrames[1].from} durationInFrames={shotFrames[1].durationInFrames} premountFor={fps}>
        <Transition type="slide-up">
          <Shot2 subtitleSegments={segments} videoOffset={shotData[1].startTime} />
        </Transition>
        <SFXLayer effects={[{ mood: 'tense', action: 'emphasis', intensity: 'medium' }]} />
      </Sequence>

      {/* Shot 3 — Solution */}
      <Sequence from={shotFrames[2].from} durationInFrames={shotFrames[2].durationInFrames} premountFor={fps}>
        <Transition type="zoom-in">
          <Shot3 subtitleSegments={segments} videoOffset={shotData[2].startTime} />
        </Transition>
        <SFXLayer effects={[{ mood: 'energetic', action: 'emphasis', intensity: 'medium' }]} />
      </Sequence>

      {/* Shot 4 — CLI demo */}
      <Sequence from={shotFrames[3].from} durationInFrames={shotFrames[3].durationInFrames} premountFor={fps}>
        <Transition type="slide-left">
          <Shot4 subtitleSegments={segments} videoOffset={shotData[3].startTime} />
        </Transition>
        <SFXLayer effects={[{ mood: 'calm', action: 'ambient', intensity: 'subtle' }]} />
      </Sequence>

      {/* Shot 5 — Web UI + project-level */}
      <Sequence from={shotFrames[4].from} durationInFrames={shotFrames[4].durationInFrames} premountFor={fps}>
        <Transition type="fade">
          <Shot5 subtitleSegments={segments} videoOffset={shotData[4].startTime} />
        </Transition>
        <SFXLayer effects={[{ mood: 'calm', action: 'ambient', intensity: 'subtle' }]} />
      </Sequence>

      {/* Shot 6 — Comparison */}
      <Sequence from={shotFrames[5].from} durationInFrames={shotFrames[5].durationInFrames} premountFor={fps}>
        <Transition type="zoom-in">
          <Shot6 subtitleSegments={segments} videoOffset={shotData[5].startTime} />
        </Transition>
        <SFXLayer effects={[{ mood: 'energetic', action: 'transition', intensity: 'medium' }]} />
      </Sequence>

      {/* Shot 7 — Advantages */}
      <Sequence from={shotFrames[6].from} durationInFrames={shotFrames[6].durationInFrames} premountFor={fps}>
        <Transition type="fade">
          <Shot7 subtitleSegments={segments} videoOffset={shotData[6].startTime} />
        </Transition>
        <SFXLayer effects={[{ mood: 'playful', action: 'feedback', intensity: 'medium' }]} />
      </Sequence>

      {/* Shot 8 — CTA */}
      <Sequence from={shotFrames[7].from} durationInFrames={shotFrames[7].durationInFrames} premountFor={fps}>
        <Transition type="fade">
          <Shot8 subtitleSegments={segments} videoOffset={shotData[7].startTime} />
        </Transition>
        <SFXLayer effects={[{ mood: 'epic', action: 'emphasis', intensity: 'medium' }]} />
      </Sequence>
    </AbsoluteFill>
  )
}

export { segments, durationInFrames }
