import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion'
import { TwoColumnCompare } from '../../../components'
import { theme, FONT_FAMILY } from '../theme'

interface ShotProps {
  subtitleSegments?: Array<{ text: string; start: number; end: number; duration: number }>
}

export const Shot2: React.FC<ShotProps> = ({ subtitleSegments }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const subtitle = subtitleSegments?.find((s) => frame / fps >= s.start && frame / fps < s.end)?.text

  const slideInFromLeft = (delay: number) => ({
    opacity: interpolate(frame, [delay, delay + 15], [0, 1], { extrapolateRight: 'clamp' }),
    transform: `translateX(${interpolate(frame, [delay, delay + 15], [-60, 0], {
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.quad),
    })}px)`,
  })

  const slideInFromRight = (delay: number) => ({
    opacity: interpolate(frame, [delay, delay + 15], [0, 1], { extrapolateRight: 'clamp' }),
    transform: `translateX(${interpolate(frame, [delay, delay + 15], [60, 0], {
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.quad),
    })}px)`,
  })

  const leftOpacity = interpolate(frame, [5, 20], [0, 1], { extrapolateRight: 'clamp' })
  const rightOpacity = interpolate(frame, [10, 25], [0, 1], { extrapolateRight: 'clamp' })

  const dryLines = [
    '主角走进房间，看到了一个人。',
    '那个人说了一句话。',
    '然后他们开始对话，聊了一些事情。',
  ]

  const richItems = [
    '丰富的世界观设定',
    '立体的角色性格',
    '精彩的对话与情节',
  ]

  return (
    <TwoColumnCompare
      background="linear-gradient(135deg, #18181B, #27272A)"
      subtitle={subtitle}
      left={{
        title: 'AI直接写的',
        body: (
          <div style={{
            ...slideInFromLeft(10),
            display: 'flex', flexDirection: 'column', gap: 20, width: '100%',
          }}>
            {dryLines.map((line, i) => (
              <div key={i} style={{
                fontSize: 28, color: '#FCA5A5', fontFamily: FONT_FAMILY,
                opacity: interpolate(i, [0, 2], [0.9, 0.5]),
                fontStyle: 'italic',
              }}>
                &ldquo;{line}&rdquo;
              </div>
            ))}
          </div>
        ),
        caption: '文笔干巴巴 · 人物像纸片',
        accent: '#F87171',
        opacity: leftOpacity,
      }}
      right={{
        title: '你想要的',
        body: (
          <div style={{
            ...slideInFromRight(15),
            display: 'flex', flexDirection: 'column', gap: 24, width: '100%',
          }}>
            {richItems.map((item, i) => (
              <div key={i} style={{
                fontSize: 32, color: theme.accentAlt, fontWeight: 600, fontFamily: FONT_FAMILY,
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <div style={{
                  width: 12, height: 12, borderRadius: 6,
                  background: theme.accentAlt,
                }} />
                {item}
              </div>
            ))}
          </div>
        ),
        caption: '有血有肉 · 引人入胜',
        accent: theme.accentAlt,
        opacity: rightOpacity,
      }}
      footer={
        <div style={{
          fontSize: 32, fontWeight: 700, color: theme.accent,
          textAlign: 'center', fontFamily: FONT_FAMILY,
        }}>
          问题不在AI，在你缺一套系统方法
        </div>
      }
    />
  )
}
