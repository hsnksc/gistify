import { useState } from "react";
import {
  LineChart,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";
import MomentumFlowSurface from "@/components/tabs/MomentumFlowSurface";
import { Button } from "@/components/ui/button";
import { usePageMeta } from "@/hooks/usePageMeta";
import { type AppLanguage, t } from "@/lib/i18n";
import WorkspaceHeroPanel from "@/components/workspace/WorkspaceHeroPanel";

interface ScannerRoutePageProps {
  language: AppLanguage;
}

export default function Scanner({ language }: ScannerRoutePageProps) {
  usePageMeta({
    description: t("scanner:theOldMomentumReportTabs"),
    title: `${t("common:momentum")} | Gistify`,
  });
  const [refreshSeed, setRefreshSeed] = useState(0);

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-6 md:py-8">
        <WorkspaceHeroPanel
          reportStrip={null}
          overlayClassName="bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.18),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(244,63,94,0.14),transparent_28%),radial-gradient(circle_at_center,rgba(59,130,246,0.12),transparent_40%)]"
          badges={
            <>
              <span className="badge-strong">{t("scanner:liveMidasFeed")}</span>
              <span className="badge-warning">
                {t("scanner:positiveNeutralAndNegativeFlow")}
              </span>
              <span className="badge-danger">
                {t("scanner:kimiPipelineSync")}
              </span>
            </>
          }
          eyebrow={t("scanner:momentumSignalWorkspace")}
          title={t("scanner:momentumIsNowALive")}
          description={t("scanner:theOldMomentumReportTabs")}
          actions={
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => setRefreshSeed(current => current + 1)}
              >
                <RefreshCw className="size-4" />
                {t("scanner:refreshFlow")}
              </Button>
            </>
          }
          statusBar={
            <div className="inline-flex max-w-full flex-wrap items-center gap-3 rounded-xl border border-border bg-background/40 px-4 py-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <TrendingUp className="size-3.5 text-emerald-300" />
                {t("scanner:upsideLeadersAreRankedAutomatically")}
              </span>
              <span className="h-3 w-px bg-border" />
              <span className="flex items-center gap-1.5">
                <TrendingDown className="size-3.5 text-rose-300" />
                {t("scanner:downsidePressureIsTrackedSeparately")}
              </span>
              <span className="h-3 w-px bg-border" />
              <span className="flex items-center gap-1.5">
                <LineChart className="size-3.5 text-amber-300" />
                {t("scanner:neutralTransitionNamesStayVisible")}
              </span>
              <span className="h-3 w-px bg-border" />
              <span className="flex items-center gap-1.5">
                <Zap className="size-3.5 text-amber-300" />
                {t("scanner:theLiveScannerReScores")}
              </span>
            </div>
          }
        />

        <section className="mt-6 panel p-4 md:p-6">
          <div className="mb-4 flex flex-col gap-2 border-b border-border pb-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <LineChart className="size-4 text-sky-300" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300">
                  {t("scanner:momentumFlow")}
                </p>
              </div>
              <h2 className="heading-condensed text-2xl text-foreground md:text-3xl">
                {t("scanner:positiveNeutralAndNegativeMomentum")}
              </h2>
              <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
                {t("scanner:eachCardShowsDirectionTimeframe")}
              </p>
            </div>
          </div>

          <MomentumFlowSurface key={refreshSeed} language={language} />
        </section>
      </div>
    </div>
  );
}
