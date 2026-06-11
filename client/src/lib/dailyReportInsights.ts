import type { DailyReportContent } from "@shared/dailyReports";

export type MarkdownBlock =
  | { type: "heading"; level: 1 | 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[]; ordered: boolean }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "image"; alt: string; src: string };

export interface DailyReportInsights {
  blocks: MarkdownBlock[];
  sectionTitles: string[];
  keyThemes: string[];
  marketPerformance: Array<{
    label: string;
    change: number;
    close?: string;
  }>;
  sectorStrength: Array<{
    label: string;
    score: number;
    leaders?: string;
  }>;
  momentumLeaders: Array<{
    ticker: string;
    company?: string;
    change: number;
    sector?: string;
  }>;
  breadthStats: Array<{
    label: string;
    value: number;
    tone: "positive" | "negative" | "neutral";
  }>;
  macroSignals: Array<{
    label: string;
    value: string;
    status?: string;
  }>;
  signalRadar: Array<{
    label: string;
    value: number;
  }>;
  figureCards: Array<{
    fileName: string;
    label: string;
  }>;
}

function normalizeForMatch(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function cleanInlineMarkdown(value: string) {
  return value
    .replace(/\[\^[^\]]+\^]/g, "")
    .replace(/\*\*/g, "")
    .replace(/`/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function parseTableRow(line: string) {
  const cells = line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map(cell => cleanInlineMarkdown(cell));

  return cells;
}

function isDividerRow(row: string[]) {
  return row.every(cell => /^:?-{2,}:?$/.test(cell.replace(/\s+/g, "")));
}

export function parseDailyReportMarkdown(markdown: string) {
  const lines = markdown.split(/\r?\n/);
  const blocks: MarkdownBlock[] = [];
  let index = 0;

  while (index < lines.length) {
    const rawLine = lines[index] || "";
    const line = rawLine.trim();

    if (!line || line === "---") {
      index += 1;
      continue;
    }

    if (line.startsWith("# ")) {
      blocks.push({ type: "heading", level: 1, text: cleanInlineMarkdown(line.slice(2)) });
      index += 1;
      continue;
    }

    if (line.startsWith("## ")) {
      blocks.push({ type: "heading", level: 2, text: cleanInlineMarkdown(line.slice(3)) });
      index += 1;
      continue;
    }

    if (line.startsWith("### ")) {
      blocks.push({ type: "heading", level: 3, text: cleanInlineMarkdown(line.slice(4)) });
      index += 1;
      continue;
    }

    const imageMatch = line.match(/^!\[(.*)\]\((.+)\)$/);
    if (imageMatch) {
      blocks.push({
        type: "image",
        alt: cleanInlineMarkdown(imageMatch[1] || ""),
        src: (imageMatch[2] || "").trim(),
      });
      index += 1;
      continue;
    }

    if (line.startsWith("|")) {
      const tableLines: string[] = [];
      while (index < lines.length && (lines[index]?.trim() || "").startsWith("|")) {
        tableLines.push((lines[index] || "").trim());
        index += 1;
      }

      const parsedRows = tableLines.map(parseTableRow).filter(row => row.length > 0);
      if (parsedRows.length >= 2) {
        const [headers, ...restRows] = parsedRows;
        const rows = restRows.filter(row => !isDividerRow(row));
        if (headers.length && rows.length) {
          blocks.push({ type: "table", headers, rows });
          continue;
        }
      }
    }

    if (/^[-*]\s+/.test(line) || /^\d+\.\s+/.test(line)) {
      const ordered = /^\d+\.\s+/.test(line);
      const items: string[] = [];

      while (index < lines.length) {
        const current = (lines[index] || "").trim();
        if (
          (ordered && /^\d+\.\s+/.test(current)) ||
          (!ordered && /^[-*]\s+/.test(current))
        ) {
          items.push(cleanInlineMarkdown(current.replace(/^([-*]|\d+\.)\s+/, "")));
          index += 1;
          continue;
        }

        break;
      }

      blocks.push({ type: "list", items, ordered });
      continue;
    }

    const paragraph: string[] = [];
    while (index < lines.length) {
      const current = (lines[index] || "").trim();
      if (
        !current ||
        current === "---" ||
        current.startsWith("#") ||
        current.startsWith("|") ||
        /^!\[(.*)\]\((.+)\)$/.test(current) ||
        /^[-*]\s+/.test(current) ||
        /^\d+\.\s+/.test(current)
      ) {
        break;
      }

      paragraph.push(cleanInlineMarkdown(current.replace(/^>\s*/, "")));
      index += 1;
    }

    if (paragraph.length) {
      blocks.push({ type: "paragraph", text: paragraph.join(" ") });
      continue;
    }

    index += 1;
  }

  return blocks;
}

function parseNumericToken(value: string) {
  const raw = cleanInlineMarkdown(value);
  const match = raw.match(/[+-]?\d[\d.,]*/);
  if (!match) {
    return null;
  }

  let token = match[0];
  if (token.includes(",") && token.includes(".")) {
    token = token.replace(/,/g, "");
  } else if (token.includes(",") && !token.includes(".")) {
    token = token.replace(",", ".");
  }

  const parsed = Number(token);
  return Number.isFinite(parsed) ? parsed : null;
}

function parsePercent(value: string) {
  const raw = cleanInlineMarkdown(value);
  const match = raw.match(/[+-]?\d+(?:[.,]\d+)?(?=\s*%|$)/);
  if (!match) {
    return null;
  }

  const parsed = Number(match[0].replace(",", "."));
  return Number.isFinite(parsed) ? parsed : null;
}

function getColumnIndex(headers: string[], candidates: string[]) {
  const normalizedHeaders = headers.map(normalizeForMatch);
  return normalizedHeaders.findIndex(header =>
    candidates.some(candidate => header.includes(candidate))
  );
}

function prettifyFigureLabel(fileName: string) {
  const baseName = fileName.split(/[\\/]/).pop() || fileName;

  return baseName
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/^fig[_-]?/i, "")
    .replace(/^chart\d+[_-]?/i, "")
    .replace(/^sec\d+[_-]?/i, "")
    .replace(/[_-]+/g, " ")
    .trim()
    .replace(/\b\w/g, char => char.toUpperCase());
}

function extractBreadthStats(markdown: string) {
  const normalized = normalizeForMatch(markdown);
  const definitions = [
    {
      label: "Advancers",
      tone: "positive" as const,
      patterns: [/yukselen hisse:\s*([\d.,]+)/, /advancers?:\s*([\d.,]+)/],
    },
    {
      label: "Decliners",
      tone: "negative" as const,
      patterns: [/dusen hisse:\s*([\d.,]+)/, /decliners?:\s*([\d.,]+)/],
    },
    {
      label: "52W High",
      tone: "positive" as const,
      patterns: [/52-hafta yuksegi yapan:\s*([\d.,]+)/, /52-week highs?:\s*([\d.,]+)/],
    },
    {
      label: "52W Low",
      tone: "negative" as const,
      patterns: [/52-hafta dibu yapan:\s*([\d.,]+)/, /52-week lows?:\s*([\d.,]+)/],
    },
    {
      label: "Above SMA50",
      tone: "neutral" as const,
      patterns: [/sma50 uzerinde:\s*[\d.,]+\s*\(%?([\d.,]+)/, /above sma50:\s*[\d.,]+\s*\(?%?([\d.,]+)/],
    },
  ];

  return definitions
    .map(definition => {
      const match = definition.patterns
        .map(pattern => normalized.match(pattern))
        .find(Boolean);
      if (!match) {
        return null;
      }

      const value = Number((match[1] || "").replace(/,/g, ""));
      if (!Number.isFinite(value)) {
        return null;
      }

      return {
        label: definition.label,
        value,
        tone: definition.tone,
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
}

function clampTo100(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function buildSignalRadar(
  content: DailyReportContent,
  sectionTitles: string[],
  tables: Extract<MarkdownBlock, { type: "table" }>[]
) {
  return [
    {
      label: "Coverage",
      value: clampTo100(content.tickerUniverse.length * 7 || sectionTitles.length * 8),
    },
    {
      label: "Research",
      value: clampTo100(content.researchFileCount * 4),
    },
    {
      label: "Figures",
      value: clampTo100(content.figureFiles.length * 18),
    },
    {
      label: "Structure",
      value: clampTo100(sectionTitles.length * 10),
    },
    {
      label: "Data Depth",
      value: clampTo100(tables.length * 15),
    },
  ];
}

export function buildDailyReportInsights(content: DailyReportContent): DailyReportInsights {
  const normalizedContent = {
    ...content,
    markdown: typeof content.markdown === "string" ? content.markdown : "",
    executiveSummary: Array.isArray(content.executiveSummary)
      ? content.executiveSummary.filter((item): item is string => typeof item === "string")
      : [],
    figureFiles: Array.isArray(content.figureFiles)
      ? content.figureFiles.filter((item): item is string => typeof item === "string")
      : [],
    tickerUniverse: Array.isArray(content.tickerUniverse)
      ? content.tickerUniverse.filter((item): item is string => typeof item === "string")
      : [],
    researchFileCount:
      typeof content.researchFileCount === "number" &&
      Number.isFinite(content.researchFileCount)
        ? content.researchFileCount
        : 0,
  } satisfies DailyReportContent;
  const blocks = parseDailyReportMarkdown(normalizedContent.markdown);
  const tables = blocks.filter(
    (block): block is Extract<MarkdownBlock, { type: "table" }> => block.type === "table"
  );
  const sectionTitles = blocks
    .filter((block): block is Extract<MarkdownBlock, { type: "heading" }> => block.type === "heading")
    .filter(block => block.level <= 2)
    .map(block => block.text)
    .slice(0, 12);

  const marketTable = tables.find(table => {
    const normalizedHeaders = table.headers.map(normalizeForMatch);
    return (
      normalizedHeaders.some(
        header =>
          header.includes("endeks") ||
          header.includes("index") ||
          header.includes("varlik") ||
          header.includes("asset")
      ) &&
      normalizedHeaders.some(header => header.includes("degisim") || header.includes("change"))
    );
  });

  const marketRows =
    marketTable
      ?.rows.map(row => {
        const labelIndex = getColumnIndex(marketTable.headers, ["endeks", "index"]);
        const changeIndex = getColumnIndex(marketTable.headers, ["degisim", "change"]);
        const closeIndex = getColumnIndex(marketTable.headers, ["kapanis", "close"]);
        if (labelIndex < 0 || changeIndex < 0) {
          return null;
        }

        const change = parsePercent(row[changeIndex] || "");
        if (change === null) {
          return null;
        }

        return {
          label: row[labelIndex] || "Market",
          change,
          close: closeIndex >= 0 ? row[closeIndex] : undefined,
        };
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item))
      .slice(0, 6) || [];

  const sectorTable = tables.find(table => {
    const normalizedHeaders = table.headers.map(normalizeForMatch);
    return (
      normalizedHeaders.some(header => header.includes("sektor") || header.includes("sector")) &&
      normalizedHeaders.some(
        header =>
          header.includes("guc skoru") ||
          header.includes("guc") ||
          header.includes("score") ||
          header.includes("ytd") ||
          header.includes("gunluk performans") ||
          header.includes("daily performance") ||
          header.includes("performans")
      )
    );
  });

  const sectorStrength =
    sectorTable
      ?.rows.map(row => {
        const labelIndex = getColumnIndex(sectorTable.headers, ["sektor", "sector"]);
        const scoreIndex = getColumnIndex(sectorTable.headers, [
          "guc skoru",
          "guc",
          "score",
          "ytd",
          "gunluk performans",
          "daily performance",
          "performans",
        ]);
        const leadersIndex = getColumnIndex(sectorTable.headers, [
          "one cikan",
          "one cikan hisseler",
          "leaders",
          "yorum",
          "teknik / temel yorum",
        ]);

        if (labelIndex < 0 || scoreIndex < 0) {
          return null;
        }

        const score =
          parseNumericToken(row[scoreIndex] || "") ?? parsePercent(row[scoreIndex] || "");
        if (score === null) {
          return null;
        }

        return {
          label: row[labelIndex] || "Sector",
          score,
          leaders: leadersIndex >= 0 ? row[leadersIndex] : undefined,
        };
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item))
      .sort((left, right) => right.score - left.score)
      .slice(0, 6) || [];

  const leadersTable = tables.find(table => {
    const normalizedHeaders = table.headers.map(normalizeForMatch);
    return (
      normalizedHeaders.some(
        header =>
          header === "#" ||
          header.includes("hisse") ||
          header.includes("ticker") ||
          header.includes("stock") ||
          header.includes("varlik") ||
          header.includes("asset")
      ) &&
      normalizedHeaders.some(
        header =>
          header.includes("gunluk") ||
          header.includes("daily") ||
          header.includes("degisim") ||
          header.includes("performans")
      )
    );
  });

  const momentumLeaders =
    leadersTable
      ?.rows.map(row => {
        const tickerIndex = getColumnIndex(leadersTable.headers, [
          "hisse",
          "ticker",
          "stock",
          "varlik",
          "asset",
        ]);
        const companyIndex = getColumnIndex(leadersTable.headers, ["sirket", "company", "name"]);
        const changeIndex = getColumnIndex(leadersTable.headers, [
          "gunluk",
          "daily",
          "degisim",
          "performans",
          "fiyat / performans",
        ]);
        const sectorIndex = getColumnIndex(leadersTable.headers, ["sektor", "sector"]);

        if (tickerIndex < 0 || changeIndex < 0) {
          return null;
        }

        const change = parsePercent(row[changeIndex] || "");
        if (change === null) {
          return null;
        }

        const assetLabel = row[tickerIndex] || "N/A";
        const tickerMatch = assetLabel.match(/\b[A-Z]{2,5}\b/);

        return {
          ticker: tickerMatch?.[0] || assetLabel,
          company: companyIndex >= 0 ? row[companyIndex] : undefined,
          change,
          sector: sectorIndex >= 0 ? row[sectorIndex] : undefined,
        };
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item))
      .sort((left, right) => right.change - left.change)
      .slice(0, 8) || [];

  const macroTable = tables.find(table => {
    const normalizedHeaders = table.headers.map(normalizeForMatch);
    return normalizedHeaders.some(
      header =>
        header.includes("rejim gostergesi") ||
        header.includes("regime") ||
        header.includes("faktor") ||
        header.includes("gosterge") ||
        header.includes("metric") ||
        header.includes("metrik")
    );
  });

  const macroSignals =
    macroTable
      ?.rows.map(row => {
        const labelIndex = getColumnIndex(macroTable.headers, [
          "rejim gostergesi",
          "faktor",
          "factor",
          "regime",
          "gosterge",
          "metric",
          "metrik",
        ]);
        const valueIndex = getColumnIndex(macroTable.headers, [
          "deger",
          "value",
          "bugun",
          "today",
          "seviye",
          "kapanis",
          "close",
          "fiyat / performans",
          "performans",
        ]);
        const statusIndex = getColumnIndex(macroTable.headers, [
          "durum",
          "status",
          "yorum",
          "rejim yorumu",
          "note",
        ]);

        if (labelIndex < 0 || valueIndex < 0) {
          return null;
        }

        return {
          label: row[labelIndex] || "Signal",
          value: row[valueIndex] || "-",
          status: statusIndex >= 0 ? row[statusIndex] : undefined,
        };
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item))
      .slice(0, 5) || [];

  const keyThemes = (normalizedContent.executiveSummary.length
    ? normalizedContent.executiveSummary
    : blocks
        .filter((block): block is Extract<MarkdownBlock, { type: "paragraph" }> => block.type === "paragraph")
        .map(block => block.text)
  )
    .filter(Boolean)
    .filter(item => !item.startsWith("```"))
    .slice(0, 4);

  return {
    blocks,
    sectionTitles,
    keyThemes,
    marketPerformance: marketRows,
    sectorStrength,
    momentumLeaders,
    breadthStats: extractBreadthStats(normalizedContent.markdown),
    macroSignals,
    signalRadar: buildSignalRadar(normalizedContent, sectionTitles, tables),
    figureCards: normalizedContent.figureFiles.map(fileName => ({
      fileName,
      label: prettifyFigureLabel(fileName),
    })),
  };
}
