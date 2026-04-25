import React from 'react'
import { SafeArea } from './SafeArea'

interface TalkingHeadProps {
  children?: React.ReactNode
}

export const TalkingHead: React.FC<TalkingHeadProps> = ({ children }) => {
  return (
    <SafeArea style={{
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      {/* Larger avatar for vertical format (500x500 vs old 300x300) */}
      <div style={{
        width: 500,
        height: 500,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 30px 80px rgba(102, 126, 234, 0.5)',
      }}>
        <div style={{
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: '#fff',
          opacity: 0.3,
        }} />
      </div>
      {children}
    </SafeArea>
  )
}
