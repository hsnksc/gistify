---
name: gistweekly
description: Compile ALL Flow news published from the previous Friday to this Friday into ONE bilingual (TR/EN) weekly report and publish it to the Weekly section (/weekly) of gistify.pro. Per-ticker fundamental analysis comes from the week's Flow news; technical analysis comes from real weekly price data (scripts/weekly_market_data.py); the report ends with concrete next-week trade setups (entry/stop/target from computed levels). Use whenever the user says "/gistweekly", "haftalık raporu oluştur", "haftalık raporu yayınla", "bu haftanın flow haberlerini derle", "weekly report from flow news", or asks for the week's Flow digest.
---

# gistweekly — haftalık Flow derlemesini /weekly bölümüne yayınla

Goal: take every Flow source published in the Saturday→Friday window, distill it into ONE
`flow/weekly-YYYY-MM-DD.html` (+ `.en.html`) report with news-driven fundamentals, computed
technicals, and next-week trade setups. **The `weekly-YYYY-MM-DD` filename prefix IS the routing switch**:
`FLOW_WEEKLY_SOURCE_PATTERN` in `shared/flowInference.ts` classifies it `reportKind: "weekly"`, which is
what the `/weekly` page (FlowWeeklyPage → `/api/flow-reports/summary?type=weekly`) lists. A different
filename silently lands the report in the regular stock/daily feeds instead.

Theme, chart generation, CSS-toggle patterns and no-`<script>` rules are **identical to /gistflow** —
read `.claude/skills/gistflow/SKILL.md` (and `flow/flowskill/SKILL.md`) first; this skill only describes
the weekly-specific pipeline.

## 0. Hafta penceresi ve kaynaklar

```powershell
node scripts/flow-verify.mjs --week              # en son Cuma ile biten Cumartesi..Cuma penceresi
node scripts/flow-verify.mjs --week 2026-07-10   # geçmiş bir haftayı derlemek için açık tarih
```

Output JSON: `window` (start/end), `tickers` (union), `sources[]` (sourceLabel, title, reportDate,
tickers). Previous weekly digests are auto-excluded, so the report never ingests itself.
**Read every listed source file** (the TR `.html`/`.md` is enough; skip `.en.html` siblings — same content).
The week-end Friday date from `window.end` is the report date and goes into the filename.

## 1. Ticker'ları küratörle

The `tickers` union contains inference noise (e.g. `EMA20`, `SAMSUNG`, `SKHYNIX`, index names). Keep only:
- real, price-fetchable tickers (US listings; BABA/TSM style ADRs fine),
- with **substantial dedicated analysis** in at least one source — a watchlist-table row is not coverage.

Target 6–12 core tickers. Everything else can still appear inside a theme paragraph, without its own card.

## 2. Teknik veri — hesaplanır, uydurulmaz

```powershell
python scripts/weekly_market_data.py AVGO NVDA MSFT ... --end 2026-07-10
```

Writes `data/weekly_research/weekly-{end}.json` (git-ignored) and prints a per-ticker summary line.
Read the JSON fully. Per ticker it contains: weekly OHLC + `changePct`, `fourWeekChangePct`,
SMA20/50/200 with above/below flags, `rsi14`, classic pivots (`p/r1/r2/s1/s2` — computed from THIS week's
HLC, i.e. next week's levels), 20/60-day swing high/lows, volume ratio, 52w distance.

- **Every technical number in the report comes from this JSON** (or from a flow source, with attribution).
  Never invent an RSI, level, or percentage.
- A ticker with `"error"` gets an honest "teknik veri alınamadı" note instead of a technicals block.
- `asOf` may be Thursday if Friday's bar isn't complete — state the as-of date in the report.

## 3. Temel analiz — yalnızca haftanın Flow kaynaklarından

Per core ticker: what happened this week (each claim traceable to a source in the window), why it matters,
bull vs bear reading. Cite the source report titles in a `Kaynak` table at the end (flow report titles +
their underlying outlets if named). No outside-the-window news, no memory-based "facts".

## 4. Rapor yapısı (TR + EN, aynı geometri)

Follow the gistflow gf-theme contract (own `<style>`, gf-* variables, no `<header>` chrome, no `<script>`).
Structure that works for a weekly:

1. **Hero** — `id="hero"` + `data-timestamp="<friday>T18:00:00+03:00"` (zorunlu; tarih çıkarımı buna dayanır).
   Title pattern: `Haftalık Rapor — <start> · <end> <year>` (EN: `Weekly Report — ...`). Meta-pills: kaynak
   sayısı, ticker sayısı, haftanın yönü.
2. **KPI row** — 4–6 kutu: en iyi/en kötü haftalık performans, SPX/ilgili endeks haftası, öne çıkan tema.
3. **Haftanın Temaları** — 2–4 cross-cutting tema kartı (haberlerden sentez).
4. **Ticker kartları** (core tickers) — her biri: haber özeti (temel), hesaplanan teknik durum
   (haftalık %, RSI, SMA konumları), gelecek hafta seviyeleri (pivot S1/S2–R1/R2, swing seviyeleri).
5. **Gelecek Hafta Fırsatları** — ranked setup tablosu: yön (Alım/Satım/İzle), giriş bölgesi, stop, hedef —
   **all levels from the computed pivots/swings or source-stated levels**, each row labeled senaryo/plan,
   not kesin öneri. Bir `.insight-box.warn` ile "koşullu senaryolardır" notu.
6. **Disclaimer** — standart "yatırım tavsiyesi değildir" paragrafı.

## 5. Grafikler

`scripts/flow-chartgen.mjs` ile (bkz. gistflow §2). Weekly için doğal setler:
- `horizontalBar`: core ticker'ların haftalık % değişimi (yeşil/kırmızı, endeks refLine ile),
- `priceLadder`: en güçlü 1–2 setup'ın pivot/swing seviyeleri (current = close),
- `range`: bear/base/bull hedefleri YALNIZCA kaynaklarda fiyat hedefi varsa.

Chart config `out` yolları Windows'ta **küçük harf `c:/` sürücüsüyle** yazılmalı, yoksa script yazmayı
reddediyor. TR/EN aynı geometri, yalnız metin farklı.

## 6. Dosya adı, dedupe, doğrulama

- Dosya: `flow/weekly-YYYY-MM-DD.html` + `flow/weekly-YYYY-MM-DD.en.html` (tarih = pencere Cuma'sı).
  Asla başka prefix/konum kullanma; `.tr.html` süffiksi yok.
- Aynı Cuma için dosya zaten varsa **yerinde güncelle** (ikinci dosya açma — duplicate kart yaratır).
- Verify:
  ```powershell
  node scripts/flow-verify.mjs flow/weekly-YYYY-MM-DD.html
  ```
  Confirm: tek kart, doğru `reportDate`, `contentFormat: "html"`, `availableLanguages: ["tr","en"]`,
  sanity satırları `ok` (SVG sayısı, token yok, `<script>` yok, hero timestamp var).
- Kod değiştirmediysen `tsc`/`build` gerekmez; shared/server/client'a dokunduysan gistflow §4'teki
  standart doğrulamayı çalıştır.

## 7. Staging & commit

Only `git add flow/weekly-*.html` (both languages). Suggested message:
`flow: weekly report YYYY-MM-DD (TR/EN)`. Do not commit or push unless the user asks; push alone
does not deploy — the VPS deploy step is separate (see deploy-server.md).
