import type { Request, Response, Router } from "express";
import express from "express";
import { getAdminDiagnostics } from "../../services/adminDiagnostics";
import { createDeployHistoryStore } from "../../services/deployHistoryStore";
import { createMacroArchiveStore } from "../../services/macroArchiveStore";

interface AdminDiagnosticsRouterDependencies {
  requireWeeklyReportAdmin: (req: Request, res: Response) => boolean;
  setPrivateNoStore: (res: Response) => void;
}

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function parseLimit(value: unknown, defaultValue = 50): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : defaultValue;
}

export function createAdminDiagnosticsRouter({
  requireWeeklyReportAdmin,
  setPrivateNoStore,
}: AdminDiagnosticsRouterDependencies): Router {
  const router = express.Router();

  router.get("/admin/diagnostics", (req, res) => {
    setPrivateNoStore(res);
    if (!requireWeeklyReportAdmin(req, res)) {
      return;
    }

    res.status(200).json(getAdminDiagnostics());
  });

  router.get("/admin/deploys", (req, res) => {
    setPrivateNoStore(res);
    if (!requireWeeklyReportAdmin(req, res)) {
      return;
    }

    const limit = parseLimit(req.query.limit);
    const store = createDeployHistoryStore();
    res.status(200).json({ deploys: store.listDeploys(limit) });
  });

  router.get("/admin/macro/archive", (req, res) => {
    setPrivateNoStore(res);
    if (!requireWeeklyReportAdmin(req, res)) {
      return;
    }

    const workspace = normalizeString(req.query.workspace).toLowerCase();
    if (workspace !== "cpi" && workspace !== "ppi") {
      res.status(400).json({ error: "workspace must be 'cpi' or 'ppi'." });
      return;
    }

    const limit = parseLimit(req.query.limit, 12);
    const store = createMacroArchiveStore();
    res.status(200).json({
      workspace,
      records: store.listArchives(workspace, limit),
    });
  });

  router.get("/admin/artifacts", (req, res) => {
    setPrivateNoStore(res);
    if (!requireWeeklyReportAdmin(req, res)) {
      return;
    }

    const kind = normalizeString(req.query.kind) || undefined;
    const limit = parseLimit(req.query.limit);

    // Placeholder until artifact writes are integrated in the pipeline phase.
    res.status(200).json({
      kind,
      limit,
      artifacts: [],
      note: "Artifact writes will be wired in the pipeline integration phase.",
    });
  });

  return router;
}
