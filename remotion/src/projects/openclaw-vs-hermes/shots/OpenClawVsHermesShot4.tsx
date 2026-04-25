import { AbsoluteFill } from 'remotion'
import React from 'react'
import { ScreenRecording } from '../../../components/ScreenRecording'
import { Subtitle } from '../../../components/Subtitle'
import { Overlay } from '../../../components/Overlay'

export const OpenClawVsHermesShot4: React.FC = () => {
  return (
    <ScreenRecording title="Hermes Memory System">
      <Overlay text="手动记忆 vs 自动记忆" />
      <Subtitle text="最关键的差异是记忆。OpenClaw 要你手动配状态和事件，Hermes 是原生自动记忆，自己学会做事，越用越懂你。" />
    </ScreenRecording>
  )
}
