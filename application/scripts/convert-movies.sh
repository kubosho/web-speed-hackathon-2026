#!/bin/bash
# Convert seed GIF files to MP4 (H.264) with faststart for progressive playback.
# Usage: ./scripts/convert-movies.sh

set -euo pipefail

MOVIES_DIR="$(dirname "$0")/../public/movies"

for gif in "$MOVIES_DIR"/*.gif; do
  [ -f "$gif" ] || continue

  mp4="${gif%.gif}.mp4"

  if [ -f "$mp4" ]; then
    echo "skip: $(basename "$mp4") already exists"
    continue
  fi

  echo "converting: $(basename "$gif") → $(basename "$mp4")"
  ffmpeg -i "$gif" \
    -c:v libx264 \
    -pix_fmt yuv420p \
    -movflags +faststart \
    -an \
    -loglevel warning \
    "$mp4"
done

echo "done"
