---
name: flowskill
description: Ingest and publish Flow reports dropped into `flow/`. Use when a new Flow `.html` or `.md` report is added, when unpushed `flow/` files must be published, when a report needs to appear under the correct ticker card/archive, or when Flow parser/theme integration must be adjusted before commit and push.
---

# Flow ingest

Treat `flow/` as a source inbox for the Flow workspace.

## Core workflow

1. Inventory `flow/` first.
   Run `Get-ChildItem -Recurse flow` and compare with `git status --short`.

2. Ignore non-report assets.
   Do not ingest `flow/README.md`, `flow/_template.md`, plan files, or anything under `flow/flowskill/`.

3. Verify what Flow will publish.
   Run:

   ```powershell
   node --experimental-strip-types -e "import('./server/dailyReportSources.ts').then(m => console.log(JSON.stringify(m.listDailyReportSourcePackages().filter(x => (x.sourceLabel||'').toLowerCase().startsWith('flow/')).map(x => ({ sourceLabel: x.sourceLabel, title: x.title, reportDate: x.reportDate, contentFormat: x.contentFormat, tickers: x.tickerUniverse })), null, 2)))"
   ```

4. Fix ticker grouping before pushing.
   Every stock-specific report must land under its own ticker card on `/flow` and under the same ticker archive on `/flow/ticker/:ticker`.
   If HTML parsing misses the ticker or chooses the wrong token, update:
   `server/dailyReportSources.ts`
   `client/src/features/flow/lib/flowReportHelpers.ts`

5. Keep HTML reports inside the existing Flow theme.
   Prefer adapting parser or renderer logic over rewriting the uploaded report file.
   Flow HTML should open inside the Flow layout, preserve TR/EN switching, and keep comments on the detail page.

6. Treat broad market reports as a shared market bucket.
   If a file is about the overall market rather than a single stock, group it under `MARKET` instead of a fake ticker.

7. Validate before git operations.
   Run:

   ```powershell
   corepack pnpm exec tsc --noEmit --skipLibCheck --incremental false
   corepack pnpm build
   ```

8. Stage only relevant files.
   Include the new `flow/` reports plus the parser/UI files required for them.
   Never include unrelated deletions or untracked files from other folders.

9. Commit and push only when requested.
   Use a focused commit message that describes the Flow ingest or parser fix.

## Editing rules

- Prefer Flow source parsing changes over hardcoded UI exceptions.
- Preserve older Flow reports; new files should extend the archive, not replace it, unless the user explicitly asks to hide or remove old items.
- If multiple reports belong to the same ticker, make sure the newest one becomes the current card entry and the older ones remain in that ticker archive.
- If a report file already contains the correct visual theme, avoid restyling it manually.

## Quick checks

- `/flow` should show one card per ticker or `MARKET`.
- `/flow/ticker/:ticker` should show the latest report and older reports for that same ticker.
- `/flow/:reportId` should open the embedded report with the community panel on the right.
- `flow/flowskill/` must never appear as a Flow report source.
