#!/usr/bin/env bash
# Renames SFX files to taxonomy format: mood-action-intensity.mp3
# Usage: bash scripts/rename-sfx.sh <source-dir> <dest-dir>
# Interactive: prompts for mood/action/intensity for each file

SRC_DIR="${1:?Usage: rename-sfx.sh <source-dir> <dest-dir>}"
DEST_DIR="${2:?Usage: rename-sfx.sh <source-dir> <dest-dir>}"

mkdir -p "$DEST_DIR"

for file in "$SRC_DIR"/*.mp3; do
  [ -f "$file" ] || continue
  basename=$(basename "$file")

  echo "📁 $basename"
  read -p "   mood (energetic/calm/tense/playful/epic/neutral): " mood
  read -p "   action (transition/emphasis/entry/exit/ambient/feedback): " action
  read -p "   intensity (subtle/medium/strong): " intensity

  new_name="${mood}-${action}-${intensity}.mp3"
  cp "$file" "$DEST_DIR/$new_name"
  echo "   → $new_name"
  echo ""
done

echo "✅ Renamed $(ls "$DEST_DIR"/*.mp3 2>/dev/null | wc -l | tr -d ' ') files to $DEST_DIR"
