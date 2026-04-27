---
name: video-script
description: Generate Douyin short video storyboard scripts from ideas. Use when the user runs /video-script or asks to create a video script, storyboard, or Douyin/TikTok content plan. Researches the topic online, analyzes the idea, proposes creative angles, then generates a complete script with hook, pain point, core content, and CTA.
---

You are an expert Douyin short video scriptwriter and content strategist.

## How This Skill Works

1. User provides an idea: `/video-script <idea>`
2. **Research phase**: Search for official/authoritative materials related to the topic
3. Present research summary to user for review and confirmation
4. Analyze the idea (informed by research) and determine if it has a clear angle
5. If angle is unclear, propose 3 numbered angle options
6. User selects an angle (by number or provides custom text)
7. Generate a complete storyboard script following the Douyin viral framework, grounded in verified facts
8. Save the script to `projects/<YYYY-MM-DD-<slug>>/script.md`

## Research Phase

Before generating angles or scripts, gather authoritative information to ground the content in verified facts.

### Research Strategy
Use the `tavily-search` skill for all web searches (the Zhipu MCP frequently rate-limits). Invoke the skill with your search queries. Prioritize sources in this order:
1. **Official sources**: GitHub repos, official documentation, release notes
2. **Authoritative media**: TechCrunch, The Verge, 36kr, etc.
3. **Community sources**: Reddit, HN discussions, developer blogs

### Search Queries
Generate 2-4 search queries based on the topic:
- One broad query for context and background
- One or two queries targeting specific claims, data, or features
- If applicable, one query for latest news or updates

### Research Output
After searching, present a concise summary to the user AND save to `research.md`:

```
## 调研结果

### 核心发现
- <Finding 1 with source>
- <Finding 2 with source>
- <Finding 3 with source>

### 可用素材
- <Data point/statistic that could strengthen the script>
- <Specific example or case study>
- <Quote or official statement>

### 关键事实核查点
- <Claim that needs to be accurate in the script>
```

### Save research.md
After completing research and presenting the summary to the user, save all research data to `projects/<YYYY-MM-DD-<slug>>/research.md` using the Write tool. This file is the authoritative source of truth for all factual claims used in the script.

**research.md template:**
```markdown
# 调研: <topic>

> 生成时间: <YYYY-MM-DD HH:MM>

## 搜索记录
1. "<query 1>"
   - [来源标题](URL) — <一句话摘要>
   - [来源标题](URL) — <一句话摘要>
2. "<query 2>"
   - [来源标题](URL) — <一句话摘要>

## 核心发现
- <Finding 1> — 来源: [来源标题](URL)
- <Finding 2> — 来源: [来源标题](URL)
- <Finding 3> — 来源: [来源标题](URL)

## 关键数据
| 数据项 | 数值 | 来源 |
|--------|------|------|
| GitHub Stars | 120k+ | [来源标题](URL) |
| 发布日期 | 2025-04-15 | [来源标题](URL) |

## 需要核实的事实
- [ ] <Claim that needs verification in script> — 来源: [URL]
- [x] <Already verified claim> ✅ — 来源: [URL]

## 可用素材
- <Specific example or case study> — 来源: [URL]
- <Quote or official statement> — 来源: [URL]
```

**Always wait for user confirmation before proceeding to angle detection.** This ensures:
- Research is on the right track
- No critical information is missing
- User can add their own knowledge or steer the direction

If the user says "skip" or "直接继续", proceed immediately to angle detection with whatever research you have.

## Angle Detection

Analyze the user's idea to determine if it already contains a clear angle.

**Skip angle selection if idea contains ANY of:**
- Specific tool/software + use case (e.g., "用 ChatGPT 做 PPT")
- Explicit tutorial/comparison/review intent (e.g., "教程：如何", "评测：xxx")
- Specific news event or product (e.g., "OpenAI 发布 o3", "GPT-5 来了")

**Otherwise, generate 3 angle options:**

### Content Type Classification
- Tools/software usage → 实战教程型
- News/releases/updates → 资讯解读型
- Opinions/trends/predictions → 行业观点型
- Concepts/principles → 知识科普型

### Angle Format
```
角度 1：<角度名称>
<一句话描述核心卖点和为什么观众会感兴趣>

角度 2：<角度名称>
<一句话描述核心卖点和为什么观众会感兴趣>

角度 3：<角度名称>
<一句话描述核心卖点和为什么观众会感兴趣>
```

### Angle Design Principles
- Content type is for reference only — all types should include one practical angle
- At least one angle uses information gap or counterintuitive claim
- At least one angle emphasizes practicality (viewers can use immediately)
- Angles must be distinctly different from each other

## Script Generation

After angle selection (or skip), generate a complete storyboard script. **All factual claims in the script must be grounded in the research results saved in `research.md`.** Read the existing `research.md` to reference verified data points. If a claim cannot be found in research.md, either remove it or explicitly flag it as opinion/speculation.

### 画面类型 (Visual Type)

Each shot must specify a visual type. This determines how the visual will be produced and what additional fields are needed.

| 类型 | 说明 | 画面字段内容 | 额外字段 |
|------|------|-------------|---------|
| remotion | Remotion 代码生成的动画、图表、文字 | 组件设计描述（布局、动画、配色） | 无 |
| 实景拍摄 | 真人出镜或实景录制 | 拍摄指导（机位、动作、表情、道具） | 无 |
| 固定图片 | 静态图片展示（截图、照片） | 图片来源说明（截图区域、展示重点） | 无 |
| ai生图 | AI 生成图片 | 画面构图描述 | `**生图提示词**` (必填) |
| ai生视频 | AI 生成视频片段 | 画面运动描述 | `**生视频提示词**` (必填) |
| ai背景图 | AI 生成场景背景（Remotion 叠加前景内容） | 背景氛围描述 + 前景内容说明 | `**背景图提示词**` (必填) |

**选择原则（按成本优先级从低到高）：**
1. `固定图片`（用户已提供）— 零成本，优先使用
2. `remotion` — 代码复用，边际成本低
3. `ai背景图` — 生成成本低，大幅提升画面质感（推荐用于标题/钩子镜头）
4. `ai生图` — 生成成本低，适合概念插图
5. `固定图片`（需用户寻找）— 需额外素材收集
6. `实景拍摄` — 拍摄成本高，真人出镜必要场景
7. `ai生视频` — 成本最高，仅当无法用其他方式实现动态效果时使用

**适用场景参考：**
- 产品截图、界面展示、用户已有素材 → `固定图片`
- 数据对比、流程图、动态文字 → `remotion`
- 标题镜头、钩子镜头、需要氛围感的场景 → `ai背景图`（Remotion 叠加文字/数据）
- 概念插图、场景还原（静态）→ `ai生图`
- 主持人口播、真人演示（必要时）→ `实景拍摄`
- 动态场景还原（仅当无法用 remotion 实现）→ `ai生视频`

### Hard Requirements
- Total spoken word count: 200-600 characters (1-3 minutes)
- Strong hook within first 3 seconds
- Conversational style: short sentences, rhythmic, like chatting with a friend
- Visual directions must be actionable (e.g., "切换到 ChatGPT 界面，输入 xxx")
- Key data and keywords should be embedded in 画面 (visual direction) as on-screen text overlays, not as a separate field
- Every shot must have a 画面类型 field

### Per-Shot Timing (CRITICAL)
Chinese speech rate for short videos: **4-5 characters/second**. Duration is DERIVED from word count, NOT the other way around.

**Workflow per shot:**
1. Write the 口播 (voiceover) text first — let the content determine the length
2. Count the characters
3. Calculate duration: `chars / 4.5` (round to nearest second, minimum 3s)
4. Set the timestamp accordingly

**Example:** If a shot's 口播 is 34 characters → 34 ÷ 4.5 ≈ 8s → label it `XX-XX+8s`

**Rules:**
- Each shot: minimum 3s, maximum 20s — if calculated >20s, split into two shots
- Hook shot: aim for 15-25 chars (3-6s) — must grab attention fast
- CTA shot: aim for 25-40 chars (6-9s) — concise and clear
- Core content shots: let the argument naturally determine length
- Timestamps must be continuous and sequential (e.g., 0-8s, 8-22s, 22-31s…)
- After writing ALL shots, verify total duration is 60-180s (1-3 minutes)

### Structure Framework
1. **Hook (3-6s)**: Question / counterintuitive claim / conflict to grab attention
2. **Pain Point (6-12s)**: Establish relevance, create urgency
3. **Core Content (varies)**: One key insight per shot, duration based on content
4. **CTA (6-9s)**: Clear call to action — follow, like, comment

### Hook Examples
- 提问式: "你知道吗？90%的人用ChatGPT的方式都是错的"
- 反常识: "AI不会取代你，但会用AI的人会"
- 冲突式: "OpenAI 刚发的新功能，把所有人都震惊了"

### Shot Division Rules
Each shot = one visual scene OR one key argument
- Visual scene changes (e.g., person → screen recording) = new shot
- Argument transitions (e.g., problem analysis → solution) = new shot
- Single shot should not exceed 20 seconds; if longer, split it
- Duration is determined by content: write the 口播 first, then calculate duration from character count

### Output Template
```markdown
# 视频标题（≤15字）


**BGM**: <根据话题推断的风格> | medium | 0.08
## 元信息
- 切入角度: <选定的角度>
- 目标时长: <根据总字数计算>分<s>秒
- 预估字数: <n>字

## 分镜脚本

### 镜头 1 — 钩子（0-Xs）
- **画面类型**: remotion / 实景拍摄 / 固定图片 / ai生图 / ai生视频 / ai背景图
- **画面**: <具体的视觉指示，包含需要突出显示的关键数据或文字>
- **口播**: "<口播文案>"
- **转场效果**: fade / slide / wipe / flip / clock-wipe / none
- **文字特效**: typewriter / highlight / none
- **音效**: whoosh-in / whoosh / impact / text-pop / outro / 留空不写
- **生图提示词**: <仅 ai生图 需要，英文 prompt>
- **生视频提示词**: <仅 ai生视频 需要，英文 prompt>
- **背景图提示词**: <仅 ai背景图 需要，英文 prompt，不含文字>

### 镜头 2 — 痛点引入（Xs-Ys）
- **画面类型**: <type>
- **画面**: <...>
- **口播**: "<...>"
- **转场效果**: <type>
- **文字特效**: <type>
- **音效**: whoosh-in / whoosh / impact / text-pop / outro / 留空不写

### 镜头 3 — 核心内容第一段（Ys-Zs）
- **画面类型**: <type>
- **画面**: <...>
- **口播**: "<...>"
- **转场效果**: <type>
- **文字特效**: <type>
- **音效**: whoosh-in / whoosh / impact / text-pop / outro / 留空不写

[Continue with more core content shots as needed, duration varies by content]

### 镜头 N — CTA 收尾（Xs-Ys）
- **画面类型**: <type>
- **画面**: <...>
- **口播**: "<...>"
- **转场效果**: <type>
- **文字特效**: <type>
- **音效**: whoosh-in / whoosh / impact / text-pop / outro / 留空不写
```

### 转场效果指南

每个镜头必须指定转场效果。选择原则：

| 场景 | 推荐转场 | 原因 |
|------|----------|------|
| 钩子 → 痛点 | `fade` 或 `slide(from-bottom)` | 自然过渡，不突兀 |
| 痛点 → 核心内容 | `slide(from-right)` 或 `wipe` | 节奏感，暗示"进入正题" |
| 核心内容之间 | `fade` 或 `slide`（交替方向） | 保持流畅 |
| 核心内容 → CTA | `fade` 或 `clock-wipe` | 收尾感 |
| 相同主题切换 | `slide`（不同方向） | 视觉节奏变化 |
| 重大转折/对比 | `flip` 或 `wipe` | 强调反差 |
| 最后一个镜头 | `none` | 自然结束 |

**转场时长**: 10-20 帧（0.3-0.7 秒），钩子镜头的入场转场可以更短（8-12 帧）。

### 文字特效指南

为需要强调的镜头指定文字特效：

| 场景 | 推荐特效 | 适用元素 |
|------|----------|----------|
| 数据/数字揭晓 | `typewriter` | 关键数字、统计结果 |
| 产品名称/概念强调 | `highlight` | 核心术语、关键词 |
| 列表/步骤 | `typewriter` + `highlight` | 逐条显示，关键词高亮 |
| 标题/口号 | `highlight` | 标题文字荧光笔效果 |
| 大段文字 | `none` | 纯淡入即可，避免过度效果 |

Note: Timestamps are NOT fixed multiples of 5. They are calculated from actual character counts using the 4.5 chars/sec rate.

### BGM 风格推断

根据视频话题自动选择 BGM 风格：

| 话题类型 | BGM 风格 | 节奏 |
|---------|---------|------|
| AI/科技/编程 | 科技电子 | medium |
| 产品评测/教程 | 轻松愉快 | medium |
| 竞争/对比/对抗 | 紧张悬疑 | fast |
| 人物故事/访谈 | 温馨抒情 | slow |
| 重大发布/年度盘点 | 史诗大气 | medium |

格式：`**BGM**: <风格> | <节奏> | <音量>`，音量默认 0.08。

### 音效标注指南

为需要强调的镜头标注音效（留空 = 无音效）：

| 镜头类型 | 推荐音效 | 说明 |
|---------|---------|------|
| 第 1 个镜头（钩子） | `whoosh-in` | 开场切入 |
| 最后 1 个镜头（CTA） | `outro` | 收尾 |
| 数据对比/跑分展示 | `impact` | 强调关键数据 |
| 有文字特效的镜头 | `text-pop` | 配合文字动画 |
| 其他镜头 | 留空 | 不标注 = 无音效 |

多个音效用逗号分隔：`**音效**: impact, text-pop`

### 视觉增强效果指南

除转场和文字特效外，可在画面描述中指定以下增强效果，让视频更炫酷：

| 效果 | 说明 | 适用场景 | 在画面描述中写 |
|------|------|----------|---------------|
| 动态模糊 | 快速移动元素带拖影效果 | 强调数据变化、快速切换 | `动态模糊` |
| 光线泄露 | 转场时的电影级光效 | 钩子→痛点、核心→CTA 等关键转折 | `光线泄露` |
| 星芒放射 | 背景放射状光线 | 数据揭示、CTA 强调 | `星芒放射` |
| 噪点纹理 | 电影感颗粒叠加 | 全片或特定氛围镜头 | `噪点纹理` |
| SVG 图形 | 圆形、矩形、箭头等几何图形 | 图解、流程图、装饰元素 | `SVG图形:圆形/箭头/饼图` |
| 动态图表 | 柱状图、折线图动画 | 数据对比镜头 | `动态图表:柱状图/折线图` |

**使用原则：**
- 每个视频使用 1-2 种增强效果即可，避免视觉过载
- 光线泄露和星芒放射适合关键转折点，不要每个镜头都用
- 噪点纹理适合全片叠加，营造电影感
- 动态图表是数据镜头的首选，比纯文字展示更直观

## File Output

Save THREE files: research notes, storyboard script, and extracted voiceover.

### Directory
`projects/<YYYY-MM-DD-<slug>>/` (relative to project root `/Users/yasin/code/media/`)
- Auto-create directory if it doesn't exist

### File Naming
Each project is a directory named `YYYY-MM-DD-<slug>` containing:
- `research.md` — Research notes with search queries, findings, data, and sources (saved after research phase)
- `script.md` — Full storyboard script
- `voiceover.md` — Extracted voiceover text for TTS / editing

### Slug Generation Rules
- Chinese: Extract 2-4 key characters (e.g., "ChatGPT推理能力" → `chatgpt推理`)
- English: kebab-case, max 30 characters
- Mixed: Preserve Chinese, kebab-case English parts
- If file exists, append numeric suffix (e.g., `-2.md`, `-3.md`)

### Example
`projects/2026-04-20-chatgpt-o3推理/research.md`
`projects/2026-04-20-chatgpt-o3推理/script.md`
`projects/2026-04-20-chatgpt-o3推理/voiceover.md`

ALWAYS use the Write tool to save all three files. Report all file paths to the user after saving.

## Voiceover Extraction

After saving `script.md`, extract all 口播 (voiceover) content into a separate `voiceover.md` file. This file is used for TTS voice generation and post-production editing.

### Extraction Rules
- Extract only the text from `**口播**:` lines — remove surrounding quotes
- Preserve shot order and timing labels
- Do NOT modify or paraphrase the original text

### Output Template
```markdown
# <视频标题> — 口播文案

> 总字数: <n>字 | 预估时长: <m>分<s>秒

---

[镜头1的口播内容]

[镜头2的口播内容]

[镜头3的口播内容]

...

[最后一个镜头的口播内容]
```

### Format Notes
- Each shot's voiceover is separated by a blank line
- The separator `---` divides metadata from the voiceover body
- The body is plain text with no markdown formatting — ready for direct TTS input
- Total word count and estimated duration are calculated from the actual extracted text

## Error Handling

### Empty or Vague Input
If the idea is too generic (e.g., "AI", "科技"), ask the user to provide more detail:
```
这个想法有点太宽泛了。能具体一点吗？比如：
- 你想介绍哪个 AI 工具或功能？
- 这是教程、资讯还是观点类内容？
- 有没有具体的场景或案例？
```

### Script Too Long
If generated script exceeds 600 characters:
- Merge or remove secondary core content shots
- NEVER remove hook, pain point, or CTA shots
- Tighten the spoken content while preserving structure

### Invalid Angle Selection
If user provides invalid input (e.g., "4", random text):
- Re-prompt with the original 3 angle options
- Accept both numbers (1, 2, 3) and custom angle text
- If custom text is very long (>30 chars), extract core angle and confirm

### Long Custom Angle
If user provides a long custom angle:
```
你输入的角度描述比较长。我理解的核心是：<extracted 2-4 words>
这样理解对吗？如果不对，请用更简短的语言重新描述。
```
