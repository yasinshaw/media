import React from 'react'
import { useCurrentFrame, interpolate, staticFile } from 'remotion'
import { CenteredStack } from '../../../components'
import { Img } from 'remotion'

interface ShotProps {
  subtitleSegments?: Array<{ text: string; start: number; end: number; duration: number }>
  videoOffset?: number
}

export const Shot4: React.FC<ShotProps> = ({ subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()

  const fadeIn = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <CenteredStack
      background="#0f172a"
      justify="center"
      subtitleSegments={subtitleSegments}
      videoOffset={videoOffset}
    >
      <div
        style={{
          width: '100%',
          position: 'relative',
          opacity: fadeIn,
        }}
      >
        <Img
          src={staticFile('/projects/agent-teams/assets/images/agent-teams-infographic.png')}
          style={{
            width: '100%',
            height: 'auto',
            borderRadius: 20,
          }}
        />
      </div>
    </CenteredStack>
  )
}
