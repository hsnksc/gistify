---
name: flowskill
description: Ingest, normalize, and publish anything dropped into `flow/` as a polished, user-friendly Flow post — using one consistent theme and generating charts/graphics when (and only when) data warrants them. Use whenever a new file appears in `flow/` in ANY format — `.md`, `.txt`, `.html`, `.json`, `.csv`/`.tsv`, images (`.png`/`.jpg`), `.pdf`, or pasted news/social snippets — and it must become a clean, readable post on `/flow` that looks like every other Flow report. The core job: turn raw notes / news text / data into a scannable post with a clear headline, summary, key takeaways, surfaced numbers, and — where the content contains chartable data — a themed chart. Also use when unpushed `flow/` files must be published, when a report/news item needs the correct ticker card/archive (or the shared `MARKET` bucket), or when the Flow parser/normalizer/renderer/theme integration must be adjusted before commit and push. Trigger this for any phrasing like "flow'a haber/rapor ekle", "şu dosyayı flow'da göster", "kullanıcı dostu post yap", "grafikli göster", "anlaşılır hale getir", "publish flow report", "normalize this into Flow", or "fix ticker grouping" — even if the user does not say the word "skill" or "report".
---

# Flow ingest, post-building & visualization

Treat `flow/` as a **source inbox**. Anything the user drops there is raw input that must become a **published, user-friendly Flow post**.

The number-one goal of this skill: take whatever arrives — often a loose `.md` note, a block of pasted news text, or a small data file — and turn it into a **clean, scannable, visually clear post** that any reader can understand at a glance. Visual consistency and readability are the whole point. Two things follow:

1. **No item ever renders outside the Flow theme**, and
2. **Every item is shaped into a readable post**, not dumped as raw text — with a chart added *when the content contains data worth charting*, and deliberately *no* chart when it doesn't.

In this skill, a **"post"** (a.k.a. report) means any published Flow item: a formal report, a news brief, a data highlight, or a short snippet — always themed, always readable, grouped under the right ticker or `MARKET`, with TR/EN switching and the community panel on its detail page.

---

## 0. The canonical Flow post (the target shape)

Every input must end up expressible as one canonical object. This is the contract with the publish layer (`server/dailyReportSources.ts`).

```
CanonicalFlowReport {
  sourceLabel   : "flow/<original-filename>"   // provenance, always starts with "flow/"
  title         : string                        // clear, specific headline (the "so what")
  reportDate    : "YYYY-MM-DD"
  tickerUniverse: string[]                       // ["NVDA"] | ["AAPL","MSFT"] | ["MARKET"]
  contentFormat : "html" | "markdown"            // a format the renderer understands
  language      : "tr" | "en" | "bilingual"
  body          : themed, readable post          // headline + summary + sections + (optional) chart/figure blocks
}
```

- The publish layer understands a limited set of `contentFormat` values (currently `html` and `markdown`), so every ingest path must **terminate** in one of those. JSON, CSV, images, and PDF are *intermediate* — they get transformed, never published as-is.
- Charts live **inside** `body` as declarative chart blocks/figures (see **Visualization & charts**) — `contentFormat` stays `html`/`markdown`.
- The original uploaded file stays in `flow/` as the **source of truth**. Normalization produces the published post; it never destroys the input.

---

## Core workflow

1. **Inventory `flow/` first.**
   Run `Get-ChildItem -Recurse flow` and compare with `git status --short` to see what is new or unpushed.

2. **Classify each new file by format + intent.**
   Determine (a) its *format* (drives the Format Matrix path) and (b) its *intent*: single stock, several stocks, or overall market.

3. **Ignore non-report assets.**
   Do not ingest `flow/README.md`, `flow/_template.md`, plan files, or anything under `flow/flowskill/`.

4. **Normalize the raw content.**
   Convert the file to clean content using the matching **Format Matrix** entry (extract text/tables, strip foreign markup, parse structured data). This produces *clean material*, not yet a finished post.

5. **Rewrite it into a user-friendly post.**  ← *core step*
   Shape the clean material into the **Post structure** (clear headline, short summary, scannable takeaways, descriptive sections, surfaced numbers, key insight as a callout). Scale the effort to how rough the input is (see that section). This is what makes Flow readable — never publish a raw paragraph dump.

6. **Add visuals only where they aid understanding.**  ← *core step*
   Apply the **Visualization & charts** decision rule. If the content contains chartable data (a trend, a comparison, periodic figures, a composition), generate a themed chart. If it is purely qualitative or has a single stray number, use a stat badge or callout instead — **do not force a chart**, and never fabricate data to fill one.

7. **Detect and assign tickers (or `MARKET`).**
   Resolve `tickerUniverse` per **Ticker & market grouping**. Never invent a fake ticker.

8. **Detect language and wire TR/EN.**
   Set `language` and structure the body so the TR/EN toggle behaves correctly (**Language / TR-EN handling**).

9. **Verify what Flow will publish.**
   Run:

   ```powershell
   node --experimental-strip-types -e "import('./server/dailyReportSources.ts').then(m => console.log(JSON.stringify(m.listDailyReportSourcePackages().filter(x => (x.sourceLabel||'').toLowerCase().startsWith('flow/')).map(x => ({ sourceLabel: x.sourceLabel, title: x.title, reportDate: x.reportDate, contentFormat: x.contentFormat, tickers: x.tickerUniverse })), null, 2)))"
   ```

   Confirm the new post appears with correct `title`, `reportDate`, `contentFormat`, and `tickers`. Fix the parser/normalizer if not — do not hand-edit the report file to paper over it.

10. **Keep everything inside the Flow theme.**
    Confirm the post opens inside the Flow layout, charts match the theme, TR/EN switching works, and the comments panel shows on the detail page.

11. **Validate before git operations.**
    Run:

    ```powershell
    corepack pnpm exec tsc --noEmit --skipLibCheck --incremental false
    corepack pnpm build
    ```

12. **Stage only relevant files.**
    Include the new `flow/` source files plus the parser/normalizer/renderer/UI files needed to publish and chart them. Never include unrelated deletions or untracked files from other folders.

13. **Commit and push only when requested.**
    Use a focused commit message (e.g. `flow: ingest NVDA earnings note (md) → post + quarterly chart`).

---

## Post structure — make it a readable post

This is the heart of "user-friendly." Every published post should be skimmable in seconds and understandable in full on a second pass.

**Standard post template (adapt, don't pad):**

```
[ticker badge] · [date]
# Clear, specific headline — the "so what", not the topic
**Özet / TL;DR:** 1–3 sentences capturing the single most important point.

## Key takeaways
- Lead each bullet with the point itself (3–6 bullets max)
- Keep them concrete; put standout numbers right in the bullet

## [Descriptive section heading]
Short paragraphs. Surface key numbers as inline stat highlights/badges.
Put the single most important conclusion in a callout.

[Chart or figure — ONLY if the content has chartable data]

## Source / context
Attribution, link, and timestamp where available.
```

**Readability rules:**
- **Front-load the conclusion.** The reader should get the point from the headline + summary alone.
- **Descriptive subheads**, never "Section 1" / "Part 2."
- **Short paragraphs** (2–4 sentences). Break walls of text.
- **Bullets** for lists of facts; **stat badges** for standout numbers (price, %, target); **callouts** for the one key insight.
- **Explain jargon** briefly the first time it appears.
- **Mobile-friendly:** assume the post may be read on a narrow screen — short lines, clear hierarchy, charts that stay legible small.

**Scale the transformation to the input (don't over-process):**
- **Rough input** (loose notes, raw pasted news, unstructured text) → **full restructure** into the template.
- **Already-clean, well-structured report** → **light touch**: preserve the author's structure and wording, just ensure the theme and add a chart only where data warrants. Don't fight a good source.
- Keep the post in the **source language**; translation is governed by **Language / TR-EN handling**, not by restructuring.

---

## Visualization & charts — when and how

A chart must earn its place by making the data easier to understand. A wrong, trivial, or fabricated chart is worse than none.

### Decide first: does this need a chart?

**Generate a chart when the content contains one of:**
- A **time series** (prices/values across dates) → line / area chart.
- A **comparison of several discrete values** (segments, multiple tickers) → bar / column chart.
- **Periodic figures** (quarterly/yearly earnings, growth) → column or line.
- A **composition that sums to ~100%** with few slices (≤5–6) → donut (use sparingly).
- A **before/after or change** with two-plus data points → comparison bar.

**Do NOT generate a chart when:**
- The content is **purely qualitative/narrative** — opinion, commentary, a single headline, a one-line update.
- There is a **single number with nothing to compare** → use a stat badge instead.
- A chart would only **decorate** without adding understanding → use a callout or pull quote.
- The data is **too sparse or incomplete** to chart honestly → show a small table or stat highlights.

When unsure, prefer a clean stat highlight over a weak chart.

### Chart-type quick map

| Data shape | Use |
|---|---|
| Trend over time | Line / area |
| Compare categories or tickers | Bar / column (grouped for multi-series) |
| Composition (sums to whole, few slices) | Donut |
| Single KPI / standout number | Stat card or badge (not a chart) |
| Two-point change | Delta highlight or mini bar |

### Rules for any chart you generate
- **Only chart numbers actually present in the source.** Never fabricate, estimate, or pad data to make a chart look fuller. If a series is partial, show what exists or fall back to a stat highlight.
- **Label everything:** axis/series labels, units (`%`, `$`, etc.), and a one-line caption stating the takeaway.
- **Match the Flow theme:** Flow colors, fonts, sizing; legible on mobile.
- **One clear chart beats several redundant ones.**

### How charts render in the Flow theme
- **Reuse the Flow workspace's existing chart component/library** if one exists, and match its theming. If none exists, add a small themed chart component rather than pulling in an off-theme library ad hoc.
- Because the published `contentFormat` is `html`/`markdown`, embed charts via a convention the Flow renderer can **hydrate** — e.g. a structured chart block (a fenced ```` ```flow-chart {…json…} ```` block) or a placeholder element (`<div data-flow-chart='…'></div>`) that the renderer swaps for the themed chart component. Keep the chart's data declarative inside that block so it stays re-renderable.
- If the renderer only emits static HTML, render the chart to **themed inline SVG** and embed it directly.
- Wire detection/hydration in `client/src/features/flow/lib/flowReportHelpers.ts` and the report renderer so chart blocks behave identically across all Flow posts.

---

## Format Matrix — how to ingest each input type

Each entry lists the **detection signal**, the **transform**, and where the **ticker** usually comes from. Data-bearing formats (json, csv, and any md/txt containing figures) feed steps 5–6, so they are the most likely to gain a chart. When several formats need real logic, add a dedicated normalizer (e.g. `server/flow/normalizeSource.ts`) and route by format.

### Markdown — `.md`
- **Detect:** `.md` extension / markdown syntax.
- **Transform:** parse front-matter into metadata; restructure body into the Post template (light touch if already clean). Pull any inline figures into chart candidates.
- **Ticker from:** front-matter `tickers:`, first heading, or inline `$TICKER`. Publish as `markdown` (or `html` once charts are embedded).

### Plain text — `.txt`
- **Detect:** `.txt`, no markup.
- **Transform:** treat as loose notes → **full restructure** into the Post template. First strong line → headline; blank lines split paragraphs; bare URLs → links; numbers/comparisons → chart candidates.
- **Ticker from:** explicit mention; else lean `MARKET`.

### HTML — full document
- **Detect:** `<html>`/`<head>`/full skeleton.
- **Transform:** extract the main content region; strip page-global CSS/JS, nav, headers/footers; sanitize; then apply Post structure if the content is rough, or light-touch if it's already a clean themed report.
- **Ticker from:** `<title>`, headings, `og:`/meta. Publish as `html`.
- **Gotcha:** if it already uses the correct Flow theme, wire metadata only — don't restyle.

### HTML — fragment / partial
- **Detect:** body-level markup, no `<html>`.
- **Transform:** sanitize, structure, wrap in the Flow theme. Publish as `html`.

### JSON — `.json`
- **Detect:** `.json` / valid JSON.
- **Transform:** identify shape: **array of news items** → themed news-card list; **single record of figures** → stat table + narrative + likely a chart; **nested/mixed** → flatten salient fields and summarize. Never publish raw `{…}`.
- **Ticker from:** a ticker/symbol field. Publish as `html`.

### CSV / TSV — `.csv` / `.tsv`
- **Detect:** delimited rows + header.
- **Transform:** themed HTML table; detect ticker/symbol and date columns; for large tables summarize top rows and collapse/link the rest. Numeric columns are strong chart candidates (trend or comparison).
- **Ticker from:** ticker/symbol column (per-ticker if single-stock, else `MARKET`). Publish as `html`.

### Images / screenshots — `.png` / `.jpg` / `.jpeg` / `.webp`
- **Detect:** image extension.
- **Transform:** embed inside a themed `<figure>` with caption + meaningful `alt`. If text in the image matters, ask the user for it (or OCR if available) rather than guessing. Do **not** synthesize a chart from a chart image — embed the image instead.
- **Ticker from:** filename, user-supplied caption, or an explicit ask. Publish as `html`.

### PDF — `.pdf`
- **Detect:** `.pdf` extension.
- **Transform:** extract text/tables, then treat as md/txt/table per above (tables → chart candidates). Keep the PDF as the source.
- **Ticker from:** extracted title/headings. Publish as `html` or `markdown`.

### Pasted news / social snippet (inside `.txt`/`.md`)
- **Detect:** short-form — headline, quote, tweet-like block, often with source + timestamp.
- **Transform:** themed **news card**: headline, source attribution, timestamp, link. Keep it compact; no chart unless it carries real data.
- **Ticker from:** explicit mention; else `MARKET`.

### Unknown / binary / unrecognized
- **Do not guess.** If it can't be safely normalized, stop and ask what it is and how to show it. A wrong guess off-theme or under the wrong ticker is worse than a question.

---

## Theme & rendering rules

A reader scrolling `/flow` should not be able to tell which underlying format a post came from.

- **Wrap every post in the Flow theme**, using its report vocabulary: header (title, date, ticker badge, source, language toggle), body sections, themed tables, figures, callouts, stat badges, and themed charts.
- **Charts must match the theme** (colors, fonts, sizing) and never look bolted on.
- **Do not include comments/community UI in the body** — the right-side panel is provided by the detail layout at `/flow/:reportId`.
- **Strip foreign styling** from uploaded HTML so it inherits the Flow theme.
- **Do not restyle already-themed files** — wire metadata and let them render.
- **Prefer parser/renderer/normalizer changes over hardcoded UI exceptions.** Grouping/rendering fixes go in `server/dailyReportSources.ts` and `client/src/features/flow/lib/flowReportHelpers.ts` (plus a normalizer module for multi-format/chart handling).

---

## Ticker & market grouping

Every stock-specific post lands under **its own ticker card** on `/flow` and the **same ticker archive** on `/flow/ticker/:ticker`.

- **Single stock →** `["TICKER"]`, resolved from title, headings, front-matter, `$TICKER`, a ticker column, or filename — in that order of trust.
- **Multiple stocks →** include each symbol; the post appears on each relevant card/archive.
- **Broad market →** group under `MARKET`, never a fake ticker.
- **Ambiguous token →** fix the detection logic in `server/dailyReportSources.ts` / `flowReportHelpers.ts`, not the individual report.
- **Unknown ticker →** prefer `MARKET` or ask; never invent a symbol.

---

## Language / TR-EN handling

- **Detect** the source language; set `language` to `tr`, `en`, or `bilingual`.
- **Bilingual:** structure both languages so the TR/EN toggle reveals the matching version.
- **Single-language:** keep it in its language; ensure the toggle degrades gracefully (no empty/broken view). Provide a translated counterpart only if the project convention requires both.
- Match whatever pattern existing Flow posts already use; restructuring (step 5) does not itself translate.

---

## Metadata extraction & dedupe

- **Title:** first heading / `<title>` / front-matter / JSON title / first strong line — concise and human-readable.
- **reportDate:** from metadata / explicit date / filename first; else fall back to file date or today and **note the assumption** to the user.
- **sourceLabel:** always `flow/<original-filename>`.
- **Dedupe:** same ticker + date + title → treat as an update of that ticker, not a new card. Never silently drop the older or newer item.

---

## Editing rules

- Prefer Flow source parsing / normalization changes over hardcoded UI exceptions.
- Preserve older posts; new files **extend** the archive, not replace it, unless the user explicitly asks to hide/remove old items.
- Same ticker, multiple posts → newest becomes the current card; older ones stay in that ticker archive.
- Already-themed file → don't restyle. Already-clean structure → light-touch restructure only.
- Keep the original uploaded file in `flow/` as the source of truth.
- **Never fabricate data for a chart**, and never add a chart where the content doesn't support one.
- When adding a new format, generalize the normalizer so the next upload in that format "just works."

---

## Validation & quick checks

Build checks:
- `corepack pnpm exec tsc --noEmit --skipLibCheck --incremental false` passes.
- `corepack pnpm build` passes.
- The verify command (step 9) lists the new post with correct `title`, `reportDate`, `contentFormat`, `tickers`.

Readability & visual acceptance:
- The post has a clear headline, a short summary, and scannable sections — **no raw paragraph dumps**.
- Standout numbers appear as stat badges; the key insight appears as a callout.
- A chart appears **only where the content has chartable data**, is **themed**, **labeled with units**, **captioned**, **legible on mobile**, and uses **no fabricated data**.
- Purely qualitative posts have **no gratuitous chart**.
- Theme parity: the new post is visually indistinguishable from existing Flow cards.

Page-level acceptance:
- `/flow` shows **one card per ticker or `MARKET`**.
- `/flow/ticker/:ticker` shows the **latest** plus older posts for that **same** ticker.
- `/flow/:reportId` opens the embedded, fully themed post with the **community panel on the right**.
- TR/EN toggle works and never yields an empty view; images render in themed figures; no broken images.
- `flow/flowskill/` never appears as a Flow report source.

---

## Edge cases / failure handling

- **Unknown/wrong ticker:** route to `MARKET` or ask; fix detection centrally.
- **Missing date:** infer from filename/content, else file date/today — and tell the user.
- **Unrecognized/binary format:** stop and ask; don't guess a normalization.
- **Image-only, no extractable text:** embed as a themed figure; request a caption/ticker.
- **Single stray number:** stat badge, not a chart.
- **Incomplete/sparse data:** small table or stat highlights, not a half-empty chart.
- **Oversized JSON/CSV:** summarize salient rows + one chart of the meaningful series; collapse/link the full data.
- **Duplicate post (same ticker+date+title):** newest becomes current card, older archived; never silently delete either.
- **Already on-theme / already clean:** wire metadata, light touch — don't over-process.
- **Conflicting global styles in uploaded HTML:** strip them so the post inherits the Flow theme.
