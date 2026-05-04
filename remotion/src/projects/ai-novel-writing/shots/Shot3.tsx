import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion'
import { TimelineFlow } from '../../../components'
import { theme, FONT_FAMILY } from '../theme'

interface ShotProps {
  subtitleSegments?: Array<{ text: string; start: number; end: number; duration: number }>
}

export const Shot3: React.FC<ShotProps> = ({ subtitleSegments }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const subtitle = subtitleSegments?.find((s) => frame / fps >= s.start && frame / fps < s.end)?.text

  const staggerReveal = (index: number) =>
    interpolate(frame, [10 + index * 10, 22 + index * 10], [0, 1], { extrapolateRight: 'clamp' })

  const headerOpacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <TimelineFlow
      background="linear-gradient(135deg, #1E1B4B, #312E81)"
      accent={theme.accent}
      textColor={theme.textPrimary}
      detailColor={theme.textSecondary}
      subtitle={subtitle}
      header={
        <div style={{ opacity: headerOpacity, textAlign: 'center', fontFamily: FONT_FAMILY }}>
          <div style={{ fontSize: 56, fontWeight: 900, color: theme.textPrimary }}>
            第1步
          </div>
          <div style={{ fontSize: 40, fontWeight: 700, color: theme.accent, marginTop: 8 }}>
            构建世界观
          </div>
        </div>
      }
      items={[
        { label: '时代背景', detail: '故事发生的世界和时代', opacity: staggerReveal(0) },
        { label: '核心规则', detail: '这个世界的基本运行法则', opacity: staggerReveal(1) },
        { label: '核心设定', detail: '贯穿全书的底层设定', opacity: staggerReveal(2) },
      ]}
      footer={
        <div style={{
          fontSize: 30, fontWeight: 600, color: theme.accentAlt,
          opacity: staggerReveal(3), fontFamily: FONT_FAMILY,
        }}>
          世界观是AI理解故事的基础
        </div>
      }
    />
  )
}
