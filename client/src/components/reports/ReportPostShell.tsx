import type { ReactNode } from "react";
import { BookOpen, CalendarRange, Clock3, Files, Layers3, ScrollText, Target, } from "lucide-react";
import MarkdownReportRenderer from "@/components/reports/MarkdownReportRenderer";
import { type AppLanguage, t } from "@/lib/i18n";

export type ReportTone = "neutral" | "bull" | "bear" | "caution" | "info";

export interface ReportPostItem {
  label: string;
  value: string;
  detail?: string;
  tone?: ReportTone;
}

interface ResolvedImage {
  src: string;
  alt: string;
  label?: string;
}

interface ReportPostShellProps {
  language?: AppLanguage;
  categoryLabel: string;
  title: string;
  subtitle?: string;
  headline?: string;
  reportDateLabel?: string;
  updatedAtLabel?: string;
  sourceLabel?: string;
  sourceKindLabel?: string;
  statCards?: ReportPostItem[];
  metaItems?: ReportPostItem[];
  storyItems?: string[];
  markdown: string;
  emptyMessage?: string;
  resolveImage?: (src: string, alt: string) => ResolvedImage;
  documentContent?: ReactNode;
  documentDescription?: string;
  children?: ReactNode;
}

function toneClasses(tone: ReportTone = "neutral") {
  switch (tone) {
    case "bull":
      return {
        accent: "text-emerald-300",
        border: "border-emerald-500/20 bg-emerald-500/8",
      };
    case "bear":
      return {
        accent: "text-red-300",
        border: "border-red-500/20 bg-red-500/8",
      };
    case "caution":
      return {
        accent: "text-amber-300",
        border: "border-amber-500/20 bg-amber-500/8",
      };
    case "info":
      return {
        accent: "text-sky-300",
        border: "border-sky-500/20 bg-sky-500/8",
      };
    default:
      return {
        accent: "text-foreground",
        border: "border-border bg-background/55",
      };
  }
}

function MetaPill({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarRange;
  label: string;
  value: string;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-2 text-xs text-muted-foreground">
      <Icon className="size-3.5 text-emerald-300" />
      <span className="font-semibold uppercase tracking-[0.16em]">{label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  );
}

function StatCard({ item }: { item: ReportPostItem }) {
  const tone = toneClasses(item.tone);

  return (
    <article className={`rounded-xl border p-4 ${tone.border}`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {item.label}
      </p>
      <p className={`mt-2 text-xl font-semibold tracking-tight ${tone.accent}`}>
        {item.value}
      </p>
      {item.detail ? (
        <p className="mt-2 text-xs leading-6 text-muted-foreground">
          {item.detail}
        </p>
      ) : null}
    </article>
  );
}

export default function ReportPostShell({
  language = "tr",
  categoryLabel,
  title,
  subtitle = "",
  headline = "",
  reportDateLabel = "",
  updatedAtLabel = "",
  sourceLabel = "",
  sourceKindLabel = "",
  statCards = [],
  metaItems = [],
  storyItems = [],
  markdown,
  emptyMessage,
  resolveImage,
  documentContent,
  documentDescription = "",
  children,
}: ReportPostShellProps) {
  const visibleMetaItems = metaItems.filter(
    item => item.label.trim().length > 0 && item.value.trim().length > 0
  );
  const visibleStoryItems = storyItems
    .map(item => item.trim())
    .filter(Boolean)
    .slice(0, 4);

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-sky-500/15 bg-gradient-to-br from-sky-500/8 via-card/95 to-card/95 p-6 shadow-2xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-sky-500/25 bg-sky-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300">
                {categoryLabel}
              </span>
              {sourceKindLabel ? (
                <span className="rounded-full border border-border bg-background/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {sourceKindLabel}
                </span>
              ) : null}
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl line-clamp-2">
                {title}
              </h2>
              {subtitle ? (
                <p className="text-sm font-medium text-sky-200/90 line-clamp-1">
                  {subtitle}
                </p>
              ) : null}
              {headline ? (
                <p className="max-w-3xl text-sm leading-7 text-muted-foreground line-clamp-2">
                  {headline}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-2 lg:items-end lg:shrink-0">
            <div className="flex flex-wrap gap-2">
              {sourceLabel ? (
                <MetaPill
                  icon={Files}
                  label={t("common:source")}
                  value={sourceLabel}
                />
              ) : null}
              {reportDateLabel ? (
                <MetaPill
                  icon={CalendarRange}
                  label={t("common:date")}
                  value={reportDateLabel}
                />
              ) : null}
            </div>
            {updatedAtLabel ? (
              <div className="inline-flex items-center gap-2 text-[11px] text-muted-foreground">
                <Clock3 className="size-3" />
                <span>{updatedAtLabel}</span>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {statCards.length ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {statCards.map(item => (
            <StatCard key={`${item.label}-${item.value}`} item={item} />
          ))}
        </section>
      ) : null}

      {visibleMetaItems.length ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleMetaItems.map(item => (
            <StatCard key={`${item.label}-${item.value}`} item={item} />
          ))}
        </section>
      ) : null}

      {visibleStoryItems.length ? (
        <section className="rounded-xl border border-border bg-card/90 p-6 shadow-xl">
          <div className="flex items-center gap-2">
            <BookOpen className="size-4 text-emerald-300" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
              {t("flow:readingNotes")}
            </p>
          </div>
          <div className="mt-4 grid gap-3">
            {visibleStoryItems.map((item, index) => (
              <article
                key={`${index}-${item.slice(0, 48)}`}
                className="rounded-xl border border-border bg-background/55 p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <p className="text-sm leading-7 text-foreground/90">{item}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {children}

      <section className="rounded-xl border border-border bg-card/90 p-6 shadow-xl">
        <div className="flex items-center gap-2">
          <ScrollText className="size-4 text-emerald-300" />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
              {t("flow:fullDocument")}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {documentDescription ||
                t("flow:theFullFlowOfThe")}
            </p>
          </div>
        </div>
      </section>

      {documentContent || (
        <MarkdownReportRenderer
          language={language}
          markdown={markdown}
          emptyMessage={emptyMessage}
          resolveImage={resolveImage}
        />
      )}
    </div>
  );
}


