import { AbsoluteFill } from 'remotion'
import React from 'react'
import { TalkingHead } from '../../../components/TalkingHead'
import { Subtitle } from '../../../components/Subtitle'
import { Overlay } from '../../../components/Overlay'

export const OpenClawVsHermesShot5: React.FC = () => {
  return (
    <TalkingHead>
      <Overlay text="老项目先观望 / 新项目直接 Hermes" />
      <Subtitle text="如果你 IDE 重度用户，OpenClaw 现在还能用，别急着换。但新项目直接上 Hermes，70 多个技能、10 多个平台，生态增长很快。" />
    </TalkingHead>
  )
}
