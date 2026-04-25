import { AbsoluteFill, useCurrentFrame, interpolate, spring } from 'remotion'
import React from 'react'

export const Shot5: React.FC = () => {
  const frame = useCurrentFrame()

  const beforeScale = spring({
    frame: Math.min(frame, 45),
    fps: 30,
    config: { damping: 12, stiffness: 80 }
  })

  const afterOpacity = interpolate(
    frame,
    [45, 60],
    [0, 1],
    { extrapolateRight: 'clamp' }
  )

  const afterScale = spring({
    frame: frame - 45,
    fps: 30,
    config: { damping: 10, stiffness: 100 }
  })

  const arrowProgress = interpolate(
    frame,
    [0, 90],
    [0, 1],
    { extrapolateRight: 'clamp' }
  )

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '30px',
      padding: '120px 40px 200px'  // Safe areas
    }}>
      <div style={{
        fontSize: '40px',
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center'
      }}>
        为什么能这么强？
      </div>

      {/* Architecture Comparison - vertical for vertical format */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        width: '100%',
        maxWidth: '600px'
      }}>
        {/* Before */}
        <div style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '2px solid #ef4444',
          borderRadius: '16px',
          padding: '20px 28px',
          transform: `scale(${beforeScale})`,
          opacity: frame < 45 ? 1 : 0.3,
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{
              fontSize: '16px',
              color: '#fca5a5',
              marginBottom: '6px'
            }}>
              旧架构
            </div>
            <div style={{ fontSize: '22px', color: 'white', marginBottom: '6px' }}>
              GPT-4o 附属
            </div>
            <div style={{ fontSize: '16px', color: '#fca5a5' }}>
              两阶段推理
            </div>
          </div>
        </div>

        {/* Arrow */}
        <div style={{
          fontSize: '36px',
          transform: `translateY(${arrowProgress * 10}px)`,
          opacity: arrowProgress
        }}>
          ↓
        </div>

        {/* After */}
        <div style={{
          background: 'rgba(34, 197, 94, 0.15)',
          border: '2px solid #22c55e',
          borderRadius: '16px',
          padding: '20px 28px',
          transform: `scale(${afterScale})`,
          opacity: afterOpacity,
          boxShadow: '0 0 20px rgba(34, 197, 94, 0.3)',
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{
              fontSize: '16px',
              color: '#86efac',
              marginBottom: '6px'
            }}>
              新架构
            </div>
            <div style={{ fontSize: '22px', color: 'white', marginBottom: '6px' }}>
              独立模型
            </div>
            <div style={{ fontSize: '16px', color: '#86efac' }}>
              单次推理
            </div>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div style={{
        display: 'flex',
        gap: '16px',
        marginTop: '10px',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        {[
          { label: '&lt; 3秒', desc: '生成速度' },
          { label: '4K', desc: '分辨率支持' },
          { label: '独立', desc: '专属架构' }
        ].map((benefit, i) => {
          const delay = 30 + i * 10
          const scale = spring({
            frame: frame - delay,
            fps: 30,
            config: { damping: 10, stiffness: 100 }
          })
          const opacity = interpolate(
            frame - delay,
            [0, 15],
            [0, 1],
            { extrapolateRight: 'clamp' }
          )

          return (
            <div key={i} style={{
              background: 'rgba(59, 130, 246, 0.15)',
              border: '2px solid #3b82f6',
              borderRadius: '12px',
              padding: '12px 20px',
              transform: `scale(${scale})`,
              opacity,
              textAlign: 'center',
              minWidth: '90px'
            }}>
              <div style={{
                fontSize: '28px',
                fontWeight: 'bold',
                color: '#60a5fa'
              }}>
                {benefit.label}
              </div>
              <div style={{ fontSize: '14px', color: '#93c5fd' }}>
                {benefit.desc}
              </div>
            </div>
          )
        })}
      </div>
    </AbsoluteFill>
  )
}
