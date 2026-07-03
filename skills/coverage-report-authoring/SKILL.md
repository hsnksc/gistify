---
name: coverage-report-authoring
description: Write Gistify `/coverage` reports as `coverage-md/1` compatible markdown. Use for equity, earnings, options, deep research, and any research that must render cleanly in the custom Coverage renderer instead of generic markdown.
---

# Coverage Report Authoring

Return **markdown only**.
Do not add commentary before or after the report.

The renderer is contract-driven. If the structure drifts, blocks fall back to plain tables or weak text output.

## Supported blocks

Use only:

- YAML frontmatter
- one `#` H1
- `##` and `###`
- short paragraphs
- `>` blockquotes
- flat `-` lists
- flat `- [ ]` checklists
- pipe tables
- inline `**bold**`, `` `code` ``, `[label](https://...)`

Do not use:

- raw HTML
- images
- ordered lists
- nested lists
- nested blockquotes
- footnotes
- horizontal rules
- code fences in the final report

## Required frontmatter

Start with:

```yaml
---
contract: coverage-md/1
ticker: NVDA
company: NVIDIA Corporation
exchange: NASDAQ
date: 2026-07-02
type: earnings-option-play
signal: SPEC-BULLISH
sector: Semiconductors
metrics:
  price: 171.22
strategy:
  name: 150/170 Call Debit Spread
  legs: 1x Long 150C + 1x Short 170C @ 2026-08-21
  cost: 220
  max_gain: 1780
  max_loss: 220
  breakeven: 152.20
---
```

Rules:

- `ticker` uppercase
- `date` in `YYYY-MM-DD`
- omit unknown fields instead of inventing values
- `metrics.price` and `date` are the minimum viable fields
- if `type` is `earnings-option-play`, `strategy` should be present when known

## Source name convention

Preferred saved filename / source name:

- `CRWV-2026-07-02.md`
- same-day second version: `CRWV-2026-07-02-b.md`

## Required skeleton

Use this default order unless the user asks for another shape:

1. `# Company (TICKER) - report title`
2. metadata table
3. `## 1. Executive Summary`
4. `## 2. Technical Setup / Positioning`
5. `## 3. Financial or Operating Snapshot`
6. `## 4. Ecosystem / Catalysts / Risks`
7. `## 5. Options Structure` or `## 5. Trade Structure`
8. `## 6. Timeline`
9. `## 7. Watchlist`
10. `## 8. Sources`

## Required render triggers

Use these exact table signatures when relevant:

- `Strike | Bid | Ask`
options chain heatmap

- `Hisse Fiyati | P&L`
payoff chart

- `Seviye | Tur | Guc`
level ladder

- `Donem | EPS Tahmin | EPS Gercek`
earnings history chart

- `Tarih | Olay`
catalyst timeline

- `Sirket | Ticker | Iliski | Onem | Detay`
ecosystem chips

- first column `Kriter`
comparison matrix

- first column `Senaryo`
scenario cards

- `Katalizor | Etki`
catalyst grid

- `Kaynak | URL`
source cards

## Required text triggers

- Under executive summary, put the main thesis or trade call in a `>` blockquote.
- For probability bars, use flat bullets like:
`- %70 olasilik: Spread degersiz kapanir`
- For persistent watchlists, use:
`### Kirmizi Bayraklar`
`### Yesil Bayraklar`
and only flat `- [ ]` checklist items under them.

## Metadata table rule

Immediately after the H1, use a 2-column metadata table when data exists.

```md
|  |  |
|---|---|
| **Rapor Tarihi** | 2026-07-02 |
| **Mevcut Fiyat** | 171.22 USD |
| **Earnings Tarihi** | 2026-08-21 |
| **Opsiyon Vadesi** | 2026-08-21 |
| **IV (Mutlak)** | 62.4% |
| **Short % of Float** | 3.2% |
| **Butce** | 220 USD |
```

## Quality bar

Before finalizing, verify:

- frontmatter is present and valid
- H1 exists
- no unsupported markdown remains
- important numbers are inside tables
- dates are ISO where possible
- no fabricated values were introduced
- table signatures exactly match the intended renderer block

## Final rule

Return only the final markdown report.
