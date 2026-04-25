import React from 'react'
import { AbsoluteFill, useCurrentFrame, interpolate, spring } from 'remotion'
import { ProgressiveSubtitle } from '../../../components/ProgressiveSubtitle'

interface Shot6Props {
  subtitleSegments?: Array<{text: string, start: number, end: number, duration: number}>
  videoOffset?: number
}

export const Shot6: React.FC<Shot6Props> = ({ subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()
  const fps = 30

  const fadeIn = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' })

  // Central title animation
  const titleScale = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 80 },
  })

  // Framework logos/names appear in sequence
  const frameworks = [
    { name: 'LangGraph', color: '#8b5cf6', delay: 30 },
    { name: 'AutoGen', color: '#3b82f6', delay: 70 },
    { name: 'CrewAI', color: '#10b981', delay: 110 },
    { name: 'Claude Agent Teams', color: '#f59e0b', delay: 150 },
  ]

  // Connection lines fade in
  const connectionsOpacity = interpolate(frame, [180, 210], [0, 1], { extrapolateRight: 'clamp' })

  // Bottom process text
  const processOpacity = interpolate(frame, [220, 250], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '120px 40px 200px',
    }}>
      {/* Central Title */}
      <div style={{
        fontSize: 64,
        fontWeight: 900,
        background: 'linear-gradient(135deg, #f472b6 0%, #a855f7 50%, #6366f1 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        marginBottom: 80,
        transform: `scale(${0.8 + titleScale * 0.2})`,
        opacity: fadeIn,
      }}>
        多智能体协作
      </div>

      {/* Framework Orbit */}
      <div style={{ position: 'relative', width: 600, height: 600 }}>
        {/* Center glow */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 200,
          height: 200,
          borderRadius: 100,
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, transparent 70%)',
        }} />

        {/* Framework nodes in circular arrangement */}
        {frameworks.map((fw, i) => {
          const angle = (i * 90 - 45) * (Math.PI / 180)
          const radius = 220
          // Calculate center position for each card
          const centerX = 300 + Math.cos(angle) * radius
          const centerY = 300 + Math.sin(angle) * radius

          const nodeOpacity = interpolate(
            frame,
            [fw.delay, fw.delay + 25],
            [0, 1],
            { extrapolateRight: 'clamp' }
          )

          const nodeScale = spring({
            frame: Math.max(0, frame - fw.delay),
            fps,
            config: { damping: 12, stiffness: 80 },
          })

          return (
            <div key={i} style={{
              position: 'absolute',
              left: centerX,
              top: centerY,
              transform: `translate(-50%, -50%) scale(${0.7 + nodeScale * 0.3})`,
              padding: '20px 30px',
              background: `${fw.color}20`,
              border: `3px solid ${fw.color}`,
              borderRadius: 16,
              fontSize: 28,
              fontWeight: 700,
              color: fw.color,
              opacity: nodeOpacity,
            }}>
              {fw.name}
            </div>
          )
        })}

        {/* Connection lines */}
        {connectionsOpacity > 0 && (
          <svg style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            opacity: connectionsOpacity,
          }}>
            {frameworks.map((fw, i) => {
              const angle = (i * 90 - 45) * (Math.PI / 180)
              const radius = 220
              const x2 = 300 + Math.cos(angle) * radius
              const y2 = 300 + Math.sin(angle) * radius
              return (
                <line
                  key={i}
                  x1="300"
                  y1="300"
                  x2={x2}
                  y2={y2}
                  stroke={fw.color}
                  strokeWidth="3"
                  strokeDasharray="8,8"
                  opacity="0.5"
                />
              )
            })}
          </svg>
        )}
      </div>

      {/* Process Flow */}
      {processOpacity > 0 && (
        <div style={{
          display: 'flex',
          gap: 24,
          marginTop: 60,
          opacity: processOpacity,
        }}>
          {[
            { text: '分工', color: '#8b5cf6' },
            { text: '协调', color: '#3b82f6' },
            { text: '执行', color: '#10b981' },
          ].map((step, i) => (
            <div key={i} style={{
              padding: '16px 32px',
              background: `${step.color}20`,
              border: `2px solid ${step.color}`,
              borderRadius: 12,
              fontSize: 32,
              fontWeight: 700,
              color: step.color,
            }}>
              {step.text}
            </div>
          ))}
        </div>
      )}

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
