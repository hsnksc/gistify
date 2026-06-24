import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  CpiPpiForecastData,
  CpiPpiForecastPipelineState,
  MacroForecastBias,
  MacroForecastPipelineMetadata,
  MacroForecastPipelineStatus,
  MacroForecastRelease,
  MacroForecastScenario,
  MacroForecastWorkspaceData,
  MacroForecastWorkspaceKey,
} from "@shared/cpiPpiForecast";
import {
  Activity,
  CalendarDays,
  Database,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import WorkspaceLoadingState from "@/components/workspace/WorkspaceLoadingState";
import { Button } from "@/components/ui/button";
import { copy, type AppLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const SNAPSHOT_REFRESH_INTERVAL_MS = 60 * 1000;
const WORKSPACE_ORDER: MacroForecastWorkspaceKey[] = ["cpi", "ppi"];

const WORKSPACE_THEME: Record<
  MacroForecastWorkspaceKey,
  {
    label: "CPI" | "PPI";
    eyebrowClassName: string;
    shellClassName: string;
    innerClassName: string;
    lineClassName: string;
    cardClassName: string;
    softCardClassName: string;
    glowClassName: string;
    iconClassName: string;
  }
> = {
  cpi: {
    label: "CPI",
    eyebrowClassName: "text-sky-300",
    shellClassName:
      "border-sky-500/20 bg-[linear-gradient(180deg,rgba(9,19,36,0.96),rgba(8,13,24,0.98))]",
    innerClassName:
      "bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_32%),linear-gradient(180deg,rgba(10,18,32,0.94),rgba(8,12,22,0.98))]",
    lineClassName: "bg-sky-400/70",
    cardClassName: "border-sky-500/18 bg-sky-500/[0.07]",
    softCardClassName: "border-sky-500/16 bg-sky-500/[0.06]",
    glowClassName: "from-sky-400/16 via-sky-500/0 to-transparent",
    iconClassName: "text-sky-200",
  },
  ppi: {
    label: "PPI",
    eyebrowClassName: "text-amber-300",
    shellClassName:
      "border-amber-500/20 bg-[linear-gradient(180deg,rgba(29,20,10,0.96),rgba(12,11,16,0.98))]",
    innerClassName:
      "bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.18),transparent_34%),linear-gradient(180deg,rgba(23,18,13,0.96),rgba(11,10,15,0.98))]",
    lineClassName: "bg-amber-300/75",
    cardClassName: "border-amber-500/18 bg-amber-500/[0.07]",
    softCardClassName: "border-amber-500/16 bg-amber-500/[0.06]",
    glowClassName: "from-amber-300/16 via-orange-500/0 to-transparent",
    iconClassName: "text-amber-100",
  },
};

function formatTimestamp(value: string | undefined, language: AppLanguage) {
  if (!value) {
    return "-";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(language === "en" ? "en-US" : "tr-TR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsed);
}

function formatDateLabel(value: string | undefined, language: AppLanguage) {
  if (!value) {
    return "-";
  }

  const normalized = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? `${value}T00:00:00Z`
    : value;
  const parsed = new Date(normalized);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(language === "en" ? "en-US" : "tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

function formatProbability(value: number) {
  return `%${Math.round(value)}`;
}

function pipelineStatusLabel(
  status: MacroForecastPipelineStatus,
  language: AppLanguage
) {
  switch (status) {
    case "ok":
      return copy(language, "Senkron", "Synced");
    case "stale":
      return copy(language, "Eski veri", "Stale");
    case "error":
      return copy(language, "Hata", "Error");
    default:
      return copy(language, "Beklemede", "Idle");
  }
}

function pipelineStatusClass(status: MacroForecastPipelineStatus) {
  switch (status) {
    case "ok":
      return "border-emerald-500/25 bg-emerald-500/12 text-emerald-200";
    case "stale":
      return "border-amber-500/25 bg-amber-500/12 text-amber-200";
    case "error":
      return "border-rose-500/25 bg-rose-500/12 text-rose-200";
    default:
      return "border-border bg-background/70 text-muted-foreground";
  }
}

function biasLabel(bias: MacroForecastBias, language: AppLanguage) {
  switch (bias) {
    case "HOTTER":
      return copy(language, "Beklentiden sicak", "Hotter than expected");
    case "COOLER":
      return copy(language, "Beklentiden soguk", "Cooler than expected");
    default:
      return copy(language, "Beklentiye yakin", "In line");
  }
}

function biasClass(bias: MacroForecastBias) {
  switch (bias) {
    case "HOTTER":
      return "border-rose-500/20 bg-rose-500/10 text-rose-200";
    case "COOLER":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-200";
    default:
      return "border-amber-500/20 bg-amber-500/10 text-amber-200";
  }
}

function latestTimestamp(values: Array<string | null | undefined>) {
  let resolved: string | undefined;
  let resolvedMs = Number.NEGATIVE_INFINITY;

  for (const value of values) {
    if (!value) {
      continue;
    }

    const parsed = Date.parse(value);
    if (Number.isFinite(parsed) && parsed > resolvedMs) {
      resolved = new Date(parsed).toISOString();
      resolvedMs = parsed;
      continue;
    }

    if (!resolved) {
      resolved = value;
    }
  }

  return resolved;
}

function deriveOverallPipelineStatus(
  pipeline: CpiPpiForecastPipelineState
): MacroForecastPipelineStatus {
  const statuses = [pipeline.cpi.status, pipeline.ppi.status];
  if (statuses.includes("ok")) {
    return "ok";
  }
  if (statuses.includes("stale")) {
    return "stale";
  }
  if (statuses.includes("error")) {
    return "error";
  }
  return "idle";
}

function getLeadScenario(forecast: MacroForecastWorkspaceData) {
  if (!forecast.scenarios.length) {
    return null;
  }

  return [...forecast.scenarios].sort(
    (left, right) => right.probability - left.probability
  )[0];
}

function workspaceDescriptor(
  key: MacroForecastWorkspaceKey,
  language: AppLanguage
) {
  if (key === "cpi") {
    return {
      title: copy(language, "Consumer inflation", "Consumer inflation"),
      summary: copy(
        language,
        "Tuketici fiyatlarindaki yonu, oran baskisini ve risk varliklarin ilk tepkisini izler.",
        "Tracks consumer pricing direction, rate pressure, and the first reaction in risk assets."
      ),
    };
  }

  return {
    title: copy(language, "Producer pipeline", "Producer pipeline"),
    summary: copy(
      language,
      "Uretici fiyatlarindaki baskiyi, marj anlatisini ve CPI'ya gecis riskini izler.",
      "Tracks upstream price pressure, margin narrative, and the pass-through risk into CPI."
    ),
  };
}

function expectedFileName(key: MacroForecastWorkspaceKey) {
  return `${key}_forecast.json`;
}

function preferredDeployTarget(key: MacroForecastWorkspaceKey) {
  return `/app/data/${expectedFileName(key)}`;
}

function envVarName(key: MacroForecastWorkspaceKey) {
  return `${key.toUpperCase()}_FORECAST_PIPELINE_SOURCE_FILE`;
}

function repoMirrorTarget(key: MacroForecastWorkspaceKey) {
  return `./client/public/${expectedFileName(key)}`;
}

function CompactStatCard({
  label,
  value,
  hint,
  className,
}: {
  label: string;
  value: string;
  hint: string;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "rounded-2xl border border-white/10 bg-black/20 px-3.5 py-3",
        className
      )}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-foreground">{value}</p>
      <p className="mt-1 text-[11px] leading-5 text-muted-foreground">{hint}</p>
    </article>
  );
}

function ReleaseCard({
  language,
  release,
  slotKey,
}: {
  language: AppLanguage;
  release: MacroForecastRelease;
  slotKey: MacroForecastWorkspaceKey;
}) {
  const theme = WORKSPACE_THEME[slotKey];

  return (
    <article className={cn("rounded-[1.45rem] border p-4", theme.softCardClassName)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p
            className={cn(
              "text-[10px] font-semibold uppercase tracking-[0.18em]",
              theme.eyebrowClassName
            )}
          >
            {release.name} {copy(language, "release frame", "release frame")}
          </p>
          <h3 className="mt-2 heading-condensed text-[1.45rem] leading-none text-foreground">
            {release.period || release.name}
          </h3>
          <p className="mt-1.5 text-[13px] text-muted-foreground">
            {formatDateLabel(release.releaseDate, language)} ·{" "}
            {release.releaseTimeEt || "08:30 ET"}
          </p>
        </div>
        <span
          className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${biasClass(
            release.bias
          )}`}
        >
          {biasLabel(release.bias, language)}
        </span>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {[
          { label: "Headline MoM", value: release.headlineMoM || "-" },
          { label: "Headline YoY", value: release.headlineYoY || "-" },
          { label: "Core MoM", value: release.coreMoM || "-" },
          { label: "Core YoY", value: release.coreYoY || "-" },
        ].map(item => (
          <div
            key={`${release.name}-${item.label}`}
            className="rounded-xl border border-white/10 bg-black/20 px-3 py-2.5"
          >
            <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              {item.label}
            </p>
            <p className="mt-1.5 data-mono text-sm font-semibold text-foreground">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2.5">
          <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            {copy(language, "Guven", "Confidence")}
          </p>
          <p className="mt-1.5 data-mono text-sm font-semibold text-foreground">
            {formatProbability(release.confidence)}
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2.5">
          <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            {copy(language, "Onceki", "Prior")}
          </p>
          <p className="mt-1.5 text-sm text-foreground">
            {release.priorHeadlineMoM || "-"} / {release.priorCoreMoM || "-"}
          </p>
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-white/10 bg-black/20 px-3 py-3">
        <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          {copy(language, "Tez", "Thesis")}
        </p>
        <p className="mt-1.5 text-[13px] leading-6 text-foreground/88">
          {release.thesis || copy(language, "Tez henuz gelmedi.", "No thesis yet.")}
        </p>
      </div>
    </article>
  );
}

function ScenarioCard({
  language,
  scenario,
  releaseName,
  slotKey,
}: {
  language: AppLanguage;
  scenario: MacroForecastScenario;
  releaseName: MacroForecastRelease["name"];
  slotKey: MacroForecastWorkspaceKey;
}) {
  const theme = WORKSPACE_THEME[slotKey];

  return (
    <article className={cn("rounded-[1.3rem] border p-3.5", theme.softCardClassName)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p
            className={cn(
              "text-[10px] font-semibold uppercase tracking-[0.16em]",
              theme.eyebrowClassName
            )}
          >
            {copy(language, "Senaryo", "Scenario")}
          </p>
          <h3 className="mt-1 text-sm font-semibold text-foreground">
            {scenario.label}
          </h3>
        </div>
        <span className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 data-mono text-[11px] text-foreground">
          {formatProbability(scenario.probability)}
        </span>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <div className="rounded-lg border border-white/10 bg-black/20 p-2.5">
          <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            {releaseName} {copy(language, "sonuc", "outcome")}
          </p>
          <p className="mt-1 text-[13px] leading-5 text-foreground">
            {scenario.outcome || "-"}
          </p>
        </div>
        <div className="rounded-lg border border-white/10 bg-black/20 p-2.5">
          <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            {copy(language, "Olasilik", "Probability")}
          </p>
          <p className="mt-1 data-mono text-sm text-foreground">
            {formatProbability(scenario.probability)}
          </p>
        </div>
      </div>

      <div className="mt-3 space-y-2 text-[13px] leading-6">
        <div className="rounded-lg border border-white/10 bg-black/20 p-2.5">
          <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            {copy(language, "Piyasa okumasi", "Market readthrough")}
          </p>
          <p className="mt-1 text-foreground/88">{scenario.marketReadthrough || "-"}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-black/20 p-2.5">
          <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            {copy(language, "Avantajli alanlar", "Favored assets")}
          </p>
          <p className="mt-1 text-foreground/88">
            {scenario.favoredAssets.length
              ? scenario.favoredAssets.join(" · ")
              : "-"}
          </p>
        </div>
        <div className="rounded-lg border border-rose-500/18 bg-rose-500/8 p-2.5">
          <p className="text-[10px] uppercase tracking-[0.16em] text-rose-200">
            {copy(language, "Invalidation", "Invalidation")}
          </p>
          <p className="mt-1 text-rose-50/90">{scenario.invalidation || "-"}</p>
        </div>
      </div>
    </article>
  );
}

function SimpleListCard({
  icon: Icon,
  items,
  language,
  title,
  tone = "default",
  slotKey,
}: {
  icon: typeof Activity;
  items: string[];
  language: AppLanguage;
  title: string;
  tone?: "default" | "risk";
  slotKey: MacroForecastWorkspaceKey;
}) {
  const theme = WORKSPACE_THEME[slotKey];
  const accentClassName =
    tone === "risk" ? "text-rose-300" : theme.eyebrowClassName;
  const panelClassName =
    tone === "risk"
      ? "border-rose-500/18 bg-rose-500/[0.05]"
      : theme.softCardClassName;

  return (
    <section className={cn("rounded-[1.35rem] border p-4", panelClassName)}>
      <div className="flex items-center gap-2">
        <Icon className={`size-4 ${accentClassName}`} />
        <h3 className="heading-condensed text-lg text-foreground">{title}</h3>
      </div>
      <div className="mt-3 space-y-2">
        {items.length ? (
          items.map(item => (
            <div
              key={item}
              className="rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-[13px] leading-6 text-foreground/88"
            >
              {item}
            </div>
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-white/10 bg-black/15 px-3 py-2.5 text-sm text-muted-foreground">
            {copy(language, "Veri yok.", "No data yet.")}
          </div>
        )}
      </div>
    </section>
  );
}

function WatchlistCard({
  forecast,
  language,
  slotKey,
}: {
  forecast: MacroForecastWorkspaceData;
  language: AppLanguage;
  slotKey: MacroForecastWorkspaceKey;
}) {
  const theme = WORKSPACE_THEME[slotKey];

  return (
    <section className={cn("rounded-[1.35rem] border p-4", theme.softCardClassName)}>
      <div className="flex items-center gap-2">
        <Target className={`size-4 ${theme.eyebrowClassName}`} />
        <h3 className="heading-condensed text-lg text-foreground">
          {forecast.release.name} {copy(language, "watchlist", "watchlist")}
        </h3>
      </div>
      <div className="mt-3 space-y-2.5">
        {forecast.watchItems.length ? (
          forecast.watchItems.map(item => (
            <article
              key={`${forecast.release.name}-${item.label}`}
              className="rounded-xl border border-white/10 bg-black/20 p-3"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {item.label}
              </p>
              <p className="mt-1.5 data-mono text-sm font-semibold text-foreground">
                {item.value || "-"}
              </p>
              <p className="mt-1 text-[12px] leading-5 text-muted-foreground">
                {item.note || "-"}
              </p>
            </article>
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-white/10 bg-black/15 px-3 py-2.5 text-sm text-muted-foreground">
            {copy(
              language,
              "Watchlist henuz gelmedi.",
              "The watchlist has not been populated yet."
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function PlaybookTable({
  forecast,
  language,
  slotKey,
}: {
  forecast: MacroForecastWorkspaceData;
  language: AppLanguage;
  slotKey: MacroForecastWorkspaceKey;
}) {
  const theme = WORKSPACE_THEME[slotKey];

  return (
    <section className={cn("rounded-[1.35rem] border p-4", theme.softCardClassName)}>
      <div className="flex items-center gap-2">
        <Activity className={`size-4 ${theme.eyebrowClassName}`} />
        <h3 className="heading-condensed text-lg text-foreground">
          {forecast.release.name} {copy(language, "playbook", "playbook")}
        </h3>
      </div>
      <div className="mt-3 overflow-hidden rounded-[1.15rem] border border-white/10 bg-black/20">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-[13px]">
            <thead className="border-b border-white/10 bg-black/25">
              <tr>
                {[
                  copy(language, "Varlik", "Asset"),
                  copy(language, "Bias", "Bias"),
                  copy(language, "Trigger", "Trigger"),
                  copy(language, "Invalidation", "Invalidation"),
                ].map(header => (
                  <th
                    key={`${forecast.release.name}-${header}`}
                    className="px-3 py-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {forecast.setups.length ? (
                forecast.setups.map(setup => (
                  <tr
                    key={`${forecast.release.name}-${setup.asset}-${setup.trigger}`}
                    className="border-b border-white/10 last:border-b-0"
                  >
                    <td className="px-3 py-2.5 font-semibold text-foreground">
                      {setup.asset}
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground">
                      {setup.bias || "-"}
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground">
                      {setup.trigger || "-"}
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground">
                      {setup.invalidation || "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-3 py-3 text-sm text-muted-foreground" colSpan={4}>
                    {copy(
                      language,
                      "Playbook henuz gelmedi.",
                      "The playbook has not been populated yet."
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function PipelineCard({
  label,
  language,
  pipeline,
  slotKey,
}: {
  label: "CPI" | "PPI";
  language: AppLanguage;
  pipeline: MacroForecastPipelineMetadata;
  slotKey: MacroForecastWorkspaceKey;
}) {
  const theme = WORKSPACE_THEME[slotKey];

  return (
    <article className={cn("rounded-[1.25rem] border p-3.5", theme.softCardClassName)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p
            className={cn(
              "text-[10px] font-semibold uppercase tracking-[0.16em]",
              theme.eyebrowClassName
            )}
          >
            {label} {copy(language, "pipeline", "pipeline")}
          </p>
          <h3 className="mt-1 text-sm font-semibold text-foreground">
            {pipelineStatusLabel(pipeline.status, language)}
          </h3>
        </div>
        <span
          className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${pipelineStatusClass(
            pipeline.status
          )}`}
        >
          00:00 TSI
        </span>
      </div>

      <div className="mt-3 space-y-2 text-[12px] text-muted-foreground">
        <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
          {copy(language, "Son senkron", "Last sync")}:{" "}
          <span className="text-foreground">
            {formatTimestamp(pipeline.lastSyncedAt, language)}
          </span>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
          {copy(language, "Kaynak", "Source")}:{" "}
          <span className="break-all text-foreground">
            {pipeline.resolvedSourceFile || pipeline.configuredSourceFile || "-"}
          </span>
        </div>
        {pipeline.error ? (
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-rose-100">
            {pipeline.error}
          </div>
        ) : null}
      </div>
    </article>
  );
}

function MissingWorkspacePanel({
  slotKey,
  pipeline,
  language,
}: {
  slotKey: MacroForecastWorkspaceKey;
  pipeline: MacroForecastPipelineMetadata;
  language: AppLanguage;
}) {
  const theme = WORKSPACE_THEME[slotKey];
  const descriptor = workspaceDescriptor(slotKey, language);

  return (
    <section className={cn("overflow-hidden rounded-[1.8rem] border p-[1px]", theme.shellClassName)}>
      <div className={cn("relative overflow-hidden rounded-[1.75rem] p-4 md:p-5", theme.innerClassName)}>
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b",
            theme.glowClassName
          )}
        />
        <div className="relative space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className={cn("h-2.5 w-2.5 rounded-full", theme.lineClassName)} />
                <p
                  className={cn(
                    "text-[10px] font-semibold uppercase tracking-[0.18em]",
                    theme.eyebrowClassName
                  )}
                >
                  {theme.label} Workspace
                </p>
              </div>
              <h2 className="mt-2 heading-condensed text-[1.65rem] leading-none text-foreground">
                {copy(language, "Kaynak bekleniyor", "Waiting for source")}
              </h2>
              <p className="mt-2 text-[13px] leading-6 text-foreground/82">
                {copy(
                  language,
                  `${theme.label} alani sayfada hazir. Snapshot gelince bu yarim otomatik dolar.`,
                  `The ${theme.label} half of the page is ready. As soon as the snapshot lands, this side fills automatically.`
                )}
              </p>
              <p className="mt-2 text-[12px] leading-5 text-muted-foreground">
                {descriptor.summary}
              </p>
            </div>
            <span
              className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${pipelineStatusClass(
                pipeline.status
              )}`}
            >
              {pipelineStatusLabel(pipeline.status, language)}
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <CompactStatCard
              label={copy(language, "Beklenen dosya", "Expected file")}
              value={expectedFileName(slotKey)}
              hint={copy(
                language,
                "Repo kokunde veya mounted data path icinde olmali.",
                "It should exist in repo root or in the mounted data path."
              )}
              className={theme.cardClassName}
            />
            <CompactStatCard
              label={copy(language, "Tercih edilen hedef", "Preferred target")}
              value={preferredDeployTarget(slotKey)}
              hint={`${envVarName(slotKey)} / ${repoMirrorTarget(slotKey)}`}
              className={theme.cardClassName}
            />
          </div>

          <div className={cn("rounded-[1.35rem] border p-4", theme.softCardClassName)}>
            <div className="flex items-center gap-2">
              <Database className={`size-4 ${theme.iconClassName}`} />
              <h3 className="heading-condensed text-lg text-foreground">
                {copy(language, "Deploy notu", "Deploy note")}
              </h3>
            </div>
            <div className="mt-3 space-y-2 text-[13px] leading-6 text-foreground/82">
              <p>
                {copy(
                  language,
                  "Kimi bu dosyayi sadece kendi gecici klasorune birakmamali. Final artifact gorulebilir hedefe yazilmali.",
                  "Kimi must not leave this file only in a private scratch folder. The final artifact has to land on a readable target."
                )}
              </p>
              <p className="text-muted-foreground">
                {copy(
                  language,
                  `Repo deploy kullaniyorsa ./${expectedFileName(slotKey)} uretip push etmeli. Container path kullaniyorsa ${envVarName(
                    slotKey
                  )} ya da ${preferredDeployTarget(slotKey)} hedeflenmeli.`,
                  `If the workspace deploys through the repo, it should write ./${expectedFileName(
                    slotKey
                  )} and push it. If it deploys into the container path, it should target ${envVarName(
                    slotKey
                  )} or ${preferredDeployTarget(slotKey)}.`
                )}
              </p>
            </div>
          </div>

          <PipelineCard
            label={theme.label}
            language={language}
            pipeline={pipeline}
            slotKey={slotKey}
          />
        </div>
      </div>
    </section>
  );
}

function ForecastWorkspaceSection({
  slotKey,
  forecast,
  language,
}: {
  slotKey: MacroForecastWorkspaceKey;
  forecast: MacroForecastWorkspaceData;
  language: AppLanguage;
}) {
  const theme = WORKSPACE_THEME[slotKey];
  const leadScenario = getLeadScenario(forecast);
  const descriptor = workspaceDescriptor(slotKey, language);

  return (
    <section className={cn("overflow-hidden rounded-[1.8rem] border p-[1px]", theme.shellClassName)}>
      <div className={cn("relative overflow-hidden rounded-[1.75rem] p-4 md:p-5", theme.innerClassName)}>
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b",
            theme.glowClassName
          )}
        />
        <div className="relative space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className={cn("h-2.5 w-2.5 rounded-full", theme.lineClassName)} />
                <p
                  className={cn(
                    "text-[10px] font-semibold uppercase tracking-[0.18em]",
                    theme.eyebrowClassName
                  )}
                >
                  {theme.label} · {descriptor.title}
                </p>
              </div>
              <h2 className="mt-2 heading-condensed text-[1.6rem] leading-none text-foreground md:text-[1.9rem]">
                {forecast.title || `${forecast.release.name} Forecast Snapshot`}
              </h2>
              <p className="mt-2 text-[13px] leading-6 text-foreground/84">
                {forecast.summary ||
                  copy(
                    language,
                    `${forecast.release.name} snapshot'i geldigi anda bu alan otomatik guncellenir.`,
                    `This section updates automatically as soon as the ${forecast.release.name} snapshot arrives.`
                  )}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span
                className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${biasClass(
                  forecast.release.bias
                )}`}
              >
                {biasLabel(forecast.release.bias, language)}
              </span>
              <span
                className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${pipelineStatusClass(
                  forecast.pipeline?.status || "idle"
                )}`}
              >
                {copy(language, "Pipeline", "Pipeline")}:{" "}
                {pipelineStatusLabel(forecast.pipeline?.status || "idle", language)}
              </span>
            </div>
          </div>

          <div className={cn("rounded-[1.35rem] border p-4", theme.cardClassName)}>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {copy(language, "Base case", "Base case")}
            </p>
            <p className="mt-2 text-sm font-semibold text-foreground">
              {forecast.baseCase || "-"}
            </p>
            <p className="mt-2 text-[12px] leading-5 text-muted-foreground">
              {leadScenario
                ? `${leadScenario.label} · ${formatProbability(leadScenario.probability)}`
                : copy(language, "Senaryo gelmedi.", "No scenario loaded.")}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <CompactStatCard
              label={copy(language, "Release", "Release")}
              value={formatDateLabel(forecast.release.releaseDate, language)}
              hint={`${forecast.release.period || forecast.release.name} · ${
                forecast.release.releaseTimeEt || "08:30 ET"
              }`}
              className={theme.cardClassName}
            />
            <CompactStatCard
              label={copy(language, "Conviction", "Conviction")}
              value={formatProbability(forecast.conviction)}
              hint={copy(language, "Kimi tez skoru", "Kimi conviction score")}
              className={theme.cardClassName}
            />
            <CompactStatCard
              label={copy(language, "Snapshot", "Snapshot")}
              value={formatTimestamp(forecast.generatedAt, language)}
              hint={`${formatDateLabel(forecast.reportDate, language)} · 00:00 TSI`}
              className={theme.cardClassName}
            />
          </div>

          {forecast.pipeline ? (
            <PipelineCard
              label={theme.label}
              language={language}
              pipeline={forecast.pipeline}
              slotKey={slotKey}
            />
          ) : null}

          <div className="grid gap-4 2xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
            <div className="min-w-0 space-y-4">
              <ReleaseCard
                language={language}
                release={forecast.release}
                slotKey={slotKey}
              />

              <section className={cn("rounded-[1.35rem] border p-4", theme.softCardClassName)}>
                <div className="flex items-center gap-2">
                  <Sparkles className={`size-4 ${theme.eyebrowClassName}`} />
                  <h3 className="heading-condensed text-lg text-foreground">
                    {forecast.release.name}{" "}
                    {copy(language, "senaryo matrisi", "scenario matrix")}
                  </h3>
                </div>
                <div className="mt-3 grid gap-3 xl:grid-cols-2">
                  {forecast.scenarios.length ? (
                    forecast.scenarios.map(scenario => (
                      <ScenarioCard
                        key={`${forecast.release.name}-${scenario.id}`}
                        language={language}
                        scenario={scenario}
                        releaseName={forecast.release.name}
                        slotKey={slotKey}
                      />
                    ))
                  ) : (
                    <div className="rounded-xl border border-dashed border-white/10 bg-black/15 px-4 py-3 text-sm text-muted-foreground xl:col-span-2">
                      {copy(
                        language,
                        "Senaryo kartlari henuz gelmedi.",
                        "Scenario cards have not been populated yet."
                      )}
                    </div>
                  )}
                </div>
              </section>

              <PlaybookTable
                forecast={forecast}
                language={language}
                slotKey={slotKey}
              />
            </div>

            <div className="min-w-0 space-y-4">
              <WatchlistCard
                forecast={forecast}
                language={language}
                slotKey={slotKey}
              />

              <SimpleListCard
                icon={TrendingUp}
                items={forecast.keyDrivers}
                language={language}
                title={`${forecast.release.name} ${copy(
                  language,
                  "key drivers",
                  "key drivers"
                )}`}
                slotKey={slotKey}
              />

              <SimpleListCard
                icon={ShieldAlert}
                items={forecast.risks}
                language={language}
                title={`${forecast.release.name} ${copy(
                  language,
                  "risk map",
                  "risk map"
                )}`}
                tone="risk"
                slotKey={slotKey}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function CpiPpiForecastPage({
  language,
}: {
  language: AppLanguage;
}) {
  const [forecast, setForecast] = useState<CpiPpiForecastData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadForecast = useCallback(
    async (silent = false) => {
      if (!silent) {
        setLoading(true);
        setRefreshing(true);
      }

      try {
        const response = await fetch("/api/cpi-ppi/forecast", {
          cache: "no-store",
          credentials: "include",
        });

        if (!response.ok) {
          const payload =
            ((await response.json().catch(() => null)) as { error?: string } | null) ||
            null;
          throw new Error(
            payload?.error ||
              copy(
                language,
                "CPI/PPI forecast verisi yuklenemedi.",
                "Failed to load the CPI/PPI forecast."
              )
          );
        }

        setForecast((await response.json()) as CpiPpiForecastData);
        setError(null);
      } catch (loadError) {
        setError(
          loadError instanceof Error && loadError.message
            ? loadError.message
            : copy(
                language,
                "CPI/PPI forecast verisi yuklenemedi.",
                "Failed to load the CPI/PPI forecast."
              )
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [language]
  );

  useEffect(() => {
    void loadForecast();
  }, [loadForecast]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      void loadForecast(true);
    }, SNAPSHOT_REFRESH_INTERVAL_MS);

    return () => {
      window.clearInterval(timer);
    };
  }, [loadForecast]);

  const availableWorkspaces = useMemo(
    () =>
      [forecast?.cpi, forecast?.ppi].filter(
        (item): item is MacroForecastWorkspaceData => Boolean(item)
      ),
    [forecast]
  );

  if (loading && !forecast) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-6 md:py-8">
          <WorkspaceLoadingState
            label={copy(
              language,
              "CPI/PPI tahmin workspace yukleniyor.",
              "Loading the CPI/PPI forecast workspace."
            )}
          />
        </div>
      </div>
    );
  }

  if (!forecast || !availableWorkspaces.length) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-6 md:py-8">
          <WorkspaceLoadingState
            label={
              error ||
              copy(
                language,
                "Henuz CPI veya PPI forecast snapshot'i bulunmuyor. Kimi pipeline cpi_forecast.json ya da ppi_forecast.json uretince bu alan otomatik dolacak.",
                "There is no CPI or PPI forecast snapshot yet. This page will populate automatically once the Kimi pipeline produces cpi_forecast.json or ppi_forecast.json."
              )
            }
          />
        </div>
      </div>
    );
  }

  const pipelineStatus = deriveOverallPipelineStatus(forecast.pipeline);
  const lastSyncAt = latestTimestamp([
    forecast.pipeline.cpi.lastSyncedAt,
    forecast.pipeline.ppi.lastSyncedAt,
    forecast.generatedAt,
  ]);
  const workspaceSlots = WORKSPACE_ORDER.map(slotKey => ({
    slotKey,
    forecast: forecast[slotKey],
    pipeline: forecast.pipeline[slotKey],
  }));

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-6 md:py-8">
        <section className="overflow-hidden rounded-[2rem] border border-border bg-[linear-gradient(180deg,rgba(7,11,20,0.98),rgba(7,10,18,1))] shadow-[0_24px_80px_rgba(0,0,0,0.32)]">
          <div className="relative px-5 py-5 md:px-6 md:py-6">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_28%),radial-gradient(circle_at_top_right,rgba(245,158,11,0.14),transparent_28%),radial-gradient(circle_at_bottom_center,rgba(16,185,129,0.08),transparent_26%)]" />
            <div className="relative grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_420px]">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="badge-strong">Dual macro workspaces</span>
                  <span
                    className={`rounded-full border px-3 py-1 text-[11px] ${pipelineStatusClass(
                      pipelineStatus
                    )}`}
                  >
                    {copy(language, "Pipeline", "Pipeline")}:{" "}
                    {pipelineStatusLabel(pipelineStatus, language)}
                  </span>
                  <span className="badge-warning">00:00 TSI</span>
                </div>

                <div className="space-y-3">
                  <p className="heading-condensed text-sm uppercase tracking-[0.18em] text-indigo-300">
                    CPI / PPI Forecast
                  </p>
                  <h1 className="heading-condensed max-w-4xl text-3xl leading-none text-foreground md:text-[3.15rem]">
                    {copy(
                      language,
                      "CPI solda, PPI sagda. Iki workspace ayni zeminde.",
                      "CPI on the left, PPI on the right. Two workspaces on one surface."
                    )}
                  </h1>
                  <p className="max-w-3xl text-[14px] leading-7 text-muted-foreground">
                    {copy(
                      language,
                      "Bu alan artik tek parca uzun bir rapor degil. Her yari kendi release frame, scenario map, playbook ve pipeline durumunu tasiyor. Dosya eksikse bosluk yerine neden eksik oldugu gorunur.",
                      "This is no longer one long report. Each half carries its own release frame, scenario map, playbook, and pipeline state. If a file is missing, you see why instead of a dead blank area."
                    )}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Activity className="size-3.5 text-emerald-300" />
                    {copy(language, "Aktif workspace", "Active workspaces")}:{" "}
                    {availableWorkspaces.map(workspace => workspace.release.name).join(" / ")}
                  </span>
                  <span className="h-3 w-px bg-white/10" />
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="size-3.5 text-sky-300" />
                    {copy(language, "Gunluk deploy", "Daily deploy")}: 00:00 TSI
                  </span>
                  <span className="h-3 w-px bg-white/10" />
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="size-3.5 text-amber-300" />
                    {copy(language, "Son senkron", "Last sync")}:{" "}
                    {formatTimestamp(lastSyncAt, language)}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <CompactStatCard
                    label={copy(language, "CPI status", "CPI status")}
                    value={pipelineStatusLabel(forecast.pipeline.cpi.status, language)}
                    hint={
                      forecast.cpi
                        ? formatDateLabel(forecast.cpi.release.releaseDate, language)
                        : copy(language, "Snapshot bekleniyor", "Waiting for snapshot")
                    }
                    className={WORKSPACE_THEME.cpi.cardClassName}
                  />
                  <CompactStatCard
                    label={copy(language, "PPI status", "PPI status")}
                    value={pipelineStatusLabel(forecast.pipeline.ppi.status, language)}
                    hint={
                      forecast.ppi
                        ? formatDateLabel(forecast.ppi.release.releaseDate, language)
                        : copy(language, "Snapshot bekleniyor", "Waiting for snapshot")
                    }
                    className={WORKSPACE_THEME.ppi.cardClassName}
                  />
                  <CompactStatCard
                    label={copy(language, "Live source", "Live source")}
                    value={copy(
                      language,
                      `${availableWorkspaces.length}/2 hazir`,
                      `${availableWorkspaces.length}/2 ready`
                    )}
                    hint={copy(
                      language,
                      "Eksik yari otomatik pending paneli alir.",
                      "A missing half automatically falls back to the pending panel."
                    )}
                  />
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-2.5">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-center"
                      onClick={() => void loadForecast()}
                    >
                      <RefreshCw className={`size-4 ${refreshing ? "animate-spin" : ""}`} />
                      {copy(language, "Yenile", "Refresh")}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {error ? (
          <div className="mt-5 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        ) : null}

        <main className="mt-6 grid gap-6 xl:grid-cols-2">
          {workspaceSlots.map(item =>
            item.forecast ? (
              <ForecastWorkspaceSection
                key={item.slotKey}
                slotKey={item.slotKey}
                forecast={item.forecast}
                language={language}
              />
            ) : (
              <MissingWorkspacePanel
                key={item.slotKey}
                slotKey={item.slotKey}
                pipeline={item.pipeline}
                language={language}
              />
            )
          )}
        </main>
      </div>
    </div>
  );
}
