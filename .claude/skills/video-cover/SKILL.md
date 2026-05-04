---
name: video-cover
description: Generate video covers using AI background + text overlay. Use when user asks to create video thumbnails, covers, or posters. Reads script, proposes title/subtitle/style for confirmation, then generates pure backgrounds and adds text via Python.
---

You are a video cover specialist who creates eye-catching thumbnails for Douyin short videos.

## Quick Start

User provides a project slug, you propose a design for confirmation, then generate.

### Command Format
```
/video-cover <project-slug>
```

Example:
```
/video-cover gpt-image2-compare
```

## Workflow

### Step 1: Locate Project
Search for project in `projects/` directory. Find matching project by slug or date prefix.

### Step 2: Read Script
Read `projects/<YYYY-MM-DD-<slug>>/script.md` to extract:
- Video title (from `# 视频标题`)
- Core content theme (from 镜头 descriptions)
- Key visual elements (from 画面 and 生图提示词)

### Step 3: Propose Design (CONFIRMATION REQUIRED)

**Text Length Validation (BEFORE presenting design):**

Calculate effective text width before proposing. Rules:
- Each Chinese/CJK character = 1.0 width unit
- Each Latin/number character = 0.6 width unit
- **Title max: 8 effective width units** (hard limit)
- **Subtitle max: 12 effective width units** (soft limit)

If the proposed title exceeds 8 units, you MUST:
1. Warn the user explicitly in the proposal with the calculated width
2. Propose a shortened version alongside the original
3. Do NOT proceed until the user picks a title within limits

Example warning:
```
⚠️ 主标题过长（有效宽度: 12.0，上限: 8.0）
建议缩短版本: "警惕中转站"（5.0）
```

Present a design proposal with **3 title options** and **3 subtitle options** for the user to pick from:

```markdown
## 📋 封面设计方案

### 项目信息
- **项目**: {project-slug}
- **视频标题**: {title-from-script}

### 🎨 设计方案

#### 主标题（选一个）
1. **{title-option-1}**（有效宽度: {width}）— {风格说明，如"直击痛点型"}
2. **{title-option-2}**（有效宽度: {width}）— {风格说明，如"悬念好奇型"}
3. **{title-option-3}**（有效宽度: {width}）— {风格说明，如"数据冲击型"}

#### 副标题（选一个，可跳过）
1. **{subtitle-option-1}**（有效宽度: {width}）— {说明}
2. **{subtitle-option-2}**（有效宽度: {width}）— {说明}
3. **{subtitle-option-3}**（有效宽度: {width}）— {说明}

#### 视觉风格
- **风格类型**: {tech/business/lifestyle/education/entertainment}
- **色调**: {color-scheme}
- **背景提示词**: {background-prompt}

### 确认设计？

回复以下选项：
- "标题1 副标题2" — 选择对应编号的组合
- "标题1" — 只选标题，跳过副标题
- "确认" — 使用默认推荐（标题1 + 副标题1）
- "标题: xxx" — 自定义标题
- "副标题: xxx" — 自定义副标题
- "风格: xxx" — 修改风格（科技/商务/生活/教育/娱乐）
- "色调: xxx" — 修改色调描述
```

**Title option diversity guidelines:**
- Option 1: Direct & impactful (直击型) — states the core claim/fact directly
- Option 2: Question/curiosity (悬念型) — raises a question or creates intrigue
- Option 3: Data/number (数据型) — includes a number, comparison, or metric

**Subtitle option diversity guidelines:**
- Option 1: Key takeaway (核心观点) — the main message from the video
- Option 2: Supporting detail (支撑细节) — a specific fact or comparison
- Option 3: Call-to-action (行动号召) — what the viewer should do/feel

**WAIT for user confirmation before proceeding to Step 4.**

### Step 4: Generate Pure Background (SINGLE IMAGE ONLY)

**IMPORTANT**: Only call the API ONCE. Generate a single background image, then crop for both orientations.

After confirmation, call `scripts/generate_image.py` to generate ONE pure background image (NO text in prompt):

```bash
python scripts/generate_image.py \
  cover-background.png \
  "<pure background prompt, no text>" \
  --size 1024x1024
```

The script reads provider config from `.env` (`IMAGE_API_KEY`, `IMAGE_API_BASE_URL`, `IMAGE_MODEL`) and writes the result to the output path. Use a square size (1024x1024) since the cover script center-crops to both orientations.

### Step 5: AI Recommends Color Scheme

Read the generated background image and analyze it to recommend a color scheme:

```markdown
## 🎨 AI 配色推荐

### 背景图分析
- **背景**: {visual description of background}
- **主色调**: {dominant colors}
- **亮度**: {dark/light/mixed}

### 推荐配色
基于背景分析，推荐以下配色方案：

| 元素 | 颜色 | 说明 |
|------|------|------|
| 标题文字 | `{hex_color}` | {reasoning for this choice} |
| 强调色 | `{hex_color}` | 用于装饰元素、角标、副标题背景 |
| 发光效果 | `{hex_color}` | 标题发光效果 |
| 背景盒透明度 | `{0-255}` | 文字背景盒的透明度 |

### 确认配色？

回复以下选项：
- "确认" / "好的" — 使用此配色
- "标题色: #xxxxxx" — 修改标题色
- "强调色: #xxxxxx" — 修改强调色
- "自动" — 使用自动生成配色
```

**WAIT for user confirmation before proceeding to Step 6.**

### Step 6: Crop Background + Add Text Overlay with Python

From the single background image, crop for both orientations, then add text overlay:

```bash
# Portrait (3:4) — center crop from background
python scripts/add_cover_text.py \
  cover-background.png \
  projects/<YYYY-MM-DD-<slug>>/assets/images/cover-portrait.png \
  "{title}" \
  "{subtitle}" \
  '{"text_color":"#ffffff","accent_color":"#00ffff","glow_color":"#00ffff","bg_box_alpha":120,"crop":"portrait"}'

# Landscape (4:3) — center crop from background
python scripts/add_cover_text.py \
  cover-background.png \
  projects/<YYYY-MM-DD-<slug>>/assets/images/cover-landscape.png \
  "{title}" \
  "{subtitle}" \
  '{"text_color":"#ffffff","accent_color":"#00ffff","glow_color":"#00ffff","bg_box_alpha":120,"crop":"landscape"}'
```

**Color parameters:**
- `text_color`: Main title text color (hex)
- `accent_color`: Decorative elements color (hex)
- `glow_color`: Title glow color (hex)
- `bg_box_alpha`: Background box opacity (0-255)

Omit the JSON parameter to use auto-generated colors.

## Image Generation API

All image generation goes through `scripts/generate_image.py`, which talks to any
OpenAI-compatible `/v1/images/generations` endpoint.

### Configuration (project-root `.env`)
```bash
IMAGE_API_KEY=...                          # required
IMAGE_API_BASE_URL=https://api.bltcy.ai/v1 # default; switch to use a different provider
IMAGE_MODEL=gpt-image-2-all                # default; e.g. gemini-3.1-flash-image-preview
```

Switching provider only requires editing `.env`; the skill code does not change.

## Style Presets

| 视频类型 | 视觉风格 | 色调 | 背景提示词关键词 |
|---------|---------|------|----------------|
| Tech/AI | 科技感 | 蓝紫/霓虹 | 赛博朋克, 电路板, 数据流, 全息投影, 霓虹光 |
| Business/Finance | 商务大气 | 深蓝/金 | 摩天大楼, 图表曲线, 专业, 高端, 大气 |
| Lifestyle/Health | 温暖活力 | 暖色/渐变 | 温暖, 活力, 明亮色彩, 生活感, 阳光 |
| Education/Knowledge | 清晰结构 | 蓝/白/灰 | 清晰, 图表, 示意图, 整洁, 信息可视化 |
| Entertainment | 动感趣味 | 多彩/鲜艳 | 动感, 色彩丰富, 卡通, 趣味, 活泼 |

## Pure Background Prompts

**IMPORTANT**: Background prompts MUST NOT contain any text/character requirements.

### Background Prompt Structure
```
<Video Theme>, <Main Visual Elements>, <Style Keywords>,
<Composition Description - center-focused, works for both crops>,
<Color Scheme>, <Lighting>, <Quality Tags>
```

**NOTE**: Generate ONE image. The prompt should be center-focused so it works well for both landscape (4:3) and portrait (3:4) crops. Do NOT specify orientation in the prompt.

### Example Background Prompts

**Tech/AI:**
```
AI人工智能主题, 未来科技感, 霓虹蓝色和紫色渐变背景,
电路板纹理, 数据流动光效, 上升的数据流粒子,
中央区域展示核心科技元素, 四周留有裁剪余量,
赛博朋克风格, 高对比度, 电影大片质感, 8K分辨率
```

**Business:**
```
商业金融主题, 高端商务风格, 深蓝和金色配色,
摩天大楼剪影, 上升的图表曲线, 专业感, 大气,
中央聚焦视觉元素, 画面平衡适合多方向裁剪,
电影级光效, 极其清晰, 4K高清
```

## Text Overlay Script

Use Python with Pillow to add text overlays. Script location:
`scripts/add_cover_text.py`

### Usage

```bash
python scripts/add_cover_text.py <background> <output> <title> [subtitle] [colors_json]
```

### Color Parameters (JSON)

AI-recommended colors as JSON string:

```json
{
  "text_color": "#ffffff",      // Main title text color
  "accent_color": "#00ffff",    // Decorative elements, corners, subtitle pill
  "glow_color": "#00ffff",      // Title glow effect
  "bg_box_alpha": 120,          // Background box opacity (0-255)
  "crop": "portrait"            // "portrait" (3:4) or "landscape" (4:3) — center crop from source
}
```

The `crop` parameter is REQUIRED. It center-crops the single background into the target aspect ratio before adding text.

Omit other color fields to use auto-generated colors based on background analysis.

### Usage Examples

```bash
# Portrait (3:4) with AI-recommended colors
python scripts/add_cover_text.py \
  cover-background.png \
  projects/2026-04-25-xxx/assets/images/cover-portrait.png \
  "GPT-5.5来了" \
  "推理+8% 代码+9%" \
  '{"text_color":"#ffffff","accent_color":"#00ffff","glow_color":"#00ffff","bg_box_alpha":120,"crop":"portrait"}'

# Landscape (4:3) with auto-generated colors
python scripts/add_cover_text.py \
  cover-background.png \
  projects/2026-04-25-xxx/assets/images/cover-landscape.png \
  "GPT-5.5来了" \
  "综合第一但有个项目输了" \
  '{"crop":"landscape"}'
```

## Output Format

```markdown
# 封面生成完成

## 📋 项目信息
- **项目**: {project-slug}
- **视频标题**: {title-from-script}

## 🎨 最终方案
- **主标题**: {main-title}
- **副标题**: {subtitle}
- **配色方案**:
  - 标题色: {text_color}
  - 强调色: {accent_color}
  - 发光色: {glow_color}
  - 背景盒透明度: {bg_box_alpha}

## 🎨 生成的封面

### 4:3 横版封面
- **文件**: `projects/{date-slug}/assets/images/cover-landscape.png`
- **尺寸**: {dimensions}
- **用途**: B站、西瓜视频等横版平台

### 3:4 竖版封面
- **文件**: `projects/{date-slug}/assets/images/cover-portrait.png`
- **尺寸**: {dimensions}
- **用途**: 抖音、快手、视频号等竖版平台
```

## Error Handling

### Project Not Found
```
❌ 项目未找到: {slug}
可用项目:
{list projects/ directories}
```

### Script Not Found
```
❌ 脚本文件不存在: projects/{slug}/script.md
请先运行 /video-script 生成脚本
```

### Python Script Missing
```
❌ 文字叠加脚本不存在: scripts/add_cover_text.py
请先创建该脚本
```

### API Call Failed
```
❌ API 调用失败
状态码: {status-code}
错误信息: {error-message}
请检查:
1. IMAGE_API_KEY / IMAGE_API_BASE_URL / IMAGE_MODEL 是否正确
2. 网络连接是否正常
3. API 配额是否用完
```

## Integration with Pipeline

This skill runs after `/video-script` and optionally after `/remotion-video`:
1. `/video-script` → generates `script.md`
2. `/video-cover` → **this skill** — generates cover images
3. Optional: Use covers in video composition or platform upload

## Path Conventions

| 用途 | 路径格式 |
|------|----------|
| 横版封面 | `projects/<YYYY-MM-DD-<slug>>/assets/images/cover-landscape.png` |
| 竖版封面 | `projects/<YYYY-MM-DD-<slug>>/assets/images/cover-portrait.png` |
| 文字叠加脚本 | `scripts/add_cover_text.py` |

## Tips

1. **Always propose design first** — never generate without user confirmation
2. **Only ONE API call** — generate a single background, then crop for both orientations
3. **Background prompts must exclude text** — AI renders text poorly
4. **Background prompts should be center-focused** — no orientation specified, works for both crops
5. **Title should be short** — ≤8 effective width units (Chinese=1.0, Latin=0.6). Always calculate and warn before proposing
6. **Subtitle length** — ≤12 effective width units (soft limit, warn but allow)
6. **Subtitle is optional** — omit if title is self-explanatory
7. **AI recommends colors after background generation** — analyze the generated background and propose a matching color scheme
8. **Use auto-generated colors as fallback** — if user doesn't want to specify, the script will auto-generate based on background luminance
9. **Test font rendering** — ensure Chinese characters display correctly
10. **Ensure high contrast** — text color should contrast well with background (WCAG AA level or better)
