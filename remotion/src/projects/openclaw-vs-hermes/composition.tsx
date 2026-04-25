import { Sequence } from 'remotion'
import React from 'react'
import { OpenClawVsHermesShot1 } from './shots/OpenClawVsHermesShot1'
import { OpenClawVsHermesShot2 } from './shots/OpenClawVsHermesShot2'
import { OpenClawVsHermesShot3 } from './shots/OpenClawVsHermesShot3'
import { OpenClawVsHermesShot4 } from './shots/OpenClawVsHermesShot4'
import { OpenClawVsHermesShot5 } from './shots/OpenClawVsHermesShot5'
import { OpenClawVsHermesShot6 } from './shots/OpenClawVsHermesShot6'

const fps = 30
const totalDuration = 85 // seconds

export const OpenClawVsHermes: React.FC = () => {
  return (
    <>
      <Sequence from={0} durationInFrames={5 * fps}>
        <OpenClawVsHermesShot1 />
      </Sequence>
      <Sequence from={5 * fps} durationInFrames={10 * fps}>
        <OpenClawVsHermesShot2 />
      </Sequence>
      <Sequence from={15 * fps} durationInFrames={20 * fps}>
        <OpenClawVsHermesShot3 />
      </Sequence>
      <Sequence from={35 * fps} durationInFrames={20 * fps}>
        <OpenClawVsHermesShot4 />
      </Sequence>
      <Sequence from={55 * fps} durationInFrames={20 * fps}>
        <OpenClawVsHermesShot5 />
      </Sequence>
      <Sequence from={75 * fps} durationInFrames={10 * fps}>
        <OpenClawVsHermesShot6 />
      </Sequence>
    </>
  )
}
