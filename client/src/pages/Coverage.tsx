import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Clock3,
  GitCompareArrows,
  Search,
  Star,
} from "lucide-react";
import { useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import FlowLayout from "@/features/flow/components/FlowLayout";
import {
  compareCoverageReports,
  groupCoverageReports,
  parseCoverageReport,
  type CoverageBlock,
  type CoverageChecklistBlock,
  type CoverageReport,
  type CoverageStoredRecord,
  type CoverageTableBlock,
} from "@/features/coverage/lib/coverageParser";
import { fetchCoverageReports } from "@/features/coverage/lib/coverageApi";
import { getCoverageSeedRecords } from "@/features/coverage/lib/coverageSeed";
import LoadingState from "@/components/ui/loading-state";
import { usePageMeta } from "@/hooks/usePageMeta";
import { copy, type AppLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const WATCH_STORAGE_KEY = "gistify:coverage:watch:v1";
const CHECKLIST_STORAGE_KEY = "gistify:coverage:checklist:v1";

type CoverageMode = "calendar" | "detail" | "index";
type ChecklistState = Record<string, boolean>;

const INLINE_PATTERN =
  /(\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|\*\*([^*]+)\*\*|`([^`]+)`)/g;

function readWatchlist() {
  if (typeof window === "undefined") {
    return new Set<string>();
  }

  try {
    const raw = window.localStorage.getItem(WATCH_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as string[]) : [];
    return new Set(parsed.filter(item => typeof item === "string"));
  } catch {
    return new Set<string>();
  }
}

function persistWatchlist(watchlist: Set<string>) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    WATCH_STORAGE_KEY,
    JSON.stringify(Array.from(watchlist.values()))
  );
}

function readChecklistState() {
  if (typeof window === "undefined") {
    return {} as ChecklistState;
  }

  try {
    const raw = window.localStorage.getItem(CHECKLIST_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ChecklistState) : {};
  } catch {
    return {};
  }
}

function persistChecklistState(state: ChecklistState) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(state));
}

function localeFor(language: AppLanguage) {
  return language === "en" ? "en-US" : "tr-TR";
}

function formatDate(value: string | undefined, language: AppLanguage) {
  if (!value) {
    return "-";
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Intl.DateTimeFormat(localeFor(language), {
      day: "2-digit",
      month: "short",
      timeZone: "UTC",
      year: "numeric",
    }).format(new Date(`${value}T00:00:00Z`));
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(localeFor(language), {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

function formatUsd(value: number | undefined) {
  if (typeof value !== "number") {
    return "-";
  }

  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: 2,
    minimumFractionDigits: value >= 100 ? 0 : 2,
    style: "currency",
  }).format(value);
}

function formatPlainNumber(value: number | undefined) {
  if (typeof value !== "number") {
    return "-";
  }

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value);
}

function formatPercent(value: number | undefined) {
  if (typeof value !== "number") {
    return "-";
  }

  return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;
}

function metricTone(value: number | undefined) {
  if (typeof value !== "number") {
    return "text-foreground";
  }

  return value >= 0 ? "text-emerald-300" : "text-rose-300";
}

function signalBadgeClass(signal: string) {
  const upper = signal.toUpperCase();
  if (upper.includes("BEAR")) {
    return "border-rose-500/35 bg-rose-500/12 text-rose-200";
  }

  if (upper.includes("SPEC")) {
    return "border-sky-500/35 bg-sky-500/12 text-sky-200";
  }

  if (upper.includes("BULL")) {
    return "border-emerald-500/35 bg-emerald-500/12 text-emerald-200";
  }

  return "border-border bg-background/60 text-muted-foreground";
}

function renderInlineText(text: string, keyPrefix: string) {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  INLINE_PATTERN.lastIndex = 0;

  while ((match = INLINE_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    if (match[2] && match[3]) {
      nodes.push(
        <a
          key={`${keyPrefix}-${match.index}`}
          href={match[3]}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-sky-300 underline decoration-sky-500/40 underline-offset-4 hover:text-sky-200"
        >
          {match[2]}
        </a>
      );
    } else if (match[4]) {
      nodes.push(
        <strong
          key={`${keyPrefix}-${match.index}`}
          className="font-semibold text-foreground"
        >
          {match[4]}
        </strong>
      );
    } else if (match[5]) {
      nodes.push(
        <code
          key={`${keyPrefix}-${match.index}`}
          className="rounded bg-background/70 px-1.5 py-0.5 font-mono text-[0.9em] text-sky-200"
        >
          {match[5]}
        </code>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

function buildVersionHref(ticker: string, versionId: string) {
  return `/coverage/${ticker}?v=${encodeURIComponent(versionId)}`;
}

function getSelectedVersionId() {
  if (typeof window === "undefined") {
    return "";
  }

  return new URLSearchParams(window.location.search).get("v") || "";
}

function summarizeDiff(current: CoverageReport, previous: CoverageReport | null) {
  if (!previous) {
    return {
      changedMetrics: [] as Array<{ label: string; next: string; previous: string }>,
      changedSections: [] as string[],
    };
  }

  const metricLabels = [
    ["Price", formatUsd(current.metrics.price), formatUsd(previous.metrics.price)],
    [
      "Change",
      formatPercent(current.metrics.changePct),
      formatPercent(previous.metrics.changePct),
    ],
    [
      "Target Avg",
      formatUsd(current.metrics.targetAvg),
      formatUsd(previous.metrics.targetAvg),
    ],
    ["IV", formatPercent(current.metrics.iv), formatPercent(previous.metrics.iv)],
    [
      "Short Float",
      formatPercent(current.metrics.shortFloat),
      formatPercent(previous.metrics.shortFloat),
    ],
    ["RSI", formatPlainNumber(current.metrics.rsi), formatPlainNumber(previous.metrics.rsi)],
    ["Budget", formatUsd(current.metrics.budget), formatUsd(previous.metrics.budget)],
  ]
    .filter(([, next, prior]) => next !== prior)
    .map(([label, next, prior]) => ({
      label,
      next,
      previous: prior,
    }));

  const previousByTitle = new Map(
    previous.sections.map(section => [section.title, section.rawText])
  );
  const changedSections = current.sections
    .filter(section => previousByTitle.get(section.title) !== section.rawText)
    .map(section => section.title);

  return {
    changedMetrics: metricLabels,
    changedSections,
  };
}

function CoverageBlocks({
  blockPrefix,
  blocks,
  checklistState,
  onChecklistChange,
  reportId,
  sectionId,
}: {
  blockPrefix: string;
  blocks: CoverageBlock[];
  checklistState: ChecklistState;
  onChecklistChange: (key: string, checked: boolean) => void;
  reportId: string;
  sectionId: string;
}) {
  return (
    <div className="space-y-4">
      {blocks.map((block, index) => {
        if (block.type === "paragraph") {
          return (
            <p
              key={`${blockPrefix}-${index}`}
              className="text-sm leading-7 text-muted-foreground md:text-[15px]"
            >
              {renderInlineText(block.text, `${blockPrefix}-${index}`)}
            </p>
          );
        }

        if (block.type === "quote") {
          return (
            <div
              key={`${blockPrefix}-${index}`}
              className="rounded-xl border border-sky-500/20 bg-sky-500/8 px-4 py-3 text-sm leading-7 text-sky-100"
            >
              {renderInlineText(block.text, `${blockPrefix}-${index}`)}
            </div>
          );
        }

        if (block.type === "list") {
          return (
            <ul
              key={`${blockPrefix}-${index}`}
              className="space-y-2 pl-5 text-sm leading-7 text-muted-foreground"
            >
              {block.items.map((item, itemIndex) => (
                <li
                  key={`${blockPrefix}-${index}-${itemIndex}`}
                  className="list-disc"
                >
                  {renderInlineText(item, `${blockPrefix}-${index}-${itemIndex}`)}
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === "checklist") {
          return (
            <ChecklistBlockView
              key={`${blockPrefix}-${index}`}
              block={block}
              checklistState={checklistState}
              onChecklistChange={onChecklistChange}
              reportId={reportId}
              sectionId={sectionId}
            />
          );
        }

        return (
          <TableBlockView
            key={`${blockPrefix}-${index}`}
            block={block}
            blockPrefix={blockPrefix}
          />
        );
      })}
    </div>
  );
}

function TableBlockView({
  block,
  blockPrefix,
}: {
  block: CoverageTableBlock;
  blockPrefix: string;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-background/30">
      <Table>
        <TableHeader>
          <TableRow className="border-border">
            {block.headers.map((header, index) => (
              <TableHead
                key={`${blockPrefix}-head-${index}`}
                className="px-4 py-3 text-xs uppercase tracking-[0.16em] text-muted-foreground"
              >
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {block.rows.map((row, rowIndex) => (
            <TableRow
              key={`${blockPrefix}-row-${rowIndex}`}
              className="border-border/70"
            >
              {row.map((cell, cellIndex) => (
                <TableCell
                  key={`${blockPrefix}-cell-${rowIndex}-${cellIndex}`}
                  className="px-4 py-3 align-top whitespace-normal text-sm text-muted-foreground"
                >
                  {renderInlineText(
                    cell,
                    `${blockPrefix}-${rowIndex}-${cellIndex}`
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function ChecklistBlockView({
  block,
  checklistState,
  onChecklistChange,
  reportId,
  sectionId,
}: {
  block: CoverageChecklistBlock;
  checklistState: ChecklistState;
  onChecklistChange: (key: string, checked: boolean) => void;
  reportId: string;
  sectionId: string;
}) {
  return (
    <div className="space-y-3">
      {block.items.map(item => {
        const storageKey = `${reportId}:${sectionId}:${item.id}`;
        const checked = checklistState[storageKey] ?? item.checked;

        return (
          <label
            key={storageKey}
            className="flex items-start gap-3 rounded-xl border border-border bg-background/25 px-4 py-3 text-sm text-muted-foreground"
          >
            <input
              type="checkbox"
              className="mt-1 size-4 accent-emerald-500"
              checked={checked}
              onChange={event => onChecklistChange(storageKey, event.target.checked)}
            />
            <span className={checked ? "text-foreground" : undefined}>
              {renderInlineText(item.text, storageKey)}
            </span>
          </label>
        );
      })}
    </div>
  );
}

export default function Coverage({
  language,
  mode = "index",
  ticker,
}: {
  language: AppLanguage;
  mode?: CoverageMode;
  ticker?: string;
}) {
  const [location, setLocation] = useLocation();
  const [records, setRecords] = useState<CoverageStoredRecord[]>([]);
  const [recordsLoading, setRecordsLoading] = useState(true);
  const [recordsError, setRecordsError] = useState<string | null>(null);
  const [watchlist, setWatchlist] = useState<Set<string>>(() => readWatchlist());
  const [checklistState, setChecklistState] = useState<ChecklistState>(() =>
    readChecklistState()
  );
  const [search, setSearch] = useState("");
  const [selectedVersionIdState, setSelectedVersionIdState] = useState(() =>
    getSelectedVersionId()
  );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const apiRecords = await fetchCoverageReports();
        if (!cancelled) {
          setRecords(apiRecords.length > 0 ? apiRecords : getCoverageSeedRecords());
          setRecordsLoading(false);
        }
      } catch (error) {
        console.error("[Coverage] Failed to load reports from API:", error);
        if (!cancelled) {
          setRecords(getCoverageSeedRecords());
          setRecordsError(
            "Could not load coverage reports from server. Showing sample data."
          );
          setRecordsLoading(false);
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    persistWatchlist(watchlist);
  }, [watchlist]);

  useEffect(() => {
    persistChecklistState(checklistState);
  }, [checklistState]);

  useEffect(() => {
    setSelectedVersionIdState(getSelectedVersionId());
  }, [location]);

  useEffect(() => {
    const handlePopState = () => {
      setSelectedVersionIdState(getSelectedVersionId());
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const reports = useMemo(
    () =>
      records
        .map(record => {
          try {
            return parseCoverageReport(record);
          } catch {
            return null;
          }
        })
        .filter((report): report is CoverageReport => report !== null)
        .sort(compareCoverageReports),
    [records]
  );

  const groupedReports = useMemo(() => groupCoverageReports(reports), [reports]);
  const reportGroups = useMemo(
    () =>
      Array.from(groupedReports.entries())
        .map(([groupTicker, groupReports]) => ({
          latest: groupReports[0],
          reports: groupReports,
          ticker: groupTicker,
        }))
        .sort((left, right) => compareCoverageReports(left.latest, right.latest)),
    [groupedReports]
  );

  const filteredGroups = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    if (!normalizedSearch) {
      return reportGroups;
    }

    return reportGroups.filter(group =>
      group.reports.some(report => report.searchText.includes(normalizedSearch))
    );
  }, [reportGroups, search]);

  const currentGroup = useMemo(
    () => (ticker ? groupedReports.get(ticker.toUpperCase()) || [] : []),
    [groupedReports, ticker]
  );
  const currentReport = useMemo(() => {
    if (!currentGroup.length) {
      return null;
    }

    return (
      currentGroup.find(report => report.id === selectedVersionIdState) ||
      currentGroup[0]
    );
  }, [currentGroup, selectedVersionIdState]);
  const previousReport = useMemo(() => {
    if (!currentReport) {
      return null;
    }

    const currentIndex = currentGroup.findIndex(
      report => report.id === currentReport.id
    );
    return currentIndex >= 0 ? currentGroup[currentIndex + 1] || null : null;
  }, [currentGroup, currentReport]);
  const diffSummary = useMemo(
    () => (currentReport ? summarizeDiff(currentReport, previousReport) : null),
    [currentReport, previousReport]
  );

  const calendarItems = useMemo(
    () =>
      reportGroups
        .map(group => group.latest)
        .sort((left, right) => {
          const leftDate = left.metrics.earningsDate || left.reportDate;
          const rightDate = right.metrics.earningsDate || right.reportDate;
          return leftDate.localeCompare(rightDate);
        }),
    [reportGroups]
  );

  const pageTitle =
    mode === "detail" && currentReport
      ? `${currentReport.ticker} Coverage | Gistify`
      : mode === "calendar"
        ? "Coverage Calendar | Gistify"
        : "Coverage | Gistify";
  const pageDescription =
    mode === "detail" && currentReport
      ? `${currentReport.company} icin surumlu coverage arsivi, earnings takvimi ve opsiyon notlari.`
      : mode === "calendar"
        ? "Coverage kutuphanesindeki earnings tarihlerini ve takip takvimini tek ekranda gor."
        : "Markdown tabanli coverage kutuphanesi, surum takibi ve earnings takvimi.";

  usePageMeta({
    canonical:
      mode === "detail" && currentReport
        ? `/coverage/${currentReport.ticker}`
        : mode === "calendar"
          ? "/coverage/calendar"
          : "/coverage",
    description: pageDescription,
    title: pageTitle,
  });

  const stats = [
    {
      detail: copy(language, "Toplam ticker kutuphanesi", "Tracked tickers"),
      label: copy(language, "Ticker", "Ticker"),
      value: String(reportGroups.length),
    },
    {
      detail: copy(language, "Tum versiyonler dahil", "All archived versions"),
      label: copy(language, "Rapor", "Reports"),
      value: String(reports.length),
    },
    {
      detail: copy(language, "Yildizlanan coverage listesi", "Starred coverage names"),
      label: copy(language, "Watch", "Watch"),
      value: String(watchlist.size),
    },
  ];

  const sidebar =
    mode === "detail" && currentReport ? (
      <div className="space-y-4">
        <Card className="gap-4" interactive={false}>
          <CardHeader className="gap-2">
            <CardTitle className="text-base">
              {copy(language, "Surum seridi", "Version strip")}
            </CardTitle>
            <CardDescription>
              {copy(
                language,
                "Ayni ticker icindeki coverage raporlari.",
                "Coverage versions within the same ticker."
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {currentGroup.map(report => (
              <button
                key={report.id}
                type="button"
                onClick={() => {
                  setSelectedVersionIdState(report.id);
                  setLocation(buildVersionHref(report.ticker, report.id));
                }}
                className={cn(
                  "w-full rounded-xl border px-3 py-3 text-left transition-colors",
                  currentReport.id === report.id
                    ? "border-sky-500/35 bg-sky-500/10"
                    : "border-border bg-background/35 hover:border-sky-500/20 hover:bg-background/55"
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-foreground">
                    {formatDate(report.reportDate, language)}
                  </span>
                  <Badge
                    variant="outline"
                    className={signalBadgeClass(report.signal)}
                  >
                    {report.signal || "Coverage"}
                  </Badge>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {report.summary || report.title}
                </p>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className="gap-4" interactive={false}>
          <CardHeader className="gap-2">
            <CardTitle className="text-base">TOC</CardTitle>
            <CardDescription>
              {copy(language, "Bolumler arasi hizli gecis", "Jump across sections")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {currentReport.sections.map(section => (
              <button
                key={section.id}
                type="button"
                onClick={() =>
                  document.getElementById(section.id)?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  })
                }
                className="flex w-full items-center justify-between rounded-xl border border-border bg-background/30 px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:border-sky-500/20 hover:text-foreground"
              >
                <span>{section.title}</span>
                <span className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground/80">
                  H{section.level}
                </span>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    ) : undefined;

  const navigateToTicker = (report: CoverageReport) => {
    setSelectedVersionIdState(report.id);
    setLocation(buildVersionHref(report.ticker, report.id));
  };

  const toggleWatch = (targetTicker: string) => {
    setWatchlist(previous => {
      const next = new Set(previous);
      if (next.has(targetTicker)) {
        next.delete(targetTicker);
      } else {
        next.add(targetTicker);
      }
      return next;
    });
  };

  const handleChecklistChange = (key: string, checked: boolean) => {
    setChecklistState(previous => ({
      ...previous,
      [key]: checked,
    }));
  };

  return (
    <FlowLayout
      language={language}
      eyebrow={copy(language, "Coverage Workspace", "Coverage Workspace")}
      title={copy(
        language,
        "Versionlu coverage kutuphanesi",
        "Versioned coverage library"
      )}
      description={copy(
        language,
        "Markdown coverage notlarini kutuphanede topla, ayni ticker icinde surumleri karsilastir ve earnings takvimini tek ekranda izle.",
        "Collect markdown coverage notes in one library, compare versions inside each ticker and watch the earnings calendar from the same screen."
      )}
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={mode === "index" ? "default" : "outline"}
            onClick={() => setLocation("/coverage")}
          >
            <BookOpen className="size-4" />
            {copy(language, "Kutuphane", "Library")}
          </Button>
          <Button
            variant={mode === "calendar" ? "default" : "outline"}
            onClick={() => setLocation("/coverage/calendar")}
          >
            <CalendarDays className="size-4" />
            {copy(language, "Takvim", "Calendar")}
          </Button>
        </div>
      }
      sidebar={sidebar}
    >
      {recordsLoading ? (
        <LoadingState
          label={copy(language, "Yukleniyor...", "Loading...")}
          description={copy(
            language,
            "Coverage raporlari yukleniyor.",
            "Loading coverage reports."
          )}
        />
      ) : recordsError ? (
        <Card className="gap-4 border-amber-500/30" interactive={false}>
          <CardHeader className="gap-2">
            <CardTitle>{copy(language, "Uyari", "Warning")}</CardTitle>
            <CardDescription>{recordsError}</CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      <section className="grid gap-4 md:grid-cols-3">
        {stats.map(stat => (
          <Card key={stat.label} className="gap-4" interactive={false}>
            <CardHeader className="gap-2">
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="text-3xl">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-sm text-muted-foreground">
              {stat.detail}
            </CardContent>
          </Card>
        ))}
      </section>

      <Card className="gap-4" interactive={false}>
        <CardHeader className="gap-2">
          <CardTitle>
            {copy(language, "Yonetilen kutuphane", "Managed library")}
          </CardTitle>
          <CardDescription>
            {copy(
              language,
              "Coverage arsivi bu yuzeyden duzenlenmez. Yeni rapor ve surumler yalnizca admin yayin akisi uzerinden eklenir.",
              "The coverage archive is not editable from this surface. New reports and versions are published only through the admin workflow."
            )}
          </CardDescription>
        </CardHeader>
      </Card>

      {mode === "index" ? (
        <>
          <Card className="gap-4" interactive={false}>
            <CardHeader className="gap-2 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <CardTitle>
                  {copy(language, "Coverage index", "Coverage index")}
                </CardTitle>
                <CardDescription>
                  {copy(
                    language,
                    "Ticker, sirket veya signal ile filtrele.",
                    "Filter by ticker, company or signal."
                  )}
                </CardDescription>
              </div>
              <div className="relative w-full max-w-md">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={event => setSearch(event.target.value)}
                  placeholder={copy(
                    language,
                    "CRWV, NBIS, bullish...",
                    "CRWV, NBIS, bullish..."
                  )}
                  className="pl-10"
                />
              </div>
            </CardHeader>
          </Card>

          <div className="grid gap-4 lg:grid-cols-2">
            {filteredGroups.map(group => (
              <Card
                key={group.ticker}
                className="gap-4 border-border/80"
                interactive={false}
              >
                <CardHeader className="gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-2xl">{group.ticker}</CardTitle>
                        <Badge
                          variant="outline"
                          className={signalBadgeClass(group.latest.signal)}
                        >
                          {group.latest.signal || "Coverage"}
                        </Badge>
                      </div>
                      <CardDescription className="mt-2">
                        {group.latest.company}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => toggleWatch(group.ticker)}
                      aria-label={copy(
                        language,
                        "Watchlist'e ekle",
                        "Toggle watchlist"
                      )}
                    >
                      <Star
                        className={cn(
                          "size-4",
                          watchlist.has(group.ticker)
                            ? "fill-amber-300 text-amber-300"
                            : "text-muted-foreground"
                        )}
                      />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <p className="text-sm leading-7 text-muted-foreground">
                    {group.latest.summary}
                  </p>

                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    <div className="rounded-xl border border-border bg-background/35 px-3 py-3">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                        {copy(language, "Rapor", "Report")}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-foreground">
                        {formatDate(group.latest.reportDate, language)}
                      </p>
                    </div>
                    <div className="rounded-xl border border-border bg-background/35 px-3 py-3">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                        Price
                      </p>
                      <p className="mt-1 text-sm font-semibold text-foreground">
                        {formatUsd(group.latest.metrics.price)}
                      </p>
                    </div>
                    <div className="rounded-xl border border-border bg-background/35 px-3 py-3">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                        IV
                      </p>
                      <p className="mt-1 text-sm font-semibold text-foreground">
                        {formatPercent(group.latest.metrics.iv)}
                      </p>
                    </div>
                    <div className="rounded-xl border border-border bg-background/35 px-3 py-3">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                        Versions
                      </p>
                      <p className="mt-1 text-sm font-semibold text-foreground">
                        {group.reports.length}
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="justify-between border-t border-border pt-6">
                  <div className="text-xs text-muted-foreground">
                    {group.latest.metrics.earningsDate
                      ? `${copy(language, "Earnings", "Earnings")}: ${formatDate(group.latest.metrics.earningsDate, language)}`
                      : group.latest.exchange || "NASDAQ"}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => navigateToTicker(group.latest)}
                  >
                    {copy(language, "Detayi ac", "Open detail")}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </>
      ) : null}

      {mode === "calendar" ? (
        <div className="space-y-4">
          {calendarItems.map(report => (
            <Card key={report.id} className="gap-4" interactive={false}>
              <CardHeader className="gap-3 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-2xl">{report.ticker}</CardTitle>
                    <Badge
                      variant="outline"
                      className={signalBadgeClass(report.signal)}
                    >
                      {report.signal || "Coverage"}
                    </Badge>
                  </div>
                  <CardDescription>{report.company}</CardDescription>
                </div>
                <div className="rounded-xl border border-border bg-background/35 px-4 py-3 text-right">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                    {copy(language, "Ana tarih", "Anchor date")}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {formatDate(
                      report.metrics.earningsDate || report.reportDate,
                      language
                    )}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-3">
                  <p className="text-sm leading-7 text-muted-foreground">
                    {report.summary}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="outline"
                      className="border-border bg-background/35"
                    >
                      <Clock3 className="size-3" />
                      {copy(language, "Rapor", "Report")}:{" "}
                      {formatDate(report.reportDate, language)}
                    </Badge>
                    {report.metrics.optionExpiry ? (
                      <Badge
                        variant="outline"
                        className="border-border bg-background/35"
                      >
                        <CalendarDays className="size-3" />
                        {copy(language, "Vade", "Expiry")}:{" "}
                        {formatDate(report.metrics.optionExpiry, language)}
                      </Badge>
                    ) : null}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-border bg-background/35 px-3 py-3">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                      Price
                    </p>
                    <p className="mt-1 text-sm font-semibold text-foreground">
                      {formatUsd(report.metrics.price)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border bg-background/35 px-3 py-3">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                      Budget
                    </p>
                    <p className="mt-1 text-sm font-semibold text-foreground">
                      {formatUsd(report.metrics.budget)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border bg-background/35 px-3 py-3">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                      IV
                    </p>
                    <p className="mt-1 text-sm font-semibold text-foreground">
                      {formatPercent(report.metrics.iv)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border bg-background/35 px-3 py-3">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                      RSI
                    </p>
                    <p className="mt-1 text-sm font-semibold text-foreground">
                      {formatPlainNumber(report.metrics.rsi)}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-end border-t border-border pt-6">
                <Button variant="outline" onClick={() => navigateToTicker(report)}>
                  {copy(language, "Ticker sayfasina git", "Open ticker page")}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : null}

      {mode === "detail" ? (
        currentReport ? (
          <div className="space-y-4">
            <Card className="gap-4 overflow-hidden" interactive={false}>
              <CardHeader className="gap-4 border-b border-border pb-6">
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setLocation("/coverage")}
                  >
                    <ArrowLeft className="size-4" />
                    {copy(language, "Kutuphaneye don", "Back to library")}
                  </Button>
                  <Badge
                    variant="outline"
                    className={signalBadgeClass(currentReport.signal)}
                  >
                    {currentReport.signal || "Coverage"}
                  </Badge>
                  {currentReport.exchange ? (
                    <Badge
                      variant="outline"
                      className="border-border bg-background/45"
                    >
                      {currentReport.exchange}
                    </Badge>
                  ) : null}
                  {currentReport.sector ? (
                    <Badge
                      variant="outline"
                      className="border-border bg-background/45"
                    >
                      {currentReport.sector}
                    </Badge>
                  ) : null}
                </div>
                <div className="space-y-3">
                  <CardTitle className="text-3xl md:text-4xl">
                    {currentReport.title}
                  </CardTitle>
                  <CardDescription className="max-w-4xl text-sm leading-7 md:text-[15px]">
                    {currentReport.summary}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="grid gap-4 pt-0 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-xl border border-border bg-background/35 px-4 py-4">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                    {copy(language, "Rapor tarihi", "Report date")}
                  </p>
                  <p className="mt-1 text-base font-semibold text-foreground">
                    {formatDate(currentReport.reportDate, language)}
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-background/35 px-4 py-4">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                    Price
                  </p>
                  <p className="mt-1 text-base font-semibold text-foreground">
                    {formatUsd(currentReport.metrics.price)}
                  </p>
                  <p
                    className={cn(
                      "mt-2 text-xs font-medium",
                      metricTone(currentReport.metrics.changePct)
                    )}
                  >
                    {formatPercent(currentReport.metrics.changePct)}
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-background/35 px-4 py-4">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                    {copy(language, "Earnings", "Earnings")}
                  </p>
                  <p className="mt-1 text-base font-semibold text-foreground">
                    {formatDate(currentReport.metrics.earningsDate, language)}
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-background/35 px-4 py-4">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                    {copy(language, "Opsiyon vadesi", "Option expiry")}
                  </p>
                  <p className="mt-1 text-base font-semibold text-foreground">
                    {formatDate(currentReport.metrics.optionExpiry, language)}
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-background/35 px-4 py-4">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                    IV
                  </p>
                  <p className="mt-1 text-base font-semibold text-foreground">
                    {formatPercent(currentReport.metrics.iv)}
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-background/35 px-4 py-4">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                    RSI
                  </p>
                  <p className="mt-1 text-base font-semibold text-foreground">
                    {formatPlainNumber(currentReport.metrics.rsi)}
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-background/35 px-4 py-4">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                    {copy(language, "Short float", "Short float")}
                  </p>
                  <p className="mt-1 text-base font-semibold text-foreground">
                    {formatPercent(currentReport.metrics.shortFloat)}
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-background/35 px-4 py-4">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                    {copy(language, "Butce", "Budget")}
                  </p>
                  <p className="mt-1 text-base font-semibold text-foreground">
                    {formatUsd(currentReport.metrics.budget)}
                  </p>
                </div>
              </CardContent>
            </Card>

            {diffSummary ? (
              <Card className="gap-4" interactive={false}>
                <CardHeader className="gap-2">
                  <div className="flex items-center gap-2">
                    <GitCompareArrows className="size-4 text-sky-300" />
                    <CardTitle>
                      {copy(language, "Version diff", "Version diff")}
                    </CardTitle>
                  </div>
                  <CardDescription>
                    {previousReport
                      ? copy(
                          language,
                          "Secili surum bir onceki raporla karsilastirildi.",
                          "The selected version is compared against the previous report."
                        )
                      : copy(
                          language,
                          "Bu ticker icin su an sadece tek surum var.",
                          "There is only one version for this ticker right now."
                        )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
                  <div className="rounded-xl border border-border bg-background/35 px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      {copy(language, "Degisen metrikler", "Changed metrics")}
                    </p>
                    <div className="mt-4 space-y-3">
                      {diffSummary.changedMetrics.length > 0 ? (
                        diffSummary.changedMetrics.map(item => (
                          <div
                            key={item.label}
                            className="flex items-center justify-between gap-3 rounded-xl border border-border/80 bg-background/45 px-3 py-3"
                          >
                            <span className="text-sm text-muted-foreground">
                              {item.label}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {item.previous} {"->"}{" "}
                              <strong className="text-foreground">
                                {item.next}
                              </strong>
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          {copy(language, "Metrik farki yok.", "No metric delta.")}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="rounded-xl border border-border bg-background/35 px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      {copy(language, "Degisen bolumler", "Changed sections")}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {diffSummary.changedSections.length > 0 ? (
                        diffSummary.changedSections.map(sectionTitle => (
                          <Badge
                            key={sectionTitle}
                            variant="outline"
                            className="border-amber-500/30 bg-amber-500/10 text-amber-100"
                          >
                            {sectionTitle}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          {copy(
                            language,
                            "Yeni bolum farki yok.",
                            "No section-level delta."
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : null}

            {currentReport.sections.map(section => (
              <Card
                key={section.id}
                id={section.id}
                className="gap-4 scroll-mt-28"
                interactive={false}
              >
                <CardHeader className="gap-2 border-b border-border pb-6">
                  <Badge
                    variant="outline"
                    className="w-fit border-border bg-background/35"
                  >
                    H{section.level}
                  </Badge>
                  <CardTitle className="text-2xl">{section.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CoverageBlocks
                    blockPrefix={section.id}
                    blocks={section.blocks}
                    checklistState={checklistState}
                    onChecklistChange={handleChecklistChange}
                    reportId={currentReport.id}
                    sectionId={section.id}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="gap-4" interactive={false}>
            <CardHeader className="gap-2">
              <CardTitle>
                {copy(language, "Coverage bulunamadi", "Coverage not found")}
              </CardTitle>
              <CardDescription>
                {copy(
                  language,
                  "Bu ticker icin kutuphanede rapor yok. Index'e donup yeni markdown import et.",
                  "No report exists for this ticker. Return to the index and import a new markdown file."
                )}
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => setLocation("/coverage")}>
                {copy(language, "Kutuphane", "Open library")}
              </Button>
            </CardFooter>
          </Card>
        )
      ) : null}
    </FlowLayout>
  );
}
