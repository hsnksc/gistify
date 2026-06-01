import { Activity, Radar, ShieldCheck } from "lucide-react";
import ScannerPage from "@/scanner/components/ScannerPage";
import type { AppLanguage } from "@/lib/i18n";

interface ScannerRoutePageProps {
  language: AppLanguage;
}

export default function Scanner({ language }: ScannerRoutePageProps) {
  const copy =
    language === "en"
      ? {
          eyebrow: "Pro Signal Lab",
          title: "Opening-drive momentum scanner",
          description:
            "Scan liquid US names through momentum, volume expansion, structure, relative strength and intraday retention in a single panel.",
          points: [
            "60-name default watchlist",
            "Signal ranking with expandable score breakdowns",
            "Yahoo-first feed with optional paid API fallbacks",
          ],
        }
      : {
          eyebrow: "Pro Signal Lab",
          title: "Acilis momentumu tarama modulu",
          description:
            "Likit ABD hisselerini momentum, hacim patlamasi, fiyat yapisi, goreceli guc ve intraday retention ile tek panelde tara.",
          points: [
            "60 hisselik hazir izleme evreni",
            "Acilabilir skor aciklamalariyla sinyal siralamasi",
            "Yahoo oncelikli veri akisi ve opsiyonel ucretli fallback providerlar",
          ],
        };

  return (
    <div className="px-4 py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="overflow-hidden rounded-3xl border border-border bg-card/95 shadow-2xl">
          <div className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)] lg:p-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                <Radar className="h-3.5 w-3.5" />
                {copy.eyebrow}
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-foreground">{copy.title}</h1>
                <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
                  {copy.description}
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {copy.points.map((point, index) => {
                const Icon = index === 0 ? Activity : index === 1 ? ShieldCheck : Radar;

                return (
                  <div
                    key={point}
                    className="rounded-2xl border border-border bg-background/60 p-4"
                  >
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <Icon className="h-4 w-4 text-emerald-400" />
                      {point}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-border bg-card/80 shadow-2xl">
          <ScannerPage lang={language} />
        </section>
      </div>
    </div>
  );
}
