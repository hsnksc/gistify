// Verify what Flow will publish for a ticker or a specific flow/ source file.
// Usage:
//   node scripts/flow-verify.mjs NVDA
//   node scripts/flow-verify.mjs flow/stock-NVDA-6-temmuz-2026.html
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const arg = process.argv[2];
if (!arg) {
  console.error("usage: node scripts/flow-verify.mjs <TICKER | flow/<filename>>");
  process.exit(1);
}

const m = await import(pathToFileURL(path.join(root, "server", "dailyReportSources.ts")).href);
const pkgs = m.listDailyReportSourcePackages();

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
