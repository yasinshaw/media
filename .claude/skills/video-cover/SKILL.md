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

Present a design proposal to the user:

```markdown
## 📋 封面设计方案

### 项目信息
- **项目**: {project-slug}
- **视频标题**: {title-from-script}

### 🎨 设计方案

#### 主标题
{proposed-main-title}

#### 副标题
{proposed-subtitle}

#### 视觉风格
- **风格类型**: {tech/business/lifestyle/education/entertainment}
- **色调**: {color-scheme}
- **背景提示词**: {background-prompt}

### 确认设计？

回复以下选项：
- "确认" / "好的" — 使用此方案生成
- "标题: xxx" — 修改标题
- "副标题: xxx" — 修改副标题
- "风格: xxx" — 修改风格（科技/商务/生活/教育/娱乐）
- "色调: xxx" — 修改色调描述
```

**WAIT for user confirmation before proceeding to Step 4.**

### Step 4: Generate Pure Backgrounds

After confirmation, call Volcano Ark API to generate pure background images (NO text in prompt):

```bash
curl -X POST https://ark.cn-beijing.volces.com/api/v3/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $VOLCARK_API_KEY" \
  -d '{
    "model": "doubao-seedream-5-0-260128",
    "prompt": "<pure background prompt, no text>",
    "size": "2K",
    "response_format": "url"
  }'
```

Download backgrounds to temporary names:
- `cover-background-landscape.png`
- `cover-background-portrait.png`

### Step 5: AI Recommends Color Scheme

Read the generated background images and analyze them to recommend a color scheme:

```markdown
## 🎨 AI 配色推荐

### 背景图分析
- **横版背景**: {visual description of landscape background}
- **竖版背景**: {visual description of portrait background}
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

### Step 6: Add Text Overlay with Python

Use Python script with AI-recommended colors:

```bash
# Portrait
python scripts/add_cover_text.py \
  cover-background-portrait.png \
  projects/<YYYY-MM-DD-<slug>>/assets/images/cover-portrait.png \
  "{title}" \
  "{subtitle}" \
  '{"text_color":"#ffffff","accent_color":"#00ffff","glow_color":"#00ffff","bg_box_alpha":120}'

# Landscape
python scripts/add_cover_text.py \
  cover-background-landscape.png \
  projects/<YYYY-MM-DD-<slug>>/assets/images/cover-landscape.png \
  "{title}" \
  "{subtitle}" \
  '{"text_color":"#ffffff","accent_color":"#00ffff","glow_color":"#00ffff","bg_box_alpha":120}'
```

**Color parameters:**
- `text_color`: Main title text color (hex)
- `accent_color`: Decorative elements color (hex)
- `glow_color`: Title glow color (hex)
- `bg_box_alpha`: Background box opacity (0-255)

Omit the JSON parameter to use auto-generated colors.

## Volcano Ark API

### Configuration
```
API Base URL: https://ark.cn-beijing.volces.com/api/v3
Endpoint: /images/generations
Model: doubao-seedream-5-0-260128
```

### API Key
Read from environment variable:
```bash
VOLCARK_API_KEY=REDACTED_API_KEY
```

Stored in project root `.env` file.

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
<Composition Description - leave space for title at top>,
<Color Scheme>, <Lighting>, <Quality Tags>
```

### Example Background Prompts

**Tech/AI (Portrait):**
```
AI人工智能主题, 未来科技感, 霓虹蓝色和紫色渐变背景,
电路板纹理, 数据流动光效, 上升的数据流粒子,
画面上方30%留空给标题, 下方70%展示科技元素,
赛博朋克风格, 高对比度, 电影大片质感, 8K分辨率, 竖版构图
```

**Business (Landscape):**
```
商业金融主题, 高端商务风格, 深蓝和金色配色,
摩天大楼剪影, 上升的图表曲线, 专业感, 大气,
画面左侧留空给标题, 右侧展示视觉元素,
电影级光效, 极其清晰, 4K高清, 横版构图
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
  "bg_box_alpha": 120           // Background box opacity (0-255)
}
```

Omit `colors_json` to use auto-generated colors based on background analysis.

### Usage Examples

```bash
# With AI-recommended colors
python scripts/add_cover_text.py \
  cover-background-portrait.png \
  projects/2026-04-25-xxx/assets/images/cover-portrait.png \
  "GPT-5.5来了" \
  "推理+8% 代码+9%" \
  '{"text_color":"#ffffff","accent_color":"#00ffff","glow_color":"#00ffff","bg_box_alpha":120}'

# With auto-generated colors (no colors_json)
python scripts/add_cover_text.py \
  cover-background-landscape.png \
  projects/2026-04-25-xxx/assets/images/cover-landscape.png \
  "GPT-5.5来了" \
  "综合第一但有个项目输了"
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
1. VOLCARK_API_KEY 是否正确
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
2. **Background prompts must exclude text** — AI renders text poorly
3. **Title should be short** — ≤8 characters for best readability
4. **Subtitle is optional** — omit if title is self-explanatory
5. **AI recommends colors after background generation** — analyze the generated background and propose a matching color scheme
6. **Use auto-generated colors as fallback** — if user doesn't want to specify, the script will auto-generate based on background luminance
7. **Test font rendering** — ensure Chinese characters display correctly
8. **Ensure high contrast** — text color should contrast well with background (WCAG AA level or better)
