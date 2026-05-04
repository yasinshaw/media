# 调研: Pixelle-Video — 阿里巴巴开源 AI 全自动短视频引擎

> 生成时间: 2026-05-04

## 搜索记录
1. "AIDC-AI Pixelle-Video GitHub open source AI video engine features"
   - [GitHub - AIDC-AI/Pixelle-Video](https://github.com/AIDC-AI/Pixelle-Video) — 官方仓库，完整功能介绍、使用文档、视频示例
   - [Pixelle-Video README_EN.md](https://github.com/AIDC-AI/Pixelle-Video/blob/main/README_EN.md) — 英文版 README，含更新日志
   - [config.example.yaml](https://github.com/AIDC-AI/Pixelle-Video/blob/main/config.example.yaml) — 配置文件示例，展示模块化架构
   - [Issues](https://github.com/AIDC-AI/Pixelle-Video/issues) — 社区活跃，近期 issues 涉及数字人、视频模糊等问题
2. "Pixelle-Video vs MoneyPrinterTurbo comparison AI short video generation 2025 2026"
   - [Best AI Video Generation Models in 2026](https://www.pixazo.ai/blog/ai-video-generation-models-comparison) — AI 视频生成模型横向对比（非同类工具对比）
   - [10 Best AI Video Generators in 2026](https://pixverse.ai/en/blog/best-ai-video-generators) — AI 视频生成器排名
3. "Pixelle-Video ComfyUI workflow digital human avatar WAN 2.1 tutorial"
   - [Wan2.1 ComfyUI Workflow - Complete Guide](https://comfyui-wiki.com/en/tutorial/advanced/video/wan2.1/wan2-1-video-model) — WAN 2.1 ComfyUI 工作流详细教程

## 核心发现
- Pixelle-Video 是阿里 AIDC（阿里巴巴国际数字商业）团队开源的 AI 全自动短视频引擎，输入主题关键词即可自动完成文案→配图→语音→BGM→视频全流程 — 来源: [GitHub - AIDC-AI/Pixelle-Video](https://github.com/AIDC-AI/Pixelle-Video)
- 基于 ComfyUI 工作流架构，每个环节（TTS、生图、生视频）可通过替换 ComfyUI 工作流热插拔底层模型，继承整个 ComfyUI 生态灵活性 — 来源: [GitHub README](https://github.com/AIDC-AI/Pixelle-Video)
- 支持 AI 视频生成（WAN 2.1）、数字人口播（wan2.2-s2v）、动作迁移（wan2.2-animate-move）、图生视频等前沿能力 — 来源: [GitHub README](https://github.com/AIDC-AI/Pixelle-Video)
- 完全免费开源（Apache 2.0），支持 Ollama + ComfyUI 全本地部署零成本运行 — 来源: [GitHub README](https://github.com/AIDC-AI/Pixelle-Video)
- 技术栈：Streamlit Web UI + uv 包管理 + ffmpeg 视频处理 + YAML 配置，支持 Docker 部署和 Windows 一键整合包 — 来源: [Dockerfile](https://github.com/AIDC-AI/Pixelle-Video/blob/main/Dockerfile)
- 默认视觉风格为简约黑白火柴人插画，可通过更换 prompt prefix 切换风格 — 来源: [config.example.yaml](https://github.com/AIDC-AI/Pixelle-Video/blob/main/config.example.yaml)
- 社区活跃：GitHub Issues 持续更新，涉及工作流配置、数字人、视频质量等问题 — 来源: [Issues](https://github.com/AIDC-AI/Pixelle-Video/issues)

## 关键数据
| 数据项 | 数值 | 来源 |
|--------|------|------|
| GitHub Stars | ~9.9k | [GitHub](https://github.com/AIDC-AI/Pixelle-Video) |
| 许可证 | Apache 2.0 | [GitHub](https://github.com/AIDC-AI/Pixelle-Video) |
| 最新版本 | v0.1.15 (2026-01-27) | [GitHub](https://github.com/AIDC-AI/Pixelle-Video) |
| 开发团队 | 阿里巴巴 AIDC | [GitHub](https://github.com/AIDC-AI/Pixelle-Video) |
| 支持视频尺寸 | 竖屏1080x1920、横屏1920x1080、方形1080x1080 | [config.example.yaml](https://github.com/AIDC-AI/Pixelle-Video/blob/main/config.example.yaml) |
| 支持的 LLM | GPT-4o、通义千问、DeepSeek、Ollama | [GitHub README](https://github.com/AIDC-AI/Pixelle-Video) |
| TTS 方案 | Edge-TTS（默认）、Index-TTS（声音克隆） | [GitHub README](https://github.com/AIDC-AI/Pixelle-Video) |

## 需要核实的事实
- [x] 基于 ComfyUI 工作流架构 ✅ — 来源: [GitHub README](https://github.com/AIDC-AI/Pixelle-Video)
- [x] 支持 WAN 2.1 AI 视频生成 ✅ — 来源: [GitHub README](https://github.com/AIDC-AI/Pixelle-Video)
- [x] Apache 2.0 开源免费 ✅ — 来源: [GitHub](https://github.com/AIDC-AI/Pixelle-Video)
- [x] 支持数字人口播、动作迁移、图生视频 ✅ — 来源: [GitHub README](https://github.com/AIDC-AI/Pixelle-Video)

## 可用素材
- 视频生成流程图：文案生成 → 配图规划 → 逐帧处理 → 视频合成 — 来源: [GitHub README](https://github.com/AIDC-AI/Pixelle-Video)
- 模板命名规范：static_*.html（纯文字）、image_*.html（图片）、video_*.html（视频） — 来源: [config.example.yaml](https://github.com/AIDC-AI/Pixelle-Video/blob/main/config.example.yaml)
- 实际生成案例：人文纪实、文化解构、科学思辨、个人成长、深度思考、历史文化、情感类、小说解说、知识科普等 — 来源: [GitHub README](https://github.com/AIDC-AI/Pixelle-Video)
- 与 MoneyPrinterTurbo 对比：Pixelle-Video 独有 AI 视频生成 + 数字人 + ComfyUI 生态整合 — 来源: [GitHub README](https://github.com/AIDC-AI/Pixelle-Video)

## 视觉素材英文关键词
- ComfyUI workflow node graph, video editing timeline, AI video generation, digital avatar, short video production

## 视觉素材清单

> 已下载到 `assets/research/`，详见 `manifest.json`

### 参考素材 (`research/reference/` — 外部版权，仅作脚本写作参考)
- `tavily-006.jpg` — []()
- `tavily-007.webp` — []()
- `article-comfyui-wiki.com-001.jpg` — alt: "Wan2.1 Workflow Template" — [Wan2.1 ComfyUI Workflow - Complete Guide | ComfyUI Wiki](https://comfyui-wiki.com/en/tutorial/advanced/video/wan2.1/wan2-1-video-model)
- `article-comfyui-wiki.com-002.webp` — alt: "Wan2.1 Text-to-Video Workflow" — [Wan2.1 ComfyUI Workflow - Complete Guide | ComfyUI Wiki](https://comfyui-wiki.com/en/tutorial/advanced/video/wan2.1/wan2-1-video-model)
- `article-comfyui-wiki.com-003.jpg` — alt: "ComfyUI Wan2.1 Workflow Steps" — [Wan2.1 ComfyUI Workflow - Complete Guide | ComfyUI Wiki](https://comfyui-wiki.com/en/tutorial/advanced/video/wan2.1/wan2-1-video-model)

### 可用素材 (`research/stock/` — Pixabay 免费可商用)
- (无)

### 跳过项
- 共 5 项被跳过。详见 `manifest.json`

