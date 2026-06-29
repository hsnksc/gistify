import type { DailyReportContent } from "@shared/dailyReports";
import { copy, type AppLanguage } from "@/lib/i18n";
import {
  buildReportHeadingAnchors,
  parseReportMarkdown,
  type ReportMarkdownBlock,
} from "@/lib/reportMarkdown";

interface ResolvedImage {
  alt: string;
  label?: string;
  src: string;
}

interface DailyReportHtmlOptions {
  content: DailyReportContent;
  language?: AppLanguage;
  reportDateLabel: string;
  resolveImage?: (src: string, alt: string) => ResolvedImage;
  sourceLabel?: string;
  title: string;
  updatedAtLabel?: string;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function normalizeText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function slugify(value: string) {
  return normalizeText(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

function renderBadge(value: string, tone: "neutral" | "sky" | "emerald" = "neutral") {
  const className =
    tone === "sky"
      ? "badge badge-sky"
      : tone === "emerald"
        ? "badge badge-emerald"
        : "badge";
  return `<span class="${className}">${escapeHtml(value)}</span>`;
}

function renderSummaryCards(summary: string[]) {
  if (!summary.length) {
    return "";
  }

  return `
    <section class="summary-grid">
      ${summary
        .slice(0, 6)
        .map(
          (item, index) => `
            <article class="summary-card">
              <span class="summary-index">${String(index + 1).padStart(2, "0")}</span>
              <p>${escapeHtml(item)}</p>
            </article>
          `
        )
        .join("")}
    </section>
  `;
}

function renderMetaItems(
  language: AppLanguage,
  content: DailyReportContent,
  labels: {
    author: string;
    coverage: string;
    figures: string;
    methodology: string;
    research: string;
  }
) {
  const items = [
    content.author
      ? { label: labels.author, value: content.author }
      : null,
    content.coverage
      ? { label: labels.coverage, value: content.coverage }
      : null,
    content.methodology
      ? { label: labels.methodology, value: content.methodology }
      : null,
    content.figureFiles.length
      ? {
          label: labels.figures,
          value: String(content.figureFiles.length),
        }
      : null,
    content.researchFileCount
      ? {
          label: labels.research,
          value: String(content.researchFileCount),
        }
      : null,
    ...(Array.isArray(content.metadataItems) ? content.metadataItems : []),
  ].filter(
    (item): item is { label: string; value: string } =>
      item !== null &&
      typeof item === "object" &&
      typeof item.label === "string" &&
      typeof item.value === "string" &&
      item.label.trim().length > 0 &&
      item.value.trim().length > 0
  );

  if (!items.length) {
    return "";
  }

  return `
    <section class="meta-grid">
      ${items
        .map(
          item => `
            <article class="meta-card">
              <p class="meta-label">${escapeHtml(item.label)}</p>
              <p class="meta-value">${escapeHtml(item.value)}</p>
            </article>
          `
        )
        .join("")}
    </section>
  `;
}

function renderTickerRail(language: AppLanguage, tickers: string[]) {
  if (!tickers.length) {
    return "";
  }

  return `
    <section class="ticker-rail">
      <p class="ticker-label">${escapeHtml(
        copy(language, "Ticker Evreni", "Ticker Universe")
      )}</p>
      <div class="ticker-list">
        ${tickers
          .slice(0, 36)
          .map(ticker => renderBadge(ticker, "sky"))
          .join("")}
      </div>
    </section>
  `;
}

function renderParagraph(block: Extract<ReportMarkdownBlock, { type: "paragraph" }>) {
  return `<p class="report-paragraph">${escapeHtml(block.text)}</p>`;
}

function renderList(block: Extract<ReportMarkdownBlock, { type: "list" }>) {
  const tagName = block.ordered ? "ol" : "ul";
  return `
    <${tagName} class="report-list ${block.ordered ? "ordered" : "unordered"}">
      ${block.items.map(item => `<li>${escapeHtml(item)}</li>`).join("")}
    </${tagName}>
  `;
}

function renderTable(block: Extract<ReportMarkdownBlock, { type: "table" }>) {
  return `
    <div class="table-shell">
      <table class="report-table">
        <thead>
          <tr>${block.headers.map(header => `<th>${escapeHtml(header)}</th>`).join("")}</tr>
        </thead>
        <tbody>
          ${block.rows
            .map(
              row => `
                <tr>${row.map(cell => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>
              `
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderImage(
  block: Extract<ReportMarkdownBlock, { type: "image" }>,
  resolveImage?: (src: string, alt: string) => ResolvedImage
) {
  const resolved = resolveImage
    ? resolveImage(block.src, block.alt)
    : {
        alt: block.alt,
        label: block.alt,
        src: block.src,
      };

  return `
    <figure class="figure-card">
      <img src="${escapeHtml(resolved.src)}" alt="${escapeHtml(
        resolved.alt || block.alt || ""
      )}" loading="lazy" decoding="async" />
      ${
        resolved.label || block.alt
          ? `<figcaption>${escapeHtml(resolved.label || block.alt)}</figcaption>`
          : ""
      }
    </figure>
  `;
}

function renderBlockquote(block: Extract<ReportMarkdownBlock, { type: "blockquote" }>) {
  return `
    <blockquote class="quote-block">
      ${block.lines.map(line => `<p>${escapeHtml(line)}</p>`).join("")}
    </blockquote>
  `;
}

function renderCode(block: Extract<ReportMarkdownBlock, { type: "code" }>) {
  return `
    <div class="code-shell">
      ${
        block.language
          ? `<div class="code-label">${escapeHtml(block.language)}</div>`
          : ""
      }
      <pre><code>${escapeHtml(block.code)}</code></pre>
    </div>
  `;
}

function renderSubheading(
  block: Extract<ReportMarkdownBlock, { type: "heading" }>,
  blockIndex: number
) {
  const level = block.level === 4 ? "h4" : "h3";
  const id = `report-inline-${blockIndex}-${slugify(block.text) || blockIndex}`;
  return `<${level} id="${id}" class="report-subheading">${escapeHtml(block.text)}</${level}>`;
}

function renderBodyBlocks(
  blocks: ReportMarkdownBlock[],
  language: AppLanguage,
  resolveImage?: (src: string, alt: string) => ResolvedImage
) {
  if (!blocks.length) {
    return `
      <section id="full-document" class="report-section">
        <div class="section-head">
          <p class="section-kicker">${escapeHtml(
            copy(language, "Tam Dokuman", "Full Document")
          )}</p>
          <h2 class="section-title">${escapeHtml(
            copy(language, "Rapor Icerigi", "Report Content")
          )}</h2>
        </div>
      </section>
    `;
  }

  const topAnchors = buildReportHeadingAnchors(blocks, 2);
  const anchorByBlockIndex = new Map(
    topAnchors.map(anchor => [anchor.blockIndex, anchor])
  );
  const parts: string[] = [];
  let sectionOpen = false;

  const openSection = (id: string, title: string) => {
    parts.push(`
      <section id="${escapeHtml(id)}" class="report-section">
        <div class="section-head">
          <p class="section-kicker">${escapeHtml(
            copy(language, "Bolum", "Section")
          )}</p>
          <h2 class="section-title">${escapeHtml(title)}</h2>
        </div>
    `);
    sectionOpen = true;
  };

  const closeSection = () => {
    if (!sectionOpen) {
      return;
    }
    parts.push("</section>");
    sectionOpen = false;
  };

  blocks.forEach((block, blockIndex) => {
    if (block.type === "heading" && block.level <= 2) {
      closeSection();
      const anchor = anchorByBlockIndex.get(blockIndex);
      openSection(
        anchor?.id || `report-section-${blockIndex}-${slugify(block.text) || blockIndex}`,
        block.text
      );
      return;
    }

    if (!sectionOpen) {
      openSection(
        "full-document",
        copy(language, "Rapor Icerigi", "Report Content")
      );
    }

    switch (block.type) {
      case "paragraph":
        parts.push(renderParagraph(block));
        break;
      case "list":
        parts.push(renderList(block));
        break;
      case "table":
        parts.push(renderTable(block));
        break;
      case "image":
        parts.push(renderImage(block, resolveImage));
        break;
      case "blockquote":
        parts.push(renderBlockquote(block));
        break;
      case "code":
        parts.push(renderCode(block));
        break;
      case "heading":
        parts.push(renderSubheading(block, blockIndex));
        break;
      default:
        break;
    }
  });

  closeSection();
  return parts.join("");
}

export function buildDailyReportHtmlDocument({
  content,
  language = "tr",
  reportDateLabel,
  resolveImage,
  sourceLabel = "",
  title,
  updatedAtLabel = "",
}: DailyReportHtmlOptions) {
  const blocks = parseReportMarkdown(content.markdown || "");
  const labels = {
    author: copy(language, "Hazirlayan", "Author"),
    coverage: copy(language, "Kapsam", "Coverage"),
    figures: copy(language, "Gorsel", "Figures"),
    methodology: copy(language, "Metodoloji", "Methodology"),
    research: copy(language, "Arastirma", "Research"),
    reportDate: copy(language, "Rapor Tarihi", "Report Date"),
    source: copy(language, "Kaynak", "Source"),
    updated: copy(language, "Guncellendi", "Updated"),
  };

  const executiveSummary = Array.isArray(content.executiveSummary)
    ? content.executiveSummary
        .filter((item): item is string => typeof item === "string")
        .map(item => normalizeText(item))
        .filter(Boolean)
    : [];

  const tickerUniverse = Array.isArray(content.tickerUniverse)
    ? content.tickerUniverse
        .filter((item): item is string => typeof item === "string")
        .map(item => item.trim())
        .filter(Boolean)
    : [];

  const heroBadges = [
    reportDateLabel
      ? `${labels.reportDate}: ${reportDateLabel}`
      : "",
    updatedAtLabel
      ? `${labels.updated}: ${updatedAtLabel}`
      : "",
    sourceLabel
      ? `${labels.source}: ${sourceLabel}`
      : "",
  ].filter(Boolean);

  const bodyMarkup = renderBodyBlocks(blocks, language, resolveImage);
  const metaMarkup = renderMetaItems(language, content, labels);
  const summaryMarkup = renderSummaryCards(executiveSummary);
  const tickerMarkup = renderTickerRail(language, tickerUniverse);

  return `<!doctype html>
<html lang="${language === "en" ? "en" : "tr"}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <style>
      :root {
        color-scheme: dark;
        --bg: #050c1b;
        --panel: rgba(10, 18, 34, 0.92);
        --panel-soft: rgba(16, 26, 48, 0.78);
        --line: rgba(148, 163, 184, 0.16);
        --line-strong: rgba(56, 189, 248, 0.24);
        --text: #e5eefb;
        --muted: #91a4bf;
        --accent: #38bdf8;
        --accent-2: #34d399;
        --shadow: 0 24px 64px rgba(3, 7, 18, 0.45);
      }

      * {
        box-sizing: border-box;
      }

      html, body {
        margin: 0;
        background:
          radial-gradient(circle at top, rgba(56, 189, 248, 0.12), transparent 26%),
          linear-gradient(180deg, #07111f 0%, #050c1b 100%);
        color: var(--text);
        font-family: Inter, "Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
      }

      body {
        padding: 32px 18px 56px;
      }

      .report-shell {
        width: min(1120px, 100%);
        margin: 0 auto;
        display: grid;
        gap: 20px;
      }

      .hero {
        border: 1px solid var(--line-strong);
        border-radius: 28px;
        background:
          linear-gradient(135deg, rgba(56, 189, 248, 0.12), rgba(16, 185, 129, 0.07)),
          var(--panel);
        box-shadow: var(--shadow);
        padding: 28px;
      }

      .eyebrow {
        margin: 0 0 10px;
        color: #7dd3fc;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.18em;
        text-transform: uppercase;
      }

      .hero h1 {
        margin: 0;
        font-size: clamp(30px, 4vw, 52px);
        line-height: 1.03;
        letter-spacing: -0.04em;
      }

      .hero p.lead {
        margin: 14px 0 0;
        max-width: 880px;
        color: var(--muted);
        font-size: 15px;
        line-height: 1.8;
      }

      .hero-meta,
      .ticker-list {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }

      .hero-meta {
        margin-top: 18px;
      }

      .badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        min-height: 34px;
        padding: 8px 12px;
        border-radius: 999px;
        border: 1px solid var(--line);
        background: rgba(255, 255, 255, 0.04);
        color: var(--text);
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.02em;
      }

      .badge-sky {
        border-color: rgba(56, 189, 248, 0.28);
        background: rgba(56, 189, 248, 0.1);
        color: #c8efff;
      }

      .badge-emerald {
        border-color: rgba(52, 211, 153, 0.28);
        background: rgba(52, 211, 153, 0.1);
        color: #d7ffee;
      }

      .ticker-rail,
      .summary-grid,
      .meta-grid,
      .report-section {
        border: 1px solid var(--line);
        border-radius: 24px;
        background: var(--panel);
        box-shadow: var(--shadow);
      }

      .ticker-rail,
      .report-section {
        padding: 22px 24px;
      }

      .ticker-label,
      .section-kicker,
      .meta-label {
        margin: 0;
        color: #86efac;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.16em;
        text-transform: uppercase;
      }

      .ticker-list {
        margin-top: 14px;
      }

      .summary-grid,
      .meta-grid {
        display: grid;
        gap: 14px;
        padding: 16px;
      }

      .summary-grid {
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      }

      .meta-grid {
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      }

      .summary-card,
      .meta-card {
        min-width: 0;
        border: 1px solid var(--line);
        border-radius: 18px;
        background: var(--panel-soft);
        padding: 16px;
      }

      .summary-index {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 999px;
        border: 1px solid rgba(52, 211, 153, 0.26);
        background: rgba(52, 211, 153, 0.12);
        color: #d7ffee;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 0.08em;
      }

      .summary-card p,
      .meta-card p {
        margin: 0;
      }

      .summary-card p:last-child {
        margin-top: 12px;
        color: var(--text);
        font-size: 14px;
        line-height: 1.75;
      }

      .meta-value {
        margin-top: 10px !important;
        color: var(--text);
        font-size: 15px;
        line-height: 1.6;
        word-break: break-word;
      }

      .section-head {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 18px;
        padding-bottom: 16px;
        border-bottom: 1px solid var(--line);
      }

      .section-title {
        margin: 0;
        font-size: clamp(22px, 3vw, 34px);
        line-height: 1.12;
        letter-spacing: -0.03em;
      }

      .report-subheading {
        margin: 28px 0 12px;
        color: #d3f6ff;
        font-size: 19px;
        line-height: 1.35;
      }

      .report-paragraph {
        margin: 0 0 16px;
        color: var(--text);
        font-size: 15px;
        line-height: 1.85;
      }

      .report-list {
        margin: 0 0 20px;
        padding-left: 22px;
        color: var(--text);
      }

      .report-list li {
        margin: 0 0 10px;
        line-height: 1.8;
      }

      .table-shell {
        overflow-x: auto;
        margin: 6px 0 22px;
        border: 1px solid var(--line);
        border-radius: 18px;
      }

      .report-table {
        width: 100%;
        border-collapse: collapse;
        min-width: 680px;
        background: rgba(5, 12, 27, 0.78);
      }

      .report-table th,
      .report-table td {
        padding: 14px 16px;
        border-bottom: 1px solid var(--line);
        text-align: left;
        vertical-align: top;
        font-size: 14px;
        line-height: 1.65;
      }

      .report-table th {
        color: #b8ecff;
        background: rgba(56, 189, 248, 0.08);
        font-size: 12px;
        font-weight: 800;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .figure-card {
        margin: 0 0 22px;
        overflow: hidden;
        border: 1px solid var(--line);
        border-radius: 22px;
        background: rgba(7, 20, 36, 0.96);
      }

      .figure-card img {
        display: block;
        width: 100%;
        max-height: 560px;
        object-fit: contain;
        background: #07141a;
      }

      .figure-card figcaption {
        padding: 12px 16px 16px;
        color: var(--muted);
        font-size: 13px;
        line-height: 1.6;
      }

      .quote-block {
        margin: 0 0 20px;
        padding: 18px 20px;
        border-left: 3px solid var(--accent);
        border-radius: 0 18px 18px 0;
        background: rgba(56, 189, 248, 0.08);
      }

      .quote-block p {
        margin: 0;
        color: #d8f3ff;
        font-size: 15px;
        line-height: 1.8;
      }

      .quote-block p + p {
        margin-top: 10px;
      }

      .code-shell {
        margin: 0 0 22px;
        overflow: hidden;
        border: 1px solid var(--line);
        border-radius: 18px;
        background: rgba(4, 10, 22, 0.98);
      }

      .code-label {
        padding: 10px 14px;
        border-bottom: 1px solid var(--line);
        color: #7dd3fc;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.16em;
        text-transform: uppercase;
      }

      .code-shell pre {
        margin: 0;
        padding: 16px;
        overflow-x: auto;
        color: #d9f3ff;
        font-size: 13px;
        line-height: 1.7;
      }

      @media (max-width: 800px) {
        body {
          padding: 18px 12px 28px;
        }

        .hero,
        .ticker-rail,
        .report-section {
          padding: 18px;
        }

        .summary-grid,
        .meta-grid {
          padding: 12px;
        }

        .report-table {
          min-width: 560px;
        }
      }
    </style>
  </head>
  <body>
    <main class="report-shell">
      <section id="hero" class="hero">
        <p class="eyebrow">${escapeHtml(copy(language, "Daily Report", "Daily Report"))}</p>
        <h1>${escapeHtml(title)}</h1>
        ${
          content.headline
            ? `<p class="lead">${escapeHtml(content.headline)}</p>`
            : ""
        }
        ${
          heroBadges.length
            ? `<div class="hero-meta">${heroBadges
                .map(item => renderBadge(item, "emerald"))
                .join("")}</div>`
            : ""
        }
      </section>
      ${tickerMarkup}
      ${summaryMarkup}
      ${metaMarkup}
      ${bodyMarkup}
    </main>
  </body>
</html>`;
}
