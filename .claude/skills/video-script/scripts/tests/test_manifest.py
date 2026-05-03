from pathlib import Path
import json
from collect_research_assets.manifest import write_manifest, read_manifest, Manifest


def test_manifest_roundtrip(tmp_path):
    manifest = Manifest(
        topic="\u6d4b\u8bd5\u4e3b\u9898",
        english_keywords=["AI", "robot"],
        items=[],
        skipped=[],
    )
    path = tmp_path / "manifest.json"
    write_manifest(path, manifest)
    loaded = read_manifest(path)
    assert loaded.topic == "\u6d4b\u8bd5\u4e3b\u9898"
    assert loaded.english_keywords == ["AI", "robot"]
    assert loaded.stats()["reference_count"] == 0


def test_manifest_required_fields(tmp_path):
    manifest = Manifest(topic="x", english_keywords=[], items=[], skipped=[])
    path = tmp_path / "manifest.json"
    write_manifest(path, manifest)
    raw = json.loads(path.read_text())
    for key in ("generated_at", "topic", "english_keywords", "limits", "stats", "items", "skipped"):
        assert key in raw
