import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion'
import React from 'react'
import { Subtitle } from '../../../components/Subtitle'

interface ShotProps {
  subtitle?: string
}

export const Shot3: React.FC<ShotProps> = ({ subtitle }) => {
  const frame = useCurrentFrame()

  const benchmarks = [
    { name: 'Terminal-Bench 编码', gpt55: 82.7, claude: 69.4 },
    { name: '数学推理 Tier 1-3', gpt55: 51.7, claude: 43.8 },
    { name: '高难数学 Tier 4', gpt55: 35.4, claude: 22.9 },
    { name: '网络安全 CyberGym', gpt55: 81.8, claude: 73.1 },
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
          color: '#60a5fa',
          textAlign: 'center',
          marginBottom: '12px',
          opacity: Math.min(1, frame / 15),
        }}
      >
        硬核数据
      </div>

      <div
        style={{
          fontSize: '20px',
          color: '#94a3b8',
          marginBottom: '30px',
          opacity: Math.min(1, Math.max(0, (frame - 10) / 15)),
        }}
      >
        GPT-5.5 vs Claude Opus 4.7
      </div>

      {benchmarks.map((bench, i) => {
        const delay = 20 + i * 35
        const barProgress = interpolate(frame - delay, [0, 40], [0, 1], {
          extrapolateRight: 'clamp',
        })
        const opacity = interpolate(frame - delay, [0, 15], [0, 1], {
          extrapolateRight: 'clamp',
        })

        return (
          <div
            key={i}
            style={{
              width: '100%',
              maxWidth: '650px',
              opacity,
              marginBottom: i === benchmarks.length - 1 ? '0' : '20px',
            }}
          >
            <div
              style={{
                fontSize: '18px',
                color: '#94a3b8',
                fontWeight: 'bold',
                marginBottom: '8px',
              }}
            >
              {bench.name}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span style={{ fontSize: '14px', color: '#60a5fa', minWidth: '65px' }}>
                GPT-5.5
              </span>
              <div
                style={{
                  background: 'rgba(59, 130, 246, 0.2)',
                  borderRadius: '6px',
                  height: '24px',
                  width: '100%',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    background: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
                    borderRadius: '6px',
                    height: '100%',
                    width: `${bench.gpt55 * barProgress}%`,
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: '16px',
                  color: '#60a5fa',
                  fontWeight: 'bold',
                  minWidth: '55px',
                }}
              >
                {bench.gpt55}%
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '14px', color: '#f87171', minWidth: '65px' }}>
                Claude
              </span>
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  borderRadius: '6px',
                  height: '24px',
                  width: '100%',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    background: 'linear-gradient(90deg, #ef4444, #f87171)',
                    borderRadius: '6px',
                    height: '100%',
                    width: `${bench.claude * barProgress}%`,
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: '16px',
                  color: '#f87171',
                  fontWeight: 'bold',
                  minWidth: '55px',
                }}
              >
                {bench.claude}%
              </span>
            </div>
          </div>
        )
      })}

      {subtitle && <Subtitle text={subtitle} />}
    </AbsoluteFill>
  )
}
