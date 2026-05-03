from __future__ import annotations

import json
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

LIMITS = {"max_reference": 50, "max_stock": 30, "max_total_mb": 200}


@dataclass
class Manifest:
    topic: str
    english_keywords: list[str]
    items: list[dict[str, Any]] = field(default_factory=list)
    skipped: list[dict[str, Any]] = field(default_factory=list)

    def stats(self) -> dict[str, int | float]:
        ref = sum(1 for it in self.items if it.get("category") == "reference")
        stk = sum(1 for it in self.items if it.get("category") == "stock")
        tav = sum(1 for it in self.items if it.get("source") == "tavily")
        art = sum(1 for it in self.items if it.get("source") == "article")
        pix_img = sum(
            1
            for it in self.items
            if it.get("source") == "pixabay" and it.get("type") == "image"
        )
        pix_vid = sum(
            1
            for it in self.items
            if it.get("source") == "pixabay" and it.get("type") == "video"
        )
        total_bytes = sum(it.get("size_bytes", 0) for it in self.items)
        return {
            "reference_count": ref,
            "stock_count": stk,
            "total_size_mb": round(total_bytes / 1024 / 1024, 2),
            "tavily_count": tav,
            "article_count": art,
            "pixabay_image_count": pix_img,
            "pixabay_video_count": pix_vid,
            "skipped": len(self.skipped),
        }


def write_manifest(path: Path, manifest: Manifest) -> None:
    payload = {
        "generated_at": datetime.now(timezone.utc)
        .astimezone()
        .isoformat(timespec="seconds"),
        "topic": manifest.topic,
        "english_keywords": manifest.english_keywords,
        "limits": LIMITS,
        "stats": manifest.stats(),
        "items": manifest.items,
        "skipped": manifest.skipped,
    }
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8"
    )


def read_manifest(path: Path) -> Manifest:
    raw = json.loads(path.read_text(encoding="utf-8"))
    return Manifest(
        topic=raw["topic"],
        english_keywords=raw["english_keywords"],
        items=raw.get("items", []),
        skipped=raw.get("skipped", []),
    )
