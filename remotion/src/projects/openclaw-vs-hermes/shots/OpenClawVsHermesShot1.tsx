import { AbsoluteFill } from 'remotion'
import React from 'react'
import { TalkingHead } from '../../../components/TalkingHead'
import { Subtitle } from '../../../components/Subtitle'
import { Overlay } from '../../../components/Overlay'

export const OpenClawVsHermesShot1: React.FC = () => {
  return (
    <TalkingHead>
      <Overlay text="OpenClaw 停更？Hermes 能接班？" />
      <Subtitle text="OpenClaw 16万星标，突然停更了？Hermes Agent 真能接班吗？" />
    </TalkingHead>
  )
}
