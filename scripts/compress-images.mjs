#!/usr/bin/env node
// One-off: re-encode the project's static images at a sensible size and
// quality so the gallery and product pages don't ship 5+ MB JPEGs.
// Run with `node /tmp/compress.mjs`.

import sharp from "sharp";
import { stat, readdir } from "node:fs/promises";
import { join } from "node:path";

const ROOT = "/Users/ashrafulislam/Documents/Business/BiswasTraders/Web/public";
const MAX_W = 1600; // Largest display in the UI is the home-page gallery hero; 1600px is plenty.
const QUALITY = 80;

async function reencode(src, dst, opts = {}) {
  const before = (await stat(src)).size;
  const img = sharp(src, { failOn: "none" }).rotate(); // honour EXIF orientation
  const meta = await img.metadata();
  const pipeline =
    meta.width > MAX_W
      ? img.resize({ width: MAX_W, withoutEnlargement: true })
      : img;
  // Sharp can't write to the same path it's reading from. Stage to a
  // sibling .tmp file and atomically rename on success.
  const tmp = dst + ".tmp";
  if (opts.format === "png") {
    await pipeline
      .png({ quality: QUALITY, compressionLevel: 9, palette: true })
      .toFile(tmp);
  } else {
    await pipeline
      .jpeg({ quality: QUALITY, progressive: true, mozjpeg: true })
      .toFile(tmp);
  }
  const { rename } = await import("node:fs/promises");
  await rename(tmp, dst);
  const after = (await stat(dst)).size;
  const fmt = (n) => `${(n / 1024).toFixed(0)} KB`;
  console.log(
    `${src.replace(ROOT + "/", "")}  ${meta.width}×${meta.height}  ${fmt(before)} → ${fmt(after)}`,
  );
}

const targets = [
  // [src, dst, opts]
  [
    "images/products/bricks.jpg",
    "images/products/bricks.jpg",
    { format: "jpg" },
  ],
  [
    "images/products/khoa.jpg",
    "images/products/khoa.jpg",
    { format: "jpg" },
  ],
  [
    "images/products/sand.jpg",
    "images/products/sand.jpg",
    { format: "jpg" },
  ],
  [
    "images/products/cement.jpg",
    "images/products/cement.jpg",
    { format: "jpg" },
  ],
  ["images/products/rod.jpg", "images/products/rod.jpg", { format: "jpg" }],
  // yard/mainYard.png is RGBA with no alpha that matters — convert to JPEG to save space.
  [
    "images/yard/mainYard.png",
    "images/yard/mainYard.jpg",
    { format: "jpg" },
  ],
  ["images/yard/yard.jpg", "images/yard/yard.jpg", { format: "jpg" }],
];

for (const [src, dst, opts] of targets) {
  try {
    await reencode(join(ROOT, src), join(ROOT, dst), opts);
  } catch (e) {
    console.error(`failed: ${src}`, e.message);
  }
}
