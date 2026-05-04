# Agent Teams：一群 AI 怎么协作？ — 口播文案

> 总字数: 370字 | 预估时长: 1分22秒

---

一个 AI 搞不定的事，一群 AI 能搞定吗？这就是 Agent Teams。

先说清楚，Agent Teams 不等于 Multi-Agent。Multi-Agent 是 90 年代的学术概念，泛指多个 AI 交互。而 Agent Teams 强调的是像人类团队一样，有明确的角色分工、层级协调和共享目标。

这个概念是 CrewAI 在 2023 年带火的。吴恩达 2024 年提出的 Agentic 设计模式进一步推动了它。现在 Claude Code 也内置了这个能力。

你看这张图，一个 Manager Agent 统筹协调，多个 Worker Agent 各司其职。从任务分解到结果分析，一整套流程都有。

在 Claude Code 里直接就能用。用 Agent 工具派发子任务，一个搜代码，一个跑测试，一个做 review，三个 agent 并行工作，效率大幅提升。

但有三个坑。第一，指令一定要具体，模糊委派是最常见的失败原因。第二，别让多个 agent 同时改同一个文件，会冲突。第三，简单任务别开一堆 agent，浪费 token。

Agent Teams 是 AI 编程的未来方向。关注我，下期教你从零配置自己的 Agent 团队。
