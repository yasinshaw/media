from __future__ import annotations

from pathlib import Path

from .manifest import Manifest

SECTION_HEADER = "## 视觉素材清单"


def append_visual_section(research_md: Path, manifest: Manifest) -> None:
    text = (
        research_md.read_text(encoding="utf-8") if research_md.exists() else ""
    )
    if SECTION_HEADER in text:
        return

    refs = [it for it in manifest.items if it.get("category") == "reference"]
    stocks = [it for it in manifest.items if it.get("category") == "stock"]

    lines = [
        "",
        SECTION_HEADER,
        "",
        "> 已下载到 `assets/research/`，详见 `manifest.json`",
        "",
        "### 参考素材 (`research/reference/` — 外部版权，仅作脚本写作参考)",
    ]
    if refs:
        for it in refs:
            local = it["local_path"].rsplit("/", 1)[-1]
            page = it.get("page_url", "")
            title = it.get("page_title", page or "来源页")
            alt = it.get("alt") or ""
            extra = f' — alt: "{alt}"' if alt else ""
            lines.append(f"- `{local}`{extra} — [{title}]({page})")
    else:
        lines.append("- (无)")

    lines += ["", "### 可用素材 (`research/stock/` — Pixabay 免费可商用)"]
    if stocks:
        for it in stocks:
            local = it["local_path"].rsplit("/", 1)[-1]
            tags = ", ".join(it.get("tags", []))
            page = it.get("page_url", "")
            lines.append(f"- `{local}` — tags: {tags} — [Pixabay 页面]({page})")
    else:
        lines.append("- (无)")

    lines += [
        "",
        "### 跳过项",
        f"- 共 {len(manifest.skipped)} 项被跳过。详见 `manifest.json`",
        "",
    ]

    research_md.write_text(
        text.rstrip() + "\n" + "\n".join(lines) + "\n",
        encoding="utf-8",
    )
