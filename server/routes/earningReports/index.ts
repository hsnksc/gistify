import type { Router } from "express";
import express from "express";
import {
  getEarningReportSource,
  listEarningReportSourceSummaries,
} from "../../earningReportSources";
import { normalizeString, setPrivateNoStore } from "../../index";

export function createEarningReportsRouter(): Router {
  const router = express.Router();

  router.get("/", (_req, res) => {
    setPrivateNoStore(res);
    res.status(200).json({
      reports: listEarningReportSourceSummaries(),
    });
  });

  router.get("/latest", (_req, res) => {
    setPrivateNoStore(res);
    res.status(200).json({
      report: listEarningReportSourceSummaries()[0] || null,
    });
  });

  router.get("/:sourceId", (req, res) => {
    setPrivateNoStore(res);

    const sourceId = normalizeString(req.params.sourceId);
    const report = getEarningReportSource(sourceId);
    if (!report) {
      res.status(404).json({ error: "Earning report source bulunamadi." });
      return;
    }

    res.status(200).json({ report });
  });

  return router;
}
