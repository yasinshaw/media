import { Composition } from 'remotion'
import React from 'react'
import { OpenClawVsHermes } from './projects/openclaw-vs-hermes/composition'
import { AiCreationWorkflow } from './projects/ai-creation-workflow/composition'
import { GptImage2Compare } from './projects/gpt-image2-compare/composition'
import { Gpt55Analysis } from './projects/gpt55-analysis/composition'
import { Gpt55 as Gpt55New, durationInFrames } from './projects/gpt55能力/composition'
import { 子agent技能 as 子agent技能, durationInFrames as 子agent技能Duration } from './projects/子agent技能/composition'
import { AgentTeamsGuide, durationInFrames as AgentTeamsGuideDuration } from './projects/agent-teams-guide/composition'
import { DeepseekV4, durationInFrames as DeepseekV4Duration } from './projects/deepseek-v4/composition'
import { YingShiJuFengAiWorkflow, durationInFrames as YingShiJuFengAiWorkflowDuration } from './projects/ying-shi-ju-feng-ai-workflow/composition'
import { AiNovelWriting, durationInFrames as AiNovelWritingDuration } from './projects/ai-novel-writing/composition'
import { AiZhongZhuanZhanZhenXiang, durationInFrames as AiZhongZhuanZhanZhenXiangDuration } from './projects/ai中转站真相/composition'
import { CustomSkillGuide, durationInFrames as CustomSkillGuideDuration } from './projects/如何制作一个专属技能/composition'
import { Grok43CustomVoices, durationInFrames as Grok43CustomVoicesDuration } from './projects/grok43-custom-voices/composition'
import { PixelleVideo, durationInFrames as PixelleVideoDuration } from './projects/pixelle-video/composition'
import { MultiAgentSyncer, durationInFrames as MultiAgentSyncerDuration } from './projects/multi-agent-syncer/composition'
import { HermesKanban, durationInFrames as HermesKanbanDuration } from './projects/hermes-kanban/composition'

export const RemotionVideo: React.FC = () => {
  return (
    <>
      <Composition
        id="OpenClawVsHermes"
        component={OpenClawVsHermes}
        durationInFrames={2550}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
      <Composition
        id="AiCreationWorkflow"
        component={AiCreationWorkflow}
        durationInFrames={2400}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
      <Composition
        id="GptImage2Compare"
        component={GptImage2Compare}
        durationInFrames={2550}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
      <Composition
        id="Gpt55Analysis"
        component={Gpt55Analysis}
        durationInFrames={2220}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
      <Composition
        id="Gpt55"
        component={Gpt55New}
        durationInFrames={durationInFrames}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
      <Composition
        id="子agent技能"
        component={子agent技能}
        durationInFrames={子agent技能Duration}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
      <Composition
        id="AgentTeamsGuide"
        component={AgentTeamsGuide}
        durationInFrames={AgentTeamsGuideDuration}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
      <Composition
        id="DeepseekV4"
        component={DeepseekV4}
        durationInFrames={DeepseekV4Duration}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
      <Composition
        id="YingShiJuFengAiWorkflow"
        component={YingShiJuFengAiWorkflow}
        durationInFrames={YingShiJuFengAiWorkflowDuration}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
      <Composition
        id="AiNovelWriting"
        component={AiNovelWriting}
        durationInFrames={AiNovelWritingDuration}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
      <Composition
        id="AiZhongZhuanZhanZhenXiang"
        component={AiZhongZhuanZhanZhenXiang}
        durationInFrames={AiZhongZhuanZhanZhenXiangDuration}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
      <Composition
        id="CustomSkillGuide"
        component={CustomSkillGuide}
        durationInFrames={CustomSkillGuideDuration}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
      <Composition
        id="Grok43CustomVoices"
        component={Grok43CustomVoices}
        durationInFrames={Grok43CustomVoicesDuration}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
      <Composition
        id="PixelleVideo"
        component={PixelleVideo}
        durationInFrames={PixelleVideoDuration}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
      <Composition
        id="MultiAgentSyncer"
        component={MultiAgentSyncer}
        durationInFrames={MultiAgentSyncerDuration}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
      <Composition
        id="HermesKanban"
        component={HermesKanban}
        durationInFrames={HermesKanbanDuration}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
    </>
  )
}
