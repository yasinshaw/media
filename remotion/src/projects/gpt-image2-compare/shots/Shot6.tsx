import { AbsoluteFill, useCurrentFrame, spring } from 'remotion'
import React from 'react'

export const Shot6: React.FC = () => {
  const frame = useCurrentFrame()

  const pulseScale = spring({
    frame: frame % 60,
    fps: 30,
    config: { damping: 15, stiffness: 80 }
  })

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '120px 40px 200px'  // Safe areas
    }}>
      {/* DALL-E Shutdown Notice */}
      <div style={{
        background: 'rgba(239, 68, 68, 0.15)',
        border: '2px solid #ef4444',
        borderRadius: '16px',
        padding: '18px 32px',
        marginBottom: '24px'
      }}>
        <div style={{
          fontSize: '20px',
          color: '#fca5a5',
          marginBottom: '8px'
        }}>
          ⚠️ 重要通知
        </div>
        <div style={{
          fontSize: '26px',
          fontWeight: 'bold',
          color: 'white'
        }}>
          DALL-E 将于 5月12日 关闭
        </div>
      </div>

      {/* GPT-Image-2 Coming Soon */}
      <div style={{
        background: 'rgba(34, 197, 94, 0.15)',
        border: '3px solid #22c55e',
        borderRadius: '18px',
        padding: '24px 40px',
        transform: `scale(${pulseScale})`,
        boxShadow: '0 0 30px rgba(34, 197, 94, 0.3)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '36px', marginBottom: '12px' }}>
          🚀 GPT-Image-2
        </div>
        <div style={{
          fontSize: '24px',
          color: '#86efac',
          marginBottom: '8px'
        }}>
          大概率在这之前发布
        </div>
      </div>

      {/* CTA */}
      <div style={{
        marginTop: '28px',
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#fbbf24',
        textAlign: 'center'
      }}>
        点个关注，获取首发资讯
      </div>

      {/* Follow Button */}
      <div style={{
        marginTop: '24px',
        background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
        borderRadius: '50px',
        padding: '14px 40px',
        fontSize: '26px',
        fontWeight: 'bold',
        color: 'white',
        boxShadow: '0 4px 20px rgba(245, 158, 11, 0.4)',
        transform: `scale(${1 + Math.sin(frame / 15) * 0.05})`
      }}>
        关注 +
      </div>
    </AbsoluteFill>
  )
}
