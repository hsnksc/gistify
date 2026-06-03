import type { DailyReportContent } from "@shared/dailyReports";
import { getDailyReportAssetUrl } from "@/lib/dailyReports";

interface DailyReportViewerProps {
  title: string;
  reportDate: string;
  sourceFolder: string;
  content: DailyReportContent;
}

type Block =
  | { type: "heading"; level: 1 | 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "table"; rows: string[] }
  | { type: "image"; alt: string; src: string };

function parseMarkdown(markdown: string) {
  const lines = markdown.split(/\r?\n/);
  const blocks: Block[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index]?.trim() || "";

    if (!line || line === "---") {
      index += 1;
      continue;
    }

    if (line.startsWith("# ")) {
      blocks.push({ type: "heading", level: 1, text: line.slice(2).trim() });
      index += 1;
      continue;
    }

    if (line.startsWith("## ")) {
      blocks.push({ type: "heading", level: 2, text: line.slice(3).trim() });
      index += 1;
      continue;
    }

    if (line.startsWith("### ")) {
      blocks.push({ type: "heading", level: 3, text: line.slice(4).trim() });
      index += 1;
      continue;
    }

    const imageMatch = line.match(/^!\[(.*)\]\((.+)\)$/);
    if (imageMatch) {
      const [, alt, src] = imageMatch;
      blocks.push({ type: "image", alt: alt.trim(), src: src.trim() });
      index += 1;
      continue;
    }

    if (line.startsWith("|")) {
      const rows: string[] = [];
      while (index < lines.length && (lines[index]?.trim() || "").startsWith("|")) {
        rows.push((lines[index] || "").trim());
        index += 1;
      }
      blocks.push({ type: "table", rows });
      continue;
    }

    if (line.startsWith("- ") || line.startsWith("* ")) {
      const items: string[] = [];
      while (
        index < lines.length &&
        ((lines[index]?.trim() || "").startsWith("- ") ||
          (lines[index]?.trim() || "").startsWith("* "))
      ) {
        items.push((lines[index] || "").trim().slice(2).trim());
        index += 1;
      }
      blocks.push({ type: "list", items });
      continue;
    }

    const paragraph: string[] = [];
    while (index < lines.length) {
      const current = lines[index]?.trim() || "";
      if (
        !current ||
        current === "---" ||
        current.startsWith("#") ||
        current.startsWith("|") ||
        current.startsWith("- ") ||
        current.startsWith("* ") ||
        /^!\[(.*)\]\((.+)\)$/.test(current)
      ) {
        break;
      }
      paragraph.push(current);
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

export default function DailyReportViewer({
  title,
  reportDate,
  sourceFolder,
  content,
}: DailyReportViewerProps) {
  const blocks = parseMarkdown(content.markdown).slice(0, 120);

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-border bg-card/90 p-5 shadow-xl">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
              Daily Report
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              {title}
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {content.headline}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-background/60 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Rapor tarihi
            </p>
            <p className="mt-2 text-sm font-semibold text-foreground">
              {new Intl.DateTimeFormat("tr-TR", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }).format(new Date(`${reportDate}T00:00:00Z`))}
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <div className="rounded-2xl border border-border bg-background/60 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Kapsam
            </p>
            <p className="mt-2 text-sm text-foreground">{content.coverage || "-"}</p>
          </div>
          <div className="rounded-2xl border border-border bg-background/60 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Metodoloji
            </p>
            <p className="mt-2 text-sm text-foreground">
              {content.methodology || "-"}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-background/60 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Ticker
            </p>
            <p className="mt-2 text-sm text-foreground">
              {content.tickerUniverse.length}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-background/60 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Research dosyasi
            </p>
            <p className="mt-2 text-sm text-foreground">{content.researchFileCount}</p>
          </div>
        </div>
      </section>

      {content.executiveSummary.length ? (
        <section className="rounded-[2rem] border border-border bg-card/90 p-5 shadow-xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
            Executive Summary
          </p>
          <div className="mt-4 space-y-3">
            {content.executiveSummary.map(paragraph => (
              <p key={paragraph.slice(0, 40)} className="text-sm leading-relaxed text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      ) : null}

      {content.figureFiles.length ? (
        <section className="rounded-[2rem] border border-border bg-card/90 p-5 shadow-xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
            Figure Set
          </p>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {content.figureFiles.slice(0, 6).map(fileName => (
              <figure
                key={fileName}
                className="overflow-hidden rounded-2xl border border-border bg-background/60"
              >
                <img
                  src={getDailyReportAssetUrl(sourceFolder, fileName)}
                  alt={fileName}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <figcaption className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
                  {fileName}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      <section className="rounded-[2rem] border border-border bg-card/90 p-5 shadow-xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
          Full Report
        </p>
        <div className="mt-4 space-y-4">
          {blocks.map((block, index) => {
            if (block.type === "heading") {
              const className =
                block.level === 1
                  ? "text-2xl font-semibold text-foreground"
                  : block.level === 2
                    ? "text-xl font-semibold text-foreground"
                    : "text-lg font-semibold text-foreground";
              return (
                <h3 key={`${block.type}-${index}`} className={className}>
                  {block.text}
                </h3>
              );
            }

            if (block.type === "paragraph") {
              return (
                <p
                  key={`${block.type}-${index}`}
                  className="text-sm leading-relaxed text-muted-foreground"
                >
                  {block.text}
                </p>
              );
            }

            if (block.type === "list") {
              return (
                <ul
                  key={`${block.type}-${index}`}
                  className="list-disc space-y-2 pl-5 text-sm text-muted-foreground"
                >
                  {block.items.map(item => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              );
            }

            if (block.type === "table") {
              return (
                <pre
                  key={`${block.type}-${index}`}
                  className="overflow-x-auto rounded-2xl border border-border bg-background/60 p-4 text-xs text-muted-foreground"
                >
                  {block.rows.join("\n")}
                </pre>
              );
            }

            if (block.type === "image") {
              const fileName = block.src.split("/").pop() || block.src;
              return (
                <figure
                  key={`${block.type}-${index}`}
                  className="overflow-hidden rounded-2xl border border-border bg-background/60"
                >
                  <img
                    src={getDailyReportAssetUrl(sourceFolder, fileName)}
                    alt={block.alt || fileName}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </figure>
              );
            }

            return null;
          })}
        </div>
      </section>
    </div>
  );
}
