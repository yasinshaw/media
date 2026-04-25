# Media Toolkit

A collection of AI-powered tools for content creation, from ideation to publishing.

## Project Structure

```
media/
├── projects/                              # 每个自媒体内容一个子目录
│   └── <YYYY-MM-DD-<slug>>/               # 命名格式: 日期-slug
│       ├── script.md                      # 分镜脚本 (video-script 生成)
│       ├── voiceover.md                   # 口播文案 (video-script 提取)
│       ├── review.md                      # 审核结果 (script-review 生成)
│       ├── assets/                        # 素材目录
│       │   ├── footage/                   # 人物录制素材
│       │   ├── images/                    # AI 生成图片 / 封面
│       │   │   ├── cover-landscape.png    # 横版封面 (4:3)
│       │   │   └── cover-portrait.png     # 竖版封面 (3:4)
│       │   └── audio/                     # 配音/音频文件
│       └── output/                        # 最终渲染视频
│           └── *.mp4
│
├── remotion/                              # 共享 Remotion 项目
│   ├── src/
│   │   ├── components/                    # 通用组件
│   │   │   ├── Subtitle.tsx
│   │   │   ├── CTA.tsx
│   │   │   ├── TalkingHead.tsx
│   │   │   ├── ScreenRecording.tsx
│   │   │   ├── SplitScreen.tsx
│   │   │   └── Overlay.tsx
│   │   ├── projects/                      # 按项目组织的代码
│   │   │   └── <slug>/                    # kebab-case slug
│   │   │       ├── composition.tsx        # 组合入口
│   │   │       └── shots/                 # 镜头组件
│   │   │           ├── Shot1.tsx
│   │   │           └── ...
│   │   ├── root.tsx                       # 注册所有组合
│   │   └── index.ts
│   ├── public/
│   ├── package.json
│   └── tsconfig.json
│
├── docs/                                  # 文档
│   └── superpowers/
│       ├── plans/
│       └── specs/
│
└── .claude/                               # Claude 配置
    └── skills/
        ├── video-script/
        ├── video-cover/
        ├── script-review/
        ├── remotion-video/
        └── video-review/
```

## Path Conventions

| 用途 | 路径格式 | 说明 |
|------|----------|------|
| 项目脚本 | `projects/<YYYY-MM-DD-<slug>>/script.md` | video-script 生成 |
| 口播文案 | `projects/<YYYY-MM-DD-<slug>>/voiceover.md` | video-script 提取，用于 TTS / 后期剪辑 |
| 项目审核 | `projects/<YYYY-MM-DD-<slug>>/review.md` | script-review 生成 |
| 横版封面 | `projects/<YYYY-MM-DD-<slug>>/assets/images/cover-landscape.png` | video-cover 生成 (4:3) |
| 竖版封面 | `projects/<YYYY-MM-DD-<slug>>/assets/images/cover-portrait.png` | video-cover 生成 (3:4) |
| 项目素材 | `projects/<YYYY-MM-DD-<slug>>/assets/{footage\|images\|audio}/` | 用户添加 / AI 生成 |
| 项目输出 | `projects/<YYYY-MM-DD-<slug>>/output/<slug>.mp4` | remotion 渲染输出 |
| Remotion 组合 | `remotion/src/projects/<slug>/composition.tsx` | remotion-video 生成 |
| Remotion 镜头 | `remotion/src/projects/<slug>/shots/Shot<N>.tsx` | remotion-video 生成 |
| Remotion 组件 | `remotion/src/components/<Component>.tsx` | 通用组件，可复用 |

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
3. Create project directory and save script to `projects/<YYYY-MM-DD-<slug>>/script.md`

**Output Format:** Each shot includes visual direction, spoken script, and on-screen text.

### `/video-cover` — Generate Video Covers

Generate eye-catching video covers using Volcano Ark AI image generation.

**Usage:**
```
/video-cover <project-slug>
```

**Example:**
```
/video-cover gpt-image2-compare
```

The skill will:
1. Read the script from `projects/*/script.md`
2. Extract video title and theme
3. Generate cover prompts optimized for title visibility
4. Call Volcano Ark API to generate TWO images:
   - **4:3 landscape** (1536×2048): For B站, 西瓜视频
   - **3:4 portrait** (1536×2048): For 抖音, 快手, 视频号
5. Save images to `projects/<YYYY-MM-DD-<slug>>/assets/images/`

**Output:** Two cover PNG files with large, clear, eye-catching titles.

### `/remotion-video` — Convert Scripts to Remotion Videos

Transform storyboard scripts into Remotion React compositions for video rendering.

**Usage:**
```
/remotion-video <project-slug>
```

**Example:**
```
/remotion-video openclaw-vs-hermes
```

The skill will:
1. Parse the script from `projects/*/script.md`
2. Generate shot components in `remotion/src/projects/<slug>/shots/`
3. Create composition in `remotion/src/projects/<slug>/composition.tsx`
4. Register composition in `remotion/src/root.tsx`
5. Render video to `projects/<YYYY-MM-DD-<slug>>/output/`

**Output:** Remotion React components + rendered MP4 video.

### `/script-review` — Fact-Check & Review Scripts

Rigorously review scripts for factual accuracy, professionalism, and content quality. Every claim is verified against authoritative sources.

**Usage:**
```
/script-review <project-slug>
```

**Example:**
```
/script-review openclaw-vs-hermes
```

The skill will:
1. Parse all factual claims (statistics, product info, dates)
2. Verify each claim against authoritative sources (GitHub, official docs, reputable publications)
3. Assess quality across accuracy, professionalism, depth, and engagement
4. Flag unverified claims, hallucinations, or misleading statements
5. Save review to `projects/<YYYY-MM-DD-<slug>>/review.md`

**Quality Standards:**
- Accuracy First - Every factual claim must have a source
- Professional tone - No exaggeration or sensationalism
- Depth & Insight - Beyond surface-level information
- Clear attribution - Sources cited for all verifications

### `/video-review` — Review Remotion Code & Rendered Videos

Review and fix Remotion compositions and rendered output after `/remotion-video`. Runs after `/script-review` in the pipeline.

**Usage:**
```
/video-review <project-slug>
```

**Example:**
```
/video-review gpt-image2-compare
```

The skill will:
1. Review Remotion code quality (composition, shots, components)
2. Verify Douyin format compliance (1080×1920, safe areas, subtitles)
3. Check script-to-code consistency (shot count, timing, subtitle text)
4. Inspect rendered video (resolution, file size, quality)
5. Auto-fix issues where possible

**Review Checklist:**
- Timing accuracy (script → frames calculation)
- Subtitle positioning (bottom: 200px for Douyin overlay)
- Component imports and structure
- Animation parameters (spring, interpolate)
- Visual consistency (colors, spacing, typography)
- Root.tsx registration
