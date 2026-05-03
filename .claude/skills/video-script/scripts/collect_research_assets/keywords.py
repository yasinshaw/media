"""Keyword cache and LLM response parsing for research assets.

Caches English visual-asset keywords in research.md so they can be
reused across pipeline runs without re-querying the LLM.
"""
from __future__ import annotations

import re
from pathlib import Path

SECTION_HEADER = "## 视觉素材英文关键词"


def read_cached_keywords(research_md: Path) -> list[str] | None:
    """Read cached keywords from a research markdown file.

    Returns None if the file does not exist or has no keywords section.
    """
    if not research_md.exists():
        return None
    text = research_md.read_text(encoding="utf-8")
    pattern = rf"{re.escape(SECTION_HEADER)}\s*\n((?:- .+\n?)+)"
    match = re.search(pattern, text)
    if not match:
        return None
    lines = match.group(1).strip().splitlines()
    return [ln[2:].strip() for ln in lines if ln.startswith("- ")]


def append_keywords_section(research_md: Path, keywords: list[str]) -> None:
    """Append a keywords section to the research file (idempotent).

    Does nothing if the section already exists.
    """
    text = research_md.read_text(encoding="utf-8") if research_md.exists() else ""
    if SECTION_HEADER in text:
        return
    block = (
        f"\n\n{SECTION_HEADER}\n"
        + "\n".join(f"- {k}" for k in keywords)
        + "\n"
    )
    research_md.write_text(text + block, encoding="utf-8")


def parse_llm_response(text: str) -> list[str]:
    """Parse a comma-separated LLM response into a list of keywords.

    Strips surrounding quotes and whitespace from each keyword.
    """
    cleaned = text.strip().strip("\"'")
    if not cleaned:
        return []
    parts = [p.strip().strip("\"'") for p in cleaned.split(",")]
    return [p for p in parts if p]
