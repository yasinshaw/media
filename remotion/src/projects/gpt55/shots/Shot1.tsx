import { AbsoluteFill } from 'remotion'
import React from 'react'
import { Subtitle } from '../../../components/Subtitle'

interface ShotProps {
  subtitle?: string
}

export const Shot1: React.FC<ShotProps> = ({ subtitle }) => {
  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
        alignItems: 'center',
        gap: '40px'
      }}>
        {/* GPT-5.5 Logo/Title */}
        <div style={{
          width: '400px',
          height: '400px',
          borderRadius: '200px',
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(20px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          border: '4px solid rgba(255, 255, 255, 0.3)'
        }}>
          <div style={{
            fontSize: '72px',
            fontWeight: 900,
            color: '#fff',
            textShadow: '0 4px 20px rgba(0,0,0,0.3)'
          }}>
            GPT-5.5
          </div>
          <div style={{
            fontSize: '32px',
            fontWeight: 600,
            color: 'rgba(255, 255, 255, 0.9)',
            marginTop: '10px'
          }}>
            来了！
          </div>
        </div>

        {/* Badge */}
        <div style={{
          padding: '20px 48px',
          background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          borderRadius: '50px',
          border: '2px solid rgba(255, 255, 255, 0.4)'
        }}>
          <div style={{
            fontSize: '36px',
            fontWeight: 700,
            color: '#fff',
            textAlign: 'center'
          }}>
            多项基准领先
          </div>
        </div>
      </div>

      {subtitle && <Subtitle text={subtitle} />}
    </AbsoluteFill>
  )
}
