from pathlib import Path

from collect_research_assets.keywords import (
    read_cached_keywords,
    append_keywords_section,
    parse_llm_response,
)


def test_read_cached_keywords_present(tmp_path):
    md = tmp_path / "research.md"
    md.write_text(
        "# Research\n\n"
        "## 视觉素材英文关键词\n"
        "- AI model\n"
        "- neural network\n"
        "- benchmark\n\n"
        "## 其他章节\n"
    )
    assert read_cached_keywords(md) == ["AI model", "neural network", "benchmark"]


def test_read_cached_keywords_absent(tmp_path):
    md = tmp_path / "research.md"
    md.write_text("# Research\n\n没有缓存\n")
    assert read_cached_keywords(md) is None


def test_read_cached_keywords_missing_file(tmp_path):
    md = tmp_path / "nonexistent.md"
    assert read_cached_keywords(md) is None


def test_append_keywords_section(tmp_path):
    md = tmp_path / "research.md"
    md.write_text("# Research\n")
    append_keywords_section(md, ["x", "y"])
    content = md.read_text()
    assert "## 视觉素材英文关键词" in content
    assert "- x\n- y" in content


def test_append_keywords_idempotent(tmp_path):
    md = tmp_path / "research.md"
    md.write_text("# Research\n")
    append_keywords_section(md, ["x", "y"])
    append_keywords_section(md, ["x", "y"])
    content = md.read_text()
    assert content.count("## 视觉素材英文关键词") == 1


def test_append_keywords_creates_file(tmp_path):
    md = tmp_path / "new.md"
    assert not md.exists()
    append_keywords_section(md, ["alpha"])
    assert md.exists()
    assert "- alpha" in md.read_text()


def test_parse_llm_response_csv():
    assert parse_llm_response("AI model, neural network, robot") == [
        "AI model",
        "neural network",
        "robot",
    ]


def test_parse_llm_response_strips_quotes():
    assert parse_llm_response('"AI model", "robot"') == ["AI model", "robot"]


def test_parse_llm_response_empty():
    assert parse_llm_response("") == []
    assert parse_llm_response("  ") == []


def test_parse_llm_response_single():
    assert parse_llm_response("AI model") == ["AI model"]
