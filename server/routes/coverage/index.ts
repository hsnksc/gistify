import express from "express";
import type { Request, Response, Router } from "express";
import type { BillingStore } from "../../billingStore";
import {
  buildCoverageStoredRecord,
  buildCoverageZipBuffer,
  findCoverageReportById,
  getCoverageReportsRootPath,
  listLocalCoverageReports,
  mergeCoverageReports,
  type CoverageStoredRecord,
} from "../../coverageSources";

interface CoverageReportUpsertRequestBody {
  raw?: unknown;
  sourceName?: unknown;
}

type CoverageRouterDependencies = {
  billingStore: BillingStore;
  normalizeString: (value: unknown) => string;
  requireWeeklyReportAdmin: (req: Request, res: Response) => boolean;
  setPrivateNoStore: (res: Response) => void;
};

function sortCoverageReports(reports: CoverageStoredRecord[]) {
  return [...reports].sort((left, right) =>
    right.importedAt.localeCompare(left.importedAt)
  );
}

export function createCoverageRouter({
  billingStore,
  normalizeString,
  requireWeeklyReportAdmin,
  setPrivateNoStore,
}: CoverageRouterDependencies): Router {
  const router = express.Router();

  const resolveCoverageRawForLanguage = (
    report: CoverageStoredRecord,
    language: string
  ) => {
    if (language === "en" && report.translations?.en) {
      return report.translations.en;
    }

    return report.raw;
  };

  const listPublishedCoverageReports = () =>
    mergeCoverageReports(
      billingStore.listCoverageReports() as CoverageStoredRecord[],
      listLocalCoverageReports()
    );

  const getPublishedCoverageReport = (id: string) =>
    findCoverageReportById(listPublishedCoverageReports(), id);

  router.get("/coverage/reports/download", (_req, res) => {
    setPrivateNoStore(res);
    const reports = listPublishedCoverageReports();
    const zip = buildCoverageZipBuffer(reports);
    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="gistify-coverage-library.zip"'
    );
    res.status(200).send(zip);
  });

  router.get("/coverage/reports", (_req, res) => {
    setPrivateNoStore(res);
    res.status(200).json({
      reports: listPublishedCoverageReports(),
    });
  });

  router.get("/coverage/reports/:id/markdown", (req, res) => {
    setPrivateNoStore(res);
    const report = getPublishedCoverageReport(req.params.id);
    if (!report) {
      res.status(404).json({ error: "Coverage report not found" });
      return;
    }

    res.setHeader("Content-Type", "text/markdown; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${report.sourceName}"`
    );
    res
      .status(200)
      .send(resolveCoverageRawForLanguage(report, normalizeString(req.query.lang)));
  });

  router.get("/coverage/reports/:id", (req, res) => {
    setPrivateNoStore(res);
    const report = getPublishedCoverageReport(req.params.id);
    if (!report) {
      res.status(404).json({ error: "Coverage report not found" });
      return;
    }

    res.status(200).json({ report });
  });

  router.get("/admin/coverage/reports", (req, res) => {
    setPrivateNoStore(res);
    if (!requireWeeklyReportAdmin(req, res)) {
      return;
    }

    const storedReports =
      billingStore.listCoverageReports() as CoverageStoredRecord[];
    res.status(200).json({
      localReports: sortCoverageReports(listLocalCoverageReports()),
      reports: sortCoverageReports(storedReports),
      rootPath: getCoverageReportsRootPath(),
    });
  });

  router.post("/admin/coverage/reports/import-local", (req, res) => {
    setPrivateNoStore(res);
    if (!requireWeeklyReportAdmin(req, res)) {
      return;
    }

    const localReports = listLocalCoverageReports();
    for (const report of localReports) {
      billingStore.upsertCoverageReport(report);
    }

    res.status(200).json({
      imported: localReports.length,
      reports: sortCoverageReports(
        billingStore.listCoverageReports() as CoverageStoredRecord[]
      ),
    });
  });

  router.post("/admin/coverage/reports", (req, res) => {
    setPrivateNoStore(res);
    if (!requireWeeklyReportAdmin(req, res)) {
      return;
    }

    const body = (req.body ?? {}) as CoverageReportUpsertRequestBody;
    const raw = normalizeString(body.raw);
    const sourceName = normalizeString(body.sourceName);

    try {
      const nextRecord = buildCoverageStoredRecord(raw, sourceName);
      billingStore.upsertCoverageReport(nextRecord);

      res.status(201).json({
        report: nextRecord,
        reports: sortCoverageReports(
          billingStore.listCoverageReports() as CoverageStoredRecord[]
        ),
      });
    } catch (error) {
      res.status(400).json({
        error:
          error instanceof Error
            ? error.message
            : "Coverage markdown kaydi basarisiz oldu.",
      });
    }
  });

  return router;
}
