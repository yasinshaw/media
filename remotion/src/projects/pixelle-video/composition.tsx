// Theme: Ocean — 技术/产品/AI
import React from 'react'
import { AbsoluteFill, staticFile } from 'remotion'
import { TransitionSeries, linearTiming } from '@remotion/transitions'
import { slide } from '@remotion/transitions/slide'
import { wipe } from '@remotion/transitions/wipe'
import { fade } from '@remotion/transitions/fade'
import { flip } from '@remotion/transitions/flip'
import { Audio } from '@remotion/media'
import { BGMAudio, SFXLayer } from '../../components'
import { SHOT_DURATIONS, SHOT_SUBTITLES } from './theme'
import { Shot1 } from './shots/Shot1'
import { Shot2 } from './shots/Shot2'
import { Shot3 } from './shots/Shot3'
import { Shot4 } from './shots/Shot4'
import { Shot5 } from './shots/Shot5'
import { Shot6 } from './shots/Shot6'
import { Shot7 } from './shots/Shot7'
import { Shot8 } from './shots/Shot8'
import { Shot9 } from './shots/Shot9'

const transitionTiming = linearTiming({ durationInFrames: 15 })
const flipTiming = linearTiming({ durationInFrames: 18 })

const voiceoverSegments = SHOT_SUBTITLES.flat().map((s) => ({ start: s.start, end: s.end }))

const sfxPerShot: Record<number, { type: string }[]> = {
  0: [{ type: 'whoosh-in' }],
  2: [{ type: 'impact' }, { type: 'text-pop' }],
  3: [{ type: 'text-pop' }],
  5: [{ type: 'impact' }],
  6: [{ type: 'impact' }],
  7: [{ type: 'text-pop' }],
  8: [{ type: 'outro' }],
}

export const PixelleVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#0F172A' }}>
      <BGMAudio
        style="科技电子"
        tempo="medium"
        volume={0.08}
        voiceoverSegments={voiceoverSegments}
      />

      <Audio src={staticFile('/audio/pixelle-video/voiceover-full.mp3')} volume={1} />

      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={SHOT_DURATIONS[0]}>
          <Shot1 />
          {sfxPerShot[0] && <SFXLayer effects={sfxPerShot[0]} />}
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: 'from-bottom' })}
          timing={transitionTiming}
        />

        <TransitionSeries.Sequence durationInFrames={SHOT_DURATIONS[1]}>
          <Shot2 />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={wipe()}
          timing={transitionTiming}
        />

        <TransitionSeries.Sequence durationInFrames={SHOT_DURATIONS[2]}>
          <Shot3 />
          {sfxPerShot[2] && <SFXLayer effects={sfxPerShot[2]} />}
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={transitionTiming}
        />

        <TransitionSeries.Sequence durationInFrames={SHOT_DURATIONS[3]}>
          <Shot4 />
          {sfxPerShot[3] && <SFXLayer effects={sfxPerShot[3]} />}
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: 'from-right' })}
          timing={transitionTiming}
        />

        <TransitionSeries.Sequence durationInFrames={SHOT_DURATIONS[4]}>
          <Shot5 />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={flip()}
          timing={flipTiming}
        />

        <TransitionSeries.Sequence durationInFrames={SHOT_DURATIONS[5]}>
          <Shot6 />
          {sfxPerShot[5] && <SFXLayer effects={sfxPerShot[5]} />}
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: 'from-left' })}
          timing={transitionTiming}
        />

        <TransitionSeries.Sequence durationInFrames={SHOT_DURATIONS[6]}>
          <Shot7 />
          {sfxPerShot[6] && <SFXLayer effects={sfxPerShot[6]} />}
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={transitionTiming}
        />

        <TransitionSeries.Sequence durationInFrames={SHOT_DURATIONS[7]}>
          <Shot8 />
          {sfxPerShot[7] && <SFXLayer effects={sfxPerShot[7]} />}
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={transitionTiming}
        />

        <TransitionSeries.Sequence durationInFrames={SHOT_DURATIONS[8]}>
          <Shot9 />
          {sfxPerShot[8] && <SFXLayer effects={sfxPerShot[8]} />}
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  )
}

const TOTAL_TRANSITION_FRAMES = 123 // 7×15 + 1×18
export const durationInFrames = SHOT_DURATIONS.reduce((sum, d) => sum + d, 0) - TOTAL_TRANSITION_FRAMES
