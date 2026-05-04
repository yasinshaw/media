import React from 'react'
import { useCurrentFrame } from 'remotion'
import { TimelineFlow, useStagger, useFadeIn } from '../../../components'

interface SubtitleSegment {
  text: string
  start: number
  end: number
  duration: number
}

interface Shot5Props {
  subtitleSegments?: SubtitleSegment[]
  videoOffset?: number
}

export const Shot5: React.FC<Shot5Props> = ({ subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()

  const stagger = useStagger(frame, 3, 15, 15)
  const footer = useFadeIn(frame, 130, 20)

  const [item1Opacity, item2Opacity, item3Opacity] = stagger.map(
    (s) => s.style.opacity as number,
  )
  const footerOpacity = footer.style.opacity as number

  return (
    <TimelineFlow
      direction="vertical"
      background="linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
      accent="#22c55e"
      showConnectors={true}
      header={
        <div
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: '#fff',
            textAlign: 'center',
          }}
        >
          国际擂台
        </div>
      }
      items={[
        {
          label: 'BrowseComp 83.4%',
          detail: '超 Claude Opus 4.7 (79.3%)',
          icon: '🌐',
          color: '#22c55e',
          opacity: item1Opacity,
        },
        {
          label: 'SWE-Bench 55.4%',
          detail: '接近 GPT-5.5 (58.6%)',
          icon: '📊',
          color: '#fbbf24',
          opacity: item2Opacity,
        },
        {
          label: '数学推理',
          detail: '超越 GPT-5',
          icon: '🧮',
          color: '#22c55e',
          opacity: item3Opacity,
        },
      ]}
      footer={
        <div
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: '#22c55e',
            textAlign: 'center',
            opacity: footerOpacity,
          }}
        >
          搜索 + 数学 = 世界第一梯队
        </div>
      }
      subtitleSegments={subtitleSegments}
      videoOffset={videoOffset}
    />
  )
}
