import { useState } from "react";
import {
  Activity,
  LineChart,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useLocation } from "wouter";
import MomentumFlowSurface from "@/components/tabs/MomentumFlowSurface";
import { Button } from "@/components/ui/button";
import type { AppLanguage } from "@/lib/i18n";
import WorkspaceHeroPanel from "@/components/workspace/WorkspaceHeroPanel";

interface ScannerRoutePageProps {
  language: AppLanguage;
}

function copy(language: AppLanguage, tr: string, en: string) {
  return language === "en" ? en : tr;
}

export default function Scanner({ language }: ScannerRoutePageProps) {
  const [, setLocation] = useLocation();
  const [refreshSeed, setRefreshSeed] = useState(0);

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-6 md:py-8">
        <WorkspaceHeroPanel
          overlayClassName="bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.18),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(244,63,94,0.14),transparent_28%),radial-gradient(circle_at_center,rgba(59,130,246,0.12),transparent_40%)]"
          badges={
            <>
              <span className="badge-strong">Live Midas Feed</span>
              <span className="badge-warning">
                {copy(language, "Pozitif ve negatif akis", "Positive and negative flow")}
              </span>
              <span className="badge-danger">Kimi pipeline sync</span>
            </>
          }
          eyebrow="Momentum Signal Workspace"
          title={copy(
            language,
            "Momentum artik rapor degil akistir",
            "Momentum is now a live signal flow"
          )}
          description={copy(
            language,
            "Eski momentum rapor tablari temizlendi. Bu yuzey artik Kimi pipeline'dan gelen veriyi okuyup hisseleri pozitif ve negatif momentum olarak gerekceleriyle birlikte siralar.",
            "The old momentum report tabs are stripped out. This surface now reads the Kimi pipeline feed and ranks stocks by positive and negative momentum with explicit reasons."
          )}
          actions={
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => setRefreshSeed(current => current + 1)}
              >
                <RefreshCw className="size-4" />
                {copy(language, "Akisi yenile", "Refresh flow")}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setLocation("/daily-report")}
              >
                <Activity className="size-4" />
                Daily
              </Button>
            </>
          }
          statusBar={
            <div className="inline-flex max-w-full flex-wrap items-center gap-3 rounded-xl border border-border bg-background/40 px-4 py-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <TrendingUp className="size-3.5 text-emerald-300" />
                {copy(
                  language,
                  "Yukari momentum liderleri otomatik siralanir",
                  "Upside leaders are ranked automatically"
                )}
              </span>
              <span className="h-3 w-px bg-border" />
              <span className="flex items-center gap-1.5">
                <TrendingDown className="size-3.5 text-rose-300" />
                {copy(
                  language,
                  "Asagi momentum baskisi ayrica izlenir",
                  "Downside pressure is tracked separately"
                )}
              </span>
              <span className="h-3 w-px bg-border" />
              <span className="flex items-center gap-1.5">
                <Zap className="size-3.5 text-amber-300" />
                {copy(
                  language,
                  "Canli scanner snapshot'i yeniden skorlar",
                  "The live scanner re-scores the snapshot"
                )}
              </span>
            </div>
          }
        />

        <section className="mt-6 workspace-panel p-4 md:p-5">
          <div className="mb-4 flex flex-col gap-2 border-b border-border pb-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <LineChart className="size-4 text-indigo-300" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-300">
                  {copy(language, "Momentum akisi", "Momentum flow")}
                </p>
              </div>
              <h2 className="heading-condensed text-2xl text-foreground md:text-3xl">
                {copy(
                  language,
                  "Pozitif ve negatif momentum siralamasi",
                  "Positive and negative momentum ranking"
                )}
              </h2>
              <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
                {copy(
                  language,
                  "Her kartta yon, zaman dilimi performansi ve sinyal gerekcesi gorunur. Pipeline yeni veri getirdikce sayfa bunu cekip canli motorla yeniden tartar.",
                  "Each card shows direction, timeframe performance, and signal rationale. As the pipeline publishes new data, the page pulls it in and re-weighs it with the live engine."
                )}
              </p>
            </div>
          </div>

          <MomentumFlowSurface key={refreshSeed} language={language} />
        </section>
      </div>
    </div>
  );
}
