import { AbsoluteFill, Sequence, staticFile } from 'remotion'
import { Audio } from '@remotion/media'
import React from 'react'
import { Shot1 } from './shots/Shot1'
import { Shot2 } from './shots/Shot2'
import { Shot3 } from './shots/Shot3'
import { Shot4 } from './shots/Shot4'
import { Shot5 } from './shots/Shot5'
import { Shot6 } from './shots/Shot6'
import { Shot7 } from './shots/Shot7'

const Gpt55: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Shot 1: 钩子 (0-5s) */}
      <Sequence from={0} durationInFrames={150}>
        <Shot1 subtitle="GPT-5.5来了！多项基准领先，但有一个项目它输了。" />
        <Audio src={staticFile('/audio/gpt55/voiceover-01.mp3')} />
      </Sequence>

      {/* Shot 2: 痛点引入 (5-15s) */}
      <Sequence from={150} durationInFrames={300}>
        <Shot2 subtitle="你还在用GPT-5.4吗？推理能力提升8%，代码能力提升9%，计算机操作提升5%。差距已经拉开了。" />
        <Audio src={staticFile('/audio/gpt55/voiceover-02.mp3')} />
      </Sequence>

      {/* Shot 3: 核心内容：编码与安全 (15-30s) */}
      <Sequence from={450} durationInFrames={450}>
        <Shot3 subtitle="来看硬核数据。编码测试82.7%，远超Claude Opus的69.4%。数学推理51.7%，高难数学35.4%。网络安全81.8%，Claude只有73.1%。" />
        <Audio src={staticFile('/audio/gpt55/voiceover-03.mp3')} />
      </Sequence>

      {/* Shot 4: 核心内容：Agent能力升级 (30-42s) */}
      <Sequence from={900} durationInFrames={360}>
        <Shot4 subtitle="GPT-5.5最大的升级在Agent能力。它能自主完成复杂任务，跨多个工具协作，从写代码、做研究到分析数据，一条龙搞定。" />
        <Audio src={staticFile('/audio/gpt55/voiceover-04.mp3')} />
      </Sequence>

      {/* Shot 5: 核心内容：效率优势 (42-50s) */}
      <Sequence from={1260} durationInFrames={240}>
        <Shot5 subtitle="速度和GPT-5.4一样快，但token效率更高，完成任务更省token，性价比直接拉满。" />
        <Audio src={staticFile('/audio/gpt55/voiceover-05.mp3')} />
      </Sequence>

      {/* Shot 6: 反转：并非完美 (50-65s) */}
      <Sequence from={1500} durationInFrames={450}>
        <Shot6 subtitle="但GPT-5.5并非无敌。BrowseComp网页浏览测试，Gemini 3.1 Pro拿到85.9%，反超了GPT-5.5的84.4%。所以选AI工具，别只看综合分。" />
        <Audio src={staticFile('/audio/gpt55/voiceover-06.mp3')} />
      </Sequence>

      {/* Shot 7: CTA收尾 (65-74s) */}
      <Sequence from={1950} durationInFrames={270}>
        <Shot7 subtitle="想了解GPT-5.5怎么用最有效？关注我，下期出实战教程。觉得有用就点赞收藏，我们下期见。" />
        <Audio src={staticFile('/audio/gpt55/voiceover-07.mp3')} />
      </Sequence>
    </AbsoluteFill>
  )
}

export default Gpt55
