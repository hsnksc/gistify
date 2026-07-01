import { useCallback, useEffect, useState } from "react";
import type { FlowReport, FlowReportResponse } from "@shared/flow";
import { extractApiErrorMessage, readJsonResponse } from "@/lib/api";
import { copy, type AppLanguage } from "@/lib/i18n";

interface UseFlowReportResult {
  error: string;
  loading: boolean;
  reload: () => Promise<void>;
  report: FlowReport | null;
}

export function useFlowReport(
  reportId: string,
  language: AppLanguage
): UseFlowReportResult {
  const [report, setReport] = useState<FlowReport | null>(null);
  const [loading, setLoading] = useState(Boolean(reportId));
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    if (!reportId) {
      setReport(null);
      setError("");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/flow-reports/${encodeURIComponent(reportId)}${language === "en" ? "?lang=en" : ""}`,
        {
          cache: "no-store",
          credentials: "include",
        }
      );
      const payload = await readJsonResponse<FlowReportResponse>(
        response,
        "flow report",
        language
      );

      if (!response.ok) {
        throw new Error(
          extractApiErrorMessage(
            payload,
            copy(language, "Flow raporu yuklenemedi.", "Flow report could not be loaded.")
          )
        );
      }

      setReport(payload.report || null);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : copy(language, "Flow raporu yuklenemedi.", "Flow report could not be loaded.")
      );
      setReport(null);
    } finally {
      setLoading(false);
    }
  }, [language, reportId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return {
    error,
    loading,
    reload,
    report,
  };
}
