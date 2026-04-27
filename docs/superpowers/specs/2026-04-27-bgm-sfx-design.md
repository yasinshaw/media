# BGM & Sound Effects System for Remotion Videos

## Summary

Add background music and sound effects to Remotion video compositions. The system extends the existing `/video-script` → `/remotion-video` → `/video-review` pipeline with structured audio annotations in scripts, reusable Remotion audio components, and a local asset library supplemented by free-platform downloads.

## Problem

All current Remotion videos contain only voiceover (TTS) audio. No background music or sound effects, resulting in a flat, less engaging viewing experience typical of Douyin short videos.

## Design Decisions

- **Script-driven audio config**: BGM and SFX declared in script.md, parsed by `/remotion-video` — single source of truth, no extra config files.
- **Local asset library + free platform fallback**: Pre-curated BGM/SFX in `public/audio/bgm/` and `public/audio/sfx/`, auto-download from Pixabay when missing.
- **Two reusable components**: `BGMAudio` (full-video background music) and `SFXLayer` (per-shot sound effects).
- **Auto-inference by `/video-script`**: BGM style inferred from video topic, SFX inferred from shot content.

---

## Part 1: Script Format Extension

### Video-level BGM declaration (after title)

```markdown
**BGM**: 科技电子 | medium | 0.08
```

Format: `**BGM**: <style> | <tempo> | <volume>`

| Field | Values | Default | Description |
|-------|--------|---------|-------------|
| style | 科技电子, 轻松愉快, 紧张悬疑, 温馨抒情, 史诗大气 | 科技电子 | Maps to local BGM subdirectory |
| tempo | slow, medium, fast | medium | BGM speed variant |
| volume | 0.01–0.20 | 0.08 | BGM volume relative to voiceover |

### Shot-level SFX annotation (within each shot)

```markdown
### 镜头 1：标题亮相
**转场**: fade
**音效**: whoosh-in
**文字特效**: none
```

| SFX value | File | Trigger |
|-----------|------|---------|
| `whoosh-in` | `sfx/whoosh-in.mp3` | Shot start (first shot only) |
| `whoosh` | `sfx/whoosh.mp3` | Shot transition |
| `impact` | `sfx/impact.mp3` | Mid-shot, key data reveal |
| `text-pop` | `sfx/text-pop.mp3` | Text animation trigger |
| `outro` | `sfx/outro.mp3` | Last shot |

Multiple effects per shot: `**音效**: impact, text-pop`

Default: if `**音效**` is omitted, no auto-added sounds. Professional Douyin videos often avoid repetitive transition sounds — let `/video-script` explicitly decide when SFX adds value.

### Style mapping (Chinese → enum)

| Script value | Enum | Directory pattern |
|-------------|------|-------------------|
| 科技电子 | `tech` | `tech-*` |
| 轻松愉快 | `upbeat` | `upbeat-*` |
| 紧张悬疑 | `tense` | `tense-*` |
| 温馨抒情 | `warm` | `warm-*` |
| 史诗大气 | `epic` | `epic-*` |

---

## Part 2: Remotion Component Architecture

### New files

```
remotion/src/components/
├── BGMAudio.tsx          # Full-video background music
├── SFXLayer.tsx          # Per-shot sound effects
└── constants.ts          # Add BGM/SFX constants
```

### BGMAudio component

```tsx
interface BGMAudioProps {
  style: 'tech' | 'upbeat' | 'tense' | 'warm' | 'epic'
  tempo: 'slow' | 'medium' | 'fast'
  volume: number           // 0.01–0.20
  fadeInSeconds?: number   // default 2
  fadeOutSeconds?: number  // default 3
  totalDurationInFrames: number
}
```

Behavior:
- Loads via `staticFile('/audio/bgm/<style>-<tempo>.mp3')` (note: `staticFile()` paths omit `public/` prefix, matching existing codebase convention)
- Uses `interpolate()` for fade in/out volume control
- **Looping**: If BGM duration < video duration, use Remotion's `<Audio loop>` prop to loop seamlessly. BGM files should be chosen/edited for clean loop points.
- Plays for entire composition duration

### SFXLayer component

```tsx
interface SFXLayerProps {
  effects: SFXConfig[]
}

interface SFXConfig {
  type: string             // Curated values: 'whoosh-in' | 'whoosh' | 'impact' | 'text-pop' | 'outro'. Open string type allows future extensions without enum changes.
  delay?: number           // seconds after shot start, default varies by type
}
```

Default delays by type:
- `whoosh-in`: 0s
- `whoosh`: 0s
- `impact`: 1s
- `text-pop`: 0.5s
- `outro`: 0s

Fixed volume: 0.15 (lowered from 0.3 to prevent clipping when overlapping with voiceover — Remotion mixes `<Audio>` sources additively). All effects < 1 second.

**`premountFor` interaction**: When `SFXLayer` is inside a `<Sequence>` with `premountFor`, the effect's `delay` is relative to the Sequence's `from` frame, not the premount start. No special offset needed — `useCurrentFrame()` inside the Sequence returns frames relative to `from`.

### Composition integration

```tsx
<AbsoluteFill>
  <BGMAudio style="tech" tempo="medium" volume={0.08} totalDurationInFrames={totalFrames} />
  <Audio src={staticFile('/audio/slug/voiceover-full.mp3')} volume={1} />

  <Sequence from={shot1From} durationInFrames={shot1Duration} premountFor={1 * fps}>
    <Shot1 ... />
    <SFXLayer effects={[{ type: 'whoosh-in' }]} />
  </Sequence>
</AbsoluteFill>
```

---

## Part 3: Asset Management

### Local library structure

```
remotion/public/audio/
├── bgm/
│   ├── tech-medium.mp3
│   ├── tech-fast.mp3
│   ├── tech-slow.mp3
│   ├── upbeat-medium.mp3
│   ├── tense-medium.mp3
│   ├── warm-slow.mp3
│   └── epic-medium.mp3
└── sfx/
    ├── whoosh-in.mp3
    ├── whoosh.mp3
    ├── impact.mp3
    ├── text-pop.mp3
    └── outro.mp3
```

### Asset requirements

| Type | Duration | Format | Quality |
|------|----------|--------|---------|
| BGM | 60–120s (loopable) | mp3, 320kbps | No abrupt melody changes, suitable as background |
| SFX | < 1s | mp3, 320kbps | Clean, short, no reverb tail |

### Download strategy

**Initial fill** (one-time):
- BGM: Pixabay Music — filter 60–120s, royalty-free electronic/ambient
- SFX: Pixabay Sound Effects / Freesound.org — short, clean effects

**Runtime fallback** (in `/remotion-video`):
- If `bgm/<style>-<tempo>.mp3` missing → warn user and skip BGM (do NOT download at render time — network dependency and API rate limits make runtime downloads fragile)
- Asset download should be a separate manual step or pre-build step, not embedded in the render pipeline

---

## Part 4: Skill Pipeline Integration

### `/video-script` changes

1. After generating title, auto-insert `**BGM**` based on topic:
   - AI/tech topics → 科技电子
   - Product review/tutorial → 轻松愉快
   - Competition/versus → 紧张悬疑
   - People stories → 温馨抒情
   - Major releases/recaps → 史诗大气

2. Per-shot `**音效**` inference:
   - Shot 1 → `whoosh-in`
   - Last shot → `outro`
   - Data comparison/key conclusion shots → `impact`
   - Shots with text effects (typewriter/highlight) → `text-pop`
   - Other shots → no annotation (transition whoosh auto-added by composition)

### `/remotion-video` changes

New Step 3.5 (between Check Voiceover Audio and Generate Components):

1. Parse `**BGM**` from script → extract style/tempo/volume
2. Check local asset exists (`public/audio/bgm/<style>-<tempo>.mp3`)
3. If missing → warn user and skip BGM (no runtime download)
4. Scan all shots' `**音效**` fields → build SFX config array
5. Check all referenced SFX files exist in `public/audio/sfx/`

Modified Step 6 (Generate Composition):
- Add `<BGMAudio>` at composition top level
- Add `<SFXLayer>` inside each `<Sequence>`

### `/video-review` changes

New check items:
- BGM file exists at expected path
- All referenced SFX files exist
- BGM volume in reasonable range (0.05–0.15)
- SFX timing aligned with transitions

### Data flow

```
/video-script → script.md (with **BGM** + **音效** annotations)
     ↓
/remotion-video → parse annotations → check/download assets → generate BGMAudio + SFXLayer
     ↓
/video-review → check audio files + volume + timing alignment
```

### Backward compatibility

- Existing projects: manually add `**BGM**` and `**音效**` to script.md, re-run `/remotion-video`
- If no `**BGM**` declared: skip BGMAudio component entirely
- If no `**音效**` on any shot: skip SFXLayer for all shots
