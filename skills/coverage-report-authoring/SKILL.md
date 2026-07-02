---
name: coverage-report-authoring
description: Write equity, earnings, and options research as coverage-compatible markdown for Gistify's `/coverage` renderer. Use when raw notes, web research, or analyst commentary must become a clean markdown report that renders well in the custom Coverage parser instead of generic markdown or HTML. Trigger for prompts like "write a coverage report", "format this research for coverage", "turn these notes into a renderable report", "prepare markdown for Gistify coverage", or "convert my research into a scannable stock/options report".
---

# Coverage-compatible report authoring

Your job is to output **only final markdown** that renders cleanly in Gistify Coverage.

The Coverage page does **not** use a full markdown engine. It uses a custom parser with a small supported block set. If you output generic markdown, nested formatting, or HTML-heavy layouts, the page will look weak or break structurally.

## Supported output contract

Use only these blocks:

- YAML frontmatter
- `#` H1 title
- `##` and `###` headings
- short paragraphs
- `>` blockquotes
- flat `-` bullet lists
- flat `- [ ]` checklists
- pipe tables
- inline `**bold**`, `` `code` ``, and `[label](https://...)` links

Do **not** use:

- raw HTML
- images
- ordered lists
- nested lists
- nested blockquotes
- footnotes
- horizontal rules
- markdown tables with merged cells
- code fences unless explicitly asked

## Required frontmatter

Always start with:

```yaml
---
ticker: NVDA
company: NVIDIA Corporation
exchange: NASDAQ
date: 2026-07-02
type: earnings-option-play
signal: SPEC-BULLISH
sector: Semiconductors
---
```

Rules:

- `ticker` must be uppercase.
- `date` must be `YYYY-MM-DD`.
- Use one clear `signal` string such as `SPEC-BULLISH`, `TACTICAL-BULLISH`, `NEUTRAL`, `TACTICAL-BEARISH`.
- If a field is unknown, omit it rather than inventing.

## Required report shape

Use this section order unless the user asks otherwise:

1. H1 title with company and ticker
2. metadata table
3. `## 1. Executive Summary`
4. `## 2. Positioning`
5. `## 3. Financial / Operating Snapshot`
6. `## 4. Catalysts and Risks`
7. `## 5. Options Structure` or `## 5. Trade Structure`
8. `## 6. Watchlist`
9. `## 7. Timeline`
10. `## 8. Sources`

If the content is simpler, compress sections but keep the same logic.

## Visual writing rules

The renderer looks best when the markdown is highly structured.

- Put the single most important trade idea or thesis in a `>` blockquote under Executive Summary.
- Use a metadata table immediately after the H1.
- Use tables for all comparisons, numeric grids, peer matrices, option chains, timelines, and scenario summaries.
- Use bullet lists for takeaways and risk lists.
- Use checklists only for actionable monitoring items.
- Keep paragraphs to **2-3 sentences max**.
- Prefer 3-6 bullets, not 10-15.
- Use descriptive section titles, not generic filler.

## Metadata table standard

After the H1, use a 2-column table like this when data exists:

```md
| **Rapor Tarihi** | 2026-07-02 |
| **Mevcut Fiyat** | 85.69 USD |
| **Fiyat Degisimi** | -13.92% |
| **52 Haftalik Aralik** | 63.80 - 166.22 |
| **Earnings Tarihi** | 2026-08-11 |
| **Opsiyon Vadesi** | 2026-08-21 |
| **Analyst Hedef Ortalama** | 143.41 |
| **IV (Mutlak)** | 96.2% |
| **Short % of Float** | 15.42% |
| **RSI 14** | 31.7 |
| **Butce** | 150 USD |
```

Only include rows backed by actual data.

## Table rules

For tables:

- Always include a header row.
- Always include a separator row.
- Keep column names short.
- Use numeric values consistently.
- Use ISO dates in timeline tables.
- Use plain text cells; do not embed multiline markdown inside cells.

Preferred table types:

- quarterly results
- peer comparisons
- catalyst matrices
- option structure comparison
- scenario / P&L matrix
- timeline

## Research-to-report transformation

When given messy notes or web research:

1. Extract the thesis.
2. Separate facts from opinion.
3. Convert repeated numeric facts into tables.
4. Convert monitoring items into a checklist.
5. Convert the best one-line conclusion into a quote block.
6. Drop any unsupported formatting instead of trying to preserve it.

## Output quality bar

Before finalizing, verify:

- Frontmatter exists and is valid.
- H1 exists.
- Every section is scannable.
- No paragraph is too long.
- Important numbers are surfaced in tables.
- Dates use `YYYY-MM-DD` where possible.
- No unsupported markdown features remain.
- No fabricated values were introduced.

## Fallback behavior

If data is incomplete:

- keep the structure
- omit unknown rows
- use shorter sections
- do not invent prices, dates, strike values, or consensus figures

## Final instruction

Return the report as **markdown only**.
Do not add explanations before or after the markdown.
