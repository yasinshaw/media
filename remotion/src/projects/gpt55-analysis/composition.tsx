import { AbsoluteFill, Sequence } from 'remotion'
import React from 'react'
import { Shot1 } from './shots/Shot1'
import { Shot2 } from './shots/Shot2'
import { Shot3 } from './shots/Shot3'
import { Shot4 } from './shots/Shot4'
import { Shot5 } from './shots/Shot5'
import { Shot6 } from './shots/Shot6'
import { Shot7 } from './shots/Shot7'

// 时长: 5s + 10s + 15s + 12s + 8s + 15s + 9s = 74s
const SHOT_DURATIONS = [150, 300, 450, 360, 240, 450, 270]

const getShotStart = (index: number) => {
  return SHOT_DURATIONS.slice(0, index).reduce((a, b) => a + b, 0)
}

export const Gpt55Analysis: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#0a0a0a' }}>
      <Sequence from={getShotStart(0)} durationInFrames={SHOT_DURATIONS[0]}>
        <Shot1 subtitle="GPT-5.5来了！多项基准领先，但有一个项目它输了。" />
      </Sequence>
      <Sequence from={getShotStart(1)} durationInFrames={SHOT_DURATIONS[1]}>
        <Shot2 subtitle="你还在用GPT-5.4吗？推理能力提升8%，代码能力提升9%，计算机操作提升5%。差距已经拉开了。" />
      </Sequence>
      <Sequence from={getShotStart(2)} durationInFrames={SHOT_DURATIONS[2]}>
        <Shot3 subtitle="来看硬核数据。编码测试82.7%，远超Claude Opus的69.4%。数学推理51.7%，高难数学35.4%。网络安全81.8%，Claude只有73.1%。" />
      </Sequence>
      <Sequence from={getShotStart(3)} durationInFrames={SHOT_DURATIONS[3]}>
        <Shot4 subtitle="GPT-5.5最大的升级在Agent能力。它能自主完成复杂任务，跨多个工具协作，从写代码、做研究到分析数据，一条龙搞定。" />
      </Sequence>
      <Sequence from={getShotStart(4)} durationInFrames={SHOT_DURATIONS[4]}>
        <Shot5 subtitle="速度和GPT-5.4一样快，但token效率更高，完成任务更省token，性价比直接拉满。" />
      </Sequence>
      <Sequence from={getShotStart(5)} durationInFrames={SHOT_DURATIONS[5]}>
        <Shot6 subtitle="但GPT-5.5并非无敌。BrowseComp网页浏览测试，Gemini 3.1 Pro拿到85.9%，反超了GPT-5.5的84.4%。所以选AI工具，别只看综合分。" />
      </Sequence>
      <Sequence from={getShotStart(6)} durationInFrames={SHOT_DURATIONS[6]}>
        <Shot7 subtitle="想了解GPT-5.5怎么用最有效？关注我，下期出实战教程。觉得有用就点赞收藏，我们下期见。" />
      </Sequence>
    </AbsoluteFill>
  )
}
