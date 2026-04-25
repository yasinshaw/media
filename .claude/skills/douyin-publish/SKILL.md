---
name: douyin-publish
description: Publish videos to Douyin by reading script metadata and auto-filling parameters. Confirms with user before calling auto-douyin skill.
---

# 抖音视频发布 Skill

自动从项目脚本提取发布参数，确认后调用 auto-douyin skill 发布视频到抖音。

## 使用场景

- 用户运行 `/douyin-publish <project-slug>` 时
- 用户说"发布抖音"、"上传到抖音"时
- 用户有完整的项目（脚本 + 视频）需要发布时

## 工作流程

### Step 1: 定位项目

在 `projects/` 目录中搜索匹配的项目：
- 按精确 slug 匹配
- 按日期前缀匹配 (YYYY-MM-DD-*)
- 如果找到多个，列出供用户选择
- 如果找不到，报错并列出可用项目

### Step 2: 读取脚本

读取 `projects/<YYYY-MM-DD-<slug>>/script.md`，提取：

```markdown
# 视频标题 → 发布标题
## 元信息
- 切入角度 → 用于生成话题标签

分镜内容 → 用于提取关键词/话题
```

### Step 3: 收集资源文件

检查以下文件是否存在：

| 资源 | 路径 | 说明 |
|------|------|------|
| 视频文件 | `projects/<slug>/output/<slug>.mp4` | 必需，发布的主视频 |
| 竖版封面 | `projects/<slug>/assets/images/cover-portrait.png` | 可选，3:4 封面 |
| 横版封面 | `projects/<slug>/assets/images/cover-landscape.png` | 忽略（抖音不需要） |

**视频文件查找逻辑：**
1. 优先查找 `<slug>.mp4`
2. 如果不存在，列出 `output/` 目录下所有 `.mp4` 文件供选择
3. 如果没有任何视频，提示用户先渲染视频

### Step 4: 生成发布参数

基于脚本内容生成发布参数：

#### 标题 (title)
- 直接使用脚本的 `# 视频标题`
- 如果超过30字，截断并添加 "…"（抖音标题限制）

#### 话题标签 (tags)
基于以下来源生成 3-5 个话题：
1. 角度类型映射：
   - 实战教程型 → `#干货分享`, `#教程`
   - 资讯解读型 → `#科技资讯`, `#前沿科技`
   - 行业观点型 → `#深度思考`, `#行业洞察`
   - 知识科普型 → `#知识科普`, `#涨知识`
2. 脚本内容关键词提取（从"切入角度"和分镜内容中）
3. 通用话题（按需添加）：`#AI`, `#效率工具`, `#生产力`

#### 封面 (cover)
- 如果存在 `cover-portrait.png`，使用它
- 否则不指定封面（让抖音自动选取）

#### 定时发布 (schedule)
- 默认不设置（立即发布）
- 用户可手动指定

### Step 5: 展示发布方案（需要确认）

向用户展示完整的发布方案：

```markdown
## 📋 抖音发布方案

### 项目信息
- **项目**: {project-slug}
- **脚本标题**: {title-from-script}

### 📦 发布参数

| 参数 | 值 |
|------|-----|
| **视频文件** | `{video-path}` |
| **发布标题** | `{publish-title}` |
| **话题标签** | {tags} |
| **封面图片** | {cover-path 或 "自动生成"} |
| **发布方式** | 立即发布 / 定时发布 {schedule} |

### 确认发布？

回复以下选项：
- "确认" / "发布" — 执行发布
- "标题: xxx" — 修改标题
- "话题: xxx" — 修改话题（逗号分隔）
- "定时: YYYY-MM-DD HH:MM" — 设置定时发布
- "取消" — 取消发布
```

**WAIT for user confirmation before proceeding to Step 6.**

### Step 6: 调用 auto-douyin 发布

确认后，调用 auto-douyin skill 的发布脚本：

```bash
python3 ~/.agents/skills/auto-douyin/scripts/publish.py \
  --video "{video-path}" \
  --title "{publish-title}" \
  --tags "{tags}" \
  {--cover "{cover-path}" 如果有封面} \
  {--schedule "{schedule}" 如果设置了定时}
```

### Step 7: 报告结果

发布完成后，报告结果：

```markdown
## ✅ 发布完成

视频已提交到抖音创作者中心。

- **视频**: {video-path}
- **标题**: {publish-title}
- **话题**: {tags}

请检查抖音 APP 确认发布状态。
```

如果发布失败，显示错误信息：

```markdown
## ❌ 发布失败

{error-output}

可能的原因：
1. Cookie 失效 → 运行 `python3 ~/.agents/skills/auto-douyin/scripts/get_cookie.py` 重新登录
2. 网络问题 → 检查网络连接
3. 视频格式问题 → 确认视频是有效的 MP4 文件
```

## 错误处理

### 项目未找到
```markdown
❌ 项目未找到: {slug}

可用项目：
{list projects/ directories}
```

### 脚本不存在
```markdown
❌ 脚本文件不存在: projects/{slug}/script.md

请先运行 /video-script 生成脚本
```

### 视频不存在
```markdown
❌ 视频文件不存在

已检查以下路径：
- projects/{slug}/output/{slug}.mp4

output 目录中的文件：
{list output/}

请先渲染视频，或手动指定视频文件路径
```

### Cookie 未配置
```markdown
❌ 未检测到抖音登录 Cookie

请先运行以下命令扫码登录：
```bash
python3 ~/.agents/skills/auto-douyin/scripts/get_cookie.py
```
```

## 命令格式

```
/douyin-publish <project-slug>
```

示例：
```
/douyin-publish gpt-image2-compare
/douyin-publish 2026-04-24-chatgpt-o3
```

## 集成到工作流

此技能是视频制作流程的最后一步：

1. `/video-script` → 生成 `script.md`
2. `/remotion-video` → 渲染视频到 `output/<slug>.mp4`
3. `/video-cover` → 生成封面图片（可选）
4. `/douyin-publish` → **此 skill** — 发布到抖音

## 路径约定

| 用途 | 路径 |
|------|------|
| 项目目录 | `projects/<YYYY-MM-DD-<slug>>/` |
| 脚本文件 | `projects/<slug>/script.md` |
| 输出视频 | `projects/<slug>/output/<slug>.mp4` |
| 竖版封面 | `projects/<slug>/assets/images/cover-portrait.png` |

## 技巧

1. **标题长度控制** — 抖音标题最多30字，超出会被截断
2. **话题数量** — 建议添加 3-5 个话题，太多会被限流
3. **发布频率** — 建议间隔发布，避免被识别为异常行为
4. **封面选择** — 指定封面可以提高点击率，建议使用 /video-cover 生成
5. **Cookie 检查** — 发布前可以先检查 Cookie 是否有效
