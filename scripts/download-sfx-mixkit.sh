#!/bin/bash
# Download SFX from Mixkit preview CDN and rename to taxonomy format.
# Usage: bash scripts/download-sfx-mixkit.sh

set -euo pipefail
SFX_DIR="$(cd "$(dirname "$0")/../remotion/public/audio/sfx" && pwd)"
BASE="https://assets.mixkit.co/active_storage/sfx"

# id|taxonomy_name mapping
DOWNLOADS=(
  # Transitions
  "1485|calm-transition-medium.mp3"
  "2350|playful-transition-medium.mp3"
  "1490|epic-transition-medium.mp3"
  "1492|neutral-transition-strong.mp3"
  "1489|energetic-transition-strong.mp3"

  # Emphasis
  "2047|energetic-emphasis-medium.mp3"
  "2112|calm-emphasis-medium.mp3"
  "756|tense-emphasis-medium.mp3"
  "565|epic-emphasis-medium.mp3"
  "2108|neutral-emphasis-medium.mp3"
  "487|energetic-emphasis-strong.mp3"
  "788|tense-emphasis-strong.mp3"
  "2145|epic-emphasis-strong.mp3"
  "2573|calm-emphasis-strong.mp3"
  "746|playful-emphasis-strong.mp3"

  # Feedback
  "1108|neutral-feedback-medium.mp3"
  "2575|energetic-feedback-medium.mp3"
  "1107|calm-feedback-medium.mp3"
  "1109|calm-feedback-subtle.mp3"
  "2576|epic-feedback-medium.mp3"

  # Entry
  "2918|energetic-entry-medium.mp3"
  "1491|epic-entry-medium.mp3"
  "2650|tense-entry-medium.mp3"
  "170|calm-entry-medium.mp3"

  # Ambient
  "2636|calm-ambient-subtle.mp3"
  "2742|energetic-ambient-subtle.mp3"
  "2743|tense-ambient-subtle.mp3"
  "2745|epic-ambient-subtle.mp3"
)

downloaded=0
skipped=0
failed=0

for entry in "${DOWNLOADS[@]}"; do
  id="${entry%%|*}"
  name="${entry##*|}"
  dest="$SFX_DIR/$name"

  if [ -f "$dest" ] && [ "$(stat -f%z "$dest" 2>/dev/null || echo 0)" -gt 5000 ]; then
    echo "[skip] $name ($(stat -f%z "$dest") bytes)"
    skipped=$((skipped + 1))
    continue
  fi

  url="$BASE/$id/$id-preview.mp3"
  printf "[dl]   %-40s <- %s ... " "$name" "$id"
  http_code=$(curl -sL -w '%{http_code}' -o "$dest" "$url")
  size=$(stat -f%z "$dest" 2>/dev/null || echo 0)

  if [ "$http_code" = "200" ] && [ "$size" -gt 5000 ]; then
    echo "OK (${size} bytes)"
    downloaded=$((downloaded + 1))
  else
    rm -f "$dest"
    echo "FAIL (HTTP $http_code, ${size} bytes)"
    failed=$((failed + 1))
  fi
done

echo ""
echo "Downloaded: $downloaded, Skipped: $skipped, Failed: $failed"
