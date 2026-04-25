import { AbsoluteFill } from 'remotion'
import React from 'react'
import { ScreenRecording } from '../../../components/ScreenRecording'
import { Subtitle } from '../../../components/Subtitle'
import { Overlay } from '../../../components/Overlay'

export const OpenClawVsHermesShot2: React.FC = () => {
  return (
    <ScreenRecording title="GitHub Trends">
      <Overlay text="停更 panic / 换还是不换？" />
      <Subtitle text="很多用 OpenClaw 的兄弟最近慌了，项目停更，生态要凉。想换又怕踩坑，到底 Hermes 行不行？" />
    </ScreenRecording>
  )
}
