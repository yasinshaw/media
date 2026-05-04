# 调研: multi-agent-syncer — 跨 AI 编程代理的技能同步工具

> 生成时间: 2026-05-04

## 搜索记录
1. "open source tools syncing AI coding agent skills across platforms Claude Cursor Windsurf 2025 2026"
   - [agent-skills-manager (GitHub)](https://github.com/umutbozdag/agent-skills-manager) — Electron 桌面应用，管理 11 个 AI 代理的技能
   - [runkids/skillshare (GitHub)](https://github.com/runkids/skillshare) — CLI 工具，一条命令同步技能到多个代理
   - [alirezarezvani/claude-skills (GitHub)](https://github.com/alirezarezvani/claude-skills) — 232+ Claude Code 技能，含多代理同步脚本
2. "multi-agent skill sharing cross-platform AI developer tools GitHub 2025 2026"
   - [VoltAgent/awesome-agent-skills (GitHub)](https://github.com/VoltAgent/awesome-agent-skills) — 策展型技能目录，不是同步工具
   - [Agent Skills Guide 2026](https://serenitiesai.com/articles/agent-skills-guide-2026) — 16+ 工具已支持 Agent Skills 标准
3. "AI coding agents 2025 2026 how many Claude Cursor Windsurf Copilot Trae Kiro developer tools"
   - [AI Coding Agents 2026 Comparison](https://lushbinary.com/blog/ai-coding-agents-comparison-cursor-windsurf-claude-copilot-kiro-2026/) — 7 个主流 AI 编程代理对比
   - [We Tested 15 AI Coding Agents (Morph)](https://www.morphllm.com/ai-coding-agent) — 2026 年测试了 15 个 AI 编程代理
4. "agent-skills-manager umutbozdag OR runkids skillshare GitHub stars skill sync tool"
   - [skillshare docs](https://skillshare.runkids.cc/docs) — CLI 同步工具，支持 Codex、Claude Code、Windsurf 等
   - [MCP Market: Skillshare](https://mcpmarket.com/tools/skills/skillshare-cli-manager) — Skillshare 被收录为 Claude Code 技能管理工具

## 核心发现
- 2026 年有 15+ 个 AI 编程代理在竞争，包括 Claude Code、Cursor、Windsurf、Copilot、Codex、Kiro、Trae、Amp、Augment 等 — 来源: [Morph AI Coding Agents](https://www.morphllm.com/ai-coding-agent)
- Agent Skills 标准（SKILL.md 格式）已被 16+ 工具采用，成为事实标准 — 来源: [Agent Skills Guide 2026](https://serenitiesai.com/articles/agent-skills-guide-2026)
- 每个 AI 编程代理都有自己的 skills 目录，格式大同小异（SKILL.md + YAML frontmatter）
- 开发者痛点：写了一个 skill，想多个代理都能用，需要手动复制 N 次

## 关键数据
| 数据项 | 数值 | 来源 |
|--------|------|------|
| 2026 年主流 AI 编程代理数量 | 15+ | [Morph](https://www.morphllm.com/ai-coding-agent) |
| 支持 Agent Skills 标准的工具 | 16+ | [Serenities AI](https://serenitiesai.com/articles/agent-skills-guide-2026) |
| multi-agent-syncer 代码量 | ~800 行（bash 300 + JS 500） | 源码分析 |
| multi-agent-syncer 支持代理数 | 16+ | 源码 config.sh |
| agent-skills-manager 支持代理数 | 11 | [GitHub](https://github.com/umutbozdag/agent-skills-manager) |
| skillshare 支持代理数 | 50+ | [GitHub](https://github.com/runkids/skillshare) |
| claude-skills 技能数 | 232+ | [GitHub](https://github.com/alirezarezvani/claude-skills) |

## 需要核实的事实
- [x] 2026 年有 15+ 个 AI 编程代理 ✅ — 来源: [Morph](https://www.morphllm.com/ai-coding-agent)
- [x] Agent Skills 标准被 16+ 工具采用 ✅ — 来源: [Serenities AI](https://serenitiesai.com/articles/agent-skills-guide-2026)
- [x] agent-skills-manager 是 Electron 桌面应用 ✅ — 来源: [GitHub](https://github.com/umutbozdag/agent-skills-manager)
- [x] skillshare 是 CLI 工具 ✅ — 来源: [GitHub](https://github.com/runkids/skillshare)
- [x] claude-skills 有 232+ 技能 ✅ — 来源: [GitHub](https://github.com/alirezarezvani/claude-skills)

## 同类工具对比

| 工具 | 类型 | 代理数量 | 技术栈 | Web UI | CLI | 项目级管理 | 代码量 |
|------|------|---------|--------|--------|-----|-----------|--------|
| **multi-agent-syncer** | CLI + Web UI | 16+ | Bash + Express.js | ✅ | ✅ | ✅ | ~800 行 |
| agent-skills-manager | Electron 桌面应用 | 11 | Electron | ✅ | ❌ | ✅ | 未公开 |
| skillshare | CLI + Web UI | 50+ | Go | ✅ | ✅ | ✅ | 未公开 |
| claude-skills | 技能集 + 分散脚本 | 5+ | Python 脚本 | ❌ | ✅(分散) | ❌ | N/A |
| awesome-agent-skills | 策展列表 | N/A | Markdown | ❌ | ❌ | ❌ | N/A |

## 可用素材
- multi-agent-syncer 的 symlink 架构图解（中央仓库 → 各代理 symlink） — 来源: 源码分析
- Web UI Dashboard 的同步矩阵视图 — 来源: 源码分析（server.mjs + index.html）
- 15+ AI 编程代理 Logo 矩阵 — 来源: [Morph](https://www.morphllm.com/ai-coding-agent)
- Windsurf vs Cursor 对比图 — 来源: [Techloy](https://www.techloy.com/content/images/2025/04/Windsurf-vs-Cursor---Which-is-the-better-AI-code-editor_Techloy_comparison_infographic.png)

## 视觉素材英文关键词
- AI coding agent
- terminal command line
- dashboard interface
- symlink file system
- software comparison

## 视觉素材清单

> 已下载到 `assets/research/`，详见 `manifest.json`

### 参考素材 (`research/reference/` — 外部版权，仅作脚本写作参考)
- `tavily-001.png` — []()
- `tavily-003.png` — []()
- `tavily-006.jpg` — []()

### 可用素材 (`research/stock/` — Pixabay 免费可商用)
- (无)

### 自有素材 (`assets/images/` — 产品截图，可商用)
- `webui-user-level.png` — Web UI 用户级矩阵视图截图（1280×800）
- `webui-project-level.png` — Web UI 项目级视图截图（1280×800）
- 用于镜头5（Web UI + 项目级同步）的固定图片素材

### 跳过项
- 共 3 项被跳过。详见 `manifest.json`

