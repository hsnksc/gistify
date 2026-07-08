// Verify a coverage-md/1 report before it ships, or list existing coverage versions for a ticker.
// Mirrors server-side validation (server/coverageSources.ts: validateCoverageMarkdown) plus the
// render-contract preflight matrix from coverage/SKILL.md section 10.
// Usage:
//   node scripts/coverage-verify.mjs NVDA                                # list versions, validate newest
//   node scripts/coverage-verify.mjs coverage/reports/NVDA-2026-07-06.md # validate one file
//   node scripts/coverage-verify.mjs --all                               # validate every local report
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const ROOTS = [path.join(root, "coverage", "reports"), path.join(root, "reports", "coverage")];
const SIGNALS = ["SPEC-BULLISH", "BULLISH", "NEUTRAL", "BEARISH", "SPEC-BEARISH"];
const TYPES = ["earnings-option-play", "deep-research", "momentum-scan", "explosion-watch", "research"];

const arg = process.argv[2];
if (!arg) {
  console.error("usage: node scripts/coverage-verify.mjs <TICKER | coverage/reports/<file>.md | --all>");
  process.exit(1);
}

// Turkish-aware, diacritic-insensitive lowercasing so both "Kırmızı Bayraklar"
// and legacy ASCII "Kirmizi Bayraklar" match the same trigger.
function fold(s) {
  return s
    .replace(/İ/g, "i").replace(/I/g, "i").replace(/ı/g, "i")
    .replace(/Ş/g, "s").replace(/ş/g, "s").replace(/Ğ/g, "g").replace(/ğ/g, "g")
    .replace(/Ç/g, "c").replace(/ç/g, "c").replace(/Ö/g, "o").replace(/ö/g, "o")
    .replace(/Ü/g, "u").replace(/ü/g, "u")
    .toLowerCase();
}

function listVersions(ticker) {
  const up = ticker.toUpperCase();
  const seen = new Set();
  const out = [];
  for (const dir of ROOTS) {
    if (!fs.existsSync(dir)) continue;
    for (const name of fs.readdirSync(dir)) {
      if (!/\.md$/i.test(name) || /\.en\.md$/i.test(name) || /^sample(-|\.|$)/i.test(name)) continue;
      const m = name.match(/^([A-Za-z.]+)-(\d{4}-\d{2}-\d{2})(-[a-z])?\.md$/);
      if (!m || m[1].toUpperCase() !== up) continue;
      const key = name.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ date: m[2] + (m[3] || ""), file: path.join(dir, name) });
    }
  }
  return out.sort((a, b) => b.date.localeCompare(a.date));
}

function splitFrontmatter(raw) {
  const norm = raw.replace(/\r\n/g, "\n");
  const m = norm.match(/^---\n([\s\S]*?)\n---\n?/);
  return m ? { fm: m[1], body: norm.slice(m[0].length) } : { fm: "", body: norm };
}

function fmField(fm, field) {
  const m = fm.match(new RegExp(`^${field}:\\s*(.+)$`, "im"));
  return m ? m[1].trim().replace(/^["']|["']$/g, "") : "";
}

function validate(filePath) {
  const rel = path.relative(root, filePath).replace(/\\/g, "/");
  const errors = [];
  const warnings = [];
  const raw = fs.readFileSync(filePath, "utf8");
  const { fm, body } = splitFrontmatter(raw);

  if (!fm) errors.push("frontmatter yok (dosya `---` ile başlamalı)");
  const ticker = fmField(fm, "ticker").toUpperCase();
  const date = fmField(fm, "date");
  const type = fmField(fm, "type");
  const signal = fmField(fm, "signal");

  // Server-side hard contract (admin save 400 / local discovery)
  if (!ticker) errors.push("frontmatter `ticker` zorunlu");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) errors.push("frontmatter `date` ISO (YYYY-MM-DD) zorunlu");

  const h1 = body.split("\n").find(l => l.startsWith("# "));
  if (!h1) errors.push("gövdede `#` H1 başlık yok");
  else if (ticker && !h1.includes(`(${ticker})`)) errors.push(`H1'de \`(${ticker})\` kalıbı yok — renderer'ın yedek ticker kaynağı`);

  // Filename must be {TICKER}-{date}.md (optional -b suffix)
  const base = path.basename(filePath).replace(/\.md$/i, "");
  if (ticker && date && !new RegExp(`^${ticker}-${date}(-[a-z])?$`, "i").test(base)) {
    errors.push(`dosya adı \`${base}.md\` — beklenen \`${ticker}-${date}.md\``);
  }

  // coverage-md/1 preflight
  if (fmField(fm, "contract") !== "coverage-md/1") errors.push("frontmatter `contract: coverage-md/1` eksik/yanlış");
  if (!signal) errors.push("frontmatter `signal` eksik");
  else if (!SIGNALS.includes(signal)) errors.push(`signal \`${signal}\` geçersiz (${SIGNALS.join(" | ")})`);
  if (!type) errors.push("frontmatter `type` eksik");
  else if (!TYPES.includes(type)) errors.push(`type \`${type}\` geçersiz (${TYPES.join(" | ")})`);
  if (!/^\s{2,}price:\s*[\d.]+/m.test(fm)) warnings.push("`metrics.price` yok — hero şeridi eksik kalır");

  const lines = body.split("\n");
  let inFence = false;
  lines.forEach((line, i) => {
    const n = i + 1;
    if (/^```/.test(line)) { inFence = !inFence; errors.push(`satır ${n}: kod çiti — renderer desteklemez`); return; }
    if (inFence) return;
    if (/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) errors.push(`satır ${n}: gövdede \`---\` yatay çizgi yasak`);
    if (/^\s*\d+[.)]\s/.test(line)) errors.push(`satır ${n}: sıralı liste yasak — düz \`-\` madde kullan`);
    if (/<[a-zA-Z][a-zA-Z0-9-]*(\s[^>]*)?>/.test(line) && !line.trim().startsWith("|")) {
      errors.push(`satır ${n}: ham HTML yasak`);
    }
    if (/^\s+- /.test(line)) warnings.push(`satır ${n}: girintili liste — iç içe yapı düz tabloya düşebilir`);
  });

  const folded = fold(body);
  if (!folded.includes("yatirim tavsiyesi degildir")) {
    errors.push('disclaimer eksik — son blok "yatırım tavsiyesi değildir" içermeli');
  }
  if (!/\|\s*kaynak\s*\|/.test(folded) || !folded.includes("url")) {
    warnings.push("`Kaynak | URL` tablosu bulunamadı — kaynakça bileşeni çıkmaz");
  }
  if (!folded.includes("### kirmizi bayraklar")) warnings.push("`### Kırmızı Bayraklar` başlığı yok");
  if (!folded.includes("### yesil bayraklar")) warnings.push("`### Yeşil Bayraklar` başlığı yok");

  if (type === "earnings-option-play") {
    if (!/^strategy:/m.test(fm)) errors.push("earnings-option-play: frontmatter `strategy` bloğu zorunlu");
    if (!/>\s*\*\*STRATEJ/i.test(body)) errors.push("earnings-option-play: gövdede STRATEJİ blockquote'u zorunlu");
  }

  const enSibling = filePath.replace(/\.md$/i, ".en.md");
  const hasEn = fs.existsSync(enSibling);

  console.log(`--- ${rel}`);
  console.log(`  ticker: ${ticker || "?"} | date: ${date || "?"} | type: ${type || "?"} | signal: ${signal || "?"} | en: ${hasEn ? "var" : "yok"}`);
  for (const e of errors) console.log(`  !! HATA  ${e}`);
  for (const w of warnings) console.log(`  .. uyarı ${w}`);
  if (!errors.length) console.log(`  OK${warnings.length ? ` (${warnings.length} uyarı)` : ""}`);
  return errors.length === 0;
}

let ok = true;
if (arg === "--all") {
  const seen = new Set();
  for (const dir of ROOTS) {
    if (!fs.existsSync(dir)) continue;
    for (const name of fs.readdirSync(dir).sort()) {
      if (!/\.md$/i.test(name) || /\.en\.md$/i.test(name) || /^sample(-|\.|$)/i.test(name)) continue;
      if (seen.has(name.toLowerCase())) continue;
      seen.add(name.toLowerCase());
      ok = validate(path.join(dir, name)) && ok;
    }
  }
} else if (/[\\/]/.test(arg) || /\.md$/i.test(arg)) {
  const p = path.isAbsolute(arg) ? arg : path.join(root, arg);
  if (!fs.existsSync(p)) {
    console.error(`dosya yok: ${arg}`);
    process.exit(1);
  }
  ok = validate(p);
} else {
  const versions = listVersions(arg);
  if (!versions.length) {
    console.log(`YOK: ${arg.toUpperCase()} için coverage raporu bulunamadı — yeni rapor oluşturulmalı.`);
    process.exit(0);
  }
  console.log(`${arg.toUpperCase()} — ${versions.length} versiyon:`);
  for (const v of versions) console.log(`  ${v.date}  ${path.relative(root, v.file).replace(/\\/g, "/")}`);
  ok = validate(versions[0].file);
}
process.exit(ok ? 0 : 1);
