# Audio Enhancement for Remotion Videos

## Summary

Upgrade the audio layer from "single BGM track + manually-declared SFX" to "role-aware BGM segmentation + voiceover ducking + auto-bound SFX". Three additions: BGM segments that change with shot role (Hook/痛点/核心/CTA), fade-based ducking that lowers BGM during voiceover, and SFX that activate automatically based on shot role + text effects.

This spec replaces the BGM/SFX design from `docs/superpowers/specs/2026-04-27-bgm-sfx-design.md`. Volume scale and constants in `remotion/src/components/constants.ts` are preserved — this spec adds segmentation and ducking on top of the existing volume conventions, not a rescale.

## Problem

Current videos suffer from three audio symptoms:

1. **One BGM track for the entire video**: Hook and CTA share the same music — emotional beats don't track narrative arc.
2. **BGM fights voiceover**: Constant BGM volume requires keeping music quiet enough for speech, which makes BGM nearly inaudible during silent moments.
3. **SFX always forgotten**: Scripts must hand-declare every `**音效**`, so creators routinely skip them; videos feel "untextured".

## Design Decisions

- **Auto-segment BGM by shot role**: Use the existing video-script structural roles (Hook / 痛点 / 核心 / CTA / 金句) to drive BGM track selection per segment, with crossfade between segments.
- **Fade-based ducking, not real-time analysis**: Use `voiceover-manifest.json` segment timestamps to drive `volume={frame => ...}` callback. Smooth fade between rest and ducked levels using existing `BGM.DEFAULT_VOLUME` and `BGM.DUCKED_VOLUME` constants.
- **Reuse existing volume scale**: `BGM.DEFAULT_VOLUME = 0.06` (rest), `BGM.DUCKED_VOLUME = 0.02` (during voiceover). Same numbers used today; the ducking math just makes the transitions smooth and adds segmentation.
- **SFX auto-bind, script can `+/-`**: Default SFX injection by shot role + text effect tags. Scripts opt in/out granularly via `+/-` syntax with deterministic precedence rules.
- **Roles must be explicit in scripts**: Add a `**角色**` field per shot so audio binding has a deterministic input (no LLM re-classification at render time).
- **Backward compatibility**: Scripts with no `**角色**` annotations on any shot fall back to the existing single-track BGM behavior. Mixed scripts (some annotated, some not) emit a warning and also use single-track behavior.

---

## Part 1: BGM Segmentation

### Concept

Compose BGM as an array of segments, one per shot role group. Each segment plays a different BGM file; consecutive segments crossfade to mask the transition. The first segment fades in at video start; the last segment fades out at video end.

### Auto-segmentation rule (modifies `remotion-video/SKILL.md`)

Read each shot's `**角色**` field and group adjacent shots with the same **mapped BGM track** (not the same role — different roles can map to the same track and merge into one segment):

| Shot role | Default BGM track |
|-----------|-------------------|
| Hook | `epic-slow.mp3` (cinematic opener) |
| 痛点 | `tense-medium.mp3` (NEW — see Part 4) |
| 核心 | `tech-medium.mp3` (steady, focused) |
| 金句 | `warm-medium.mp3` (warm, reflective) |
| CTA | `upbeat-medium.mp3` (energetic close) |

Adjacent shots with the same mapped track merge into one segment to avoid pointless crossfades.

If `tense-*.mp3` files are missing at generation time, 痛点 falls back to `epic-slow.mp3` and a warning is emitted (Part 4 covers the download).

### Backward compatibility

If `**角色**` annotations are missing across the script:
- **All shots missing**: Skill emits single-track BGM using whichever style was specified in `**BGM**` field, or default `tech-medium`. Behavior matches today.
- **Some shots missing**: Skill emits warning listing the unannotated shots. Treats script as "all missing" → single-track BGM.

This avoids surprising old projects with multi-segment BGM they didn't ask for.

### Script-level override

```markdown
# 视频标题

**BGM**: hook=epic-slow | core=tech-medium | cta=upbeat-medium
```

Format: `**BGM**: <role>=<track-name> | <role>=<track-name> | ...`

Track name = file stem in `remotion/public/audio/bgm/` (e.g. `tech-medium`). If a role is omitted from the override, falls back to the auto rule.

Special override `**BGM**: off` disables BGM entirely.

The legacy syntax `**BGM**: 科技电子 | medium | 0.08` (style | tempo | volume) is also still parsed — it forces single-track BGM with the specified style. Migration is opt-in.

### Component: `remotion/src/components/BGMAudio.tsx` (rewrite)

**Current single-track signature** (still supported via legacy mode):
```tsx
<BGMAudio style="科技电子" tempo="medium" volume={0.06} />
```

**New segmented signature**:
```tsx
interface BGMSegment {
  fromFrame: number          // narrative start (where this segment begins driving the mix)
  durationInFrames: number   // narrative duration (excludes the crossfade tail with next segment)
  track: string              // file stem, e.g. 'tech-medium'
}

interface BGMAudioProps {
  segments: BGMSegment[]
  voiceoverSegments?: VoiceoverSegment[]  // for ducking; comes from manifest. Each segment has `{ start, end }` in SECONDS (not frames) — converted to frames inside computeBgmVolume via fps
  // The following all default to existing constants in constants.ts
  baseVolume?: number          // default BGM.DEFAULT_VOLUME (0.06)
  duckVolume?: number          // default BGM.DUCKED_VOLUME (0.02)
  duckFadeFrames?: number      // default round(BGM.DUCK_FADE_SECONDS * fps) = 9
  crossfadeFrames?: number     // default 30 (1s) — between adjacent BGM segments
  fadeInFrames?: number        // default round(BGM.FADE_IN_SECONDS * fps) = 45 (first segment)
  fadeOutFrames?: number       // default round(BGM.FADE_OUT_SECONDS * fps) = 75 (last segment)
}
```

### Crossfade math (explicit)

For two adjacent segments N and N+1:
- Segment N's "narrative window" = `[N.fromFrame, N.fromFrame + N.durationInFrames)`
- Segment N+1's `fromFrame` = `N.fromFrame + N.durationInFrames` (no gap)
- Crossfade region = `[N+1.fromFrame - crossfadeFrames, N+1.fromFrame + crossfadeFrames]`
  - At the start of this region: N is at full base, N+1 at 0
  - At the midpoint (N+1.fromFrame): both at 50%
  - At the end: N at 0, N+1 at full base
- Both audios mount across the crossfade region. Their volumes use overlapping `interpolate` ranges.

### Boundary fades (separate from crossfade)

- First segment: extra fade-in from 0 → baseVolume over `fadeInFrames` starting at frame 0 (independent of crossfade-out math)
- Last segment: fade-out from baseVolume → 0 over `fadeOutFrames` ending at the last frame of the video

### `computeVolumeForSegment(frame, segIndex, segments, voiceoverSegments)` algorithm

```
1. Let seg = segments[segIndex], prev = segments[segIndex-1] (may be undefined), next = segments[segIndex+1].

2. Compute base envelope:
   a. If segIndex === 0: fadeInRamp = interpolate(frame, [0, fadeInFrames], [0, 1], clamp).
      Else if frame is in crossfade-with-prev region: ramp from 0 → 1 across that region.
      Else: 1.

   b. If segIndex === segments.length - 1: fadeOutRamp = interpolate(frame, [videoEnd - fadeOutFrames, videoEnd], [1, 0], clamp).
      Else if frame is in crossfade-with-next region: ramp from 1 → 0 across that region.
      Else: 1.

   c. Outside [seg's full audio window incl. crossfades on both sides]: return 0.

   base = baseVolume * fadeInRamp * fadeOutRamp

3. If voiceoverSegments provided, compute duck factor:
   distFromVoiceoverEdge = min over all voiceover segments v of:
     - if frame is between v.start*fps and v.end*fps: 0 (fully ducked)
     - if frame is within duckFadeFrames of v.start*fps or v.end*fps: ramp distance
     - else: Infinity

   if distFromVoiceoverEdge is finite:
     duckedLevel = interpolate(distFromVoiceoverEdge, [0, duckFadeFrames], [duckVolume, baseVolume], clamp)
     return min(base, duckedLevel)
   else:
     return base
```

The implementation lives in a pure function `computeBgmVolume()` exported alongside `BGMAudio` for direct unit testing.

### `voiceoverSegments` provenance

`/remotion-video` reads `voiceover-manifest.json` at composition-generation time, flattens all `segments[].subtitles[]` into a single array of `{ start, end }` ranges (one per voiceover utterance), and inlines that array as a literal in `composition.tsx` to pass into `<BGMAudio>`. Changes to the manifest require regenerating composition.tsx.

If the manifest is missing entirely, `BGMAudio` receives `voiceoverSegments={undefined}` and runs without ducking — BGM at constant `baseVolume` minus boundary fades.

---

## Part 2: SFX Auto-Binding

### Auto-injection rules

Computed at composition-generation time by `/remotion-video`, then passed to `<SFXLayer effects={[...]}>` via the existing prop. **No `SFXLayer.tsx` code change needed.**

Rule application order (apply each rule, accumulate effects, deduplicate by `(name, delay)` keeping last):

1. **First shot only**: If shot role = `Hook`, add `riser.mp3` at frame 0
2. **Transition** (every shot index ≥ 1, applied first): add `whoosh.mp3` at frame 0
3. **Role-specific** (overrides transition for the shot's start): if role = `CTA`, replace any frame-0 effect with `reveal.mp3` at frame 0 + `success.mp3` at frame 1.0s
4. **Data emphasis**: If role = `数据`, add `ding.mp3` at frame 0.5s
5. **Typewriter emphasis**: If `**文字特效**: typewriter`, add `ding.mp3` at frame 0.3s and frame 1.5s (max 2 instances per shot to avoid noise)
6. **Last shot only**: add `outro.mp3` at frame `(shotDuration - 1.0s)`. If the last shot is also CTA, this means `reveal` (0s) + `success` (1s) + `outro` (shotDuration - 1s) all play; verify CTA shots are ≥ 3s long to avoid overlap (otherwise emit warning at composition-generation time and drop `success` to keep the finale clean)

This produces the following behaviors:
- Hook (first shot): `riser` only (no whoosh — first shot has no preceding transition)
- 痛点 / 核心 / 金句 / 数据 (mid shots, index ≥ 1): `whoosh` at start; 数据 also gets `ding` at 0.5s
- CTA: `reveal` + `success` (no whoosh — role-specific replaces transition)
- Last shot (whichever role): all the above, plus `outro` at end

The "contains 数据/统计/对比" loose substring matching from the previous draft is removed. Only the explicit `数据` role triggers ding. Authors who want ding for non-data shots use `**音效**: +ding` (Part 2 syntax below).

### Script `+/-` syntax with deterministic precedence

```markdown
### 镜头 3：核心数据
**角色**: 数据
**音效**: -whoosh, +text-pop @1s
```

Parser rules (deterministic):

1. Split on commas, trim each token
2. Categorize each token:
   - Starts with `+` → ADD
   - Starts with `-` → REMOVE
   - Otherwise → BARE (replace mode)
3. **If any BARE token is present alongside any `+/-` tokens**: emit warning, ignore the `+/-` tokens, use BARE as full replacement
4. **If only BARE tokens**: replace auto-bound list with explicit list (legacy compat — equivalent to today's behavior)
5. **If only `+/-` tokens**: apply REMOVE to auto-bound list first, then ADD

Token format:
- Name: matches `SFX_FILE_MAP` keys
- Optional `@<n>s` (after the name with no space): timing offset within the shot in seconds
- Default delay = `SFX.DEFAULT_DELAYS[name]` from `constants.ts`

Examples:
- `**音效**: -whoosh, +ding @0.4s` → drop auto whoosh, add ding at 0.4s
- `**音效**: text-pop` → bare; replace all auto with just text-pop at default delay
- `**音效**: text-pop, +ding` → invalid mix; warn, fall back to `text-pop` only

### Component: `remotion/src/components/SFXLayer.tsx`

**No code changes.** The existing `effects: SFXConfig[]` prop is sufficient. The skill computes the resolved list per shot and emits:

```tsx
<SFXLayer effects={[
  { name: 'whoosh', delay: 0, volume: 0.5 },
  { name: 'ding', delay: 0.5, volume: 0.5 },
]} />
```

If the resolved list is empty, the skill omits `<SFXLayer>` from the shot's Sequence entirely.

---

## Part 3: BGM Library Expansion

Add the missing 紧张悬疑 (tense) tracks to `remotion/public/audio/bgm/`:

- `tense-slow.mp3`
- `tense-medium.mp3`

### Source and procedure

Files are committed to the repo (not downloaded at render time). One-time setup script: `scripts/download-tense-bgm.sh` (or `.ts`).

The script:
1. Downloads from a hardcoded list of CC0 source URLs (curated from Pixabay Music or Free Music Archive — chosen by the implementer to fit "tense / suspense" mood)
2. Downloads run in parallel (`curl &`/`wait` or equivalent)
3. Validates each file is non-empty MP3 (basic header check)
4. Places files in `remotion/public/audio/bgm/`
5. The implementer commits the resulting files to git so future renders don't re-download

Operationally, the implementer runs the script once, listens to verify mood/tempo fits, then commits. The script is checked in for reproducibility.

### Constants update

In `remotion/src/components/constants.ts`, extend `BGM_STYLE_MAP`:

```ts
export const BGM_STYLE_MAP: Record<string, string> = {
  '科技电子': 'tech',
  '轻松愉快': 'upbeat',
  '紧张悬疑': 'tense',   // NEW
  '温馨抒情': 'warm',
  '史诗大气': 'epic',
  '轻快节奏': 'light',
}
```

Part 3 is a precondition for Part 1 only for 痛点 shots. If Part 3 ships later, Part 1 still works — 痛点 falls back to `epic-slow` per the existing rule.

---

## Part 4: Skill Integration

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

**Cross-spec dependency**: The `**角色**` field is also consumed by `/asset-pack` (sibling spec `2026-04-30-asset-pack-skill-design.md`) to determine media-type preferences (video vs image) per shot. Both specs depend on this `video-script/SKILL.md` change; landing the change is a shared prerequisite.

### Modifications to `remotion-video/SKILL.md`

Replace the existing "Audio System → BGM Integration" section with the new content covering:
- BGM segment computation from shot roles (Part 1)
- `**BGM**` script override syntax (segment form + legacy form)
- Ducking enabled by default when manifest exists, plus the `voiceoverSegments` flattening procedure
- SFX auto-injection rules and `+/-` syntax (Part 2)

Add to FATAL RULES:
- "BGMAudio must receive `voiceoverSegments` whenever `voiceover-manifest.json` exists. Without ducking, BGM smothers voiceover."

---

## File Structure

```
remotion/
├── public/audio/bgm/
│   ├── tense-slow.mp3                 # NEW (committed to repo)
│   ├── tense-medium.mp3               # NEW (committed to repo)
│   └── (existing 10 BGM files)
├── src/components/
│   ├── BGMAudio.tsx                   # MODIFIED (rewrite for segments + ducking; legacy mode preserved)
│   ├── SFXLayer.tsx                   # UNCHANGED
│   └── constants.ts                   # MODIFIED (+ 紧张悬疑 mapping)

scripts/
└── download-tense-bgm.sh              # NEW (one-time setup, checked in)

.claude/skills/
├── video-script/SKILL.md              # MODIFIED (mandatory **角色** field)
└── remotion-video/SKILL.md            # MODIFIED (BGM segmentation + ducking + SFX auto)
```

---

## Worked Example

A 6-shot script:

```
Shot 1: Hook
Shot 2: 痛点
Shot 3: 核心
Shot 4: 数据
Shot 5: 核心
Shot 6: CTA
```

Resulting BGM segments (assuming each shot is 5s = 150 frames):
- Segment 1: `epic-slow`, fromFrame 0, duration 150 (Hook)
- Segment 2: `tense-medium`, fromFrame 150, duration 150 (痛点)
- Segment 3: `tech-medium`, fromFrame 300, duration 450 (核心 + 数据 + 核心 merged — same track)
- Segment 4: `upbeat-medium`, fromFrame 750, duration 150 (CTA)

Resulting SFX list:
- Shot 1: `riser` @ 0s
- Shot 2: `whoosh` @ 0s
- Shot 3: `whoosh` @ 0s
- Shot 4: `whoosh` @ 0s, `ding` @ 0.5s
- Shot 5: `whoosh` @ 0s
- Shot 6: `reveal` @ 0s, `success` @ 1.0s, `outro` @ (shotDuration - 1.0s)

---

## Error Handling

| Failure | Behavior |
|---------|----------|
| All shots missing `**角色**` | Single-track BGM (legacy mode) using `**BGM**` field or default; warn |
| Some shots missing `**角色**` | Warn listing them; treat as all missing → single-track BGM |
| BGM track file missing | Skill warns at generation, falls back to `tech-medium` for that segment |
| Tense BGM files missing | 痛点 falls back to `epic-slow`; warn user to run `scripts/download-tense-bgm.sh` |
| Voiceover manifest missing | BGM plays at `baseVolume` (with boundary fades only) without ducking; warn |
| SFX `+/-` mixed with bare names | Warn, ignore `+/-` tokens, use bare names as full replacement |
| Unknown SFX name in `+name` or bare | Skill warns, omits that effect |

---

## Testing Strategy

- **Unit tests**: `computeBgmVolume()` pure function with known inputs:
  - Single segment, no voiceover → constant baseVolume between fadeIn and fadeOut ramps
  - Two segments, no voiceover → crossfade region produces N+N+1 sum ≈ baseVolume at midpoint
  - One segment + voiceover at midpoint → ducked region with smooth ramps
  - Boundary fades at video start/end work correctly
- **Skill-level test**: Run `/remotion-video` against a 6-shot fixture script with all roles annotated; verify generated `composition.tsx` has expected BGM segments and SFX lists per shot
- **Manual verification**: Re-render `2026-04-25-deepseek-v4` with new pipeline; listen to confirm BGM transitions and voiceover clarity

---

## Out of Scope

- Real-time voiceover analysis (Web Audio FFT) — manifest-based ducking is sufficient
- Per-shot ducking parameter overrides — global defaults stay consistent
- BGM beat-syncing to shot transitions — would require BGM tempo metadata + shot-duration tuning, deferred
- Stem-based BGM (separate drums/melody tracks for selective ducking)
- Auto-mastering / loudness normalization (LUFS targets) — assume source files are pre-mastered
- Migration of existing rendered projects — this spec affects only future renders

---

## Success Criteria

- BGM changes track at least once across a typical 6-shot script (Hook → core boundary minimum, when all roles annotated)
- Voiceover audibly clearer than before; BGM clearly drops during speech and rises during silences
- A typical 6-shot script auto-injects ≥3 SFX (riser + whoosh transitions + outro at minimum) with zero manual `**音效**` declarations
- Old scripts without `**角色**` field render correctly using single-track legacy mode
- Tense BGM tracks present in `remotion/public/audio/bgm/` and used automatically for 痛点 shots
- Unit tests for `computeBgmVolume()` pass for the four scenarios above
