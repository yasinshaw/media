---
name: voiceover-tts
description: Generate voiceover audio from text using Volcano Ark TTS API. Use when user asks to create voiceover, TTS audio, or narration from voiceover text. Reads voiceover.md, confirms speaker, then generates complete MP3 audio for natural prosody.
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

### Full Mode (Default)

By default, the skill generates the **complete voiceover as one continuous audio file** for natural prosody and intonation.

**Why full mode?**
- TTS engine has full context for natural intonation and pacing
- No tonal jumps between segments
- Better listening experience

**Behavior:**
- All text sent to TTS in a single API call (within 5000 char limit)
- Produces `voiceover-full.mp3` — the complete, natural-sounding audio
- Produces `voiceover-manifest.json` — sentence-level timing for subtitle sync
- Optional `--split` flag: also generates per-shot files cut from the full audio

### Split Mode (Legacy)

Use `split` mode when you need **independently generated** per-line audio files (each line is a separate API call).

**WARNING:** Split mode causes tonal inconsistency between segments because the TTS engine lacks context.

```bash
python .claude/skills/voiceover-tts/scripts/generate_voiceover.py \
  split \
  projects/<YYYY-MM-DD-<slug>>/voiceover.md \
  projects/<YYYY-MM-DD-<slug>>/assets/audio/ \
  <speaker>
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
- **字数**: {n}字
- **分段数**: {m}段

### 🎙️ 音色设置
- **默认音色**: 刘飞 2.0 (zh_male_liufei_uranus_bigtts)
- **说明**: 成熟男性音色，适合知识科普、资讯解说类内容

### 📁 输出方式
- **完整语音**: voiceover-full.mp3 (一次生成，语调自然连贯)
- **时间清单**: voiceover-manifest.json (字幕时间轴)
- **分段文件**: 默认不生成；需要时加 --split 参数

### 确认生成？

回复以下选项：
- "确认" / "好的" — 使用默认音色生成
- "音色: <音色ID>" — 指定其他音色
- "加分段" — 同时生成分段文件
```

**WAIT for user confirmation before proceeding to Step 4.**

### Step 4: Generate Audio

After confirmation, run the Python script in **full mode**:

```bash
python .claude/skills/voiceover-tts/scripts/generate_voiceover.py \
  full \
  projects/<YYYY-MM-DD-<slug>>/voiceover.md \
  projects/<YYYY-MM-DD-<slug>>/assets/audio/ \
  <speaker>
```

If user requested per-shot files, add `--split`:

```bash
python .claude/skills/voiceover-tts/scripts/generate_voiceover.py \
  full \
  projects/<YYYY-MM-DD-<slug>>/voiceover.md \
  projects/<YYYY-MM-DD-<slug>>/assets/audio/ \
  <speaker> \
  --split
```

The script will:
1. Parse voiceover.md and join all lines into one text
2. Generate complete audio in a single API call
3. Save `voiceover-full.mp3`
4. Build `voiceover-manifest.json` with sentence-level timing
5. (With `--split`) Cut per-shot files from the full audio using ffmpeg

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
- If text exceeds limit, script auto-splits by paragraph

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
- **总时长**: {n}s

## 🎙️ 生成的音频

### 完整语音 (推荐使用)
- **文件**: `projects/{date-slug}/assets/audio/voiceover-full.mp3`
- **说明**: 一次性生成，语调自然连贯
- **格式**: MP3, 24000 Hz

### 时间清单 (字幕同步)
- **文件**: `projects/{date-slug}/assets/audio/voiceover-manifest.json`
- **内容**: 每句话的起止时间，用于字幕对齐

### 分段文件 (可选)
- **文件**: voiceover-01.mp3, voiceover-02.mp3, ...
- **说明**: 从完整音频裁剪，非独立生成
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
2. `/voiceover` → **this skill** — generates complete MP3 + manifest
3. Optional: Use audio in `/remotion-video` or video editing tools

## Path Conventions

| 用途 | 路径格式 |
|------|----------|
| 口播文案 | `projects/<YYYY-MM-DD-<slug>>/voiceover.md` |
| 音频目录 | `projects/<YYYY-MM-DD-<slug>>/assets/audio/` |
| 完整语音 | `voiceover-full.mp3` |
| 时间清单 | `voiceover-manifest.json` |
| 分段音频 | `voiceover-01.mp3`, `voiceover-02.mp3`, ... (可选) |
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
