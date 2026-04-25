import { AbsoluteFill, useCurrentFrame, spring, interpolate } from 'remotion'
import React from 'react'
import { Subtitle } from '../../../components/Subtitle'

interface ShotProps {
  subtitle?: string
}

export const Shot6: React.FC<ShotProps> = ({ subtitle }) => {
  const frame = useCurrentFrame()

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '120px 40px 200px',
      }}
    >
      <div
        style={{
          fontSize: '40px',
          fontWeight: 'bold',
          color: '#fbbf24',
          textAlign: 'center',
          marginBottom: '35px',
          opacity: Math.min(1, frame / 15),
        }}
      >
        但 GPT-5.5 并非无敌
      </div>

      <div
        style={{
          fontSize: '22px',
          color: '#94a3b8',
          marginBottom: '25px',
          opacity: Math.min(1, Math.max(0, (frame - 10) / 15)),
        }}
      >
        BrowseComp 网页浏览测试
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          width: '100%',
          maxWidth: '480px',
        }}
      >
        <div
          style={{
            background: 'rgba(34, 197, 94, 0.15)',
            border: '3px solid #22c55e',
            borderRadius: '16px',
            padding: '20px 28px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            transform: `scale(${spring({
              frame: frame - 20,
              fps: 30,
              config: { damping: 10, stiffness: 100 },
            })})`,
            opacity: interpolate(frame - 20, [0, 15], [0, 1], {
              extrapolateRight: 'clamp',
            }),
            boxShadow: '0 0 20px rgba(34, 197, 94, 0.3)',
          }}
        >
          <div>
            <div
              style={{ fontSize: '14px', color: '#86efac', marginBottom: '4px' }}
            >
              👑 冠军
            </div>
            <div
              style={{ fontSize: '26px', color: 'white', fontWeight: 'bold' }}
            >
              Gemini 3.1 Pro
            </div>
          </div>
          <div style={{ fontSize: '44px', fontWeight: '900', color: '#22c55e' }}>
            85.9%
          </div>
        </div>

        <div
          style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '2px solid #3b82f6',
            borderRadius: '16px',
            padding: '20px 28px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            transform: `scale(${spring({
              frame: frame - 50,
              fps: 30,
              config: { damping: 10, stiffness: 100 },
            })})`,
            opacity: interpolate(frame - 50, [0, 15], [0, 1], {
              extrapolateRight: 'clamp',
            }),
          }}
        >
          <div>
            <div
              style={{ fontSize: '14px', color: '#93c5fd', marginBottom: '4px' }}
            >
              第二名
            </div>
            <div
              style={{ fontSize: '26px', color: 'white', fontWeight: 'bold' }}
            >
              GPT-5.5
            </div>
          </div>
          <div style={{ fontSize: '44px', fontWeight: '900', color: '#60a5fa' }}>
            84.4%
          </div>
        </div>
      </div>

      <div
        style={{
          fontSize: '26px',
          color: '#fbbf24',
          fontWeight: 'bold',
          marginTop: '35px',
          textAlign: 'center',
          opacity: interpolate(frame - 100, [0, 20], [0, 1], {
            extrapolateRight: 'clamp',
          }),
        }}
      >
        选 AI 工具，别只看综合分
      </div>

      {subtitle && <Subtitle text={subtitle} />}
    </AbsoluteFill>
  )
}
