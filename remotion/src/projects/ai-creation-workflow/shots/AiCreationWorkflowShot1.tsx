import { AbsoluteFill, useCurrentFrame, interpolate, spring } from 'remotion'
import React from 'react'
import { Subtitle } from '../../../components/Subtitle'
import { TalkingHead } from '../../../components/TalkingHead'

export const AiCreationWorkflowShot1: React.FC = () => {
  const frame = useCurrentFrame()

  const leftScale = spring({
    frame,
    fps: 30,
    config: { damping: 12, stiffness: 80 },
  })

  const rightScale = spring({
    frame: frame >= 10 ? frame - 10 : 0,
    fps: 30,
    config: { damping: 12, stiffness: 80 },
  })

  const arrowOpacity = interpolate(frame, [20, 35], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <TalkingHead>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', gap: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 50 }}>
          <div style={{
            padding: '24px 48px',
            background: 'rgba(255, 87, 87, 0.25)',
            borderRadius: 20,
            border: '3px solid rgba(255, 87, 87, 0.6)',
            transform: `scale(${leftScale})`,
          }}>
            <span style={{ color: '#ff5757', fontSize: 56, fontWeight: '900' }}>3小时</span>
          </div>
          <div style={{
            fontSize: 70,
            color: '#667eea',
            opacity: arrowOpacity,
          }}>→</div>
          <div style={{
            padding: '24px 48px',
            background: 'rgba(40, 201, 64, 0.25)',
            borderRadius: 20,
            border: '3px solid rgba(40, 201, 64, 0.6)',
            transform: `scale(${rightScale})`,
          }}>
            <span style={{ color: '#28c940', fontSize: 56, fontWeight: '900' }}>5分钟</span>
          </div>
        </div>
      </AbsoluteFill>
      <Subtitle text="一条短视频从创意到发布，你花多久？三个小时？我现在，5分钟。" />
    </TalkingHead>
  )
}
