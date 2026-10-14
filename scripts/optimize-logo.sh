#!/usr/bin/env bash
# Optimize the brand logo for the web.
#
# The original `/public/brand/logo.original.png` is preserved untouched
# (it's the print-quality master, ~16 MB at 6144x4096). This script
# produces the 256x256 web version the SiteHeader actually loads,
# stripping metadata and re-encoding at a sensible quality.
#
# Run with `bash scripts/optimize-logo.sh` or `npm run logo:optimize`.
# If you've replaced the original, re-run this and commit the change.

set -euo pipefail

cd "$(dirname "$0")/.."

SRC="public/brand/logo.original.png"
DST="public/brand/logo.png"

if [ ! -f "$SRC" ]; then
  echo "Source $SRC not found; nothing to do."
  exit 0
fi

# 256x256 is plenty for a 36–40px header logo. Strip metadata
# (-strip), force RGB, and re-encode at quality 85 → usually ~50–80 KB.
convert "$SRC" -resize 256x256 -strip -quality 85 "$DST"

echo "Wrote $DST ($(du -h "$DST" | cut -f1)) from $SRC"
