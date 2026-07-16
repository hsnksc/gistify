import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  WatchlistAlertRules,
  WatchlistCollectionWithItems,
} from "@shared/opportunities";

const LOCAL_KEYS = ["nmscanner_watchlist", "gistify:coverage:watch:v1"];
const DEFAULT_LIST_ID = "default";

type WatchlistMode = "loading" | "account" | "local";

function readLocalTickers() {
  if (typeof window === "undefined") return [];
  const tickers = new Set<string>();
  for (const key of LOCAL_KEYS) {
    try {
      const raw = window.localStorage.getItem(key);
      const parsed = raw ? (JSON.parse(raw) as unknown) : [];
      if (Array.isArray(parsed)) {
        parsed.forEach(item => {
          if (typeof item === "string" && item.trim()) {
            tickers.add(item.trim().toUpperCase());
          }
        });
      }
    } catch {
      // A malformed legacy cache should not block the watchlist surface.
    }
  }
  return Array.from(tickers);
}

function persistLocalTickers(tickers: string[]) {
  if (typeof window === "undefined") return;
  const value = JSON.stringify(Array.from(new Set(tickers)).sort());
  LOCAL_KEYS.forEach(key => window.localStorage.setItem(key, value));
  window.dispatchEvent(new CustomEvent("gistify:watchlists-changed"));
}

function localList(tickers: string[]): WatchlistCollectionWithItems {
  const nowIso = new Date().toISOString();
  return {
    id: DEFAULT_LIST_ID,
    userId: "local",
    name: "Favoriler",
    color: "#f59e0b",
    isDefault: true,
    createdAt: nowIso,
    updatedAt: nowIso,
    items: tickers.map(ticker => ({
      id: `local:${ticker}`,
      listId: DEFAULT_LIST_ID,
      userId: "local",
      email: "",
      ticker,
      tags: [],
      alertRules: { opportunity: false, signalChange: false },
      addedAt: nowIso,
      updatedAt: nowIso,
    })),
  };
}

async function readPayload(response: Response) {
  const payload = (await response.json().catch(() => ({}))) as {
    error?: string;
    lists?: WatchlistCollectionWithItems[];
  };
  if (!response.ok) {
    throw new Error(payload.error || "Watchlist istegi basarisiz oldu.");
  }
  return payload;
}

export function useAccountWatchlists() {
  const [mode, setMode] = useState<WatchlistMode>("loading");
  const [lists, setLists] = useState<WatchlistCollectionWithItems[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pendingTicker, setPendingTicker] = useState<string | null>(null);

  const load = useCallback(async () => {
    const localTickers = readLocalTickers();
    try {
      const response = await fetch("/api/watchlists", {
        cache: "no-store",
        credentials: "include",
      });
      if (response.status === 401) {
        setLists([localList(localTickers)]);
        setMode("local");
        setError(null);
        return;
      }

      let payload = await readPayload(response);
      const defaultTickers = new Set(
        payload.lists?.find(list => list.id === DEFAULT_LIST_ID)?.items.map(
          item => item.ticker
        ) || []
      );
      const missingLocalTickers = localTickers.filter(
        ticker => !defaultTickers.has(ticker)
      );
      for (const ticker of missingLocalTickers) {
        const migrationResponse = await fetch(
          `/api/watchlists/${DEFAULT_LIST_ID}/items`,
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ticker }),
          }
        );
        payload = await readPayload(migrationResponse);
      }

      setLists(payload.lists || []);
      setMode("account");
      setError(null);
    } catch (loadError) {
      setLists([localList(localTickers)]);
      setMode("local");
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Watchlist yuklenemedi."
      );
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const handleLocalChange = () => {
      if (mode === "local") setLists([localList(readLocalTickers())]);
    };
    window.addEventListener("storage", handleLocalChange);
    window.addEventListener("gistify:watchlists-changed", handleLocalChange);
    return () => {
      window.removeEventListener("storage", handleLocalChange);
      window.removeEventListener("gistify:watchlists-changed", handleLocalChange);
    };
  }, [mode]);

  const mutate = useCallback(
    async (path: string, init: RequestInit) => {
      const response = await fetch(path, {
        ...init,
        credentials: "include",
        headers: {
          ...(init.body ? { "Content-Type": "application/json" } : {}),
          ...init.headers,
        },
      });
      const payload = await readPayload(response);
      setLists(payload.lists || []);
      setError(null);
      return payload;
    },
    []
  );

  const toggleTicker = useCallback(
    async (ticker: string, listId = DEFAULT_LIST_ID) => {
      const normalizedTicker = ticker.trim().toUpperCase();
      const selectedList = lists.find(list => list.id === listId);
      const isIncluded = Boolean(
        selectedList?.items.some(item => item.ticker === normalizedTicker)
      );
      setPendingTicker(normalizedTicker);
      try {
        if (mode === "local") {
          const tickers = readLocalTickers();
          persistLocalTickers(
            isIncluded
              ? tickers.filter(item => item !== normalizedTicker)
              : [...tickers, normalizedTicker]
          );
          setLists([localList(readLocalTickers())]);
          return;
        }
        await mutate(
          `/api/watchlists/${encodeURIComponent(listId)}/items/${
            isIncluded ? encodeURIComponent(normalizedTicker) : ""
          }`.replace(/\/$/, ""),
          isIncluded
            ? { method: "DELETE" }
            : {
                method: "POST",
                body: JSON.stringify({
                  ticker: normalizedTicker,
                  alertRules: { opportunity: true, signalChange: true },
                }),
              }
        );
      } catch (mutationError) {
        setError(
          mutationError instanceof Error
            ? mutationError.message
            : "Watchlist guncellenemedi."
        );
        throw mutationError;
      } finally {
        setPendingTicker(null);
      }
    },
    [lists, mode, mutate]
  );

  const createList = useCallback(
    async (name: string) => {
      if (mode !== "account") {
        throw new Error("Coklu liste icin oturum acmaniz gerekir.");
      }
      const payload = await mutate("/api/watchlists", {
        method: "POST",
        body: JSON.stringify({ name }),
      });
      return payload.lists?.find(list => list.name === name) || null;
    },
    [mode, mutate]
  );

  const updateAlertRules = useCallback(
    async (listId: string, ticker: string, alertRules: WatchlistAlertRules) => {
      if (mode !== "account") {
        throw new Error("Uyarilar icin oturum acmaniz gerekir.");
      }
      await mutate(
        `/api/watchlists/${encodeURIComponent(listId)}/items/${encodeURIComponent(
          ticker
        )}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            alertRules: {
              ...alertRules,
              convictionAbove: alertRules.convictionAbove ?? null,
              priceAbove: alertRules.priceAbove ?? null,
              priceBelow: alertRules.priceBelow ?? null,
              earningsWithinDays: alertRules.earningsWithinDays ?? null,
            },
          }),
        }
      );
    },
    [mode, mutate]
  );

  const defaultList =
    lists.find(list => list.id === DEFAULT_LIST_ID) || lists[0] || null;
  const allTickers = useMemo(
    () =>
      new Set(
        lists.flatMap(list => list.items.map(item => item.ticker.toUpperCase()))
      ),
    [lists]
  );

  return {
    allTickers,
    createList,
    defaultList,
    error,
    isAuthenticated: mode === "account",
    isLoading: mode === "loading",
    lists,
    mode,
    pendingTicker,
    reload: load,
    toggleTicker,
    updateAlertRules,
  };
}
