// Flow report chart generator: renders themed SVG charts from a JSON config
// and splices them into HTML templates via __TOKEN__ replacement.
//
// Usage: node scripts/flow-chartgen.mjs <config.json>
//
// Config shape:
// {
//   "langs": ["tr", "en"],
//   "charts": {
//     "__CHART_X__": { "type": "verticalBar" | "horizontalBar" | "range" | "priceLadder" | "donut", ...params }
//   },
//   "outputs": [ { "lang": "tr", "template": "<abs path>", "out": "<abs path>" } ]
// }
// Any leaf value inside chart params may be a { "tr": ..., "en": ... } object;
// it is resolved to the active language before rendering, so TR/EN stay
// pixel-identical except for text. Outputs must land in flow/ or a scratchpad.
import fs from "node:fs";
import path from "node:path";

const C = {
  accent: "#38bdf8",
  success: "#4ade80",
  warning: "#fbbf24",
  danger: "#f87171",
  text: "#e2e8f0",
  muted: "#94a3b8",
  grid: "rgba(148,163,184,.18)",
  axis: "#64748b",
  dark: "#0a1628",
};

// Resolve { tr: ..., en: ... } leaves to the active language.
function localize(value, lang, langs) {
  if (Array.isArray(value)) return value.map(v => localize(v, lang, langs));
  if (value && typeof value === "object") {
    const keys = Object.keys(value);
    if (keys.length && keys.every(k => langs.includes(k))) return localize(value[lang], lang, langs);
    return Object.fromEntries(keys.map(k => [k, localize(value[k], lang, langs)]));
  }
  if (typeof value === "string" && value.startsWith("$C.")) return C[value.slice(3)] || value;
  return value;
}

// Horizontal scale with support/resistance ticks and a dashed current-price line.
function priceLadder({ points, current, min, max }) {
  const x = v => (24 + ((v - min) / (max - min)) * 652).toFixed(1);
  let s = `<svg viewBox="0 0 700 120" width="100%" height="120" role="img" aria-label="chart">`;
  s += `<line x1="24" y1="66" x2="676" y2="66" stroke="${C.axis}" stroke-width="1.4"/>`;
  for (const p of points) {
    const px = x(p.v);
    const up = p.side === "above";
    s += `<line x1="${px}" y1="66" x2="${px}" y2="${up ? 58 : 74}" stroke="${p.color}" stroke-width="2"/>`;
    s += `<circle cx="${px}" cy="66" r="4" fill="${p.color}"/>`;
    s += `<text x="${px}" y="${up ? 48 : 96}" text-anchor="middle" font-size="10.5" font-weight="700" fill="${p.color}" font-family="inherit">${p.name}</text>`;
    s += `<text x="${px}" y="${up ? 36 : 108}" text-anchor="middle" font-size="11" fill="${C.text}" font-family="inherit">${p.label}</text>`;
  }
  const cx = x(current);
  s += `<line x1="${cx}" y1="20" x2="${cx}" y2="112" stroke="${C.accent}" stroke-width="1.6" stroke-dasharray="4 3"/>`;
  s += `<circle cx="${cx}" cy="66" r="5.5" fill="${C.accent}"/>`;
  return s + `</svg>`;
}

// Column chart; plot x 54..620, baseline y 220, top y 24 (matches existing reports).
function verticalBar({ bars, yMin, yMax, ticks, tickLabels }) {
  const plotH = 196;
  const y = v => 220 - ((v - yMin) / (yMax - yMin)) * plotH;
  const n = bars.length;
  const barW = 70;
  const gap = (566 - n * barW) / (n + 1);
  let s = `<svg viewBox="0 0 640 260" width="100%" height="260" role="img" aria-label="chart">`;
  ticks.forEach((t, i) => {
    const ty = y(t).toFixed(1);
    s += `<line x1="54" y1="${ty}" x2="620" y2="${ty}" stroke="${C.grid}" stroke-width="1"/>`;
    s += `<text x="44" y="${(Number(ty) + 4).toFixed(1)}" text-anchor="end" font-size="10.5" fill="${C.muted}" font-family="inherit">${tickLabels[i]}</text>`;
  });
  s += `<line x1="54" y1="220" x2="620" y2="220" stroke="${C.axis}" stroke-width="1.2"/>`;
  bars.forEach((b, i) => {
    const bx = 54 + gap + i * (barW + gap);
    const by = y(b.v);
    const cx = bx + barW / 2;
    s += `<rect x="${bx.toFixed(1)}" y="${by.toFixed(1)}" width="${barW}" height="${(220 - by).toFixed(1)}" rx="4" fill="${b.color}" opacity="1"/>`;
    s += `<text x="${cx.toFixed(1)}" y="${(by - 8).toFixed(1)}" text-anchor="middle" font-size="12" font-weight="700" fill="${C.text}" font-family="inherit">${b.valueLabel}</text>`;
    s += `<text x="${cx.toFixed(1)}" y="238" text-anchor="middle" font-size="11" fill="${C.muted}" font-family="inherit">${b.label}</text>`;
  });
  return s + `</svg>`;
}

// Ranked horizontal bars; labels end at x 178, bars start x 190 (matches existing reports).
function horizontalBar({ rows, xMax, ticks, tickLabels, refLine }) {
  const h = rows.length * 34 + 46;
  const x = v => 190 + (v / xMax) * 390;
  let s = `<svg viewBox="0 0 640 ${h}" width="100%" height="${h}" role="img" aria-label="chart">`;
  ticks.forEach((t, i) => {
    const tx = x(t).toFixed(1);
    s += `<line x1="${tx}" y1="16" x2="${tx}" y2="${h - 30}" stroke="${C.grid}" stroke-width="1"/>`;
    s += `<text x="${tx}" y="${h - 12}" text-anchor="middle" font-size="10.5" fill="${C.muted}" font-family="inherit">${tickLabels[i]}</text>`;
  });
  rows.forEach((r, i) => {
    const ry = 22.8 + i * 34;
    const ty = 36.3 + i * 34;
    const w = ((r.v / xMax) * 390).toFixed(1);
    s += `<text x="178" y="${ty}" text-anchor="end" font-size="11.5" fill="${C.text}" font-family="inherit">${r.name}</text>`;
    s += `<rect x="190" y="${ry}" width="${w}" height="19.0" rx="4" fill="${r.color}" opacity="0.88"/>`;
    s += `<text x="${(190 + Number(w) + 8).toFixed(1)}" y="${ty}" font-size="12" font-weight="700" fill="${C.text}" font-family="inherit">${r.valueLabel}</text>`;
  });
  if (refLine) {
    const rx = x(refLine.v).toFixed(1);
    s += `<line x1="${rx}" y1="12" x2="${rx}" y2="${h - 26}" stroke="${C.accent}" stroke-width="1.5" stroke-dasharray="4 3"/>`;
    s += `<text x="${rx}" y="8" text-anchor="middle" font-size="10.5" font-weight="600" fill="${C.accent}" font-family="inherit">${refLine.label}</text>`;
  }
  return s + `</svg>`;
}

// Floating min–max range bars with a dashed current-value line.
function range({ rows, current, currentLabel, min, max, ticks, tickLabels }) {
  const h = rows.length * 50 + 58;
  const x = v => 96 + ((v - min) / (max - min)) * 584;
  let s = `<svg viewBox="0 0 700 ${h}" width="100%" height="${h}" role="img" aria-label="chart">`;
  ticks.forEach((t, i) => {
    const tx = x(t).toFixed(1);
    s += `<line x1="${tx}" y1="18" x2="${tx}" y2="${h - 34}" stroke="${C.grid}" stroke-width="1"/>`;
    s += `<text x="${tx}" y="${h - 18}" text-anchor="middle" font-size="10" fill="${C.muted}" font-family="inherit">${tickLabels[i]}</text>`;
  });
  rows.forEach((r, i) => {
    const ry = 34 + i * 50;
    const ty = ry + 14;
    const x1 = x(r.min);
    const x2 = x(r.max);
    s += `<text x="86" y="${ty.toFixed(1)}" text-anchor="end" font-size="11" font-weight="700" fill="${C.accent}" font-family="inherit">${r.name}</text>`;
    s += `<rect x="${x1.toFixed(1)}" y="${ry}" width="${(x2 - x1).toFixed(1)}" height="20" rx="5" fill="${r.color}" opacity="0.92"/>`;
    s += `<text x="${((x1 + x2) / 2).toFixed(1)}" y="${ty.toFixed(1)}" text-anchor="middle" font-size="10.5" font-weight="700" fill="${C.dark}" font-family="inherit">${r.valueLabel}</text>`;
  });
  if (current != null) {
    const cx = x(current).toFixed(1);
    s += `<line x1="${cx}" y1="14" x2="${cx}" y2="${h - 30}" stroke="${C.text}" stroke-width="1.4" stroke-dasharray="3 3"/>`;
    s += `<text x="${cx}" y="10" text-anchor="middle" font-size="10.5" font-weight="700" fill="${C.text}" font-family="inherit">${currentLabel}</text>`;
  }
  return s + `</svg>`;
}

// Concentric-ring donut/composition chart. `slices` sum to ~100 (pct each);
// renders as sequential arcs via stroke-dasharray/-dashoffset around a shared
// ring, matching the hand-built donuts already used in some Flow reports.
// Emits only the <svg> — pair it with a `.donut-chart`/`.donut-legend` HTML
// block authored directly in the template (legend text needs translation,
// so it isn't itself chart geometry).
function donut({ slices, centerLabel, centerSub }) {
  const r = 70;
  const cx = 90;
  const cy = 90;
  const circumference = 2 * Math.PI * r;
  let cumulative = 0;
  let s = `<svg class="donut-svg" viewBox="0 0 180 180" width="180" height="180" role="img" aria-label="chart">`;
  s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--gf-border)" stroke-width="20"/>`;
  slices.forEach(slice => {
    const len = (slice.pct / 100) * circumference;
    const dashoffset = -cumulative;
    s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${slice.color}" stroke-width="20" stroke-dasharray="${len.toFixed(2)} ${circumference.toFixed(2)}" stroke-dashoffset="${dashoffset.toFixed(2)}" stroke-linecap="round" transform="rotate(-90 ${cx} ${cy})" style="filter:drop-shadow(0 0 6px ${slice.color}66)"/>`;
    cumulative += len;
  });
  if (centerLabel) {
    s += `<text x="${cx}" y="${cy - 5}" text-anchor="middle" fill="${C.text}" font-size="14" font-weight="700" font-family="inherit">${centerLabel}</text>`;
  }
  if (centerSub) {
    s += `<text x="${cx}" y="${cy + 12}" text-anchor="middle" fill="${C.muted}" font-size="9" font-family="inherit">${centerSub}</text>`;
  }
  return s + `</svg>`;
}

const RENDERERS = { priceLadder, verticalBar, horizontalBar, range, donut };

// ---------------- main ----------------
const configPath = process.argv[2];
if (!configPath) {
  console.error("usage: node scripts/flow-chartgen.mjs <config.json>");
  process.exit(1);
}
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
const langs = config.langs || ["tr", "en"];
const repoFlowDir = path.resolve(
  path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")),
  "..",
  "flow"
);

for (const output of config.outputs) {
  const outAbs = path.resolve(output.out);
  const inFlow = outAbs.startsWith(repoFlowDir + path.sep);
  const inScratch = /scratchpad/i.test(outAbs);
  if (!inFlow && !inScratch) {
    throw new Error(`refusing to write outside flow/ or a scratchpad: ${outAbs}`);
  }
  let html = fs.readFileSync(output.template, "utf8");
  for (const [token, spec] of Object.entries(config.charts || {})) {
    const { type, ...params } = localize(spec, output.lang, langs);
    const renderer = RENDERERS[type];
    if (!renderer) throw new Error(`unknown chart type "${type}" for ${token}`);
    html = html.replaceAll(token, renderer(params));
  }
  const leftover = html.match(/__[A-Z_]+__/g);
  if (leftover) throw new Error(`leftover tokens in ${output.out}: ${[...new Set(leftover)].join(", ")}`);
  fs.writeFileSync(outAbs, html, "utf8");
  console.log("wrote", outAbs, html.length, "bytes,", (html.match(/<svg/g) || []).length, "svgs");
}
