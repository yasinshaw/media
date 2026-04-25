import React from 'react'
import { AbsoluteFill, Sequence, Audio, staticFile } from 'remotion'
import { Shot1, Shot2, Shot3, Shot4, Shot5, Shot6, Shot7 } from './shots'

export interface SubtitleSegment {
  text: string
  start: number
  end: number
  duration: number
}

// From voiceover-manifest.json - grouped by shot number
const shotData = [
  { number: 1, duration: 5.69, startTime: 0 },
  { number: 2, duration: 9.98, startTime: 5.69 },
  { number: 3, duration: 16.74, startTime: 15.67 },
  { number: 4, duration: 11.11, startTime: 32.42 },
  { number: 5, duration: 8.81, startTime: 43.54 },
  { number: 6, duration: 15.27, startTime: 52.34 },
  { number: 7, duration: 8.74, startTime: 67.61 }
]

// Subtitle segments from manifest
const subtitleSegments: Record<number, SubtitleSegment[]> = {
  1: [
    { text: 'GPT-5.5来了！', start: 0, end: 2.04, duration: 2.04 },
    { text: '多项基准领先，但有一个项目它输了。', start: 2.04, end: 5.69, duration: 3.65 }
  ],
  2: [
    { text: '你还在用GPT-5.4吗？', start: 5.69, end: 7.94, duration: 2.26 },
    { text: '推理能力提升8%，代码能力提升9%，计算机操作提升5%。', start: 7.94, end: 14.21, duration: 6.26 },
    { text: '差距已经拉开了。', start: 14.21, end: 15.67, duration: 1.46 }
  ],
  3: [
    { text: '来看硬核数据。', start: 15.67, end: 17.14, duration: 1.46 },
    { text: '编码测试82.7%，远超Claude Opus的69.4%。', start: 17.14, end: 23.16, duration: 6.02 },
    { text: '数学推理51.7%，高难数学35.4%。', start: 23.16, end: 27.98, duration: 4.82 },
    { text: '网络安全81.8%，Claude只有73.1%。', start: 27.98, end: 32.42, duration: 4.44 }
  ],
  4: [
    { text: 'GPT-5.5最大的升级在Agent能力。', start: 32.42, end: 36.07, duration: 3.65 },
    { text: '它能自主完成复杂任务，跨多个工具协作，从写代码、做研究到分析数据，一条龙搞定。', start: 36.07, end: 43.54, duration: 7.46 }
  ],
  5: [
    { text: '速度和GPT-5.4一样快，', start: 43.54, end: 46.37, duration: 2.83 },
    { text: '但token效率更高，', start: 46.37, end: 48.62, duration: 2.26 },
    { text: '完成任务更省token，', start: 48.62, end: 50.88, duration: 2.26 },
    { text: '性价比直接拉满。', start: 50.88, end: 52.34, duration: 1.46 }
  ],
  6: [
    { text: '但GPT-5.5并非无敌。', start: 52.34, end: 55.01, duration: 2.66 },
    { text: 'BrowseComp网页浏览测试，', start: 55.01, end: 57.84, duration: 2.83 },
    { text: 'Gemini 3.1 Pro拿到85.9%，', start: 57.84, end: 61.3, duration: 3.46 },
    { text: '反超了GPT-5.5的84.4%。', start: 61.3, end: 64.75, duration: 3.46 },
    { text: '所以选AI工具，别只看综合分。', start: 64.75, end: 67.61, duration: 2.86 }
  ],
  7: [
    { text: '想了解GPT-5.5怎么用最有效？', start: 67.61, end: 70.85, duration: 3.24 },
    { text: '关注我，下期出实战教程。', start: 70.85, end: 73.3, duration: 2.45 },
    { text: '觉得有用就点赞收藏，我们下期见。', start: 73.3, end: 76.34, duration: 3.05 }
  ]
}

// Calculate cumulative frame positions
const compositionFps = 30
let currentFrame = 0
const shotFrames = shotData.map(shot => {
  const from = currentFrame
  const durationInFrames = Math.round(shot.duration * compositionFps)
  currentFrame += durationInFrames
  return { ...shot, from, durationInFrames }
})

const totalDuration = currentFrame

export const Gpt55: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <Audio src={staticFile('/audio/gpt55能力/voiceover-full.mp3')} volume={1} />

      <Sequence from={shotFrames[0].from} durationInFrames={shotFrames[0].durationInFrames}>
        <Shot1 subtitleSegments={subtitleSegments[1]} videoOffset={shotData[0].startTime} />
      </Sequence>

      <Sequence from={shotFrames[1].from} durationInFrames={shotFrames[1].durationInFrames}>
        <Shot2 subtitleSegments={subtitleSegments[2]} videoOffset={shotData[1].startTime} />
      </Sequence>

      <Sequence from={shotFrames[2].from} durationInFrames={shotFrames[2].durationInFrames}>
        <Shot3 subtitleSegments={subtitleSegments[3]} videoOffset={shotData[2].startTime} />
      </Sequence>

      <Sequence from={shotFrames[3].from} durationInFrames={shotFrames[3].durationInFrames}>
        <Shot4 subtitleSegments={subtitleSegments[4]} videoOffset={shotData[3].startTime} />
      </Sequence>

      <Sequence from={shotFrames[4].from} durationInFrames={shotFrames[4].durationInFrames}>
        <Shot5 subtitleSegments={subtitleSegments[5]} videoOffset={shotData[4].startTime} />
      </Sequence>

      <Sequence from={shotFrames[5].from} durationInFrames={shotFrames[5].durationInFrames}>
        <Shot6 subtitleSegments={subtitleSegments[6]} videoOffset={shotData[5].startTime} />
      </Sequence>

      <Sequence from={shotFrames[6].from} durationInFrames={shotFrames[6].durationInFrames}>
        <Shot7 subtitleSegments={subtitleSegments[7]} videoOffset={shotData[6].startTime} />
      </Sequence>
    </AbsoluteFill>
  )
}

// Duration info for registration
export const durationInFrames = totalDuration
