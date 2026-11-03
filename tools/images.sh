#!/bin/bash
# Builds the web images in tools/preview/img from the JPEG masters in tools/photos:
# name.webp (up to 1400px) and name-800.webp (phones). prerender.mjs copies them to site/img under descriptive file names (tools/seo.mjs).
set -e
root="$(cd "$(dirname "$0")/.." && pwd)"
src="$root/tools/photos"; out="$root/tools/preview/img"
for f in "$src"/*.jpg; do
  n=$(basename "${f%.jpg}")
  convert "$f" -strip -resize '1400x1400>' -quality 58 -define webp:method=6 "$out/$n.webp"
  convert "$f" -strip -resize '800x800>' -quality 58 -define webp:method=6 "$out/$n-800.webp"
done
# Header logo: shown 40-48px tall, so 2x is 144px.
convert "$src/logo-light.png" -resize x144 -quality 85 "$out/logo-light.webp"
