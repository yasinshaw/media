import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion'
import React from 'react'
import { Subtitle } from '../../../components/Subtitle'
import { ScreenRecording } from '../../../components/ScreenRecording'

const TYPING_START_FRAME = 15
const TYPING_END_FRAME = 90
const RESULT_START_FRAME = 100

export const AiCreationWorkflowShot3: React.FC = () => {
  const frame = useCurrentFrame()

  const typingProgress = interpolate(frame, [TYPING_START_FRAME, TYPING_END_FRAME], [0, 1], { extrapolateRight: 'clamp' })
  const commandText = '/video-script'
  const visibleChars = Math.floor(typingProgress * commandText.length)

  const cursorOpacity = interpolate(
    frame,
    [TYPING_START_FRAME, TYPING_START_FRAME + 5, TYPING_END_FRAME - 5, TYPING_END_FRAME],
    [0, 1, 1, 0],
    { extrapolateRight: 'clamp' }
  )

  const resultOpacity = interpolate(frame, [RESULT_START_FRAME, RESULT_START_FRAME + 20], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <ScreenRecording title="Claude Code — Terminal">
      <AbsoluteFill style={{
        top: 120,
        left: 100,
        right: 100,
        bottom: 150,
        padding: 28,
        fontFamily: 'monospace',
        fontSize: 22,
        color: '#a9b7c6',
      }}>
        <div style={{ color: '#4ec9b0' }}>$ <span style={{ color: '#dcdcaa' }}>
          {commandText.slice(0, visibleChars)}
          <span style={{ opacity: cursorOpacity }}>▎</span>
        </span></div>
        {frame > TYPING_END_FRAME && (
          <div style={{ marginTop: 24, opacity: resultOpacity }}>
            <div style={{ color: '#569cd6', fontSize: 20 }}>📋 生成脚本中...</div>
            <div style={{ marginTop: 16, color: '#6a9955', fontSize: 20 }}>✓ 钩子设计完成</div>
            <div style={{ color: '#6a9955', fontSize: 20 }}>✓ 痛点分析完成</div>
            <div style={{ color: '#6a9955', fontSize: 20 }}>✓ 核心内容完成</div>
            <div style={{ color: '#6a9955', fontSize: 20 }}>✓ CTA设计完成</div>
          </div>
        )}
      </AbsoluteFill>
      <Subtitle text="我用Claude Code搭了一套AI创作工作流。只要输入一个想法，它自动生成完整的分镜脚本——钩子、痛点、核心内容、CTA，全都给你安排好。" />
    </ScreenRecording>
  )
}
