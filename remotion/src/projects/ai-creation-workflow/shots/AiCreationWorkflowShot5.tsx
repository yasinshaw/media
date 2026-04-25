import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion'
import React, { useMemo } from 'react'
import { Subtitle } from '../../../components/Subtitle'

const PROGRESS_END_FRAME = 450  // 15秒 @ 30fps

export const AiCreationWorkflowShot5: React.FC = () => {
  const frame = useCurrentFrame()

  const steps = useMemo(() => ['脚本解析', '组件生成', '动画渲染'], [])

  // Shot5 时长 15秒 = 450帧，3个步骤各占 5 秒
  const stepIndex = Math.min(Math.floor(frame / 150), steps.length - 1)

  const progressWidth = interpolate(frame, [0, PROGRESS_END_FRAME], [0, 100], { extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <AbsoluteFill style={{
        top: 120,
        left: 100,
        right: 100,
        bottom: 150,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 30,
        padding: 40,
      }}>
        <div style={{
          width: '100%',
          height: 8,
          background: 'rgba(255, 255, 255, 0.15)',
          borderRadius: 4,
          overflow: 'hidden',
        }}>
          <div style={{
            width: `${progressWidth}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #667eea, #764ba2)',
            borderRadius: 4,
          }} />
        </div>
        <div style={{ display: 'flex', gap: 20, justifyContent: 'center' }}>
          {steps.map((step, i) => {
            const isActive = i === stepIndex
            const isDone = i < stepIndex
            return (
              <div key={i} style={{
                padding: '12px 28px',
                borderRadius: 24,
                background: isActive
                  ? 'rgba(102, 126, 234, 0.35)'
                  : isDone
                    ? 'rgba(40, 201, 64, 0.25)'
                    : 'rgba(255, 255, 255, 0.08)',
                border: isActive
                  ? '2px solid rgba(102, 126, 234, 0.6)'
                  : isDone
                    ? '2px solid rgba(40, 201, 64, 0.4)'
                    : '1px solid rgba(255, 255, 255, 0.15)',
                color: isActive ? '#667eea' : isDone ? '#28c940' : '#666',
                fontSize: 18,
                fontWeight: isActive ? 'bold' : 'normal',
              }}>
                {isDone ? '✓ ' : ''}{step}
              </div>
            )
          })}
        </div>
      </AbsoluteFill>
      <Subtitle text="最后一步，另一个Skill把脚本直接转成视频代码，字幕动画全自动生成。我只需要做最后的微调就能发布。" />
    </AbsoluteFill>
  )
}
