from __future__ import annotations

from pathlib import Path
from urllib.parse import urlparse

VIDEO_EXTS = {".mp4", ".webm", ".mov"}
IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp"}


def next_id(prefix: str, used_ids: set[str]) -> str:
    """Generate a unique zero-padded ID like 'tavily-001', skipping any already in used_ids."""
    n = 1
    while True:
        candidate = f"{prefix}-{n:03d}"
        if candidate not in used_ids:
            return candidate
        n += 1


def extension_from_url(url: str, default: str = ".jpg") -> str:
    """Extract a normalized file extension from a URL.

    Only recognizes known video/image extensions; falls back to *default* otherwise.
    """
    path = urlparse(url).path.lower()
    if "." in path:
        ext = "." + path.rsplit(".", 1)[1].split("?")[0]
        if ext in VIDEO_EXTS or ext in IMAGE_EXTS:
            return ext
    return default


def build_local_path(base: Path, category: str, item_id: str, ext: str) -> Path:
    """Build a local file path: ``base / category / item_id + ext``."""
    return base / category / f"{item_id}{ext}"
