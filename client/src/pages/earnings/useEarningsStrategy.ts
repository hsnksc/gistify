import { useCallback, useEffect, useState } from "react";
import type {
  EarningsStrategyApiResponse,
  EarningsStrategyData,
  EarningsStrategyPipelineMetadata,
} from "@shared/earnings";

const DEFAULT_PIPELINE: EarningsStrategyPipelineMetadata = {
  configuredSourceFile: null,
  resolvedSourceFile: null,
  sourceFolder: null,
  pollIntervalMs: 0,
  lastAttemptAt: null,
  lastSyncedAt: null,
  lastSourceModifiedAt: null,
  status: "idle",
};

interface EarningsStrategyState {
  data: EarningsStrategyData | null;
  error: string;
  isLoading: boolean;
  isRefreshing: boolean;
  pipeline: EarningsStrategyPipelineMetadata;
  refresh: () => Promise<{ error?: string; ok: boolean }>;
}

export function useEarningsStrategy(): EarningsStrategyState {
  const [data, setData] = useState<EarningsStrategyData | null>(null);
  const [error, setError] = useState("");
  const [pipeline, setPipeline] = useState<EarningsStrategyPipelineMetadata>(
    DEFAULT_PIPELINE
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    setError("");

    try {
      const response = await fetch("/api/earnings/strategy", {
        cache: "no-store",
        credentials: "include",
      });
      const payload = (await response.json()) as EarningsStrategyApiResponse;

      setPipeline(payload.pipeline || DEFAULT_PIPELINE);

      if (!response.ok || !payload.success || !payload.data) {
        setData(current => payload.data || current);
        const message = payload.error || "Earnings workspace unavailable.";
        setError(message);
        return {
          error: message,
          ok: false,
        };
      }

      setData(payload.data);
      return { ok: true };
    } catch (fetchError) {
      const message =
        fetchError instanceof Error
          ? fetchError.message
          : "Earnings workspace unavailable.";
      setError(message);
      return {
        error: message,
        ok: false,
      };
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    const intervalMs = data
      ? Math.max(pipeline.pollIntervalMs || 60_000, 30_000)
      : 4_000;

    const timer = setInterval(() => {
      void refresh();
    }, intervalMs);

    return () => {
      clearInterval(timer);
    };
  }, [data, pipeline.pollIntervalMs, refresh]);

  return {
    data,
    error,
    isLoading,
    isRefreshing,
    pipeline,
    refresh,
  };
}
