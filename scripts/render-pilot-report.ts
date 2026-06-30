import fs from "node:fs";
import path from "node:path";
import { buildDailyReportHtmlDocument } from "@/lib/dailyReportHtml";

async function main() {
  const response = await fetch("http://localhost:3000/api/daily-report-sources");
  if (!response.ok) {
    throw new Error(`API returned ${response.status}`);
  }

  const payload = (await response.json()) as { sources?: Array<{
    id: string;
    title: string;
    headline: string;
    reportDate: string;
    updatedAt: string;
    sourceLabel: string;
    assetBasePath?: string;
    author?: string;
    coverage?: string;
    methodology?: string;
    metadataItems?: { label: string; value: string }[];
    executiveSummary: string[];
    markdown: string;
    html?: string;
    sectionFiles: string[];
    figureFiles: string[];
    openAiFigureFiles: string[];
    tickerUniverse: string[];
    researchFileCount: number;
    sourceKind?: "folder" | "file";
    contentFormat?: "markdown" | "html";
    language?: "tr" | "en";
    availableLanguages?: ("tr" | "en")[];
    translations?: Partial<Record<"tr" | "en", string>>;
  }> };

  const source = payload.sources?.find(s => s.id === "09062026");
  if (!source) {
    throw new Error("09062026 source not found");
  }

  const outDir = path.resolve(process.cwd(), "tmp");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  for (const lang of ["tr", "en"] as const) {
    const markdown =
      lang === "en" && source.translations?.en
        ? source.translations.en
        : lang === "tr" && source.translations?.tr
          ? source.translations.tr
          : source.markdown;

    const html = buildDailyReportHtmlDocument({
      content: {
        ...source,
        markdown,
      },
      language: lang,
      reportDateLabel: source.reportDate,
      sourceLabel: source.sourceLabel,
      updatedAtLabel: source.updatedAt,
    });

    const outPath = path.join(outDir, `pilot-09062026-${lang}.html`);
    fs.writeFileSync(outPath, html, "utf8");
    console.log(`Wrote ${outPath}`);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
