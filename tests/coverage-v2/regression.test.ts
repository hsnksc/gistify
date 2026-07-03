import { describe, expect, it } from "vitest";
import {
  parseCoverageReport,
  type CoverageReport,
} from "@/features/coverage/lib/coverageParser";
import { getCoverageSeedRecords } from "@/features/coverage/lib/coverageSeed";

/**
 * Faz 4 — Geriye dönük uyumluluk kanıtı.
 *
 * Viz DSL'si içermeyen eski raporlar yeni parser'dan geçtiğinde:
 * - Hiçbir `viz` bloğu üretilmemeli.
 * - Bölüm sayısı ve başlıkları korunmalı.
 * - Mevcut blok tipleri (paragraph, list, table, checklist, quote) aynı kalmalı.
 */
describe("coverage parser backward compatibility", () => {
  const seedRecords = getCoverageSeedRecords();
  const reports = seedRecords.map(record => parseCoverageReport(record));

  it("has at least one seed report", () => {
    expect(reports.length).toBeGreaterThan(0);
  });

  it("does not produce viz blocks in legacy reports", () => {
    for (const report of reports) {
      const vizBlocks = report.sections.flatMap(section =>
        section.blocks.filter(block => block.type === "viz")
      );
      expect(vizBlocks, `report ${report.ticker} should not contain viz blocks`).toHaveLength(0);
    }
  });

  it("preserves all section titles from legacy reports", () => {
    const crwv = reports.find(r => r.ticker === "CRWV" && r.reportDate === "2026-07-02");
    expect(crwv).toBeDefined();
    expect(crwv!.sections.map(s => s.title)).toEqual([
      "Executive Summary",
      "Positioning",
      "Options Structure",
      "Watchlist",
      "Timeline",
      "Sources",
    ]);
  });

  it("preserves known block types in legacy reports", () => {
    const crwv = reports.find(r => r.ticker === "CRWV" && r.reportDate === "2026-07-02");
    expect(crwv).toBeDefined();

    const blockTypes = new Set(crwv!.sections.flatMap(s => s.blocks.map(b => b.type)));
    expect(blockTypes.has("quote")).toBe(true);
    expect(blockTypes.has("paragraph")).toBe(true);
    expect(blockTypes.has("list")).toBe(true);
    expect(blockTypes.has("table")).toBe(true);
    expect(blockTypes.has("checklist")).toBe(true);
  });
});
