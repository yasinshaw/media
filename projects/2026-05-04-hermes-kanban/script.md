# AI Agent自己拍了个视频

**BGM**: 科技电子 | medium | 0.08
## 元信息
- 切入角度: 资讯解读型 — Hermes看板功能介绍
- 目标时长: 53秒
- 预估字数: 234字

## 分镜脚本

### 镜头 1 — 钩子（0-5s）
- **画面类型**: ai背景图
- **画面**: 深色科技感背景，中央大字"AI自己做了一个视频"逐字打出，底部小字"Hermes Agent × Nous Research"，光线泄露
- **口播**: "一个AI Agent，自己拆任务、找素材、剪视频，全程没人插手。"
- **转场效果**: slide(from-bottom)
- **文字特效**: typewriter
- **音效**: epic/transition/strong
- **背景图提示词**: dark futuristic server room with glowing blue circuit board patterns, holographic floating task cards, cinematic lighting, no text

### 镜头 2 — 痛点引入（5-18s）
- **画面类型**: remotion
- **画面**: 左侧大图标"主Agent"连线指向3个子Agent图标（纵向排列，依次亮起表示排队等待），中间红色叉号标注"瓶颈"，右侧文字"子Agent崩了 → 全卡死"。底部大字"传统方式：主Agent串行调度"
- **口播**: "多Agent协作听起来很酷，但实际用起来一塌糊涂。主Agent串行调度子Agent，谁先谁后全靠它判断。任务一复杂，主Agent自己就成瓶颈了，子Agent崩了整个流程就卡死。"
- **转场效果**: wipe
- **文字特效**: highlight
- **音效**: tense/transition/medium

### 镜头 3 — 核心内容（18-30s）
- **画面类型**: remotion
- **画面**: 6列看板动画，标题依次淡入（Triage → Todo → Ready → In Progress → Blocked → Done），一张任务卡片从Triage滑动到Ready，3个不同颜色Agent图标同时冲向卡片，只有一个抢到（原子锁效果，其他弹开），卡片移入In Progress。底部文字"任务上板 · 自己认领 · 原子锁"
- **口播**: "Hermes的思路完全不一样：把任务扔上看板，让Agent自己去抢。底层SQLite加原子事务，多个Agent同时抢同一个任务，只有一个能拿到，不会重复执行。"
- **转场效果**: fade
- **文字特效**: typewriter
- **音效**: energetic/emphasis/medium

### 镜头 4 — 核心内容（30-45s）
- **画面类型**: remotion
- **画面**: 左侧3个任务卡片纵向排列（schema → API → tests），上游完成时绿色箭头自动亮起推动下游卡片。右侧弹出结构化交接信息框，显示summary和metadata字段。底部依次闪现3个标签："依赖引擎" "崩溃恢复" "熔断通知"
- **口播**: "更厉害的是依赖引擎。上游任务完成，下游自动从待办提到就绪。Worker之间交接走结构化的summary和metadata，不用翻聊天记录。Agent挂了？自动释放回队列。连续失败三次？自动熔断，自动通知你。"
- **转场效果**: slide(from-right)
- **文字特效**: typewriter
- **音效**: calm/ambient/subtle, energetic/emphasis/medium

### 镜头 5 — CTA收尾（45-53s）
- **画面类型**: remotion
- **画面**: 4个协作模式图标依次弹入（扇出并行 / 流水线 / 投票仲裁 / 人工介入），中央Hermes Logo + "MIT 开源免费"，底部文字"hermes-agent.nousresearch.com"，Logo脉冲呼吸效果
- **口播**: "扇出并行、流水线、投票仲裁、人工介入，多种协作模式全都有。MIT开源免费，想试试的话，评论区见。"
- **转场效果**: none
- **文字特效**: highlight
- **音效**: epic/emphasis/medium
