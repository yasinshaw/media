import React from 'react'
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion'
import { ProgressiveSubtitle } from '../../../components/ProgressiveSubtitle'

interface Shot5Props {
  subtitleSegments?: Array<{text: string, start: number, end: number, duration: number}>
  videoOffset?: number
}

export const Shot5: React.FC<Shot5Props> = ({ subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()

  // Split view animations
  const leftOpacity = interpolate(frame, [20, 40], [0, 1], { extrapolateRight: 'clamp' })
  const rightOpacity = interpolate(frame, [30, 50], [0, 1], { extrapolateRight: 'clamp' })

  // Connection lines animation
  const lineOpacity = interpolate(frame, [100, 130], [0, 1], { extrapolateRight: 'clamp' })

  // Bottom note
  const noteOpacity = interpolate(frame, [200, 230], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
      flexDirection: 'column',
      padding: '120px 40px 200px',
    }}>
      {/* Comparison Container */}
      <div style={{
        flex: 1,
        display: 'flex',
        gap: 40,
      }}>
        {/* Left Panel - Subagent */}
        <div style={{
          flex: 1,
          background: 'rgba(239, 68, 68, 0.1)',
          border: '3px solid #ef4444',
          borderRadius: 20,
          padding: 40,
          display: 'flex',
          flexDirection: 'column',
          opacity: leftOpacity,
        }}>
          {/* Title */}
          <div style={{
            fontSize: 48,
            fontWeight: 800,
            color: '#ef4444',
            marginBottom: 40,
            textAlign: 'center',
          }}>
            子Agent
          </div>

          {/* Diagram */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 30,
          }}>
            {/* Main Agent */}
            <div style={{
              width: 140,
              height: 140,
              borderRadius: 70,
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: 32,
              fontWeight: 700,
              color: '#fff',
            }}>
              主Agent
            </div>

            {/* Arrow */}
            <div style={{
              fontSize: 48,
              color: '#f87171',
            }}>
              ↓
            </div>

            {/* Sub Agent */}
            <div style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              background: 'rgba(239, 68, 68, 0.3)',
              border: '3px solid #ef4444',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: 28,
              fontWeight: 600,
              color: '#fecaca',
            }}>
              子Agent
            </div>
          </div>

          {/* Label */}
          <div style={{
            marginTop: 30,
            fontSize: 32,
            fontWeight: 600,
            color: '#fca5a5',
            textAlign: 'center',
          }}>
            只汇报结果
          </div>
        </div>

        {/* Right Panel - Agent Teams */}
        <div style={{
          flex: 1,
          background: 'rgba(34, 197, 94, 0.1)',
          border: '3px solid #22c55e',
          borderRadius: 20,
          padding: 40,
          display: 'flex',
          flexDirection: 'column',
          opacity: rightOpacity,
        }}>
          {/* Title */}
          <div style={{
            fontSize: 48,
            fontWeight: 800,
            color: '#22c55e',
            marginBottom: 40,
            textAlign: 'center',
          }}>
            Agent Teams
          </div>

          {/* Diagram */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 20,
            position: 'relative',
          }}>
            {/* Main Agent */}
            <div style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: 28,
              fontWeight: 700,
              color: '#fff',
              position: 'relative',
              zIndex: 1,
            }}>
              队长
              {/* Connection lines from captain to outer teammates */}
              {lineOpacity > 0 && (
                <svg style={{
                  position: 'absolute',
                  width: '310px',
                  height: '140px',
                  left: '50%',
                  top: '0',
                  transform: 'translate(-50%, 0)',
                  zIndex: -1,
                  pointerEvents: 'none',
                  overflow: 'visible',
                }}>
                  {/* SVG coordinate system:
                      - Width 310px matches teammates row width (90+20+90+20+90)
                      - Origin (0,0) is at captain's top-left
                      - Captain center: (155, 60)
                      - Left teammate center: (45, 130) = (45, 60+20+45)
                      - Right teammate center: (265, 130) = (265, 60+20+45)
                  */}
                  <line
                    x1="155"
                    y1="60"
                    x2="45"
                    y2="130"
                    stroke="#86efac"
                    strokeWidth="3"
                    strokeDasharray="8 4"
                    opacity={lineOpacity}
                  />
                  <line
                    x1="155"
                    y1="60"
                    x2="265"
                    y2="130"
                    stroke="#86efac"
                    strokeWidth="3"
                    strokeDasharray="8 4"
                    opacity={lineOpacity}
                  />
                </svg>
              )}
            </div>

            {/* Teammates Row */}
            <div style={{
              display: 'flex',
              gap: 20,
              zIndex: 1,
            }}>
              {[
                { label: '队友1', delay: 0 },
                { label: '队友2', delay: 10 },
                { label: '队友3', delay: 20 },
              ].map((item, i) => {
                const itemOpacity = interpolate(
                  frame,
                  [140 + item.delay, 160 + item.delay],
                  [0, 1],
                  { extrapolateRight: 'clamp' }
                )
                return (
                  <div key={i} style={{
                    width: 90,
                    height: 90,
                    borderRadius: 45,
                    background: 'rgba(34, 197, 94, 0.3)',
                    border: '3px solid #22c55e',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: 24,
                    fontWeight: 600,
                    color: '#bbf7d0',
                    opacity: itemOpacity,
                  }}>
                    {item.label}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Label */}
          <div style={{
            marginTop: 30,
            fontSize: 32,
            fontWeight: 600,
            color: '#86efac',
            textAlign: 'center',
          }}>
            队友间直接交流
          </div>
        </div>
      </div>

      {/* Bottom note */}
      {noteOpacity > 0 && (
        <div style={{
          padding: '20px 40px',
          background: 'rgba(251, 191, 36, 0.15)',
          border: '2px solid #f59e0b',
          borderRadius: 12,
          fontSize: 32,
          fontWeight: 600,
          color: '#fbbf24',
          textAlign: 'center',
          marginTop: 40,
          opacity: noteOpacity,
        }}>
          Token 成本更高，但协作更灵活
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
