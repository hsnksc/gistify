import fs from "node:fs";
import path from "node:path";
import type { Router } from "express";
import express from "express";
import { setPrivateNoStore } from "../../index";

export function createMarketFlashRouter(staticPath: string): Router {
  const router = express.Router();

  router.get("/", (_req, res) => {
    setPrivateNoStore(res);

    const reportPath = path.resolve(
      staticPath,
      "marketflash",
      "marketflash_report.json"
    );

    try {
      if (!fs.existsSync(reportPath)) {
        res.status(503).json({
          error: "Market Flash raporu hazir degil.",
        });
        return;
      }

      const raw = fs.readFileSync(reportPath, "utf8");
      if (!raw.trim()) {
        res.status(503).json({
          error: "Market Flash raporu bos.",
        });
        return;
      }

      res.status(200).type("json").send(raw);
    } catch {
      res.status(503).json({
        error: "Market Flash raporu okunamadi.",
      });
    }
  });

  return router;
}
