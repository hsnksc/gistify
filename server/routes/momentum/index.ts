import type { Router } from "express";
import express from "express";
import {
  getMomentumReportSource,
  listMomentumReportSourceSummaries,
} from "../../momentumReportSources";
import { normalizeString, setPrivateNoStore } from "../../index";

export function createMomentumRouter(): Router {
  const router = express.Router();

  router.get("/sources", (_req, res) => {
    setPrivateNoStore(res);
    res.status(200).json({
      reports: listMomentumReportSourceSummaries(),
    });
  });

  router.get("/sources/latest", (_req, res) => {
    setPrivateNoStore(res);
    res.status(200).json({
      report: listMomentumReportSourceSummaries()[0] || null,
    });
  });

  router.get("/sources/:sourceId", (req, res) => {
    setPrivateNoStore(res);

    const sourceId = normalizeString(req.params.sourceId);
    const report = getMomentumReportSource(sourceId);
    if (!report) {
      res.status(404).json({ error: "Momentum report source bulunamadi." });
      return;
    }

    res.status(200).json({ report });
  });

  return router;
}
