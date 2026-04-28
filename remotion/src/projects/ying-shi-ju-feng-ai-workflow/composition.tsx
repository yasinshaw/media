// Theme: Sunrise — 效率/数据/成长
// Backgrounds: peach → yellow → golden → pink → mint → peach (cycle)
// Animations: typewriter+blurIn, scaleIn+typewriter, staggerReveal, slideIn stagger, slideIn+scaleIn, bouncy scaleIn CTA

import React from 'react'
import { AbsoluteFill, staticFile } from 'remotion'
import { Audio } from '@remotion/media'
import { TransitionSeries, linearTiming } from '@remotion/transitions'
import { fade } from '@remotion/transitions/fade'
import { slide } from '@remotion/transitions/slide'
import { flip } from '@remotion/transitions/flip'
import { BGMAudio, SFXLayer } from '../../components'

import { Shot1 } from './shots/Shot1'
import { Shot2 } from './shots/Shot2'
import { Shot3 } from './shots/Shot3'
import { Shot4 } from './shots/Shot4'
import { Shot5 } from './shots/Shot5'
import { Shot6 } from './shots/Shot6'

const manifest = {
  segments: [
    {
      file: 'voiceover-01.mp3',
      duration_seconds: 4.85,
      start: 0,
      subtitles: [
        { text: '1600万粉丝的影视飓风，', start: 0.42, end: 2.34, duration: 1.92 },
        { text: '他们的AI工作流到底长什么样？', start: 2.34, end: 4.56, duration: 2.22 },
      ],
    },
    {
      file: 'voiceover-02.mp3',
      duration_seconds: 9.24,
      start: 4.85,
      subtitles: [
        { text: '影视飓风一年做150期视频，', start: 5.25, end: 7.88, duration: 2.63 },
        { text: '项目周期从30多天压缩到5天。', start: 7.88, end: 10.7, duration: 2.82 },
        { text: '最新工作流分享的主题，', start: 10.7, end: 12.77, duration: 2.07 },
        { text: '就是AI。', start: 12.77, end: 13.71, duration: 0.94 },
      ],
    },
    {
      file: 'voiceover-03.mp3',
      duration_seconds: 12.26,
      start: 14.09,
      subtitles: [
        { text: '协作中枢是飞书。', start: 14.51, end: 15.87, duration: 1.36 },
        { text: '选题全员贡献想法，', start: 15.87, end: 17.39, duration: 1.52 },
        { text: 'OpenClaw筛选；', start: 17.39, end: 19.25, duration: 1.86 },
        { text: '拍摄管理交给AI Agent；', start: 19.25, end: 21.79, duration: 2.54 },
        { text: '完成后多维表格自动刷新数据，', start: 21.79, end: 24.17, duration: 2.37 },
        { text: 'AI分析封面标题效果。', start: 24.17, end: 26.03, duration: 1.86 },
      ],
    },
    {
      file: 'voiceover-04.mp3',
      duration_seconds: 12.05,
      start: 26.35,
      subtitles: [
        { text: '视频生成用TapNow节点式画布。', start: 26.81, end: 30.03, duration: 3.22 },
        { text: '图片生成、', start: 30.03, end: 30.98, duration: 0.95 },
        { text: '动效、', start: 30.98, end: 31.54, duration: 0.57 },
        { text: '视频、', start: 31.54, end: 32.11, duration: 0.57 },
        { text: '音频，', start: 32.11, end: 32.68, duration: 0.57 },
        { text: '一个画布拖拽连线全搞定。', start: 32.68, end: 34.95, duration: 2.27 },
        { text: '不用切换工具，', start: 34.95, end: 36.28, duration: 1.33 },
        { text: '一条流水线从头到尾。', start: 36.28, end: 38.17, duration: 1.89 },
      ],
    },
    {
      file: 'voiceover-05.mp3',
      duration_seconds: 15.46,
      start: 38.4,
      subtitles: [
        { text: 'Tim体验了字节的Seedance 2.0后说，', start: 38.9, end: 43.22, duration: 4.32 },
        { text: '这是海啸级变革。', start: 43.22, end: 44.66, duration: 1.44 },
        { text: '一张照片加一张场景图，', start: 44.66, end: 46.64, duration: 1.98 },
        { text: '就能生成带运镜的视频。', start: 46.64, end: 48.62, duration: 1.98 },
        { text: '过去需要滑轨摇臂灯光师的工作，', start: 48.62, end: 51.32, duration: 2.7 },
        { text: '现在压缩成一行提示词。', start: 51.32, end: 53.3, duration: 1.98 },
      ],
    },
    {
      file: 'voiceover-06.mp3',
      duration_seconds: 7.25,
      start: 53.86,
      subtitles: [
        { text: '从选题到复盘，', start: 54.22, end: 55.34, duration: 1.12 },
        { text: 'AI已经渗透到影视飓风的每个创作环节。', start: 55.34, end: 58.39, duration: 3.05 },
        { text: '想看更多AI创作干货，', start: 58.39, end: 60.16, duration: 1.77 },
        { text: '关注我。', start: 60.16, end: 60.8, duration: 0.64 },
      ],
    },
  ],
}

const fps = 30
const shotFrames = manifest.segments.map((s) => Math.round(s.duration_seconds * fps))
const transitionDurations = [15, 12, 15, 12, 15]

export const YingShiJuFengAiWorkflow: React.FC = () => (
  <AbsoluteFill style={{ background: '#FFF7ED' }}>
    <BGMAudio style="科技电子" tempo="medium" volume={0.08} voiceoverSegments={manifest.segments.map((s) => ({
      start: s.start,
      end: s.start + s.duration_seconds,
    }))} />

    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={shotFrames[0]}>
        <Shot1 subtitleSegments={manifest.segments[0].subtitles} videoOffset={manifest.segments[0].start} />
        <Audio src={staticFile('audio/ying-shi-ju-feng-ai-workflow/voiceover-01.mp3')} />
        <SFXLayer effects={[{ type: 'riser' }]} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: transitionDurations[0] })}
      />

      <TransitionSeries.Sequence durationInFrames={shotFrames[1]}>
        <Shot2 subtitleSegments={manifest.segments[1].subtitles} videoOffset={manifest.segments[1].start} />
        <Audio src={staticFile('audio/ying-shi-ju-feng-ai-workflow/voiceover-02.mp3')} />
        <SFXLayer effects={[{ type: 'impact' }]} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: 'from-right' })}
        timing={linearTiming({ durationInFrames: transitionDurations[1] })}
      />

      <TransitionSeries.Sequence durationInFrames={shotFrames[2]}>
        <Shot3 subtitleSegments={manifest.segments[2].subtitles} videoOffset={manifest.segments[2].start} />
        <Audio src={staticFile('audio/ying-shi-ju-feng-ai-workflow/voiceover-03.mp3')} />
        <SFXLayer effects={[{ type: 'text-pop' }]} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: transitionDurations[2] })}
      />

      <TransitionSeries.Sequence durationInFrames={shotFrames[3]}>
        <Shot4 subtitleSegments={manifest.segments[3].subtitles} videoOffset={manifest.segments[3].start} />
        <Audio src={staticFile('audio/ying-shi-ju-feng-ai-workflow/voiceover-04.mp3')} />
        <SFXLayer effects={[{ type: 'text-pop' }]} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: 'from-bottom' })}
        timing={linearTiming({ durationInFrames: transitionDurations[3] })}
      />

      <TransitionSeries.Sequence durationInFrames={shotFrames[4]}>
        <Shot5 subtitleSegments={manifest.segments[4].subtitles} videoOffset={manifest.segments[4].start} />
        <Audio src={staticFile('audio/ying-shi-ju-feng-ai-workflow/voiceover-05.mp3')} />
        <SFXLayer effects={[{ type: 'impact' }]} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={flip()}
        timing={linearTiming({ durationInFrames: transitionDurations[4] })}
      />

      <TransitionSeries.Sequence durationInFrames={shotFrames[5]}>
        <Shot6 subtitleSegments={manifest.segments[5].subtitles} videoOffset={manifest.segments[5].start} />
        <Audio src={staticFile('audio/ying-shi-ju-feng-ai-workflow/voiceover-06.mp3')} />
        <SFXLayer effects={[{ type: 'outro' }]} />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
)

const totalWithTransitions = shotFrames.reduce((a, b) => a + b, 0) - transitionDurations.reduce((a, b) => a + b, 0)
export { totalWithTransitions as durationInFrames }
