export type ReportMarkdownBlock =
  | { type: "heading"; level: 1 | 2 | 3 | 4; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "image"; alt: string; src: string }
  | { type: "blockquote"; lines: string[] }
  | { type: "code"; language: string; code: string };

export interface ReportHeadingAnchor {
  id: string;
  label: string;
  level: 1 | 2 | 3 | 4;
  index: number;
  blockIndex: number;
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

function parseTableRow(line: string) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map(cell => cleanInlineMarkdown(cell));
}

function isDividerRow(row: string[]) {
  return row.every(cell => /^:?-{2,}:?$/.test(cell.replace(/\s+/g, "")));
}

export function parseReportMarkdown(markdown: string) {
  const lines = markdown.split(/\r?\n/);
  const blocks: ReportMarkdownBlock[] = [];
  let index = 0;

  while (index < lines.length) {
    const currentLine = lines[index] || "";
    const line = currentLine.trim();

    if (!line || line === "---") {
      index += 1;
      continue;
    }

    const headingMatch = line.match(/^(#{1,4})\s+(.+)$/);
    if (headingMatch) {
      blocks.push({
        type: "heading",
        level: Math.min(4, headingMatch[1].length) as 1 | 2 | 3 | 4,
        text: cleanInlineMarkdown(headingMatch[2] || ""),
      });
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

    if (line.startsWith("```")) {
      const language = line.replace(/^```/, "").trim();
      const codeLines: string[] = [];
      index += 1;

      while (index < lines.length && !(lines[index] || "").trim().startsWith("```")) {
        codeLines.push((lines[index] || "").replace(/\r/g, ""));
        index += 1;
      }

      blocks.push({
        type: "code",
        language,
        code: codeLines.join("\n").trim(),
      });
      index += 1;
      continue;
    }

    if (line.startsWith(">")) {
      const quoteLines: string[] = [];

      while (index < lines.length && (lines[index] || "").trim().startsWith(">")) {
        quoteLines.push(
          cleanInlineMarkdown((lines[index] || "").trim().replace(/^>\s*/, ""))
        );
        index += 1;
      }

      if (quoteLines.length) {
        blocks.push({
          type: "blockquote",
          lines: quoteLines,
        });
      }
      continue;
    }

    if (line.startsWith("|")) {
      const tableLines: string[] = [];

      while (index < lines.length && (lines[index] || "").trim().startsWith("|")) {
        tableLines.push((lines[index] || "").trim());
        index += 1;
      }

      const parsedRows = tableLines.map(parseTableRow).filter(row => row.length > 0);
      if (parsedRows.length >= 2) {
        const [headers, ...restRows] = parsedRows;
        const rows = restRows.filter(row => !isDividerRow(row));
        if (headers.length && rows.length) {
          blocks.push({
            type: "table",
            headers,
            rows,
          });
          continue;
        }
      }
    }

    if (/^[-*]\s+/.test(line) || /^\d+\.\s+/.test(line)) {
      const ordered = /^\d+\.\s+/.test(line);
      const items: string[] = [];

      while (index < lines.length) {
        const itemLine = (lines[index] || "").trim();
        if (
          (ordered && /^\d+\.\s+/.test(itemLine)) ||
          (!ordered && /^[-*]\s+/.test(itemLine))
        ) {
          items.push(cleanInlineMarkdown(itemLine.replace(/^([-*]|\d+\.)\s+/, "")));
          index += 1;
          continue;
        }

        break;
      }

      if (items.length) {
        blocks.push({
          type: "list",
          ordered,
          items,
        });
      }
      continue;
    }

    const paragraphLines: string[] = [];
    while (index < lines.length) {
      const paragraphLine = (lines[index] || "").trim();
      if (
        !paragraphLine ||
        paragraphLine === "---" ||
        /^(#{1,4})\s+/.test(paragraphLine) ||
        paragraphLine.startsWith("|") ||
        paragraphLine.startsWith(">") ||
        paragraphLine.startsWith("```") ||
        /^!\[(.*)\]\((.+)\)$/.test(paragraphLine) ||
        /^[-*]\s+/.test(paragraphLine) ||
        /^\d+\.\s+/.test(paragraphLine)
      ) {
        break;
      }

      paragraphLines.push(cleanInlineMarkdown(paragraphLine));
      index += 1;
    }

    if (paragraphLines.length) {
      blocks.push({
        type: "paragraph",
        text: paragraphLines.join(" "),
      });
      continue;
    }

    index += 1;
  }

  return blocks;
}

export function slugifyReportHeading(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export function buildReportHeadingAnchors(
  blocks: ReportMarkdownBlock[],
  maxLevel: 1 | 2 | 3 | 4 = 2
) {
  const anchors: ReportHeadingAnchor[] = [];

  blocks.forEach((block, blockIndex) => {
    if (block.type !== "heading" || block.level > maxLevel) {
      return;
    }

    anchors.push({
      id: `report-section-${anchors.length}-${slugifyReportHeading(block.text)}`,
      label: block.text,
      level: block.level,
      index: anchors.length,
      blockIndex,
    });
  });

  return anchors;
}
