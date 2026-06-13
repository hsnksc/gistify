import { parseReportMarkdown } from "@/lib/reportMarkdown";

export interface ReportSnapshotMetric {
  label: string;
  value: string;
  detail?: string;
}

function normalizeText(value: string) {
  return value
    .toLocaleLowerCase("tr-TR")
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ş/g, "s")
    .replace(/ü/g, "u")
    .trim();
}

function isMetaLikeParagraph(value: string) {
  return /^[a-z0-9çğıöşü ./%&()+-]{1,32}:\s+.+$/i.test(value.trim());
}

function firstMatchingIndex(headers: string[], patterns: RegExp[]) {
  return headers.findIndex(header =>
    patterns.some(pattern => pattern.test(normalizeText(header)))
  );
}

export function extractSnapshotMetricsFromMarkdown(
  markdown: string,
  maxItems: number = 6
) {
  const tableBlock = parseReportMarkdown(markdown).find(
    (block): block is Extract<ReturnType<typeof parseReportMarkdown>[number], { type: "table" }> =>
      block.type === "table" &&
      block.headers.length >= 2 &&
      block.rows.length > 0
  );

  if (!tableBlock) {
    return [] as ReportSnapshotMetric[];
  }

  const detectedValueIndex = firstMatchingIndex(tableBlock.headers, [
    /deger/,
    /value/,
    /fiyat/,
    /price/,
    /oran/,
    /ratio/,
    /seviye/,
    /level/,
    /skor/,
    /score/,
    /getiri/,
    /veri/,
  ]);
  const valueIndex = detectedValueIndex >= 0 ? detectedValueIndex : 1;
  const detailIndex = firstMatchingIndex(tableBlock.headers, [
    /yorum/,
    /comment/,
    /kaynak/,
    /source/,
    /not/,
    /note/,
    /onem/,
    /importance/,
    /impact/,
  ]);

  return tableBlock.rows
    .slice(0, maxItems)
    .map(row => {
      const label = String(row[0] || "").trim();
      const value = String(row[Math.min(valueIndex, row.length - 1)] || "").trim();
      const detail =
        detailIndex >= 0
          ? String(row[Math.min(detailIndex, row.length - 1)] || "").trim()
          : "";

      return {
        label,
        value,
        detail,
      } satisfies ReportSnapshotMetric;
    })
    .filter(item => item.label && item.value);
}

export function extractLeadParagraphsFromMarkdown(
  markdown: string,
  maxItems: number = 3
) {
  const blocks = parseReportMarkdown(markdown);
  const items: string[] = [];

  for (const block of blocks) {
    if (items.length >= maxItems) {
      break;
    }

    if (block.type === "paragraph") {
      if (!isMetaLikeParagraph(block.text)) {
        items.push(block.text);
      }
      continue;
    }

    if (block.type === "blockquote") {
      const paragraph = block.lines.join(" ").trim();
      if (paragraph) {
        items.push(paragraph);
      }
    }
  }

  return items.slice(0, maxItems);
}

export function splitSummaryText(value: string, maxItems: number = 3) {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (!normalized) {
    return [] as string[];
  }

  const parts = normalized
    .split(/(?<=[.!?])\s+(?=[A-Z0-9ÇĞİÖŞÜ])/)
    .map(part => part.trim())
    .filter(Boolean);

  return (parts.length ? parts : [normalized]).slice(0, maxItems);
}
