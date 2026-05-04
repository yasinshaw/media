#!/usr/bin/env bash
# Regenerates SFX_AVAILABLE_FILES in constants.ts from taxonomy-named files only.
# Files matching the pattern {mood}-{action}-{intensity}.mp3 are included.
# Legacy-named files (e.g., impact.mp3) are excluded.
# Usage: bash scripts/update-sfx-manifest.sh

SFX_DIR="remotion/public/audio/sfx"
CONSTANTS_FILE="remotion/src/components/constants.ts"

if [ ! -d "$SFX_DIR" ]; then
  echo "❌ Directory not found: $SFX_DIR"
  exit 1
fi

# Only include taxonomy-named files (contain two hyphens in the stem)
files=$(find "$SFX_DIR" -name '*.mp3' | while read f; do
  basename=$(basename "$f" .mp3)
  # Count hyphens: taxonomy names have exactly 2 (mood-action-intensity)
  count=$(echo "$basename" | tr -cd '-' | wc -c | tr -d ' ')
  if [ "$count" -eq 2 ]; then
    echo "$basename.mp3"
  fi
done | sort)

if [ -z "$files" ]; then
  echo "⚠️ No taxonomy-named SFX files found in $SFX_DIR"
  exit 0
fi

# Build the array entries
entries=""
while IFS= read -r f; do
  entries="${entries}  '${f}',\n"
done <<< "$files"

# Use Python for reliable file editing
python3 << PYEOF
import re

entries = """$(echo -e "$entries")"""

with open('$CONSTANTS_FILE', 'r') as f:
    content = f.read()

pattern = r'(export const SFX_AVAILABLE_FILES: string\[\] = \[).*?(\])'
new_block = r'\g<1>\n' + entries + r'\2'

result = re.sub(pattern, new_block, content, flags=re.DOTALL)

with open('$CONSTANTS_FILE', 'w') as f:
    f.write(result)

count = len(entries.strip().split(','))
print(f"✅ Updated SFX_AVAILABLE_FILES with {count} taxonomy-named files")
PYEOF
