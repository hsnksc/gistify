import type { Router } from "express";
import express from "express";
import { createCalendarSyncService } from "../../calendarSync";
import { setPrivateNoStore } from "../../index";

export type CalendarSync = ReturnType<typeof createCalendarSyncService>;

export function createCalendarRouter(calendarSync: CalendarSync): Router {
  const router = express.Router();

  router.get("/", (_req, res) => {
    setPrivateNoStore(res);

    const snapshot = calendarSync.getSnapshot();
    if (!snapshot) {
      res.status(503).json({
        error: "Calendar snapshot hazir degil.",
        pipeline: calendarSync.getPipeline(),
      });
      return;
    }

    res.status(200).json(snapshot);
  });

  return router;
}
