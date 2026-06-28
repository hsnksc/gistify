import fs from "node:fs";
import path from "node:path";
import type { Router } from "express";
import express from "express";
import {
  buildEarningsApiResponse,
  createEarningsStrategySyncService,
} from "../../earningsStrategy";
import { normalizeString, setPrivateNoStore } from "../../index";

export type EarningsStrategySync = ReturnType<
  typeof createEarningsStrategySyncService
>;

export function createEarningsRouter(
  earningsStrategySync: EarningsStrategySync
): Router {
  const router = express.Router();

  router.get("/strategy", (_req, res) => {
    setPrivateNoStore(res);

    const snapshot = earningsStrategySync.getSnapshot();
    const pipeline = earningsStrategySync.getPipeline();
    const response = buildEarningsApiResponse(snapshot, pipeline);

    if (!snapshot) {
      res.status(503).json(response);
      return;
    }

    res.status(200).json(response);
  });

  router.get("/download", async (_req, res) => {
    const format = normalizeString(_req.query.format);
    const folder =
      earningsStrategySync.getPipeline().sourceFolder ||
      path.resolve(
        process.cwd(),
        "earningreport",
        "Kimi_Agent_ Option Strategy"
      );

    if (!fs.existsSync(folder)) {
      res.status(503).json({ error: "Earnings report folder not found." });
      return;
    }

    const extension = format === "docx" ? ".docx" : ".md";
    const entries = fs.readdirSync(folder, { withFileTypes: true });
    let latest: { filePath: string; mtimeMs: number } | null = null;

    for (const entry of entries) {
      if (!entry.isFile()) continue;
      if (!entry.name.toLowerCase().endsWith(extension)) continue;
      if (!/Earnings_Opsiyon_Master_Stratejisi/i.test(entry.name)) continue;

      const filePath = path.join(folder, entry.name);
      const stats = fs.statSync(filePath);
      if (!latest || stats.mtimeMs > latest.mtimeMs) {
        latest = { filePath, mtimeMs: stats.mtimeMs };
      }
    }

    if (!latest) {
      res.status(404).json({
        error: `No earnings report found for format ${format || "md"}.`,
      });
      return;
    }

    if (!fs.existsSync(latest.filePath)) {
      res.status(404).json({
        error: `Report file not found: ${path.basename(latest.filePath)}`,
      });
      return;
    }

    res.download(latest.filePath, path.basename(latest.filePath));
  });

  return router;
}
