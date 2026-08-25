#!/usr/bin/env bash
# build-mascot-webp.sh
#
# Produce the in-app Specs mascot assets from the approved clip masters:
#   assets/mascot/webp/specs-{wave,idle-loop,backflip,shy-blush,inspecting}.webp
#     - animated WebP with alpha, 480x480, 12fps (decimated from 24), q70
#     - play-once vs loop is BAKED INTO each file via the WebP loop count:
#         idle-loop / inspecting  -> -loop 0  (infinite)
#         wave / backflip / shy-blush -> -loop 1 (play once, hold last frame)
#   assets/mascot/specs-standing.png
#     - trimmed transparent static cutout (idle frame 1), for the spots that
#       previously showed the static detective.png
#
# Alpha is recovered by two-background difference matting (see
# scripts/media/mascot-transparent-matte.py): each clip exists as a cream-background
# master (specs-<clip>.mp4) and a black-composited background-removed version
# (specs-<clip>-nobg.mp4); the pair solves an exact matte.
#
# Requires: ffmpeg on PATH (or set FFMPEG), python with numpy+PIL.
# Run from anywhere: paths resolve relative to the repo root.
set -euo pipefail

cd "$(dirname "$0")/../.."
FFMPEG="${FFMPEG:-ffmpeg}"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

declare -A LOOPS=( [idle-loop]=0 [inspecting]=0 [wave]=1 [backflip]=1 [shy-blush]=1 )

mkdir -p assets/mascot/webp

for c in wave idle-loop backflip shy-blush inspecting; do
  echo "=== $c ==="
  mkdir -p "$TMP/$c/master" "$TMP/$c/nobg" "$TMP/$c/rgba"
  "$FFMPEG" -y -loglevel error -i "assets/mascot/specs-$c.mp4"      "$TMP/$c/master/%04d.png"
  "$FFMPEG" -y -loglevel error -i "assets/mascot/specs-$c-nobg.mp4" "$TMP/$c/nobg/%04d.png"
  python scripts/media/mascot-transparent-matte.py "$TMP/$c/master" "$TMP/$c/nobg" "$TMP/$c/rgba"
  "$FFMPEG" -y -loglevel error -framerate 24 -i "$TMP/$c/rgba/%04d.png" \
    -vf "fps=12,scale=480:480:flags=lanczos" \
    -c:v libwebp_anim -lossless 0 -q:v 70 -compression_level 6 \
    -loop "${LOOPS[$c]}" -an \
    "assets/mascot/webp/specs-$c.webp"
  echo "  -> assets/mascot/webp/specs-$c.webp ($(du -h "assets/mascot/webp/specs-$c.webp" | cut -f1))"
done

# Static standing pose for the old detective.png spots: idle frame 1,
# trimmed to content, max 400px.
python - "$TMP/idle-loop/rgba/0001.png" <<'PY'
import sys
from PIL import Image
im = Image.open(sys.argv[1])
im = im.crop(im.getbbox())
im.thumbnail((400, 400), Image.LANCZOS)
im.save('assets/mascot/specs-standing.png')
print('  -> assets/mascot/specs-standing.png', im.size)
PY

echo "--- totals ---"
du -ch assets/mascot/webp/*.webp assets/mascot/specs-standing.png | tail -1
