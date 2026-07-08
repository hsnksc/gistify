---
name: gistcoverage
description: Take the stock ticker(s) of a Flow report/news source in `flow/` and refresh the Coverage archive with it. If the ticker already has coverage in `coverage/reports/` (or legacy `reports/coverage/`), author a NEW dated version updated with the latest news — never edit old versions; if the ticker has no coverage yet, author a fresh `coverage-md/1` report from scratch. Use whenever the user says things like "coverage'ı güncelle", "flow'daki son habere göre coverage'ı yenile", "X için coverage oluştur", "coverage'a ekle", "update coverage from the flow news", or after a Flow publish asks for the ticker's coverage to be brought up to date.
---

# gistcoverage — Flow haberinden Coverage raporu güncelle/oluştur

Goal: given a Flow source (a report in `flow/` or its ticker), produce a `coverage-md/1` markdown report in `coverage/reports/` that the Coverage renderer turns into charts and interactive components. **Writing the file with the right name IS publishing** — `listLocalCoverageReports()` in `server/coverageSources.ts` auto-discovers every `coverage/reports/*.md` and merges it into `/api/coverage/reports`; no admin-panel paste needed.

**Read `coverage/SKILL.md` first, every time.** It is the authoritative render contract (frontmatter schema, table signatures, blockquote grammar, forbidden constructs). Copy exact column names and block patterns from the golden example `coverage/sablon-rapor.md`. This skill is the workflow wrapper around that contract, not a replacement for it.

## 0. Resolve the ticker(s) and the news

- If the user pointed at a flow file or a ticker, get the canonical ticker list from the committed verifier (pre-allowlisted, no permission prompt):
  ```powershell
  node scripts/flow-verify.mjs flow/<filename>.html   # tickers + reportDate for one source
  node scripts/flow-verify.mjs NVDA                   # all flow cards mentioning NVDA (newest first)
  ```
- Then **read the actual flow source file** — that HTML/markdown is your news input.
- Multi-ticker daily reports: only produce coverage for tickers the user asked for, or that have substantial dedicated analysis in the source. A ticker appearing in a watchlist table is not coverage material.

## 1. Check what Coverage already has

```powershell
node scripts/coverage-verify.mjs NVDA    # lists every version across coverage/reports/ + legacy reports/coverage/, validates the newest
```

- Output `YOK: ... bulunamadı` → **create path** (step 2B).
- Output a version list → **update path** (step 2A). Read the newest version file it names.

## 2A. Update path — new version, never edit the old file

- New file: `coverage/reports/{TICKER}-{today YYYY-MM-DD}.md`. Same-day second report: `-b.md`, third: `-c.md`. **Never modify or delete the previous version** — the site builds the version strip and "Ne Değişti?" diff from the chain.
- The diff engine only works when **section numbers and titles stay byte-identical** across versions. Copy the previous version's skeleton, update only values and prose. A genuinely new section goes at the end.
- Keep the previous `type` unless the news changes the report's nature (e.g. a plain deep-research becoming an options play).
- Update from the flow news: frontmatter `metrics` (price, dates, targets…), `signal` if the thesis moved, catalyst timeline rows (new ISO-dated events), flag checklists, and the prose. Frontmatter and body tables must state the same numbers.

## 2B. Create path — fresh report per contract

- File: `coverage/reports/{TICKER}-{YYYY-MM-DD}.md` (date = report date, usually today).
- Default `type: deep-research` for news-driven coverage (section order: Özet · Fiyat & Piyasa · Kazanç Geçmişi · SEC & Insider · Analist Görünümü · Haber & Katalizörler · Teknik Analiz · Sektör & Rakipler · SWOT · Kaynaklar — compress sections with no data, keep numbering). Use `earnings-option-play` only when the source is an actual options play — that type additionally **requires** the `strategy:` frontmatter block and the STRATEJİ blockquote.
- Include `### Kırmızı Bayraklar` / `### Yeşil Bayraklar` (H3, exactly this spelling) with plain `- [ ]` items — these render as interactive checklists. H2 variants render as dead text.
- End with the `Kaynak | URL` table (cite the flow source and its underlying sources) and the mandatory "yatırım tavsiyesi değildir" disclaimer paragraph.

## 3. Data honesty

- Only numbers that exist in the flow source, previous coverage versions, or user-provided data. Unknown cell → `—`; unknown frontmatter field → omit it. Never invent prices, dates, or tickers.
- If the flow source's market data is older than today, keep its `price_date` honest rather than pretending the price is current.

## 4. Verify before calling it done

```powershell
node scripts/coverage-verify.mjs coverage/reports/{TICKER}-{date}.md
```

It replicates the server's save validation (ticker/date/H1 → admin 400s) plus the `coverage-md/1` preflight: contract field, signal/type enums, H1 `({TICKER})` pattern, filename match, forbidden constructs (body `---`, HTML, code fences, ordered/nested lists), disclaimer, source table, flag headings, strategy block for option plays. Fix every `!! HATA`; treat `.. uyarı` lines deliberately (new reports should clear them). Must end with `OK` and exit 0. Reported line numbers are body-relative (counted after the frontmatter).

Optionally re-run `node scripts/coverage-verify.mjs {TICKER}` to see the new version sit on top of the chain.

## 5. English sibling (optional)

Drop `{same-basename}.en.md` next to the TR file — discovery attaches it as `translations.en` and `availableLanguages` gains `"en"`. `.en.md` files are never listed as standalone reports. Same structure, translated text; the render contract applies identically.

## 6. Staging & commit

Only `git add` the specific `coverage/reports/*.md` files you created — never `git add -A`. Suggested message: `report: {TICKER} {YYYY-MM-DD}`. Do not commit or push unless the user explicitly asks.

## Gotchas

- The Coverage renderer is **not** a full markdown engine: raw HTML, ordered lists, nested lists, code fences and body `---` rules break rendering or vanish (contract §0). Tables only become charts when the **column headers match the signatures exactly** (contract §4) — a near-miss silently degrades to a plain table.
- Files prefixed `SAMPLE-` are excluded from the public catalog; use that prefix for experiments you want to keep in the folder.
- Legacy `reports/coverage/` is still read as a fallback root, but **new files always go to `coverage/reports/`** — a same-named file there shadows the legacy one.
- The admin archive (billingStore) and the local folder are merged by filename; the stored copy wins for content, so if a report was later edited via `/app/admin`, the local file may be stale — the version list is still correct.
