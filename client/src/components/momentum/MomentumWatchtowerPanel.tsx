import { useEffect, useState } from "react";
import { Eye, ShieldAlert, TrendingUp } from "lucide-react";
import type { WatchtowerReportRecord, WatchtowerReportsResponse } from "@shared/watchtower";
import type { AppLanguage } from "@/lib/i18n";

function pct(value: number) {
  return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;
}

export default function MomentumWatchtowerPanel({ language }: { language: AppLanguage }) {
  const [report, setReport] = useState<WatchtowerReportRecord | null>(null);
  const isEnglish = language === "en";

  useEffect(() => {
    const controller = new AbortController();
    void fetch(`/api/watchtower/latest?language=${isEnglish ? "en" : "tr"}`, {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async response => {
        if (!response.ok) return null;
        return (await response.json()) as WatchtowerReportsResponse;
      })
      .then(payload => setReport(payload?.report || null))
      .catch(error => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setReport(null);
      });
    return () => controller.abort();
  }, [isEnglish]);

  if (!report) return null;

  const sections = [
    { key: "leaders" as const, label: isEnglish ? "Leaders" : "Liderler", icon: TrendingUp, tone: "text-emerald-300" },
    { key: "risks" as const, label: isEnglish ? "Risk signals" : "Risk sinyalleri", icon: ShieldAlert, tone: "text-rose-300" },
    { key: "watch" as const, label: isEnglish ? "Watch" : "İzle", icon: Eye, tone: "text-amber-300" },
  ];

  return (
    <section className="overflow-hidden rounded-xl border border-sky-400/20 bg-[linear-gradient(150deg,rgba(14,165,233,0.10),rgba(15,23,42,0.94))]">
      <div className="border-b border-border p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300">Watchtower · editor approved</p>
            <h3 className="mt-2 text-2xl font-semibold text-foreground">{report.title}</h3>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-foreground/85">{report.content.summary}</p>
          </div>
          <div className="rounded-lg border border-border bg-background/55 px-3 py-2 text-right text-[11px] text-muted-foreground">
            <p>{report.reportDate} · {report.content.marketSentiment}</p>
            <p className="mt-1">{isEnglish ? "Universe" : "Evren"}: {report.content.universeCount}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 p-5 lg:grid-cols-3">
        {sections.map(section => {
          const Icon = section.icon;
          return (
            <div key={section.key} className="space-y-3">
              <div className={`flex items-center gap-2 ${section.tone}`}><Icon className="size-4" /><h4 className="text-sm font-semibold uppercase tracking-[0.12em]">{section.label}</h4></div>
              {report.content[section.key].length ? report.content[section.key].map(entry => (
                <a key={entry.symbol} href={entry.href} className="block rounded-lg border border-border bg-background/45 p-3 transition-colors hover:border-sky-400/30 hover:bg-background/65">
                  <div className="flex items-center justify-between gap-3"><span className="font-semibold text-foreground">${entry.symbol}</span><span className="data-mono text-xs text-muted-foreground">{entry.signal} · {Math.round(entry.conviction)}</span></div>
                  <p className="mt-2 line-clamp-3 text-xs leading-5 text-foreground/75">{entry.thesis}</p>
                  <div className="mt-2 flex gap-3 text-[10px] text-muted-foreground"><span>1D {pct(entry.dailyPct)}</span><span>1W {pct(entry.weeklyPct)}</span><span>1M {pct(entry.monthlyPct)}</span></div>
                </a>
              )) : <p className="rounded-lg border border-dashed border-border p-4 text-xs text-muted-foreground">{isEnglish ? "No signal in this group." : "Bu grupta sinyal yok."}</p>}
            </div>
          );
        })}
      </div>
      <footer className="border-t border-border bg-background/35 px-5 py-3 text-[10px] leading-5 text-muted-foreground">{report.content.methodology} · {isEnglish ? "Author" : "Yazar"}: {report.authorEmail} · {isEnglish ? "Approved by" : "Onaylayan"}: {report.reviewerEmail || "Gistify Research"} · {isEnglish ? "Data time" : "Veri zamanı"}: {report.content.sourceTimestamp}</footer>
    </section>
  );
}
