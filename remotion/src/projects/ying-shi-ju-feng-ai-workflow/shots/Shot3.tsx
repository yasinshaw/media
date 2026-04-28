import React from 'react'
import { useCurrentFrame, useVideoConfig, spring } from 'remotion'
import { TimelineFlow } from '../../../components'
import type { SubtitleSegment } from '../../../components'

interface ShotProps {
  subtitleSegments?: SubtitleSegment[]
  videoOffset?: number
}

// Theme: Sunrise — 效率/数据/成长
// Background: linear-gradient(135deg, #FEF3C7, #FCD34D)
// Animation: staggerReveal with bouncy spring (damping: 20, stiffness: 200)

const SUBTITLE_SEGMENTS: SubtitleSegment[] = [
  { text: '协作中枢是飞书。', start: 14.51, end: 15.87, duration: 1.36 },
  { text: '选题全员贡献想法，', start: 15.87, end: 17.39, duration: 1.52 },
  { text: 'OpenClaw筛选；', start: 17.39, end: 19.25, duration: 1.86 },
  { text: '拍摄管理交给AI Agent；', start: 19.25, end: 21.79, duration: 2.54 },
  { text: '完成后多维表格自动刷新数据，', start: 21.79, end: 24.17, duration: 2.37 },
  { text: 'AI分析封面标题效果。', start: 24.17, end: 26.03, duration: 1.86 },
]

const VIDEO_OFFSET = 14.09

const ACCENT = '#F97316'
const TEXT_PRIMARY = '#1C1917'
const TEXT_SECONDARY = '#78716C'
const HIGHLIGHT_BG = 'rgba(249,115,22,0.2)'

const SPRING_CONFIG = { damping: 20, stiffness: 200 }

export const Shot3: React.FC<ShotProps> = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const stagger = (index: number) => {
    return spring({
      frame,
      fps,
      config: SPRING_CONFIG,
      delay: 5 + index * 20,
    })
  }

  const highlightProgress = (delay: number) =>
    spring({ frame, fps, config: SPRING_CONFIG, delay })

  const items = [
    {
      icon: '📋',
      label: (
        <span>
          选题策划{' '}
          <span style={{ position: 'relative', display: 'inline-block' }}>
            <span
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: '50%',
                height: '1.1em',
                transform: `translateY(-50%) scaleX(${highlightProgress(15)})`,
                transformOrigin: 'left center',
                backgroundColor: HIGHLIGHT_BG,
                borderRadius: '0.15em',
              }}
            />
            <span style={{ position: 'relative', zIndex: 1, fontWeight: 700, color: ACCENT }}>
              OpenClaw
            </span>
          </span>
        </span>
      ),
      detail: '飞书群聊 + OpenClaw筛选',
      opacity: stagger(0),
    },
    {
      icon: '🎬',
      label: (
        <span>
          拍摄管理{' '}
          <span style={{ position: 'relative', display: 'inline-block' }}>
            <span
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: '50%',
                height: '1.1em',
                transform: `translateY(-50%) scaleX(${highlightProgress(35)})`,
                transformOrigin: 'left center',
                backgroundColor: HIGHLIGHT_BG,
                borderRadius: '0.15em',
              }}
            />
            <span style={{ position: 'relative', zIndex: 1, fontWeight: 700, color: ACCENT }}>
              AI Agent
            </span>
          </span>
        </span>
      ),
      detail: 'AI Agent 自动排期',
      opacity: stagger(1),
    },
    {
      icon: '📊',
      label: (
        <span>
          数据复盘{' '}
          <span style={{ position: 'relative', display: 'inline-block' }}>
            <span
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: '50%',
                height: '1.1em',
                transform: `translateY(-50%) scaleX(${highlightProgress(55)})`,
                transformOrigin: 'left center',
                backgroundColor: HIGHLIGHT_BG,
                borderRadius: '0.15em',
              }}
            />
            <span style={{ position: 'relative', zIndex: 1, fontWeight: 700, color: ACCENT }}>
              多维表格
            </span>
          </span>
        </span>
      ),
      detail: '多维表格自动刷新',
      opacity: stagger(2),
    },
    {
      icon: '🔍',
      label: (
        <span>
          效果分析{' '}
          <span style={{ position: 'relative', display: 'inline-block' }}>
            <span
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: '50%',
                height: '1.1em',
                transform: `translateY(-50%) scaleX(${highlightProgress(75)})`,
                transformOrigin: 'left center',
                backgroundColor: HIGHLIGHT_BG,
                borderRadius: '0.15em',
              }}
            />
            <span style={{ position: 'relative', zIndex: 1, fontWeight: 700, color: ACCENT }}>
              AI分析
            </span>
          </span>
        </span>
      ),
      detail: 'AI分析封面标题',
      opacity: stagger(3),
    },
  ]

  return (
    <TimelineFlow
      background="linear-gradient(135deg, #FEF3C7, #FCD34D)"
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
            飞书协作中枢
          </div>
          <div style={{ fontSize: 28, color: TEXT_SECONDARY, textAlign: 'center' }}>
            AI驱动的全流程管理
          </div>
        </div>
      }
      items={items}
      subtitleSegments={SUBTITLE_SEGMENTS}
      videoOffset={VIDEO_OFFSET}
    />
  )
}
