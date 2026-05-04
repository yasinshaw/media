# 调研: Hermes 看板 — 多Agent协作新方式

> 生成时间: 2026-05-04 14:30

## 搜索记录
1. "Hermes Agent Nous Research kanban v0.12 multi-agent collaboration 2026"
   - [NousResearch/hermes-agent - GitHub](https://github.com/nousresearch/hermes-agent) — 开源自改进AI Agent框架，内置学习循环
   - [Hermes Agent Official](https://hermes-agent.nousresearch.com/) — 官方文档站
2. "Nous Research Hermes Agent framework features kanban tutorial"
   - Web search rate-limited, 依赖已有资料
3. "Hermes agent nousresearch.com GitHub multi-agent task management"
   - [Delegation Patterns](https://hermes-agent.nousresearch.com/docs/guides/delegation-patterns) — 子Agent并行委派模式
   - [Multi-Agent Blog](https://hermes-agent.ai/blog/hermes-agent-multi-agent) — orchestrator + worker 模式指南
4. 官方文档直读
   - [Kanban Tutorial](https://hermes-agent.nousresearch.com/docs/user-guide/features/kanban-tutorial) — 完整看板教程，4个故事场景

## 核心发现
- Hermes Agent 是 Nous Research 开发的开源自改进 AI Agent 框架，MIT 协议，模型无关 — 来源: [GitHub](https://github.com/nousresearch/hermes-agent)
- v0.12.0 新增看板功能，核心思路：任务上板，Agent 自己认领，取代主Agent串行调度 — 来源: [微信公众号 i龙虾](https://mp.weixin.qq.com/s/QH6qe8Vt6SYnCa9hZsZ58w)
- 底层用 SQLite 存储，任务认领走原子事务，多Agent抢同一任务只有一个能抢到 — 来源: [微信公众号 i龙虾](https://mp.weixin.qq.com/s/QH6qe8Vt6SYnCa9hZsZ58w)
- 依赖引擎：上游完成自动将下游从 Todo 提升到 Ready，无需手动推动 — 来源: [官方教程](https://hermes-agent.nousresearch.com/docs/user-guide/features/kanban-tutorial)
- 结构化交接：`--summary` + `--metadata` 传递上下文，下游Worker自动拿到上游产出 — 来源: [官方教程](https://hermes-agent.nousresearch.com/docs/user-guide/features/kanban-tutorial)
- 熔断机制：连续失败3次自动锁到Blocked，通知 Telegram/Discord/Slack — 来源: [官方教程](https://hermes-agent.nousresearch.com/docs/user-guide/features/kanban-tutorial)
- 崩溃恢复：Dispatcher 通过 `kill(pid, 0)` 探测进程存活，挂了释放回Ready队列 — 来源: [官方教程](https://hermes-agent.nousresearch.com/docs/user-guide/features/kanban-tutorial)
- 支持9种协作模式：扇出并行、流水线、投票仲裁、人工介入等 — 来源: [微信公众号 i龙虾](https://mp.weixin.qq.com/s/QH6qe8Vt6SYnCa9hZsZ58w)

## 关键数据
| 数据项 | 数值 | 来源 |
|--------|------|------|
| 看板列数 | 6列 (Triage/Todo/Ready/In Progress/Blocked/Done) | [官方教程](https://hermes-agent.nousresearch.com/docs/user-guide/features/kanban-tutorial) |
| 熔断阈值 | 连续3次失败 | [官方教程](https://hermes-agent.nousresearch.com/docs/user-guide/features/kanban-tutorial) |
| 通知渠道 | Telegram/Discord/Slack | [官方教程](https://hermes-agent.nousresearch.com/docs/user-guide/features/kanban-tutorial) |
| 协作模式 | 9种 | [微信公众号 i龙虾](https://mp.weixin.qq.com/s/QH6qe8Vt6SYnCa9hZsZ58w) |
| Dashboard端口 | 127.0.0.1:9119 | [官方教程](https://hermes-agent.nousresearch.com/docs/user-guide/features/kanban-tutorial) |
| 存储方式 | SQLite (~/.hermes/kanban.db) | [官方教程](https://hermes-agent.nousresearch.com/docs/user-guide/features/kanban-tutorial) |
| GitHub Stars | 15k-66k+ | [Web Search](https://github.com/nousresearch/hermes-agent) |
| 协议 | MIT | [GitHub](https://github.com/nousresearch/hermes-agent) |

## 需要核实的事实
- [x] v0.12.0 版本包含看板功能 — 来源: [微信公众号 i龙虾](https://mp.weixin.qq.com/s/QH6qe8Vt6SYnCa9hZsZ58w) ✅
- [x] 底层SQLite + 原子事务认领 — 来源: [微信公众号 i龙虾](https://mp.weixin.qq.com/s/QH6qe8Vt6SYnCa9hZsZ58w) ✅
- [x] 6列看板结构 — 来源: [官方教程](https://hermes-agent.nousresearch.com/docs/user-guide/features/kanban-tutorial) ✅
- [x] 熔断3次机制 — 来源: [官方教程](https://hermes-agent.nousresearch.com/docs/user-guide/features/kanban-tutorial) ✅

## 可用素材
- Nous Research 官方推文演示视频（Hermes自己规划拍摄的90秒视频）— 来源: [X/Twitter](https://x.com/NousResearch/status/2050997692977844324)
- 官方教程4个故事场景：Solo开发、Fleet并行、角色流水线+重试、熔断+崩溃恢复 — 来源: [官方教程](https://hermes-agent.nousresearch.com/docs/user-guide/features/kanban-tutorial)
- 依赖链CLI示例（schema → API → tests）— 来源: [官方教程](https://hermes-agent.nousresearch.com/docs/user-guide/features/kanban-tutorial)
- 9种协作模式：扇出并行、流水线、投票仲裁、人工介入等 — 来源: [微信公众号 i龙虾](https://mp.weixin.qq.com/s/QH6qe8Vt6SYnCa9hZsZ58w)

## 视觉素材清单

> 已下载到 `assets/research/`，详见 `manifest.json`

### 参考素材 (`research/reference/` — 外部版权，仅作脚本写作参考)
- `tavily-001.png` — []()
- `tavily-006.png` — []()
- `tavily-007.png` — []()
- `tavily-008.png` — []()
- `tavily-009.png` — []()

### 可用素材 (`research/stock/` — Pixabay 免费可商用)
- (无)

### 跳过项
- 共 4 项被跳过。详见 `manifest.json`

