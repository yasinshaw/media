import { AbsoluteFill, useCurrentFrame, spring, interpolate } from 'remotion'
import React from 'react'
import { Subtitle } from '../../../components/Subtitle'

interface ShotProps {
  subtitle?: string
}

export const Shot4: React.FC<ShotProps> = ({ subtitle }) => {
  const frame = useCurrentFrame()

  const tools = [
    { name: '写代码', icon: '💻' },
    { name: '做研究', icon: '🔬' },
    { name: '分析数据', icon: '📊' },
    { name: '跨工具协作', icon: '🔗' },
  ]

  const positions = [
    { left: '8%', top: '12%' },
    { right: '8%', top: '12%' },
    { left: '8%', bottom: '12%' },
    { right: '8%', bottom: '12%' },
  ]

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
          fontSize: '42px',
          fontWeight: 'bold',
          color: '#a78bfa',
          textAlign: 'center',
          marginBottom: '12px',
          opacity: Math.min(1, frame / 15),
        }}
      >
        最大升级：Agent 能力
      </div>

      <div
        style={{
          fontSize: '22px',
          color: '#94a3b8',
          marginBottom: '35px',
          opacity: Math.min(1, Math.max(0, (frame - 10) / 15)),
        }}
      >
        自主完成复杂任务，一条龙搞定
      </div>

      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '600px',
          height: '280px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: `translate(-50%, -50%) scale(${spring({
              frame,
              fps: 30,
              config: { damping: 12, stiffness: 80 },
            })})`,
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '40px',
            boxShadow: '0 0 40px rgba(124, 58, 237, 0.4)',
            zIndex: 2,
          }}
        >
          🤖
        </div>

        {tools.map((tool, i) => {
          const delay = 20 + i * 18
          const scale = spring({
            frame: frame - delay,
            fps: 30,
            config: { damping: 10, stiffness: 100 },
          })
          const opacity = interpolate(frame - delay, [0, 15], [0, 1], {
            extrapolateRight: 'clamp',
          })

          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                ...positions[i],
                background: 'rgba(30, 41, 59, 0.9)',
                border: '2px solid #475569',
                borderRadius: '14px',
                padding: '14px 18px',
                transform: `scale(${scale})`,
                opacity,
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '28px', marginBottom: '2px' }}>
                {tool.icon}
              </div>
              <div style={{ fontSize: '16px', color: 'white', fontWeight: 'bold' }}>
                {tool.name}
              </div>
            </div>
          )
        })}
      </div>

      <div
        style={{
          fontSize: '28px',
          color: '#a78bfa',
          fontWeight: 'bold',
          marginTop: '30px',
          opacity: interpolate(frame - 120, [0, 20], [0, 1], {
            extrapolateRight: 'clamp',
          }),
        }}
      >
        Agent 自主协作
      </div>

      {subtitle && <Subtitle text={subtitle} />}
    </AbsoluteFill>
  )
}
