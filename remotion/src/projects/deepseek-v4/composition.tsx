import React from 'react'
import { AbsoluteFill, Sequence, Audio, staticFile } from 'remotion'
import { BGMAudio } from '../../components'
import { SFXLayer } from '../../components'
import { Shot1 } from './shots/Shot1'
import { Shot2 } from './shots/Shot2'
import { Shot3 } from './shots/Shot3'
import { Shot4 } from './shots/Shot4'
import { Shot5 } from './shots/Shot5'
import { Shot6 } from './shots/Shot6'
import { Shot7 } from './shots/Shot7'

export interface SubtitleSegment {
  text: string
  start: number
  end: number
  duration: number
}

// Subtitle segments from voiceover manifest
// Timings are relative to video start (seconds)
const segments: SubtitleSegment[] = [
  { text: 'DeepSeek V4来了，这次国产AI真的追上来了。', start: 0, end: 4.03, duration: 4.03 },
  { text: '之前大家总觉得国产模型差一截，要么性能不够，要么太贵。', start: 4.03, end: 9.1, duration: 5.07 },
  { text: '但这次V4，性能逼近GPT-5.5，价格只要人家的六分之一。', start: 9.1, end: 15.74, duration: 6.64 },
  { text: 'V4 Pro总共1.6万亿参数，是目前最大的开源模型。', start: 15.74, end: 21.19, duration: 5.45 },
  { text: '但它用MoE架构，每次推理只激活490亿，既大又省。', start: 21.19, end: 27.48, duration: 6.29 },
  { text: '而且它原生支持100万token上下文，一整本三体扔进去都能一次读完。', start: 27.48, end: 33.53, duration: 6.05 },
  { text: '跟国内选手比，', start: 33.53, end: 34.99, duration: 1.46 },
  { text: '代码实战Kimi K2.5目前最强，', start: 34.99, end: 38.23, duration: 3.24 },
  { text: 'SWE-Bench拿了76.8%。', start: 38.23, end: 41.88, duration: 3.65 },
  { text: '但V4也有自己的王牌：编程HumanEval从上一代62.8飙到76.8，', start: 41.88, end: 47.9, duration: 6.02 },
  { text: '追平一线水平，', start: 47.9, end: 49.94, duration: 2.04 },
  { text: '而且数学推理领域领先国产同侪。', start: 49.94, end: 53.57, duration: 3.63 },
  { text: '放到国际上更亮眼。', start: 53.57, end: 55.61, duration: 2.04 },
  { text: 'BrowseComp测试83.4%，直接超过Claude Opus 4.7。', start: 55.61, end: 61.66, duration: 6.05 },
  { text: '数学推理连GPT-5都被超越了。', start: 61.66, end: 64.73, duration: 3.07 },
  { text: '简单说，搜索和数学，已经站到世界第一梯队。', start: 64.73, end: 68.76, duration: 4.03 },
  { text: '价格才是最大亮点。', start: 68.76, end: 71.04, duration: 2.28 },
  { text: 'V4 Flash每百万token只要0.14美元，', start: 71.04, end: 75.29, duration: 4.25 },
  { text: '比GPT-5.4 Nano还便宜，', start: 75.29, end: 77.95, duration: 2.66 },
  { text: '比Claude Haiku便宜7倍。', start: 77.95, end: 80.62, duration: 2.67 },
  { text: 'Pro版也只要1.74美元，竞品都是十美元起步。', start: 80.62, end: 85.27, duration: 4.65 },
  { text: '开源、最大、最便宜，数学推理领先。', start: 85.27, end: 89.54, duration: 4.27 },
  { text: 'DeepSeek V4正在重新定义AI的性价比天花板。', start: 89.54, end: 94.2, duration: 4.66 },
  { text: '关注我，第一时间解读最新AI动态。', start: 94.2, end: 97.44, duration: 3.24 },
]

// Shot timing data from voiceover manifest
const shotData = [
  { number: 1, duration: 4.03, startTime: 0 },
  { number: 2, duration: 11.71, startTime: 4.03 },
  { number: 3, duration: 17.79, startTime: 15.74 },
  { number: 4, duration: 20.04, startTime: 33.53 },
  { number: 5, duration: 15.19, startTime: 53.57 },
  { number: 6, duration: 16.51, startTime: 68.76 },
  { number: 7, duration: 12.17, startTime: 85.27 },
]

// Calculate cumulative frame positions
const fps = 30
let currentFrame = 0
const shotFrames = shotData.map(shot => {
  const from = currentFrame
  const durationInFrames = Math.round(shot.duration * fps)
  currentFrame += durationInFrames
  return { ...shot, from, durationInFrames }
})

const durationInFrames = currentFrame

export const DeepseekV4: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#0f172a' }}>
      {/* Background music */}
      <BGMAudio style="科技电子" tempo="medium" volume={0.08} />

      {/* Full audio for ProgressiveSubtitle timing */}
      <Audio src={staticFile('/audio/deepseek-v4/voiceover-full.mp3')} volume={1} />

      <Sequence from={shotFrames[0].from} durationInFrames={shotFrames[0].durationInFrames}>
        <Shot1 subtitleSegments={segments} videoOffset={shotData[0].startTime} />
        <SFXLayer effects={[{ type: 'whoosh-in' }]} />
      </Sequence>

      <Sequence from={shotFrames[1].from} durationInFrames={shotFrames[1].durationInFrames}>
        <Shot2 subtitleSegments={segments} videoOffset={shotData[1].startTime} />
      </Sequence>

      <Sequence from={shotFrames[2].from} durationInFrames={shotFrames[2].durationInFrames}>
        <Shot3 subtitleSegments={segments} videoOffset={shotData[2].startTime} />
      </Sequence>

      <Sequence from={shotFrames[3].from} durationInFrames={shotFrames[3].durationInFrames}>
        <Shot4 subtitleSegments={segments} videoOffset={shotData[3].startTime} />
        <SFXLayer effects={[{ type: 'impact' }]} />
      </Sequence>

      <Sequence from={shotFrames[4].from} durationInFrames={shotFrames[4].durationInFrames}>
        <Shot5 subtitleSegments={segments} videoOffset={shotData[4].startTime} />
        <SFXLayer effects={[{ type: 'impact' }]} />
      </Sequence>

      <Sequence from={shotFrames[5].from} durationInFrames={shotFrames[5].durationInFrames}>
        <Shot6 subtitleSegments={segments} videoOffset={shotData[5].startTime} />
      </Sequence>

      <Sequence from={shotFrames[6].from} durationInFrames={shotFrames[6].durationInFrames}>
        <Shot7 subtitleSegments={segments} videoOffset={shotData[6].startTime} />
        <SFXLayer effects={[{ type: 'outro' }]} />
      </Sequence>
    </AbsoluteFill>
  )
}

export { segments, durationInFrames }
