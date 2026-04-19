# Media Toolkit

A collection of AI-powered tools for content creation, from ideation to publishing.

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
3. Save the script to `scripts/YYYY-MM-DD-<slug>.md`

**Output Format:** Each shot includes visual direction, spoken script, and on-screen text.
