# Audio Enhancement for Remotion Videos

## Summary

Upgrade the audio layer from "single BGM track + manually-declared SFX" to "role-aware BGM segmentation + voiceover ducking + auto-bound SFX". Three additions: BGM segments that change with shot role (Hook/痛点/核心/CTA), fade-based ducking that lowers BGM during voiceover, and SFX that activate automatically based on shot role + text effects.

## Problem

Current videos suffer from three audio symptoms:

1. **One BGM track for the entire video**: Hook and CTA share the same music — emotional beats don't track narrative arc.
2. **BGM fights voiceover**: Constant BGM volume (0.08) requires keeping music quiet enough for speech, which makes BGM nearly inaudible during silent moments.
3. **SFX always forgotten**: Scripts must hand-declare every `**音效**`, so creators routinely skip them; videos feel "untextured".

## Design Decisions

- **Auto-segment BGM by shot role**: Use the existing video-script structural roles (Hook / 痛点 / 核心 / CTA / 金句) to drive BGM track selection per segment, with crossfade between segments.
- **Fade-based ducking, not real-time analysis**: Use `voiceover-manifest.json` segment timestamps to drive `volume={frame => ...}` callback. 0.2s fade between 0.5 (rest) and 0.15 (during speech) — smooth, not abrupt, no audio analysis cost.
- **SFX auto-bind, script can `+/-`**: Default SFX injection by shot role + text effect tags. Scripts opt in/out granularly via `**音效**: +text-pop` or `**音效**: -whoosh` syntax.
- **Roles must be explicit in scripts**: Add a `**角色**` field per shot so audio binding has a deterministic input (no LLM re-classification at render time).

---

## Part 1: BGM Segmentation

### Concept

Compose BGM as an array of segments, one per shot or contiguous shot group. Each segment plays a different BGM file; consecutive segments crossfade over 0.5s to mask the transition.

### Auto-segmentation rule (modifies `remotion-video/SKILL.md`)

Read each shot's `**角色**` field and group adjacent shots with the same role:

| Shot role | Default BGM track |
|-----------|-------------------|
| Hook | `epic-slow.mp3` (cinematic opener) |
| 痛点 | `tense-medium.mp3` (NEW — see Part 4) |
| 核心 | `tech-medium.mp3` (steady, focused) |
| 金句 | `warm-medium.mp3` (warm, reflective) |
| CTA | `upbeat-medium.mp3` (energetic close) |
| (unmapped) | inherit previous segment's track |

Adjacent shots with the same mapped track merge into one segment to avoid pointless crossfades.

### Script-level override

```markdown
# 视频标题

**BGM**: hook=epic-slow | core=tech-medium | cta=upbeat-medium
```

Format: `**BGM**: <role>=<track-name> | <role>=<track-name> | ...`

Track name = file stem in `remotion/public/audio/bgm/` (e.g. `tech-medium`). If a role is omitted from the override, falls back to the auto rule.

Special override `**BGM**: off` disables BGM entirely (useful for somber/ASMR styles).

### Component: `remotion/src/components/BGMAudio.tsx` (rewrite)

**Current signature** (replaced):
```tsx
<BGMAudio style="科技电子" tempo="medium" volume={0.08} />
```

**New signature**:
```tsx
interface BGMSegment {
  fromFrame: number
  durationInFrames: number
  track: string  // file stem, e.g. 'tech-medium'
}

interface BGMAudioProps {
  segments: BGMSegment[]
  voiceoverSegments: VoiceoverSegment[]  // for ducking; comes from manifest
  baseVolume?: number          // default 0.5
  duckVolume?: number          // default 0.15
  duckFadeFrames?: number      // default 6 (0.2s @ 30fps)
  crossfadeFrames?: number     // default 15 (0.5s @ 30fps)
}
```

Internally renders one `<Audio>` per segment, each with `volume={frame => computeVolume(frame, this segment, voiceoverSegments)}`. Adjacent segments overlap by `crossfadeFrames` to crossfade — first segment fades out while next fades in.

The `computeVolume` function:
```
1. If frame outside this segment's [fromFrame, fromFrame + durationInFrames + crossfadeFrames]: return 0
2. Compute base envelope (0 → baseVolume → 0 with crossfade ramps at start/end)
3. If any voiceover segment overlaps current frame: smoothly duck to duckVolume over duckFadeFrames at edges
4. Return min(base, ducked)
```

---

## Part 2: Ducking

### Voiceover input

`BGMAudio` receives `voiceoverSegments` directly from `voiceover-manifest.json` (already produced by `/voiceover-tts`). Each segment has `start` and `end` in seconds.

### Ducking envelope

For each frame, find whether it falls inside any voiceover segment (with `duckFadeFrames` padding on each side):

```
isVoiceoverActive(frame):
  for v in voiceoverSegments:
    if v.start * fps - duckFadeFrames < frame < v.end * fps + duckFadeFrames:
      return distance from edge in frames

multiplier = interpolate(distanceFromEdge, [0, duckFadeFrames], [baseVolume, duckVolume], { extrapolateRight: 'clamp' })
```

Edge-based interpolation gives smooth fade-in/out at voiceover boundaries instead of step changes.

### Defaults

- `baseVolume = 0.5` (audible during silence)
- `duckVolume = 0.15` (clearly behind voiceover)
- `duckFadeFrames = 6` (0.2s fade)

These defaults apply unconditionally when `voiceoverSegments` is provided. Scripts cannot override per-shot ducking values — keeping the audio mix consistent across the video matters more than per-shot tuning.

---

## Part 3: SFX Auto-Binding

### Auto-injection rules (modifies `remotion-video/SKILL.md`)

When generating each shot, inject SFX based on shot role + text effects:

| Trigger | SFX file | Timing |
|---------|----------|--------|
| Shot role = Hook (first shot only) | `riser.mp3` | shot start, frame 0 |
| Shot role = CTA | `reveal.mp3` then `success.mp3` | start, then +1s |
| Shot role = (any), index > 0 | `whoosh.mp3` (transition sound) | shot start, frame 0 |
| Last shot in video | `outro.mp3` | end – 1s |
| `**文字特效**: typewriter` | `ding.mp3` | repeat per typed-data segment (2-3 times max) |
| Shot role contains 数据/统计/对比 | `ding.mp3` | shot start + 0.5s |

### Script `+/-` syntax

```markdown
### 镜头 3：核心数据
**角色**: 数据
**音效**: -whoosh, +text-pop @1s
```

Tokens:
- `+<name>` — add SFX in addition to auto-bound
- `-<name>` — remove this auto-bound SFX
- `<name>` (no prefix) — replace all auto-bound with explicit list (legacy compat)
- `@<seconds>s` after a name — explicit timing offset within the shot

Comma-separated.

### Component: `remotion/src/components/SFXLayer.tsx` (extend)

Existing `effects` prop kept; add resolved SFX list at composition generation time, not runtime. The skill computes the final list per shot and emits `<SFXLayer effects={[...]}>` with concrete configs.

---

## Part 4: BGM Library Expansion

Add the missing 紧张悬疑 (tense) tracks to `remotion/public/audio/bgm/`:

- `tense-slow.mp3`
- `tense-medium.mp3`

Source: free CC0 music libraries (Pixabay Music, Free Music Archive). Manually curated to fit "tense / suspense" mood at appropriate tempos.

**Download must be asynchronous and parallel** — kick off both downloads in background, continue with other plan steps, wait only when ready to test.

Update `BGM_STYLE_MAP` in `remotion/src/components/constants.ts` to include the `紧张悬疑 → tense` mapping.

---

## Part 5: Skill Integration

### Modifications to `video-script/SKILL.md`

Add a mandatory `**角色**` field per shot. Allowed values:

| Role | Meaning |
|------|---------|
| `Hook` | Opening hook, attention grabber |
| `痛点` | Problem statement |
| `核心` | Core content / explanation / demo |
| `数据` | Data / statistics / comparison |
| `金句` | Quote / takeaway / memorable line |
| `CTA` | Call to action / closing |

Make role inference part of script generation — the skill already understands these shot types implicitly; this just makes the classification explicit.

### Modifications to `remotion-video/SKILL.md`

Replace the existing "Audio System → BGM Integration" section. New content covers:
- BGM segment computation from shot roles
- `**BGM**` script override syntax
- Ducking enabled by default when manifest exists
- SFX auto-injection table + `+/-` syntax

Add to FATAL RULES:
- "BGMAudio must receive `voiceoverSegments` whenever `voiceover-manifest.json` exists. Without ducking, BGM smothers voiceover."

---

## File Structure

```
remotion/
├── public/audio/bgm/
│   ├── tense-slow.mp3                 # NEW
│   ├── tense-medium.mp3               # NEW
│   └── (existing 10 BGM files)
├── src/components/
│   ├── BGMAudio.tsx                   # MODIFIED (rewrite for segments + ducking)
│   ├── SFXLayer.tsx                   # MODIFIED (compatible with new resolution model)
│   └── constants.ts                   # MODIFIED (+ tense mapping)

.claude/skills/
├── video-script/SKILL.md              # MODIFIED (mandatory **角色** field)
└── remotion-video/SKILL.md            # MODIFIED (BGM segmentation + ducking + SFX auto)
```

---

## Error Handling

| Failure | Behavior |
|---------|----------|
| Shot role missing in old script | Default to `核心` for non-first/non-last, `Hook` for first, `CTA` for last; warn |
| BGM track file missing | Skill warns at generation, omits that segment, render continues |
| Voiceover manifest missing | BGM plays at constant `baseVolume` without ducking; warn |
| Unknown SFX in `+name` | Skill warns, omits that effect |
| Tense BGM download fails | Fall back to `epic-slow` for 痛点 role; warn user to retry download |

---

## Testing Strategy

- **Unit tests**: `computeVolume` function with known voiceover segments — verify ducking ramp at known boundaries.
- **Integration test**: Render a 3-shot demo composition with mock voiceover, inspect output waveform for expected envelope (BGM peak at 0.5, dip to 0.15 during voiceover regions).
- **Manual verification**: Re-render `2026-04-25-deepseek-v4` with new pipeline; listen to confirm BGM transitions and voiceover clarity.

---

## Out of Scope

- Real-time voiceover analysis (Web Audio FFT) — deferred; manifest-based ducking is good enough.
- Per-shot ducking parameter overrides — global defaults stay consistent.
- BGM beat-syncing to shot transitions — would require BGM tempo metadata + shot-duration tuning, deferred.
- Stem-based BGM (separate drums/melody tracks for selective ducking) — out of scope.
- Auto-mastering / loudness normalization (LUFS targets) — assume source files are pre-mastered.

---

## Success Criteria

- BGM changes track at least once across a typical 6-shot script (Hook → core boundary minimum)
- Voiceover audibly clearer than before; BGM clearly drops during speech and rises during silences
- A typical 6-shot script auto-injects ≥3 SFX (riser + whoosh transitions + outro at minimum) with zero manual `**音效**` declarations
- Old scripts without `**角色**` field still render correctly (with default role inference + warning)
- Tense BGM tracks present in `remotion/public/audio/bgm/` and used automatically for 痛点 shots
