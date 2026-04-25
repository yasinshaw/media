import { AbsoluteFill } from 'remotion'
import React from 'react'

interface SplitScreenProps {
  left?: React.ReactNode
  right?: React.ReactNode
  leftLabel?: string
  rightLabel?: string
  children?: React.ReactNode
  vertical?: boolean  // Force vertical layout for mobile
}

export const SplitScreen: React.FC<SplitScreenProps> = ({
  left,
  right,
  leftLabel = 'TOP',
  rightLabel = 'BOTTOM',
  children,
  vertical = true  // Default to vertical for Douyin format
}) => {
  if (vertical) {
    // Vertical split (top/bottom) - mobile-friendly
    return (
      <AbsoluteFill style={{ background: '#1a1a2e', flexDirection: 'column' }}>
        {/* Top Panel */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '50%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '4px solid #1a1a2e',
        }}>
          {left || (
            <div style={{
              fontSize: 48,
              fontWeight: 'bold',
              color: 'white',
              textAlign: 'center',
            }}>{leftLabel}</div>
          )}
        </div>

        {/* Bottom Panel */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '50%',
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {right || (
            <div style={{
              fontSize: 48,
              fontWeight: 'bold',
              color: 'white',
              textAlign: 'center',
            }}>{rightLabel}</div>
          )}
        </div>
        {children}
      </AbsoluteFill>
    )
  }

  // Horizontal split (left/right) - for comparison content
  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      {/* Left Panel */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '50%',
        height: '100%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRight: '4px solid #1a1a2e',
      }}>
        {left || (
          <div style={{
            fontSize: 48,
            fontWeight: 'bold',
            color: 'white',
            textAlign: 'center',
          }}>{leftLabel}</div>
        )}
      </div>

      {/* Right Panel */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '50%',
        height: '100%',
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {right || (
          <div style={{
            fontSize: 48,
            fontWeight: 'bold',
            color: 'white',
            textAlign: 'center',
          }}>{rightLabel}</div>
        )}
      </div>
      {children}
    </AbsoluteFill>
  )
}
