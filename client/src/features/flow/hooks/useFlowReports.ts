import { useCallback, useEffect, useState } from "react";
import type { FlowReport, FlowReportsResponse } from "@shared/flow";
import { extractApiErrorMessage, readJsonResponse } from "@/lib/api";
import { copy, type AppLanguage } from "@/lib/i18n";

interface UseFlowReportsResult {
  error: string;
  loading: boolean;
  reload: () => Promise<void>;
  reports: FlowReport[];
}

export function useFlowReports(language: AppLanguage): UseFlowReportsResult {
  const [reports, setReports] = useState<FlowReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/flow-reports${language === "en" ? "?lang=en" : ""}`,
        {
          cache: "no-store",
          credentials: "include",
        }
      );
      const payload = await readJsonResponse<FlowReportsResponse>(
        response,
        "flow reports",
        language
      );

      if (!response.ok) {
        throw new Error(
          extractApiErrorMessage(
            payload,
            copy(
              language,
              "Flow raporlari yuklenemedi.",
              "Flow reports could not be loaded."
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
              "Flow raporlari yuklenemedi.",
              "Flow reports could not be loaded."
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
