# 调研: xAI Grok 4.3 + Custom Voices

> 生成时间: 2026-05-03 12:00

## 搜索记录
1. "xAI Grok 4.3 release price drop Imagine Agent Mode May 2026"
   - [xAI drops Grok 4.3 with steep price cuts and an Imagine agent mode — The Decoder](https://the-decoder.com/xai-drops-grok-4-3-with-steep-price-cuts-and-an-imagine-agent-mode-for-creative-projects/) — 完整技术分析、benchmark 对比、Imagine Agent 详情
   - [xAI launches Grok 4.3 at an aggressively low price — VentureBeat](https://venturebeat.com/technology/xai-launches-grok-4-3-at-an-aggressively-low-price-and-a-new-fast-powerful-voice-cloning-suite/) — 定价策略、Custom Voices 安全机制
   - [xAI launches Grok 4.3 with improved agentic performance — Artificial Analysis](https://artificialanalysis.ai/articles/xai-launches-grok-4-3-with-improved-agentic-performance-and-lower-pricing) — 官方 benchmark 数据、Pareto frontier 分析
2. "xAI Custom Voices voice cloning feature 2026"
   - [xAI's new Custom Voices feature turns a minute of speech into a usable voice clone — The Decoder](https://the-decoder.com/xais-new-custom-voices-feature-turns-a-minute-of-speech-into-a-usable-voice-clone/) — 双重验证机制、Voice Library 详情
   - [xAI Launches Voice Cloning via API: 80+ Voices, 28 Languages — Basenor](https://www.basenor.com/blogs/news/xai-launches-voice-cloning-via-api-80-voices-28-languages) — TTS 定价 $4.20/M 字符、Voice Agent $3/小时
   - [xAI Custom Voices Clones Voice in One Minute — Neura Market](https://www.neura.market/news/xai-custom-voices-feature-clones-voice-in-a-minute) — Starlink 客服应用案例
3. "Grok 4.3 benchmark Artificial Analysis Intelligence Index pricing comparison"
   - [Grok 4.3 — Artificial Analysis Model Page](https://artificialanalysis.ai/models/grok-4-3) — 详细 benchmark 数据、速度 190 tok/s、verbose 特征
   - [Grok 4.3: characteristics, pricing, benchmarks — DataStudios](https://www.datastudios.org/post/grok-4-3-characteristics-pricing-benchmarks-context-window-api-access-and-what-changed-from-gr) — 使用场景分析、与 Grok 4.20 对比

## 核心发现
- Grok 4.3 Intelligence Index 得分 53（排名第 8），比 Grok 4.20 高 4 分，紧随 Claude Sonnet 4.6 之上 — 来源: [Artificial Analysis](https://artificialanalysis.ai/articles/xai-launches-grok-4-3-with-improved-agentic-performance-and-lower-pricing)
- 定价 $1.25/M 输入 + $2.50/M 输出，输入降约 40%、输出降约 60% — 来源: [VentureBeat](https://venturebeat.com/technology/xai-launches-grok-4-3-at-an-aggressively-low-price-and-a-new-fast-powerful-voice-cloning-suite/)
- 完整 benchmark 运行成本 $395，远低于 GPT-5.5（$3,959）和 Claude Opus 4.7（$4,811） — 来源: [The Decoder](https://the-decoder.com/xai-drops-grok-4-3-with-steep-price-cuts-and-an-imagine-agent-mode-for-creative-projects/)
- Imagine Agent Mode 基于 Flux 图像模型，支持多步骤创意项目（规划→生成→编辑→修订） — 来源: [Gnoppix Forum](https://forum.gnoppix.org/t/xai-drops-grok-4-3-with-steep-price-cuts-and-an-imagine-agent-mode-for-creative-projects/5800)
- Custom Voices: 1 分钟录音 + 双重验证（朗读验证短语+声纹比对），克隆声音无额外费用 — 来源: [The Decoder](https://the-decoder.com/xais-new-custom-voices-feature-turns-a-minute-of-speech-into-a-usable-voice-clone/)
- Voice Library: 80+ 预置声音、28 种语言，TTS $4.20/M 字符、Voice Agent $3/小时 — 来源: [Basenor](https://www.basenor.com/blogs/news/xai-launches-voice-cloning-via-api-80-voices-28-languages)
- Grok Voice Think Fast 1.0 已为 Starlink 客服和销售提供支持 — 来源: [Neura Market](https://www.neura.market/news/xai-custom-voices-feature-clones-voice-in-a-minute)

## 关键数据
| 数据项 | 数值 | 来源 |
|--------|------|------|
| Intelligence Index 得分 | 53（排名第 8） | [Artificial Analysis](https://artificialanalysis.ai/models/grok-4-3) |
| 输入定价 | $1.25/百万 token | [VentureBeat](https://venturebeat.com/technology/xai-launches-grok-4-3-at-an-aggressively-low-price-and-a-new-fast-powerful-voice-cloning-suite/) |
| 输出定价 | $2.50/百万 token | [VentureBeat](https://venturebeat.com/technology/xai-launches-grok-4-3-at-an-aggressively-low-price-and-a-new-fast-powerful-voice-cloning-suite/) |
| Benchmark 成本 | $395 | [Artificial Analysis](https://artificialanalysis.ai/articles/xai-launches-grok-4-3-with-improved-agentic-performance-and-lower-pricing) |
| GPT-5.5 Benchmark 成本 | $3,959 | [The Decoder](https://the-decoder.com/xai-drops-grok-4-3-with-steep-price-cuts-and-an-imagine-agent-mode-for-creative-projects/) |
| Claude Opus 4.7 Benchmark 成本 | $4,811 | [The Decoder](https://the-decoder.com/xai-drops-grok-4-3-with-steep-price-cuts-and-an-imagine-agent-mode-for-creative-projects/) |
| 输出速度 | ~190 tokens/秒 | [Artificial Analysis](https://artificialanalysis.ai/models/grok-4-3) |
| 上下文窗口 | 100 万 token | [Artificial Analysis](https://artificialanalysis.ai/models/grok-4-3) |
| Voice Library 声音数 | 80+ 种 | [Neura Market](https://www.neura.market/news/xai-custom-voices-feature-clones-voice-in-a-minute) |
| Voice Library 语言数 | 28 种 | [Neura Market](https://www.neura.market/news/xai-custom-voices-feature-clones-voice-in-a-minute) |
| TTS 定价 | $4.20/百万字符 | [Basenor](https://www.basenor.com/blogs/news/xai-launches-voice-cloning-via-api-80-voices-28-languages) |
| Voice Agent 定价 | $3.00/小时 | [Basenor](https://www.basenor.com/blogs/news/xai-launches-voice-cloning-via-api-80-voices-28-languages) |

## 需要核实的事实
- [x] Grok 4.3 Intelligence Index 得分 53 ✅ — 来源: [Artificial Analysis](https://artificialanalysis.ai/models/grok-4-3)
- [x] 定价 $1.25/$2.50 每百万 token ✅ — 来源: [VentureBeat](https://venturebeat.com/technology/xai-launches-grok-4-3-at-an-aggressively-low-price-and-a-new-fast-powerful-voice-cloning-suite/)
- [x] 输入降 40%、输出降 60% ✅ — 来源: [Artificial Analysis](https://artificialanalysis.ai/articles/xai-launches-grok-4-3-with-improved-agentic-performance-and-lower-pricing)（精确值 37.5% / 58.3%）
- [x] Benchmark 成本 $395 vs $3,959 (GPT-5.5) ✅ — 来源: [The Decoder](https://the-decoder.com/xai-drops-grok-4-3-with-steep-price-cuts-and-an-imagine-agent-mode-for-creative-projects/)
- [x] 1 分钟录音克隆声音 ✅ — 来源: [The Decoder](https://the-decoder.com/xais-new-custom-voices-feature-turns-a-minute-of-speech-into-a-usable-voice-clone/)
- [x] 80+ 声音、28 种语言 ✅ — 来源: [Neura Market](https://www.neura.market/news/xai-custom-voices-feature-clones-voice-in-a-minute)
- [x] Starlink 客服使用 ✅ — 来源: [Neura Market](https://www.neura.market/news/xai-custom-voices-feature-clones-voice-in-a-minute)
- [ ] 速度 100 tokens/秒 — 用户原文，Artificial Analysis 显示 ~190 tokens/秒，需确认

## 可用素材
- Bindu Reddy (Abacus AI CEO) 评价: "as smart as Sonnet 4.6 and 5x cheaper and faster" — 来源: [VentureBeat](https://venturebeat.com/technology/xai-launches-grok-4-3-at-an-aggressively-low-price-and-a-new-fast-powerful-voice-cloning-suite/)
- Grok 4.3 位于 Artificial Analysis 的 Pareto frontier（性价比最优象限） — 来源: [Artificial Analysis](https://artificialanalysis.ai/articles/xai-launches-grok-4-3-with-improved-agentic-performance-and-lower-pricing)
- GDPval-AA benchmark: Elo 1500，超过 Gemini 3.1，但落后 GPT-5.5（276 Elo） — 来源: [The Decoder](https://the-decoder.com/xai-drops-grok-4-3-with-steep-price-cuts-and-an-imagine-agent-mode-for-creative-projects/)
- Grok 4.3 评测时生成了 88M token（平均仅 35M），非常 verbose — 来源: [Artificial Analysis](https://artificialanalysis.ai/models/grok-4-3)
- Omniscience 准确率 +8 分，但非幻觉率 -8 分 — 来源: [Artificial Analysis](https://artificialanalysis.ai/articles/xai-launches-grok-4-3-with-improved-agentic-performance-and-lower-pricing)
- Andon Labs 评价: 自主 Agent 任务中有时"嗜睡"（连续多天不采取行动） — 来源: [The Decoder](https://the-decoder.com/xai-drops-grok-4-3-with-steep-price-cuts-and-an-imagine-agent-mode-for-creative-projects/)

## 视觉素材英文关键词
- xAI Grok logo, AI model comparison chart, voice cloning microphone, AI agent creative workflow, neural network server

## 视觉素材清单

> 已下载到 `assets/research/`，详见 `manifest.json`

### 参考素材 (`research/reference/` — 外部版权，仅作脚本写作参考)
- `tavily-001.jpg` — []()
- `tavily-002.jpg` — []()
- `tavily-003.jpg` — []()
- `tavily-004.jpg` — []()
- `tavily-006.png` — []()
- `tavily-008.png` — []()
- `tavily-009.jpg` — []()
- `article-the-decoder.com-001.png` — alt: "Image description" — [xAI drops Grok 4.3 with steep price cuts and an Imagine agent mode for creative projects](https://the-decoder.com/xai-drops-grok-4-3-with-steep-price-cuts-and-an-imagine-agent-mode-for-creative-projects/)
- `article-the-decoder.com-002.png` — alt: "Artificial Analysis Intelligence Index and cost comparison: Grok 4.3 ranks 8th with a score of 53, behind GPT-5.5 (60), Claude Opus 4.7 and Gemini 3.1 Pro Preview (both at 57). Grok 4.3 benchmark costs come in at $395, far below top models like Claude Opus 4.7 ($4,811) or GPT-5.5 ($3,959)." — [xAI drops Grok 4.3 with steep price cuts and an Imagine agent mode for creative projects](https://the-decoder.com/xai-drops-grok-4-3-with-steep-price-cuts-and-an-imagine-agent-mode-for-creative-projects/)
- `article-the-decoder.com-003.png` — alt: "Intelligence vs. cost chart showing Grok 4.3 in the most attractive quadrant, balancing strong performance with low operating costs." — [xAI drops Grok 4.3 with steep price cuts and an Imagine agent mode for creative projects](https://the-decoder.com/xai-drops-grok-4-3-with-steep-price-cuts-and-an-imagine-agent-mode-for-creative-projects/)
- `article-artificialanalysis.ai-001.png` — [xAI launches Grok 4.3 with improved agentic performance and lower pricing](https://artificialanalysis.ai/articles/xai-launches-grok-4-3-with-improved-agentic-performance-and-lower-pricing)
- `article-artificialanalysis.ai-002.png` — [xAI launches Grok 4.3 with improved agentic performance and lower pricing](https://artificialanalysis.ai/articles/xai-launches-grok-4-3-with-improved-agentic-performance-and-lower-pricing)
- `article-artificialanalysis.ai-003.png` — [xAI launches Grok 4.3 with improved agentic performance and lower pricing](https://artificialanalysis.ai/articles/xai-launches-grok-4-3-with-improved-agentic-performance-and-lower-pricing)
- `article-artificialanalysis.ai-004.png` — [xAI launches Grok 4.3 with improved agentic performance and lower pricing](https://artificialanalysis.ai/articles/xai-launches-grok-4-3-with-improved-agentic-performance-and-lower-pricing)
- `article-artificialanalysis.ai-005.png` — [xAI launches Grok 4.3 with improved agentic performance and lower pricing](https://artificialanalysis.ai/articles/xai-launches-grok-4-3-with-improved-agentic-performance-and-lower-pricing)

### 可用素材 (`research/stock/` — Pixabay 免费可商用)
- (无)

### 跳过项
- 共 3 项被跳过。详见 `manifest.json`

