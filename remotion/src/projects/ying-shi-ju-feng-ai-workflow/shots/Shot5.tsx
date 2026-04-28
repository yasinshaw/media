import React from 'react'
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion'
import { TwoColumnCompare } from '../../../components'
import type { SubtitleSegment } from '../../../components'

interface ShotProps {
  subtitleSegments?: SubtitleSegment[]
  videoOffset?: number
}

// Theme: Sunrise — 效率/数据/成长
// Background: linear-gradient(135deg, #ECFDF5, #A7F3D0)
// TextPrimary: #1C1917, TextSecondary: #78716C, Accent: #F97316, AccentAlt: #EAB308
// CardBg: #FFFBEB
// Animation: bouncy (damping: 20, stiffness: 200)

const SUBTITLE_SEGMENTS: SubtitleSegment[] = [
  { text: 'Tim体验了字节的Seedance 2.0后说，', start: 38.9, end: 43.22, duration: 4.32 },
  { text: '这是海啸级变革。', start: 43.22, end: 44.66, duration: 1.44 },
  { text: '一张照片加一张场景图，', start: 44.66, end: 46.64, duration: 1.98 },
  { text: '就能生成带运镜的视频。', start: 46.64, end: 48.62, duration: 1.98 },
  { text: '过去需要滑轨摇臂灯光师的工作，', start: 48.62, end: 51.32, duration: 2.7 },
  { text: '现在压缩成一行提示词。', start: 51.32, end: 53.3, duration: 1.98 },
]

const VIDEO_OFFSET = 38.4

const SPRING_CONFIG = { damping: 20, stiffness: 200 }

export const Shot5: React.FC<ShotProps> = ({
  subtitleSegments = SUBTITLE_SEGMENTS,
  videoOffset = VIDEO_OFFSET,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const leftScale = spring({ frame, fps, config: SPRING_CONFIG, delay: 5 })
  const rightScale = spring({ frame, fps, config: SPRING_CONFIG, delay: 30 })

  const itemScale = (index: number) =>
    spring({ frame, fps, config: SPRING_CONFIG, delay: 10 + index * 12 })

  const quoteScale = spring({ frame, fps, config: SPRING_CONFIG, delay: 85 })

  const highlightProgress = (delay: number) =>
    spring({ frame, fps, config: SPRING_CONFIG, delay })

  const pastItems = ['滑轨', '摇臂', '灯光师', '数小时粗剪']

  return (
    <TwoColumnCompare
      background="linear-gradient(135deg, #ECFDF5, #A7F3D0)"
      left={{
        title: '过去',
        body: (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
            {pastItems.map((item, i) => (
              <div
                key={item}
                style={{
                  fontSize: 34,
                  fontWeight: 700,
                  color: '#1C1917',
                  opacity: itemScale(i),
                  transform: `scale(${interpolate(itemScale(i), [0, 1], [0.7, 1])})`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  background: '#FFFBEB',
                  padding: '12px 28px',
                  borderRadius: 16,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                }}
              >
                <span style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: '#DC2626',
                  display: 'inline-block',
                }} />
                {item}
              </div>
            ))}
          </div>
        ),
        caption: '传统影视制作',
        accent: '#DC2626',
        opacity: leftScale,
      }}
      right={{
        title: '现在',
        body: (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            <div style={{
              fontSize: 30,
              color: '#78716C',
              background: '#FFFBEB',
              padding: '12px 24px',
              borderRadius: 16,
              boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
            }}>
              一张照片 + 一行提示词
            </div>
            <div
              style={{
                fontSize: 40,
                fontWeight: 800,
                color: '#16A34A',
                opacity: interpolate(frame, [40, 60], [0, 1], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                }),
              }}
            >
              <span style={{ position: 'relative', display: 'inline-block' }}>
                <span style={{
                  position: 'absolute', left: 0, right: 0, top: '50%', height: '1.1em',
                  transform: `translateY(-50%) scaleX(${highlightProgress(45)})`,
                  transformOrigin: 'left center',
                  backgroundColor: 'rgba(22,163,74,0.2)',
                  borderRadius: '0.15em',
                }} />
                <span style={{ position: 'relative', zIndex: 1 }}>Seedance 2.0</span>
              </span>
            </div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 600,
                color: '#16A34A',
                opacity: interpolate(frame, [60, 80], [0, 1], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                }),
              }}
            >
              → 带运镜的视频
            </div>
          </div>
        ),
        caption: 'AI一键生成',
        accent: '#16A34A',
        opacity: rightScale,
      }}
      footer={
        <div
          style={{
            opacity: quoteScale,
            transform: `scale(${interpolate(quoteScale, [0, 1], [0.8, 1])})`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
            background: '#FFFBEB',
            padding: '20px 40px',
            borderRadius: 20,
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          }}
        >
          <div style={{ fontSize: 36, fontWeight: 800, color: '#1C1917', fontStyle: 'italic' }}>
            &ldquo;这不是小革新，而是海啸&rdquo;
          </div>
          <div style={{ fontSize: 28, color: '#78716C' }}>— Tim / 影视飓风</div>
        </div>
      }
      subtitleSegments={subtitleSegments}
      videoOffset={videoOffset}
    />
  )
}
