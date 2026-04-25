import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion'
import React, { useMemo } from 'react'
import { Subtitle } from '../../../components/Subtitle'

export const AiCreationWorkflowShot2: React.FC = () => {
  const frame = useCurrentFrame()

  const scenes = useMemo(() => [
    { icon: '📝', label: '深夜写脚本', bg: '#2d1b4e' },
    { icon: '🎬', label: '剪辑两小时', bg: '#1b3a4e' },
    { icon: '📉', label: '播放量惨淡', bg: '#4e1b1b' },
  ], [])

  // Shot2 时长 10秒 = 300帧，3个场景各占约 3.3秒
  const sceneIndex = Math.min(Math.floor(frame / 100), scenes.length - 1)
  const sceneStartFrame = sceneIndex * 100
  const sceneProgress = (frame - sceneStartFrame) / 100

  const currentScene = scenes[sceneIndex]
  const slideX = interpolate(sceneProgress, [0, 0.3], [100, 0], { extrapolateRight: 'clamp' })
  const opacity = interpolate(sceneProgress, [0, 0.2, 0.7, 1], [0, 1, 1, 0.5], { extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill style={{ background: currentScene.bg }}>
      <AbsoluteFill style={{
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translateX(${slideX}px)`,
        opacity,
        gap: 40,
      }}>
        <div style={{ fontSize: 140 }}>{currentScene.icon}</div>
        <div style={{
          color: 'white',
          fontSize: 42,
          fontWeight: 'bold',
          background: 'rgba(0, 0, 0, 0.5)',
          padding: '16px 40px',
          borderRadius: 16,
        }}>
          {currentScene.label}
        </div>
      </AbsoluteFill>
      <Subtitle text="写脚本一小时，剪辑两小时，发完还没人看。做自媒体最痛苦的就是，产出跟不上算法的速度。" />
    </AbsoluteFill>
  )
}
