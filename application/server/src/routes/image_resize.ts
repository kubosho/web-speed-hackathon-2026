import fs from "node:fs";
import path from "node:path";

import { Router } from "express";
import sharp from "sharp";

import { PUBLIC_PATH, UPLOAD_PATH } from "@web-speed-hackathon-2026/server/src/paths";

export const imageResizeRouter = Router();

const ALLOWED_WIDTHS = new Set([320, 640, 960, 1280]);
const CACHE_DIR = path.join(UPLOAD_PATH, "resized");

// Ensure cache directory exists
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

imageResizeRouter.get("/images/:filename", async (req, res, next) => {
  const widthParam = req.query["w"];
  if (!widthParam) {
    next();
    return;
  }

  const width = Number(widthParam);
  if (!ALLOWED_WIDTHS.has(width)) {
    next();
    return;
  }

  const { filename } = req.params;
  if (!filename || !filename.endsWith(".avif")) {
    next();
    return;
  }

  // Build cache key
  const baseName = path.basename(filename, ".avif");
  const cachedPath = path.join(CACHE_DIR, `${baseName}_w${width}.avif`);

  // Serve from cache if exists
  if (fs.existsSync(cachedPath)) {
    res.setHeader("Content-Type", "image/avif");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.sendFile(cachedPath);
    return;
  }

  // Find original file in upload or public directories
  const uploadFile = path.join(UPLOAD_PATH, "images", filename);
  const publicFile = path.join(PUBLIC_PATH, "images", filename);
  const originalPath = fs.existsSync(uploadFile) ? uploadFile : fs.existsSync(publicFile) ? publicFile : null;

  if (!originalPath) {
    next();
    return;
  }

  try {
    const resized = await sharp(originalPath).resize({ width, withoutEnlargement: true }).avif({ quality: 50 }).toBuffer();

    // Write cache file asynchronously (don't block response)
    fs.writeFile(cachedPath, resized, () => {});

    res.setHeader("Content-Type", "image/avif");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.send(resized);
  } catch {
    next();
  }
});
