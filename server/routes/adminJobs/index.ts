import type { Request, Response, Router } from "express";
import express from "express";
import type {
  JobCoordinator,
  JobStatus,
} from "../../services/jobCoordinator";
import { CRON_JOB_DEFINITIONS } from "../../jobs/definitions";

interface AdminJobsRouterDependencies {
  jobCoordinator: JobCoordinator;
  requireWeeklyReportAdmin: (req: Request, res: Response) => boolean;
  setPrivateNoStore: (res: Response) => void;
}

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isValidJobStatus(value: unknown): value is JobStatus {
  return (
    typeof value === "string" &&
    ["running", "success", "failed", "skipped", "timeout"].includes(value)
  );
}

export function createAdminJobsRouter({
  jobCoordinator,
  requireWeeklyReportAdmin,
  setPrivateNoStore,
}: AdminJobsRouterDependencies): Router {
  const router = express.Router();

  router.get("/admin/jobs", (req, res) => {
    setPrivateNoStore(res);
    if (!requireWeeklyReportAdmin(req, res)) {
      return;
    }

    jobCoordinator.ensureCronJobs(CRON_JOB_DEFINITIONS);

    res.status(200).json({
      jobs: CRON_JOB_DEFINITIONS,
      note: "Run history available at /api/admin/cron/runs",
    });
  });

  router.post("/admin/jobs/:name/run", async (req, res) => {
    setPrivateNoStore(res);
    if (!requireWeeklyReportAdmin(req, res)) {
      return;
    }

    const name = normalizeString(req.params.name);
    if (!name) {
      res.status(400).json({ error: "Job name is required." });
      return;
    }

    const isKnown = CRON_JOB_DEFINITIONS.some(job => job.name === name);
    if (!isKnown) {
      res.status(404).json({ error: `Unknown job: ${name}.` });
      return;
    }

    try {
      const result = await jobCoordinator.runJob(
        name,
        async () => {
          // Placeholder: actual job wiring is done in pipeline integration phase.
          return { status: "executed", name };
        },
        { inputSummary: { triggeredBy: "admin", body: req.body } }
      );
      res.status(200).json({ success: true, result });
    } catch (error) {
      const status =
        error instanceof Error && error.name === "JobSkippedError"
          ? "skipped"
          : "failed";
      res.status(200).json({
        success: false,
        status,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  router.get("/admin/cron/runs", (req, res) => {
    setPrivateNoStore(res);
    if (!requireWeeklyReportAdmin(req, res)) {
      return;
    }

    const jobName = normalizeString(req.query.job) || undefined;
    const rawStatus = normalizeString(req.query.status);
    const status = isValidJobStatus(rawStatus) ? rawStatus : undefined;
    const rawLimit = Number(req.query.limit);
    const limit = Number.isFinite(rawLimit) && rawLimit > 0 ? rawLimit : 50;

    const runs = jobCoordinator.listRecentRuns({ jobName, status, limit });
    res.status(200).json({ runs });
  });

  return router;
}
