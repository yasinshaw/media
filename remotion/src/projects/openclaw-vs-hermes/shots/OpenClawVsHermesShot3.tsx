import { AbsoluteFill } from 'remotion'
import React from 'react'
import { SplitScreen } from '../../../components/SplitScreen'
import { Subtitle } from '../../../components/Subtitle'
import { Overlay } from '../../../components/Overlay'

export const OpenClawVsHermesShot3: React.FC = () => {
  return (
    <SplitScreen
      leftLabel="OpenClaw 消息中枢"
      rightLabel="Hermes 自进化"
    >
      <Overlay text="OpenClaw = 消息中枢 / Hermes = 自进化 Agent" />
      <Subtitle text="一句话讲清楚：OpenClaw 是消息中枢，擅长 IDE 集成，写代码很爽；Hermes 是自进化 Agent，能自动学技能，还能记住你说过的话。" />
    </SplitScreen>
  )
}
