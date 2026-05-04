import React from 'react'
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion'
import { TwoColumnCompare } from '../../../components'
import { SubtitleSegment } from '../composition'

interface Shot3Props {
  subtitleSegments?: SubtitleSegment[]
  videoOffset?: number
}

const HighlightedText = ({ text, color, delay, fps }: { text: string; color: string; delay: number; fps: number }) => {
  const frame = useCurrentFrame()
  const highlightProgress = spring({ frame, fps, config: { damping: 200 }, delay })
  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      <span
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '50%',
          height: '1.1em',
          transform: `translateY(-50%) scaleX(${highlightProgress})`,
          transformOrigin: 'left center',
          backgroundColor: color,
          borderRadius: '0.15em',
          opacity: 0.3,
        }}
      />
      <span style={{ position: 'relative', zIndex: 1 }}>{text}</span>
    </span>
  )
}

export const Shot3: React.FC<Shot3Props> = ({ subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const leftOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' })
  const rightOpacity = interpolate(frame, [15, 35], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <TwoColumnCompare
      background="linear-gradient(180deg, #0f172a 0%, #1e293b 100%)"
      direction="vertical"
      gap={24}
      left={{
        title: 'GPT Image 1',
        body: (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 36, color: '#fca5a5', marginBottom: 16, letterSpacing: 4 }}>
              文字基本是乱码
            </div>
            <div
              style={{
                fontSize: 28,
                color: '#ef4444',
                opacity: 0.6,
                fontFamily: 'monospace',
                letterSpacing: 2,
                lineHeight: 1.8,
              }}
            >
              Hlelo Wrold
              <br />
              你好世畍
              <br />
              OpenAAI
            </div>
          </div>
        ),
        caption: '准确率极低',
        accent: '#ef4444',
        opacity: leftOpacity,
      }}
      right={{
        title: 'GPT Image 2',
        body: (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 36, color: '#86efac', marginBottom: 16, letterSpacing: 2 }}>
              文字清晰准确
            </div>
            <div
              style={{
                fontSize: 28,
                color: '#22c55e',
                lineHeight: 1.8,
                letterSpacing: 1,
              }}
            >
              Hello World
              <br />
              你好世界
              <br />
              OpenAI
            </div>
          </div>
        ),
        caption: '可用于商业场景',
        accent: '#22c55e',
        opacity: rightOpacity,
      }}
      header={
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 52, fontWeight: 900, color: '#ffffff' }}>
            <HighlightedText text="文本渲染" color="#60a5fa" delay={5} fps={fps} />{' '}
            <span style={{ color: '#60a5fa' }}>~99%</span>
          </div>
        </div>
      }
      footer={
        <div style={{ display: 'flex', gap: 16, opacity: rightOpacity }}>
          {['广告语', 'UI 标签', '海报文案'].map((tag) => (
            <div
              key={tag}
              style={{
                fontSize: 26,
                fontWeight: 600,
                color: '#60a5fa',
                backgroundColor: 'rgba(96,165,250,0.15)',
                border: '1px solid rgba(96,165,250,0.3)',
                borderRadius: 12,
                padding: '8px 20px',
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      }
      subtitleSegments={subtitleSegments}
      videoOffset={videoOffset}
    />
  )
}
