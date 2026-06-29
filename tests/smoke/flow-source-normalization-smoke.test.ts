import { describe, expect, it } from "vitest";
import { createFlowSourcePackageFromContent } from "../../server/dailyReportSources";
import { extractFlowTickerUniverseFromText } from "../../shared/flowInference";

describe("flow source normalization smoke", () => {
  it("extracts multiple flow tickers from inline source text", () => {
    expect(
      extractFlowTickerUniverseFromText(
        "10-Stock Analysis Report | $AMD $NEE $NVDA $PFE $PLTR"
      )
    ).toEqual(["AMD", "NEE", "NVDA", "PFE", "PLTR"]);
  });

  it("preserves markdown flow reports while extracting post metadata", () => {
    const source = createFlowSourcePackageFromContent({
      fileName: "META_Guncel_Durum_Raporu_11Haziran2026.md",
      sourceLabel: "flow/META_Guncel_Durum_Raporu_11Haziran2026.md",
      markdown: `
# Meta AI Growth Update - 11 Haziran 2026

**Site:** https://investor.atmeta.com/
**Tarih:** 11 Haziran 2026

## Ozet

Meta, yeni AI altyapi yatirimlarini hizlandirirken $META hissesi icin gelir gorunumu gucleniyor.

Bu not, reklam talebi, capex disiplini ve yeni urun yayinlarinin ayni anda hisseyi destekledigini anlatiyor.

## Kapsam

$META uzerinden AI, reklam ve platform gelirleri degerlendirildi.
      `,
    });

    expect(source.contentFormat).toBe("markdown");
    expect(source.tickerUniverse).toContain("META");
    expect(source.metadataItems).toEqual(
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
    expect(source.headline.length).toBeGreaterThan(10);
    expect(source.markdown.length).toBeGreaterThan(200);
  });

  it("preserves rich flow html sources as full html reports", () => {
    const source = createFlowSourcePackageFromContent({
      fileName: "daily-10-hisse-analiz-28-haziran-2026.html",
      sourceLabel: "flow/daily-10-hisse-analiz-28-haziran-2026.html",
      html: `
<!doctype html>
<html>
  <head>
    <title>10 Hisse Senedi Analiz Raporu</title>
    <meta property="og:site_name" content="x.com" />
  </head>
  <body>
    <main>
      <div class="hero-h">Growth/Momentum ve Rate-Sensitive Hisseler</div>
      <div class="hero-p">
        Bu rapor $AMD $NEE $NVDA $PFE $PLTR $SMCI $WMT tickerlarini ayni akis icinde toplar.
      </div>
      <div class="hero-p">
        Portfoy yapisi, momentum ve makro baglam ayni post icinde sade bir formatta sunulur.
      </div>
      <div class="price-date">28 Haziran 2026</div>
      <footer>Kaynak: https://x.com/gistify</footer>
    </main>
  </body>
</html>
      `,
    });

    expect(source.contentFormat).toBe("html");
    expect(source.tickerUniverse).toEqual(
      expect.arrayContaining(["AMD", "NEE", "NVDA", "PFE", "PLTR", "SMCI", "WMT"])
    );
    expect(source.headline).toContain("tickerlarini");
    expect(source.html).toContain("10 Hisse Senedi Analiz Raporu");
    expect(source.executiveSummary.length).toBeGreaterThanOrEqual(2);
  });
});
