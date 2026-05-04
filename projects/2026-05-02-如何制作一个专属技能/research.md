# 调研: 如何制作一个专属技能

> 生成时间: 2026-05-02 12:00

## 搜索记录
1. "Claude Code custom skills slash commands tutorial 2026"
   - [Claude Code Full Tutorial for Beginners 2026](https://www.youtube.com/watch?v=YF_ucLkkHTw) — 包含 Skills 创建、MCP 连接、Hooks 自动化、并行 Agent 等完整教程
   - [Claude Code Slash Commands 2026: Complete List + Custom Commands](https://www.heyuan110.com/posts/ai/2026-03-05-claude-code-slash-commands/) — 40+ 内置命令、自定义 Skills 命令完整参考
   - [Claude Code Skills vs Slash Commands 2026: Complete Guide](https://yingtu.ai/en/blog/claude-code-skills-vs-slash-commands) — Skills 与 Slash Commands 统一系统说明
   - [Claude Code Slash Commands: A Practical Guide (2026)](https://felo.ai/blog/claude-code-slash-commands/) — 实用指南，Markdown 文件定义可复用工作流
   - [The Complete Guide to Creating and Using Claude Skills 2026](https://aifordevelopers.substack.com/p/the-complete-guide-to-creating-and) — 快速上手清单：SKILL.md + YAML frontmatter + scripts/references/assets

2. "Claude Code skill-creator command create custom skill SKILL.md"
   - [How to create custom Skills | Claude Help Center](https://support.claude.com/en/articles/12512198-how-to-create-custom-skills) — 官方文档：技能打包、安装、分发
   - [Claude Code Skills 101](https://todatabeyond.substack.com/p/claude-code-skills-101-everything) — 技能文件组织方式（自包含 vs 引用外部）
   - [Extend Claude with skills - Claude Code Docs](https://code.claude.com/docs/en/skills) — 官方文档：`~/.claude/skills/` 个人技能、`.claude/skills/` 项目技能
   - [skill-creator/SKILL.md at main · anthropics/skills](https://github.com/anthropics/skills/blob/main/skills/skill-creator/SKILL.md) — Anthropic 官方 skill-creator 技能源码
   - [Deep Dive SKILL.md](https://abvijaykumar.medium.com/deep-dive-skill-md-part-1-2-09fc9a536996) — SKILL.md 深度解析，安装机制详解

3. "Claude Code skills marketplace install community skills examples"
   - [Claude Code Skills: How to Install and Customize Marketplace Skills](https://www.mindstudio.ai/blog/claude-code-skills-install-customize-marketplace/) — 市场技能安装与定制指南
   - [Claude Code Has a Skills Marketplace Now](https://medium.com/@markchen69/claude-code-has-a-skills-marketplace-now-a-beginner-friendly-walkthrough-8adeb67cdc89) — 技能市场入门指南
   - [awesome-claude-skills](https://github.com/travisvn/awesome-claude-skills) — 社区精选技能列表
   - [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) — 另一个社区技能合集

## 核心发现
- Claude Code 技能本质是 Markdown 文件（SKILL.md），存放在 `~/.claude/skills/`（个人）或 `.claude/skills/`（项目）目录 — 来源: [Claude Code Docs](https://code.claude.com/docs/en/skills)
- 内置 `/skill-creator` 命令可以帮助创建技能，无需从零开始 — 来源: [GitHub anthropics/skills](https://github.com/anthropics/skills/blob/main/skills/skill-creator/SKILL.md)
- 社区已有大量现成技能可安装复用（awesome-claude-skills 等合集），不需要重复造轮子 — 来源: [awesome-claude-skills](https://github.com/travisvn/awesome-claude-skills)
- 技能支持 scripts/、references/、assets/ 等子目录，可打包为 ZIP 分享 — 来源: [Claude Help Center](https://support.claude.com/en/articles/12512198-how-to-create-custom-skills)

## 关键数据
| 数据项 | 数值 | 来源 |
|--------|------|------|
| 内置命令数 | 40+ | [heyuan110](https://www.heyuan110.com/posts/ai/2026-03-05-claude-code-slash-commands/) |
| 技能安装位置 | `~/.claude/skills/` 或 `.claude/skills/` | [Claude Code Docs](https://code.claude.com/docs/en/skills) |
| 技能核心文件 | SKILL.md (YAML frontmatter + Markdown) | [Claude Code Docs](https://code.claude.com/docs/en/skills) |
| 官方技能仓库 | github.com/anthropics/skills | [GitHub](https://github.com/anthropics/skills) |

## 需要核实的事实
- [x] 技能本质是 Markdown 文件 ✅ — 来源: [Claude Code Docs](https://code.claude.com/docs/en/skills)
- [x] 有内置 skill-creator 命令 ✅ — 来源: [GitHub anthropics/skills](https://github.com/anthropics/skills/blob/main/skills/skill-creator/SKILL.md)
- [x] 社区有技能市场/合集可复用 ✅ — 来源: [awesome-claude-skills](https://github.com/travisvn/awesome-claude-skills)

## 可用素材
- 技能创建 3 步流程：创建文件夹 → 写 SKILL.md → 放到 skills 目录 — 来源: [Claude Code Docs](https://code.claude.com/docs/en/skills)
- SKILL.md 结构：YAML frontmatter（name + description）+ Markdown 正文（指令 + 示例） — 来源: [aifordevelopers](https://aifordevelopers.substack.com/p/the-complete-guide-to-creating-and)
- 技能安装方式：手动放目录 / 插件市场安装 / ZIP 上传 — 来源: [Claude Help Center](https://support.claude.com/en/articles/12512198-how-to-create-custom-skills)
