import type { MomentumReportEntry, MomentumReportRecord } from "@shared/momentumReports";
import type { StockResult } from "@/scanner/types";

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function mapStockResultToMomentumEntry(
  stock: StockResult,
  index: number
): MomentumReportEntry {
  return {
    id: `${stock.ticker.toLowerCase()}-${index + 1}`,
    ticker: stock.ticker,
    name: stock.name,
    sector: stock.sector,
    currentPrice: stock.currentPrice,
    priceChangePct: stock.priceChangePct,
    volumeRatio: stock.volumeRatio,
    rsi: stock.rsi,
    score: stock.score,
    signal: stock.signal,
    confidenceScore: stock.confidenceScore || 0,
    targetPrice: stock.targetPrice,
    catalystSummary:
      stock.catalystSummary ||
      stock.scoreExplanations?.[0]?.reason ||
      undefined,
    adminNote: "",
  };
}

export function createEmptyMomentumReportDraft(
  authorEmail: string,
  existing?: MomentumReportRecord | null
) {
  const nowIso = new Date().toISOString();
  const reportDate = nowIso.slice(0, 10);
  const title = existing?.title || "Momentum Snapshot";

  return {
    id: existing?.id || `momentum-${Date.now()}`,
    slug: existing?.slug || slugify(`${reportDate}-${title}`),
    title,
    reportDate,
    status: existing?.status || "draft",
    authorEmail,
    createdAt: existing?.createdAt || nowIso,
    updatedAt: nowIso,
    publishedAt: existing?.publishedAt,
    content: existing?.content || {
      headline: "Acilis momentumu one cikan setup'lar",
      summary:
        "Tarama sonucu secilen isimler admin tarafindan incelenip yayinlanacak.",
      marketContext:
        "Gunun piyasa yapisi, risk istahi ve sector leadership notlari burada tutulur.",
      executionNotes:
        "Entry, sizing ve invalidation notlari burada tutulur.",
      scannerUniverse: "Default liquid universe",
      scanTime: undefined,
      featuredEntries: [],
    },
  } satisfies MomentumReportRecord;
}

export function applyScanResultsToMomentumDraft(
  report: MomentumReportRecord,
  results: StockResult[],
  universeLabel: string,
  maxEntries = 8
) {
  const featuredEntries = results
    .slice(0, maxEntries)
    .map(mapStockResultToMomentumEntry);

  return {
    ...report,
    updatedAt: new Date().toISOString(),
    content: {
      ...report.content,
      scannerUniverse: universeLabel,
      scanTime: new Date().toISOString(),
      featuredEntries,
    },
  } satisfies MomentumReportRecord;
}
