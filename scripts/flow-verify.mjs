// Verify what Flow will publish for a ticker or a specific flow/ source file.
// Usage:
//   node scripts/flow-verify.mjs NVDA
//   node scripts/flow-verify.mjs flow/stock-NVDA-6-temmuz-2026.html
//   node scripts/flow-verify.mjs --week              # flow sources of the week ending at the most recent Friday
//   node scripts/flow-verify.mjs --week 2026-07-10   # explicit week-end date (Saturday..Friday window, inclusive)
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const arg = process.argv[2];
if (!arg) {
  console.error("usage: node scripts/flow-verify.mjs <TICKER | flow/<filename> | --week [YYYY-MM-DD]>");
  process.exit(1);
}

const m = await import(pathToFileURL(path.join(root, "server", "dailyReportSources.ts")).href);
const pkgs = m.listDailyReportSourcePackages();

function toIsoDate(date) {
  const y = date.getFullYear();
  const mo = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${mo}-${d}`;
}

if (arg === "--week") {
  const explicitEnd = process.argv[3];
  let end;
  if (explicitEnd) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(explicitEnd)) {
      console.error(`--week expects YYYY-MM-DD, got "${explicitEnd}"`);
      process.exit(1);
    }
    end = new Date(`${explicitEnd}T12:00:00`);
  } else {
    end = new Date();
    while (end.getDay() !== 5) {
      end.setDate(end.getDate() - 1);
    }
  }
  const start = new Date(end);
  start.setDate(start.getDate() - 6); // Saturday .. Friday, both inclusive
  const startIso = toIsoDate(start);
  const endIso = toIsoDate(end);

  const weekly = pkgs
    .filter(x => (x.sourceLabel || "").startsWith("flow/"))
    .filter(x => x.reportDate >= startIso && x.reportDate <= endIso)
    // the weekly digest itself must not ingest previous weekly digests
    .filter(x => !/(?:^|[\\/_-])weekly-\d{4}-\d{2}-\d{2}/i.test(x.sourceLabel || ""))
    .sort((a, b) => a.reportDate.localeCompare(b.reportDate));

  const tickers = [...new Set(weekly.flatMap(x => x.tickerUniverse || []))]
    .filter(t => t && t !== "MARKET")
    .sort();

  console.log(
    JSON.stringify(
      {
        window: { start: startIso, end: endIso },
        sourceCount: weekly.length,
        tickers,
        sources: weekly.map(x => ({
          sourceLabel: x.sourceLabel,
          title: x.title,
          reportDate: x.reportDate,
          contentFormat: x.contentFormat,
          tickers: x.tickerUniverse,
          availableLanguages: x.availableLanguages,
        })),
      },
      null,
      2
    )
  );
  process.exit(0);
}

const matches = arg.includes("/")
  ? pkgs.filter(x => x.sourceLabel === arg)
  : pkgs.filter(x => (x.tickerUniverse || []).includes(arg.toUpperCase()));

if (!matches.length) {
  console.error(`no report package matched "${arg}"`);
  process.exit(1);
}

console.log(
  JSON.stringify(
    matches.map(x => ({
      sourceLabel: x.sourceLabel,
      title: x.title,
      reportDate: x.reportDate,
      contentFormat: x.contentFormat,
      tickers: x.tickerUniverse,
      availableLanguages: x.availableLanguages,
    })),
    null,
    2
  )
);

for (const p of matches) {
  if (!(p.sourceLabel || "").startsWith("flow/") || p.contentFormat !== "html") continue;
  const h = p.html || "";
  const en = p.translations?.en || "";
  const flag = ok => (ok ? "ok" : "!! PROBLEM");
  console.log(`--- sanity: ${p.sourceLabel}`);
  console.log(`  svg count (tr/en): ${(h.match(/<svg/g) || []).length}/${(en.match(/<svg/g) || []).length}`);
  console.log(`  no leftover __TOKEN__s: ${flag(!/__[A-Z_]+__/.test(h) && !/__[A-Z_]+__/.test(en))}`);
  console.log(`  no <header> chrome:     ${flag(!/<header[\s>]/.test(h))}`);
  console.log(`  no <script> survived:   ${flag(!/<script/.test(h))}`);
  console.log(`  hero data-timestamp:    ${flag(/id="hero"[^>]*data-timestamp=/.test(h))}`);
  console.log(`  updatedAt: ${p.updatedAt} | reportDate: ${p.reportDate}`);
}
