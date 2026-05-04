const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "AI News";
pres.title = "DeepSeek V4：国产大模型的新王炸";

// === Color Palette (Dark Tech Style) ===
const BG = "0B1120";
const BG_CARD = "131B2E";
const CYAN = "06D6A0";
const GOLD = "FFD166";
const WHITE = "FFFFFF";
const GRAY = "94A3B8";
const RED_ACCENT = "EF4444";
const BLUE_ACCENT = "3B82F6";

// Helper: fresh shadow each call
const cardShadow = () => ({ type: "outer", blur: 8, offset: 2, angle: 135, color: "000000", opacity: 0.3 });

// ============================
// SLIDE 1 — Title (Hook)
// ============================
let s1 = pres.addSlide();
s1.background = { color: BG };

// Big title
s1.addText("DeepSeek V4", {
  x: 0.5, y: 1.2, w: 9, h: 2,
  fontSize: 54, fontFace: "Arial", color: WHITE, bold: true, align: "center", valign: "middle",
});

// Subtitle
s1.addText("国产大模型的新王炸", {
  x: 1, y: 3.2, w: 8, h: 0.8,
  fontSize: 28, fontFace: "Arial", color: CYAN, align: "center", valign: "middle",
});

// Bottom stat
s1.addText("1.6万亿参数  |  最大开源模型  |  性价比之王", {
  x: 1, y: 4.5, w: 8, h: 0.6,
  fontSize: 16, fontFace: "Arial", color: GRAY, align: "center", valign: "middle",
});

// Accent line
s1.addShape(pres.shapes.RECTANGLE, {
  x: 3.5, y: 4.1, w: 3, h: 0.04, fill: { color: CYAN },
});

// ============================
// SLIDE 2 — Price vs Performance
// ============================
let s2 = pres.addSlide();
s2.background = { color: BG };

s2.addText("性能逼近，价格仅 1/6", {
  x: 0.5, y: 0.3, w: 9, h: 0.7,
  fontSize: 28, fontFace: "Arial", color: WHITE, bold: true, align: "center",
});
s2.addShape(pres.shapes.RECTANGLE, {
  x: 3.5, y: 1.0, w: 3, h: 0.03, fill: { color: CYAN },
});

// Performance comparison bars (left: US models, right: DeepSeek)
const barData = [
  { label: "GPT-5.5", val: 0.95, color: BLUE_ACCENT, price: "$10/M" },
  { label: "Claude Opus 4.7", val: 0.92, color: BLUE_ACCENT, price: "$15/M" },
  { label: "DeepSeek V4 Pro", val: 0.90, color: CYAN, price: "$1.74/M" },
  { label: "DeepSeek V4 Flash", val: 0.85, color: CYAN, price: "$0.14/M" },
];

barData.forEach((item, i) => {
  const y = 1.4 + i * 0.9;
  // Label
  s2.addText(item.label, {
    x: 0.5, y, w: 2.2, h: 0.35,
    fontSize: 13, fontFace: "Arial", color: WHITE, align: "right", valign: "middle",
  });
  // Bar background
  s2.addShape(pres.shapes.RECTANGLE, {
    x: 2.9, y: y + 0.05, w: 5, h: 0.25,
    fill: { color: "1E293B" },
  });
  // Bar fill
  s2.addShape(pres.shapes.RECTANGLE, {
    x: 2.9, y: y + 0.05, w: 5 * item.val, h: 0.25,
    fill: { color: item.color },
  });
  // Price tag
  s2.addText(item.price, {
    x: 8.2, y, w: 1.3, h: 0.35,
    fontSize: 12, fontFace: "Arial", color: GOLD, align: "left", valign: "middle",
  });
});

// Bottom note
s2.addText("性能数据综合多个基准测试，价格为每百万token输入成本", {
  x: 0.5, y: 4.8, w: 9, h: 0.4,
  fontSize: 10, fontFace: "Arial", color: GRAY, align: "center",
});

// ============================
// SLIDE 3 — Architecture: 1.6T Params
// ============================
let s3 = pres.addSlide();
s3.background = { color: BG };

s3.addText("1.6 万亿参数  ·  MoE 架构", {
  x: 0.5, y: 0.3, w: 9, h: 0.7,
  fontSize: 28, fontFace: "Arial", color: WHITE, bold: true, align: "center",
});
s3.addShape(pres.shapes.RECTANGLE, {
  x: 3.5, y: 1.0, w: 3, h: 0.03, fill: { color: CYAN },
});

// Big number
s3.addText("1.6T", {
  x: 0.5, y: 1.3, w: 4, h: 2,
  fontSize: 72, fontFace: "Arial", color: GOLD, bold: true, align: "center", valign: "middle",
});
s3.addText("总参数量", {
  x: 0.5, y: 3.1, w: 4, h: 0.5,
  fontSize: 16, fontFace: "Arial", color: GRAY, align: "center",
});

// Right side: MoE diagram
s3.addShape(pres.shapes.RECTANGLE, {
  x: 5, y: 1.3, w: 4.5, h: 2.5,
  fill: { color: BG_CARD }, shadow: cardShadow(),
});

s3.addText("MoE 混合专家架构", {
  x: 5.2, y: 1.4, w: 4.1, h: 0.5,
  fontSize: 16, fontFace: "Arial", color: WHITE, bold: true,
});

s3.addText([
  { text: "总参数: 1.6 万亿", options: { breakLine: true, fontSize: 13, color: GRAY } },
  { text: "每次推理仅激活: ", options: { breakLine: false, fontSize: 13, color: GRAY } },
  { text: "490 亿", options: { fontSize: 13, color: CYAN, bold: true } },
  { text: "", options: { breakLine: true } },
  { text: "既大又省，推理成本极低", options: { breakLine: true, fontSize: 12, color: GRAY } },
  { text: "", options: { breakLine: true } },
  { text: "100 万 token 上下文窗口", options: { breakLine: true, fontSize: 14, color: GOLD, bold: true } },
  { text: "一整本《三体》一次读完", options: { fontSize: 12, color: GRAY } },
], {
  x: 5.4, y: 2.0, w: 3.9, h: 1.6,
});

// ============================
// SLIDE 4 — Domestic Benchmarks
// ============================
let s4 = pres.addSlide();
s4.background = { color: BG };

s4.addText("国内大模型跑分擂台", {
  x: 0.5, y: 0.3, w: 9, h: 0.7,
  fontSize: 28, fontFace: "Arial", color: WHITE, bold: true, align: "center",
});
s4.addShape(pres.shapes.RECTANGLE, {
  x: 3.5, y: 1.0, w: 3, h: 0.03, fill: { color: CYAN },
});

// SWE-Bench
s4.addShape(pres.shapes.RECTANGLE, {
  x: 0.5, y: 1.3, w: 9, h: 1.1,
  fill: { color: BG_CARD }, shadow: cardShadow(),
});
s4.addText("SWE-Bench 代码实战", {
  x: 0.7, y: 1.35, w: 4, h: 0.35,
  fontSize: 14, fontFace: "Arial", color: WHITE, bold: true,
});
s4.addText([
  { text: "Kimi K2.5", options: { bold: true, color: GOLD } },
  { text: "  76.8%（最强）     ", options: { color: GOLD } },
  { text: "DeepSeek V4", options: { bold: true, color: CYAN } },
  { text: "  55.4%     ", options: { color: CYAN } },
  { text: "MiniMax M2.7", options: { color: GRAY } },
  { text: "  56.2%", options: { color: GRAY } },
], {
  x: 0.7, y: 1.75, w: 8.5, h: 0.5,
  fontSize: 13, fontFace: "Arial",
});

// HumanEval
s4.addShape(pres.shapes.RECTANGLE, {
  x: 0.5, y: 2.6, w: 9, h: 1.1,
  fill: { color: BG_CARD }, shadow: cardShadow(),
});
s4.addText("HumanEval 编程", {
  x: 0.7, y: 2.65, w: 4, h: 0.35,
  fontSize: 14, fontFace: "Arial", color: WHITE, bold: true,
});
s4.addText([
  { text: "DeepSeek V4", options: { bold: true, color: GOLD } },
  { text: "  76.8%（追平一线）     ", options: { color: GOLD } },
  { text: "V3.2 旧版", options: { color: GRAY } },
  { text: "  62.8%（↑ +14pt）", options: { color: GRAY } },
], {
  x: 0.7, y: 3.05, w: 8.5, h: 0.5,
  fontSize: 13, fontFace: "Arial",
});

// Math
s4.addShape(pres.shapes.RECTANGLE, {
  x: 0.5, y: 3.9, w: 9, h: 1.0,
  fill: { color: BG_CARD }, shadow: cardShadow(),
});
s4.addText("数学推理", {
  x: 0.7, y: 3.95, w: 4, h: 0.35,
  fontSize: 14, fontFace: "Arial", color: WHITE, bold: true,
});
s4.addText([
  { text: "DeepSeek V4", options: { bold: true, color: GOLD } },
  { text: "  领先国产同侪", options: { color: GOLD } },
], {
  x: 0.7, y: 4.3, w: 8.5, h: 0.4,
  fontSize: 13, fontFace: "Arial",
});

// Bottom summary
s4.addText("V4 最大优势 = 最大开源 + 最便宜 + 数学最强", {
  x: 0.5, y: 5.0, w: 9, h: 0.4,
  fontSize: 13, fontFace: "Arial", color: CYAN, align: "center", bold: true,
});

// ============================
// SLIDE 5 — International Benchmarks
// ============================
let s5 = pres.addSlide();
s5.background = { color: BG };

s5.addText("国际擂台：V4 vs 世界顶级", {
  x: 0.5, y: 0.3, w: 9, h: 0.7,
  fontSize: 28, fontFace: "Arial", color: WHITE, bold: true, align: "center",
});
s5.addShape(pres.shapes.RECTANGLE, {
  x: 3.5, y: 1.0, w: 3, h: 0.03, fill: { color: CYAN },
});

// Three cards side by side
const intlData = [
  { title: "BrowseComp", val: "83.4%", cmp: "超 Claude Opus 4.7\n(79.3%)", win: true },
  { title: "SWE-Bench", val: "55.4%", cmp: "接近 GPT-5.5\n(58.6%)", win: false },
  { title: "数学推理", val: "超越 GPT-5", cmp: "搜索+数学\n世界第一梯队", win: true },
];

intlData.forEach((item, i) => {
  const x = 0.5 + i * 3.2;
  s5.addShape(pres.shapes.RECTANGLE, {
    x, y: 1.3, w: 2.9, h: 3.0,
    fill: { color: BG_CARD }, shadow: cardShadow(),
  });
  // Accent top bar
  s5.addShape(pres.shapes.RECTANGLE, {
    x, y: 1.3, w: 2.9, h: 0.06,
    fill: { color: item.win ? CYAN : GOLD },
  });
  s5.addText(item.title, {
    x: x + 0.15, y: 1.5, w: 2.6, h: 0.5,
    fontSize: 15, fontFace: "Arial", color: WHITE, bold: true, align: "center",
  });
  s5.addText(item.val, {
    x: x + 0.15, y: 2.2, w: 2.6, h: 0.7,
    fontSize: 32, fontFace: "Arial", color: item.win ? CYAN : GOLD, bold: true, align: "center",
  });
  s5.addText(item.cmp, {
    x: x + 0.15, y: 3.1, w: 2.6, h: 0.8,
    fontSize: 12, fontFace: "Arial", color: GRAY, align: "center",
  });
});

// ============================
// SLIDE 6 — Pricing Revolution
// ============================
let s6 = pres.addSlide();
s6.background = { color: BG };

s6.addText("价格革命：AI 的性价比天花板", {
  x: 0.5, y: 0.3, w: 9, h: 0.7,
  fontSize: 28, fontFace: "Arial", color: WHITE, bold: true, align: "center",
});
s6.addShape(pres.shapes.RECTANGLE, {
  x: 3.5, y: 1.0, w: 3, h: 0.03, fill: { color: CYAN },
});

// Price comparison table
const priceData = [
  { name: "DeepSeek V4 Flash", price: "$0.14", per: "1x", color: CYAN, highlight: true },
  { name: "GPT-5.4 Nano", price: "$0.20", per: "1.4x", color: GOLD, highlight: false },
  { name: "Claude Haiku 4.5", price: "$1.00", per: "7x", color: RED_ACCENT, highlight: false },
  { name: "DeepSeek V4 Pro", price: "$1.74", per: "12x", color: CYAN, highlight: true },
  { name: "GPT-5.5", price: "$10.00", per: "71x", color: RED_ACCENT, highlight: false },
  { name: "Claude Opus 4.7", price: "$15.00", per: "107x", color: RED_ACCENT, highlight: false },
];

priceData.forEach((item, i) => {
  const y = 1.3 + i * 0.65;
  // Row bg
  s6.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y, w: 9, h: 0.55,
    fill: { color: i % 2 === 0 ? BG_CARD : "0F172A" },
  });
  // Color accent
  s6.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y, w: 0.06, h: 0.55,
    fill: { color: item.color },
  });
  // Name
  s6.addText(item.name, {
    x: 0.7, y, w: 3.5, h: 0.55,
    fontSize: 14, fontFace: "Arial", color: WHITE, valign: "middle",
  });
  // Price
  s6.addText(item.price, {
    x: 4.5, y, w: 2, h: 0.55,
    fontSize: 16, fontFace: "Arial", color: item.color, bold: true, valign: "middle", align: "center",
  });
  // Unit
  s6.addText("/M tokens", {
    x: 6.3, y, w: 1.5, h: 0.55,
    fontSize: 10, fontFace: "Arial", color: GRAY, valign: "middle",
  });
  // Multiplier
  if (!item.highlight) {
    s6.addText(item.per + " 更贵", {
      x: 7.8, y, w: 1.5, h: 0.55,
      fontSize: 11, fontFace: "Arial", color: GRAY, valign: "middle", align: "right",
    });
  } else {
    s6.addText("✓ 最便宜", {
      x: 7.8, y, w: 1.5, h: 0.55,
      fontSize: 11, fontFace: "Arial", color: CYAN, valign: "middle", align: "right", bold: true,
    });
  }
});

// Bottom insight
s6.addText("V4 Flash 比 GPT-5.4 Nano 还便宜，Pro 版也只要 $1.74", {
  x: 0.5, y: 5.0, w: 9, h: 0.4,
  fontSize: 13, fontFace: "Arial", color: GOLD, align: "center",
});

// ============================
// SLIDE 7 — CTA / Closing
// ============================
let s7 = pres.addSlide();
s7.background = { color: BG };

s7.addText("DeepSeek V4", {
  x: 0.5, y: 0.8, w: 9, h: 1.2,
  fontSize: 44, fontFace: "Arial", color: WHITE, bold: true, align: "center", valign: "middle",
});

s7.addShape(pres.shapes.RECTANGLE, {
  x: 3.5, y: 2.0, w: 3, h: 0.04, fill: { color: CYAN },
});

// Four tags
const tags = ["开源最大", "价格最低", "数学领先", "性价比之王"];
tags.forEach((tag, i) => {
  const x = 0.8 + i * 2.25;
  s7.addShape(pres.shapes.RECTANGLE, {
    x, y: 2.4, w: 2.0, h: 0.6,
    fill: { color: BG_CARD }, shadow: cardShadow(),
  });
  s7.addShape(pres.shapes.RECTANGLE, {
    x, y: 2.4, w: 0.06, h: 0.6,
    fill: { color: CYAN },
  });
  s7.addText(tag, {
    x: x + 0.15, y: 2.4, w: 1.75, h: 0.6,
    fontSize: 14, fontFace: "Arial", color: WHITE, align: "center", valign: "middle",
  });
});

// CTA
s7.addText("重新定义 AI 的性价比天花板", {
  x: 1, y: 3.5, w: 8, h: 0.6,
  fontSize: 18, fontFace: "Arial", color: GOLD, align: "center", bold: true,
});

s7.addText("关注了解更多 AI 前沿", {
  x: 1, y: 4.3, w: 8, h: 0.5,
  fontSize: 14, fontFace: "Arial", color: GRAY, align: "center",
});

// === Save ===
const outPath = process.env.HOME + "/code/media/projects/2026-04-25-deepseek-v4/output/deepseek-v4.pptx";
pres.writeFile({ fileName: outPath }).then(() => {
  console.log("PPTX saved to: " + outPath);
}).catch(err => {
  console.error("Error:", err);
});
