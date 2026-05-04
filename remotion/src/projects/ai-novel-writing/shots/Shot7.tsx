import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import { HubLayout } from '../../../components'
import { theme, FONT_FAMILY } from '../theme'

interface ShotProps {
  subtitleSegments?: Array<{ text: string; start: number; end: number; duration: number }>
}

export const Shot7: React.FC<ShotProps> = ({ subtitleSegments }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const subtitle = subtitleSegments?.find((s) => frame / fps >= s.start && frame / fps < s.end)?.text

  const centerScale = spring({ frame, fps, config: { damping: 15, stiffness: 120 }, delay: 5 })
  const lineFadeIn = interpolate(frame, [15, 30], [0, 1], { extrapolateRight: 'clamp' })

  const nodeFadeIn = (delay: number) =>
    interpolate(frame, [delay, delay + 12], [0, 1], { extrapolateRight: 'clamp' })

  const footerFadeIn = interpolate(frame, [30, 42], [0, 1], { extrapolateRight: 'clamp' })

  const centerNode = (
    <div style={{
      width: 180, height: 180, borderRadius: 90,
      background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentAlt})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: 8,
      boxShadow: `0 0 60px ${theme.accent}44`,
      fontFamily: FONT_FAMILY,
    }}>
      <div style={{
        width: 60, height: 60, borderRadius: 30,
        background: 'rgba(255,255,255,0.2)',
        border: '3px solid rgba(255,255,255,0.4)',
      }} />
      <div style={{ fontSize: 24, fontWeight: 700, color: '#fff' }}>AI大脑</div>
    </div>
  )

  const inputNode = (
    <div style={{
      width: 200, padding: '24px 20px', borderRadius: 20,
      background: theme.cardBg,
      border: `2px solid ${theme.accent}`,
      textAlign: 'center', fontFamily: FONT_FAMILY,
      opacity: nodeFadeIn(20),
    }}>
      <div style={{ fontSize: 26, fontWeight: 700, color: theme.accent, marginBottom: 8 }}>
        输入
      </div>
      <div style={{ fontSize: 28, color: theme.textPrimary, fontWeight: 600 }}>
        前情提要
      </div>
      <div style={{ fontSize: 28, color: theme.textSecondary, fontWeight: 600 }}>
        + 角色状态
      </div>
    </div>
  )

  const outputNode = (
    <div style={{
      width: 200, padding: '24px 20px', borderRadius: 20,
      background: theme.cardBg,
      border: `2px solid ${theme.accentAlt}`,
      textAlign: 'center', fontFamily: FONT_FAMILY,
      opacity: nodeFadeIn(28),
    }}>
      <div style={{ fontSize: 26, fontWeight: 700, color: theme.accentAlt, marginBottom: 8 }}>
        输出
      </div>
      <div style={{ fontSize: 28, color: theme.textPrimary, fontWeight: 600 }}>
        连贯的
      </div>
      <div style={{ fontSize: 28, color: theme.textPrimary, fontWeight: 600 }}>
        章节内容
      </div>
    </div>
  )

  return (
    <HubLayout
      background="linear-gradient(135deg, #18181B, #27272A)"
      center={{ node: centerNode, scale: interpolate(centerScale, [0, 1], [0.5, 1]) }}
      subtitle={subtitle}
      surrounding={[
        { position: 'left', node: inputNode },
        { position: 'right', node: outputNode },
      ]}
      radius={320}
      connectionColor={theme.accent}
      connectionWidth={4}
      connectionsOpacity={lineFadeIn}
      header={
        <div style={{
          opacity: interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp' }),
          fontSize: 48, fontWeight: 900, color: theme.textPrimary, fontFamily: FONT_FAMILY,
        }}>
          关键技能
        </div>
      }
      footer={
        <div style={{
          opacity: footerFadeIn,
          fontSize: 36, fontWeight: 800, color: theme.accent,
          textAlign: 'center', fontFamily: FONT_FAMILY,
          padding: '16px 40px',
          background: `${theme.accent}22`,
          borderRadius: 16,
        }}>
          上下文管理是核心技能
        </div>
      }
    />
  )
}
