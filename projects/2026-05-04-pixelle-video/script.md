# 一个关键词生成完整短视频

**BGM**: 科技电子 | medium | 0.08

## 元信息
- 切入角度: 产品介绍——阿里开源 AI 短视频引擎 Pixelle-Video 的核心能力和差异化
- 目标时长: 1分22秒
- 预估字数: 370字

## 分镜脚本

### 镜头 1 — 钩子（0-4s）
- **画面类型**: ai背景图
- **画面**: 深色科技感背景，中央大字"一个关键词→一条短视频"逐字打出，配合光线泄露转场效果
- **口播**: "输入一个关键词，AI 帮你生成一条完整的短视频。"
- **转场效果**: none
- **文字特效**: typewriter
- **音效**: whoosh-in
- **背景图提示词**: Dark futuristic technology background with glowing circuit board patterns and subtle blue particles floating in the air, cinematic lighting, no text

### 镜头 2 — 痛点引入（4-10s）
- **画面类型**: remotion
- **画面**: 左侧列出传统做视频的步骤（写文案→找素材→配音→剪辑→加字幕），每个步骤旁边打红色 ✗，逐步堆叠形成压迫感。右侧出现 Pixelle-Video Logo，打绿色 ✓。动态模糊效果强调效率对比
- **口播**: "做一条短视频，你要写文案、找素材、配音、剪辑、加字幕，搞下来大半天没了。"
- **转场效果**: slide(from-bottom)
- **文字特效**: none
- **音效**: 留空不写

### 镜头 3 — 产品介绍（10-19s）
- **画面类型**: remotion
- **画面**: 中央展示 Pixelle-Video 项目 Logo 和名称，下方弹出三个标签"阿里 AIDC 出品"、"GitHub 9.9k Stars"、"Apache 2.0 开源免费"，每个标签依次弹入（旋转入场）。底部一行小字"输入主题 → AI 全自动生成完整视频"
- **口播**: "今天介绍一个阿里开源的项目——Pixelle-Video。GitHub 将近一万颗星，完全免费。你只需要输入一个主题，它自动帮你搞定一切。"
- **转场效果**: wipe
- **文字特效**: highlight
- **音效**: impact, text-pop

### 镜头 4 — 全流程演示（19-32s）
- **画面类型**: remotion
- **画面**: 横向流程图动画，五个步骤依次从左到右展开（宽度展开效果）：① AI 写文案（通义千问/DeepSeek）→ ② AI 配图（FLUX）→ ③ AI 配音（Edge-TTS）→ ④ 加 BGM → ⑤ 合成视频。每个步骤展开时上方弹出对应图标
- **口播**: "整个流程是这样的：AI 先帮你写文案，支持通义千问、DeepSeek、GPT。然后自动生成配图，用 FLUX 模型画插图。接着合成语音配音，加上背景音乐，最后直接输出成片。全程自动化。"
- **转场效果**: fade
- **文字特效**: typewriter
- **音效**: text-pop

### 镜头 5 — 核心亮点：ComfyUI 架构（32-44s）
- **画面类型**: remotion
- **画面**: 中央展示"ComfyUI 工作流"概念图——一个模块化架构示意图，四个方块（文案/配图/语音/视频）通过连线汇聚到底部"视频输出"。其中一个方块高亮并弹出提示"可替换模型"，箭头指向 FLUX→SD、Edge-TTS→ChatTTS 等替换选项。SVG图形:方块和连线箭头
- **口播**: "但这个项目最厉害的地方，是它的架构。它基于 ComfyUI 工作流，每个环节都是独立模块。你想换生图模型？把 FLUX 换成 Stable Diffusion。想换语音？换成 ChatTTS。像搭积木一样，灵活组合。"
- **转场效果**: slide(from-right)
- **文字特效**: highlight
- **音效**: 留空不写

### 镜头 6 — 前沿能力（44-55s）
- **画面类型**: remotion
- **画面**: 三张卡片依次翻转入场（flip 转场）：卡片 1"AI 视频生成"配 WAN 2.1 图标、卡片 2"数字人口播"配人像图标、卡片 3"动作迁移"配舞蹈图标。每张卡片底部标注对应模型名。脉冲呼吸效果强调"前沿能力"标签
- **口播**: "更厉害的是，它还支持 AI 视频生成，用阿里的万相 2.1 模型直接生成动态视频。还有数字人口播、动作迁移这些前沿功能，一张照片就能让角色动起来。"
- **转场效果**: flip
- **文字特效**: highlight
- **音效**: impact

### 镜头 7 — 差异化对比（55-67s）
- **画面类型**: remotion
- **画面**: 左右两栏对比表，左侧"MoneyPrinterTurbo"右侧"Pixelle-Video"。逐行展开对比（宽度展开）：AI 视频生成 ✗ vs ✓、数字人 ✗ vs ✓、模型热插拔 ✗ vs ✓、ComfyUI 生态 ✗ vs ✓。Pixelle-Video 一栏逐行亮起绿色
- **口播**: "跟同类工具 MoneyPrinterTurbo 比一下。基础功能两者差不多，但 Pixelle 多了 AI 视频生成、数字人、还有整个 ComfyUI 生态的支持。简单说，它不只是拼接素材，是真的在生成内容。"
- **转场效果**: slide(from-left)
- **文字特效**: typewriter
- **音效**: impact

### 镜头 8 — 部署与成本（67-78s）
- **画面类型**: remotion
- **画面**: 三个方案卡片从左到右依次弹入（旋转入场）：卡片 1"完全免费"（Ollama + ComfyUI 本地，0 元）、卡片 2"推荐方案"（通义千问 + 本地，极低成本）、卡片 3"云端方案"（OpenAI + RunningHub）。"完全免费"卡片带脉冲呼吸效果
- **口播**: "成本方面，三种方案随你选。用 Ollama 加本地 ComfyUI，完全免费，零成本运行。想省事可以用通义千问，成本极低。甚至有 Windows 一键整合包和 Docker 部署，开箱即用。"
- **转场效果**: fade
- **文字特效**: highlight
- **音效**: text-pop

### 镜头 9 — CTA 收尾（78-84s）
- **画面类型**: ai背景图
- **画面**: 深色背景，中央大字"GitHub 搜索 Pixelle-Video"，下方小字"开源免费 · 零门槛 · 一键出片"。星芒放射效果增强视觉冲击
- **口播**: "想做自媒体但不会剪视频？去 GitHub 搜索 Pixelle-Video，完全开源免费，零门槛上手，赶紧试试吧。"
- **转场效果**: fade
- **文字特效**: highlight
- **音效**: outro
- **背景图提示词**: Minimalist dark background with subtle gradient from deep blue to black, scattered small glowing dots like stars, cinematic and clean, no text
