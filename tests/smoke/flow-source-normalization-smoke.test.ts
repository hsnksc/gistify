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

  it("falls back to MARKET when a flow markdown has no stock ticker", () => {
    const source = createFlowSourcePackageFromContent({
      fileName: "generic-tech-note-29-haziran-2026.md",
      sourceLabel: "flow/generic-tech-note-29-haziran-2026.md",
      markdown: `
# Peugeot 308 Klima Teshis Notu

**Tarih:** 29 Haziran 2026

## Ozet

Bu belge herhangi bir hisse senedi degil, genel teknik bir ariza notudur.

Paragraf yapisi korunur ama Flow tarafinda sahte ticker uretilmemelidir.
      `,
    });

    expect(source.tickerUniverse).toEqual(["MARKET"]);
    expect(source.metadataItems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: "Ticker",
          value: "$MARKET",
        }),
      ])
    );
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
    expect(source.html).toContain('class="gistify-flow-source"');
    expect(source.html).not.toContain("<script");
    expect(source.executiveSummary.length).toBeGreaterThanOrEqual(2);
  });

  it("strips source chrome and keeps a single primary language body for html flow posts", () => {
    const source = createFlowSourcePackageFromContent({
      fileName: "daily-bilingual-note-29-haziran-2026.html",
      sourceLabel: "flow/daily-bilingual-note-29-haziran-2026.html",
      html: `
<!doctype html>
<html>
  <head>
    <title>Bilingual Flow Note | $QQQ</title>
    <style>.hero{color:#fff}</style>
  </head>
  <body>
    <header id="header">Global header</header>
    <aside id="sidebar">Sidebar links</aside>
    <main id="main">
      <div id="hero" class="hero">
        <h1 class="hero-h">QQQ Momentum Notu</h1>
      </div>
      <div id="content-tr" class="lang-content">
        <section id="tr-1">
          <h2>Turkce Ozet</h2>
          <p>Bu blok sitede kalmali.</p>
        </section>
      </div>
      <div id="content-en" class="lang-content">
        <section id="en-1">
          <h2>English Summary</h2>
          <p>This block should not survive canonical source normalization.</p>
        </section>
      </div>
    </main>
    <footer id="footer">Footer text</footer>
    <script>window.setLang('en')</script>
  </body>
</html>
      `,
    });

    expect(source.html).toContain("QQQ Momentum Notu");
    expect(source.html).toContain("Turkce Ozet");
    expect(source.html).not.toContain("English Summary");
    expect(source.html).not.toContain("Global header");
    expect(source.html).not.toContain("Sidebar links");
    expect(source.html).not.toContain("Footer text");
    expect(source.html).not.toContain("<script");
  });

  it("prefers embedded html dates over generated file-name dates", () => {
    const source = createFlowSourcePackageFromContent({
      fileName: "daily-generated-29-haziran-2026.html",
      sourceLabel: "flow/daily-generated-29-haziran-2026.html",
      html: `
<!doctype html>
<html>
  <head>
    <title>Macro Note | $SPY</title>
  </head>
  <body>
    <header>
      <div class="meta">Published: 2026-06-17 · Flow internal note</div>
    </header>
    <main>
      <div class="hero-p">
        SPY ve QQQ icin piyasa notu. Uretim dosya tarihi sonradan degisse bile kartta gercek rapor tarihi korunmali.
      </div>
    </main>
  </body>
</html>
      `,
    });

    expect(source.reportDate).toBe("2026-06-17");
    expect(source.metadataItems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: "Haber Tarihi",
          value: "Published: 2026-06-17 · Flow internal note",
        }),
      ])
    );
  });
});
