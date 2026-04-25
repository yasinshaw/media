import { useCurrentFrame, interpolate } from 'remotion'
import React from 'react'
import { SafeArea } from './SafeArea'
import { SAFE_AREA } from './constants'

interface ScreenRecordingProps {
  title?: string
  children?: React.ReactNode
}

export const ScreenRecording: React.FC<ScreenRecordingProps> = ({ title = 'Application', children }) => {
  const frame = useCurrentFrame()
  const loadingProgress = interpolate(frame, [0, 30], [0, 100], { extrapolateRight: 'clamp' })

  return (
    <SafeArea style={{
      background: '#1e1e1e',
    }}>
      {/* Window frame */}
      <div style={{
        position: 'absolute',
        top: 140,
        left: 80,
        right: 80,
        bottom: SAFE_AREA.CONTENT_BOTTOM,
        background: '#2d2d2d',
        borderRadius: 16,
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
        overflow: 'hidden',
      }}>
        {/* Title bar */}
        <div style={{
          height: 56,
          background: '#323233',
          borderBottom: '1px solid #1e1e1e',
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
          gap: 10,
        }}>
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#ff5f57' }} />
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#ffbd2e' }} />
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#28c940' }} />
          <span style={{ color: '#999', fontSize: 20, marginLeft: 20 }}>{title}</span>
        </div>

        {/* Content area */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            width: `${loadingProgress}%`,
            height: 6,
            background: 'linear-gradient(90deg, #667eea, #764ba2)',
            borderRadius: 3,
          }} />
        </div>
      </div>
      {children}
    </SafeArea>
  )
}
