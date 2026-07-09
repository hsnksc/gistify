---
name: gistflow
description: Turn a raw source (.md, .txt, .html, pasted news) dropped into `flow/` into a polished, bilingual (TR/EN) Flow report that matches the existing gf-theme used across gistify.pro's Flow reports, with real themed SVG charts for any chartable data. Use whenever the user says things like "flow'a ekle", "flow'a yeni rapor olarak ekle", "bunu flow'da yayınla", "grafikli ve çift dilli yap", "publish this to flow", or points at a file and asks for it to become a Flow post. This is the concrete, hands-on execution recipe (theme CSS, chart-generation technique, file-naming/dedupe rules, verification commands) — for the full format matrix (json/csv/pdf/images) and ticker-inference edge cases, also read `flow/flowskill/SKILL.md` in this repo.
---

# gistflow — publish a themed, bilingual, charted Flow report

Goal: given a source file (usually sitting in `flow/`, but could be pasted text), produce a Flow HTML report that is visually indistinguishable from the best existing reports (e.g. `flow/stock-MSFT-06-temmuz-2026.html`), has a proper English translation pair, and has real (non-fabricated) charts for anything chartable in the source.

Read `flow/flowskill/SKILL.md` first for the general ingest matrix (markdown/txt/json/csv/images/pdf, ticker inference, dedupe rules, post-structure template). This skill is the concrete "how to actually build the HTML + charts" companion to it — use both together.

## 0. Orient yourself

1. Read the source file fully.
2. Check `flow/` for an existing file with a similar name/topic/ticker+date — if the source file is itself already sitting in `flow/` as a rough draft, you will **edit it in place**, not create a second file (see step 5, dedupe).
3. Skim one or two recent, good examples for theme reference, e.g. `flow/stock-MSFT-06-temmuz-2026.html`, `flow/daily-semiconductor-inflection-01-temmuz-2026.html` (has inline SVG donut charts).

## 1. Theme — copy this CSS verbatim

Flow HTML reports are rendered **self-contained inside an isolated iframe** (see `client/src/components/reports/HtmlReportRenderer.tsx`, which builds an `srcDoc`). This means:
- Each report file carries its **own `<style>` block** — it does NOT inherit the main app's CSS.
- "Matching the site theme" = reusing the same `gf-*` CSS custom properties and class names every other Flow report uses, not literally sharing a stylesheet.

Use this exact variable/class vocabulary (copy from `flow/stock-MSFT-06-temmuz-2026.html` or reuse verbatim):

```css
:root{--gf-bg:#050c1b;--gf-elev:#0a1628;--gf-card:#0d1b2a;--gf-border:#1e3a5f;--gf-border-subtle:rgba(30,58,95,.5);--gf-text:#e2e8f0;--gf-muted:#94a3b8;--gf-accent:#38bdf8;--gf-accent-dim:rgba(56,189,248,.12);--gf-success:#4ade80;--gf-success-dim:rgba(74,222,128,.12);--gf-warning:#fbbf24;--gf-warning-dim:rgba(251,191,36,.12);--gf-danger:#f87171;--gf-danger-dim:rgba(248,113,113,.12);--gf-radius:12px;--gf-font:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,Roboto,sans-serif;--gf-mono:'SF Mono',Monaco,Consolas,monospace}
```
Colors: `--gf-danger` (red) = bearish/resistance/risk, `--gf-success` (green) = bullish/support/opportunity, `--gf-warning` (amber) = neutral/caution, `--gf-accent` (blue) = current price / reference / highlighted series.

Structural classes to reuse: `.wrap`, `.hero` (+ `.hero-h`, `.hero-desc`, `.hero-meta`, `.hero-ticker`, `.meta-pill.bull/bear/neu/info`), `.kpi-row`/`.kpi`, `.section-head`/`.section-head-inner`/`.section-title`/`.section-body`, `.grid`/`.grid2`/`.grid3`, `.card`, `.chart-card`/`.chart-title`/`.chart-caption`/`.legend`, `.risk-card.high/.med`, `.strat-card`, `.insight-box.warn/.danger/.bull`, `.disclaimer`, standard `<table>` styling.

**Never rely on `<script>` for interactivity** (collapsible sections, tabs, sliders, calculators). The server-side normalizer (`stripFlowHtmlScripts` in `server/dailyReportSources.ts`) strips every `<script>` tag before the file is published — this is a deliberate security boundary (untrusted uploaded HTML must not execute JS in the site's iframe), not a bug, and it is not something to patch around. Any `onclick`/toggle/slider JS you leave in the source will silently do nothing once live.

**If the HTML source already has interactive widgets, rebuild them — do not flatten them to static text.** Discarding a source's sliders/tabs/calculators into plain tables is *worse* than keeping them, because it throws away the thing that made the original engaging. Instead, re-express each JS-driven control as a pure CSS radio-input toggle, which survives script-stripping completely (no JS involved at all):

```html
<!-- one native radio per option, visually hidden, placed before the content it controls -->
<input type="radio" class="toggle-input" name="hbmLayers" id="hbm8" checked>
<input type="radio" class="toggle-input" name="hbmLayers" id="hbm12">
<div class="toggle-row">
  <label class="toggle-label" for="hbm8">8 Layers</label>
  <label class="toggle-label" for="hbm12">12 Layers</label>
</div>
<div class="hbm-result" id="hbm-result-8">...panel for the 8-layer state...</div>
<div class="hbm-result" id="hbm-result-12">...panel for the 12-layer state...</div>
```
```css
.toggle-input{position:absolute;opacity:0;width:0;height:0;pointer-events:none}
.toggle-label{display:inline-flex;padding:7px 14px;border-radius:8px;background:var(--gf-elev);border:1px solid var(--gf-border);color:var(--gf-muted);cursor:pointer}
/* highlight the active label */
#hbm8:checked ~ .toggle-row label[for="hbm8"],
#hbm12:checked ~ .toggle-row label[for="hbm12"]{background:var(--gf-accent);color:#04121f;border-color:var(--gf-accent)}
/* swap the visible panel via specificity: two-ID selector beats the one-ID+class blanket rule */
#hbm8:checked ~ .hbm-result{display:none}
#hbm8:checked ~ #hbm-result-8{display:block}
#hbm12:checked ~ .hbm-result{display:none}
#hbm12:checked ~ #hbm-result-12{display:block}
```
Rules for converting a JS widget:
- **Toggles/tabs/buttons with a finite set of options** (unit switch, layer-count picker, cooling-mode selector, $ vs % view) → a perfect fit: one radio per option, one pre-rendered result pane per option, real click-to-change behavior with zero JS.
- **Continuous sliders driving a live calculation** → can't be replicated exactly (no JS to run the formula), so pick 3–5 representative preset values (reuse the source's own defaults/marked steps, e.g. the exact button values it already offered) and pre-compute each result **using the source's own formula** — never invent the numbers. Present them as the same radio-toggle pattern. Say in a short note that these are the source's own illustrative model output, not live-computed or measured data.
- **Collapsible sections/expand-all** → skip the interaction entirely; render always-expanded (per the size of the content, no real reader value is lost).
- Keep the radios+labels as *siblings* of the content panes (not nested inside separate wrapping divs) so the `~` general-sibling combinator can reach across from the checked input to the pane it controls.
- A finished worked example lives at `flow/AI Veri Merkezi/gemini-code-1783587874902.html` (+ its `.en.html`): a Tailwind/JS interactive explainer converted to gf-theme with three CSS-only widgets (unit toggle, layer-count calculator, cooling-mode simulator) — copy its pattern directly rather than re-deriving it.

**This HTML-source interactivity-preservation step applies specifically when the input is already HTML** (it arrives with existing DOM structure/JS to convert). For non-HTML inputs (`.md`, `.txt`, `.json`, `.csv`, images, `.pdf`, pasted text) there is no existing interactivity to preserve — keep designing those the normal way per `flow/flowskill/SKILL.md`'s Format Matrix (restructure into the Post template, add a chart only where the data earns one). The CSS-toggle pattern above is still available to reach for on those too if a genuinely multi-state comparison would benefit from it, but it's optional there, not a preservation obligation.

**No page chrome.** Do not add your own `<header>`/`<footer>` with a logo/date pill — the real Flow layout supplies that. Instead:
```html
<div class="hero" id="hero" data-timestamp="YYYY-MM-DDTHH:MM:SS+03:00">
  ...
  <span class="meta-pill info hero-date" data-timestamp="YYYY-MM-DDTHH:MM:SS+03:00">📅 8 Temmuz 2026</span>
  ...
</div>
```
The `id="hero"` + `data-timestamp` is how `resolveFlowSourceTimestamp()` in `server/dailyReportSources.ts` reliably extracts the report's date — without it, date extraction falls back to fragile text-scraping of header/footer text, which is what the original raw source usually lacks.

## 2. Charts — generate real SVG, don't hand-draw coordinates

Per `flow/flowskill/SKILL.md`'s decision rule: only chart what's genuinely chartable (time series, category comparisons, periodic figures, composition ≤6 slices, before/after). A single stray number is a stat badge, not a chart. Never fabricate data.

**Use the committed generator — do NOT write a throwaway chart script.** The repo ships `scripts/flow-chartgen.mjs` (pre-allowlisted in `.claude/settings.json`, so it runs without a permission prompt). Workflow:

1. Write your TR/EN HTML templates (with `__CHART_X__` placeholder tokens) and one chart-config JSON into your scratchpad.
2. Run `node scripts/flow-chartgen.mjs <config.json>` — it renders the SVGs, splices them into every template, fails loudly on leftover tokens, and only writes into `flow/` or a scratchpad.

Config shape (see the header comment in `scripts/flow-chartgen.mjs` for details): `{ "langs": ["tr","en"], "charts": { "__TOKEN__": { "type": ..., ...params } }, "outputs": [ { "lang", "template", "out" } ] }`. Any leaf param may be `{ "tr": ..., "en": ... }` — geometry stays pixel-identical across languages, only text differs. Color strings like `"$C.success"` resolve to the gf-theme palette. Available chart `type`s:
- `verticalBar` — column chart (e.g. price vs. moving averages)
- `horizontalBar` — ranked comparison with optional dashed `refLine` (e.g. P/E vs peers + sector average, risk/opportunity probabilities)
- `range` — floating min–max bars with a dashed "current value" line (e.g. bear/base/bull price-target ranges across time horizons)
- `priceLadder` — horizontal scale with tick marks above/below a baseline (e.g. support/resistance levels around the current price)
- `donut` — concentric-ring composition chart for ≤6 slices (e.g. market share, allocation). Emits only the `<svg>`; pair it with a `.donut-chart`/`.donut-legend` HTML block authored in the template (copy `.donut-*` classes from `flow/daily-semiconductor-inflection-01-temmuz-2026.html`) since legend text needs translation.

If a report genuinely needs a chart shape that doesn't exist yet, extend `scripts/flow-chartgen.mjs` with a new generator (keep the same geometry conventions) rather than writing a one-off script.

Each chart needs: gridlines, axis labels with units, a value label per bar, a caption line underneath stating the takeaway in one sentence (`.chart-caption`), and a `.legend` if there are multiple series/colors. Keep `viewBox` + `width="100%"` so it scales responsively; font-family `inherit` so text picks up the surrounding theme font.

Build the chart markup for **both languages** at once (same geometry, translated labels), so TR and EN files stay pixel-identical except for text.

## 3. File naming, dedupe, and "replace in place"

- Canonical naming pattern already used in this repo: `stock-TICKER-date.html` (single stock) or `daily-topic-date.html` (market/multi-ticker), plus a `.en.html` sibling with **identical structure**, only text translated. Never a `.tr.html` suffix — Turkish is the unsuffixed default.
- **If the source file already lives in `flow/`** as a rough/unstyled draft (e.g. dropped in with an arbitrary filename), do **not** create a second polished file alongside it. `server/dailyReportSources.ts` auto-discovers every `.md`/`.html` in `flow/` as its own report card — a second file with a different title will NOT dedupe against the original (dedupe only triggers on exact matching ticker+date+title) and will show up as a confusing duplicate card.
  - **Fix: overwrite the original file's content in place**, keeping its exact filename. Add the `.en.html` sibling using that same base name (`<same-basename>.en.html`) — the pairing logic in `buildFileSourcePackage()` looks for `${sourceKey}.en.html` next to the source file.
- Ticker inference (`shared/flowInference.ts`) reads title/headings/`$TICKER`/filename. Check `FLOW_TICKER_ALIASES` there if a company name (e.g. "Meta") should resolve to a ticker but doesn't yet — extend the alias list rather than hacking the individual report.

## 4. Verify before calling it done

Use the committed verifier (pre-allowlisted, no permission prompt — do NOT hand-roll `node -e` one-liners for this):
```powershell
node scripts/flow-verify.mjs TICKER                  # all cards for a ticker
node scripts/flow-verify.mjs flow/<filename>.html    # one specific source file
```
It prints the card list (`sourceLabel`, `title`, `reportDate`, `contentFormat`, `tickers`, `availableLanguages`) plus, for each `flow/` HTML package, a sanity block: SVG counts for TR/EN, leftover `__TOKEN__`s, stray `<header>`/`<script>` tags, and the hero `data-timestamp`.

Confirm: exactly **one** card for this ticker+date (no duplicate raw draft), correct `reportDate`, `contentFormat: "html"`, `availableLanguages` includes `"en"` if you added a translation, and every sanity line says `ok`.

Then run the repo's standard validation:
```powershell
corepack pnpm exec tsc --noEmit --skipLibCheck --incremental false
corepack pnpm build
```

## 5. Staging & commit

Only `git add` the specific `flow/*.html` files you touched (plus any parser/renderer change if you genuinely needed one) — never `git add -A`. Do not commit or push unless the user explicitly asks.
