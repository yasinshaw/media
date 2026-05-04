import React from 'react'
import { useCurrentFrame, interpolate } from 'remotion'
import { TwoColumnCompare } from '../../../components'

interface ShotProps {
  subtitleSegments?: Array<{ text: string; start: number; end: number; duration: number }>
  videoOffset?: number
}

const ScatteredNodes: React.FC = () => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center', padding: 20 }}>
    {[1, 2, 3, 4, 5].map((i) => (
      <div
        key={i}
        style={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: '#6b7280',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
          color: '#fff',
        }}
      >
        AI{i}
      </div>
    ))}
  </div>
)

const HierarchicalNodes: React.FC = () => (
  <div
    style={{
      position: 'relative',
      width: '100%',
      height: 320,
    }}
  >
    {/* Connection lines SVG - overlays content */}
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {/* Manager at 15% top (40px), size 80px → center y = 80px */}
      {/* Workers at 70% top (224px), size 60px → top y = 224px */}
      <line x1="50%" y1="80" x2="20%" y2="224" stroke="#f59e0b" strokeWidth="3" />
      <line x1="50%" y1="80" x2="50%" y2="224" stroke="#f59e0b" strokeWidth="3" />
      <line x1="50%" y1="80" x2="80%" y2="224" stroke="#f59e0b" strokeWidth="3" />
    </svg>

    {/* Manager at top center */}
    <div
      style={{
        position: 'absolute',
        top: 40,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 80,
        height: 80,
        borderRadius: '50%',
        background: '#f59e0b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        boxShadow: '0 0 25px rgba(245, 158, 11, 0.6)',
        zIndex: 1,
      }}
    >
      Manager
    </div>

    {/* Workers at bottom - evenly spaced */}
    <div
      style={{
        position: 'absolute',
        top: 224,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'space-around',
        zIndex: 1,
      }}
    >
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: '#3b82f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 14,
          color: '#fff',
        }}
      >
        W1
      </div>
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: '#3b82f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 14,
          color: '#fff',
        }}
      >
        W2
      </div>
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: '#3b82f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 14,
          color: '#fff',
        }}
      >
        W3
      </div>
    </div>

    {/* Labels below workers */}
    <div
      style={{
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'space-around',
        fontSize: 15,
        color: '#fbbf24',
        fontWeight: 'bold',
        zIndex: 1,
      }}
    >
      <span>角色分工</span>
      <span>层级协调</span>
      <span>共享目标</span>
    </div>
  </div>
)

export const Shot2: React.FC<ShotProps> = ({ subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()

  const fadeIn = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <TwoColumnCompare
      background="linear-gradient(135deg, #1e293b, #334155)"
      direction="vertical"
      left={{
        title: 'Multi-Agent',
        body: <ScatteredNodes />,
        caption: '泛指多个 AI 交互',
        accent: '#6b7280',
        opacity: fadeIn,
      }}
      right={{
        title: 'Agent Teams',
        body: <HierarchicalNodes />,
        caption: '像人类团队一样协作',
        accent: '#f59e0b',
        opacity: fadeIn,
      }}
      footer={
        <div style={{ fontSize: 24, color: '#94a3b8', textAlign: 'center' }}>
          Multi-Agent 是 90 年代学术概念 · Agent Teams 强调结构化协作
        </div>
      }
      subtitleSegments={subtitleSegments}
      videoOffset={videoOffset}
    />
  )
}
