# Changelog

## 2026-05-04 — Major Update: Animation System, SFX Enhancement, Research Assets

### Animation System

New comprehensive animation system for Remotion video compositions:

- **Entry animations**: `useFadeIn`, `useScaleIn`, `useSlideIn` — configurable direction, delay, and spring physics
- **Content animations**: `useStagger`, `useNumberRoll`, `useTextReveal` — character-by-character and sequential element reveals
- **Continuous animations**: `useFloat`, `usePulse`, `useRotate` — idle-state motion for visual interest
- **Transition component**: crossfade, slide, and zoom transitions between shots
- **Background atmospheres**: `FloatingOrbs`, `GradientFlow`, `GridPattern`, `ParticleField` — animated background layers
- **Layout primitives**: new `backgroundLayer` prop on all layout primitives
- **DeepSeek v4 upgrade**: all shots enhanced with animation hooks, backgrounds, and transitions

### SFX Enhancement — 3D Taxonomy & Multi-Layer Architecture

- **3D taxonomy**: category × intensity × timing classification for sound effects
- **SFX matcher**: automatic SFX selection from script keywords with 3D taxonomy lookup and legacy translation
- **SFX layer upgrade**: multi-layer stacking, volume balancing, and configurable defaults
- **Utility scripts**: manifest update, bulk rename, SFX download script
- **Vitest**: added to remotion project for testing

### Research Asset Collection

New pipeline for collecting visual assets during the research phase:

- **Orchestrator + CLI**: automated asset collection workflow
- **Pixabay search**: image and video search with 429 rate-limit backoff
- **Tavily extraction**: image URL extraction from search results
- **HTML media extraction**: parse article HTML for embedded media
- **Async downloader**: retry logic, concurrency cap, collision-safe filenames
- **Smart filtering**: URL and image heuristics to filter irrelevant results
- **Manifest tracking**: structured metadata for all collected assets
- **video-script integration**: `collect-research-assets` step added to script generation pipeline

### Image Generation

- Switched from Volcano Ark (Seedream) to **OpenAI-compatible** `/v1/images/generations` endpoint
- Supports OpenAI, bltcy relay, and Gemini relay providers
- New `scripts/generate_image.py` — standalone image generation script

### Skills Updates

| Skill | Changes |
|-------|---------|
| video-script | 3D SFX taxonomy format, research-asset collection step |
| remotion-video | 3D SFX parsing, matchSFX, animation hooks, backgrounds |
| video-review | Animation and background checks |
| video-cover | OpenAI-compatible API, single-call crop for landscape/portrait |
| voiceover-tts | Major script rewrite, multi-speaker support, manifest generation |
| douyin-publish | Workflow improvements |
| script-review | Updated review criteria |

### New Video Projects (10)

| Project | Topic |
|---------|-------|
| ai-novel-writing | AI 写小说流程 |
| agent-teams | Agent Teams 多智能体协作 |
| agent-skill | 如何制作一个专属技能 |
| gpt-image2 | GPT Image 2 对比评测 |
| ai中转站真相 | AI 中转站真相 |
| 如何制作一个专属技能 | 专属技能制作教程 |
| grok43-custom-voices | Grok 4.3 自定义声音 |
| hermes-kanban | Hermes Kanban 项目管理 |
| multi-agent-syncer | Multi-Agent Syncer 多智能体同步 |
| pixelle-video | Pixelle Video 像素视频 |

### DeepSeek v4 Presentation

- HTML-based presentation (`presentation.html`) with `generate_pptx.js` converter
- Slide deck (`deck.md`) and npm packaging

### Infrastructure

- `.gitignore`: added AI tool directories (`.agents/`, `.trae/`, `.superpowers/`, `.claude/worktrees/`)
- `skills-lock.json`: tracks installed third-party skills
- `README.md`: updated project description
- `BGMAudio.tsx`: enhanced background music handling
- `subtitle-utils.ts`: timing and formatting fixes
