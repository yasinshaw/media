# Agent Teams：一群 AI 怎么协作？

## 元信息
- 切入角度: 知识科普 + 实操教程（概念辨析 + 工具使用）
- 目标时长: 1分22秒
- 预估字数: 370字

## 分镜脚本

### 镜头 1 — 钩子（0-6s）
- **画面类型**: remotion
- **画面**: 黑色背景，大字标题 "Agent Teams" 从中心弹出，配合科技感粒子效果。下方依次打出副标题："一个AI搞不定？用一群！"
- **口播**: "一个 AI 搞不定的事，一群 AI 能搞定吗？这就是 Agent Teams。"

### 镜头 2 — 概念辨析（6-20s）
- **画面类型**: remotion
- **画面**: 左右分屏对比。左侧灰色区域标题 "Multi-Agent"，显示散乱的节点连线图（无层级）。右侧金色区域标题 "Agent Teams"，显示树状层级图（Manager → Workers），标注 "角色分工" "层级协调" "共享目标"。
- **口播**: "先说清楚，Agent Teams 不等于 Multi-Agent。Multi-Agent 是 90 年代的学术概念，泛指多个 AI 交互。而 Agent Teams 强调的是像人类团队一样，有明确的角色分工、层级协调和共享目标。"

### 镜头 3 — 起源与推动者（20-34s）
- **画面类型**: remotion
- **画面**: 时间轴动画，从左到右依次弹出三个节点：2023 → "CrewAI"（火焰图标，副标题 "带火 Agent Teams 概念"）；2024 → "Andrew Ng"（学位帽图标，副标题 "提出 Agentic 设计模式"）；2025 → "Claude Code"（闪电图标，副标题 "内置 Agent Teams 功能"）。
- **口播**: "这个概念是 CrewAI 在 2023 年带火的。吴恩达 2024 年提出的 Agentic 设计模式进一步推动了它。现在 Claude Code 也内置了这个能力。"

### 镜头 4 — Agent Teams 详解（34-46s）
- **画面类型**: 固定图片
- **画面**: 展示用户提供的 Agent Teams 信息图。从左侧 "Agent Teams 的组成" 开始，缓慢平移到中间的工作流程图，重点突出 Manager Agent → Worker Agents 的层级结构，以及任务分解 → 资源分配 → 执行监控 → 结果分析的完整流程。
- **口播**: "你看这张图，一个 Manager Agent 统筹协调，多个 Worker Agent 各司其职。从任务分解到结果分析，一整套流程都有。"

### 镜头 5 — Claude Code 实操（46-60s）
- **画面类型**: remotion
- **画面**: 模拟终端界面，黑色背景绿色文字。依次展示三行 Agent 工具调用：Agent({subagent_type: "Explore"...)、Agent({subagent_type: "general-purpose"...)、Agent({subagent_type: "code-reviewer"...)，每行出现时带有 ⏳ spinner 动画表示并行执行。
- **口播**: "在 Claude Code 里直接就能用。用 Agent 工具派发子任务，一个搜代码，一个跑测试，一个做 review，三个 agent 并行工作，效率大幅提升。"

### 镜头 6 — 坑点提醒（60-74s）
- **画面类型**: remotion
- **画面**: 红色警告卡片依次弹出。卡片一：⚠️ "指令要具体"。卡片二：⚠️ "别同时改同一文件"。卡片三：⚠️ "简单任务别开一堆 agent"。每张卡片有简短配文。
- **口播**: "但有三个坑。第一，指令一定要具体，模糊委派是最常见的失败原因。第二，别让多个 agent 同时改同一个文件，会冲突。第三，简单任务别开一堆 agent，浪费 token。"

### 镜头 7 — CTA 收尾（74-82s）
- **画面类型**: remotion
- **画面**: 背景渐变到品牌色，中央大字 "Agent Teams = AI编程的未来"，下方弹出关注按钮动画 + "下期：从零配置你的 Agent 团队"
- **口播**: "Agent Teams 是 AI 编程的未来方向。关注我，下期教你从零配置自己的 Agent 团队。"
