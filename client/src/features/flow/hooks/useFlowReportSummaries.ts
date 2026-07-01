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
  limit?: number;
  reportKind?: FlowReportKind;
  timeoutMs?: number;
}

export function useFlowReportSummaries(
  language: AppLanguage,
  options: UseFlowReportSummariesOptions = {}
): UseFlowReportSummariesResult {
  const [reports, setReports] = useState<FlowReportSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { limit, reportKind, timeoutMs = 20_000 } = options;

  const reload = useCallback(async () => {
    setLoading(true);
    setError("");
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

    try {
      const searchParams = new URLSearchParams();
      if (reportKind) {
        searchParams.set("type", reportKind);
      }
      if (typeof limit === "number" && Number.isFinite(limit) && limit > 0) {
        searchParams.set("limit", String(Math.floor(limit)));
      }
      if (language === "en") {
        searchParams.set("lang", "en");
      }

      const response = await fetch(
        `/api/flow-reports/summary${searchParams.size ? `?${searchParams.toString()}` : ""}`,
        {
          cache: "no-store",
          credentials: "include",
          signal: controller.signal,
        }
      );
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
      const isAbortError =
        caughtError instanceof DOMException && caughtError.name === "AbortError";
      setError(
        isAbortError
          ? copy(
              language,
              "Flow rapor ozetleri zamaninda gelmedi. Yeniden dene.",
              "Flow report summaries took too long to arrive. Try again."
            )
          : caughtError instanceof Error
            ? caughtError.message
            : copy(
                language,
                "Flow rapor ozetleri yuklenemedi.",
                "Flow report summaries could not be loaded."
              )
      );
      setReports([]);
    } finally {
      window.clearTimeout(timeoutId);
      setLoading(false);
    }
  }, [language, limit, reportKind, timeoutMs]);

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
