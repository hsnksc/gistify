import { useCallback, useEffect, useState } from "react";
import { copy, type AppLanguage } from "@/lib/i18n";
import type { CalendarData } from "@shared/calendar";

const SNAPSHOT_REFRESH_INTERVAL_MS = 60 * 1000;

export function useCalendarData(language: AppLanguage) {
  const [data, setData] = useState<CalendarData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const loadData = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      setRefreshing(true);

      try {
        const response = await fetch("/api/calendar", {
          cache: "no-store",
          credentials: "include",
        });

        if (!response.ok) {
          const payload =
            ((await response.json().catch(() => null)) as {
              error?: string;
            } | null) || null;
          throw new Error(
            payload?.error ||
              copy(
                language,
                "Ekonomik takvim verisi yuklenemedi.",
                "Failed to load the economic calendar."
              )
          );
        }

        setData((await response.json()) as CalendarData);
        setError(null);
      } catch (loadError) {
        setError(
          loadError instanceof Error && loadError.message
            ? loadError.message
            : copy(
                language,
                "Ekonomik takvim verisi yuklenemedi.",
                "Failed to load the economic calendar."
              )
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [language]
  );

  useEffect(() => {
    void loadData();
  }, [loadData]);

  useEffect(() => {
    if (!autoRefresh) return;
    const timer = window.setInterval(
      () => void loadData(true),
      SNAPSHOT_REFRESH_INTERVAL_MS
    );
    return () => window.clearInterval(timer);
  }, [loadData, autoRefresh]);

  return {
    data,
    loading,
    refreshing,
    error,
    autoRefresh,
    setAutoRefresh,
    loadData,
  };
}
