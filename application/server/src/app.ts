import bodyParser from "body-parser";
import compression from "compression";
import Express from "express";

import { apiRouter } from "@web-speed-hackathon-2026/server/src/routes/api";
import { staticRouter } from "@web-speed-hackathon-2026/server/src/routes/static";
import { sessionMiddleware } from "@web-speed-hackathon-2026/server/src/session";

export const app = Express();

app.set("trust proxy", true);

app.use(
  compression({
    // Skip already-compressed binary media formats
    filter: (req, res) => {
      const url = req.url;
      if (url.startsWith("/images/") || url.startsWith("/movies/") || url.startsWith("/sounds/")) {
        return false;
      }
      return compression.filter(req, res);
    },
  }),
);
app.use(sessionMiddleware);
app.use(bodyParser.json());
app.use(bodyParser.raw({ limit: "10mb" }));

app.use("/api/v1", apiRouter);
app.use(staticRouter);
