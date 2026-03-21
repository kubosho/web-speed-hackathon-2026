import fs from "node:fs";
import path from "node:path";

import history from "connect-history-api-fallback";
import { Router } from "express";
import serveStatic from "serve-static";

import { Post } from "@web-speed-hackathon-2026/server/src/models";
import {
  CLIENT_DIST_PATH,
  PUBLIC_PATH,
  UPLOAD_PATH,
} from "@web-speed-hackathon-2026/server/src/paths";

export const staticRouter = Router();

// Inject <link rel="preload"> for the LCP image into index.html on the home page
let cachedHtmlWithPreload: string | null = null;

staticRouter.get("/", async (_req, res, next) => {
  if (cachedHtmlWithPreload == null) {
    try {
      // Find the first post that has images (matches the LCP element on the timeline)
      const posts = await Post.findAll({ limit: 10, offset: 0 });
      type PostWithImages = { images?: { id: string }[] };
      const firstPostWithImage = posts.find(
        (p) => ((p as unknown as PostWithImages).images?.length ?? 0) > 0,
      );
      const firstImageId = (firstPostWithImage as unknown as PostWithImages)?.images?.[0]?.id;

      const htmlPath = path.join(CLIENT_DIST_PATH, "index.html");
      let html = fs.readFileSync(htmlPath, "utf-8");

      if (firstImageId) {
        const preloadTag = `<link rel="preload" as="image" href="/images/${firstImageId}.avif?w=640" type="image/avif" imagesrcset="/images/${firstImageId}.avif?w=320 320w, /images/${firstImageId}.avif?w=640 640w, /images/${firstImageId}.avif?w=960 960w, /images/${firstImageId}.avif?w=1280 1280w" imagesizes="(max-width: 640px) 100vw, 640px">`;
        html = html.replace("<head>", `<head>${preloadTag}`);
      }

      cachedHtmlWithPreload = html;
    } catch {
      next();
      return;
    }
  }

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(cachedHtmlWithPreload);
});

// Contenthash付きファイルに長期キャッシュを設定
staticRouter.use("/scripts", (_req, res, next) => {
  res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  next();
});
staticRouter.use("/styles", (_req, res, next) => {
  res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  next();
});
staticRouter.use("/assets", (_req, res, next) => {
  res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  next();
});

// ID-based media files: content doesn't change, safe to cache long-term
for (const path of ["/images", "/movies", "/sounds"]) {
  staticRouter.use(path, (_req, res, next) => {
    res.setHeader("Cache-Control", "public, max-age=86400");
    next();
  });
}

// SPA 対応のため、ファイルが存在しないときに index.html を返す
staticRouter.use(history());

staticRouter.use(
  serveStatic(UPLOAD_PATH, {
    cacheControl: false,
    etag: false,
    lastModified: false,
  }),
);

staticRouter.use(
  serveStatic(PUBLIC_PATH, {
    cacheControl: false,
    etag: false,
    lastModified: false,
  }),
);

staticRouter.use(
  serveStatic(CLIENT_DIST_PATH, {
    cacheControl: false,
    etag: false,
    lastModified: false,
  }),
);
