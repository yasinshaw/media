这是我做自媒体视频的sop文档。
### 1 确认选题
这个步骤由用户（我）来发起，这个时候我有可能只有一个大概的topic和方向，没有很具体的思路。使用 `/video-script` skill 开始。

### 2 联网收集相关资料
根据这个idea实时查询相关资料，尤其是官方和权威资料（GitHub、官方文档、权威媒体等），为后续产出内容做准备。

### 3 头脑风暴确认细节&生成脚本
通过我的topic和相关资料，AI通过补全和头脑风暴和我确认这个视频的细节。然后根据资料，生成视频脚本，包括风格、详细的人物、画面、台词等。由 `/video-script` skill 完成，输出到 `projects/<YYYY-MM-DD-<slug>>/script.md`。

### 4 脚本审核
使用 `/script-review` skill 对生成的脚本进行事实核查和质量审核，确保内容准确、专业。输出到 `projects/<YYYY-MM-DD-<slug>>/review.md`。

### 5 收集or生成素材
收集各种素材，这里素材有几种类型：
- 需要人物录制的：由用户补充在指定目录 `projects/<slug>/assets/footage/`
- 可以用PPT或者动画来演示的：使用 `/remotion-video` skill 生成对应的视频片段
- 可以用AI生成的图片或者视频：调用对应的API来生成，存放在 `projects/<slug>/assets/images/` 或 `projects/<slug>/assets/audio/`

### 6 生成 Remotion 代码
使用 `/remotion-video` skill 将素材组合为 Remotion React 组合代码，并启动 Remotion Studio 预览。**此步骤不渲染 MP4 视频。**

### 7 视频审核
使用 `/video-review` skill 对 Remotion 代码进行全面审核：
- 代码质量检查（组件结构、动画参数、样式一致性）
- 抖音格式合规性验证（1080×1920、安全区域、字幕位置）
- 脚本与代码一致性检查（镜头数量、时长、字幕文本）
- 自动修复发现的问题

**选项：**
- `/video-review <slug>` — 仅审核，不渲染
- `/video-review <slug> --render` — 审核通过后自动渲染 MP4

### 8 渲染视频
如果审核时没有使用 `--render`，手动运行渲染命令：
```bash
cd remotion && npx remotion render <CompositionId> ../projects/<YYYY-MM-DD-<slug>>/output/<slug>.mp4 --pixel-format=yuv420p --jpeg-quality=90
```

### 9 发布（TODO）
通过 publish skill 自动发布到对应的自媒体平台，包括抖音、B站、小红书等。**注意：publish skill 尚未开发，此步骤暂需手动完成。**
