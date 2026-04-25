import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion'
import React from 'react'
import { Subtitle } from '../../../components/Subtitle'

interface ShotProps {
  subtitle?: string
}

export const Shot4: React.FC<ShotProps> = ({ subtitle }) => {
  const frame = useCurrentFrame()

  const workflow = [
    { icon: '💻', label: '写代码', delay: 0 },
    { icon: '🔬', label: '做研究', delay: 15 },
    { icon: '📊', label: '分析数据', delay: 30 }
  ]

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
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
        gap: '48px'
      }}>
        {/* Title */}
        <div style={{
          fontSize: '52px',
          fontWeight: 800,
          color: '#fff',
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          Agent 能力升级
        </div>

        {/* Workflow Visualization */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '40px',
          position: 'relative'
        }}>
          {workflow.map((step, index) => {
            const progress = interpolate(
              frame,
              [step.delay, step.delay + 20],
              [0, 1],
              { extrapolateRight: 'clamp' }
            )
            const scale = interpolate(progress, [0, 1], [0.5, 1])
            const opacity = interpolate(progress, [0, 1], [0, 1])

            return (
              <React.Fragment key={index}>
                {/* Step Card */}
                <div style={{
                  width: '200px',
                  height: '200px',
 borderRadius: '24px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '3px solid rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '16px',
                  transform: `scale(${scale})`,
                  opacity
                }}>
                  <div style={{ fontSize: '64px' }}>
                    {step.icon}
                  </div>
                  <div style={{
                    fontSize: '28px',
                    fontWeight: 600,
                    color: '#fff'
                  }}>
                    {step.label}
                  </div>
                </div>

                {/* Arrow */}
                {index < workflow.length - 1 && (
                  <div style={{
                    fontSize: '48px',
                    color: 'rgba(255, 255, 255, 0.5)',
                    opacity: progress
                  }}>
                    →
                  </div>
                )}
              </React.Fragment>
            )
          })}
        </div>

        {/* Description */}
        <div style={{
          marginTop: '20px',
          padding: '32px 48px',
          background: 'rgba(167, 139, 250, 0.15)',
          borderRadius: '20px',
          border: '2px solid rgba(167, 139, 250, 0.3)',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '32px',
            fontWeight: 600,
            color: '#c4b5fd',
            lineHeight: '1.6'
          }}>
            跨工具协作 · 一条龙搞定
          </div>
        </div>

        {/* Key Feature */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '32px'
        }}>
          {['自主完成', '复杂任务', '跨多工具'].map((feature, i) => {
            const delay = i * 10
            const opacity = interpolate(
              frame,
              [60 + delay, 60 + delay + 15],
              [0, 1],
              { extrapolateRight: 'clamp' }
            )

            return (
              <div
                key={i}
                style={{
                  padding: '16px 32px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '50px',
                  border: '2px solid rgba(255, 255, 255, 0.15)',
                  opacity
                }}
              >
                <div style={{
                  fontSize: '24px',
                  fontWeight: 600,
                  color: '#e2e8f0'
                }}>
                  {feature}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {subtitle && <Subtitle text={subtitle} />}
    </AbsoluteFill>
  )
}
