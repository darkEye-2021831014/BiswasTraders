#!/usr/bin/env bash
# Regenerate the Open Graph / social share image from the brand.
# Uses ImageMagick (the `convert` binary). The output goes to
# `/public/og.jpg` at 1200x630, well under 100 KB.
#
# Replace this with a real photo (drop in /public/og.jpg) when the owner
# provides one — the metadata helpers always reference /og.jpg by path.

set -euo pipefail

cd "$(dirname "$0")/.."

W=1200
H=630

convert -size "${W}x${H}" xc:'#001A2B' \
  -fill '#A13828' -draw "rectangle 0,460 ${W},520" \
  -fill '#812113' -draw "rectangle 0,520 ${W},540" \
  -fill '#EDE4D8' -font Helvetica-Bold -pointsize 88 -gravity north -annotate +0+120 "M/S BISWAS TRADERS" \
  -fill '#FD5500' -pointsize 38 -gravity north -annotate +0+225 "BUILDING MATERIALS · SINGAIR · MANIKGANJ" \
  -fill '#FAF8F5' -pointsize 28 -gravity south -annotate +0+90 "Bricks · Sand · Khoa · Cement · Rebar" \
  -fill '#FAF8F5' -pointsize 22 -gravity south -annotate +0+50 "Call or WhatsApp for today's rate" \
  -fill '#FD5500' -draw "rectangle 0,0 ${W},8" \
  -fill '#FD5500' -draw "rectangle 0,622 ${W},630" \
  -quality 82 \
  public/og.jpg

echo "Wrote public/og.jpg ($(du -h public/og.jpg | cut -f1))"
