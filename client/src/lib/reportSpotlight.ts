import {
  buildReportHeadingAnchors,
  parseReportMarkdown,
  type ReportHeadingAnchor,
  type ReportMarkdownBlock,
} from "@/lib/reportMarkdown";

export interface ReportSpotlightItem {
  label: string;
  detail: string;
  anchorId?: string;
  anchorLabel?: string;
}

export interface ReportSpotlightSection {
  title: string;
  items: ReportSpotlightItem[];
}

const SUMMARY_HEADING_PATTERNS = [
  /executive summary/,
  /\bozet\b/,
  /\bozeti\b/,
  /\bsummary\b/,
  /key insights?/,
  /key takeaways?/,
  /highlights?/,
  /one cikanlar/,
  /can alici/,
  /kritik ozet/,
  /quick take/,
  /\btldr\b/,
];

function normalizeForMatch(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/[ıİ]/g, "i")
    .replace(/ö/g, "o")
    .replace(/ş/g, "s")
    .replace(/ü/g, "u")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(value: string) {
  return normalizeForMatch(value)
    .split(" ")
    .map(token => token.trim())
    .filter(token => token.length >= 2);
}

function isSummaryHeading(value: string) {
  const normalized = normalizeForMatch(value);
  return SUMMARY_HEADING_PATTERNS.some(pattern => pattern.test(normalized));
}

function isRankLikeValue(value: string) {
  const normalized = value.trim();
  return (
    /^[\d#.]+$/.test(normalized) ||
    /^[🥇🥈🥉⭐]+$/.test(normalized) ||
    /^#?\d+$/.test(normalized)
  );
}

function collapseText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function splitLabelAndDetail(value: string) {
  const compact = collapseText(value);
  const candidates = [":", " - ", " – ", " — ", " → "];

  for (const separator of candidates) {
    const separatorIndex = compact.indexOf(separator);
    if (separatorIndex <= 0) {
      continue;
    }

    const label = compact.slice(0, separatorIndex).trim();
    const detail = compact.slice(separatorIndex + separator.length).trim();
    if (label.length >= 2 && label.length <= 56 && detail.length >= 12) {
      return { label, detail };
    }
  }

  return {
    label: compact.slice(0, 72).trim(),
    detail: compact,
  };
}

function extractTickerToken(value: string) {
  const match = value.match(/\b[A-Z]{2,5}(?:\.[A-Z]{1,2})?\b/);
  return match?.[0] || "";
}

function extractListItems(block: Extract<ReportMarkdownBlock, { type: "list" }>) {
  return block.items
    .map(item => splitLabelAndDetail(item))
    .filter(item => item.label && item.detail)
    .slice(0, 8);
}

function extractTableItems(block: Extract<ReportMarkdownBlock, { type: "table" }>) {
  return block.rows
    .map(row => {
      const cells = row.map(cell => collapseText(cell)).filter(Boolean);
      if (cells.length < 2) {
        return null;
      }

      const labelIndex =
        cells.length >= 2 && isRankLikeValue(cells[0]) ? 1 : 0;
      const label = cells[labelIndex] || "";
      const detail = cells
        .filter((_, index) => index !== 0 && index !== labelIndex)
        .join(" • ");

      if (!label || detail.length < 8) {
        return null;
      }

      return { label, detail };
    })
    .filter((item): item is { label: string; detail: string } => Boolean(item))
    .slice(0, 8);
}

function extractParagraphItems(blocks: ReportMarkdownBlock[]) {
  return blocks
    .filter(
      (block): block is Extract<ReportMarkdownBlock, { type: "paragraph" }> =>
        block.type === "paragraph"
    )
    .map(block => splitLabelAndDetail(block.text))
    .filter(item => item.detail.length >= 40)
    .slice(0, 4);
}

function findSummarySection(blocks: ReportMarkdownBlock[]) {
  const summaryHeadingIndex = blocks.findIndex(
    (block, index) =>
      block.type === "heading" &&
      block.level <= 3 &&
      index <= 24 &&
      isSummaryHeading(block.text)
  );

  if (summaryHeadingIndex >= 0) {
    const summaryHeading = blocks[summaryHeadingIndex] as Extract<
      ReportMarkdownBlock,
      { type: "heading" }
    >;
    let endIndex = blocks.length;

    for (let index = summaryHeadingIndex + 1; index < blocks.length; index += 1) {
      const block = blocks[index];
      if (
        block.type === "heading" &&
        block.level <= summaryHeading.level &&
        index > summaryHeadingIndex + 1
      ) {
        endIndex = index;
        break;
      }
    }

    return {
      title: summaryHeading.text,
      startBlockIndex: summaryHeadingIndex,
      endBlockIndex: endIndex,
      blocks: blocks.slice(summaryHeadingIndex + 1, endIndex),
    };
  }

  const fallbackEndIndex = blocks.findIndex(
    (block, index) => index > 0 && block.type === "heading" && block.level <= 2
  );
  const boundedEndIndex = fallbackEndIndex > 0 ? fallbackEndIndex : Math.min(blocks.length, 12);
  const fallbackBlocks = blocks.slice(0, boundedEndIndex);
  const hasStructuredContent = fallbackBlocks.some(
    block => block.type === "table" || block.type === "list"
  );

  if (!hasStructuredContent) {
    return null;
  }

  return {
    title: "Spotlight",
    startBlockIndex: 0,
    endBlockIndex: boundedEndIndex,
    blocks: fallbackBlocks,
  };
}

function scoreHeadingMatch(item: { label: string; detail: string }, heading: ReportHeadingAnchor) {
  const itemTicker = extractTickerToken(`${item.label} ${item.detail}`);
  const headingTicker = extractTickerToken(heading.label);
  const normalizedLabel = normalizeForMatch(item.label);
  const normalizedDetail = normalizeForMatch(item.detail);
  const normalizedHeading = normalizeForMatch(heading.label);

  let score = 0;

  if (itemTicker && headingTicker && itemTicker === headingTicker) {
    score += 10;
  }

  if (normalizedHeading === normalizedLabel) {
    score += 7;
  }

  if (normalizedHeading.includes(normalizedLabel) || normalizedLabel.includes(normalizedHeading)) {
    score += 5;
  }

  if (normalizedDetail.includes(normalizedHeading)) {
    score += 4;
  }

  const itemTokens = new Set(tokenize(`${item.label} ${item.detail}`));
  const headingTokens = tokenize(heading.label);
  for (const token of headingTokens) {
    if (itemTokens.has(token)) {
      score += token.length >= 4 ? 2 : 1;
    }
  }

  if (heading.level === 2) {
    score += 1;
  }

  return score;
}

function attachAnchors(
  items: ReportSpotlightItem[],
  blocks: ReportMarkdownBlock[],
  summaryEndBlockIndex: number
): ReportSpotlightItem[] {
  const candidateHeadings = buildReportHeadingAnchors(blocks, 3).filter(
    heading => heading.blockIndex >= summaryEndBlockIndex
  );

  const usedHeadingIds = new Set<string>();

  return items.map(item => {
    const rankedMatches = candidateHeadings
      .map(heading => ({
        heading,
        score: scoreHeadingMatch(item, heading),
      }))
      .filter(entry => entry.score >= 4)
      .sort((left, right) => right.score - left.score);

    const bestMatch = rankedMatches.find(entry => !usedHeadingIds.has(entry.heading.id));
    if (!bestMatch) {
      return item;
    }

    usedHeadingIds.add(bestMatch.heading.id);
    return {
      ...item,
      anchorId: bestMatch.heading.id,
      anchorLabel: bestMatch.heading.label,
    };
  });
}

export function buildReportSpotlight(markdown: string) {
  const blocks = parseReportMarkdown(markdown);
  if (!blocks.length) {
    return null;
  }

  const summarySection = findSummarySection(blocks);
  if (!summarySection) {
    return null;
  }

  const spotlightTable = summarySection.blocks.find(
    (block): block is Extract<ReportMarkdownBlock, { type: "table" }> =>
      block.type === "table" && block.rows.length > 0
  );
  const spotlightList = summarySection.blocks.find(
    (block): block is Extract<ReportMarkdownBlock, { type: "list" }> =>
      block.type === "list" && block.items.length > 0
  );

  const structuredItems = spotlightTable ? extractTableItems(spotlightTable) : [];

  const listItems =
    structuredItems.length === 0 && spotlightList
      ? extractListItems(spotlightList)
      : [];

  const paragraphItems =
    structuredItems.length === 0 && listItems.length === 0
      ? extractParagraphItems(summarySection.blocks)
      : [];

  const baseItems = [...structuredItems, ...listItems, ...paragraphItems]
    .filter(item => item.label && item.detail)
    .slice(0, 6);

  if (!baseItems.length) {
    return null;
  }

  return {
    title: summarySection.title,
    items: attachAnchors(
      baseItems,
      blocks,
      summarySection.endBlockIndex
    ),
  } satisfies ReportSpotlightSection;
}
