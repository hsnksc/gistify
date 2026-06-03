import { useEffect, useState } from "react";
import {
  Activity,
  BarChart3,
  Clock3,
  Radar,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import type { MomentumReportRecord } from "@shared/momentumReports";
import ScannerPage from "@/scanner/components/ScannerPage";
import type { AppLanguage } from "@/lib/i18n";

interface ScannerRoutePageProps {
  language: AppLanguage;
}

interface MomentumLatestResponse {
  report?: MomentumReportRecord | null;
}

export default function Scanner({ language }: ScannerRoutePageProps) {
  const [publishedReport, setPublishedReport] =
    useState<MomentumReportRecord | null>(null);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const response = await fetch("/api/momentum/reports/latest", {
          credentials: "include",
          cache: "no-store",
        });

        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as MomentumLatestResponse;
        if (!cancelled) {
          setPublishedReport(payload.report || null);
        }
      } catch {
        // Keep the live scanner available even if the published snapshot cannot be loaded.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const copy =
    language === "en"
      ? {
          eyebrow: "Momentum Scrapper",
          title: "Opening-drive momentum workspace",
          description:
            "This section scans liquid US names through structure, relative volume, RSI health and intraday retention so the strongest opening moves surface in one table.",
          statCards: [
            {
              label: "Universe",
              value: "60 names",
              hint: "Liquid US watchlist used by the scanner",
            },
            {
              label: "Primary feed",
              value: "Yahoo",
              hint: "Optional paid fallbacks can be added later",
            },
            {
              label: "Output",
              value: "Score + signal",
              hint: "Momentum ranking with expandable explanations",
            },
          ],
          methodCards: [
            {
              title: "Relative volume",
              description:
                "Prioritizes names trading materially above their recent baseline.",
              icon: Activity,
            },
            {
              title: "Trend structure",
              description:
                "Checks whether price action is holding above key short-term levels.",
              icon: TrendingUp,
            },
            {
              title: "RSI and heat",
              description:
                "Flags overbought setups before they become low-quality chases.",
              icon: ShieldCheck,
            },
            {
              title: "Execution timing",
              description:
                "Optimized for premarket and the first 30 minutes after the open.",
              icon: Clock3,
            },
          ],
        }
      : {
          eyebrow: "Momentum Scrapper",
          title: "Acilis momentumu workspace'i",
          description:
            "Bu bolum likit ABD hisselerini fiyat yapisi, goreceli hacim, RSI sagligi ve intraday tutunma gucu ile tarar. Amac ilk guclu acilis hareketlerini tek tabloda ayirmak.",
          statCards: [
            {
              label: "Evren",
              value: "60 hisse",
              hint: "Scanner tarafinda kullanilan likit watchlist",
            },
            {
              label: "Ana veri",
              value: "Yahoo",
              hint: "Ileride ucretli fallback provider eklenebilir",
            },
            {
              label: "Cikti",
              value: "Skor + sinyal",
              hint: "Aciklanabilir momentum siralamasi",
            },
          ],
          methodCards: [
            {
              title: "Goreceli hacim",
              description:
                "Normal hacim tabanina gore belirgin genisleme gosteren isimleri one alir.",
              icon: Activity,
            },
            {
              title: "Trend yapisi",
              description:
                "Fiyatin kisa vadeli teknik seviyelerin ustunde kalip kalmadigini kontrol eder.",
              icon: TrendingUp,
            },
            {
              title: "RSI ve isinma",
              description:
                "Asiri isinmis setup'lari ayiklayip kalitesiz kovalari azaltir.",
              icon: ShieldCheck,
            },
            {
              title: "Execution zamani",
              description:
                "Premarket ve acilistan sonraki ilk 30 dakika icin optimize edilidir.",
              icon: Clock3,
            },
          ],
        };

  return (
    <div className="px-4 py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="overflow-hidden rounded-none border border-border bg-card/95 shadow-2xl">
          <div className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] lg:p-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-none border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                <Radar className="h-3.5 w-3.5" />
                {copy.eyebrow}
              </div>
              <div className="space-y-2">
                <h1 className="heading-condensed text-3xl text-foreground md:text-5xl">
                  {copy.title}
                </h1>
                <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
                  {copy.description}
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {copy.statCards.map(card => (
                <div
                  key={card.label}
                  className="rounded-none border border-border bg-background/60 p-4"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {card.label}
                  </p>
                  <p className="data-mono mt-2 text-2xl font-bold text-emerald-300">
                    {card.value}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {card.hint}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-4">
          {copy.methodCards.map(card => {
            const Icon = card.icon;

            return (
              <article
                key={card.title}
                className="rounded-none border border-border bg-card/80 p-5 shadow-xl"
              >
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Icon className="h-4 w-4 text-emerald-400" />
                  {card.title}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {card.description}
                </p>
              </article>
            );
          })}
        </section>

        <section className="rounded-none border border-border bg-card/80 p-5 shadow-xl">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                {language === "en" ? "Published snapshot" : "Yayinlanan snapshot"}
              </p>
              <h2 className="mt-2 heading-condensed text-2xl text-foreground">
                {publishedReport
                  ? publishedReport.title
                  : language === "en"
                    ? "No published momentum snapshot yet"
                    : "Henuz yayinlanmis momentum snapshot yok"}
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                {publishedReport
                  ? publishedReport.content.summary
                  : language === "en"
                    ? "Once the admin publishes a snapshot, the curated momentum setups will appear here above the live scanner."
                    : "Admin yayinladiginda curate edilmis momentum setup'lari burada, canli scanner'in ustunde gorunecek."}
              </p>
            </div>

            {publishedReport ? (
              <div className="rounded-none border border-border bg-background/60 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {language === "en" ? "Report date" : "Rapor tarihi"}
                </p>
                <p className="mt-2 text-sm font-semibold text-foreground">
                  {new Intl.DateTimeFormat(language === "en" ? "en-US" : "tr-TR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }).format(new Date(`${publishedReport.reportDate}T00:00:00Z`))}
                </p>
              </div>
            ) : null}
          </div>

          {publishedReport?.content.featuredEntries.length ? (
            <div className="mt-4 grid gap-3 xl:grid-cols-2">
              {publishedReport.content.featuredEntries.slice(0, 6).map(entry => (
                <article
                  key={entry.id}
                  className="rounded-none border border-border bg-background/60 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {entry.ticker} · {entry.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{entry.sector}</p>
                    </div>
                    <span className="data-mono text-lg font-bold text-emerald-300">
                      {entry.score}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-4 gap-2 text-xs">
                    <div>
                      <p className="text-muted-foreground">Move</p>
                      <p className="font-semibold text-foreground">
                        {entry.priceChangePct.toFixed(2)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">RVOL</p>
                      <p className="font-semibold text-foreground">
                        {entry.volumeRatio.toFixed(2)}x
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">RSI</p>
                      <p className="font-semibold text-foreground">{entry.rsi}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Signal</p>
                      <p className="font-semibold text-foreground">{entry.signal}</p>
                    </div>
                  </div>

                  {entry.adminNote || entry.catalystSummary ? (
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {entry.adminNote || entry.catalystSummary}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          ) : null}
        </section>

        <section className="overflow-hidden rounded-none border border-border bg-card/80 shadow-2xl">
          <div className="border-b border-border px-5 py-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-emerald-400" />
              <p className="heading-condensed text-sm text-foreground">
                Scanner Paneli
              </p>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {language === "en"
                ? "Run the scan, filter by signal, and inspect the score breakdown per ticker."
                : "Taramayi calistir, sinyale gore filtrele ve her ticker icin skor acilimini incele."}
            </p>
          </div>

          <ScannerPage lang={language} />
        </section>
      </div>
    </div>
  );
}
