// Theme: Ocean — 技术/AI
import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from 'remotion'
import { TwoColumnCompare, type SubtitleSegment } from '../../../components'

interface ShotProps {
  subtitleSegments?: SubtitleSegment[]
}

export const Shot6: React.FC<ShotProps> = ({ subtitleSegments }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const leftProgress = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 200 },
    delay: 5,
  })
  const leftOpacity = interpolate(leftProgress, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' })
  const leftTranslateX = interpolate(leftProgress, [0, 1], [-60, 0], {
    easing: Easing.out(Easing.quad),
    extrapolateRight: 'clamp',
  })

  const rightProgress = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 200 },
    delay: 15,
  })
  const rightOpacity = interpolate(rightProgress, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' })
  const rightTranslateX = interpolate(rightProgress, [0, 1], [60, 0], {
    easing: Easing.out(Easing.quad),
    extrapolateRight: 'clamp',
  })

  return (
    <TwoColumnCompare
      background="linear-gradient(135deg, #F0F9FF, #BAE6FD)"
      left={{
        title: '技能',
        accent: '#0EA5E9',
        opacity: leftOpacity,
        body: (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 24,
              transform: `translateX(${leftTranslateX}px)`,
            }}
          >
            <span style={{ fontSize: 72 }}>💬</span>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                textAlign: 'center',
              }}
            >
              <span style={{ fontSize: 30, fontWeight: 600, color: '#0C4A6E' }}>
                沟通反馈
              </span>
              <span style={{ fontSize: 30, fontWeight: 600, color: '#0C4A6E' }}>
                轻量快速
              </span>
            </div>
          </div>
        ),
        caption: '动态调整行为',
      }}
      right={{
        title: '代码',
        accent: '#06B6D4',
        opacity: rightOpacity,
        body: (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 24,
              transform: `translateX(${rightTranslateX}px)`,
            }}
          >
            <span style={{ fontSize: 72 }}>⚙️</span>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                textAlign: 'center',
              }}
            >
              <span style={{ fontSize: 30, fontWeight: 600, color: '#0C4A6E' }}>
                精确控制
              </span>
              <span style={{ fontSize: 30, fontWeight: 600, color: '#0C4A6E' }}>
                可视化界面
              </span>
            </div>
          </div>
        ),
        caption: '百分百准确',
      }}
      subtitleSegments={subtitleSegments}
      videoOffset={0}
    />
  )
}
