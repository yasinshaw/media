# Video Script Skill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-step. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a Claude Code skill that generates Douyin short video storyboard scripts from user ideas.

**Architecture:** A single skill markdown file containing carefully crafted prompts for two-stage interaction (angle generation → script generation), plus project configuration to register the skill.

**Tech Stack:** Claude Code skills (markdown-based prompt files), bash utilities

**File Structure:**
```
.claude/skills/video-script.md    # Main skill definition
CLAUDE.md                          # Project-level skill registration
scripts/                           # Output directory (auto-created)
```

---

## Task 1: Create the skill file structure

**Files:**
- Create: `.claude/skills/video-script.md`

- [ ] **Step 1: Create .claude/skills directory**

```bash
mkdir -p .claude/skills
```

- [ ] **Step 2: Write skill frontmatter**

The frontmatter defines skill metadata for Claude Code.

```markdown
---
name: video-script
description: Generate Douyin short video storyboard scripts from ideas. Analyzes the idea, proposes 3 creative angles, then generates a complete script with hook, pain point, core content, and CTA.
author: yasin
tags: [video, douyin, script, content]
---

You are an expert Douyin short video scriptwriter and content strategist.

## How This Skill Works

1. User provides an idea: `/video-script <idea>`
2. You analyze the idea and determine if it has a clear angle
3. If angle is unclear, propose 3 numbered angle options
4. User selects an angle (by number or provides custom text)
5. You generate a complete storyboard script following the Douyin viral framework
6. Save the script to `scripts/YYYY-MM-DD-<slug>.md`
```

- [ ] **Step 3: Commit initial structure**

```bash
git add .claude/skills/video-script.md
git commit -m "feat: add video-script skill skeleton"
```

---

## Task 2: Implement angle generation logic

**Files:**
- Modify: `.claude/skills/video-script.md`

- [ ] **Step 1: Add angle detection and generation prompt**

Add to the skill file after the frontmatter:

```markdown
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
```

- [ ] **Step 2: Test angle generation manually**

Invoke: `/video-script ChatGPT`
Expected: 3 numbered angle options proposed

- [ ] **Step 3: Test angle skip logic**

Invoke: `/video-script 教程：如何用ChatGPT做PPT`
Expected: Skips angle selection, proceeds directly to script generation

- [ ] **Step 4: Commit**

```bash
git add .claude/skills/video-script.md
git commit -m "feat: add angle generation logic to video-script skill"
```

---

## Task 3: Implement script generation prompt

**Files:**
- Modify: `.claude/skills/video-script.md`

- [ ] **Step 1: Add script generation instructions**

Add to the skill file:

```markdown
## Script Generation

After angle selection (or skip), generate a complete storyboard script.

### Hard Requirements
- Total spoken word count: 200-600 characters (1-3 minutes)
- Strong hook within first 3 seconds
- Conversational style: short sentences, rhythmic, like chatting with a friend
- Visual directions must be actionable (e.g., "切换到 ChatGPT 界面，输入 xxx")
- On-screen text: extract keywords only, don't duplicate full spoken lines

### Structure Framework
1. **Hook (0-5s)**: Question / counterintuitive claim / conflict to grab attention
2. **Pain Point (5-15s)**: Establish relevance, create urgency
3. **Core Content (15-90s)**: One key insight every 15-20s
4. **CTA (5-10s)**: Clear call to action — follow, like, comment

### Hook Examples
- 提问式: "你知道吗？90%的人用ChatGPT的方式都是错的"
- 反常识: "AI不会取代你，但会用AI的人会"
- 冲突式: "OpenAI 刚发的新功能，把所有人都震惊了"

### Shot Division Rules
Each shot = one visual scene OR one key argument
- Visual scene changes (e.g., person → screen recording) = new shot
- Argument transitions (e.g., problem analysis → solution) = new shot
- Single shot should not exceed 20 seconds; if longer, split it

### Output Template
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

[Continue with more core content shots as needed, each ~15-20s]

### 镜头 N — CTA 收尾（5-10s）
- **画面**: <...>
- **口播**: "<...>"
- **字幕**: <...>
```
```

- [ ] **Step 2: Test script generation**

Invoke: `/video-script ChatGPT o3 的推理能力`
Expected: After selecting angle, generates complete storyboard script

- [ ] **Step 3: Verify script quality**

Check that generated script:
- Has 200-600 characters of spoken content
- Starts with a strong hook
- Follows hook → pain → core → CTA structure
- Has concrete visual directions
- Has keyword-based on-screen text

- [ ] **Step 4: Commit**

```bash
git add .claude/skills/video-script.md
git commit -m "feat: add script generation prompt to video-script skill"
```

---

## Task 4: Implement file saving logic

**Files:**
- Modify: `.claude/skills/video-script.md`

- [ ] **Step 1: Add file output instructions**

Add to the skill file:

```markdown
## File Output

After generating the script, save it to a file.

### Directory
`scripts/` (relative to project root `/Users/yasin/code/media/`)
- Auto-create if it doesn't exist

### File Naming
Format: `YYYY-MM-DD-<slug>.md`

### Slug Generation Rules
- Chinese: Extract 2-4 key characters (e.g., "ChatGPT推理能力" → `chatgpt推理`)
- English: kebab-case, max 30 characters
- Mixed: Preserve Chinese, kebab-case English parts
- If file exists, append numeric suffix (e.g., `-2.md`, `-3.md`)

### Example
`scripts/2026-04-20-chatgpt-o3推理.md`

ALWAYS use the Write tool to save the file. Report the file path to the user after saving.
```

- [ ] **Step 2: Test file saving**

Invoke skill and verify file is created at correct path
Expected: File appears in `scripts/` directory with correct naming

- [ ] **Step 3: Test duplicate handling**

Invoke skill twice with same idea
Expected: Second file has `-2` suffix

- [ ] **Step 4: Commit**

```bash
git add .claude/skills/video-script.md
git commit -m "feat: add file saving logic to video-script skill"
```

---

## Task 5: Add error handling

**Files:**
- Modify: `.claude/skills/video-script.md`

- [ ] **Step 1: Add error handling instructions**

Add to the skill file:

```markdown
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
```

- [ ] **Step 2: Test error scenarios**

Test each error case:
1. Empty input: `/video-script AI`
2. Invalid selection: after angles shown, enter "4"
3. Long custom angle: paste a paragraph

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/video-script.md
git commit -m "feat: add error handling to video-script skill"
```

---

## Task 6: Register the skill

**Files:**
- Create: `CLAUDE.md`
- Create: `.claude/settings.json` (if not exists)

- [ ] **Step 1: Create CLAUDE.md with skill documentation**

```markdown
# Media Toolkit

A collection of AI-powered tools for content creation, from ideation to publishing.

## Skills

### `/video-script` — Generate Douyin Storyboard Scripts

Transform a short video idea into a complete storyboard script optimized for Douyin (TikTok China).

**Usage:**
```
/video-script <your idea>
```

**Example:**
```
/video-script ChatGPT o3 的推理能力到底有多强
```

The skill will:
1. Analyze your idea and propose 3 creative angles (or skip if angle is clear)
2. Generate a complete storyboard script with hook, pain point, core content, and CTA
3. Save the script to `scripts/YYYY-MM-DD-<slug>.md`

**Output Format:** Each shot includes visual direction, spoken script, and on-screen text.
```

- [ ] **Step 2: Create or update .claude/settings.json for skill registration**

Claude Code discovers skills from `.claude/skills/` directory automatically. Ensure settings.json includes the skills path:

```json
{
  "skillsPath": ".claude/skills"
}
```

Note: If `settings.json` doesn't exist, create it. If it already exists, verify the skillsPath is correct.

- [ ] **Step 3: Verify skill file has correct frontmatter**

Ensure `.claude/skills/video-script.md` has valid frontmatter with `name` field — this is required for Claude Code to discover the skill.

Expected frontmatter format:
```yaml
---
name: video-script
description: <skill description>
---
```

- [ ] **Step 4: Verify skill is discoverable**

Check that skill appears in available skills list
Expected: `/video-script` is listed when user asks for available skills

- [ ] **Step 5: Test full workflow**

End-to-end test:
```
/video-script 如何用 Claude 生成代码
```
Verify:
1. Angles proposed or skipped appropriately
2. Script generated correctly
3. File saved to correct location

- [ ] **Step 6: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: add CLAUDE.md with skill documentation"
```

---

## Task 7: Final verification and cleanup

**Files:**
- All project files

- [ ] **Step 1: Verify complete workflow**

Test the entire skill from invocation to file save:
```bash
# Test 1: Tutorial idea (should skip angle selection)
/video-script 教程：如何用Midjourney生成图片

# Test 2: Generic idea (should show angles)
/video-script AI视频生成

# Test 3: Verify file output
ls -la scripts/
```

- [ ] **Step 2: Review skill file for consistency**

Read `.claude/skills/video-script.md` and verify:
- All sections are present and well-organized
- Prompt instructions are clear and actionable
- No contradictions or ambiguities
- Language is consistent (Chinese for content, English for technical)

- [ ] **Step 3: Create example output (optional)**

Generate one example script to serve as reference:
```bash
/video-script ChatGPT o3 推理能力演示
```

- [ ] **Step 4: Final commit**

```bash
git add .
git commit -m "feat: complete video-script skill implementation

- Full skill implementation with angle generation and script writing
- File saving with proper naming conventions
- Error handling for edge cases
- Documentation in CLAUDE.md
"
```

---

## Testing Notes

Since this is a prompt-based skill, traditional unit tests are not applicable. Testing is manual via skill invocation:

1. **Angle generation test**: Generic ideas should produce 3 distinct options
2. **Angle skip test**: Specific ideas should skip to script generation
3. **Script quality test**: Generated scripts should meet all requirements
4. **File output test**: Scripts should be saved with correct naming
5. **Error handling test**: Edge cases should be handled gracefully

Each task includes manual verification steps.
