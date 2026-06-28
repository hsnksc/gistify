import fs from "node:fs";
import path from "node:path";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import EarningReportRiskTab from "@/components/tabs/EarningReportRiskTab";
import { parseEarningReportMarkdown } from "@/lib/earningReportSource";
import { parseStructuredEarningsStrategyMarkdown } from "@shared/earningReportStructured";

const FIXTURE_PATH = path.resolve(
  import.meta.dirname,
  "..",
  "..",
  "earningreport",
  "202606_202607_Earnings_Opsiyon_Master_Stratejisi.md"
);

function readFixture() {
  return fs.readFileSync(FIXTURE_PATH, "utf-8");
}

describe("earnings workspace smoke", () => {
  it("parses the structured earnings strategy markdown fixture", () => {
    const markdown = readFixture();
    const report = parseStructuredEarningsStrategyMarkdown(
      markdown,
      "earningreport/202606_202607_Earnings_Opsiyon_Master_Stratejisi.md"
    );

    expect(report).not.toBeNull();
    expect(report?.meta.title).toContain("Earnings Strategy Report");
    expect(report?.calendar.length).toBeGreaterThan(0);
    expect(report?.strategies.length).toBeGreaterThan(0);
    expect(report?.portfolioLevels.length).toBeGreaterThan(0);
  });

  it("adapts the markdown fixture into the app report source model", () => {
    const markdown = readFixture();
    const source = parseEarningReportMarkdown(
      markdown,
      "earningreport/202606_202607_Earnings_Opsiyon_Master_Stratejisi.md"
    );

    expect(source.positions.length).toBeGreaterThan(0);
    expect(source.tradeSchedule.length).toBeGreaterThan(0);
    expect(source.risks.length).toBeGreaterThan(0);
    expect(source.reportDate).not.toBe("-");
    expect(source.vixLabel).not.toBe("");
  });

  it("renders the risk tab for a parsed earnings report without crashing", () => {
    const markdown = readFixture();
    const source = parseEarningReportMarkdown(
      markdown,
      "earningreport/202606_202607_Earnings_Opsiyon_Master_Stratejisi.md"
    );

    const html = renderToStaticMarkup(
      React.createElement(EarningReportRiskTab, {
        language: "tr",
        report: source,
      })
    );

    expect(html).toContain("Risk yonetimi ve pozisyon yapisi");
    expect(html).toContain(source.positions[0]?.ticker || "");
  });
});
