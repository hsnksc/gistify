import { useEffect, useState } from "react";
import {
  AlertTriangle, CheckCircle2, ChevronDown, ChevronUp, Clock3, Info, Minus, Shield, Star, TrendingDown, TrendingUp, } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type AppLanguage, t } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type {
  EarningsStrategyPipelineMetadata,
  PipelineStatus,
} from "@shared/earnings";

interface PipelineStatusMeta {
  chipClassName: string;
  Icon: LucideIcon;
  label: string;
  pulse: boolean;
}

const REFRESH_INTERVAL_MS = 60_000;

function getPipelineStatusMeta(
  status: PipelineStatus,
  language: AppLanguage
): PipelineStatusMeta {
  if (status === "ok") {
    return {
      chipClassName:
        "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
      Icon: CheckCircle2,
      label: t("earnings:current"),
      pulse: false,
    };
  }

  if (status === "stale") {
    return {
      chipClassName: "border-amber-500/25 bg-amber-500/10 text-amber-300",
      Icon: Clock3,
      label: t("earnings:stale"),
      pulse: true,
    };
  }

  if (status === "error") {
    return {
      chipClassName: "border-rose-500/25 bg-rose-500/10 text-rose-300",
      Icon: AlertTriangle,
      label: t("common:error"),
      pulse: false,
    };
  }

  return {
    chipClassName: "border-slate-500/20 bg-slate-500/10 text-slate-300",
    Icon: Info,
    label: t("common:idle"),
    pulse: false,
  };
}

function formatRelativeTime(
  value: string | null,
  language: AppLanguage,
  now: number
) {
  if (!value) {
    return t("earnings:noSyncYet");
  }

  const timestamp = new Date(value).getTime();
  if (!Number.isFinite(timestamp)) {
    return t("earnings:invalidTime");
  }

  const diffMs = Math.max(0, now - timestamp);
  const diffMinutes = Math.floor(diffMs / 60_000);

  if (diffMinutes < 1) {
    return t("earnings:updatedJustNow");
  }

  if (diffMinutes < 60) {
    return t("earnings:updatedMAgo", { diffminutes: diffMinutes });
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return t("earnings:updatedHAgo", { diffhours: diffHours });
  }

  const diffDays = Math.floor(diffHours / 24);
  return t("earnings:updatedDAgo", { diffdays: diffDays });
}

function useRelativeClock() {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, REFRESH_INTERVAL_MS);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  return now;
}

export function EarningsFreshnessBadge({
  className,
  language,
  pipeline,
}: {
  className?: string;
  language: AppLanguage;
  pipeline: EarningsStrategyPipelineMetadata;
}) {
  const now = useRelativeClock();
  const statusMeta = getPipelineStatusMeta(pipeline.status, language);
  const freshnessSource =
    pipeline.lastSyncedAt ||
    pipeline.lastAttemptAt ||
    pipeline.lastSourceModifiedAt ||
    null;
  const label = formatRelativeTime(freshnessSource, language, now);
  const Icon = statusMeta.Icon;

  return (
    <span
      title={freshnessSource || ""}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold",
        statusMeta.chipClassName,
        statusMeta.pulse ? "animate-pulse" : "",
        className
      )}
    >
      <Icon className="size-3.5" />
      <span>{label}</span>
    </span>
  );
}

function LegendChip({
  accentClassName,
  icon,
  label,
}: {
  accentClassName: string;
  icon: string;
  label: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold",
        accentClassName
      )}
    >
      <span aria-hidden="true">{icon}</span>
      <span>{label}</span>
    </span>
  );
}

export function EarningsLegendSurface({
  expanded,
  language,
  onToggle,
}: {
  expanded: boolean;
  language: AppLanguage;
  onToggle: () => void;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            {t("earnings:workspaceLegend")}
          </p>
          <p className="mt-1 text-sm text-slate-400">
            {t("earnings:iconsAndLabelsReinforceColor")}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onToggle}
          className="rounded-xl border-white/10 bg-slate-950/40 text-slate-200 hover:bg-slate-800/50"
        >
          {expanded ? (
            <>
              <ChevronUp className="mr-2 size-4" />
              {t("earnings:collapseLegend")}
            </>
          ) : (
            <>
              <ChevronDown className="mr-2 size-4" />
              {t("earnings:openLegend")}
            </>
          )}
        </Button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <LegendChip
          accentClassName="border-emerald-500/25 bg-emerald-500/10 text-emerald-300"
          icon="▲"
          label={t("earnings:bullishSupportive")}
        />
        <LegendChip
          accentClassName="border-rose-500/25 bg-rose-500/10 text-rose-300"
          icon="▼"
          label={t("earnings:bearishPressured")}
        />
        <LegendChip
          accentClassName="border-slate-500/25 bg-slate-500/10 text-slate-300"
          icon="•"
          label={"Neutral"}
        />
        <LegendChip
          accentClassName="border-emerald-500/25 bg-emerald-500/10 text-emerald-300"
          icon="BMO"
          label={t("earnings:beforeMarketOpen")}
        />
        <LegendChip
          accentClassName="border-violet-500/25 bg-violet-500/10 text-violet-300"
          icon="AMC"
          label={t("earnings:afterMarketClose")}
        />
      </div>

      {expanded ? (
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <div className="rounded-xl border border-white/8 bg-slate-950/35 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              {t("common:allCandidatesFromTheNewly")}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <LegendChip
                accentClassName="border-amber-500/25 bg-amber-500/10 text-amber-300"
                icon="★★★"
                label={t("earnings:highImportance")}
              />
              <LegendChip
                accentClassName="border-slate-500/25 bg-slate-500/10 text-slate-300"
                icon="★"
                label={t("earnings:standardEvent")}
              />
            </div>
          </div>

          <div className="rounded-xl border border-white/8 bg-slate-950/35 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              {"Risk"}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <LegendChip
                accentClassName="border-emerald-500/25 bg-emerald-500/10 text-emerald-300"
                icon="🛡"
                label={t("earnings:lowRisk")}
              />
              <LegendChip
                accentClassName="border-amber-500/25 bg-amber-500/10 text-amber-300"
                icon="⚠"
                label={t("earnings:mediumRisk")}
              />
              <LegendChip
                accentClassName="border-rose-500/25 bg-rose-500/10 text-rose-300"
                icon="▲"
                label={t("earnings:highRisk")}
              />
            </div>
          </div>

          <div className="rounded-xl border border-white/8 bg-slate-950/35 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              {t("earnings:fomcSeverity")}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <LegendChip
                accentClassName="border-slate-500/25 bg-slate-500/10 text-slate-300"
                icon="○"
                label={"Distant"}
              />
              <LegendChip
                accentClassName="border-amber-500/25 bg-amber-500/10 text-amber-300"
                icon="◔"
                label={"Approaching"}
              />
              <LegendChip
                accentClassName="border-orange-500/25 bg-orange-500/10 text-orange-300"
                icon="◕"
                label={"Imminent"}
              />
              <LegendChip
                accentClassName="border-rose-500/25 bg-rose-500/10 text-rose-300"
                icon="⬤"
                label={"Blackout"}
              />
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export function EarningsWorkspaceToolbar({
  language,
  pipeline,
  sectionLabel,
}: {
  language: AppLanguage;
  pipeline: EarningsStrategyPipelineMetadata;
  sectionLabel: string;
}) {
  const [legendExpanded, setLegendExpanded] = useState(false);

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 backdrop-blur-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            {t("earnings:activeLens")}
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-200">
            {sectionLabel}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <EarningsFreshnessBadge language={language} pipeline={pipeline} />
          <span
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold",
              getPipelineStatusMeta(pipeline.status, language).chipClassName
            )}
          >
            <Shield className="size-3.5" />
            {getPipelineStatusMeta(pipeline.status, language).label}
          </span>
        </div>
      </div>

      <EarningsLegendSurface
        expanded={legendExpanded}
        language={language}
        onToggle={() => setLegendExpanded(value => !value)}
      />
    </div>
  );
}

export { getPipelineStatusMeta };
