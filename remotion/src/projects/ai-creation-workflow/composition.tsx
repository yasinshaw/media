import { Sequence } from 'remotion'
import React from 'react'
import { AiCreationWorkflowShot1 } from './shots/AiCreationWorkflowShot1'
import { AiCreationWorkflowShot2 } from './shots/AiCreationWorkflowShot2'
import { AiCreationWorkflowShot3 } from './shots/AiCreationWorkflowShot3'
import { AiCreationWorkflowShot4 } from './shots/AiCreationWorkflowShot4'
import { AiCreationWorkflowShot5 } from './shots/AiCreationWorkflowShot5'
import { AiCreationWorkflowShot6 } from './shots/AiCreationWorkflowShot6'

const fps = 30

export const AiCreationWorkflow: React.FC = () => {
  return (
    <>
      {/* Audio track - place voiceover file at public/ai-creation-workflow.mp3 */}
      {/* Uncomment when audio file is ready:
      import { Audio } from '@remotion/media';
      <Audio src="/ai-creation-workflow.mp3" />
      */}

      <Sequence from={0} durationInFrames={5 * fps}>
        <AiCreationWorkflowShot1 />
      </Sequence>
      <Sequence from={5 * fps} durationInFrames={10 * fps}>
        <AiCreationWorkflowShot2 />
      </Sequence>
      <Sequence from={15 * fps} durationInFrames={20 * fps}>
        <AiCreationWorkflowShot3 />
      </Sequence>
      <Sequence from={35 * fps} durationInFrames={15 * fps}>
        <AiCreationWorkflowShot4 />
      </Sequence>
      <Sequence from={50 * fps} durationInFrames={15 * fps}>
        <AiCreationWorkflowShot5 />
      </Sequence>
      <Sequence from={65 * fps} durationInFrames={15 * fps}>
        <AiCreationWorkflowShot6 />
      </Sequence>
    </>
  )
}
