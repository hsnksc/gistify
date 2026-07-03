import { useMemo, useState } from "react";
import { BookOpen, Expand, Quote, X } from "lucide-react";
import {
  Dialog, DialogContent, DialogDescription, DialogTitle, } from "@/components/ui/dialog";
import {
  buildReportHeadingAnchors, parseReportMarkdown, type ReportMarkdownBlock, } from "@/lib/reportMarkdown";
import { type AppLanguage, t } from "@/lib/i18n";

interface ResolvedImage {
  src: string;
  alt: string;
  label?: string;
}

interface MarkdownReportRendererProps {
  language?: AppLanguage;
  markdown: string;
  emptyMessage?: string;
  resolveImage?: (src: string, alt: string) => ResolvedImage;
}

function renderTable(block: Extract<ReportMarkdownBlock, { type: "table" }>, key: string) {
  return (
    <div
      key={key}
      className="overflow-hidden rounded-xl border border-border bg-background/55"
    >
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-background/75">
            <tr>
              {block.headers.map(header => (
                <th
                  key={`${key}-${header}`}
                  className="border-b border-border px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, rowIndex) => (
              <tr key={`${key}-${rowIndex}`} className="border-b border-border/60 last:border-b-0">
                {block.headers.map((_, cellIndex) => (
                  <td
                    key={`${key}-${rowIndex}-${cellIndex}`}
                    className="px-4 py-3 align-top text-sm leading-7 text-foreground/90"
                  >
                    {row[cellIndex] || "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function MarkdownReportRenderer({
  language = "tr",
  markdown,
  emptyMessage,
  resolveImage,
}: MarkdownReportRendererProps) {
  const [activeImage, setActiveImage] = useState<ResolvedImage | null>(null);
  const blocks = useMemo(() => parseReportMarkdown(markdown), [markdown]);
  const headingAnchors = useMemo(() => buildReportHeadingAnchors(blocks, 3), [blocks]);
  const sectionMapHeadings = useMemo(() => {
    const topLevelHeadings = headingAnchors.filter(heading => heading.level <= 2);
    return topLevelHeadings.length ? topLevelHeadings : headingAnchors.slice(0, 8);
  }, [headingAnchors]);

  if (!blocks.length) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-background/40 p-6 text-sm leading-7 text-muted-foreground">
        {emptyMessage ||
          t("flow:theSourceMarkdownContentCould")}
      </div>
    );
  }

  let headingIndex = 0;
  let firstH1Skipped = false;

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-border bg-card/90 p-6 shadow-xl">
        <div className="space-y-4">
          {blocks.map((block, index) => {
            if (block.type === "heading") {
              const id = block.level <= 3 ? headingAnchors[headingIndex++]?.id : undefined;

              if (block.level === 1 && !firstH1Skipped) {
                firstH1Skipped = true;
                return null;
              }

              return (
                <div key={`${block.type}-${index}`} id={id} className="scroll-mt-24">
                  {block.level === 1 ? (
                    <h2 className="pt-2 text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                      {block.text}
                    </h2>
                  ) : block.level === 2 ? (
                    <h3 className="pt-4 text-lg font-semibold tracking-tight text-foreground md:text-xl">
                      {block.text}
                    </h3>
                  ) : (
                    <h4 className="pt-2 text-base font-semibold text-foreground">
                      {block.text}
                    </h4>
                  )}
                </div>
              );
            }

            if (block.type === "paragraph") {
              return (
                <p
                  key={`${block.type}-${index}`}
                  className="text-sm leading-8 text-muted-foreground md:text-[15px]"
                >
                  {block.text}
                </p>
              );
            }

            if (block.type === "list") {
              const ListTag = block.ordered ? "ol" : "ul";
              return (
                <ListTag
                  key={`${block.type}-${index}`}
                  className={`space-y-2 pl-6 text-sm leading-7 text-muted-foreground ${
                    block.ordered ? "list-decimal" : "list-disc"
                  }`}
                >
                  {block.items.map(item => (
                    <li key={`${index}-${item.slice(0, 40)}`}>{item}</li>
                  ))}
                </ListTag>
              );
            }

            if (block.type === "table") {
              return renderTable(block, `${block.type}-${index}`);
            }

            if (block.type === "blockquote") {
              return (
                <div
                  key={`${block.type}-${index}`}
                  className="rounded-xl border border-emerald-500/20 bg-emerald-500/8 p-4"
                >
                  <div className="flex items-start gap-3">
                    <Quote className="mt-0.5 size-4 shrink-0 text-emerald-300" />
                    <div className="space-y-2 text-sm leading-7 text-foreground/90">
                      {block.lines.map(line => (
                        <p key={`${index}-${line.slice(0, 40)}`}>{line}</p>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

            if (block.type === "code") {
              return (
                <div
                  key={`${block.type}-${index}`}
                  className="overflow-hidden rounded-xl border border-border bg-[#08131a]"
                >
                  <div className="border-b border-white/10 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {block.language || t("flow:codeBlock")}
                  </div>
                  <pre className="overflow-x-auto px-4 py-4 text-xs leading-6 text-emerald-100/90">
                    <code>{block.code}</code>
                  </pre>
                </div>
              );
            }

            if (block.type === "image") {
              const imageLabel = block.alt || t("flow:reportImage");
              const resolved = resolveImage
                ? resolveImage(block.src, block.alt)
                : {
                    src: block.src,
                    alt: imageLabel,
                    label: imageLabel,
                  };

              return (
                <figure
                  key={`${block.type}-${index}`}
                  className="overflow-hidden rounded-xl border border-border bg-background/55"
                >
                  <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {resolved.label || resolved.alt}
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveImage(resolved)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-300 transition-colors hover:border-emerald-300/45 hover:bg-emerald-500/16"
                    >
                      <Expand className="size-3.5" />
                      {t("flow:expand")}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveImage(resolved)}
                    className="block w-full bg-[#07141a] p-4"
                  >
                    <img
                      src={resolved.src}
                      alt={resolved.alt}
                      className="max-h-[560px] w-full rounded-xl object-contain"
                      loading="lazy"
                      decoding="async"
                    />
                  </button>
                </figure>
              );
            }

            return null;
          })}
        </div>
      </section>

      <Dialog open={Boolean(activeImage)} onOpenChange={open => !open && setActiveImage(null)}>
        <DialogContent
          className="h-[94vh] w-[min(96vw,1600px)] max-w-[calc(100vw-1rem)] overflow-hidden border-white/10 bg-[#041118]/98 p-0 shadow-[0_40px_140px_rgba(0,0,0,0.6)] sm:max-w-[min(96vw,1600px)]"
          showCloseButton
        >
          {activeImage ? (
            <div className="flex h-full flex-col overflow-hidden rounded-xl">
              <div className="border-b border-white/10 px-6 py-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <DialogTitle className="text-xl font-semibold text-foreground">
                      {activeImage.label || activeImage.alt}
                    </DialogTitle>
                    <DialogDescription className="mt-2 text-sm leading-6 text-muted-foreground">
                      {activeImage.src}
                    </DialogDescription>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveImage(null)}
                    className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-foreground transition-colors hover:border-white/24 hover:bg-white/[0.08]"
                  >
                    <X className="size-3.5" />
                    {t("common:comment")}
                  </button>
                </div>
              </div>
              <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto bg-[linear-gradient(180deg,rgba(10,23,32,0.98),rgba(4,14,20,1))] p-4 md:p-6">
                <img
                  src={activeImage.src}
                  alt={activeImage.alt}
                  className="mx-auto max-h-full max-w-full rounded-xl object-contain shadow-[0_24px_90px_rgba(0,0,0,0.48)]"
                  decoding="async"
                />
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

