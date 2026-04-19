# Video Script Skill Design

## Overview

A Claude Code skill (`video-script`) that transforms a short video idea into a complete storyboard script for Douyin (TikTok China), optimized for 1-3 minute talking-head videos with visual switching.

## Skill File

- **Path**: `.claude/skills/video-script.md`
- **Format**: Standard Claude Code skill markdown (frontmatter + instructions)
- **Registration**: Referenced via `CLAUDE.md` or project settings

## Platform & Content Context

- **Platform**: Douyin (抖音)
- **Content types**: Mixed — AI tool reviews, tutorials, industry analysis, project demos
- **Video style**: Talking head + screen/visual switching (口播 + 画面切换)
- **Target duration**: 1-3 minutes (~200-600 Chinese characters spoken)
- **Output**: Storyboard script only (titles, descriptions, covers deferred to future skills)

## Interaction Flow

1. User invokes `/video-script <idea>` with a brief idea description
2. Skill analyzes the idea:
   - If the idea contains any of: a specific tool + use case, explicit tutorial/comparison/review intent, or a specific news event/product → skip angle selection and proceed to step 4. Otherwise show angle options.
   - Propose **3 angle options** in numbered list format with one-line selling point each
3. User selects an angle (by number, or provides custom angle text — ideally ≤30 characters; if longer, the skill extracts the core angle and confirms)
4. Skill generates a complete storyboard script following the Douyin viral framework
5. Script is saved as a Markdown file

## Error Handling & Edge Cases

- **Empty or vague input** (e.g., `/video-script AI`): Ask the user to provide more detail before proceeding
- **Script exceeds 600 characters**: Merge or remove secondary core content shots to tighten the script. Never remove hook, pain point, or CTA shots.
- **File already exists**: Append a numeric suffix (e.g., `2026-04-20-chatgpt-o3-reasoning-2.md`)
- **Invalid angle selection**: Re-prompt with the original 3 options, accepting both numbers and custom text
- **`scripts/` directory missing**: Auto-create before saving

## Script Template

```markdown
# 视频标题（≤15字）

## 元信息
- 切入角度: <选定的角度>
- 目标时长: 1-3分钟
- 预估字数: <n>字

## 分镜脚本

### 镜头 1 — 钩子（0-5s）
- **画面**: <具体的视觉指示>
- **口播**: "<口播文案>"
- **字幕**: <屏幕上显示的关键文字>

### 镜头 2 — 痛点引入（5-15s）
- **画面**: <...>
- **口播**: "<...>"
- **字幕**: <...>

### 镜头 3 — 核心内容第一段（15-35s）
- **画面**: <...>
- **口播**: "<...>"
- **字幕**: <...>

### 镜头 4..N — 核心内容后续段（每段约15-20s）
（按关键论点或视觉场景切分）

### 镜头 N+1 — CTA 收尾（最后5-10s）
- **画面**: <...>
- **口播**: "<...>"
- **字幕**: <...>
```

### Shot 切分标准

每个镜头对应一个独立的**视觉场景或关键论点**。切分依据：
- 画面发生明显切换（如从真人切到屏幕录制）= 新镜头
- 论点发生转换（如从问题分析切到解决方案）= 新镜头
- 单个镜头时长不超过 20 秒，超过则拆分

## Script Framework

Every script follows the Douyin viral structure:

1. **Hook (0-5s)**: Must have a strong opener. Examples:
   - 提问式: "你知道吗？90%的人用ChatGPT的方式都是错的"
   - 反常识: "AI不会取代你，但会用AI的人会"
   - 冲突式: "OpenAI 刚发的新功能，把所有人都震惊了"
2. **Pain Point (5-15s)**: Establish relevance, create urgency
3. **Core Content (15-90s)**: One key insight every 15-20s to retain attention. Example rhythm for a 2-min video:
   - 镜头 3 (20s): 论点 1 + 画面演示
   - 镜头 4 (20s): 论点 2 + 数据/案例
   - 镜头 5 (15s): 论点 3 + 总结串联
4. **CTA (last 5-10s)**: Clear call to action — follow, like, comment

## Prompt Design

### Layer 1: Angle Generation Prompt

```
你是一位抖音短视频策划专家。根据用户的 idea，分析适合的内容类型，并生成 3 个不同的切入角度。

内容类型判断规则：
- 涉及工具/软件使用 → 实战教程型
- 涉及新闻/发布/动态 → 资讯解读型
- 涉及观点/趋势/预测 → 行业观点型
- 涉及原理/概念/科普 → 知识科普型

每个角度用以下格式输出：
**角度 X：<角度名称>**
<一句话描述核心卖点和为什么观众会感兴趣>

角度设计原则：
- 内容类型仅作为角度设计的参考维度，不限制角度风格（任何类型话题都应包含一个实用性角度）
- 至少一个角度利用信息差或反常识
- 至少一个角度强调实用性（观众学完就能用）
- 角度之间要有明显差异化
```

### Layer 2: Script Generation Prompt

```
你是一位抖音短视频编剧专家。请根据选定的切入角度，生成完整的分镜脚本。

## 硬性要求
- 口播总字数：200-600字（对应1-3分钟）
- 前3秒必须有强钩子
- 口播风格：口语化、短句、有节奏感，像和朋友聊天
- 画面指示要具体到可以执行（如"切换到 ChatGPT 界面，输入 xxx"）
- 字幕只提炼关键词，不要复制完整口播

## 结构框架
1. 钩子（0-5s）: 提问/反常识/冲突，抓住注意力
2. 痛点引入（5-15s）: 建立相关性，制造紧迫感
3. 核心内容（15-90s）: 每15-20秒一个信息点
4. CTA收尾（5-10s）: 关注/点赞/评论引导

## 输出格式
按分镜脚本模板输出 Markdown，每个镜头包含：画面、口播、字幕三个字段。
```

## File Output

- **Directory**: `scripts/` (relative to project root `/Users/yasin/code/media/`, auto-created if missing)
- **Naming**: `YYYY-MM-DD-<slug>.md`
- **Slug rules**:
  - Chinese: extract 2-4 key Chinese characters from the idea (e.g., "ChatGPT推理能力" → `chatgpt推理`)
  - English: kebab-case, max 30 characters
  - Mixed: preserve Chinese, kebab-case the English parts
- **Example**: `scripts/2026-04-20-chatgpt-o3推理.md`

## Future Extensions (out of scope for v1)

- Title generation with Douyin SEO optimization
- Description + hashtag generation
- Cover image design suggestions
- Integration with video editing skill
- Publishing workflow skill
