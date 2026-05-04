import React from 'react'
import { useCurrentFrame } from 'remotion'
import { TimelineFlow, useStagger, useFadeIn, GradientFlow } from '../../../components'

interface SubtitleSegment {
  text: string
  start: number
  end: number
  duration: number
}

interface Shot4Props {
  subtitleSegments?: SubtitleSegment[]
  videoOffset?: number
}

export const Shot4: React.FC<Shot4Props> = ({ subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()

  const stagger = useStagger(frame, 3, 12, 15)
  const footer = useFadeIn(frame, 140, 20)

  const [item1Opacity, item2Opacity, item3Opacity] = stagger.map(
    (s) => s.style.opacity as number,
  )
  const footerOpacity = footer.style.opacity as number

  return (
    <TimelineFlow
      direction="vertical"
      background="linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)"
      accent="#fbbf24"
      showConnectors={false}
      backgroundLayer={<GradientFlow colors={['#1e1b4b', '#312e81', '#1e1b4b']} duration={200} />}
      header={
        <div
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: '#fbbf24',
            textAlign: 'center',
          }}
        >
          国内大模型跑分擂台
        </div>
      }
      items={[
        {
          label: 'SWE-Bench',
          detail: 'Kimi K2.5 76.8% 🏆 | V4 55.4%',
          icon: '📊',
          opacity: item1Opacity,
        },
        {
          label: 'HumanEval',
          detail: 'V4 76.8% vs V3.2 62.8%',
          icon: '💻',
          opacity: item2Opacity,
        },
        {
          label: '数学推理',
          detail: 'V4 领先国产对手',
          icon: '🧮',
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
            padding: 24,
            background: 'rgba(34, 197, 94, 0.1)',
            borderRadius: 16,
          }}
        >
          ✅ V4 = 最大开源 + 最便宜 + 数学领先
        </div>
      }
      subtitleSegments={subtitleSegments}
      videoOffset={videoOffset}
    />
  )
}
