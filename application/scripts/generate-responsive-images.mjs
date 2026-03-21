import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_IMAGES = path.resolve(__dirname, "../public/images");
const WIDTHS = [320, 640, 960];

const files = fs.readdirSync(PUBLIC_IMAGES).filter((f) => f.endsWith(".avif") && !f.includes("_w"));

console.log(`Generating responsive variants for ${files.length} images...`);

for (const file of files) {
  const src = path.join(PUBLIC_IMAGES, file);
  const baseName = path.basename(file, ".avif");

  for (const w of WIDTHS) {
    const dest = path.join(PUBLIC_IMAGES, `${baseName}_w${w}.avif`);
    if (fs.existsSync(dest)) continue;

    await sharp(src).resize({ width: w, withoutEnlargement: true }).avif({ quality: 50 }).toFile(dest);
    console.log(`  ${baseName}_w${w}.avif`);
  }
}

console.log("Done.");
