import React from 'react'
import { AbsoluteFill, useCurrentFrame, interpolate, spring } from 'remotion'
import { ProgressiveSubtitle } from '../../../components/ProgressiveSubtitle'

interface Shot3Props {
  subtitleSegments?: Array<{text: string, start: number, end: number, duration: number}>
  videoOffset?: number
}

export const Shot3: React.FC<Shot3Props> = ({ subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()
  const fps = 30

  // Fade in
  const fadeIn = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' })

  // Node animations
  const centerNodeScale = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 90 },
  })

  const teammateDelay = 30
  const teammateScale = spring({
    frame: Math.max(0, frame - teammateDelay),
    fps,
    config: { damping: 12, stiffness: 80 },
  })

  // Connection lines fade in
  const connectionOpacity = interpolate(frame, [teammateDelay + 20, teammateDelay + 40], [0, 1], { extrapolateRight: 'clamp' })

  // Feature labels pop in
  const feature1Opacity = interpolate(frame, [80, 100], [0, 1], { extrapolateRight: 'clamp' })
  const feature2Opacity = interpolate(frame, [100, 120], [0, 1], { extrapolateRight: 'clamp' })
  const feature3Opacity = interpolate(frame, [120, 140], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(135deg, #0c4a6e 0%, #075985 100%)',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '120px 40px 200px',
    }}>
      {/* Center Captain Node */}
      <div style={{
        width: 200,
        height: 200,
        borderRadius: 100,
        background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 48,
        fontWeight: 800,
        color: '#fff',
        transform: `scale(${0.5 + centerNodeScale * 0.5})`,
        opacity: fadeIn,
        zIndex: 10,
      }}>
        队长
      </div>

      {/* Connection Lines */}
      {connectionOpacity > 0 && (
        <svg style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          opacity: connectionOpacity,
        }}>
          {/* Lines from center (540,920) to teammate centers */}
          <line x1="540" y1="920" x2="232" y2="358" stroke="#64748b" strokeWidth="4" strokeDasharray="8,8" />
          <line x1="540" y1="920" x2="848" y2="358" stroke="#64748b" strokeWidth="4" strokeDasharray="8,8" />
          <line x1="540" y1="920" x2="232" y2="986" stroke="#64748b" strokeWidth="4" strokeDasharray="8,8" />
          <line x1="540" y1="920" x2="848" y2="986" stroke="#64748b" strokeWidth="4" strokeDasharray="8,8" />
        </svg>
      )}

      {/* Teammate Nodes */}
      {[
        { top: '15%', left: '15%' },
        { top: '15%', right: '15%' },
        { bottom: '45%', left: '15%' },
        { bottom: '45%', right: '15%' },
      ].map((pos, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: 140,
          height: 140,
          borderRadius: 70,
          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: 36,
          fontWeight: 700,
          color: '#fff',
          transform: `scale(${teammateScale})`,
          zIndex: 10,
          ...pos,
        }}>
          队友{i + 1}
        </div>
      ))}

      {/* Feature Labels */}
      <div style={{
        position: 'absolute',
        right: 60,
        top: '30%',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}>
        {[
          { text: '共享任务列表', opacity: feature1Opacity },
          { text: '自主协调', opacity: feature2Opacity },
          { text: '直接对话', opacity: feature3Opacity },
        ].map((feature, i) => (
          <div key={i} style={{
            padding: '16px 24px',
            background: 'rgba(59, 130, 246, 0.2)',
            border: '2px solid #3b82f6',
            borderRadius: 12,
            fontSize: 28,
            fontWeight: 600,
            color: '#fff',
            opacity: feature.opacity,
          }}>
            {feature.text}
          </div>
        ))}
      </div>

      {/* Bottom comparison */}
      <div style={{
        position: 'absolute',
        bottom: 240,
        fontSize: 28,
        color: '#94a3b8',
        opacity: fadeIn,
      }}>
        Subagent: 单向汇报
      </div>

      {/* Progressive Subtitle */}
      {subtitleSegments && videoOffset !== undefined && (
        <ProgressiveSubtitle
          segments={subtitleSegments}
          videoOffset={videoOffset}
        />
      )}
    </AbsoluteFill>
  )
}
