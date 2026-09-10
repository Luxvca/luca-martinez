#!/usr/bin/env bash
#
# Copies your voicemails and photos into ./media/, converting anything a
# browser can't play and renaming to safe lowercase filenames.
#
# Your originals are never touched, moved, or altered — everything is a copy.
#
# Usage, from inside the mom-memorial folder:
#
#   ./setup-media.sh "../mom voicemails" "../mom images"
#
# Either path can be left out if you only want to do one of them:
#
#   ./setup-media.sh "../mom voicemails"
#

set -uo pipefail

AUDIO_SRC="${1:-}"
IMAGE_SRC="${2:-}"
HERE="$(cd "$(dirname "$0")" && pwd)"
cd "$HERE"

mkdir -p media/audio media/images media/video

say()  { printf '%s\n' "$*"; }
warn() { printf '  ! %s\n' "$*" >&2; }

# "Mom - Thanksgiving.m4a" -> "mom-thanksgiving"
slug() {
  printf '%s' "$1" \
    | tr '[:upper:]' '[:lower:]' \
    | sed -E 's/[^a-z0-9]+/-/g; s/^-+//; s/-+$//'
}

have() { command -v "$1" >/dev/null 2>&1; }

MADE_AUDIO=()
MADE_IMAGES=()

# ── Audio ───────────────────────────────────────────────────────────────
if [ -n "$AUDIO_SRC" ]; then
  if [ ! -d "$AUDIO_SRC" ]; then
    warn "No folder at: $AUDIO_SRC"
  else
    say ""
    say "Audio  ← $AUDIO_SRC"
    while IFS= read -r -d '' f; do
      base="$(basename "$f")"
      ext="$(printf '%s' "${base##*.}" | tr '[:upper:]' '[:lower:]')"
      name="$(slug "${base%.*}")"
      out="media/audio/${name}.m4a"

      case "$ext" in
        m4a|mp3|aac)
          # Already browser-playable — copy as-is, keeping its extension.
          out="media/audio/${name}.${ext}"
          cp "$f" "$out"
          ;;
        amr|3gp|3gpp|wav|aiff|aif|caf|ogg|opus|flac|mp4|mov)
          if have ffmpeg; then
            ffmpeg -nostdin -loglevel error -y -i "$f" -vn -c:a aac -b:a 192k "$out" \
              || { warn "could not convert: $base"; continue; }
          else
            warn "need ffmpeg to convert $base  (brew install ffmpeg)"
            continue
          fi
          ;;
        *)
          warn "skipped (unknown audio type): $base"
          continue
          ;;
      esac
      say "  ✓ $base  →  ${out#media/}"
      MADE_AUDIO+=("${out#media/}")
    done < <(find "$AUDIO_SRC" -maxdepth 1 -type f ! -name '.*' -print0 | sort -z)
  fi
fi

# ── Images ──────────────────────────────────────────────────────────────
if [ -n "$IMAGE_SRC" ]; then
  if [ ! -d "$IMAGE_SRC" ]; then
    warn "No folder at: $IMAGE_SRC"
  else
    say ""
    say "Images ← $IMAGE_SRC"
    while IFS= read -r -d '' f; do
      base="$(basename "$f")"
      ext="$(printf '%s' "${base##*.}" | tr '[:upper:]' '[:lower:]')"
      name="$(slug "${base%.*}")"

      case "$ext" in
        jpg|jpeg|png|webp)
          out="media/images/${name}.${ext}"
          cp "$f" "$out"
          ;;
        heic|heif|tif|tiff|gif|bmp)
          out="media/images/${name}.jpg"
          if have sips; then
            # sips ships with macOS and reads HEIC natively.
            sips -s format jpeg -s formatOptions 88 "$f" --out "$out" >/dev/null 2>&1 \
              || { warn "could not convert: $base"; continue; }
          elif have ffmpeg; then
            ffmpeg -nostdin -loglevel error -y -i "$f" -q:v 2 "$out" \
              || { warn "could not convert: $base"; continue; }
          else
            warn "need sips (macOS) or ffmpeg to convert $base"
            continue
          fi
          ;;
        *)
          warn "skipped (unknown image type): $base"
          continue
          ;;
      esac
      say "  ✓ $base  →  ${out#media/}"
      MADE_IMAGES+=("${out#media/}")
    done < <(find "$IMAGE_SRC" -maxdepth 1 -type f ! -name '.*' -print0 | sort -z)
  fi
fi

# ── What to paste ───────────────────────────────────────────────────────
say ""
say "─────────────────────────────────────────────────────────────"
if [ ${#MADE_AUDIO[@]} -eq 0 ] && [ ${#MADE_IMAGES[@]} -eq 0 ]; then
  say "Nothing was copied. Check the folder paths above."
  exit 1
fi

say "These are the exact paths to use in index.html:"
say ""
for p in "${MADE_AUDIO[@]}";  do say "  audio:  \"$p\""; done
for p in "${MADE_IMAGES[@]}"; do say "  image:  \"$p\""; done
say ""
say "Open index.html and put them in MEMORIES near the top."
say "Then just double-click index.html."
say "─────────────────────────────────────────────────────────────"
