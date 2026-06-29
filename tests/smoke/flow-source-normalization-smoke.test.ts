import { describe, expect, it } from "vitest";
import { listDailyReportSourcePackages } from "../../server/dailyReportSources";
import { extractFlowTickerUniverseFromText } from "../../shared/flowInference";

describe("flow source normalization smoke", () => {
  it("extracts multiple flow tickers from inline source text", () => {
    expect(
      extractFlowTickerUniverseFromText(
        "10-Stock Analysis Report | $AMD $NEE $NVDA $PFE $PLTR"
      )
    ).toEqual(["AMD", "NEE", "NVDA", "PFE", "PLTR"]);
  });

  it("normalizes tracked flow markdown into the simple flow post format", () => {
    const source = listDailyReportSourcePackages().find(
      item =>
        item.sourceLabel === "flow/META_Guncel_Durum_Raporu_11Haziran2026.md"
    );

    expect(source).toBeTruthy();
    expect(source?.contentFormat).toBe("markdown");
    expect(source?.tickerUniverse).toContain("META");
    expect(source?.metadataItems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: "Site",
          value: "investor.atmeta.com",
        }),
        expect.objectContaining({
          label: "Ticker",
          value: "$META",
        }),
      ])
    );
    expect(source?.markdown).toContain("**Site:** investor.atmeta.com");
    expect(source?.markdown).toContain("**Ticker:** $META");
    expect(source?.markdown).toContain("## Ozet");
  });
});
