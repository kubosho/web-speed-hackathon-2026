import history from "connect-history-api-fallback";
import { Router } from "express";
import serveStatic from "serve-static";

import {
  CLIENT_DIST_PATH,
  PUBLIC_PATH,
  UPLOAD_PATH,
} from "@web-speed-hackathon-2026/server/src/paths";

export const staticRouter = Router();

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

// SPA 対応のため、ファイルが存在しないときに index.html を返す
staticRouter.use(history());

staticRouter.use(
  serveStatic(UPLOAD_PATH, {
    etag: false,
    lastModified: false,
  }),
);

staticRouter.use(
  serveStatic(PUBLIC_PATH, {
    etag: false,
    lastModified: false,
  }),
);

staticRouter.use(
  serveStatic(CLIENT_DIST_PATH, {
    etag: false,
    lastModified: false,
  }),
);
