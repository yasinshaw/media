import { AbsoluteFill, Sequence } from 'remotion'
import React from 'react'
import { Shot1 } from './shots/Shot1'
import { Shot2 } from './shots/Shot2'
import { Shot3 } from './shots/Shot3'
import { Shot4 } from './shots/Shot4'
import { Shot5 } from './shots/Shot5'
import { Shot6 } from './shots/Shot6'

// 30fps → 5s = 150 frames, etc.
const SHOT_DURATIONS = [
  150,   // Shot 1: 0-5s
  300,   // Shot 2: 5-15s
  600,   // Shot 3: 15-35s
  750,   // Shot 4: 35-60s
  450,   // Shot 5: 60-75s
  300,   // Shot 6: 75-85s
]

// Calculate cumulative frame positions
const getShotStart = (index: number) => {
  return SHOT_DURATIONS.slice(0, index).reduce((a, b) => a + b, 0)
}

export const GptImage2Compare: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#0a0a0a' }}>
      {/* Audio track - place voiceover file at public/gpt-image2-compare.mp3 */}
      {/* Uncomment when audio file is ready: */}
      {/* <Audio src="/gpt-image2-compare.mp3" volume={1} /> */}

      {/* Shot 1: Hook (0-5s) */}
      <Sequence from={0} durationInFrames={SHOT_DURATIONS[0]}>
        <Shot1 />
      </Sequence>

      {/* Shot 2: Pain Point (5-15s) */}
      <Sequence from={getShotStart(1)} durationInFrames={SHOT_DURATIONS[1]}>
        <Shot2 />
      </Sequence>

      {/* Shot 3: Text Rendering (15-35s) */}
      <Sequence from={getShotStart(2)} durationInFrames={SHOT_DURATIONS[2]}>
        <Shot3 />
      </Sequence>

      {/* Shot 4: Comparison (35-60s) */}
      <Sequence from={getShotStart(3)} durationInFrames={SHOT_DURATIONS[3]}>
        <Shot4 />
      </Sequence>

      {/* Shot 5: Architecture (60-75s) */}
      <Sequence from={getShotStart(4)} durationInFrames={SHOT_DURATIONS[4]}>
        <Shot5 />
      </Sequence>

      {/* Shot 6: CTA (75-85s) */}
      <Sequence from={getShotStart(5)} durationInFrames={SHOT_DURATIONS[5]}>
        <Shot6 />
      </Sequence>
    </AbsoluteFill>
  )
}
