import React from 'react'
import { AbsoluteFill } from 'remotion'
import { ProgressiveSubtitle } from '../../../components'

interface SubtitleSegment {
  text: string
  start: number
  end: number
  duration: number
}

interface ShotProps {
  subtitleSegments?: SubtitleSegment[]
  videoOffset?: number
}

export const Shot1: React.FC<ShotProps> = ({ subtitleSegments, videoOffset }) => {
  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(135deg, #1e3a5f 0%, #0f2744 100%)',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '120px 40px 200px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '900px',
        display: 'flex',
        flexDirection: 'column',
        gap: '48px',
        alignItems: 'center'
      }}>
        <div style={{
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'linear-gradient(180deg, #4a90d9 0%, #2563eb 100%)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0 20px 60px rgba(37, 99, 235, 0.4)'
        }}>
          <div style={{
            width: '450px',
            height: '450px',
            borderRadius: '50%',
            background: '#1e3a5f',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '140px',
            fontWeight: 900,
            color: '#ffffff'
          }}>
            5.5
          </div>
        </div>

        <div style={{
          fontSize: '56px',
          fontWeight: 800,
          color: '#ffffff',
          textAlign: 'center',
          textShadow: '0 4px 20px rgba(0,0,0,0.5)'
        }}>
          GPT-5.5 发布
        </div>
      </div>

      {subtitleSegments && (
        <ProgressiveSubtitle
          segments={subtitleSegments}
          videoOffset={videoOffset || 0}
        />
      )}
    </AbsoluteFill>
  )
}
