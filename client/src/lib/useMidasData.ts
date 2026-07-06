import { useEffect, useState } from "react";

export interface MidasListItem {
  ticker: string;
  status: string;
  mss: number;
  mssAdjusted: number;
  grade: string;
  phase: string;
  changePct: number;
  volumeRatio: number;
  rsi14: number;
  vwapDistancePct: number;
  ivRank: number;
}

export interface MidasHolding {
  ticker: string;
  avgCost: number;
  qty: number;
  currentPrice: number;
  unrealizedPct: number;
  mss: number;
  mssAdjusted: number;
  grade: string;
  phase: string;
  action: string;
  actionReason: string;
}

export interface MidasData {
  schemaVersion: string;
  generatedAt: string;
  marketPhase: string;
  marketRegime: {
    phase: string;
    vix: number;
    spyChange5dPct: number;
    qqqChange5dPct: number;
    fearGreed: number;
  };
  listRanking: MidasListItem[];
  holdings: MidasHolding[];
  buyCandidates: MidasListItem[];
  loading: boolean;
  error: string | null;
}

export function useMidasData(): MidasData {
  const [data, setData] = useState<MidasData>({
    schemaVersion: "",
    generatedAt: "",
    marketPhase: "",
    marketRegime: { phase: "", vix: 0, spyChange5dPct: 0, qqqChange5dPct: 0, fearGreed: 0 },
    listRanking: [],
    holdings: [],
    buyCandidates: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const response = await fetch(`/marketflash/marketflash_midas.json?t=${Date.now()}`, {
          cache: "no-store",
          credentials: "same-origin",
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const raw = await response.json();
        setData({
          schemaVersion: raw.schemaVersion || "",
          generatedAt: raw.generatedAt || "",
          marketPhase: raw.marketPhase || "",
          marketRegime: raw.marketRegime || { phase: "", vix: 0, spyChange5dPct: 0, qqqChange5dPct: 0, fearGreed: 0 },
          listRanking: Array.isArray(raw.listRanking) ? raw.listRanking : [],
          holdings: Array.isArray(raw.holdings) ? raw.holdings : [],
          buyCandidates: Array.isArray(raw.buyCandidates) ? raw.buyCandidates : [],
          loading: false,
          error: null,
        });
      } catch (err) {
        if (!controller.signal.aborted) {
          setData((d) => ({ ...d, loading: false, error: err instanceof Error ? err.message : "Failed to load" }));
        }
      }
    }

    void load();
    return () => controller.abort();
  }, []);

  return data;
}
