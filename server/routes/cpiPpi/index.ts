import type { Router } from "express";
import express from "express";
import type { CpiPpiForecastSyncService } from "../../cpiPpiForecast";
import { setPrivateNoStore } from "../../index";

export function createCpiPpiRouter(
  cpiPpiForecastSync: CpiPpiForecastSyncService
): Router {
  const router = express.Router();

  router.get("/forecast", (_req, res) => {
    setPrivateNoStore(res);

    const snapshot = cpiPpiForecastSync.getSnapshot();
    if (!snapshot) {
      res.status(503).json({
        error: "CPI/PPI forecast snapshot hazir degil.",
        pipeline: cpiPpiForecastSync.getPipeline(),
      });
      return;
    }

    res.status(200).json(snapshot);
  });

  return router;
}
