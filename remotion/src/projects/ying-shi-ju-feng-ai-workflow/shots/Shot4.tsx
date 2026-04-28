import React from 'react'
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion'
import { TimelineFlow } from '../../../components'
import type { SubtitleSegment } from '../../../components'

interface ShotProps {
  subtitleSegments?: SubtitleSegment[]
  videoOffset?: number
}

// Theme: Sunrise — 效率/数据/成长
// Background: #FFF1F2 → #FECDD3
// Animation: slideIn stagger (interpolate) + spring highlight

const SUBTITLE_SEGMENTS: SubtitleSegment[] = [
  { text: '视频生成用TapNow节点式画布。', start: 26.81, end: 30.03, duration: 3.22 },
  { text: '图片生成、', start: 30.03, end: 30.98, duration: 0.95 },
  { text: '动效、', start: 30.98, end: 31.54, duration: 0.57 },
  { text: '视频、', start: 31.54, end: 32.11, duration: 0.57 },
  { text: '音频，', start: 32.11, end: 32.68, duration: 0.57 },
  { text: '一个画布拖拽连线全搞定。', start: 32.68, end: 34.95, duration: 2.27 },
  { text: '不用切换工具，', start: 34.95, end: 36.28, duration: 1.33 },
  { text: '一条流水线从头到尾。', start: 36.28, end: 38.17, duration: 1.89 },
]

const VIDEO_OFFSET = 26.35

const ACCENT = '#EC4899'
const HIGHLIGHT_COLOR = 'rgba(236, 72, 153, 0.2)'
const TEXT_PRIMARY = '#1C1917'
const TEXT_SECONDARY = '#78716C'

// Stagger delays for slideIn (frames): 5, 25, 45, 65, 85
const SLIDE_DELAYS = [5, 25, 45, 65, 85]
const SLIDE_DURATION = 15

export const Shot4: React.FC<ShotProps> = ({
  subtitleSegments = SUBTITLE_SEGMENTS,
  videoOffset = VIDEO_OFFSET,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const slideIn = (index: number) => {
    const delay = SLIDE_DELAYS[index] ?? 0
    return interpolate(
      frame,
      [delay, delay + SLIDE_DURATION],
      [0, 1],
      { extrapolateRight: 'clamp' },
    )
  }

  const highlightProgress = (delay: number) =>
    spring({ frame, fps, config: { damping: 20, stiffness: 200 }, delay })

  const pipelineItems = [
    { icon: '📝', zh: '文字输入', en: 'Prompt', delay: 20 },
    { icon: '🎨', zh: '图片生成', en: 'Image Gen', delay: 40 },
    { icon: '✨', zh: '动效添加', en: 'Motion', delay: 60 },
    { icon: '🎬', zh: '视频生成', en: 'Video Gen', delay: 80 },
    { icon: '🔊', zh: '音频合成', en: 'Audio Mix', delay: 100 },
  ]

  return (
    <TimelineFlow
      background="linear-gradient(135deg, #FFF1F2, #FECDD3)"
      accent={ACCENT}
      textColor={TEXT_PRIMARY}
      detailColor={TEXT_SECONDARY}
      showConnectors={true}
      connectorStyle="arrow"
      header={
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              fontSize: 48,
              fontWeight: 800,
              color: TEXT_PRIMARY,
              textAlign: 'center',
            }}
          >
            TapNow 节点式画布
          </div>
          <div style={{ fontSize: 28, color: TEXT_SECONDARY, textAlign: 'center' }}>
            一个画布，全流程搞定
          </div>
        </div>
      }
      items={pipelineItems.map((item, i) => ({
        icon: item.icon,
        label: (
          <span>
            {item.zh}{' '}
            <span style={{ position: 'relative', display: 'inline-block' }}>
              <span
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: '50%',
                  height: '1.1em',
                  transform: `translateY(-50%) scaleX(${highlightProgress(item.delay)})`,
                  transformOrigin: 'left center',
                  backgroundColor: HIGHLIGHT_COLOR,
                  borderRadius: '0.15em',
                }}
              />
              <span style={{ position: 'relative', zIndex: 1, fontWeight: 700, color: ACCENT }}>
                {item.en}
              </span>
            </span>
          </span>
        ),
        opacity: slideIn(i),
      }))}
      subtitleSegments={subtitleSegments}
      videoOffset={videoOffset}
    />
  )
}
