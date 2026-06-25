import HtmlReportRenderer from "@/components/reports/HtmlReportRenderer";
import ReportPostShell from "@/components/reports/ReportPostShell";
import type { AppLanguage } from "@/lib/i18n";
import type { FlowReport } from "@shared/flow";
import { copy } from "@/lib/i18n";
import { buildFlowViewerData } from "../lib/flowReportHelpers";

interface FlowReportViewerProps {
  language: AppLanguage;
  report: FlowReport;
}

export default function FlowReportViewer({
  language,
  report,
}: FlowReportViewerProps) {
  const viewer = buildFlowViewerData(report, language);

  if (viewer.contentFormat === "html") {
    return (
      <HtmlReportRenderer
        language={language}
        html={viewer.html}
        emptyMessage={viewer.emptyMessage}
        sourceFolder={report.sourceFolder}
        sourceLabel={viewer.sourceLabel}
        title={viewer.title}
      />
    );
  }

  return (
    <ReportPostShell
      language={language}
      categoryLabel={viewer.categoryLabel}
      title={viewer.title}
      headline={viewer.headline}
      reportDateLabel={viewer.reportDateLabel}
      updatedAtLabel={viewer.updatedAtLabel}
      sourceLabel={viewer.sourceLabel}
      sourceKindLabel={viewer.sourceKindLabel}
      statCards={viewer.statCards}
      metaItems={viewer.metaItems}
      storyItems={viewer.storyItems}
      markdown={viewer.markdown}
      emptyMessage={viewer.emptyMessage}
      resolveImage={viewer.resolveImage}
    >
      <>
        {viewer.spotlight?.items.length ? (
          <section className="rounded-xl border border-border bg-card/90 p-6 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                  {copy(language, "One Cikanlar", "Key Spotlight")}
                </p>
                <h3 className="mt-2 text-xl font-semibold text-foreground">
                  {viewer.spotlight.title === "Spotlight"
                    ? copy(
                        language,
                        "Raporun can alici kisimlari",
                        "The report's most important points"
                      )
                    : viewer.spotlight.title}
                </h3>
              </div>
              <span className="rounded-full border border-border bg-background/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {viewer.spotlight.items.length} {copy(language, "anahtar nokta", "key")}
              </span>
            </div>

            <div className="mt-6 grid gap-4 xl:grid-cols-2">
              {viewer.spotlight.items.map(item => {
                const cardClassName = `block rounded-xl border border-border bg-background/55 p-4 transition-colors ${
                  item.anchorId
                    ? "hover:border-emerald-400/35 hover:bg-background/75"
                    : ""
                }`;
                const cardBody = (
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground md:text-base">
                        {item.label}
                      </p>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">
                        {item.detail}
                      </p>
                    </div>
                    {item.anchorId ? (
                      <span className="shrink-0 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
                        {copy(language, "Detaya Git", "Jump")}
                      </span>
                    ) : null}
                  </div>
                );

                return item.anchorId ? (
                  <a
                    key={`${item.label}-${item.detail.slice(0, 24)}`}
                    href={`#${item.anchorId}`}
                    className={cardClassName}
                  >
                    {cardBody}
                  </a>
                ) : (
                  <article
                    key={`${item.label}-${item.detail.slice(0, 24)}`}
                    className={cardClassName}
                  >
                    {cardBody}
                  </article>
                );
              })}
            </div>
          </section>
        ) : null}

        {viewer.galleryFigures.length ? (
          <section className="rounded-xl border border-border bg-card/90 p-6 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                  {copy(language, "Gorsel Arsivi", "Figure Archive")}
                </p>
                <h3 className="mt-2 text-xl font-semibold text-foreground">
                  {copy(
                    language,
                    "Yuklenen grafik ve gorseller",
                    "Uploaded charts and visuals"
                  )}
                </h3>
              </div>
              <span className="rounded-full border border-border bg-background/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {viewer.galleryFigures.length} {copy(language, "figure", "figure")}
              </span>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {viewer.galleryFigures.map(figure => (
                <figure
                  key={figure.fileName}
                  className="overflow-hidden rounded-xl border border-border bg-background/55"
                >
                  <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {figure.label}
                      </p>
                      <p className="mt-1 truncate text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                        {figure.fileName}
                      </p>
                    </div>
                    {figure.aiEnhanced ? (
                      <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
                        OpenAI
                      </span>
                    ) : null}
                  </div>
                  <div className="bg-[#07141a] p-4">
                    <img
                      src={figure.src}
                      alt={figure.label}
                      className="max-h-[420px] w-full rounded-xl object-contain"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </figure>
              ))}
            </div>
          </section>
        ) : null}
      </>
    </ReportPostShell>
  );
}

