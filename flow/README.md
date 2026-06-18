Drop markdown or HTML reports into `flow/` when you want them to appear on the Flow report surfaces.

How it works
- Every `*.md` or `*.html` file in `flow/` or its subfolders becomes one source package.
- Reports are parsed automatically: stock reports are grouped by ticker, daily market reports are grouped under **Daily Reports**.
- Flow reports are published automatically; there is no manual `/reports-admin` draft step.
- Keep the file name stable after the first publish; published records are linked to that source key.
- Optional local images can live next to the markdown/HTML file and be referenced with normal relative paths like `![Chart](chart-1.png)`.

Classification rules
- A report is treated as a **daily market report** when its title contains market keywords such as `ABD Piyasaları`, `US Markets`, `Market Report`, `Pre-Market`, `Günlük Rapor`, `ABD Borsaları`, `Momentum Analizi`, etc.
- Everything else is treated as a **stock report**. The ticker is extracted from:
  - `TICKER — Company` title format
  - `Company (TICKER)` title format
  - `Ticker: TICKER` text
  - Known aliases such as `Meta`, `Robinhood`, `Palantir`, `Western Digital`, `Intel`

Expected metadata for markdown reports
- `# Title` on the first heading line
- `**Tarih:** 12 Haziran 2026`
- `**Hazirlayan:** Name`
- `**Kapsam:** US equities, macro, sector rotation`
- `**Metodoloji:** Manual desk synthesis + charts`
- Optional `**Ticker:** META` to help the parser group the report correctly
- `## Ozet` or `## Executive Summary`

Use `flow/_template.md` as the base format for new markdown files.
