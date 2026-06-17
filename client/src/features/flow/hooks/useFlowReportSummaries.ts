import { useCallback, useEffect, useState } from "react";
import type {
  FlowReportSummariesResponse,
  FlowReportSummary,
} from "@shared/flow";
import { extractApiErrorMessage, readJsonResponse } from "@/lib/api";
import { copy, type AppLanguage } from "@/lib/i18n";

interface UseFlowReportSummariesResult {
  error: string;
  loading: boolean;
  reload: () => Promise<void>;
  reports: FlowReportSummary[];
}

export function useFlowReportSummaries(
  language: AppLanguage
): UseFlowReportSummariesResult {
  const [reports, setReports] = useState<FlowReportSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/flow-reports/summary", {
        cache: "no-store",
        credentials: "include",
      });
      const payload = await readJsonResponse<FlowReportSummariesResponse>(
        response,
        "flow report summaries",
        language
      );

      if (!response.ok) {
        throw new Error(
          extractApiErrorMessage(
            payload,
            copy(
              language,
              "Flow rapor ozetleri yuklenemedi.",
              "Flow report summaries could not be loaded."
            )
          )
        );
      }

      setReports(Array.isArray(payload.reports) ? payload.reports : []);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : copy(
              language,
              "Flow rapor ozetleri yuklenemedi.",
              "Flow report summaries could not be loaded."
            )
      );
      setReports([]);
    } finally {
      setLoading(false);
    }
  }, [language]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return {
    error,
    loading,
    reload,
    reports,
  };
}
