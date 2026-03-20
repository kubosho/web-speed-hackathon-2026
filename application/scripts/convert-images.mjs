// Convert seed JPEG images to AVIF with resizing.
// Post images: max 1280px wide (640px layout * 2x DPR for Retina).
// Profile images: 256px (128px * 2x DPR for Retina).
// Usage: node scripts/convert-images.mjs

import { readdir } from "node:fs/promises";
import { basename, join, resolve } from "node:path";
import sharp from "sharp";

const IMAGES_DIR = resolve(import.meta.dirname, "../public/images");
const PROFILES_DIR = join(IMAGES_DIR, "profiles");

async function convertImage(inputPath, outputPath, maxWidth) {
  await sharp(inputPath)
    .resize({ width: maxWidth, withoutEnlargement: true })
    .avif({ quality: 75 })
    .toFile(outputPath);
}

// Convert post images
const postFiles = (await readdir(IMAGES_DIR)).filter((f) => f.endsWith(".jpg"));
for (const file of postFiles) {
  const id = basename(file, ".jpg");
  const input = join(IMAGES_DIR, file);
  const output = join(IMAGES_DIR, `${id}.avif`);
  console.log(`post: ${file} → ${id}.avif`);
  await convertImage(input, output, 1280);
}

// Convert profile images
const profileFiles = (await readdir(PROFILES_DIR)).filter((f) => f.endsWith(".jpg"));
for (const file of profileFiles) {
  const id = basename(file, ".jpg");
  const input = join(PROFILES_DIR, file);
  const output = join(PROFILES_DIR, `${id}.avif`);
  console.log(`profile: ${file} → ${id}.avif`);
  await convertImage(input, output, 256);
}

console.log(`done: ${postFiles.length} post images, ${profileFiles.length} profile images`);
