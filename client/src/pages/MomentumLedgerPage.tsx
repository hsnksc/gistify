import { useMemo, useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, Database, Filter, ShieldCheck } from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";
import { localizePath, type AppLanguage } from "@/lib/i18n";
import {
  readString,
  useMomentumV3Data,
  type MomentumLedgerRow,
  type MomentumOutcome,
} from "@/lib/momentumV3";

interface MomentumLedgerPageProps {
  language: AppLanguage;
}

type FilterKey = "trackType" | "grade" | "phase" | "catalystTier" | "status";
type SortKey = "entryDate" | "mss" | "symbol" | "grade" | "status";

const PAGE_SIZE = 50;
const FILTERS: Array<{ key: FilterKey; label: string }> = [
  { key: "trackType", label: "Track" },
  { key: "grade", label: "Grade" },
  { key: "phase", label: "Phase" },
  { key: "catalystTier", label: "Catalyst" },
  { key: "status", label: "Status" },
];

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
  }).format(date);
}

function normalizeOption(value: unknown) {
  return readString(value) || "-";
}

function distinctOptions(rows: MomentumLedgerRow[], key: FilterKey) {
  return Array.from(
    new Set(rows.map(row => normalizeOption(row[key])).filter(value => value !== "-"))
  ).sort((left, right) => left.localeCompare(right));
}

function outcomeTone(outcome: MomentumOutcome | undefined) {
  if (!outcome) {
    return "border-border bg-background/55 text-muted-foreground";
  }

  if (outcome.hit === true || (outcome.retPct !== undefined && outcome.retPct > 0)) {
    return "border-emerald-400/25 bg-emerald-500/12 text-emerald-200";
  }

  if (outcome.hit === false || (outcome.retPct !== undefined && outcome.retPct < 0)) {
    return "border-rose-400/25 bg-rose-500/12 text-rose-200";
  }

  return "border-amber-400/25 bg-amber-500/12 text-amber-100";
}

function OutcomePill({
  label,
  outcome,
}: {
  label: string;
  outcome: MomentumOutcome | undefined;
}) {
  const ret =
    outcome?.retPct !== undefined
      ? `${outcome.retPct > 0 ? "+" : ""}${outcome.retPct.toFixed(2)}%`
      : outcome?.status || "-";

  return (
    <span className={`inline-flex min-w-20 justify-center rounded-full border px-2 py-1 text-[11px] font-semibold ${outcomeTone(outcome)}`}>
      {label}: {ret}
    </span>
  );
}

function compareRows(left: MomentumLedgerRow, right: MomentumLedgerRow, sortKey: SortKey) {
  switch (sortKey) {
    case "mss":
      return (right.mss ?? -Infinity) - (left.mss ?? -Infinity);
    case "symbol":
      return left.symbol.localeCompare(right.symbol);
    case "grade":
      return normalizeOption(left.grade).localeCompare(normalizeOption(right.grade));
    case "status":
      return normalizeOption(left.status).localeCompare(normalizeOption(right.status));
    case "entryDate":
    default:
      return normalizeOption(right.entryDate).localeCompare(normalizeOption(left.entryDate));
  }
}

export default function MomentumLedgerPage({ language }: MomentumLedgerPageProps) {
  const { ledger, params, loading } = useMomentumV3Data();
  const [filters, setFilters] = useState<Record<FilterKey, string>>({
    trackType: "",
    grade: "",
    phase: "",
    catalystTier: "",
    status: "",
  });
  const [sortKey, setSortKey] = useState<SortKey>("entryDate");
  const [page, setPage] = useState(1);

  usePageMeta({
    description: "Momentum public ledger",
    title: "Momentum Ledger | Gistify",
  });

  const filteredRows = useMemo(() => {
    const nextRows = ledger.filter(row =>
      FILTERS.every(({ key }) => {
        const selected = filters[key];
        if (!selected) {
          return true;
        }

        return normalizeOption(row[key]) === selected;
      })
    );

    return nextRows.sort((left, right) => compareRows(left, right, sortKey));
  }, [filters, ledger, sortKey]);
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visibleRows = filteredRows.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const updateFilter = (key: FilterKey, value: string) => {
    setFilters(current => ({
      ...current,
      [key]: value,
    }));
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container space-y-6 py-6 md:py-8">
        <a href={localizePath("/momentum", language)} className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="size-4" />
          Momentum komuta ekranı
        </a>

        <section className="rounded-xl border border-emerald-400/14 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_28%),linear-gradient(180deg,rgba(15,23,42,0.96),rgba(15,23,42,0.72))] p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Database className="size-4 text-emerald-200" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-100">
                  Momentum public ledger
                </p>
              </div>
              <h1 className="heading-condensed text-3xl text-foreground md:text-4xl">
                T+1 / T+3 / T+5 sonuç izleme
              </h1>
              <p className="max-w-3xl text-sm leading-7 text-foreground/82">
                Bu ekran yalnızca `/marketflash/ledger_public.json` okur. Private
                `momentum_ledger.json` istemciye taşınmaz.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="rounded-full border border-border bg-background/55 px-3 py-1 text-muted-foreground">
                Params <span className="data-mono text-foreground">{params.version}</span>
              </span>
              <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-emerald-100">
                {filteredRows.length}/{ledger.length} satır
              </span>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-background/45 p-4">
          <div className="mb-3 flex items-center gap-2">
            <ShieldCheck className="size-4 text-emerald-200" />
            <p className="text-sm text-foreground">
              Public-safe alanlar: sembol, track, grade, phase, catalyst, status,
              MSS ve T+ sonuçları.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
            {FILTERS.map(({ key, label }) => (
              <label key={key} className="space-y-1.5">
                <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  <Filter className="size-3" />
                  {label}
                </span>
                <select
                  value={filters[key]}
                  onChange={event => updateFilter(key, event.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none"
                >
                  <option value="">Tümü</option>
                  {distinctOptions(ledger, key).map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            ))}
            <label className="space-y-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Sort
              </span>
              <select
                value={sortKey}
                onChange={event => {
                  setSortKey(event.target.value as SortKey);
                  setPage(1);
                }}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none"
              >
                <option value="entryDate">Tarih</option>
                <option value="mss">MSS</option>
                <option value="symbol">Sembol</option>
                <option value="grade">Grade</option>
                <option value="status">Status</option>
              </select>
            </label>
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-border bg-background/45">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="bg-background/70 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Sembol</th>
                  <th className="px-4 py-3">Tarih</th>
                  <th className="px-4 py-3">Track</th>
                  <th className="px-4 py-3">Grade</th>
                  <th className="px-4 py-3">Phase</th>
                  <th className="px-4 py-3">Catalyst</th>
                  <th className="px-4 py-3">MSS</th>
                  <th className="px-4 py-3">T sonuçları</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Flags</th>
                </tr>
              </thead>
              <tbody>
                {visibleRows.map(row => (
                  <tr key={`${row.symbol}-${row.entryDate || ""}-${row.paramsVersion || ""}`} className="border-t border-border/70">
                    <td className="px-4 py-3">
                      <span className="heading-condensed text-lg text-foreground">{row.symbol}</span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(row.entryDate, language)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.trackType || "-"}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full border border-sky-400/20 bg-sky-500/10 px-2.5 py-1 text-[11px] font-semibold text-sky-100">
                        {row.grade || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{row.phase || "-"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.catalystTier || "-"}</td>
                    <td className="data-mono px-4 py-3 text-foreground">{row.mss !== undefined ? Math.round(row.mss) : "-"}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        <OutcomePill label="T+1" outcome={row.t1} />
                        <OutcomePill label="T+3" outcome={row.t3} />
                        <OutcomePill label="T+5" outcome={row.t5} />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{row.status || "-"}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {(row.exhaustionFlags || []).slice(0, 3).map(flag => (
                          <span key={flag} className="rounded-full border border-rose-400/20 bg-rose-500/10 px-2 py-0.5 text-[10px] text-rose-100">
                            {flag}
                          </span>
                        ))}
                        {!row.exhaustionFlags?.length ? <span className="text-muted-foreground">-</span> : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!visibleRows.length ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              {loading ? "Public ledger yükleniyor." : "Filtrelere uygun public ledger satırı yok."}
            </div>
          ) : null}
        </section>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-background/45 px-4 py-3">
          <p className="text-sm text-muted-foreground">
            Sayfa {safePage}/{totalPages} · {PAGE_SIZE} satır/sayfa
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPage(current => Math.max(1, current - 1))}
              disabled={safePage <= 1}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background/70 px-3 py-2 text-sm text-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft className="size-4" />
              Önceki
            </button>
            <button
              type="button"
              onClick={() => setPage(current => Math.min(totalPages, current + 1))}
              disabled={safePage >= totalPages}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background/70 px-3 py-2 text-sm text-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              Sonraki
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
