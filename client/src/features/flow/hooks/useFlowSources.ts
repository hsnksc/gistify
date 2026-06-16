import { useCallback, useEffect, useState } from "react";
import type { FlowSource, FlowSourcesResponse } from "@shared/flow";
import { extractApiErrorMessage, readJsonResponse } from "@/lib/api";
import { copy, type AppLanguage } from "@/lib/i18n";

interface UseFlowSourcesResult {
  error: string;
  loading: boolean;
  reload: () => Promise<void>;
  sources: FlowSource[];
}

export function useFlowSources(language: AppLanguage): UseFlowSourcesResult {
  const [sources, setSources] = useState<FlowSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/flow-sources", {
        cache: "no-store",
        credentials: "include",
      });
      const payload = await readJsonResponse<FlowSourcesResponse>(
        response,
        "flow sources",
        language
      );

      if (!response.ok) {
        throw new Error(
          extractApiErrorMessage(
            payload,
            copy(
              language,
              "Flow kaynaklari yuklenemedi.",
              "Flow sources could not be loaded."
            )
          )
        );
      }

      setSources(Array.isArray(payload.sources) ? payload.sources : []);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : copy(
              language,
              "Flow kaynaklari yuklenemedi.",
              "Flow sources could not be loaded."
            )
      );
      setSources([]);
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
    sources,
  };
}
