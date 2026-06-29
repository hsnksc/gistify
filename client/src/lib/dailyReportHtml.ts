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
  title?: string;
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

function cleanInlineMarkdown(value: string) {
  return value
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 ($2)")
    .replace(/\[\^([^\]]+)\^\]/g, "$1")
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, "$1")
    .replace(/[*_~`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

interface PremiumReportFeatures {
  title?: string;
  headline?: string;
  metadataItems?: { label: string; value: string }[];
  executiveSummary?: string[];
  bodyMarkdown: string;
}

export function extractPremiumReportFeatures(markdown: string): PremiumReportFeatures {
  const lines = markdown.split(/\r?\n/);
  const metadataItems: { label: string; value: string }[] = [];
  const executiveSummary: string[] = [];
  let title = "";
  let headline = "";
  const keptLines: string[] = [];
  let i = 0;

  // 1. Title: first H1
  while (i < lines.length) {
    const line = lines[i];
    const h1Match = line.match(/^#\s+(.+)$/);
    if (h1Match) {
      title = cleanInlineMarkdown(h1Match[1]);
      i++;
      break;
    }
    keptLines.push(line);
    i++;
  }

  // 2. Headline: first non-empty paragraph before metadata
  while (i < lines.length) {
    const line = lines[i].trim();
    if (!line) {
      keptLines.push(lines[i]);
      i++;
      continue;
    }
    if (/^\*\*(.+)\*\*\s+/.test(line)) break;
    headline = cleanInlineMarkdown(line);
    i++;
    break;
  }

  // 3. Metadata lines: **Label:** Value
  while (i < lines.length) {
    const line = lines[i].trim();
    if (!line) {
      keptLines.push(lines[i]);
      i++;
      continue;
    }
    const metaMatch = line.match(/^\*\*(.+)\*\*\s+(.+)$/);
    if (!metaMatch) break;
    const label = cleanInlineMarkdown(metaMatch[1]).replace(/:$/, "");
    const value = cleanInlineMarkdown(metaMatch[2]);
    if (label && value) metadataItems.push({ label, value });
    i++;
  }

  // 4. Skip horizontal rules / blanks
  while (i < lines.length) {
    const line = lines[i].trim();
    if (line === "---" || line === "") {
      i++;
      continue;
    }
    break;
  }

  // 5. Executive summary section
  if (i < lines.length) {
    const execMatch = lines[i].trim().match(/^##\s+(.+)$/i);
    if (execMatch) {
      const headingText = execMatch[1].toLowerCase();
      const isExecSummary =
        headingText.includes("executive") ||
        headingText.includes("yönetici") ||
        headingText.includes("yönetiçi") ||
        headingText.includes("ozet") ||
        headingText.includes("özet");
      if (isExecSummary) {
        i++;
        while (i < lines.length && lines[i].trim() === "") i++;
        while (i < lines.length) {
          const line = lines[i].trim();
          if (line === "---" || /^##/.test(line)) break;
          const listMatch = line.match(/^[-*]\s+(.+)$/);
          if (listMatch) {
            executiveSummary.push(cleanInlineMarkdown(listMatch[1]));
            i++;
            continue;
          }
          if (line === "") {
            i++;
            continue;
          }
          break;
        }
      }
    }
  }

  // 6. Keep remaining lines
  while (i < lines.length) {
    keptLines.push(lines[i]);
    i++;
  }

  return {
    title: title || undefined,
    headline: headline || undefined,
    metadataItems: metadataItems.length ? metadataItems : undefined,
    executiveSummary: executiveSummary.length ? executiveSummary : undefined,
    bodyMarkdown: keptLines.join("\n").trim(),
  };
}

function renderBadge(value: string, tone: "neutral" | "sky" | "emerald" | "amber" = "neutral") {
  const className =
    tone === "sky"
      ? "badge badge-sky"
      : tone === "emerald"
        ? "badge badge-emerald"
        : tone === "amber"
          ? "badge badge-amber"
          : "badge";
  return `<span class="${className}">${escapeHtml(value)}</span>`;
}

function detectSummaryTone(text: string): "bullish" | "bearish" | "neutral" {
  const lowered = text.toLowerCase();
  const bullish = ["yükseliş", "güçlü", "pozitif", "bullish", "strong", "upside", "break above"];
  const bearish = ["düşüş", "zayıf", "negatif", "bearish", "weak", "downside", "break below"];
  const bCount = bullish.reduce((sum, word) => sum + (lowered.includes(word) ? 1 : 0), 0);
  const bearCount = bearish.reduce((sum, word) => sum + (lowered.includes(word) ? 1 : 0), 0);
  if (bCount > bearCount) return "bullish";
  if (bearCount > bCount) return "bearish";
  return "neutral";
}

function renderSummaryCards(summary: string[]) {
  if (!summary.length) {
    return "";
  }

  const icons: Record<string, string> = {
    bullish: "▲",
    bearish: "▼",
    neutral: "●",
  };

  return `
    <section class="summary-grid">
      ${summary
        .slice(0, 6)
        .map((item, index) => {
          const tone = detectSummaryTone(item);
          return `
            <article class="summary-card summary-card-${tone}">
              <div class="summary-card-head">
                <span class="summary-icon">${icons[tone]}</span>
                <span class="summary-index">${String(index + 1).padStart(2, "0")}</span>
              </div>
              <p>${escapeHtml(item)}</p>
            </article>
          `;
        })
        .join("")}
    </section>
  `;
}

function normalizeMetaLabel(value: string) {
  return value
    .toLowerCase()
    .replace(/[ç]/g, "c")
    .replace(/[ğ]/g, "g")
    .replace(/[ı]/g, "i")
    .replace(/[ö]/g, "o")
    .replace(/[ş]/g, "s")
    .replace(/[ü]/g, "u")
    .replace(/[^a-z0-9]/g, "")
    .trim();
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
  const metadataLabels = new Set(
    (content.metadataItems || []).map(item => normalizeMetaLabel(item.label))
  );
  const items = [
    content.author &&
    !metadataLabels.has(normalizeMetaLabel(labels.author)) &&
    !metadataLabels.has("hazirlayan") &&
    !metadataLabels.has("author")
      ? { label: labels.author, value: content.author }
      : null,
    content.coverage &&
    !metadataLabels.has(normalizeMetaLabel(labels.coverage)) &&
    !metadataLabels.has("kapsam") &&
    !metadataLabels.has("coverage")
      ? { label: labels.coverage, value: content.coverage }
      : null,
    content.methodology &&
    !metadataLabels.has(normalizeMetaLabel(labels.methodology)) &&
    !metadataLabels.has("metodoloji") &&
    !metadataLabels.has("methodology")
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
          .map(
            ticker =>
              `<a class="ticker-chip" href="/reports/${escapeHtml(ticker)}" target="_top">$${escapeHtml(ticker)}</a>`
          )
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
    <figure class="figure-card" data-figure>
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

interface BodyRenderResult {
  html: string;
  topSections: { id: string; label: string }[];
}

function renderBodyBlocks(
  blocks: ReportMarkdownBlock[],
  language: AppLanguage,
  resolveImage?: (src: string, alt: string) => ResolvedImage
): BodyRenderResult {
  const topAnchors = buildReportHeadingAnchors(blocks, 2);
  const anchorByBlockIndex = new Map(
    topAnchors.map(anchor => [anchor.blockIndex, anchor])
  );
  const parts: string[] = [];
  const topSections: { id: string; label: string }[] = [];
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
    topSections.push({ id, label: title });
  };

  const closeSection = () => {
    if (!sectionOpen) {
      return;
    }
    parts.push("</section>");
    sectionOpen = false;
  };

  blocks.forEach((block, blockIndex) => {
    if (block.type === "heading" && block.level === 2) {
      closeSection();
      const anchor = anchorByBlockIndex.get(blockIndex);
      const sectionId =
        anchor?.id || `report-section-${blockIndex}-${slugify(block.text) || blockIndex}`;
      openSection(sectionId, block.text);
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
  return { html: parts.join(""), topSections };
}

function renderToc(
  language: AppLanguage,
  sections: { id: string; label: string }[]
) {
  if (sections.length <= 1) {
    return "";
  }

  return `
    <nav class="toc-panel" aria-label="${escapeHtml(
      copy(language, "Icerikler", "Table of contents")
    )}">
      <p class="toc-title">${escapeHtml(copy(language, "Icerikler", "Contents"))}</p>
      <ol class="toc-list">
        ${sections
          .map(
            section => `
              <li>
                <a href="#${escapeHtml(section.id)}">${escapeHtml(section.label)}</a>
              </li>
            `
          )
          .join("")}
      </ol>
    </nav>
  `;
}

export function buildDailyReportHtmlDocument({
  content,
  language = "tr",
  reportDateLabel,
  resolveImage,
  sourceLabel = "",
  title: titleOverride,
  updatedAtLabel = "",
}: DailyReportHtmlOptions) {
  const premium = extractPremiumReportFeatures(content.markdown || "");
  const markdown = premium.bodyMarkdown || content.markdown || "";
  const blocks = parseReportMarkdown(markdown);

  const effectiveTitle =
    titleOverride || premium.title || content.title || "";
  const effectiveHeadline = premium.headline || content.headline || "";
  const effectiveMetadataItems = premium.metadataItems || content.metadataItems || [];
  const effectiveExecutiveSummary =
    premium.executiveSummary || content.executiveSummary || [];

  const contentWithPremium: DailyReportContent = {
    ...content,
    markdown,
    title: effectiveTitle,
    headline: effectiveHeadline,
    metadataItems: effectiveMetadataItems,
    executiveSummary: effectiveExecutiveSummary,
    author:
      premium.metadataItems?.find(m => /author|hazirlayan/i.test(m.label))
        ?.value || content.author,
    coverage:
      premium.metadataItems?.find(m => /coverage|kapsam/i.test(m.label))
        ?.value || content.coverage,
    methodology:
      premium.metadataItems?.find(m => /methodology|metodoloji/i.test(m.label))
        ?.value || content.methodology,
  };

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

  const executiveSummary = Array.isArray(contentWithPremium.executiveSummary)
    ? contentWithPremium.executiveSummary
        .filter((item): item is string => typeof item === "string")
        .map(item => normalizeText(item))
        .filter(Boolean)
    : [];

  const tickerUniverse = Array.isArray(contentWithPremium.tickerUniverse)
    ? contentWithPremium.tickerUniverse
        .filter((item): item is string => typeof item === "string")
        .map(item => item.trim())
        .filter(Boolean)
    : [];

  const heroBadges = [
    reportDateLabel ? `${labels.reportDate}: ${reportDateLabel}` : "",
    updatedAtLabel ? `${labels.updated}: ${updatedAtLabel}` : "",
    sourceLabel ? `${labels.source}: ${sourceLabel}` : "",
  ].filter(Boolean);

  const { html: bodyMarkup, topSections } = renderBodyBlocks(blocks, language, resolveImage);
  const metaMarkup = renderMetaItems(language, contentWithPremium, labels);
  const summaryMarkup = renderSummaryCards(executiveSummary);
  const tickerMarkup = renderTickerRail(language, tickerUniverse);
  const tocMarkup = renderToc(language, topSections);

  return `<!doctype html>
<html lang="${language === "en" ? "en" : "tr"}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(effectiveTitle)}</title>
    <style>
      :root {
        color-scheme: dark;
        --bg: #030712;
        --bg-elevated: #0b1221;
        --panel: rgba(11, 18, 33, 0.96);
        --panel-soft: rgba(17, 28, 51, 0.82);
        --line: rgba(148, 163, 184, 0.14);
        --line-strong: rgba(56, 189, 248, 0.28);
        --text: #e6effa;
        --muted: #8fa0b8;
        --accent: #38bdf8;
        --accent-2: #34d399;
        --accent-3: #f59e0b;
        --bull: #34d399;
        --bear: #f87171;
        --neutral: #94a3b8;
        --shadow: 0 28px 70px rgba(2, 6, 16, 0.55);
        --shadow-sm: 0 10px 30px rgba(2, 6, 16, 0.35);
      }

      * {
        box-sizing: border-box;
      }

      html, body {
        margin: 0;
        background: var(--bg);
        color: var(--text);
        font-family: Inter, "Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
        scroll-behavior: smooth;
      }

      body {
        padding: 24px 16px 64px;
      }

      .report-shell {
        width: min(1160px, 100%);
        margin: 0 auto;
        display: grid;
        gap: 22px;
      }

      .hero {
        position: relative;
        overflow: hidden;
        border: 1px solid var(--line-strong);
        border-radius: 32px;
        background:
          radial-gradient(circle at 90% 10%, rgba(56, 189, 248, 0.16), transparent 32%),
          radial-gradient(circle at 10% 90%, rgba(52, 211, 153, 0.10), transparent 30%),
          linear-gradient(145deg, rgba(13, 24, 43, 0.98), rgba(7, 14, 28, 0.96));
        box-shadow: var(--shadow);
        padding: 34px;
      }

      .hero::before {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, rgba(56, 189, 248, 0.06), transparent 40%);
        pointer-events: none;
      }

      .eyebrow {
        margin: 0 0 12px;
        color: #7dd3fc;
        font-size: 12px;
        font-weight: 800;
        letter-spacing: 0.2em;
        text-transform: uppercase;
      }

      .hero h1 {
        margin: 0;
        font-size: clamp(32px, 4.5vw, 56px);
        line-height: 1.05;
        letter-spacing: -0.04em;
        font-weight: 800;
      }

      .hero p.lead {
        margin: 18px 0 0;
        max-width: 900px;
        color: var(--muted);
        font-size: 16px;
        line-height: 1.8;
      }

      .hero-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 22px;
      }

      .badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        min-height: 36px;
        padding: 8px 14px;
        border-radius: 999px;
        border: 1px solid var(--line);
        background: rgba(255, 255, 255, 0.04);
        color: var(--text);
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.02em;
      }

      .badge-sky {
        border-color: rgba(56, 189, 248, 0.32);
        background: rgba(56, 189, 248, 0.11);
        color: #c8efff;
      }

      .badge-emerald {
        border-color: rgba(52, 211, 153, 0.32);
        background: rgba(52, 211, 153, 0.11);
        color: #d7ffee;
      }

      .badge-amber {
        border-color: rgba(245, 158, 11, 0.32);
        background: rgba(245, 158, 11, 0.11);
        color: #fde68a;
      }

      .ticker-rail,
      .summary-grid,
      .meta-grid,
      .report-section,
      .toc-panel {
        border: 1px solid var(--line);
        border-radius: 26px;
        background: var(--panel);
        box-shadow: var(--shadow-sm);
      }

      .ticker-rail,
      .report-section,
      .toc-panel {
        padding: 24px;
      }

      .ticker-label,
      .section-kicker,
      .meta-label,
      .toc-title {
        margin: 0;
        color: #86efac;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 0.18em;
        text-transform: uppercase;
      }

      .ticker-list {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 16px;
      }

      .ticker-chip {
        display: inline-flex;
        align-items: center;
        min-height: 34px;
        padding: 8px 14px;
        border-radius: 999px;
        border: 1px solid rgba(56, 189, 248, 0.28);
        background: rgba(56, 189, 248, 0.09);
        color: #c8efff;
        font-size: 13px;
        font-weight: 700;
        text-decoration: none;
        transition: transform 0.12s ease, background 0.12s ease;
      }

      .ticker-chip:hover {
        background: rgba(56, 189, 248, 0.18);
        transform: translateY(-1px);
      }

      .summary-grid,
      .meta-grid {
        display: grid;
        gap: 16px;
        padding: 18px;
      }

      .summary-grid {
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      }

      .meta-grid {
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      }

      .summary-card,
      .meta-card {
        min-width: 0;
        border: 1px solid var(--line);
        border-radius: 20px;
        background: var(--panel-soft);
        padding: 18px;
      }

      .summary-card-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px;
      }

      .summary-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        border-radius: 999px;
        font-size: 14px;
        font-weight: 800;
      }

      .summary-card-bullish .summary-icon {
        background: rgba(52, 211, 153, 0.16);
        color: var(--bull);
      }

      .summary-card-bearish .summary-icon {
        background: rgba(248, 113, 113, 0.16);
        color: var(--bear);
      }

      .summary-card-neutral .summary-icon {
        background: rgba(148, 163, 184, 0.16);
        color: var(--neutral);
      }

      .summary-index {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 999px;
        border: 1px solid rgba(148, 163, 184, 0.2);
        background: rgba(255, 255, 255, 0.04);
        color: var(--muted);
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 0.08em;
      }

      .summary-card p,
      .meta-card p {
        margin: 0;
      }

      .summary-card p:last-child {
        color: var(--text);
        font-size: 14.5px;
        line-height: 1.75;
      }

      .meta-value {
        margin-top: 10px !important;
        color: var(--text);
        font-size: 15px;
        line-height: 1.6;
        word-break: break-word;
      }

      .toc-panel {
        position: sticky;
        top: 16px;
        z-index: 10;
      }

      .toc-title {
        margin-bottom: 14px;
      }

      .toc-list {
        margin: 0;
        padding-left: 18px;
        display: flex;
        flex-wrap: wrap;
        gap: 8px 20px;
      }

      .toc-list li {
        color: var(--muted);
        font-size: 13px;
      }

      .toc-list a {
        color: var(--accent);
        text-decoration: none;
        font-weight: 500;
      }

      .toc-list a:hover {
        text-decoration: underline;
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
        font-size: clamp(24px, 3vw, 36px);
        line-height: 1.12;
        letter-spacing: -0.03em;
        font-weight: 700;
      }

      .report-subheading {
        margin: 30px 0 14px;
        color: #d3f6ff;
        font-size: 20px;
        line-height: 1.35;
        font-weight: 600;
      }

      .report-paragraph {
        margin: 0 0 16px;
        color: var(--text);
        font-size: 15.5px;
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
        margin: 8px 0 24px;
        border: 1px solid var(--line);
        border-radius: 20px;
      }

      .report-table {
        width: 100%;
        border-collapse: collapse;
        min-width: 680px;
        background: rgba(4, 11, 25, 0.78);
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
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .report-table tr:last-child td {
        border-bottom: none;
      }

      .figure-card {
        margin: 0 0 24px;
        overflow: hidden;
        border: 1px solid var(--line);
        border-radius: 24px;
        background: rgba(6, 17, 32, 0.98);
        cursor: zoom-in;
      }

      .figure-card img {
        display: block;
        width: 100%;
        max-height: 580px;
        object-fit: contain;
        background: #050e18;
      }

      .figure-card figcaption {
        padding: 14px 18px 18px;
        color: var(--muted);
        font-size: 13px;
        line-height: 1.6;
      }

      .quote-block {
        margin: 0 0 20px;
        padding: 18px 22px;
        border-left: 3px solid var(--accent);
        border-radius: 0 20px 20px 0;
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
        margin: 0 0 24px;
        overflow: hidden;
        border: 1px solid var(--line);
        border-radius: 20px;
        background: rgba(3, 9, 20, 0.98);
      }

      .code-label {
        padding: 10px 16px;
        border-bottom: 1px solid var(--line);
        color: #7dd3fc;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 0.16em;
        text-transform: uppercase;
      }

      .code-shell pre {
        margin: 0;
        padding: 18px;
        overflow-x: auto;
        color: #d9f3ff;
        font-size: 13px;
        line-height: 1.7;
      }

      .disclaimer {
        margin-top: 8px;
        padding: 22px;
        border: 1px dashed var(--line);
        border-radius: 20px;
        background: rgba(255, 255, 255, 0.02);
        color: var(--muted);
        font-size: 13px;
        line-height: 1.75;
      }

      #lightbox {
        position: fixed;
        inset: 0;
        display: none;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.92);
        z-index: 1000;
        padding: 24px;
      }

      #lightbox.active {
        display: flex;
      }

      #lightbox img {
        max-width: 100%;
        max-height: 92vh;
        border-radius: 12px;
        box-shadow: 0 40px 100px rgba(0, 0, 0, 0.7);
      }

      @media (max-width: 800px) {
        body {
          padding: 16px 12px 32px;
        }

        .hero,
        .ticker-rail,
        .report-section,
        .toc-panel {
          padding: 18px;
          border-radius: 20px;
        }

        .summary-grid,
        .meta-grid {
          padding: 14px;
        }

        .report-table {
          min-width: 560px;
        }

        .toc-panel {
          position: static;
        }
      }
    </style>
  </head>
  <body>
    <main class="report-shell">
      <section id="hero" class="hero">
        <p class="eyebrow">${escapeHtml(copy(language, "Daily Report", "Daily Report"))}</p>
        <h1>${escapeHtml(effectiveTitle)}</h1>
        ${
          contentWithPremium.headline
            ? `<p class="lead">${escapeHtml(contentWithPremium.headline)}</p>`
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
      ${tocMarkup}
      ${tickerMarkup}
      ${summaryMarkup}
      ${metaMarkup}
      ${bodyMarkup}
      <div class="disclaimer">
        ${escapeHtml(
          copy(
            language,
            "Bu rapor yalnizca bilgilendirme amaclidir; yatirim tavsiyesi degildir. Her trade karari kendi risk toleransiniza gore alinmalidir.",
            "This report is for informational purposes only and does not constitute investment advice. Every trade decision should be based on your own risk tolerance."
          )
        )}
      </div>
    </main>
    <div id="lightbox" onclick="this.classList.remove('active')">
      <img src="" alt="" />
    </div>
    <script>
      (() => {
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = lightbox.querySelector('img');
        document.querySelectorAll('figure[data-figure] img').forEach(img => {
          img.addEventListener('click', () => {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt || '';
            lightbox.classList.add('active');
          });
        });
        document.addEventListener('keydown', e => {
          if (e.key === 'Escape') lightbox.classList.remove('active');
        });
      })();
    </script>
  </body>
</html>`;
}
