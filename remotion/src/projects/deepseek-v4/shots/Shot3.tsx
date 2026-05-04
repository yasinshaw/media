import React from 'react'
import { useCurrentFrame, spring } from 'remotion'
import { HubLayout, useStagger } from '../../../components'

interface SubtitleSegment { text: string; start: number; end: number; duration: number }
interface Shot3Props { subtitleSegments?: SubtitleSegment[]; videoOffset?: number }

export const Shot3: React.FC<Shot3Props> = ({ subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()

  const centerScale = spring({ frame, fps: 30, config: { damping: 10, stiffness: 80 } })
  const nodeStagger = useStagger(frame, 4, 12, 15)

  const Circle = ({ size, color, children }: { size: number; color: string; children: React.ReactNode }) => (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: `0 20px 50px ${color}40`,
        padding: 20,
        textAlign: 'center',
      }}
    >
      <span style={{ fontSize: size / 5, fontWeight: 700, color: '#fff' }}>{children}</span>
    </div>
  )

  return (
    <HubLayout
      background="linear-gradient(135deg, #0c4a6e 0%, #075985 100%)"
      center={{
        node: (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 64, fontWeight: 900, color: '#fbbf24', marginBottom: 8 }}>1.6万亿</div>
            <div style={{ fontSize: 40, fontWeight: 700, color: '#fff' }}>参数</div>
          </div>
        ),
        scale: centerScale,
      }}
      surrounding={[
        {
          position: 'top-left',
          node: <Circle size={160} color="#3b82f6">MoE架构</Circle>,
          opacity: nodeStagger[0].style.opacity as number,
        },
        {
          position: 'top-right',
          node: (
            <div style={{ textAlign: 'center' }}>
              <Circle size={140} color="#10b981">49B</Circle>
              <div style={{ fontSize: 24, color: '#94a3b8', marginTop: 8 }}>激活参数</div>
            </div>
          ),
          opacity: nodeStagger[1].style.opacity as number,
        },
        {
          position: 'bottom-left',
          node: (
            <div style={{ textAlign: 'center' }}>
              <Circle size={140} color="#8b5cf6">100万</Circle>
              <div style={{ fontSize: 24, color: '#94a3b8', marginTop: 8 }}>token上下文</div>
            </div>
          ),
          opacity: nodeStagger[2].style.opacity as number,
        },
        {
          position: 'bottom-right',
          node: <Circle size={140} color="#f43f5e">开源</Circle>,
          opacity: nodeStagger[3].style.opacity as number,
        },
      ]}
      radius={320}
      connectionColor="#64748b"
      connectionsOpacity={nodeStagger[3].style.opacity as number}
      subtitleSegments={subtitleSegments}
      videoOffset={videoOffset}
    />
  )
}
