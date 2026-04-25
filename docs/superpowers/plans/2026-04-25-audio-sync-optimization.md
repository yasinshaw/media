# 音画同步优化 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 实现精准的音画同步，让视频场景时长与实际音频时长对齐，并支持长字幕分段显示。

**Architecture:**
1. `voiceover-tts` — 按句子拆分音频，用 ffprobe 获取实际时长并写入 manifest
2. `remotion-video` — 从 manifest 读取音频时长驱动帧数，长字幕按标点拆分并逐句显示
3. `video-script` — 可选：在脚本层面生成更细粒度的句子级时间戳

**Tech Stack:** Python 3, ffprobe, Remotion 4.x, React, TypeScript

---

## File Structure

```
.claude/skills/
├── voiceover-tts/
│   ├── scripts/
│   │   └── generate_voiceover.py      # 修改：添加句子拆分 + ffprobe 时长检测
│   └── SKILL.md                        # 修改：添加细粒度模式的文档
├── remotion-video/
│   ├── SKILL.md                        # 修改：添加音频驱动时长 + 字幕拆分逻辑
│   └── assets/remotion-template/
│       └── src/
│           └── components/
│               └── Subtitle.tsx        # 新增：支持分段字幕的 ProgressiveSubtitle 组件
└── video-script/
    └── SKILL.md                        # 可选修改：添加句子级时间戳生成

projects/<slug>/assets/audio/
└── voiceover-manifest.json             # 扩展：添加 duration_seconds, sub_segments
```

---

## Phase 1: voiceover-tts — 细粒度音频生成

### Task 1: 安装 ffprobe 依赖

**Files:**
- Modify: `scripts/generate_voiceover.py`

- [ ] **Step 1: Verify ffprobe is available**

```bash
# Check if ffprobe is installed
which ffprobe
# Expected: /usr/bin/ffprobe or similar path

# If not found, install ffmpeg (includes ffprobe)
# macOS:
brew install ffmpeg
```

- [ ] **Step 2: Add ffprobe Python function to generate_voiceover.py**

At the top of the file, add imports and helper function:

```python
import subprocess

def get_audio_duration(audio_file_path):
    """
    Get the actual duration of an audio file using ffprobe.

    Args:
        audio_file_path: Path to the audio file

    Returns:
        float: Duration in seconds
    """
    try:
        cmd = [
            'ffprobe',
            '-v', 'error',
            '-show_entries', 'format=duration',
            '-of', 'default=noprint_wrappers=1:nokey=1',
            audio_file_path
        ]
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        duration = float(result.stdout.strip())
        return duration
    except subprocess.CalledProcessError as e:
        print(f"  Warning: Could not get duration for {audio_file_path}: {e}")
        return None
    except ValueError:
        print(f"  Warning: Could not parse duration for {audio_file_path}")
        return None
```

- [ ] **Step 3: Test the function**

```bash
cd /Users/yasin/code/media
python3 << 'EOF'
import sys
sys.path.insert(0, '.claude/skills/voiceover-tts/scripts')
from generate_voiceover import get_audio_duration
print(get_audio_duration('projects/2026-04-24-gpt55能力/assets/audio/voiceover-01.mp3'))
EOF
# Expected: A float like 3.45 (seconds)
```

- [ ] **Step 4: Commit**

```bash
git add .claude/skills/voiceover-tts/scripts/generate_voiceover.py
git commit -m "feat(voiceover-tts): add ffprobe duration detection helper"
```

---

### Task 2: 实现句子级拆分逻辑

**Files:**
- Modify: `scripts/generate_voiceover.py`

- [ ] **Step 1: Add sentence splitting function**

Add after `parse_voiceover_text()` function:

```python
def split_text_into_sentences(text):
    """
    Split Chinese text into sentences by punctuation.

    Rules:
    - Split by 。！？...（strong stops）
    - Also split by ，；:（weak stops) for longer segments
    - Preserve quotes and parentheses

    Args:
        text: Input text string

    Returns:
        list of tuples: [(sentence_text, char_count), ...]
    """
    import re

    # First, try strong punctuation (sentence boundaries)
    strong_pattern = r'([^。！？\n]+[。！？]?)'
    sentences = re.split(strong_pattern, text)

    # Filter out empty strings and rejoin with what was captured
    result = []
    for s in sentences:
        s = s.strip()
        if not s:
            continue
        # Check if this segment is still too long (>40 chars)
        if len(s) > 40:
            # Split by weak punctuation (comma, semicolon, colon)
            weak_parts = re.split(r'([，；；、])', s)
            current = ""
            for part in weak_parts:
                if part in '，；；、':
                    current += part
                    if current:
                        result.append(current)
                        current = ""
                else:
                    current += part
            if current:
                result.append(current)
        else:
            result.append(s)

    # Return as list of (text, length) tuples
    return [(s, len(s)) for s in result if s.strip()]


def calculate_subtitle_timing(sub_segments, total_duration):
    """
    Calculate timing for each subtitle segment proportionally to character count.

    Args:
        sub_segments: List of (text, char_count) tuples
        total_duration: Total audio duration in seconds

    Returns:
        List of dicts with start, end, text keys
    """
    if not sub_segments:
        return []

    total_chars = sum(count for _, count in sub_segments)
    result = []
    current_time = 0

    for text, count in sub_segments:
        # Proportional duration
        duration = (count / total_chars) * total_duration if total_chars > 0 else total_duration
        result.append({
            'text': text,
            'start': round(current_time, 2),
            'end': round(current_time + duration, 2),
            'duration': round(duration, 2)
        })
        current_time += duration

    return result
```

- [ ] **Step 2: Test the splitting function**

```bash
python3 << 'EOF'
import sys
sys.path.insert(0, '.claude/skills/voiceover-tts/scripts')
from generate_voiceover import split_text_into_sentences

text = 'GPT-5.5来了！多项基准领先，但有一个项目它输了。你还在用GPT-5.4吗？推理能力提升8%，代码能力提升9%。'
segments = split_text_into_sentences(text)
for s, l in segments:
    print(f'[{l}字] {s}')
EOF
# Expected output like:
# [10字] GPT-5.5来了！
# [17字] 多项基准领先，但有一个项目它输了。
# [10字] 你还在用GPT-5.4吗？
# [28字] 推理能力提升8%，代码能力提升9%。
```

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/voiceover-tts/scripts/generate_voiceover.py
git commit -m "feat(voiceover-tts): add sentence-level text splitting"
```

---

### Task 3: 修改 manifest 格式并更新生成逻辑

**Files:**
- Modify: `scripts/generate_voiceover.py`

- [ ] **Step 1: Modify generate_split_mode() to use new features**

Replace the existing `generate_split_mode()` function (around line 219) with this enhanced version:

```python
def generate_split_mode(text_file, output_dir, speaker, fine_grained=True):
    """
    Generate separate audio files for each line of text.

    Args:
        text_file: Path to voiceover text file
        output_dir: Directory to save audio files
        speaker: Speaker voice ID
        fine_grained: If True, split long lines into sentences and generate per-sentence audio
    """
    # Read and parse text file
    try:
        with open(text_file, "r", encoding="utf-8") as f:
            content = f.read()
    except FileNotFoundError:
        print(f"Error: Text file not found: {text_file}")
        sys.exit(1)

    # Extract voiceover lines
    lines = parse_voiceover_text(content)

    if not lines:
        print("Error: No voiceover text found in file")
        sys.exit(1)

    # Create output directory
    os.makedirs(output_dir, exist_ok=True)

    # Generate audio for each line (and sub-segment if fine_grained)
    all_segments = []
    all_audio_data = []
    shot_index = 0
    video_time = 0  # Cumulative time for subtitle timing

    for line_idx, line in enumerate(lines, 1):
        if not line.strip():
            continue

        shot_index += 1
        shot_start_time = video_time

        if fine_grained:
            # Split into sentences
            sub_segments = split_text_into_sentences(line)

            for sub_idx, (sub_text, char_count) in enumerate(sub_segments):
                segment_index = len(all_segments) + 1

                try:
                    print(f"[{segment_index}] Generating: {sub_text[:30]}...")
                    audio_data = generate_tts(sub_text.strip(), speaker)

                    # Get actual duration
                    temp_filename = f"temp_{segment_index}.mp3"
                    temp_filepath = os.path.join(output_dir, temp_filename)
                    with open(temp_filepath, "wb") as f:
                        f.write(audio_data)

                    duration = get_audio_duration(temp_filepath)

                    # Fallback to character-based estimation if ffprobe failed
                    if duration is None:
                        duration = len(sub_text) / 4.5
                        print(f"  ⚠ Using fallback duration: {duration:.2f}s")

                    # Rename to permanent file
                    filename = f"voiceover-{segment_index:02d}.mp3"
                    filepath = os.path.join(output_dir, filename)
                    os.rename(temp_filepath, filepath)

                    # Calculate subtitle timing (relative to video start)
                    segment_start = video_time
                    segment_end = video_time + duration

                    all_segments.append({
                        'index': segment_index,
                        'shot': shot_index,
                        'sub_index': sub_idx + 1,
                        'file': filename,
                        'size_bytes': len(audio_data),
                        'text': sub_text,
                        'duration_seconds': round(duration, 2),
                        'start': round(segment_start, 2),  # For subtitle sync
                        'end': round(segment_end, 2)
                    })
                    all_audio_data.append(audio_data)

                    # Update cumulative time
                    video_time += duration

                    print(f"  OK {filename} ({len(audio_data)} bytes, {duration:.2f}s)")

                except Exception as e:
                    print(f"  ERROR: {e}")
                    continue

            # Add shot-level summary to manifest
            shot_duration = video_time - shot_start_time
        else:
            # Original behavior: one audio file per line
            try:
                print(f"[{line_idx}/{len(lines)}] Generating: {line[:30]}...")
                audio_data = generate_tts(line.strip(), speaker)

                filename = f"voiceover-{line_idx:02d}.mp3"
                filepath = os.path.join(output_dir, filename)

                # Save to temp file first to get duration
                temp_filepath = os.path.join(output_dir, f"temp_{line_idx}.mp3")
                with open(temp_filepath, "wb") as f:
                    f.write(audio_data)

                duration = get_audio_duration(temp_filepath)

                # Fallback to character-based estimation
                if duration is None:
                    duration = len(line) / 4.5
                    print(f"  ⚠ Using fallback duration: {duration:.2f}s")

                os.rename(temp_filepath, filepath)

                # Calculate timing
                segment_start = video_time
                segment_end = video_time + duration
                video_time += duration

                all_segments.append({
                    'index': line_idx,
                    'shot': line_idx,
                    'sub_index': 0,
                    'file': filename,
                    'size_bytes': len(audio_data),
                    'text': line,
                    'duration_seconds': round(duration, 2),
                    'start': round(segment_start, 2),
                    'end': round(segment_end, 2)
                })
                all_audio_data.append(audio_data)

                print(f"  OK {filename} ({len(audio_data)} bytes, {duration:.2f}s)")

            except Exception as e:
                print(f"  ERROR: {e}")
                continue

    if not all_segments:
        print("Error: No audio segments generated")
        sys.exit(1)

    # Generate combined file
    if all_audio_data:
        combined_path = os.path.join(output_dir, "voiceover-full.mp3")
        with open(combined_path, "wb") as f:
            f.write(b"".join(all_audio_data))
        print(f"\nOK Combined audio saved: voiceover-full.mp3")

    # Generate enhanced manifest file
    manifest_path = os.path.join(output_dir, "voiceover-manifest.json")
    manifest = {
        "total_segments": len(all_segments),
        "speaker": speaker,
        "total_duration_seconds": round(video_time, 2),
        "segments": all_segments
    }

    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)
    print(f"OK Manifest saved: voiceover-manifest.json")

    return all_segments
```

- [ ] **Step 2: Update main() to pass fine_grained parameter**

Modify the main() function around line 336:

```python
def main():
    if len(sys.argv) < 3:
        print("Usage:")
        print("  Single file: python generate_voiceover.py <text_file> <output_file> [speaker]")
        print("  Split mode:  python generate_voiceover.py split <text_file> <output_dir> [speaker] [--no-fine]")
        print(f"\nDefault speaker: {DEFAULT_SPEAKER}")
        print("  --no-fine: Disable sentence-level splitting (one file per line)")
        sys.exit(1)

    mode = sys.argv[1]

    if mode == "split":
        if len(sys.argv) < 4:
            print("Usage: python generate_voiceover.py split <text_file> <output_dir> [speaker] [--no-fine]")
            sys.exit(1)
        text_file = sys.argv[2]
        output_dir = sys.argv[3]
        speaker = sys.argv[4] if len(sys.argv) > 4 and not sys.argv[4].startswith('--') else DEFAULT_SPEAKER
        fine_grained = '--no-fine' not in sys.argv  # Default is True, disable with --no-fine
        generate_split_mode(text_file, output_dir, speaker, fine_grained)
    else:
        # Single file mode
        text_file = sys.argv[1]
        output_file = sys.argv[2]
        speaker = sys.argv[3] if len(sys.argv) > 3 else DEFAULT_SPEAKER
        generate_single_mode(text_file, output_file, speaker)
```

- [ ] **Step 3: Update SKILL.md to document fine-grained mode**

Add section to `voiceover-tts/SKILL.md` after the "Command Format" section:

```markdown
### Fine-Grained Mode (NEW)

By default, the skill now generates **sentence-level audio segments** for better subtitle synchronization.

**Behavior:**
- Long voiceover lines are split by punctuation (。！？，；)
- Each sentence becomes a separate MP3 file
- Manifest includes precise timing for each segment
- Enables word-by-word subtitle timing in Remotion

**Opt out:** Use `--no-fine` flag to generate one file per line (original behavior)

Example manifest output:
```json
{
  "total_segments": 15,
  "speaker": "zh_male_liufei_uranus_bigtts",
  "total_duration_seconds": 74.5,
  "segments": [
    {
      "index": 1,
      "shot": 1,
      "sub_index": 1,
      "file": "voiceover-01.mp3",
      "size_bytes": 42093,
      "text": "GPT-5.5来了！",
      "duration_seconds": 2.8,
      "start": 0.0,
      "end": 2.8
    },
    {
      "index": 2,
      "shot": 1,
      "sub_index": 2,
      "file": "voiceover-02.mp3",
      "size_bytes": 38124,
      "text": "多项基准领先，但有一个项目它输了。",
      "duration_seconds": 4.2,
      "start": 2.8,
      "end": 7.0
    }
  ]
}
```
```

- [ ] **Step 4: Test with actual project**

```bash
# Backup existing audio first
cp -r projects/2026-04-24-gpt55能力/assets/audio projects/2026-04-24-gpt55能力/assets/audio.bak

# Test generation
python .claude/skills/voiceover-tts/scripts/generate_voiceover.py \
  split \
  projects/2026-04-24-gpt55能力/voiceover.md \
  projects/2026-04-24-gpt55能力/assets/audio-test/

# Check manifest format
cat projects/2026-04-24-gpt55能力/assets/audio-test/voiceover-manifest.json
```

- [ ] **Step 5: Commit**

```bash
git add .claude/skills/voiceover-tts/
git commit -m "feat(voiceover-tts): implement fine-grained audio splitting with duration detection"
```

---

## Phase 2: remotion-video — 音频驱动 + 字幕拆分

### Task 4: 创建 ProgressiveSubtitle 组件

**Files:**
- Create: `remotion/src/components/ProgressiveSubtitle.tsx`

- [ ] **Step 1: Write the ProgressiveSubtitle component**

```tsx
import React from 'react'
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion'

interface SubtitleSegment {
  text: string
  start: number    // Start time relative to video start (seconds)
  end: number      // End time relative to video start (seconds)
  duration: number // Duration in seconds
}

interface ProgressiveSubtitleProps {
  segments: SubtitleSegment[]
  videoOffset?: number  // Shot's start time in the video (seconds) - needed for timing alignment
}

export const ProgressiveSubtitle: React.FC<ProgressiveSubtitleProps> = ({
  segments,
  videoOffset = 0
}) => {
  const frame = useCurrentFrame()
  const fps = 30

  // Calculate current time relative to VIDEO start (not shot start)
  // This matches the timing in manifest (which is also relative to video start)
  const currentTime = (frame / fps) + videoOffset

  // Find which segment should be displayed
  // Segment times are relative to video start (from manifest)
  const activeSegment = segments.find(seg => {
    return currentTime >= seg.start && currentTime < seg.end
  })

  if (!activeSegment) {
    return null
  }

  // Calculate fade-in progress (6 frames = 0.2s)
  const timeIntoSegment = currentTime - activeSegment.start
  const fadeInDuration = 0.2  // seconds
  const fadeInProgress = Math.min(timeIntoSegment / fadeInDuration, 1)

  // For very short segments, adjust opacity curve
  const opacity = activeSegment.duration < fadeInDuration
    ? interpolate(fadeInProgress, [0, 1], [0.3, 1])  // Start at 30% for short segments
    : interpolate(fadeInProgress, [0, 1], [0, 1])

  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingBottom: '240px',
      }}
    >
      <div
        style={{
          fontSize: '46px',
          fontWeight: 'bold',
          color: '#FFFFFF',
          textAlign: 'center',
          maxWidth: '90%',
          textShadow: '2px 2px 6px rgba(0,0,0,0.95)',
          letterSpacing: '1px',
          opacity,
          lineHeight: '1.4',
        }}
      >
        {activeSegment.text}
      </div>
    </AbsoluteFill>
  )
}
```

- [ ] **Step 2: Export from components index**

Create or update `remotion/src/components/index.ts`:

```tsx
export { Subtitle } from './Subtitle'
export { ProgressiveSubtitle } from './ProgressiveSubtitle'
export { Overlay } from './Overlay'
export { TalkingHead } from './TalkingHead'
export { ScreenRecording } from './ScreenRecording'
export { SplitScreen } from './SplitScreen'
export { CTA } from './CTA'
export { Demo } from './Demo'
```

- [ ] **Step 3: Commit**

```bash
git add remotion/src/components/
git commit -m "feat(remotion): add ProgressiveSubtitle component for segmented subtitles"
```

---

### Task 5: 修改 remotion-video 技能逻辑

**Files:**
- Modify: `.claude/skills/remotion-video/SKILL.md`

- [ ] **Step 1: Add audio-driven timing section**

Add after "Audio Integration Logic" section:

```markdown
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
```

- [ ] **Step 2: Add subtitle splitting section**

Add new section after "Subtitle Guidelines":

```markdown
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
```

- [ ] **Step 3: Update workflow steps**

Modify "Step 6: Generate Components" section:

```markdown
### Step 6: Generate Components

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
```

- [ ] **Step 4: Commit**

```bash
git add .claude/skills/remotion-video/SKILL.md
git commit -m "docs(remotion-video): add audio-driven timing and progressive subtitle documentation"
```

---

### Task 6: 更新现有模板组件

**Files:**
- Modify: `assets/remotion-template/src/components/Subtitle.tsx` (if exists)
- Or ensure the template has the new ProgressiveSubtitle

- [ ] **Step 1: Check existing template components**

```bash
ls -la .claude/skills/remotion-video/assets/remotion-template/src/components/
```

- [ ] **Step 2: Copy ProgressiveSubtitle to template**

```bash
# If it doesn't exist in template, add it
cp remotion/src/components/ProgressiveSubtitle.tsx \
   .claude/skills/remotion-video/assets/remotion-template/src/components/

# Update template index.ts
cat .claude/skills/remotion-video/assets/remotion-template/src/components/index.ts
```

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/remotion-video/assets/remotion-template/
git commit -m "feat(remotion-template): add ProgressiveSubtitle to template"
```

---

## Phase 3: Integration Testing

### Task 7: 端到端测试

**Files:**
- Test with: `projects/2026-04-24-gpt55能力/`

- [ ] **Step 1: Regenerate audio with fine-grained mode**

```bash
# Backup existing
mv projects/2026-04-24-gpt55能力/assets/audio projects/2026-04-24-gpt55能力/assets/audio-old

# Regenerate
python .claude/skills/voiceover-tts/scripts/generate_voiceover.py \
  split \
  projects/2026-04-24-gpt55能力/voiceover.md \
  projects/2026-04-24-gpt55能力/assets/audio/
```

- [ ] **Step 2: Verify manifest format**

```bash
cat projects/2026-04-24-gpt55能力/assets/audio/voiceover-manifest.json | jq .
```

Expected:
- `total_duration_seconds` field present
- Each segment has `duration_seconds`, `start`, `end`
- Each segment has `shot` and `sub_index`

- [ ] **Step 3: Test remotion-video skill with new logic**

```bash
# Trigger the skill (via user interaction in Claude)
/remotion-video gpt55能力
```

Expected outputs:
- Composition uses audio-driven durations
- Shot components use ProgressiveSubtitle for multi-segment shots
- Total duration matches manifest's `total_duration_seconds`

- [ ] **Step 4: Render and verify**

```bash
cd remotion
npx remotion render Gpt55 ../projects/2026-04-24-gpt55能力/output/test.mp4 --pixel-format=yuv420p --jpeg-quality=90
```

Check:
- Video plays smoothly
- Subtitles change in sync with audio
- No awkward pauses or jumps

- [ ] **Step 5: Update CLAUDE.md if needed**

Add note about new sync behavior to `CLAUDE.md`:

```markdown
## 音画同步 (Audio-Visual Sync)

视频时长现在由实际音频时长驱动，而非字数估算：
- `voiceover-tts` 按句子拆分音频，用 ffprobe 获取精确时长
- `remotion-video` 从 manifest 读取时长，计算帧数
- 长字幕分段显示，与语音节奏对齐
```

- [ ] **Step 6: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: document audio-visual sync improvements"
```

---

## Phase 4: Optional Enhancements

### Task 8: video-script 句子级时间戳 (Optional)

**Files:**
- Modify: `.claude/skills/video-script/SKILL.md`

- [ ] **Step 1: Add optional timing annotation format**

Add new section after "Output Template":

```markdown
### Fine-Grained Timing (Optional)

For better subtitle synchronization, you can optionally annotate sentence-level timing in the 口播 field:

```markdown
- **口播**: "GPT-5.5来了！[0-3s] 多项基准领先，但有一个项目它输了。[3-7s]"
```

This enables:
1. Pre-planned subtitle timing
2. Better alignment with TTS generation
3. Reduced post-production adjustment

**Rules:**
- Use bracket notation `[start-end]` after each sentence
- Time is relative to shot start (not video start)
- Optional: if not provided, timing will be derived from audio
```

- [ ] **Step 2: Commit**

```bash
git add .claude/skills/video-script/SKILL.md
git commit -m "docs(video-script): add optional fine-grained timing notation"
```

---

## Success Criteria

After implementation, verify:

1. ✅ Audio durations are measured with ffprobe
2. ✅ Manifest includes `duration_seconds` for each segment
3. ✅ Long text is split into sentence-level audio files
4. ✅ remotion-video uses audio durations for frame calculation
5. ✅ ProgressiveSubtitle displays subtitles in sync with audio segments
6. ✅ Script timestamps are updated to match actual audio durations
7. ✅ No manual timing adjustment needed in post-production

---

## Rollback Plan

If issues arise:

1. **Revert voiceover-tts changes:** Use `--no-fine` flag to disable sentence splitting
2. **Revert remotion-video changes:** Falls back to character-count estimation if manifest lacks duration info
3. **Restore old audio:** Backup created before regeneration

---

## Future Improvements

- Word-level timing from TTS API (if available)
- Automatic subtitle position adjustment for bottom UI
- Lip-sync animation based on audio waveform
- Multi-language support for sentence splitting
