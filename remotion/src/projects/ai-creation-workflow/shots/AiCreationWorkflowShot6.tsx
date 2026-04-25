import { AbsoluteFill } from 'remotion'
import React from 'react'
import { Subtitle } from '../../../components/Subtitle'
import { CTA } from '../../../components/CTA'

export const AiCreationWorkflowShot6: React.FC = () => {
  return (
    <CTA text="关注我">
      <Subtitle text="从创意到发布，一条龙AI搞定。这套工作流后面我会手把手教你搭，关注我，带你用AI做内容。" />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: -80 }}>
        <div style={{
          color: 'rgba(255, 255, 255, 0.5)',
          fontSize: 24,
          textAlign: 'center' as const,
        }}>
          AI创作工作流
        </div>
      </AbsoluteFill>
    </CTA>
  )
}
