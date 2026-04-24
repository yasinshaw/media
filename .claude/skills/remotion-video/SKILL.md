---
name: remotion-video
description: Convert video-script generated storyboard scripts into Remotion React compositions. Use when user asks to convert a script to Remotion, generate video code, or create Remotion compositions from scripts/. Automatically initializes Remotion project if needed, generates shot components, and creates compositions with timed subtitles.
---

You are a Remotion specialist who converts video scripts into production-ready React video code.

## Quick Start

User provides a script path or reference, you generate Remotion code.

### Command Format
```
/remotion-video <script-file-or-slug>
```

Example:
```
/remotion-video 2026-04-22-gpt-image2-compare
```

## Workflow

### Step 1: Locate Script
Search for script in `projects/` directory. Each project has a `script.md` file.
If only slug provided (e.g., `gpt-image2-compare`), find matching project directory.

### Step 2: Parse Script
Extract from video-script format:
- Video title → composition name
- Each shot/镜头 → component + duration
- 画面 → visual component type
- 口播 → subtitle text with timing
- 字幕 → on-screen text overlay

### Step 3: Check Voiceover Audio
Before generating components, check for existing voiceover audio in the project:
```
projects/<YYYY-MM-DD-<slug>>/assets/audio/
```

Priority order:
1. **Split files**: `voiceover-01.mp3`, `voiceover-02.mp3`, ... — Each shot gets its own audio
2. **Full file**: `voiceover-full.mp3` — Single audio for entire video
3. **None**: No audio, add placeholder comment

Also read `voiceover-manifest.json` if it exists for timing/sync info.

### Step 4: Project Setup (First Time Only)
If Remotion project doesn't exist at `remotion/`:
1. Copy template from [assets/remotion-template](assets/remotion-template)
2. Run `pnpm install` in remotion/
3. Install @remotion/media for audio: `npx remotion add @remotion/media`
4. Report setup complete

### Step 5: Generate Components

For each shot:

1. **Check for audio manifest timing:**
   - If `voiceover-manifest.json` exists with `duration_seconds`
   - Group segments by shot number
   - Calculate shot duration from actual audio: `sum(duration_seconds) * 30`
   - Prepare subtitle segments for ProgressiveSubtitle

2. **If no audio timing, fall back to script timing:**
   - Calculate duration from shot timing label (e.g., "0-5s" = 150 frames)

3. **Create component file:** `src/projects/<slug>/shots/Shot<N>.tsx`
4. **Implement based on shot type** (see Shot Types below)
5. **Pass appropriate subtitle props:**
   - With segments: `subtitleSegments={segmentsArray}`
   - Without segments: `subtitle="full text"`

### Step 6: Generate Composition
Create or update `src/projects/<slug>/composition.tsx`:
1. Sequence all shot components
2. Set total duration = sum of shot durations
3. Add audio based on what's available (see Audio System below)
4. Always add subtitles from 口播 text for each shot (see Subtitle Guidelines)

#### Audio Integration Logic

**If split audio files exist** (voiceover-01.mp3, voiceover-02.mp3, ...):
- Each shot gets its own `<Audio>` component with the corresponding file
- Use `Audio` from `@remotion/media` with proper timing
- Place audio files in `remotion/public/audio/<slug>/` directory

**If full audio file exists** (voiceover-full.mp3):
- Single `<Audio>` component at composition level
- Reference: `/audio/<slug>/voiceover-full.mp3`

**If no audio exists**:
- Add placeholder comment (see example below)

### Audio-Driven Timing (NEW)

When `voiceover-manifest.json` contains `duration_seconds` for each segment, use actual audio duration for frame calculation instead of character-count estimation.

**Formula:**
```
durationInFrames = round(audio_duration_seconds * 30)
```

**For multi-segment shots:**
Sum up all segments belonging to the same shot:
```javascript
const shotDuration = segments
  .filter(s => s.shot === shotNumber)
  .reduce((sum, s) => sum + s.duration_seconds, 0)
const durationInFrames = Math.round(shotDuration * 30)
```

### Step 7: Register Composition
Add to `src/root.tsx` if not already registered.

### Step 8: Copy Audio Files (If Found)
When voiceover audio files exist, copy them to Remotion public directory:
```bash
# Copy split audio files
mkdir -p remotion/public/audio/<slug>/
cp projects/<YYYY-MM-DD-<slug>>/assets/audio/voiceover-*.mp3 remotion/public/audio/<slug>/
```

### Step 9: Preview & Render
After generating all components and registering the composition:

1. **Start Remotion Studio** in the background for interactive preview:
   ```bash
   cd remotion && npx remotion studio src/root.tsx &
   ```
   Report the studio URL (default: http://localhost:3000) to the user.

2. **Render the video** to project's output directory:
   ```bash
   cd remotion && npx remotion render <CompositionId> ../projects/<YYYY-MM-DD-<slug>>/output/<slug>.mp4 --pixel-format=yuv420p --jpeg-quality=90
   ```
   Wait for rendering to complete and report the output file size.

3. **Report results** including:
   - Studio preview URL
   - Rendered video file path and size
   - Any warnings encountered during render

## Douyin Vertical Format (REQUIRED)

**All videos MUST be generated in Douyin vertical format** (9:16 aspect ratio):
- **Resolution**: 1080×1920 (width × height)
- **FPS**: 30
- **Codec**: H.264 with `--pixel-format=yuv420p`
- **JPEG Quality**: 90

### Why Vertical Format?
- Douyin (TikTok China) requires 9:16 vertical videos
- Horizontal videos will be cropped or have black bars
- Vertical format fills the entire mobile screen

### Composition Registration Example
```tsx
<Composition
  id="GptImage2Compare"
  component={GptImage2Compare}
  durationInFrames={2550}
  fps={30}
  width={1080}      // Douyin vertical width
  height={1920}     // Douyin vertical height
  defaultProps={{}}
/>
```

### Safe Areas (Critical for Douyin)
- **Top safe area**: 120px (avoid status bar, notches)
- **Bottom safe area**: 200px (avoid Douyin UI overlays: comment, share, like buttons)
- **Side safe areas**: 40px each side

### Content Layout Guidelines
- Center important content in the middle 60% of the screen
- Avoid placing critical elements in top/bottom 15% (UI overlays)
- Use vertical stacks/lists instead of horizontal grids when possible
- Text must be readable on small mobile screens

## Shot Types

Map script 画面 descriptions to component types:

| Script Pattern | Component Type | Visual Implementation |
|----------------|----------------|----------------------|
| 主播面对镜头 | TalkingHead | Solid background + large centered figure (500x500px) |
| 切到.*界面 | ScreenRecording | Frame with mock UI, window controls, safe area padding |
| 左右分屏 / 分屏对比 | SplitScreen | **Vertical split by default** (top/bottom for mobile) |
| 上下分屏 | VerticalSplit | Two panels stacked vertically (same as SplitScreen) |
| 展示.*演示 | Demo | Large animated placeholder (400x400px minimum) |
| 指向关注按钮 | CTA | Large arrow + button with pulse animation (mobile-sized) |

For ambiguous patterns, default to `GenericShot` with text overlay.

## Audio System

### CRITICAL: Always Use `staticFile()` for Audio

**❌ WRONG — Plain strings fail during CLI render:**
```tsx
<Audio src="/audio/gpt55/voiceover-01.mp3" />  // 404 error during render!
```

**✅ CORRECT — Use `staticFile()` from Remotion:**
```tsx
import { staticFile } from 'remotion';
<Audio src={staticFile('/audio/gpt55/voiceover-01.mp3')} />
```

**Why?** During `npx remotion render`, plain URL paths don't resolve to the public directory. `staticFile()` generates the correct path for both Studio preview and CLI rendering.

### Voiceover Audio Detection

Before generating components, check for existing voiceover files:
```
projects/<YYYY-MM-DD-<slug>>/assets/audio/
```

Detection priority:
1. **Split files**: `voiceover-01.mp3`, `voiceover-02.mp3`, ... — One per shot
2. **Full file**: `voiceover-full.mp3` — Single audio for entire video
3. **Manifest**: `voiceover-manifest.json` — Contains segment info

### Installation
```bash
npx remotion add @remotion/media
```

### Usage Patterns

#### Pattern 1: Split Audio Files (Recommended)

When `voiceover-01.mp3`, `voiceover-02.mp3`, etc. exist:

**CRITICAL: Always use `staticFile()` for audio paths** — plain string paths fail during CLI render.

```tsx
import { Audio } from '@remotion/media';
import { staticFile } from 'remotion';

export const MyComposition: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Shot 1 with its own audio */}
      <Sequence from={0} durationInFrames={150}>
        <Shot1 subtitle="第一句话" />
        <Audio src={staticFile('/audio/gpt-image2-compare/voiceover-01.mp3')} />
      </Sequence>

      {/* Shot 2 with its own audio */}
      <Sequence from={150} durationInFrames={180}>
        <Shot2 subtitle="第二句话" />
        <Audio src={staticFile('/audio/gpt-image2-compare/voiceover-02.mp3')} />
      </Sequence>

      {/* Shot 3 with its own audio */}
      <Sequence from={330} durationInFrames={120}>
        <Shot3 subtitle="第三句话" />
        <Audio src={staticFile('/audio/gpt-image2-compare/voiceover-03.mp3')} />
      </Sequence>
    </AbsoluteFill>
  );
};
```

#### Pattern 2: Full Audio File

When `voiceover-full.mp3` exists:

**CRITICAL: Always use `staticFile()` for audio paths** — plain string paths fail during CLI render.

```tsx
import { Audio } from '@remotion/media';
import { staticFile } from 'remotion';

export const MyComposition: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Single audio track for entire composition */}
      <Audio src={staticFile('/audio/gpt-image2-compare/voiceover-full.mp3')} volume={1} />

      <Sequence from={0} durationInFrames={150}>
        <Shot1 subtitle="第一句话" />
      </Sequence>

      <Sequence from={150} durationInFrames={180}>
        <Shot2 subtitle="第二句话" />
      </Sequence>
    </AbsoluteFill>
  );
};
```

#### Pattern 3: No Audio (Placeholder)

When no audio files exist yet:

```tsx
export const MyComposition: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Audio placeholder - uncomment after running /voiceover */}
      {/*
      import { staticFile } from 'remotion';
      <Audio src={staticFile('/audio/gpt-image2-compare/voiceover-full.mp3')} volume={1} />
      */}

      <Sequence from={0} durationInFrames={150}>
        <Shot1 subtitle="第一句话" />
      </Sequence>
    </AbsoluteFill>
  );
};
```

### Audio Options
- `trimBefore`: Skip first N frames
- `trimAfter`: End at N frames
- `volume`: 0-1 or callback `(frame) => number`
- `muted`: Boolean to silence
- `playbackRate`: Speed (0.5 = half, 2 = double)
- `loop`: Loop indefinitely

### Audio File Path Convention

Split audio files are copied to Remotion public directory:
```
remotion/public/audio/<slug>/
├── voiceover-01.mp3
├── voiceover-02.mp3
├── voiceover-03.mp3
└── voiceover-full.mp3 (optional)
```

In components, reference as: `/audio/<slug>/voiceover-NN.mp3`

### Reading Manifest for Timing Info

If `voiceover-manifest.json` exists, you can use it for precise timing:

```json
{
  "total_segments": 3,
  "speaker": "zh_male_liufei_uranus_bigtts",
  "segments": [
    {"index": 1, "file": "voiceover-01.mp3", "size_bytes": 12345, "text": "第一句话..."},
    {"index": 2, "file": "voiceover-02.mp3", "size_bytes": 23456, "text": "第二句话..."}
  ]
}
```

## Subtitle Guidelines (IMPORTANT)

### Rule: Always Include Subtitles for 口播 Content

Every shot with 口播 (voiceover) text MUST have a subtitle. Many users watch Douyin without sound — subtitles ensure accessibility and message delivery.

### Subtitle Style (Douyin-Friendly)

| Property | Value | Reason |
|----------|-------|--------|
| Position | `bottom: 240` | Above 200px safe area + 40px gap |
| Font size | 46px | Readable on mobile, not too large |
| Font weight | bold | Clear emphasis |
| Color | #FFFFFF (white) | Clean, works with text shadow |
| Text shadow | `2px 2px 6px rgba(0,0,0,0.95)` | Readable on any background |
| Background | None (text shadow only) | Douyin-native style, no heavy box |
| Letter spacing | 1px | Better CJK character readability |
| Max width | 90% | Prevents edge overflow |
| Alignment | Center | Standard subtitle positioning |
| Fade in | 6 frames (0.2s at 30fps) | Smooth entrance |

### Composition Pattern

Always pass 口播 text as `subtitle` prop to each shot:

```tsx
<Sequence from={0} durationInFrames={150}>
  <Shot1 subtitle="AI生图最大痛点 = 文字乱码" />
</Sequence>
<Sequence from={150} durationInFrames={180}>
  <Shot2 subtitle="但这次 GPT-Image 2 彻底解决了" />
</Sequence>
```

### Shot Component Pattern

Each shot component receives and renders the subtitle:

```tsx
interface ShotProps {
  subtitle?: string
}

export const Shot1: React.FC<ShotProps> = ({ subtitle }) => {
  return (
    <AbsoluteFill style={{ ... }}>
      {/* Visual content */}
      {subtitle && <Subtitle text={subtitle} />}
    </AbsoluteFill>
  )
}
```

### When to Omit Subtitles

Only skip subtitles when a shot has **no 口播 text** (pure visual transitions, B-roll, title cards).

### Progressive Subtitles (NEW)

For long voiceover text that has been split into multiple audio segments, use `ProgressiveSubtitle` instead of `Subtitle`.

**When to use:**
- Manifest has multiple segments with the same `shot` number
- Single shot's voiceover is >30 characters
- Subtitle segments have timing info (start/end times)

**Usage pattern:**

1. **Read manifest and calculate cumulative timing:**
```javascript
// Read manifest
const manifest = JSON.parse(fs.readFileSync('voiceover-manifest.json'))

// Group segments by shot number, track cumulative time for videoOffset
const shots = []
let currentTime = 0

for (const segment of manifest.segments) {
  const shotNum = segment.shot
  if (!shots[shotNum]) {
    shots[shotNum] = { segments: [], startTime: currentTime, duration: 0 }
  }
  shots[shotNum].segments.push({
    text: segment.text,
    start: segment.start,
    end: segment.end,
    duration: segment.duration
  })
  shots[shotNum].duration += segment.duration
  currentTime += segment.duration
}
```

2. **Calculate shot duration from audio:**
```javascript
// Shot duration = sum of its segments' audio durations
const shot1Duration = shots[1].duration  // in seconds
const shot1Frames = Math.round(shot1Duration * 30)
const shot1StartTime = shots[1].startTime  // for videoOffset
```

3. **Pass subtitle info with videoOffset to shot component:**
```tsx
<Sequence from={0} durationInFrames={shot1Frames}>
  <Shot1
    subtitleSegments={shots[1].segments}
    videoOffset={shots[1].startTime}
  />
</Sequence>

<Sequence from={shot1Frames} durationInFrames={shot2Frames}>
  <Shot2
    subtitleSegments={shots[2].segments}
    videoOffset={shots[2].startTime}
  />
</Sequence>
```

4. **Inside shot component, use ProgressiveSubtitle:**
```tsx
interface ShotProps {
  subtitleSegments?: Array<{text: string, start: number, end: number}>
  videoOffset?: number  // When this shot starts in the video
}

export const Shot1: React.FC<ShotProps> = ({ subtitleSegments, videoOffset }) => {
  return (
    <AbsoluteFill style={{ background: '...' }}>
      {/* Visual content */}
      {subtitleSegments && (
        <ProgressiveSubtitle
          segments={subtitleSegments}
          videoOffset={videoOffset || 0}
        />
      )}
    </AbsoluteFill>
  )
}
```

**Fallback:** If no segment timing info exists, use regular `<Subtitle text={fullText} />`.

## Layout Guidelines (Vertical Format)

### Mobile-First Typography (CRITICAL)

**Rule: If it looks small in preview, it's invisible on a phone.**

All text must be legible on a 6-inch mobile screen viewing a 1080×1920 video.

| Element Type | Font Size | Weight | Notes |
|-------------|-----------|--------|-------|
| Hero title | 64-80px | 900 | Main shot title, hook text |
| Section title | 48-56px | 800 | Sub-headings, category labels |
| Body text / cards | 32-40px | 600-700 | Content in cards, descriptions |
| Data labels | 28-36px | 700 | Chart labels, stats, metrics |
| Small labels | 24-28px | 600 | Tags, timestamps — **NEVER below 24px** |

**Minimum font size: 24px.** Anything below is unreadable on mobile.

### Content Sizing
- **Content width**: `maxWidth: '900px'` (use 80-85% of 1080px)
- **Card padding**: 32-48px
- **Bar chart height**: 36-48px per bar
- **Icon / avatar size**: 120-200px minimum
- **Button size**: 48-64px font, padding 24-40px

### Safe Area Padding (MANDATORY on every shot)
```tsx
padding: '120px 40px 200px'
```
- Top: 120px (notch / status bar)
- Sides: 40px each
- Bottom: 200px (Douyin UI overlay)

### Spacing
- **Gap between elements**: 24-40px
- **Border radius**: 16-28px for modern look

### Animation Timing
- **Fade in/out**: 10-15 frames
- **Slide transitions**: 0-0.3 progress range
- **Spring animations**: damping 10-15, stiffness 80-100

### Vertical Layout Template (copy this for every shot)
```tsx
<AbsoluteFill style={{
  background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '120px 40px 200px'   // MANDATORY safe area
}}>
  <div style={{ width: '100%', maxWidth: '900px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
    {/* Content here — always vertical stack */}
  </div>
</AbsoluteFill>
```

## File Naming

### Component Files
Format: `src/projects/<slug>/shots/Shot<N>.tsx`
- Slug: lowercase kebab-case (e.g., "gpt-image2-compare")
- Shot number = N from script (1, 2, 3, ...)

### Composition Files
Format: `src/projects/<slug>/composition.tsx`

### Script Slug to Title
- Remove date prefix: `2026-04-22-gpt-image2-compare` → `gpt-image2-compare`
- Convert to readable: `GPT-Image 2 Compare`

## Code Conventions

### Imports (Always include)
```tsx
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring, staticFile } from 'remotion'
import React from 'react'
```

**Note:** `staticFile` is required when using audio from the public directory.

### Component Signature
```tsx
interface ShotProps {
  subtitle?: string
  overlay?: string
}

export const ShotName: React.FC<ShotProps> = ({ subtitle, overlay }) => {
  return (
    <AbsoluteFill style={{ background: '...' }}>
      {/* Visual content */}
      {subtitle && <Subtitle text={subtitle} />}
      {overlay && <Overlay text={overlay} />}
    </AbsoluteFill>
  )
}
```

### Duration in Frames
At 30fps: `durationSeconds * 30`
```tsx
<Sequence from={0} durationInFrames={150}>  // 5 seconds
  <Shot1 />
</Sequence>
```

## Reusable Components

Create these once in `src/components/`:
- `Subtitle.tsx` - Fixed style subtitle (fontSize: 46, bottom: 240, white with text shadow)
- `Overlay.tsx` - On-screen text overlay (fontSize: 64)
- `TalkingHead.tsx` - Person on camera placeholder
- `ScreenRecording.tsx` - Mock browser/app window
- `VerticalSplit.tsx` - Two panels stacked vertically

See [references/components.md](references/components.md) for implementations.

## Output Format (Douyin Vertical)

After generating components and completing preview/render:

```
✅ Remotion composition created: src/projects/gpt-image2-compare/composition.tsx
📁 Generated 6 shot components
🎬 Total duration: 85 seconds (2550 frames at 30fps)
📱 Format: Douyin vertical 1080×1920

🎙️ Audio: 3 split files detected (voiceover-01.mp3 ~ voiceover-03.mp3)
📂 Audio copied to: remotion/public/audio/gpt-image2-compare/

🖥️  Preview: http://localhost:3000 (Remotion Studio running)
🎥 Rendered: projects/2026-04-22-gpt-image2-compare/output/gpt-image2-compare.mp4 (5.6 MB)
```

### Audio Status Messages

- **With split audio**: `🎙️ Audio: N split files detected (voiceover-01.mp3 ~ voiceover-NN.mp3)`
- **With full audio**: `🎙️ Audio: voiceover-full.mp3 detected`
- **No audio**: `📝 Audio: No audio found. Run /voiceover to generate voiceover files.`

## Error Handling

### Script Not Found
```
❌ Script not found: {slug}
Available projects:
{list projects/ directories}
```

### Invalid Shot Timing
```
⚠️ Invalid timing in shot {N}: "{timing}"
Using default duration: 5 seconds
```

### Missing Required Fields
```
⚠️ Shot {N} missing required field: {field}
Using fallback value
```

### Audio File Missing (During Render)
```
⚠️ Audio file not found: /audio.mp3
Rendering without audio. Add audio file to public/ folder and uncomment <Audio> in composition.
```

## Advanced Features

See [references/advanced.md](references/advanced.md) for:
- Audio waveform visualization
- Dynamic transitions between shots
- Color themes and branding
- Export configuration optimization
