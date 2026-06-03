import {
  Activity,
  BarChart3,
  Clock3,
  Radar,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import ScannerPage from "@/scanner/components/ScannerPage";
import type { AppLanguage } from "@/lib/i18n";

interface ScannerRoutePageProps {
  language: AppLanguage;
}

export default function Scanner({ language }: ScannerRoutePageProps) {
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
