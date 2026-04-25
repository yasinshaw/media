import React from 'react'
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion'
import { ProgressiveSubtitle } from '../../../components/ProgressiveSubtitle'

interface Shot4Props {
  subtitleSegments?: Array<{text: string, start: number, end: number, duration: number}>
  videoOffset?: number
}

export const Shot4: React.FC<Shot4Props> = ({ subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()

  const fadeIn = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' })

  // Command line animations
  const cmd1Opacity = interpolate(frame, [15, 30], [0, 1], { extrapolateRight: 'clamp' })
  const cmd2Opacity = interpolate(frame, [45, 60], [0, 1], { extrapolateRight: 'clamp' })
  const cmd3Opacity = interpolate(frame, [75, 90], [0, 1], { extrapolateRight: 'clamp' })

  // tmux panels fade in
  const tmuxOpacity = interpolate(frame, [100, 120], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '120px 40px 200px',
    }}>
      {/* Terminal Window */}
      <div style={{
        width: '100%',
        maxWidth: 900,
        background: '#0d1117',
        borderRadius: 16,
        overflow: 'hidden',
        opacity: fadeIn,
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
      }}>
        {/* Terminal Header */}
        <div style={{
          background: '#21262d',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          <div style={{ width: 16, height: 16, borderRadius: 8, background: '#ff5f57' }} />
          <div style={{ width: 16, height: 16, borderRadius: 8, background: '#ffbd2e' }} />
          <div style={{ width: 16, height: 16, borderRadius: 8, background: '#28c840' }} />
          <span style={{ fontSize: 24, color: '#8b949e', marginLeft: 20 }}>Terminal</span>
        </div>

        {/* Terminal Content */}
        <div style={{
          padding: '32px',
          fontFamily: 'monospace',
          fontSize: 28,
        }}>
          {/* Command 1 */}
          <div style={{
            opacity: cmd1Opacity,
            marginBottom: 20,
          }}>
            <span style={{ color: '#58a6ff' }}>$</span>
            <span style={{ color: '#e6edf3', marginLeft: 12 }}>brew install tmux</span>
          </div>

          {/* Command 2 */}
          <div style={{
            opacity: cmd2Opacity,
            marginBottom: 20,
          }}>
            <span style={{ color: '#58a6ff' }}>$</span>
            <span style={{ color: '#e6edf3', marginLeft: 12 }}>export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1</span>
          </div>

          {/* Command 3 - Result */}
          <div style={{
            opacity: cmd3Opacity,
            marginBottom: 20,
          }}>
            <span style={{ color: '#58a6ff' }}>$</span>
            <span style={{ color: '#e6edf3', marginLeft: 12 }}>claude agent-teams start</span>
          </div>

          {/* Success message */}
          {tmuxOpacity > 0 && (
            <div style={{
              opacity: tmuxOpacity,
              padding: 20,
              background: 'rgba(35, 134, 54, 0.2)',
              borderRadius: 8,
              border: '2px solid #238636',
              marginTop: 20,
            }}>
              <div style={{ color: '#3fb950', fontSize: 24, marginBottom: 12 }}>✓ 3 个 Agent 就绪</div>
              <div style={{ color: '#8b949e', fontSize: 20 }}>前端 / 后端 / 测试</div>
            </div>
          )}
        </div>
      </div>

      {/* tmux panel preview */}
      {tmuxOpacity > 0 && (
        <div style={{
          marginTop: 40,
          display: 'flex',
          gap: 16,
          opacity: tmuxOpacity,
        }}>
          {[
            { label: '前端', color: '#3b82f6' },
            { label: '后端', color: '#10b981' },
            { label: '测试', color: '#f59e0b' },
          ].map((panel, i) => (
            <div key={i} style={{
              width: 120,
              height: 80,
              background: panel.color,
              borderRadius: 8,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: 24,
              fontWeight: 700,
              color: '#fff',
            }}>
              {panel.label}
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
