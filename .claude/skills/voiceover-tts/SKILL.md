---
name: voiceover-tts
description: Generate voiceover audio from text using Volcano Ark TTS API. Use when user asks to create voiceover, TTS audio, or narration from voiceover text. Reads voiceover.md, confirms speaker, then generates split MP3 files (one per line) for flexible post-production editing.
---

You are a voiceover specialist who generates professional TTS audio for video content.

## Quick Start

User provides a project slug, you read the voiceover text, confirm speaker, then generate audio.

### Command Format
```
/voiceover <project-slug>
```

Example:
```
/voiceover gpt-image2-compare
```

### Fine-Grained Mode (Default)

By default, the skill generates **sentence-level audio segments** for better subtitle synchronization.

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

## Workflow

### Step 1: Locate Project
Search for project in `projects/` directory. Find matching project by slug or date prefix.

### Step 2: Read Voiceover Text
Read `projects/<YYYY-MM-DD-<slug>>/voiceover.md` to extract the voiceover text.

The file format is:
```markdown
# <视频标题> — 口播文案

> 总字数: <n>字 | 预估时长: <m>分<s>秒

---

<voiceover text body>
```

Extract only the text content after the `---` separator.

### Step 3: Confirm Generation

Present the voiceover summary to the user:

```markdown
## 📋 台词生成确认

### 项目信息
- **项目**: {project-slug}
- **视频标题**: {title}
- **分段数量**: {n}段

### 🎙️ 音色设置
- **默认音色**: 刘飞 2.0 (zh_male_liufei_uranus_bigtts)
- **说明**: 成熟男性音色，适合知识科普、资讯解说类内容

### 📁 输出方式
- **分文件生成**: 每句台词单独生成 MP3 文件
- **文件命名**: voiceover-01.mp3, voiceover-02.mp3, ...
- **合并文件**: voiceover-full.mp3 (完整版)
- **清单文件**: voiceover-manifest.json (索引)

### 确认生成？

回复以下选项：
- "确认" / "好的" — 使用默认音色生成
- "音色: <音色ID>" — 指定其他音色（可选音色见下方列表）
```

**WAIT for user confirmation before proceeding to Step 4.**

### Step 4: Generate Split Audio Files

After confirmation, run the Python script in **split mode**:

```bash
python .claude/skills/voiceover-tts/scripts/generate_voiceover.py \
  split \
  projects/<YYYY-MM-DD-<slug>>/voiceover.md \
  projects/<YYYY-MM-DD-<slug>>/assets/audio/ \
  <speaker>
```

The script will:
1. Parse voiceover.md and extract each line of voiceover text
2. Generate one MP3 file per line: `voiceover-01.mp3`, `voiceover-02.mp3`, etc.
3. Generate `voiceover-full.mp3` — all segments combined for quick preview
4. Generate `voiceover-manifest.json` — index file with segment info

Script location: `.claude/skills/voiceover-tts/scripts/generate_voiceover.py`

## Volcano Ark TTS API

### Configuration
```
API URL: https://openspeech.bytedance.com/api/v3/tts/unidirectional
Resource ID: seed-tts-2.0 (for TTS 2.0 voices)
Audio Format: MP3
Sample Rate: 24000 Hz
```

### Authentication

**New Console (Recommended)**: Only need API Key
```bash
VOLC_TTS_API_KEY=your_api_key
```

**Old Console**: Need APP ID and Access Key
```bash
VOLC_TTS_APP_ID=your_app_id
VOLC_TTS_ACCESS_KEY=your_access_key
```

Get credentials from:
1. 火山引擎控制台: https://console.volcengine.com/speech/service
2. 新版控制台直接复制 API Key
3. 旧版控制台需要获取 App ID 和 Access Key

### API Headers
**New Console**:
```
X-Api-Key: <VOLC_TTS_API_KEY>
X-Api-Resource-Id: seed-tts-2.0
```

**Old Console**:
```
X-Api-App-Id: <VOLC_TTS_APP_ID>
X-Api-Access-Key: <VOLC_TTS_ACCESS_KEY>
X-Api-Resource-Id: seed-tts-2.0
```

## Speaker Voices

### Default Speaker (Recommended)
**刘飞 2.0** (`zh_male_liufei_uranus_bigtts`)
- 成熟男性音色
- 适用场景: 知识科普、资讯解说、商业内容
- 支持能力: 情感变化、指令遵循、ASMR

### Popular Alternative Speakers

#### Male Voices (男性音色)
| 名称 | Speaker ID | 适用场景 |
|------|-----------|---------|
| 云舟 2.0 | zh_male_m191_uranus_bigtts | 通用场景 |
| 小天 2.0 | zh_male_taocheng_uranus_bigtts | 通用场景 |
| 解说小明 2.0 | zh_male_jieshuoxiaoming_uranus_bigtts | 解说类 |
| 深夜播客 2.0 | zh_male_shenyeboke_uranus_bigtts | 播客、夜读 |
| 磁性解说男声 2.0 | zh_male_cixingjieshuonan_uranus_bigtts | 磁性解说 |
| 儒雅青年 2.0 | zh_male_ruyaqingnian_uranus_bigtts | 知识讲解 |

#### Female Voices (女性音色)
| 名称 | Speaker ID | 适用场景 |
|------|-----------|---------|
| Vivi 2.0 | zh_female_vv_uranus_bigtts | 通用场景（多语种）|
| 小何 2.0 | zh_female_xiaohe_uranus_bigtts | 通用场景 |
| 知性灿灿 2.0 | zh_female_cancan_uranus_bigtts | 知性内容 |
| 甜美桃子 2.0 | zh_female_tianmeitaozi_uranus_bigtts | 甜美风格 |
| 爽快思思 2.0 | zh_female_shuangkuaisisi_uranus_bigtts | 活力内容 |

For complete speaker list, see: https://www.volcengine.com/docs/6561/1257544

## Text Processing

### Text Length Limits
- **Recommended**: 200-600 characters (1-3 minutes of audio)
- **Maximum**: ~5000 characters per request
- If text exceeds limit, split into multiple audio files

### Text Formatting
- Remove markdown formatting (bold, italic, links)
- Remove timestamps like `(0-8s)`, `镜头1`, etc.
- Remove section headers like `### 镜头 1`
- Keep paragraph breaks for natural pauses

### Punctuation Tips
- Use proper punctuation for natural pauses (，。！？)
- Avoid excessive punctuation (e.g., "！！！")
- Ellipsis (...) creates a longer pause

## Output Format

```markdown
# 台词生成完成

## 📋 项目信息
- **项目**: {project-slug}
- **视频标题**: {title}
- **使用音色**: {speaker-name}

## 🎙️ 生成的音频

### 分段文件 (用于后期剪辑)
- **目录**: `projects/{date-slug}/assets/audio/`
- **文件**: voiceover-01.mp3, voiceover-02.mp3, ..., voiceover-NN.mp3
- **格式**: MP3
- **采样率**: 24000 Hz

### 合并文件 (用于预览)
- **文件**: `projects/{date-slug}/assets/audio/voiceover-full.mp3`
- **说明**: 所有段落合并的完整音频

### 索引文件
- **文件**: `projects/{date-slug}/assets/audio/voiceover-manifest.json`
- **内容**: 每段音频的文件名、大小、对应文本

## 使用建议

- **后期剪辑**: 使用 voiceover-NN.mp3 单独文件，灵活调整每句时长
- **快速预览**: 使用 voiceover-full.mp3 听整体效果
- **重新生成**: 单独重新生成某一句，替换对应文件即可
- **Remotion**: 可导入单文件或合并文件作为配音
```

## Error Handling

### Project Not Found
```
❌ 项目未找到: {slug}
可用项目:
{list projects/ directories}
```

### Voiceover File Not Found
```
❌ 口播文案不存在: projects/{slug}/voiceover.md
请先运行 /video-script 生成脚本和口播文案
```

### Missing API Credentials
```
❌ API 凭证未配置
请在项目根目录的 .env 文件中添加:
# 新版控制台 (推荐)
VOLC_TTS_API_KEY=your_api_key

# 或旧版控制台
VOLC_TTS_APP_ID=your_app_id
VOLC_TTS_ACCESS_KEY=your_access_key

获取方式: https://console.volcengine.com/speech/service
```

### Python Script Error
```
❌ 台词生成失败
错误: {error_message}

请检查:
1. Python 是否安装 (需要 3.7+)
2. requests 模块是否安装: pip install requests
3. API 凭证是否正确
4. 网络连接是否正常
```

### API Error Response
```
❌ TTS API 调用失败
状态码: {status_code}
错误信息: {error_message}

常见问题:
- 40402003: 文本长度超过限制
- 45000000: 音色鉴权失败
- quota exceeded: 并发数超限
```

## Integration with Pipeline

This skill runs after `/video-script` generates the voiceover text:
1. `/video-script` → generates `script.md` and `voiceover.md`
2. `/voiceover` → **this skill** — generates split MP3 files + manifest
3. Optional: Use audio in `/remotion-video` or video editing tools

### Post-Production Workflow

The split files enable flexible editing:
```
voiceover-01.mp3  →  镜头1配音
voiceover-02.mp3  →  镜头2配音
voiceover-03.mp3  →  镜头3配音
...
```

Each file can be:
- Individually trimmed/padded for timing
- Replaced without re-generating everything
- Synced with video timeline precisely

## Path Conventions

| 用途 | 路径格式 |
|------|----------|
| 口播文案 | `projects/<YYYY-MM-DD-<slug>>/voiceover.md` |
| 音频目录 | `projects/<YYYY-MM-DD-<slug>>/assets/audio/` |
| 分段音频 | `voiceover-01.mp3`, `voiceover-02.mp3`, ... |
| 合并音频 | `voiceover-full.mp3` |
| 索引清单 | `voiceover-manifest.json` |
| Python脚本 | `.claude/skills/voiceover-tts/scripts/generate_voiceover.py` |
| API凭证 | `.env` (project root) |

## Advanced Parameters

### Emotion (情感)
Add emotion parameter to payload for supported speakers:
```python
"audio_params": {
    "format": "mp3",
    "sample_rate": 24000,
    "emotion": "happy",  # happy, sad, angry, etc.
}
```

Supported emotions vary by speaker. Check documentation for details.

### Speech Rate (语速)
```python
"audio_params": {
    "speech_rate": 0,  # -50 to 100, 0=normal
}
```

### Volume (音量)
```python
"audio_params": {
    "loudness_rate": 0,  # -50 to 100, 0=normal
}
```

## Tips

1. **Always confirm before generating** — API calls cost money
2. **Check voiceover.md exists** — required input file
3. **Use default speaker first** — 刘飞 2.0 works well for most content
4. **Test short text first** — verify API credentials with short text
5. **Keep text clean** — remove timestamps and markdown formatting
