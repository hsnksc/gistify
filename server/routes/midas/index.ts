import type { Router } from "express";
import express from "express";
import type { MidasSignalsSyncService } from "../../midasSignals";
import { requireWeeklyReportAdmin, setPrivateNoStore } from "../../index";

export function createMidasRouter(
  midasSignalsSync: MidasSignalsSyncService
): Router {
  const router = express.Router();

  router.get("/signals", (_req, res) => {
    setPrivateNoStore(res);

    const snapshot = midasSignalsSync.getSnapshot();
    if (!snapshot) {
      res.status(503).json({
        error: "Midas signal snapshot hazir degil.",
        pipeline: midasSignalsSync.getPipeline(),
      });
      return;
    }

    res.status(200).json(snapshot);
  });

  router.post("/signals/refresh", async (req, res) => {
    setPrivateNoStore(res);
    if (!requireWeeklyReportAdmin(req, res)) {
      return;
    }

    const snapshot = await midasSignalsSync.refresh({ force: true });
    if (!snapshot) {
      res.status(503).json({
        error: "Midas signal snapshot yenilenemedi.",
        pipeline: midasSignalsSync.getPipeline(),
      });
      return;
    }

    res.status(200).json(snapshot);
  });

  return router;
}
