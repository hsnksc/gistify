import { useMemo } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  GitCompare,
  LineChart,
  ShieldAlert,
  SlidersHorizontal,
  Table2,
} from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";
import { localizePath, type AppLanguage } from "@/lib/i18n";
import {
  isRecord,
  numberRecordFromValue,
  readNumber,
  readNumberFromKeys,
  readString,
  readStringArray,
  readStringFromKeys,
  readValue,
  useMomentumV3Data,
  type JsonRecord,
} from "@/lib/momentumV3";

interface MomentumCalibrationPageProps {
  language: AppLanguage;
}

interface NormalizedRow {
  label: string;
  values: JsonRecord;
}

function getCalibrationCopy(language: AppLanguage) {
  return language === "en"
    ? {
        back: "Back to momentum workspace",
        calibrationDate: "Calibration date",
        calibrationPendingBody:
          "`/marketflash/calibration/latest.json` was not found. This page will fill automatically after the first Saturday calibration run.",
        calibrationPendingTitle: "Waiting for calibration file",
        changelog: "Changelog",
        championVsChallenger: "Champion vs challenger",
        championVsChallengerPending:
          "Champion/challenger data is not available yet.",
        componentIc: "Component IC",
        componentIcPending: "Waiting for component IC data.",
        dataPending: (title: string) =>
          `Waiting for ${title.toLowerCase()} data.`,
        decileHitRate: "Decile hit rate",
        decilePending: "Waiting for decile data.",
        description:
          "When the weekly calibration file arrives, component IC, decile monotonicity, tier/phase/regime performance, and flag precision are tracked here.",
        eyebrow: "Momentum v3 calibration",
        flagPrecision: "Flag precision",
        frenActive: "FREN active",
        frenFallbackReason:
          "Calibration rules did not allow a new parameter release.",
        gradeAHit: "Grade-A hit",
        gradeASample: "Grade-A sample",
        heading: "Learning report and parameter health",
        metaDescription: "Momentum v3 calibration diagnostics",
        metaTitle: "Momentum Calibration",
        monotonicWarning: "Monotonic warning",
        noValueFalse: "No",
        noValueTrue: "Yes",
        params: "Params",
        phasePerformance: "Phase performance",
        regimePerformance: "Regime performance",
        rolling20T3: "Rolling-20 T+3",
        row: "Row",
        segment: "Segment",
        tierPerformance: "Tier performance",
        waitingForChangelog: "Waiting for parameter changelog data.",
      }
    : {
        back: "Momentum çalışma alanına dön",
        calibrationDate: "Kalibrasyon tarihi",
        calibrationPendingBody:
          "`/marketflash/calibration/latest.json` bulunamadı. Bu sayfa ilk Cumartesi kalibrasyonundan sonra otomatik dolacak.",
        calibrationPendingTitle: "Kalibrasyon dosyası bekleniyor",
        changelog: "Değişiklik günlüğü",
        championVsChallenger: "Champion vs challenger",
        championVsChallengerPending:
          "Champion/challenger verisi henüz hazır değil.",
        componentIc: "Bileşen IC",
        componentIcPending: "Bileşen IC verisi bekleniyor.",
        dataPending: (title: string) => `${title} verisi bekleniyor.`,
        decileHitRate: "Desil isabet oranı",
        decilePending: "Desil verisi bekleniyor.",
        description:
          "Haftalık kalibrasyon dosyası geldiğinde component IC, desil monotonisi, tier/faz/rejim performansı ve flag precision burada izlenir.",
        eyebrow: "Momentum v3 kalibrasyon",
        flagPrecision: "Flag precision",
        frenActive: "FREN aktif",
        frenFallbackReason:
          "Kalibrasyon kuralları yeni parametre yayınına izin vermedi.",
        gradeAHit: "Grade-A isabet",
        gradeASample: "Grade-A örnek",
        heading: "Öğrenme raporu ve parametre sağlığı",
        metaDescription: "Momentum v3 kalibrasyon tanılama",
        metaTitle: "Momentum Kalibrasyon",
        monotonicWarning: "Monotonik uyarı",
        noValueFalse: "Hayır",
        noValueTrue: "Evet",
        params: "Parametreler",
        phasePerformance: "Faz performansı",
        regimePerformance: "Rejim performansı",
        rolling20T3: "Rolling-20 T+3",
        row: "Satır",
        segment: "Segment",
        tierPerformance: "Tier performansı",
        waitingForChangelog: "Parametre değişiklik günlüğü verisi bekleniyor.",
      };
}

type CalibrationCopy = ReturnType<typeof getCalibrationCopy>;

function formatPercent(value: number | undefined) {
  if (value === undefined || !Number.isFinite(value)) {
    return "-";
  }

  const normalized = Math.abs(value) <= 1 ? value * 100 : value;
  return `${normalized.toFixed(normalized >= 10 ? 0 : 1)}%`;
}

function formatDate(value: string | undefined, language: AppLanguage) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(language === "en" ? "en-US" : "tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function displayValue(key: string, value: unknown, copy: CalibrationCopy) {
  const numericValue = readNumber(value);
  if (numericValue !== undefined) {
    const normalizedKey = key.toLowerCase();
    if (
      normalizedKey.includes("rate") ||
      normalizedKey.includes("precision") ||
      normalizedKey.includes("hit")
    ) {
      return formatPercent(numericValue);
    }

    return Number.isInteger(numericValue)
      ? numericValue.toLocaleString()
      : numericValue.toFixed(2);
  }

  if (typeof value === "boolean") {
    return value ? copy.noValueTrue : copy.noValueFalse;
  }

  return readString(value) || "-";
}

function normalizeRows(
  value: unknown,
  labelKeys: string[],
  copy: CalibrationCopy
) {
  if (Array.isArray(value)) {
    return value.filter(isRecord).map((item, index) => {
      const label =
        readStringFromKeys(item, labelKeys) ||
        readStringFromKeys(item, ["label", "name", "key"]) ||
        `${copy.row} ${index + 1}`;

      return {
        label,
        values: item,
      };
    });
  }

  if (!isRecord(value)) {
    return [];
  }

  return Object.entries(value).map(([key, rawValue]) => ({
    label: key,
    values: isRecord(rawValue) ? rawValue : { value: rawValue },
  }));
}

function MetricCard({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-background/55 p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
      <p className="data-mono mt-2 text-2xl font-semibold text-foreground">
        {value}
      </p>
      {note ? (
        <p className="mt-2 text-xs leading-5 text-muted-foreground">{note}</p>
      ) : null}
    </div>
  );
}

function ComponentIcChart({
  copy,
  values,
}: {
  copy: CalibrationCopy;
  values: Record<string, number>;
}) {
  const entries = Object.entries(values).sort(
    (left, right) => Math.abs(right[1]) - Math.abs(left[1])
  );
  const maxAbs = Math.max(0.01, ...entries.map(([, value]) => Math.abs(value)));

  return (
    <section className="rounded-xl border border-border bg-background/45 p-4">
      <div className="mb-4 flex items-center gap-2">
        <BarChart3 className="size-4 text-cyan-200" />
        <h2 className="text-sm font-semibold text-foreground">
          {copy.componentIc}
        </h2>
      </div>
      {entries.length ? (
        <div className="space-y-3">
          {entries.map(([key, value]) => (
            <div key={key}>
              <div className="mb-1 flex items-center justify-between gap-3 text-[11px] text-muted-foreground">
                <span>{key}</span>
                <span
                  className={value >= 0 ? "text-emerald-300" : "text-rose-300"}
                >
                  {value.toFixed(3)}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-background/70">
                <div
                  className={`h-full rounded-full ${value >= 0 ? "bg-emerald-400" : "bg-rose-400"}`}
                  style={{
                    width: `${Math.min(100, (Math.abs(value) / maxAbs) * 100)}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          {copy.componentIcPending}
        </p>
      )}
    </section>
  );
}

function DecileLineChart({
  copy,
  rows,
}: {
  copy: CalibrationCopy;
  rows: NormalizedRow[];
}) {
  const points = rows
    .map((row, index) => ({
      label: row.label,
      decile:
        readNumberFromKeys(row.values, ["decile", "bucket", "rank"]) ??
        index + 1,
      hitRate: readNumberFromKeys(row.values, [
        "hitRate",
        "hit_rate",
        "t3HitRate",
        "t3_hit_rate",
        "value",
      ]),
    }))
    .filter(
      (item): item is { label: string; decile: number; hitRate: number } =>
        item.hitRate !== undefined
    )
    .sort((left, right) => left.decile - right.decile);
  const path = points
    .map((point, index) => {
      const x = points.length <= 1 ? 50 : (index / (points.length - 1)) * 100;
      const normalizedHit =
        Math.abs(point.hitRate) <= 1 ? point.hitRate * 100 : point.hitRate;
      const y = 100 - Math.max(0, Math.min(100, normalizedHit));
      return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
  const monotonicWarning = points.some((point, index) => {
    if (index === 0) return false;
    return point.hitRate + 0.005 < points[index - 1].hitRate;
  });

  return (
    <section className="rounded-xl border border-border bg-background/45 p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <LineChart className="size-4 text-sky-200" />
          <h2 className="text-sm font-semibold text-foreground">
            {copy.decileHitRate}
          </h2>
        </div>
        {monotonicWarning ? (
          <span className="rounded-full border border-amber-400/20 bg-amber-500/10 px-2.5 py-1 text-[11px] text-amber-100">
            {copy.monotonicWarning}
          </span>
        ) : null}
      </div>

      {points.length ? (
        <>
          <svg
            viewBox="0 0 100 100"
            className="h-40 w-full overflow-visible rounded-xl border border-border bg-background/50 p-2"
          >
            <path
              d={path}
              fill="none"
              stroke="rgb(56 189 248)"
              strokeWidth="2.5"
              vectorEffect="non-scaling-stroke"
            />
            {points.map((point, index) => {
              const x =
                points.length <= 1 ? 50 : (index / (points.length - 1)) * 100;
              const normalizedHit =
                Math.abs(point.hitRate) <= 1
                  ? point.hitRate * 100
                  : point.hitRate;
              const y = 100 - Math.max(0, Math.min(100, normalizedHit));
              return (
                <circle
                  key={point.label}
                  cx={x}
                  cy={y}
                  r="2.5"
                  fill="rgb(125 211 252)"
                />
              );
            })}
          </svg>
          <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
            {points.map(point => (
              <span
                key={point.label}
                className="rounded-full border border-border bg-background/55 px-2 py-1"
              >
                {point.label}: {formatPercent(point.hitRate)}
              </span>
            ))}
          </div>
        </>
      ) : (
        <p className="text-sm text-muted-foreground">{copy.decilePending}</p>
      )}
    </section>
  );
}

function MetricTable({
  copy,
  title,
  rows,
}: {
  copy: CalibrationCopy;
  title: string;
  rows: NormalizedRow[];
}) {
  const columns = Array.from(
    new Set(
      rows.flatMap(row =>
        Object.keys(row.values).filter(
          key =>
            ![
              "label",
              "name",
              "key",
              "tier",
              "phase",
              "regime",
              "flag",
            ].includes(key)
        )
      )
    )
  ).slice(0, 5);

  return (
    <section className="rounded-xl border border-border bg-background/45 p-4">
      <div className="mb-3 flex items-center gap-2">
        <Table2 className="size-4 text-cyan-200" />
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      </div>
      {rows.length ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              <tr>
                <th className="border-b border-border px-3 py-2">
                  {copy.segment}
                </th>
                {columns.map(column => (
                  <th key={column} className="border-b border-border px-3 py-2">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <tr
                  key={row.label}
                  className="border-b border-border/60 last:border-0"
                >
                  <td className="px-3 py-2 font-semibold text-foreground">
                    {row.label}
                  </td>
                  {columns.map(column => (
                    <td
                      key={column}
                      className="px-3 py-2 text-muted-foreground"
                    >
                      {displayValue(column, row.values[column], copy)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          {copy.dataPending(title)}
        </p>
      )}
    </section>
  );
}

function KeyValuePanel({
  copy,
  title,
  value,
}: {
  copy: CalibrationCopy;
  title: string;
  value: unknown;
}) {
  const entries = isRecord(value) ? Object.entries(value).slice(0, 10) : [];

  return (
    <section className="rounded-xl border border-border bg-background/45 p-4">
      <div className="mb-3 flex items-center gap-2">
        <GitCompare className="size-4 text-violet-200" />
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      </div>
      {entries.length ? (
        <div className="grid gap-2 sm:grid-cols-2">
          {entries.map(([key, rawValue]) => (
            <div
              key={key}
              className="rounded-xl border border-border bg-background/55 p-3"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {key}
              </p>
              <p className="mt-1 text-sm text-foreground">
                {displayValue(key, rawValue, copy)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          {copy.championVsChallengerPending}
        </p>
      )}
    </section>
  );
}

export default function MomentumCalibrationPage({
  language,
}: MomentumCalibrationPageProps) {
  const { calibration, params, loading } = useMomentumV3Data();
  const copy = useMemo(() => getCalibrationCopy(language), [language]);

  usePageMeta({
    description: copy.metaDescription,
    title: `${copy.metaTitle} | Gistify`,
  });

  const componentIc = useMemo(
    () =>
      numberRecordFromValue(
        readValue(calibration, [
          "componentIC",
          "component_ic",
          "componentInformationCoefficient",
          "component_information_coefficient",
        ])
      ) || {},
    [calibration]
  );
  const decileRows = useMemo(
    () =>
      normalizeRows(
        readValue(calibration, [
          "decileHitRates",
          "decile_hit_rates",
          "decilePerformance",
          "decile_performance",
          "deciles",
        ]),
        ["decile", "bucket"],
        copy
      ),
    [calibration, copy]
  );
  const tierRows = useMemo(
    () =>
      normalizeRows(
        readValue(calibration, ["tierPerformance", "tier_performance"]),
        ["tier", "grade"],
        copy
      ),
    [calibration, copy]
  );
  const phaseRows = useMemo(
    () =>
      normalizeRows(
        readValue(calibration, ["phasePerformance", "phase_performance"]),
        ["phase"],
        copy
      ),
    [calibration, copy]
  );
  const regimeRows = useMemo(
    () =>
      normalizeRows(
        readValue(calibration, ["regimePerformance", "regime_performance"]),
        ["regime"],
        copy
      ),
    [calibration, copy]
  );
  const flagRows = useMemo(
    () =>
      normalizeRows(
        readValue(calibration, ["flagPrecision", "flag_precision", "flags"]),
        ["flag", "name"],
        copy
      ),
    [calibration, copy]
  );
  const changelog = readStringArray(
    readValue(calibration, ["changelog", "changes"])
  );
  const frenRaw = readValue(calibration, [
    "frenTriggered",
    "fren_triggered",
    "fren",
    "brake",
  ]);
  const frenTriggered =
    typeof frenRaw === "boolean"
      ? frenRaw
      : ["1", "true", "yes", "on", "triggered"].includes(
          (readString(frenRaw) || "").toLowerCase()
        );
  const frenReason = readStringFromKeys(calibration, [
    "frenReason",
    "fren_reason",
    "brakeReason",
    "brake_reason",
  ]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container space-y-6 py-6 md:py-8">
        <a
          href={localizePath("/momentum", language)}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          {copy.back}
        </a>

        <section className="rounded-xl border border-cyan-400/14 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.16),transparent_28%),linear-gradient(180deg,rgba(15,23,42,0.96),rgba(15,23,42,0.72))] p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="size-4 text-cyan-200" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-100">
                  {copy.eyebrow}
                </p>
              </div>
              <h1 className="heading-condensed text-3xl text-foreground md:text-4xl">
                {copy.heading}
              </h1>
              <p className="max-w-3xl text-sm leading-7 text-foreground/82">
                {copy.description}
              </p>
            </div>
            <div className="rounded-full border border-border bg-background/55 px-3 py-1 text-xs text-muted-foreground">
              {copy.params}{" "}
              <span className="data-mono text-foreground">
                {params.version}
              </span>
            </div>
          </div>
        </section>

        {frenTriggered ? (
          <section className="rounded-xl border border-rose-400/25 bg-rose-500/12 p-4 text-rose-50">
            <div className="flex items-start gap-3">
              <ShieldAlert className="mt-0.5 size-5 text-rose-200" />
              <div>
                <h2 className="font-semibold">{copy.frenActive}</h2>
                <p className="mt-1 text-sm leading-6 text-rose-50/82">
                  {frenReason || copy.frenFallbackReason}
                </p>
              </div>
            </div>
          </section>
        ) : null}

        {!calibration && !loading ? (
          <section className="rounded-xl border border-amber-400/20 bg-amber-500/10 p-4 text-amber-50">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 size-5 text-amber-200" />
              <div>
                <h2 className="font-semibold">
                  {copy.calibrationPendingTitle}
                </h2>
                <p className="mt-1 text-sm leading-6 text-amber-50/82">
                  {copy.calibrationPendingBody}
                </p>
              </div>
            </div>
          </section>
        ) : null}

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label={copy.calibrationDate}
            value={formatDate(calibration?.date, language)}
          />
          <MetricCard
            label={copy.rolling20T3}
            value={formatPercent(calibration?.rolling20HitRateT3)}
          />
          <MetricCard
            label={copy.gradeAHit}
            value={formatPercent(calibration?.gradeAHitRate)}
          />
          <MetricCard
            label={copy.gradeASample}
            value={
              calibration?.gradeAHitCount !== undefined &&
              calibration?.gradeATotal !== undefined
                ? `${calibration.gradeAHitCount}/${calibration.gradeATotal}`
                : "-"
            }
          />
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <ComponentIcChart copy={copy} values={componentIc} />
          <DecileLineChart copy={copy} rows={decileRows} />
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <MetricTable
            copy={copy}
            title={copy.tierPerformance}
            rows={tierRows}
          />
          <MetricTable
            copy={copy}
            title={copy.phasePerformance}
            rows={phaseRows}
          />
          <MetricTable
            copy={copy}
            title={copy.regimePerformance}
            rows={regimeRows}
          />
          <MetricTable copy={copy} title={copy.flagPrecision} rows={flagRows} />
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <KeyValuePanel
            copy={copy}
            title={copy.championVsChallenger}
            value={readValue(calibration, [
              "championVsChallenger",
              "champion_vs_challenger",
              "abTest",
              "ab_test",
            ])}
          />
          <section className="rounded-xl border border-border bg-background/45 p-4">
            <div className="mb-3 flex items-center gap-2">
              <Table2 className="size-4 text-cyan-200" />
              <h2 className="text-sm font-semibold text-foreground">
                {copy.changelog}
              </h2>
            </div>
            {changelog.length ? (
              <div className="space-y-2">
                {changelog.map(item => (
                  <p
                    key={item}
                    className="rounded-xl border border-border bg-background/55 px-3 py-2 text-sm leading-6 text-foreground/82"
                  >
                    {item}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {copy.waitingForChangelog}
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
