---
name: video-review
description: >
  Review and fix Remotion video compositions. Use after /script-review to verify code quality,
  visual consistency, Douyin format compliance, timing accuracy. Add --render flag to auto-render
  MP4 after review passes. Trigger when user says /video-review, asks to review video code,
  or verify composition quality.
---

You are a senior Remotion video reviewer who audits code for Douyin short videos. **After review, automatically apply fixes unless user declines.**

## Workflow

### Step 1: Locate Project

Find project by slug or directory name in `projects/`. Parse `script.md` for expected structure.

```
/video-review <project-slug> [--render]
```

**Flags:**
- `--render`: After review passes (no Critical issues), automatically render MP4

**Examples:**
- `/video-review gpt-image2-compare` — review only, no render
- `/video-review gpt-image2-compare --render` — review and auto-render if pass

### Step 2: Code Review

Read all Remotion source files for the project:
- `remotion/src/projects/<slug>/composition.tsx`
- `remotion/src/projects/<slug>/shots/*.tsx`
- `remotion/src/root.tsx` (registration check)

Check against the Code Review Checklist below.

**IMPORTANT: Visual Alignment Checks — Pay Special Attention**
- Look for `<svg>` elements with connection lines — verify line coordinates match actual element positions
- Check for `position: 'absolute'` combined with flex layouts — may cause misalignment
- Verify percentage-based positioning aligns with the elements they reference
- Check `zIndex` values — SVG lines should be behind connected elements
- For circular layouts, verify math calculations are consistent between elements and lines

### Step 3: Script-to-Code Consistency

Cross-reference script.md with Remotion code:
- Shot count matches
- Timing matches (script "0-5s" → 150 frames at 30fps)
- Subtitle text matches script 字幕
- Visual direction (画面) mapped to correct component type

### Step 4: Report & Auto-Fix

Output structured review, then auto-fix issues.

### Step 5: Render Video (Conditional — Only with --render flag)

**Only execute this step if:**
1. User provided `--render` flag, AND
2. Review result is Pass or Minor (no Critical issues)

If Critical issues exist:
- Do NOT render
- Report the issues and ask user to fix manually
- User can re-run `/video-review <slug> --render` after fixes

**Render command:**
```bash
mkdir -p projects/<YYYY-MM-DD-<slug>>/output/
cd remotion && npx remotion render <CompositionId> ../projects/<YYYY-MM-DD-<slug>>/output/<slug>.mp4 --pixel-format=yuv420p --jpeg-quality=90
```

After render completes:
- Verify output file exists and is playable
- Check file size is reasonable
- Report: rendered video file path and size

**Without --render flag:**
- Remind user to run render command (see SOP Step 8) when review passes

## Code Review Checklist

### 0. Layout Primitive Compliance (CRITICAL — most layout bugs originate here)

`/remotion-video` requires every shot to start from a Layout primitive (`CenteredStack`, `HubLayout`, `TwoColumnCompare`, `TimelineFlow`) unless explicitly justified. Hand-written `AbsoluteFill` with manual padding is the #1 source of misalignment, subtitle-zone overlap, and SVG drift.

| Check | Detection (regex/heuristic) | Severity | Auto-fix |
|-------|----------------------------|----------|----------|
| **Hand-written safe-area padding** | `padding:\s*['"]120px\s+40px\s+\d+px['"]` in any shot | Major | Replace `<AbsoluteFill style={{ padding: '120px 40px 200px', ... }}>` → `<SafeArea style={{ ... }}>` |
| **Content invades subtitle zone** | `bottom:\s*(\d+)` where number `< 420` AND not inside `<Subtitle>`/`<ProgressiveSubtitle>` | Critical | Replace literal with `SAFE_AREA.CONTENT_BOTTOM` (=420), or move into a primitive's `footer` slot |
| **No layout primitive used** | Shot has `<AbsoluteFill>` directly + no import of `CenteredStack`/`HubLayout`/`TwoColumnCompare`/`TimelineFlow` | Major | Suggest the closest primitive (use the "Picking a Primitive" table). Ask user before restructuring. |
| **Hub-pattern hand-rolled** | Has `<svg>` with `<line>` + `Math.cos`/`Math.sin` OR multi-position absolute children | Major | Replace with `HubLayout`. Ask user first if shot logic is non-trivial. |
| **Compare-pattern hand-rolled** | `flex: 1` siblings with matching border/title structure | Minor | Suggest `TwoColumnCompare`. Ask user. |
| **Timeline-pattern hand-rolled** | `.map(...)` rendering badge+label+arrow rows | Minor | Suggest `TimelineFlow`. Ask user. |

**Rule of thumb:** if a shot file imports `AbsoluteFill` directly from `'remotion'` AND does not import any layout primitive, flag for review.

### 0.5 Manual-Positioning Discipline (when escape hatch is justified)

If a shot legitimately can't use a primitive, these rules from [remotion-video/references/manual-positioning.md](../remotion-video/references/manual-positioning.md) still apply:

| Check | Detection | Severity | Auto-fix |
|-------|-----------|----------|----------|
| **Centering with offset literal** | `left:\s*\w+\s*-\s*\d+` or `top:\s*\w+\s*-\s*\d+` (hardcoded half-width) | Major | Replace with `transform: 'translate(-50%, -50%)'` and use raw center coords |
| **SVG hardcoded pixel + flex parent** | `<svg>` with `x1="\d+"` AND parent has `justifyContent: 'center'` or `alignItems: 'center'` | Critical | Add explicit `viewBox="0 0 1080 1920"` and switch element positioning to absolute pixels (or use HubLayout) |
| **Percentage absolute in flex** | `position: 'absolute'` + `top:\s*['"]?\d+%['"]?` inside flex container | Major | Convert to absolute pixels, or restructure to use a primitive |
| **Missing `extrapolateRight: 'clamp'`** | `interpolate(...)` calls without `clamp` | Minor | Add `{ extrapolateRight: 'clamp' }` |
| **Boolean opacity transition** | `opacity:\s*\w+\s*\?\s*1\s*:\s*0` | Major | Replace with `interpolate` and overlapping ranges (see manual-positioning.md) |

### 1. Douyin Format Compliance (CRITICAL)

| Check | Requirement |
|-------|-------------|
| Resolution | 1080×1920 in root.tsx composition registration |
| FPS | 30 |
| Pixel format | yuv420p in render command |
| Top safe area | 120px clear of critical content |
| Bottom safe area | 200px clear (Douyin UI overlay) |
| Side safe areas | 40px each |

### 2. Timing & Duration

| Check | Requirement |
|-------|-------------|
| SHOT_DURATIONS | Match script shot timing exactly |
| Cumulative frames | `getShotStart` calculation correct |
| Total duration | Sum matches composition `durationInFrames` |
| Sequence from/to | Each Sequence `from` matches cumulative position |

Timing formula: `durationFrames = (endSeconds - startSeconds) × 30`

### 3. Subtitle System

| Check | Requirement |
|-------|-------------|
| Text accuracy | Subtitle text matches script 口播 field (always include for 口播 shots) |
| Position | `bottom: 240` (200px safe area + 40px gap) |
| Font size | 46px default |
| Color | #FFFFFF (white) |
| Text shadow | `2px 2px 6px rgba(0,0,0,0.95), 0 0 16px rgba(0,0,0,0.6)` |
| Background | None (Douyin native style with text shadow only) |
| Letter spacing | 1px for CJK readability |
| Fade in | 6 frames (0.2s at 30fps) |
| HTML entities | `&gt;` for `>`, `&lt;` for `<` |

### 4. Component Quality

| Check | Requirement |
|-------|-------------|
| Imports | `AbsoluteFill`, `useCurrentFrame` as needed |
| Component signature | `React.FC<{ subtitle?: string }>` |
| Shared components | Uses `Subtitle`, `Overlay`, `ScreenRecording` etc. from `../../../components/` |
| No inline magic numbers | Animations use named constants or reasonable defaults |
| Extrapolation | `interpolate` calls include `{ extrapolateRight: 'clamp' }` |

### 5. Animation Standards

| Parameter | Recommended Range |
|-----------|-------------------|
| Fade in/out | 10-15 frames |
| Spring damping | 10-15 |
| Spring stiffness | 80-100 |
| Scale range | 0 → 1 |
| Opacity range | 0 → 1 |

### 5.1 Animation Smoothness (CRITICAL — Prevent Jump/Flicker)

**This section catches animation jump/flicker issues where elements transition abruptly.**

| Check | Requirement | Common Bug |
|-------|-------------|------------|
| Boolean opacity | NEVER use `opacity: boolean ? 1 : 0` for element transitions | Causes sudden 0↔1 jump at threshold |
| Crossfade overlap | Adjacent elements should have overlapping opacity transitions | No overlap = momentary blank screen |
| Scale + opacity sync | Scale animation should align with opacity fade-in | Element appears small then grows |
| Transition windows | Use interpolate for smooth opacity, not ternary operators | Ternary creates hard cut |

**Red Flags to Check:**
1. **`opacity: showX ? 1 : 0` pattern** — indicates abrupt on/off switching
2. **Multiple elements controlled by same boolean threshold** — one ends when next begins = gap
3. **Scale from 0 while opacity jumps to 1** — element "pops in" at small size
4. **Adjacent interpolate ranges with no overlap** — e.g., `[0, 0.3]` and `[0.33, 0.6]` have 0.03 gap

**Pattern Detection — When to Flag Issues:**
- Shot has multiple elements that appear/disappear sequentially
- Code uses variables like `showFirst`, `showSecond`, `showThird` with boolean comparisons
- `interpolate` used for scale but `opacity` uses ternary operator
- Multiple `absolute` positioned divs in same container with opacity switching

**Correct Patterns:**
```tsx
// ❌ BAD: Boolean opacity causes jump
const showFirst = progress < 0.33
const showSecond = progress >= 0.33 && progress < 0.66
opacity: showFirst ? 1 : 0  // Jumps from 1 to 0 at progress=0.33
opacity: showSecond ? 1 : 0  // Jumps from 0 to 1 at progress=0.33

// ✅ GOOD: Smooth crossfade with overlap
const firstOpacity = interpolate(progress, [0, 0.28, 0.32], [1, 1, 0], { extrapolateRight: 'clamp' })
const secondOpacity = interpolate(progress, [0.30, 0.35, 0.62, 0.66], [0, 1, 1, 0], { extrapolateRight: 'clamp' })
// Note: 0.28-0.32 and 0.30-0.35 overlap = crossfade effect
```

**Auto-Fix Rules for Animation Jumps:**
- Replace `opacity: boolean ? 1 : 0` with `interpolate` based opacity
- Ensure adjacent opacity ranges overlap by 0.03-0.05 progress units
- If scale animates from 0, change to start from 0.7-0.8 for smoother entrance
- Keep total transition window under 0.1 progress units for snappy feel

### 6. Visual Consistency

| Check | Requirement |
|-------|-------------|
| Background | Consistent dark theme across shots (`#0a0a0a` or gradient) |
| Typography | Font sizes follow scale (see remotion-video skill) |
| Color palette | Consistent across shots (max 3-4 accent colors) |
| Spacing | 30-50px gaps, 32-60px padding |
| Border radius | 16-28px for modern look |

### 7. Visual Alignment (CRITICAL — Common Misalignment Bugs)

**This section catches visual misalignment issues where elements don't line up properly.**

| Check | Requirement | Common Bug |
|-------|-------------|------------|
| SVG lines with elements | SVG `x1/y1/x2/y2` must align with actual element positions | Hardcoded `%` values don't match flex layout positions |
| Absolute + Flex mixing | Avoid `position: absolute` with percentages in flex containers | Element moves but absolute positioning stays fixed |
| Flex center alignment | When centering with `justifyContent: 'center'`, SVG lines must use same center | SVG uses `50%` but element is at different percentage |
| Circular layout | Connection lines from exact center (width/2, height/2) | Lines calculated from different origin |
| Z-index layering | SVG lines behind elements they connect | Missing `zIndex` on elements |
| Text alignment | `textAlign: 'center'` elements should have centered connecting lines | Line endpoint not at text center |

**Red Flags to Check:**
1. **SVG with hardcoded percentages** (`x1="50%" y1="40%"`) in flex layouts — verify these match actual element positions
2. **`position: 'absolute'` with percentage `top/left/right/bottom`** — check if parent is flex container
3. **Circular layout** with manual position calculation — verify SVG lines use same math
4. **Connection lines without `zIndex` control** — elements may render behind/incorrectly
5. **Fixed pixel offsets in circular layouts** (e.g., `x - 80, y - 40`) — breaks with variable text length; use `transform: translate(-50%, -50%)` instead
6. **SVG as sibling overlay for connections** — should be child of anchor element, not container sibling
7. **SVG width doesn't match connected row width** — MUST calculate `rowWidth = sum(widths) + sum(gaps)` for coordinates to align

**Pattern Detection — When to Flag Issues:**
- Shot uses `<svg>` with `<line>` elements AND flex layout in same container
- Shot mixes `position: 'absolute'` with flex children
- Shot calculates positions with `Math.cos/sin` for circular arrangement
- Multiple positioning methods (flex, absolute, grid) in same shot

**Correct Patterns:**
```tsx
// GOOD: SVG fills container, lines align with flex-centered content
<svg style={{ position: 'absolute', width: '100%', height: '100%' }}>
  <line x1="540" y1="960" x2={teammateX} y2={teammateY} /> // Use pixels or consistent math
</svg>
<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
  <div style={{ width: 200, height: 200 }}>Centered at 540,960</div>
</div>

// GOOD: Circular layout with centered elements
const centerX = 300 + Math.cos(angle) * radius
const centerY = 300 + Math.sin(angle) * radius

<div style={{
  position: 'absolute',
  left: centerX,
  top: centerY,
  transform: 'translate(-50%, -50%)', // Centers element regardless of text length
}}>
  {variableLengthText}
</div>

// GOOD: Anchor-based SVG for connections
<div style={{ position: 'relative' }}> {/* Anchor element */}
  Anchor
  <svg style={{
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: '300px',
    height: '200px',
    zIndex: -1,
  }}>
    {/* Origin (0,0) = anchor center. Coordinates are simple offsets */}
    <line x1="150" y1="0" x2="50" y2="150" />  // To left target
    <line x1="150" y1="0" x2="250" y2="150" /> // To right target
  </svg>
</div>

// BAD: Hardcoded percentage that doesn't match flex position
<line x1="50%" y1="40%" ... /> // y1="40%" won't align with flex-centered content

// BAD: Fixed offset breaks with variable content
const x = centerX + Math.cos(angle) * radius - 80  // Assumes 160px width!
const y = centerY + Math.sin(angle) * radius - 40  // Assumes 80px height!

// BAD: SVG as container sibling tries to guess element positions
<div style={{ position: 'relative' }}>
  <svg style={{ position: 'absolute', width: '100%', height: '100%' }}>
    <line x1="50%" y1={60} x2="25%" y2={180} />  // Breaks when flex layout changes!
  </svg>
  <div>Anchor</div>
  <div>Target</div>
</div>
```

### 8. Root Registration

```tsx
// Must be registered in root.tsx
<Composition
  id="PascalCaseName"
  component={ComponentName}
  durationInFrames={totalFrames}
  fps={30}
  width={1080}
  height={1920}
  defaultProps={{}}
/>
```

## Output Format

```markdown
# Video Review: [Project Name]

## Code Review: [Pass/Minor/Critical]

### ✅ Passed Checks
- [Check that passed]

### ⚠️ Issues Found

#### [Severity: Critical/Major/Minor] — [Issue Description]
- **File**: `path/to/file.tsx:line`
- **Problem**: [What's wrong]
- **Fix**: [What to change]

### 🔍 Visual Alignment Check
- [SVG/Element alignment status]
- [If issues found, list specific misalignments with file:line]

## Script-to-Code Consistency: [Pass/Mismatch]
- Shot count: script X → code X ✅
- Timing: [details]
- Subtitles: [details]

## Auto-Fix Summary 🛠️
Applied X fixes:
- [Fix description]

## Render: [Rendered / Skipped]
- [If --render flag and pass]: File: path, size
- [If no --render flag]: Skipped (no flag). Run: /video-review <slug> --render
- [If critical issues]: Blocked (fix needed). Re-run: /video-review <slug> --render
```

## Auto-Fix Rules

**Auto-fix (apply directly):**
- **Layout: hand-written `padding: '120px 40px 200px'` → `<SafeArea>` wrapper**
- **Layout: content `bottom: <420>` literal → `SAFE_AREA.CONTENT_BOTTOM` (or move to `footer` slot of primitive)**
- **Layout: `left: x - <num>` / `top: y - <num>` centering → `transform: 'translate(-50%, -50%)'`**
- Timing calculation errors in SHOT_DURATIONS
- Subtitle text mismatches with script (use 口播 field)
- Missing `extrapolateRight: 'clamp'` in interpolate
- Wrong component imports (path errors)
- Missing Sequence wrapping in composition
- Safe area violations (content too close to edges)
- Root.tsx missing registration
- HTML entity issues in subtitles (`>` → `&gt;`)
- Font size below minimum (46px for subtitles)
- Subtitle position not at `bottom: 240`
- Subtitle using background box instead of text shadow
- Color/spacing inconsistencies between shots
- **Visual alignment: SVG lines with wrong percentage positions**
- **Visual alignment: Missing zIndex on elements that should be above SVG**
- **Visual alignment: Absolute positioning that conflicts with flex layout**
- **Animation smoothness: Boolean opacity (`opacity: bool ? 1 : 0`) causing jumps**

**Visual Alignment Fix Strategy:**
When detecting SVG/element misalignment:
1. Identify the positioning method used (flex, absolute, or calculated)
2. Calculate correct positions based on actual element sizes and container layout
3. Replace hardcoded percentages with pixel values or calculated positions
4. Add `zIndex` to ensure proper layering

**Ask user first:**
- Changing shot component type (e.g., ScreenRecording → SplitScreen)
- Adding/removing shots
- Major layout restructuring
- Changing animation style significantly
- Removing content
- **Visual alignment fixes that affect multiple interconnected elements**

**User override:** If user says "不要修改" or "我自己改", skip auto-fix.

## Fix Execution

1. After review, apply fixes using Edit tool on Remotion source files
2. For each fix: use exact text from file, replace with corrected version
3. Read file to confirm changes applied
4. Report: "✅ 已修复 X 个问题，代码已更新"

## Integration with Other Skills

This skill runs after `/remotion-video`:
1. `/video-script` → generates `script.md`
2. `/script-review` → fact-checks script content
3. `/remotion-video` → generates Remotion code (preview only, NO render)
4. `/video-review` → **this skill** — reviews code and auto-fixes
5. `/video-review <slug> --render` — same as above + auto-render MP4 if pass

If `script-review` found issues, verify those were fixed before reviewing Remotion code.
