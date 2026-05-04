import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion'
import { TimelineFlow } from '../../../components'
import { theme, FONT_FAMILY } from '../theme'

interface ShotProps {
  subtitleSegments?: Array<{ text: string; start: number; end: number; duration: number }>
}

export const Shot5: React.FC<ShotProps> = ({ subtitleSegments }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const subtitle = subtitleSegments?.find((s) => frame / fps >= s.start && frame / fps < s.end)?.text

  const staggerReveal = (index: number) =>
    interpolate(frame, [8 + index * 8, 20 + index * 8], [0, 1], { extrapolateRight: 'clamp' })

  const headerOpacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp' })

  const chapters = [
    { label: '第1章', detail: '主角登场，埋下悬念' },
    { label: '第2章', detail: '冲突升级，人物成长' },
    { label: '第3章', detail: '真相揭晓，高潮迭起' },
    { label: '第4章', detail: '收束伏笔，结局反转' },
  ]

  return (
    <TimelineFlow
      background="linear-gradient(135deg, #0C4A6E, #075985)"
      accent={theme.accentAlt}
      textColor={theme.textPrimary}
      detailColor={theme.textSecondary}
      direction="horizontal"
      gap={8}
      subtitle={subtitle}
      header={
        <div style={{ opacity: headerOpacity, textAlign: 'center', fontFamily: FONT_FAMILY }}>
          <div style={{ fontSize: 56, fontWeight: 900, color: theme.textPrimary }}>
            第3步
          </div>
          <div style={{ fontSize: 40, fontWeight: 700, color: theme.accentAlt, marginTop: 8 }}>
            列大纲
          </div>
        </div>
      }
      items={chapters.map((ch, i) => ({
        label: ch.label,
        detail: ch.detail,
        opacity: staggerReveal(i),
        color: i === 2 ? '#FBBF24' : undefined,
      }))}
      footer={
        <div style={{
          fontSize: 30, fontWeight: 600, color: theme.accent,
          opacity: staggerReveal(4), fontFamily: FONT_FAMILY,
        }}>
          大纲越细，AI越不会跑偏
        </div>
      }
    />
  )
}
