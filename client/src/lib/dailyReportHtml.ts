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
        --bg: #02040a;
        --bg-elevated: #0b1221;
        --panel: rgba(13, 21, 38, 0.86);
        --panel-solid: #0d1526;
        --panel-soft: rgba(20, 32, 56, 0.72);
        --line: rgba(148, 163, 184, 0.12);
        --line-strong: rgba(56, 189, 248, 0.35);
        --text: #f0f6fc;
        --text-soft: #d1d5db;
        --muted: #94a3b8;
        --accent: #38bdf8;
        --accent-2: #34d399;
        --accent-3: #f59e0b;
        --bull: #34d399;
        --bear: #f87171;
        --neutral: #94a3b8;
        --shadow: 0 32px 80px rgba(2, 8, 22, 0.65);
        --shadow-sm: 0 12px 40px rgba(2, 8, 22, 0.45);
        --glow-sky: 0 0 60px rgba(56, 189, 248, 0.18);
        --glow-emerald: 0 0 60px rgba(52, 211, 153, 0.14);
        --radius-xl: 28px;
        --radius-lg: 22px;
        --radius-md: 16px;
      }

      * {
        box-sizing: border-box;
      }

      html, body {
        margin: 0;
        background: var(--bg);
        color: var(--text);
        font-family: "Inter", "SF Pro Display", "Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
        scroll-behavior: smooth;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      body {
        padding: 28px 18px 80px;
      }

      .report-shell {
        width: min(1160px, 100%);
        margin: 0 auto;
        display: grid;
        gap: 26px;
      }

      .hero {
        position: relative;
        overflow: hidden;
        border: 1px solid var(--line-strong);
        border-radius: var(--radius-xl);
        background:
          radial-gradient(circle at 85% 5%, rgba(56, 189, 248, 0.22), transparent 34%),
          radial-gradient(circle at 15% 95%, rgba(52, 211, 153, 0.16), transparent 32%),
          radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.06), transparent 60%),
          linear-gradient(155deg, rgba(16, 28, 50, 0.98), rgba(7, 14, 28, 0.98));
        box-shadow: var(--shadow), var(--glow-sky);
        padding: 42px 40px;
      }

      .hero::before {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, rgba(56, 189, 248, 0.08), transparent 45%);
        pointer-events: none;
      }

      .hero::after {
        content: "";
        position: absolute;
        top: -40%;
        right: -20%;
        width: 520px;
        height: 520px;
        background: radial-gradient(circle, rgba(56, 189, 248, 0.14), transparent 65%);
        filter: blur(40px);
        pointer-events: none;
      }

      .eyebrow {
        position: relative;
        z-index: 1;
        display: inline-flex;
        align-items: center;
        gap: 10px;
        margin: 0 0 14px;
        padding: 8px 14px;
        border-radius: 999px;
        border: 1px solid rgba(56, 189, 248, 0.25);
        background: rgba(56, 189, 248, 0.1);
        color: #7dd3fc;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        backdrop-filter: blur(6px);
      }

      .eyebrow::before {
        content: "";
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #38bdf8;
        box-shadow: 0 0 10px #38bdf8;
      }

      .hero h1 {
        position: relative;
        z-index: 1;
        margin: 0;
        font-size: clamp(34px, 5vw, 62px);
        line-height: 1.06;
        letter-spacing: -0.045em;
        font-weight: 800;
        background: linear-gradient(180deg, #fff 0%, #c8e6ff 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .hero p.lead {
        position: relative;
        z-index: 1;
        margin: 20px 0 0;
        max-width: 880px;
        color: var(--text-soft);
        font-size: 17px;
        line-height: 1.75;
      }

      .hero-meta {
        position: relative;
        z-index: 1;
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 26px;
      }

      .badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        min-height: 36px;
        padding: 8px 16px;
        border-radius: 999px;
        border: 1px solid var(--line);
        background: rgba(255, 255, 255, 0.05);
        color: var(--text);
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.02em;
        backdrop-filter: blur(6px);
      }

      .badge-sky {
        border-color: rgba(56, 189, 248, 0.32);
        background: rgba(56, 189, 248, 0.12);
        color: #c8efff;
      }

      .badge-emerald {
        border-color: rgba(52, 211, 153, 0.32);
        background: rgba(52, 211, 153, 0.12);
        color: #d7ffee;
      }

      .badge-amber {
        border-color: rgba(245, 158, 11, 0.32);
        background: rgba(245, 158, 11, 0.12);
        color: #fde68a;
      }

      .ticker-rail,
      .summary-grid,
      .meta-grid,
      .report-section,
      .toc-panel {
        border: 1px solid var(--line);
        border-radius: var(--radius-lg);
        background: var(--panel);
        box-shadow: var(--shadow-sm);
        backdrop-filter: blur(12px);
      }

      .ticker-rail,
      .report-section,
      .toc-panel {
        padding: 26px;
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
        margin-top: 18px;
      }

      .ticker-chip {
        display: inline-flex;
        align-items: center;
        min-height: 36px;
        padding: 8px 16px;
        border-radius: 999px;
        border: 1px solid rgba(56, 189, 248, 0.28);
        background: rgba(56, 189, 248, 0.09);
        color: #c8efff;
        font-size: 13px;
        font-weight: 700;
        text-decoration: none;
        transition: transform 0.14s ease, background 0.14s ease, box-shadow 0.14s ease;
        white-space: nowrap;
      }

      .ticker-chip:hover {
        background: rgba(56, 189, 248, 0.18);
        box-shadow: 0 0 18px rgba(56, 189, 248, 0.18);
        transform: translateY(-2px);
      }

      .summary-grid,
      .meta-grid {
        display: grid;
        gap: 18px;
        padding: 20px;
      }

      .summary-grid {
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      }

      .meta-grid {
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      }

      .summary-card,
      .meta-card {
        min-width: 0;
        border: 1px solid var(--line);
        border-radius: var(--radius-md);
        background: var(--panel-soft);
        padding: 20px;
        transition: transform 0.14s ease, border-color 0.14s ease, box-shadow 0.14s ease;
      }

      .summary-card:hover,
      .meta-card:hover {
        border-color: rgba(148, 163, 184, 0.22);
        box-shadow: 0 14px 36px rgba(2, 8, 22, 0.35);
        transform: translateY(-2px);
      }

      .summary-card-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 14px;
      }

      .summary-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 30px;
        border-radius: 999px;
        font-size: 14px;
        font-weight: 800;
      }

      .summary-card-bullish .summary-icon {
        background: rgba(52, 211, 153, 0.18);
        color: var(--bull);
        box-shadow: 0 0 14px rgba(52, 211, 153, 0.14);
      }

      .summary-card-bearish .summary-icon {
        background: rgba(248, 113, 113, 0.18);
        color: var(--bear);
        box-shadow: 0 0 14px rgba(248, 113, 113, 0.12);
      }

      .summary-card-neutral .summary-icon {
        background: rgba(148, 163, 184, 0.14);
        color: var(--neutral);
      }

      .summary-index {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 34px;
        height: 34px;
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
        font-size: 15px;
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
        top: 18px;
        z-index: 10;
      }

      .toc-title {
        margin-bottom: 16px;
      }

      .toc-list {
        margin: 0;
        padding-left: 18px;
        display: flex;
        flex-wrap: wrap;
        gap: 10px 22px;
      }

      .toc-list li {
        color: var(--muted);
        font-size: 13px;
      }

      .toc-list a {
        color: var(--accent);
        text-decoration: none;
        font-weight: 500;
        transition: color 0.12s ease;
      }

      .toc-list a:hover {
        color: #7dd3fc;
        text-decoration: underline;
      }

      .section-head {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-bottom: 22px;
        padding-bottom: 18px;
        border-bottom: 1px solid var(--line);
      }

      .section-title {
        margin: 0;
        font-size: clamp(26px, 3.2vw, 38px);
        line-height: 1.12;
        letter-spacing: -0.035em;
        font-weight: 700;
      }

      .report-subheading {
        margin: 34px 0 16px;
        color: #d3f6ff;
        font-size: 21px;
        line-height: 1.35;
        font-weight: 600;
      }

      .report-paragraph {
        margin: 0 0 18px;
        color: var(--text-soft);
        font-size: 16px;
        line-height: 1.85;
      }

      .report-list {
        margin: 0 0 22px;
        padding-left: 24px;
        color: var(--text-soft);
      }

      .report-list li {
        margin: 0 0 12px;
        line-height: 1.8;
      }

      .table-shell {
        overflow-x: auto;
        margin: 10px 0 26px;
        border: 1px solid var(--line);
        border-radius: var(--radius-md);
        -webkit-overflow-scrolling: touch;
      }

      .report-table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
        min-width: 680px;
        background: rgba(4, 11, 25, 0.6);
      }

      .report-table th,
      .report-table td {
        padding: 15px 18px;
        border-bottom: 1px solid var(--line);
        text-align: left;
        vertical-align: top;
        font-size: 14px;
        line-height: 1.65;
      }

      .report-table th {
        color: #b8ecff;
        background: rgba(56, 189, 248, 0.1);
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 0.09em;
        text-transform: uppercase;
      }

      .report-table th:first-child {
        border-radius: var(--radius-md) 0 0 0;
      }

      .report-table th:last-child {
        border-radius: 0 var(--radius-md) 0 0;
      }

      .report-table tbody tr:last-child td {
        border-bottom: none;
      }

      .report-table tbody tr:hover td {
        background: rgba(56, 189, 248, 0.04);
      }

      .figure-card {
        margin: 0 0 26px;
        overflow: hidden;
        border: 1px solid var(--line);
        border-radius: var(--radius-lg);
        background: rgba(6, 17, 32, 0.98);
        cursor: zoom-in;
        transition: transform 0.14s ease, box-shadow 0.14s ease;
      }

      .figure-card:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-sm);
      }

      .figure-card img {
        display: block;
        width: 100%;
        max-height: 620px;
        object-fit: contain;
        background: #050e18;
      }

      .figure-card figcaption {
        padding: 16px 20px 20px;
        color: var(--muted);
        font-size: 13px;
        line-height: 1.6;
        border-top: 1px solid var(--line);
      }

      .quote-block {
        margin: 0 0 22px;
        padding: 20px 24px;
        border-left: 3px solid var(--accent);
        border-radius: 0 var(--radius-md) var(--radius-md) 0;
        background: rgba(56, 189, 248, 0.08);
      }

      .quote-block p {
        margin: 0;
        color: #d8f3ff;
        font-size: 15.5px;
        line-height: 1.85;
      }

      .quote-block p + p {
        margin-top: 12px;
      }

      .code-shell {
        margin: 0 0 26px;
        overflow: hidden;
        border: 1px solid var(--line);
        border-radius: var(--radius-md);
        background: rgba(3, 9, 20, 0.98);
      }

      .code-label {
        padding: 12px 18px;
        border-bottom: 1px solid var(--line);
        color: #7dd3fc;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 0.16em;
        text-transform: uppercase;
      }

      .code-shell pre {
        margin: 0;
        padding: 20px;
        overflow-x: auto;
        color: #d9f3ff;
        font-size: 13.5px;
        line-height: 1.7;
      }

      .disclaimer {
        margin-top: 10px;
        padding: 24px;
        border: 1px dashed rgba(148, 163, 184, 0.25);
        border-radius: var(--radius-md);
        background: rgba(255, 255, 255, 0.02);
        color: var(--muted);
        font-size: 13px;
        line-height: 1.8;
      }

      #lightbox {
        position: fixed;
        inset: 0;
        display: none;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.92);
        backdrop-filter: blur(8px);
        z-index: 1000;
        padding: 24px;
      }

      #lightbox.active {
        display: flex;
      }

      #lightbox img {
        max-width: 100%;
        max-height: 92vh;
        border-radius: var(--radius-md);
        box-shadow: 0 40px 100px rgba(0, 0, 0, 0.7);
      }

      @media (max-width: 800px) {
        body {
          padding: 18px 14px 48px;
        }

        .report-shell {
          gap: 18px;
        }

        .hero {
          padding: 28px 22px;
          border-radius: var(--radius-lg);
        }

        .hero h1 {
          font-size: clamp(30px, 7vw, 42px);
        }

        .hero p.lead {
          font-size: 15px;
        }

        .ticker-rail,
        .report-section,
        .toc-panel {
          padding: 20px;
          border-radius: var(--radius-md);
        }

        .summary-grid,
        .meta-grid {
          padding: 16px;
          gap: 14px;
        }

        .summary-grid {
          grid-template-columns: 1fr;
        }

        .meta-grid {
          grid-template-columns: 1fr;
        }

        .report-table {
          min-width: 560px;
        }

        .toc-panel {
          position: static;
        }

        .toc-list {
          display: block;
          padding-left: 18px;
        }

        .toc-list li {
          margin-bottom: 8px;
        }
      }

      @media (max-width: 480px) {
        body {
          padding: 14px 12px 36px;
        }

        .hero {
          padding: 22px 18px;
        }

        .hero h1 {
          font-size: clamp(26px, 8vw, 34px);
        }

        .hero p.lead {
          font-size: 14px;
          line-height: 1.7;
        }

        .badge {
          font-size: 11px;
          padding: 7px 12px;
        }

        .ticker-rail,
        .report-section,
        .toc-panel {
          padding: 16px;
        }

        .ticker-list {
          flex-wrap: nowrap;
          overflow-x: auto;
          padding-bottom: 6px;
          -webkit-overflow-scrolling: touch;
        }

        .report-paragraph {
          font-size: 15px;
        }

        .report-table th,
        .report-table td {
          padding: 12px 14px;
          font-size: 13px;
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
