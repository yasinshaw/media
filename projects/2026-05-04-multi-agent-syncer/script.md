# 写个技能，16个AI代理都能用

**BGM**: 科技电子 | medium | 0.08
## 元信息
- 切入角度: 工具介绍 + 使用演示 + 同类开源对比
- 目标时长: 1分28秒（约88秒）
- 预估字数: 370字

## 分镜脚本

### 镜头 1 — 钩子（0-6s）
- **画面类型**: ai背景图
- **画面**: 深色终端背景，绿色代码雨效果。中央大字弹入："复制16次？"，下方小字 "1个skill → 16个代理"。`噪点纹理` 全片叠加
- **口播**: "你写了一个超好用的AI技能，结果得复制16次才能给所有代理用上？"
- **转场效果**: none
- **文字特效**: highlight
- **音效**: epic/transition/strong
- **背景图提示词**: dark terminal screen with green matrix code rain effect, hacker aesthetic, dark background with glowing green text streams, cinematic moody lighting, no text

### 镜头 2 — 痛点引入（6-17s）
- **画面类型**: remotion
- **画面**: AI 编程代理 Logo 逐个弹出排列（Claude Code、Cursor、Windsurf、Copilot、Codex、Kiro、Trae、Amp...），每个下方标注各自的 skills 目录路径。最终 15+ 个 Logo 挤满屏幕，中央浮现红色 "×16" 提示。`旋转入场` 动画
- **口播**: "2026年AI编程代理大爆发，15个以上。每个都有自己的skills目录，格式还差不多。更新一次？对不起，再复制16次。"
- **转场效果**: slide(from-bottom)
- **文字特效**: typewriter
- **音效**: tense/emphasis/medium

### 镜头 3 — 解决方案（17-30s）
- **画面类型**: remotion
- **画面**: 架构图动画：中央方块 "中央仓库 ~/.agents/skills/"，四周辐射出 16+ 条连线到不同代理图标（Claude、Cursor、Gemini、Codex...），连线末端标注 "symlink →"。中央方块修改时，所有连线同时亮起脉冲。底部文字："改一处，全部生效"。`脉冲呼吸` 效果
- **口播**: "所以我做了这个工具：multi-agent-syncer。核心思路——符号链接。中央仓库放一份，所有代理用symlink指向它。改一次，全部生效，零拷贝。"
- **转场效果**: wipe
- **文字特效**: highlight
- **音效**: energetic/emphasis/medium

### 镜头 4 — CLI 使用演示（30-41s）
- **画面类型**: remotion
- **画面**: 深色终端界面（macOS Terminal 风格），窗口标题栏显示 "multi-agent-syncer"。逐行显示三条命令，每条用 `typewriter` 效果打出：
  1. `$ sync --skills tavily-search --to claude,cursor` → 输出绿色 "✓ Synced tavily-search → claude, cursor"
  2. `$ status` → 显示简洁的代理×技能矩阵，已同步项亮绿 ✓
  3. `$ sync --skills react --to claude --project ./my-app` → 输出绿色 "✓ Synced react → claude (project: ./my-app)"
  每条命令输出后短暂停顿，再显示下一条
- **口播**: "用法超简单。装好之后，一条命令同步多个代理：sync --skills tavily-search --to claude,cursor，搞定。想看状态？status一目了然。不需要了？unsync直接取消。"
- **转场效果**: slide(from-right)
- **文字特效**: typewriter
- **音效**: calm/ambient/subtle

### 镜头 5 — Web UI + 项目级同步（41-54s）
- **画面类型**: 固定图片
- **画面**: 使用截图素材: `webui-user-level.png`。截图放入圆角卡片容器中，带阴影和边框。卡片上方标题 "Web UI Dashboard"，下方标注 "用户级 · 矩阵视图"。右侧叠加项目级说明卡片：前端项目图标 + "React · Vue"，后端项目图标 + "PostgreSQL · Redis"，箭头指向不同技能。底部标签："CLI + Web UI · 用户级 + 项目级"
- **口播**: "不喜欢命令行？打开浏览器，Web UI矩阵视图，直接勾选就行。最关键的是项目级同步。给前端项目同步React技能，给后端项目同步数据库技能，互不干扰。"
- **转场效果**: fade
- **文字特效**: highlight
- **音效**: calm/ambient/subtle

### 镜头 6 — 同类对比（54-66s）
- **画面类型**: remotion
- **画面**: 横向对比表格动画，4行（multi-agent-syncer、agent-skills-manager、skillshare、claude-skills），列标题依次弹出：代理数、UI、CLI、项目级。每列用 `宽度展开` 动画填入数据。multi-agent-syncer 行高亮。最后一列"代码量"揭晓：multi-agent-syncer "800行" vs 其他 "未公开/分散"
- **口播**: "市面上有类似工具。agent-skills-manager是桌面应用，11个代理，也有项目级。skillshare支持50多个代理，更全面。claude-skills有232个技能但同步脚本分散。它们各有优势。"
- **转场效果**: flip
- **文字特效**: typewriter
- **音效**: energetic/transition/medium

### 镜头 7 — 核心优势（66-79s）
- **画面类型**: remotion
- **画面**: 4 个优势卡片依次 `旋转入场`，排成 2×2 网格。第一个卡片最大，带 `脉冲呼吸` 强调：
  - "Symlink 项目级同步" + "零拷贝 · 按项目精准管控" （最大，高亮）
  - "最轻量" + "~800行代码"
  - "全覆盖" + "16+ 代理"
  - "自举能力" + "管理自己"
  最后一张卡片里的"管理自己"旁出现递归箭头图标
- **口播**: "核心优势：用symlink做项目级同步，零拷贝，按项目精准管控技能。最轻量，800行代码。代理覆盖16个以上。而且它能管理自己——工具本身就是一个skill。"
- **转场效果**: fade
- **文字特效**: highlight
- **音效**: playful/feedback/medium

### 镜头 8 — CTA 收尾（79-88s）
- **画面类型**: ai背景图
- **画面**: 与镜头1呼应的深色终端背景。中央大字："一键同步"。下方 GitHub 图标 + 链接 "github.com/yasinshaw/multi-agent-syncer"。底部大号星标图标闪烁，文字 "⭐ Star on GitHub"。`噪点纹理` 叠加
- **口播**: "开源免费，GitHub链接放评论区。觉得好用，去给个star吧，你的star是开源最大的动力。你用几个AI编程代理？评论区告诉我。"
- **转场效果**: fade
- **文字特效**: highlight
- **音效**: epic/emphasis/medium
- **背景图提示词**: minimalist dark terminal interface with soft blue glow, clean code editor aesthetic, subtle gradient from dark navy to black, no text, modern tech wallpaper
