import React from 'react'
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion'
import { HubLayout, useStagger, usePulse, type SubtitleSegment } from '../../../components'

interface Shot3Props {
  subtitleSegments?: SubtitleSegment[]
  videoOffset?: number
}

const FONT = 'Noto Sans SC, sans-serif'

const AGENT_NODES = [
  { name: 'Claude', position: 'top' as const, color: '#D97706' },
  { name: 'Cursor', position: 'top-right' as const, color: '#3B82F6' },
  { name: 'Gemini', position: 'right' as const, color: '#8B5CF6' },
  { name: 'Codex', position: 'bottom-right' as const, color: '#10B981' },
  { name: 'Trae', position: 'bottom' as const, color: '#F59E0B' },
  { name: 'Windsurf', position: 'bottom-left' as const, color: '#06B6D4' },
  { name: 'Amp', position: 'left' as const, color: '#EC4899' },
  { name: 'Kiro', position: 'top-left' as const, color: '#F43F5E' },
]

export const Shot3: React.FC<Shot3Props> = ({ subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Center node pulse
  const pulse = usePulse(frame, 1, 1.04, 0.06)

  // Center node entry
  const centerProgress = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 80 },
  })
  const centerScale = interpolate(centerProgress, [0, 1], [0.6, 1], { extrapolateRight: 'clamp' })
  const centerOpacity = interpolate(centerProgress, [0, 0.5], [0, 1], { extrapolateRight: 'clamp' })

  // Surrounding nodes stagger (8 items, 8 frames apart)
  const nodeStagger = useStagger(frame, 8, 8, 12)

  // Connection lines opacity follows the last node
  const connectionsOpacity = interpolate(
    frame,
    [8 * 8, 8 * 8 + 12],
    [0, 0.6],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  // Footer text fadeSlideUp
  const footerDelay = 8 * 8 + 20
  const footerProgress = interpolate(
    frame,
    [footerDelay, footerDelay + 18],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  const footerTranslateY = interpolate(footerProgress, [0, 1], [30, 0], {
    extrapolateRight: 'clamp',
  })
  const footerOpacity = interpolate(footerProgress, [0, 1], [0, 1], {
    extrapolateRight: 'clamp',
  })

  const AgentNode = ({ name, color }: { name: string; color: string }) => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <div
        style={{
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${color}, ${color}aa)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 8px 30px ${color}30`,
        }}
      >
        <span style={{ fontSize: 28, fontWeight: 700, color: '#F8FAFC', fontFamily: FONT }}>
          {name}
        </span>
      </div>
    </div>
  )

  return (
    <HubLayout
      background="linear-gradient(135deg, #0F172A, #1E293B)"
      center={{
        node: (
          <div
            style={{
              padding: '28px 36px',
              borderRadius: 20,
              background: 'rgba(255, 255, 255, 0.08)',
              border: '2px solid rgba(167, 139, 250, 0.3)',
              backdropFilter: 'blur(10px)',
              textAlign: 'center',
              boxShadow: '0 0 40px rgba(167, 139, 250, 0.15)',
              ...pulse.style,
            }}
          >
            <div
              style={{
                fontSize: 26,
                fontWeight: 700,
                color: '#A78BFA',
                fontFamily: FONT,
                marginBottom: 6,
              }}
            >
              中央仓库
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 500,
                color: '#38BDF8',
                fontFamily: 'monospace',
                letterSpacing: 1,
              }}
            >
              ~/.agents/skills/
            </div>
          </div>
        ),
        scale: centerScale * 1.04,
        opacity: centerOpacity,
      }}
      surrounding={AGENT_NODES.map((agent, i) => ({
        position: agent.position,
        node: <AgentNode name={agent.name} color={agent.color} />,
        opacity: nodeStagger[i].style.opacity as number,
      }))}
      radius={340}
      showConnections
      connectionColor="rgba(167, 139, 250, 0.4)"
      connectionWidth={3}
      connectionDashed
      connectionsOpacity={connectionsOpacity}
      footer={
        <div
          style={{
            opacity: footerOpacity,
            transform: `translateY(${footerTranslateY}px)`,
          }}
        >
          <span
            style={{
              fontSize: 38,
              fontWeight: 700,
              color: '#F8FAFC',
              fontFamily: FONT,
              textShadow: '0 0 20px rgba(167, 139, 250, 0.3)',
            }}
          >
            改一处，全部生效
          </span>
        </div>
      }
      subtitleSegments={subtitleSegments}
      videoOffset={videoOffset}
    />
  )
}
