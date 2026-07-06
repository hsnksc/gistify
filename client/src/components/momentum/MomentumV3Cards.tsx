import {
  Activity,
  AlertTriangle,
  BarChart3,
  GitBranch,
  Gauge,
  Layers3,
  ShieldAlert,
  SlidersHorizontal,
  TrendingUp,
} from "lucide-react";
import type { ReactNode } from "react";
import type { MidasSignalRecord, MidasSignalsData } from "@shared/midasSignals";
import { localizePath, type AppLanguage } from "@/lib/i18n";
import {
  isRecord,
  numberArrayFromValue,
  numberRecordFromValue,
  readNumber,
  readNumberFromKeys,
  readString,
  readStringArray,
  readStringFromKeys,
  readValue,
  type MomentumCalibrationData,
  type MomentumLedgerRow,
  type MomentumMarketflashReport,
  type MomentumParams,
} from "@/lib/momentumV3";

const GRADE_ORDER = ["A", "B", "C", "IZLEME"];
const PHASE_ORDER = ["ATEŞLEME", "İVME", "OLGUN", "YORGUN"];

function clampPct(value: number) {
  return Math.max(0, Math.min(100, value));
}

function formatPercent(value: number | undefined) {
  if (value === undefined || !Number.isFinite(value)) {
    return "-";
  }

  const normalized = Math.abs(value) <= 1 ? value * 100 : value;
  return `${normalized.toFixed(normalized >= 10 ? 0 : 1)}%`;
}

function formatNumber(value: number | undefined) {
  return value === undefined || !Number.isFinite(value) ? "-" : Math.round(value).toString();
}

function firstNumber(...values: Array<unknown>) {
  for (const value of values) {
    const nextValue = readNumber(value);
    if (nextValue !== undefined) {
      return nextValue;
    }
  }

  return undefined;
}

function firstString(...values: Array<unknown>) {
  for (const value of values) {
    const nextValue = readString(value);
    if (nextValue) {
      return nextValue;
    }
  }

  return undefined;
}

export function normalizeMomentumGrade(value: unknown) {
  const raw = readString(value);
  if (!raw) {
    return undefined;
  }

  const normalized = raw
    .replace("İ", "I")
    .replace("ı", "i")
    .trim()
    .toUpperCase();

  if (normalized === "WATCH" || normalized === "IZLEME") {
    return "IZLEME";
  }

  return normalized;
}

function displayGrade(value: unknown) {
  const grade = normalizeMomentumGrade(value);
  if (!grade) {
    return "-";
  }

  return grade === "IZLEME" ? "İZLEME" : grade;
}

function normalizePhase(value: unknown) {
  const raw = readString(value);
  if (!raw) {
    return undefined;
  }

  const normalized = raw
    .replace("İ", "I")
    .replace("ı", "i")
    .replace("Ş", "S")
    .replace("ş", "s")
    .trim()
    .toUpperCase();

  if (normalized === "ATESLEME") return "ATEŞLEME";
  if (normalized === "IVME") return "İVME";
  if (normalized === "OLGUN") return "OLGUN";
  if (normalized === "YORGUN") return "YORGUN";
  return raw;
}

export function getSignalMss(signal: MidasSignalRecord) {
  return firstNumber(
    signal.mss,
    signal.apex_score,
    signal.confidence,
    Math.abs(signal.strength) * 14
  );
}

export function getSignalGrade(signal: MidasSignalRecord, params?: MomentumParams) {
  const explicitGrade = normalizeMomentumGrade(signal.grade ?? signal.conviction_tier);
  if (explicitGrade) {
    return explicitGrade;
  }

  const mss = getSignalMss(signal);
  if (mss === undefined) {
    return undefined;
  }

  const thresholds = params?.gradeThresholds || {};
  if (mss >= (thresholds.A ?? 75)) return "A";
  if (mss >= (thresholds.B ?? 60)) return "B";
  if (mss >= (thresholds.C ?? 45)) return "C";
  return "IZLEME";
}

export function getSignalFlags(signal: MidasSignalRecord) {
  return Array.isArray(signal.exhaustionFlags)
    ? signal.exhaustionFlags.filter(Boolean)
    : [];
}

function badgeToneForGrade(grade: string | undefined) {
  switch (normalizeMomentumGrade(grade)) {
    case "A":
      return "border-emerald-400/25 bg-emerald-500/12 text-emerald-200";
    case "B":
      return "border-sky-400/25 bg-sky-500/12 text-sky-100";
    case "C":
      return "border-amber-400/25 bg-amber-500/12 text-amber-200";
    default:
      return "border-slate-400/20 bg-slate-500/10 text-slate-200";
  }
}

export function MssGradeBadge({
  signal,
  params,
  compact = false,
}: {
  signal: MidasSignalRecord;
  params?: MomentumParams;
  compact?: boolean;
}) {
  const mss = getSignalMss(signal);
  const grade = getSignalGrade(signal, params);

  if (mss === undefined && !grade) {
    return null;
  }

  return (
    <span
      className={`rounded-full border px-2 py-0.5 font-bold uppercase tracking-[0.12em] ${compact ? "text-[8px]" : "text-[9px]"} ${badgeToneForGrade(grade)}`}
      title="Momentum Sentiment Score"
    >
      MSS {formatNumber(mss)} / Grade {displayGrade(grade)}
    </span>
  );
}

export function ParamsVersionBadge({
  value,
  compact = false,
}: {
  value?: string;
  compact?: boolean;
}) {
  if (!value) {
    return null;
  }

  return (
    <span
      className={`rounded-full border border-cyan-400/20 bg-cyan-500/10 px-2 py-0.5 font-semibold text-cyan-100 ${compact ? "text-[8px]" : "text-[9px]"}`}
    >
      Params {value}
    </span>
  );
}

export function ExhaustionFlagsBadge({
  flags,
  compact = false,
}: {
  flags: string[];
  compact?: boolean;
}) {
  if (!flags.length) {
    return null;
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border border-rose-400/25 bg-rose-500/12 px-2 py-0.5 font-semibold text-rose-100 ${compact ? "text-[8px]" : "text-[9px]"}`}
      title={flags.join(", ")}
    >
      <AlertTriangle className={compact ? "size-2.5" : "size-3"} />
      Exhaustion {flags.length}
    </span>
  );
}

function MetricPill({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "good" | "warn" | "neutral";
}) {
  const toneClass =
    tone === "good"
      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-100"
      : tone === "warn"
        ? "border-amber-500/20 bg-amber-500/10 text-amber-100"
        : "border-border bg-background/55 text-foreground";

  return (
    <div className={`rounded-xl border px-3 py-2 ${toneClass}`}>
      <p className="text-[9px] font-semibold uppercase tracking-[0.16em] opacity-70">
        {label}
      </p>
      <p className="data-mono mt-1 text-lg font-semibold">{value}</p>
    </div>
  );
}

function deriveGradeCounts(
  signals: MidasSignalRecord[],
  params: MomentumParams,
  explicit?: Record<string, number>
) {
  const counts: Record<string, number> = {
    A: 0,
    B: 0,
    C: 0,
    IZLEME: 0,
  };

  if (explicit) {
    for (const [key, value] of Object.entries(explicit)) {
      const grade = normalizeMomentumGrade(key) || key;
      counts[grade] = (counts[grade] || 0) + value;
    }
    return counts;
  }

  for (const signal of signals) {
    const grade = getSignalGrade(signal, params) || "IZLEME";
    counts[grade] = (counts[grade] || 0) + 1;
  }

  return counts;
}

function derivePhaseCounts(
  signals: MidasSignalRecord[],
  ledger: MomentumLedgerRow[],
  explicit?: Record<string, number>
) {
  const counts: Record<string, number> = {
    "ATEŞLEME": 0,
    "İVME": 0,
    OLGUN: 0,
    YORGUN: 0,
  };

  if (explicit) {
    for (const [key, value] of Object.entries(explicit)) {
      const phase = normalizePhase(key) || key;
      counts[phase] = (counts[phase] || 0) + value;
    }
    return counts;
  }

  const phaseSources = [
    ...signals.map(signal => signal.phase),
    ...ledger.map(item => item.phase),
  ];

  for (const phaseValue of phaseSources) {
    const phase = normalizePhase(phaseValue);
    if (phase) {
      counts[phase] = (counts[phase] || 0) + 1;
    }
  }

  return counts;
}

function collectTopLevelFlags(
  data: MidasSignalsData,
  report: MomentumMarketflashReport | null,
  calibration: MomentumCalibrationData | null,
  signals: MidasSignalRecord[],
  ledger: MomentumLedgerRow[]
) {
  const flags = [
    ...readStringArray(data.exhaustionFlags),
    ...readStringArray(readValue(report, ["exhaustionFlags", "exhaustion_flags"])),
    ...readStringArray(readValue(calibration, ["exhaustionFlags", "exhaustion_flags"])),
    ...signals.flatMap(getSignalFlags),
    ...ledger.flatMap(item => item.exhaustionFlags || []),
  ];

  return Array.from(new Set(flags.filter(Boolean)));
}

function readCountsFromSources(
  data: MidasSignalsData,
  report: MomentumMarketflashReport | null,
  keys: string[]
) {
  return (
    numberRecordFromValue(readValue(data, keys)) ||
    numberRecordFromValue(readValue(report, keys))
  );
}

function readTrend(data: MidasSignalsData, report: MomentumMarketflashReport | null) {
  return (
    numberArrayFromValue(data.mssTrend) ||
    numberArrayFromValue(readValue(report, ["mssTrend", "mss_trend"]))
  );
}

function DashboardCard({
  icon: Icon,
  label,
  children,
  tone = "neutral",
}: {
  icon: typeof Activity;
  label: string;
  children: ReactNode;
  tone?: "neutral" | "good" | "warn" | "danger";
}) {
  const toneClass =
    tone === "good"
      ? "border-emerald-500/18 bg-[linear-gradient(180deg,rgba(16,185,129,0.11),rgba(15,23,42,0.72))]"
      : tone === "warn"
        ? "border-amber-500/18 bg-[linear-gradient(180deg,rgba(245,158,11,0.11),rgba(15,23,42,0.72))]"
        : tone === "danger"
          ? "border-rose-500/18 bg-[linear-gradient(180deg,rgba(244,63,94,0.12),rgba(15,23,42,0.72))]"
          : "border-border bg-background/45";

  return (
    <section className={`rounded-xl border p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] ${toneClass}`}>
      <div className="mb-3 flex items-center gap-2">
        <Icon className="size-4 text-sky-200" />
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </p>
      </div>
      {children}
    </section>
  );
}

function SystemHealthCard({
  data,
  report,
  params,
  calibration,
}: {
  data: MidasSignalsData;
  report: MomentumMarketflashReport | null;
  params: MomentumParams;
  calibration: MomentumCalibrationData | null;
}) {
  const t3HitRate = firstNumber(
    data.rolling20HitRateT3,
    report?.rolling20HitRateT3,
    calibration?.rolling20HitRateT3,
    readNumberFromKeys(calibration, ["rolling_20_hit_rate_t3"])
  );
  const gradeAHitRate = firstNumber(
    data.gradeAHitRate,
    report?.gradeAHitRate,
    calibration?.gradeAHitRate,
    readNumberFromKeys(calibration, ["grade_a_hit_rate"])
  );
  const paramsVersion = firstString(
    data.paramsVersion,
    params.version,
    report?.paramsVersion,
    calibration?.paramsVersion,
    data.version
  );
  const calibrationDate = firstString(
    data.calibrationDate,
    calibration?.date,
    readStringFromKeys(calibration, ["calibrationDate", "calibration_date"])
  );
  const summaryNote =
    firstString(data.summaryNote, report?.summaryNote, calibration?.summaryNote) ||
    "Kalibrasyon dosyası yoksa sistem fallback parametreleriyle çalışır.";
  const healthTone =
    t3HitRate !== undefined && (Math.abs(t3HitRate) <= 1 ? t3HitRate * 100 : t3HitRate) >= 55
      ? "good"
      : "warn";

  return (
    <DashboardCard icon={Gauge} label="Sistem karnesi" tone={healthTone}>
      <div className="grid gap-2 sm:grid-cols-2">
        <MetricPill label="Rolling-20 T+3" value={formatPercent(t3HitRate)} tone={healthTone} />
        <MetricPill label="Grade-A hit" value={formatPercent(gradeAHitRate)} tone="neutral" />
        <MetricPill label="Params" value={paramsVersion || "-"} tone="neutral" />
        <MetricPill label="Kalibrasyon" value={calibrationDate || "-"} tone="neutral" />
      </div>
      <p className="mt-3 text-xs leading-6 text-foreground/78">{summaryNote}</p>
    </DashboardCard>
  );
}

function MssDistributionCard({
  data,
  report,
  params,
  signals,
}: {
  data: MidasSignalsData;
  report: MomentumMarketflashReport | null;
  params: MomentumParams;
  signals: MidasSignalRecord[];
}) {
  const counts = deriveGradeCounts(
    signals,
    params,
    readCountsFromSources(data, report, ["gradeCounts", "grade_counts", "mssDistribution"])
  );
  const total = Math.max(1, Object.values(counts).reduce((sum, value) => sum + value, 0));
  const trend = readTrend(data, report) || signals.slice(0, 10).map(getSignalMss).filter((item): item is number => item !== undefined);

  return (
    <DashboardCard icon={BarChart3} label="MSS dağılımı">
      <div className="space-y-2">
        {GRADE_ORDER.map(grade => {
          const count = counts[grade] || 0;
          const pct = (count / total) * 100;

          return (
            <div key={grade}>
              <div className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Grade {displayGrade(grade)}</span>
                <span className="data-mono">{count}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-background/70">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300"
                  style={{ width: `${clampPct(pct)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex h-14 items-end gap-1 rounded-xl border border-border bg-background/45 p-2">
        {trend.slice(-18).map((value, index) => (
          <div
            key={`${value}-${index}`}
            className="min-w-1 flex-1 rounded-t bg-sky-300/75"
            style={{ height: `${clampPct(value)}%` }}
            title={`MSS ${value.toFixed(1)}`}
          />
        ))}
        {!trend.length ? (
          <p className="self-center text-xs text-muted-foreground">MSS trend dosyası bekleniyor.</p>
        ) : null}
      </div>
    </DashboardCard>
  );
}

function PhaseMapCard({
  data,
  report,
  ledger,
  signals,
}: {
  data: MidasSignalsData;
  report: MomentumMarketflashReport | null;
  ledger: MomentumLedgerRow[];
  signals: MidasSignalRecord[];
}) {
  const counts = derivePhaseCounts(
    signals,
    ledger,
    readCountsFromSources(data, report, ["phaseCounts", "phase_counts", "phaseMap"])
  );
  const total = Math.max(1, Object.values(counts).reduce((sum, value) => sum + value, 0));
  const warning =
    (counts.YORGUN || 0) > 0
      ? `${counts.YORGUN} isim yorgun fazda; yeni girişlerde onay filtresi sıkı tutulmalı.`
      : "Yorgun faz uyarısı yok.";

  return (
    <DashboardCard icon={Layers3} label="Momentum faz haritası" tone={(counts.YORGUN || 0) > 0 ? "warn" : "good"}>
      <div className="grid grid-cols-2 gap-2">
        {PHASE_ORDER.map(phase => {
          const count = counts[phase] || 0;
          return (
            <div key={phase} className="rounded-xl border border-border bg-background/50 p-3">
              <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {phase}
              </p>
              <p className="heading-condensed mt-1 text-2xl text-foreground">{count}</p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-background/75">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-300 to-rose-300"
                  style={{ width: `${clampPct((count / total) * 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-xs leading-6 text-foreground/78">{warning}</p>
    </DashboardCard>
  );
}

function CarryForwardHealthCard({
  data,
  report,
  ledger,
}: {
  data: MidasSignalsData;
  report: MomentumMarketflashReport | null;
  ledger: MomentumLedgerRow[];
}) {
  const rawHealth = readValue(data, ["carryForwardHealth", "carry_forward_health"]) ||
    readValue(report, ["carryForwardHealth", "carry_forward_health"]);
  const health = isRecord(rawHealth) ? rawHealth : null;
  const active = ledger.filter(item =>
    (item.status || "").toLowerCase().match(/open|active|carry|tas|taş/)
  ).length;
  const closed = ledger.filter(item =>
    (item.status || "").toLowerCase().match(/closed|done|exit|complete/)
  ).length;
  const stale = firstNumber(
    readValue(health, ["stale", "staleCount", "stale_count"]),
    ledger.filter(item => (item.status || "").toLowerCase().includes("stale")).length
  );

  return (
    <DashboardCard icon={GitBranch} label="Carry-forward sağlığı">
      <div className="grid gap-2 sm:grid-cols-3">
        <MetricPill label="Aktif carry" value={formatNumber(firstNumber(readValue(health, ["active", "open"]), active))} tone="good" />
        <MetricPill label="Kapanan" value={formatNumber(firstNumber(readValue(health, ["closed", "completed"]), closed))} tone="neutral" />
        <MetricPill label="Bayat" value={formatNumber(stale)} tone={stale && stale > 0 ? "warn" : "neutral"} />
      </div>
      <p className="mt-3 text-xs leading-6 text-foreground/78">
        Public ledger yoksa kart canlı sinyal sayısına düşer; private `momentum_ledger.json` okunmaz.
      </p>
    </DashboardCard>
  );
}

function ExhaustionAlertCard({
  flags,
}: {
  flags: string[];
}) {
  return (
    <DashboardCard icon={ShieldAlert} label="Exhaustion flag uyarıları" tone={flags.length ? "danger" : "good"}>
      {flags.length ? (
        <div className="space-y-2">
          <p className="text-sm leading-6 text-rose-50/86">
            {flags.length} benzersiz exhaustion uyarısı algılandı.
          </p>
          <div className="flex flex-wrap gap-2">
            {flags.slice(0, 8).map(flag => (
              <span key={flag} className="rounded-full border border-rose-400/20 bg-rose-500/10 px-2.5 py-1 text-[11px] text-rose-100">
                {flag}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm leading-6 text-emerald-50/82">
          Aktif exhaustion flag yok. Yeni JSON geldiğinde flag hassasiyeti kalibrasyon sayfasında izlenir.
        </p>
      )}
    </DashboardCard>
  );
}

export function MomentumV3Dashboard({
  data,
  report,
  params,
  calibration,
  ledger,
  signals,
  language,
}: {
  data: MidasSignalsData;
  report: MomentumMarketflashReport | null;
  params: MomentumParams;
  calibration: MomentumCalibrationData | null;
  ledger: MomentumLedgerRow[];
  signals: MidasSignalRecord[];
  language: AppLanguage;
}) {
  const flags = collectTopLevelFlags(data, report, calibration, signals, ledger);
  const paramsVersion = firstString(
    data.paramsVersion,
    params.version,
    report?.paramsVersion,
    calibration?.paramsVersion,
    data.version
  );

  return (
    <div className="rounded-xl border border-cyan-400/12 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.14),transparent_26%),linear-gradient(180deg,rgba(15,23,42,0.82),rgba(15,23,42,0.62))] p-4">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="size-4 text-cyan-200" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-100">
              Momentum v3 öğrenme katmanı
            </p>
          </div>
          <p className="max-w-3xl text-sm leading-7 text-foreground/82">
            MSS dağılımı, faz haritası ve public ledger sağlığı tek komuta katmanında izlenir.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <ParamsVersionBadge value={paramsVersion} />
          <a className="rounded-full border border-border bg-background/55 px-3 py-1 text-muted-foreground transition-colors hover:text-foreground" href={localizePath("/momentum/calibration", language)}>
            Kalibrasyon
          </a>
          <a className="rounded-full border border-border bg-background/55 px-3 py-1 text-muted-foreground transition-colors hover:text-foreground" href={localizePath("/momentum/ledger", language)}>
            Public ledger
          </a>
        </div>
      </div>

      <div className="grid gap-3 xl:grid-cols-2">
        <SystemHealthCard data={data} report={report} params={params} calibration={calibration} />
        <MssDistributionCard data={data} report={report} params={params} signals={signals} />
        <PhaseMapCard data={data} report={report} ledger={ledger} signals={signals} />
        <CarryForwardHealthCard data={data} report={report} ledger={ledger} />
        <div className="xl:col-span-2">
          <ExhaustionAlertCard flags={flags} />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-xl border border-border bg-background/45 px-3 py-2 text-xs text-muted-foreground">
        <TrendingUp className="size-3.5 text-cyan-200" />
        Dosya kaynakları: `marketflash_report.json`, `momentum_params.json`,
        `calibration/latest.json`, `ledger_public.json`.
      </div>
    </div>
  );
}
