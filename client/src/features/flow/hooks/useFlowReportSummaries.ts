import { useCallback, useEffect, useState } from "react";
import type {
  FlowReportSummariesResponse,
  FlowReportSummary,
} from "@shared/flow";
import { extractApiErrorMessage, readJsonResponse } from "@/lib/api";
import { copy, type AppLanguage } from "@/lib/i18n";
import type { FlowReportKind } from "@shared/flow";

interface UseFlowReportSummariesResult {
  error: string;
  loading: boolean;
  reload: () => Promise<void>;
  reports: FlowReportSummary[];
}

interface UseFlowReportSummariesOptions {
  reportKind?: FlowReportKind;
}

export function useFlowReportSummaries(
  language: AppLanguage,
  options: UseFlowReportSummariesOptions = {}
): UseFlowReportSummariesResult {
  const [reports, setReports] = useState<FlowReportSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { reportKind } = options;

  const reload = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const searchParams = new URLSearchParams();
      if (reportKind) {
        searchParams.set("type", reportKind);
      }

      const response = await fetch(`/api/flow-reports/summary${searchParams.size ? `?${searchParams.toString()}` : ""}`, {
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
  }, [language, reportKind]);

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
