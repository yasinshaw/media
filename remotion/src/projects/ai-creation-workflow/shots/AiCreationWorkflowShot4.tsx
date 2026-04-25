import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion'
import React from 'react'
import { Subtitle } from '../../../components/Subtitle'
import { ScreenRecording } from '../../../components/ScreenRecording'

const CHECK_START_FRAME = 20
const CHECK_SPACING_FRAMES = 15
const SUCCESS_BOX_START_FRAME = 90
const SUCCESS_BOX_END_FRAME = 110

export const AiCreationWorkflowShot4: React.FC = () => {
  const frame = useCurrentFrame()

  const checks = [
    { text: '数据核实：Claude Code Skill', status: 'pass' },
    { text: '事实核查：Remotion 生成', status: 'pass' },
    { text: '引用验证：AI工作流', status: 'pass' },
    { text: '数据来源：无外部引用', status: 'pass' },
  ]

  return (
    <ScreenRecording title="Claude Code — /script-review">
      <AbsoluteFill style={{
        top: 120,
        left: 100,
        right: 100,
        bottom: 150,
        padding: 28,
        fontFamily: 'monospace',
        fontSize: 18,
        color: '#a9b7c6',
      }}>
        <div style={{ color: '#569cd6', marginBottom: 20, fontSize: 20 }}>🔍 事实核查结果：</div>
        {checks.map((check, i) => {
          const appearFrame = CHECK_START_FRAME + i * CHECK_SPACING_FRAMES
          const opacity = interpolate(frame, [appearFrame, appearFrame + 10], [0, 1], { extrapolateRight: 'clamp' })
          return (
            <div key={i} style={{ opacity, marginBottom: 12, display: 'flex', gap: 10 }}>
              <span style={{ color: '#28c940', fontSize: 20 }}>✓</span>
              <span style={{ fontSize: 18 }}>{check.text}</span>
            </div>
          )
        })}
        {frame > SUCCESS_BOX_START_FRAME && (
          <div style={{
            marginTop: 20,
            padding: '16px 20px',
            background: 'rgba(40, 201, 64, 0.15)',
            borderRadius: 10,
            borderLeft: '4px solid #28c940',
            opacity: interpolate(frame, [SUCCESS_BOX_START_FRAME, SUCCESS_BOX_END_FRAME], [0, 1], { extrapolateRight: 'clamp' }),
          }}>
            <span style={{ color: '#28c940', fontWeight: 'bold', fontSize: 18 }}>全部通过 — 0个问题</span>
          </div>
        )}
      </AbsoluteFill>
      <Subtitle text="脚本出来了，还有个AI Skill专门做事实核查。一键检查里面每个数据、每个说法准不准，杜绝翻车。" />
    </ScreenRecording>
  )
}
