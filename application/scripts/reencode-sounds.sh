#!/bin/bash
# Re-encode seed MP3 files to 128kbps to reduce file size.
# Usage: ./scripts/reencode-sounds.sh

set -euo pipefail

SOUNDS_DIR="$(dirname "$0")/../public/sounds"

for mp3 in "$SOUNDS_DIR"/*.mp3; do
  [ -f "$mp3" ] || continue

  tmp="${mp3}.tmp.mp3"
  echo "re-encoding: $(basename "$mp3")"
  ffmpeg -i "$mp3" \
    -b:a 128k \
    -loglevel warning \
    -y \
    "$tmp"
  mv "$tmp" "$mp3"
done

echo "done"
