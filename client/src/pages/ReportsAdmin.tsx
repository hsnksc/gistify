import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ChartCandlestick,
  FileText,
  FileSpreadsheet,
  Radar,
  RefreshCw,
  Shield,
  Sparkles,
} from "lucide-react";
import type {
  DailyReportRecord,
  DailyReportSourcePackage,
} from "@shared/dailyReports";
import type { MomentumReportRecord } from "@shared/momentumReports";
import type { WeeklyReportRecord } from "@shared/weeklyReports";
import DailyReportAdminPanel from "@/components/reports/DailyReportAdminPanel";
import MomentumReportAdminPanel from "@/components/reports/MomentumReportAdminPanel";
import WeeklyReportAdminPanel from "@/components/reports/WeeklyReportAdminPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  REPORT_ADMIN_SECRET_STORAGE_KEY,
  createEmptyEntry,
  createNextWeeklyReportDraft,
  deepCloneReport,
  formatWeekRange,
  sortReportsNewestFirst,
} from "@/lib/weeklyReports";
import { createEmptyMomentumReportDraft } from "@/lib/momentumReports";
import {
  createDailyReportDraftFromSource,
  sortDailyReportsNewestFirst,
} from "@/lib/dailyReports";
import { useLocation } from "wouter";

type WorkspaceKey = "earnings" | "momentum" | "daily";

interface WeeklyReportsApiResponse {
  reports?: WeeklyReportRecord[];
  admin?: {
    authorized?: boolean;
    email?: string;
  };
}

interface MomentumReportsApiResponse {
  reports?: MomentumReportRecord[];
  latestPublished?: MomentumReportRecord | null;
}

interface DailyReportsApiResponse {
  reports?: DailyReportRecord[];
  latestPublished?: DailyReportRecord | null;
}

interface DailyReportSourcesApiResponse {
  sources?: DailyReportSourcePackage[];
  source?: DailyReportSourcePackage | null;
}

interface WeeklyReportSuggestion {
  report: WeeklyReportRecord;
  source: "seed" | "carry_forward" | "fmp_live";
  alreadyExists: boolean;
}

interface AdminMarketDataStatus {
  providers: {
    earningsImport: {
      provider: string;
      configured: boolean;
      mode: string;
    };
    optionsData: {
      provider: string;
      configured: boolean;
      mode: string;
      note?: string;
    };
    momentumData: {
      provider: string;
      configured: boolean;
      mode: string;
      fallbackKeys: {
        massive: boolean;
        twelvedata: boolean;
        alphavantage: boolean;
      };
    };
  };
  env: {
    fmpConfigured: boolean;
  };
}

function readStoredAdminSecret() {
  if (typeof window === "undefined") {
    return "";
  }

  try {
    return window.localStorage.getItem(REPORT_ADMIN_SECRET_STORAGE_KEY) || "";
  } catch {
    return "";
  }
}

function writeStoredAdminSecret(value: string) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    if (!value.trim()) {
      window.localStorage.removeItem(REPORT_ADMIN_SECRET_STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(REPORT_ADMIN_SECRET_STORAGE_KEY, value);
  } catch {
    // Ignore storage failures.
  }
}

function formatIsoDate(value?: string) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function sortMomentumReportsNewestFirst(reports: MomentumReportRecord[]) {
  return [...reports].sort((left, right) => {
    const byDate = right.reportDate.localeCompare(left.reportDate);
    if (byDate !== 0) {
      return byDate;
    }

    return right.updatedAt.localeCompare(left.updatedAt);
  });
}

function SectionCard({
  title,
  description,
  value,
}: {
  title: string;
  description: string;
  value: string;
}) {
  return (
    <div className="rounded-[2rem] border border-border bg-card/85 p-5 shadow-xl">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {title}
      </p>
      <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function ProviderCard({
  title,
  mode,
  provider,
  configured,
  note,
}: {
  title: string;
  mode: string;
  provider: string;
  configured: boolean;
  note?: string;
}) {
  return (
    <article className="rounded-[2rem] border border-border bg-card/90 p-5 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <span
          className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${
            configured
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
              : "border-amber-500/30 bg-amber-500/10 text-amber-300"
          }`}
        >
          {mode}
        </span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">Provider: {provider}</p>
      {note ? (
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {note}
        </p>
      ) : null}
    </article>
  );
}

export default function ReportsAdmin() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [selectedWorkspace, setSelectedWorkspace] =
    useState<WorkspaceKey>("earnings");
  const [adminEmail, setAdminEmail] = useState("hsnksc@gmail.com");
  const [adminAuthorized, setAdminAuthorized] = useState(false);
  const [adminSecret, setAdminSecret] = useState(() => readStoredAdminSecret());
  const [adminBusy, setAdminBusy] = useState(false);
  const [adminError, setAdminError] = useState("");
  const [workspaceStatus, setWorkspaceStatus] =
    useState<AdminMarketDataStatus | null>(null);

  const [reports, setReports] = useState<WeeklyReportRecord[]>([]);
  const [suggestions, setSuggestions] = useState<WeeklyReportSuggestion[]>([]);
  const [suggestionMode, setSuggestionMode] = useState<"live" | "fallback">(
    "fallback"
  );
  const [selectedReportId, setSelectedReportId] = useState("");
  const [draftReport, setDraftReport] = useState<WeeklyReportRecord | null>(null);

  const [momentumReports, setMomentumReports] = useState<MomentumReportRecord[]>([]);
  const [latestPublishedMomentum, setLatestPublishedMomentum] =
    useState<MomentumReportRecord | null>(null);
  const [selectedMomentumReportId, setSelectedMomentumReportId] = useState("");
  const [draftMomentumReport, setDraftMomentumReport] =
    useState<MomentumReportRecord | null>(null);
  const [dailySourcePackages, setDailySourcePackages] = useState<
    DailyReportSourcePackage[]
  >([]);
  const [selectedDailySourceId, setSelectedDailySourceId] = useState("");
  const [selectedDailySource, setSelectedDailySource] =
    useState<DailyReportSourcePackage | null>(null);
  const [dailyReports, setDailyReports] = useState<DailyReportRecord[]>([]);
  const [latestPublishedDaily, setLatestPublishedDaily] =
    useState<DailyReportRecord | null>(null);
  const [selectedDailyReportId, setSelectedDailyReportId] = useState("");
  const [draftDailyReport, setDraftDailyReport] =
    useState<DailyReportRecord | null>(null);

  const buildAdminHeaders = useCallback(
    (secretOverride?: string): Record<string, string> => {
      const secret = (secretOverride ?? adminSecret).trim();
      return secret ? { "x-gistify-admin-secret": secret } : {};
    },
    [adminSecret]
  );

  const syncWeeklyDraft = useCallback(
    (nextReports: WeeklyReportRecord[], preferredId?: string) => {
      const target =
        nextReports.find(report => report.id === preferredId) || nextReports[0] || null;
      setSelectedReportId(target?.id || "");
      setDraftReport(target ? deepCloneReport(target) : null);
    },
    []
  );

  const syncMomentumDraft = useCallback(
    (nextReports: MomentumReportRecord[], preferredId?: string) => {
      const target =
        nextReports.find(report => report.id === preferredId) || nextReports[0] || null;
      setSelectedMomentumReportId(target?.id || "");
      setDraftMomentumReport(target ? JSON.parse(JSON.stringify(target)) : null);
    },
    []
  );

  const syncDailyDraft = useCallback(
    (nextReports: DailyReportRecord[], preferredId?: string) => {
      const target =
        nextReports.find(report => report.id === preferredId) || nextReports[0] || null;
      setSelectedDailyReportId(target?.id || "");
      setDraftDailyReport(target ? JSON.parse(JSON.stringify(target)) : null);
    },
    []
  );

  const loadViewerMeta = useCallback(
    async (secretOverride?: string) => {
      const response = await fetch("/api/reports/weekly", {
        credentials: "include",
        cache: "no-store",
        headers: buildAdminHeaders(secretOverride),
      });

      if (!response.ok) {
        throw new Error("Admin meta yuklenemedi.");
      }

      const payload = (await response.json()) as WeeklyReportsApiResponse;
      setAdminEmail(payload.admin?.email || "hsnksc@gmail.com");
      setAdminAuthorized(Boolean(payload.admin?.authorized));
      return payload;
    },
    [buildAdminHeaders]
  );

  const loadWorkspaceStatus = useCallback(
    async (secretOverride?: string) => {
      const response = await fetch("/api/admin/workspace/status", {
        credentials: "include",
        cache: "no-store",
        headers: buildAdminHeaders(secretOverride),
      });

      if (!response.ok) {
        throw new Error("Workspace provider durumlari yuklenemedi.");
      }

      const payload = (await response.json()) as AdminMarketDataStatus;
      setWorkspaceStatus(payload);
    },
    [buildAdminHeaders]
  );

  const loadAdminReports = useCallback(
    async (secretOverride?: string, preferredId?: string) => {
      const response = await fetch("/api/admin/reports/weekly", {
        credentials: "include",
        cache: "no-store",
        headers: buildAdminHeaders(secretOverride),
      });

      if (!response.ok) {
        throw new Error("Earnings raporlari yuklenemedi.");
      }

      const payload = (await response.json()) as WeeklyReportsApiResponse;
      const nextReports = sortReportsNewestFirst(payload.reports || []);
      setReports(nextReports);
      setAdminAuthorized(true);
      syncWeeklyDraft(nextReports, preferredId);
    },
    [buildAdminHeaders, syncWeeklyDraft]
  );

  const loadSuggestions = useCallback(
    async (secretOverride?: string) => {
      const response = await fetch("/api/admin/reports/weekly/suggestions", {
        credentials: "include",
        cache: "no-store",
        headers: buildAdminHeaders(secretOverride),
      });

      if (!response.ok) {
        throw new Error("Canli earnings onerileri yuklenemedi.");
      }

      const payload = (await response.json()) as {
        suggestions?: WeeklyReportSuggestion[];
        mode?: "live" | "fallback";
      };
      setSuggestions(payload.suggestions || []);
      setSuggestionMode(payload.mode || "fallback");
    },
    [buildAdminHeaders]
  );

  const loadMomentumReports = useCallback(
    async (secretOverride?: string, preferredId?: string) => {
      const response = await fetch("/api/admin/momentum/reports", {
        credentials: "include",
        cache: "no-store",
        headers: buildAdminHeaders(secretOverride),
      });

      if (!response.ok) {
        throw new Error("Momentum raporlari yuklenemedi.");
      }

      const payload = (await response.json()) as MomentumReportsApiResponse;
      const nextReports = sortMomentumReportsNewestFirst(payload.reports || []);
      setMomentumReports(nextReports);
      setLatestPublishedMomentum(payload.latestPublished || null);
      syncMomentumDraft(nextReports, preferredId);
    },
    [buildAdminHeaders, syncMomentumDraft]
  );

  const loadDailyReportSources = useCallback(
    async (secretOverride?: string) => {
      const response = await fetch("/api/admin/daily-report-sources", {
        credentials: "include",
        cache: "no-store",
        headers: buildAdminHeaders(secretOverride),
      });

      if (!response.ok) {
        throw new Error("Daily report source paketleri yuklenemedi.");
      }

      const payload = (await response.json()) as DailyReportSourcesApiResponse;
      const nextSources = [...(payload.sources || [])].sort((left, right) =>
        right.reportDate.localeCompare(left.reportDate)
      );
      setDailySourcePackages(nextSources);
      setSelectedDailySourceId(current =>
        current && nextSources.some(source => source.id === current)
          ? current
          : nextSources[0]?.id || ""
      );
    },
    [buildAdminHeaders]
  );

  const loadDailyReportSourceDetail = useCallback(
    async (sourceId: string, secretOverride?: string) => {
      if (!sourceId) {
        setSelectedDailySource(null);
        return;
      }

      const response = await fetch(
        `/api/admin/daily-report-sources/${encodeURIComponent(sourceId)}`,
        {
          credentials: "include",
          cache: "no-store",
          headers: buildAdminHeaders(secretOverride),
        }
      );

      if (!response.ok) {
        throw new Error("Daily report source detayi yuklenemedi.");
      }

      const payload = (await response.json()) as DailyReportSourcesApiResponse;
      setSelectedDailySource(payload.source || null);
    },
    [buildAdminHeaders]
  );

  const loadDailyReports = useCallback(
    async (secretOverride?: string, preferredId?: string) => {
      const response = await fetch("/api/admin/daily-reports", {
        credentials: "include",
        cache: "no-store",
        headers: buildAdminHeaders(secretOverride),
      });

      if (!response.ok) {
        throw new Error("Daily report kayitlari yuklenemedi.");
      }

      const payload = (await response.json()) as DailyReportsApiResponse;
      const nextReports = sortDailyReportsNewestFirst(payload.reports || []);
      setDailyReports(nextReports);
      setLatestPublishedDaily(payload.latestPublished || null);
      syncDailyDraft(nextReports, preferredId);
    },
    [buildAdminHeaders, syncDailyDraft]
  );

  const loadAuthorizedWorkspace = useCallback(
    async (
      secretOverride?: string,
      preferredWeeklyId?: string,
      preferredMomentumId?: string,
      preferredDailyId?: string
    ) => {
      await Promise.all([
        loadWorkspaceStatus(secretOverride),
        loadAdminReports(secretOverride, preferredWeeklyId),
        loadSuggestions(secretOverride),
        loadMomentumReports(secretOverride, preferredMomentumId),
        loadDailyReportSources(secretOverride),
        loadDailyReports(secretOverride, preferredDailyId),
      ]);
    },
    [
      loadAdminReports,
      loadDailyReportSources,
      loadDailyReports,
      loadMomentumReports,
      loadSuggestions,
      loadWorkspaceStatus,
    ]
  );

  const refreshPage = useCallback(
    async (
      secretOverride = "",
      preferredWeeklyId?: string,
      preferredMomentumId?: string,
      preferredDailyId?: string
    ) => {
      setLoading(true);
      setPageError("");

      try {
        const payload = await loadViewerMeta(secretOverride);
        const shouldTryAdmin = Boolean(
          payload.admin?.authorized || secretOverride.trim()
        );

        if (shouldTryAdmin) {
          try {
            await loadAuthorizedWorkspace(
              secretOverride,
              preferredWeeklyId,
              preferredMomentumId,
              preferredDailyId
            );
          } catch (error) {
            setAdminAuthorized(false);
            setAdminError(
              error instanceof Error
                ? error.message
                : "Admin workspace yuklenemedi."
            );
            if (secretOverride.trim()) {
              writeStoredAdminSecret("");
              setAdminSecret("");
            }
          }
        }
      } catch (error) {
        setPageError(
          error instanceof Error ? error.message : "Admin sayfasi acilamadi."
        );
      } finally {
        setLoading(false);
      }
    },
    [loadAuthorizedWorkspace, loadViewerMeta]
  );

  useEffect(() => {
    void refreshPage(readStoredAdminSecret());
  }, [refreshPage]);

  useEffect(() => {
    if (!adminAuthorized || !selectedDailySourceId) {
      if (!selectedDailySourceId) {
        setSelectedDailySource(null);
      }
      return;
    }

    void loadDailyReportSourceDetail(selectedDailySourceId, adminSecret);
  }, [
    adminAuthorized,
    adminSecret,
    loadDailyReportSourceDetail,
    selectedDailySourceId,
  ]);

  const handleUnlock = async () => {
    setAdminBusy(true);
    setAdminError("");

    try {
      const payload = await loadViewerMeta(adminSecret);
      const isAuthorized = Boolean(payload.admin?.authorized || adminSecret.trim());

      if (!isAuthorized) {
        throw new Error("Admin kilidi acilamadi.");
      }

      await loadAuthorizedWorkspace(
        adminSecret,
        selectedReportId,
        selectedMomentumReportId,
        selectedDailyReportId
      );
      writeStoredAdminSecret(adminSecret);
      setAdminAuthorized(true);
    } catch (error) {
      writeStoredAdminSecret("");
      setAdminAuthorized(false);
      setAdminError(
        error instanceof Error ? error.message : "Admin kilidi acilamadi."
      );
    } finally {
      setAdminBusy(false);
    }
  };

  const handleLock = () => {
    writeStoredAdminSecret("");
    setAdminSecret("");
    setAdminAuthorized(false);
    setAdminError("");
    setWorkspaceStatus(null);
    setReports([]);
    setSuggestions([]);
    setSelectedReportId("");
    setDraftReport(null);
    setMomentumReports([]);
    setLatestPublishedMomentum(null);
    setSelectedMomentumReportId("");
    setDraftMomentumReport(null);
    setDailySourcePackages([]);
    setSelectedDailySourceId("");
    setSelectedDailySource(null);
    setDailyReports([]);
    setLatestPublishedDaily(null);
    setSelectedDailyReportId("");
    setDraftDailyReport(null);
  };

  const handleSelectReport = (reportId: string) => {
    setSelectedReportId(reportId);
    const next = reports.find(report => report.id === reportId) || null;
    setDraftReport(next ? deepCloneReport(next) : null);
  };

  const handleSelectMomentumReport = (reportId: string) => {
    setSelectedMomentumReportId(reportId);
    const next = momentumReports.find(report => report.id === reportId) || null;
    setDraftMomentumReport(next ? JSON.parse(JSON.stringify(next)) : null);
  };

  const handleCreateNextWeek = () => {
    const nextDraft = createNextWeeklyReportDraft(draftReport || reports[0]);
    setDraftReport(nextDraft);
    setSelectedReportId(nextDraft.id);
    setReports(current => sortReportsNewestFirst([nextDraft, ...current]));
  };

  const handleCreateMomentumDraft = () => {
    const nextDraft = createEmptyMomentumReportDraft(adminEmail);
    setDraftMomentumReport(nextDraft);
    setSelectedMomentumReportId(nextDraft.id);
    setMomentumReports(current =>
      sortMomentumReportsNewestFirst([
        nextDraft,
        ...current.filter(report => report.id !== nextDraft.id),
      ])
    );
  };

  const handleSelectDailyReport = (reportId: string) => {
    setSelectedDailyReportId(reportId);
    const next = dailyReports.find(report => report.id === reportId) || null;
    setDraftDailyReport(next ? JSON.parse(JSON.stringify(next)) : null);
  };

  const handleCreateDailyDraftFromSource = () => {
    if (!selectedDailySource) {
      return;
    }

    const existing =
      dailyReports.find(report => report.sourceFolder === selectedDailySource.folderName) ||
      null;
    const nextDraft = createDailyReportDraftFromSource(
      selectedDailySource,
      adminEmail,
      existing
    );
    setDraftDailyReport(nextDraft);
    setSelectedDailyReportId(nextDraft.id);
    setDailyReports(current =>
      sortDailyReportsNewestFirst([
        nextDraft,
        ...current.filter(report => report.id !== nextDraft.id),
      ])
    );
  };

  const handleAddEntry = () => {
    if (!draftReport) {
      return;
    }

    const nextEntry = createEmptyEntry(draftReport.content.entries.length);
    setDraftReport({
      ...draftReport,
      content: {
        ...draftReport.content,
        entries: [...draftReport.content.entries, nextEntry],
      },
    });
  };

  const handleRemoveEntry = (entryId: string) => {
    if (!draftReport) {
      return;
    }

    setDraftReport({
      ...draftReport,
      content: {
        ...draftReport.content,
        entries: draftReport.content.entries.filter(entry => entry.id !== entryId),
      },
    });
  };

  const persistWeeklyReport = async (
    status: WeeklyReportRecord["status"],
    sourceReport = draftReport
  ) => {
    if (!sourceReport) {
      return;
    }

    setAdminBusy(true);
    setAdminError("");

    try {
      const reportToSave: WeeklyReportRecord = {
        ...sourceReport,
        status,
        publishedAt:
          status === "published"
            ? sourceReport.publishedAt || new Date().toISOString()
            : undefined,
      };

      const response = await fetch("/api/admin/reports/weekly", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...buildAdminHeaders(),
        },
        body: JSON.stringify({ report: reportToSave }),
      });

      if (!response.ok) {
        throw new Error("Earnings raporu kaydedilemedi.");
      }

      const payload = (await response.json()) as WeeklyReportsApiResponse & {
        report?: WeeklyReportRecord;
      };
      const nextReports = sortReportsNewestFirst(payload.reports || []);
      const savedReport = payload.report || reportToSave;
      setReports(nextReports);
      setSelectedReportId(savedReport.id);
      setDraftReport(deepCloneReport(savedReport));
      await loadSuggestions(adminSecret);
    } catch (error) {
      setAdminError(
        error instanceof Error
          ? error.message
          : "Earnings raporu kaydedilemedi."
      );
    } finally {
      setAdminBusy(false);
    }
  };

  const persistMomentumReport = async (
    status: MomentumReportRecord["status"],
    sourceReport = draftMomentumReport
  ) => {
    if (!sourceReport) {
      return;
    }

    setAdminBusy(true);
    setAdminError("");

    try {
      const reportToSave: MomentumReportRecord = {
        ...sourceReport,
        status,
        publishedAt:
          status === "published"
            ? sourceReport.publishedAt || new Date().toISOString()
            : undefined,
      };

      const response = await fetch("/api/admin/momentum/reports", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...buildAdminHeaders(),
        },
        body: JSON.stringify({ report: reportToSave }),
      });

      if (!response.ok) {
        throw new Error("Momentum raporu kaydedilemedi.");
      }

      const payload = (await response.json()) as MomentumReportsApiResponse & {
        report?: MomentumReportRecord;
      };
      const nextReports = sortMomentumReportsNewestFirst(payload.reports || []);
      const savedReport = payload.report || reportToSave;
      setMomentumReports(nextReports);
      setLatestPublishedMomentum(payload.latestPublished || null);
      setSelectedMomentumReportId(savedReport.id);
      setDraftMomentumReport(JSON.parse(JSON.stringify(savedReport)));
    } catch (error) {
      setAdminError(
        error instanceof Error
          ? error.message
          : "Momentum raporu kaydedilemedi."
      );
    } finally {
      setAdminBusy(false);
    }
  };

  const persistDailyReport = async (
    status: DailyReportRecord["status"],
    sourceReport = draftDailyReport
  ) => {
    if (!sourceReport) {
      return;
    }

    setAdminBusy(true);
    setAdminError("");

    try {
      const reportToSave: DailyReportRecord = {
        ...sourceReport,
        status,
        publishedAt:
          status === "published"
            ? sourceReport.publishedAt || new Date().toISOString()
            : undefined,
      };

      const response = await fetch("/api/admin/daily-reports", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...buildAdminHeaders(),
        },
        body: JSON.stringify({ report: reportToSave }),
      });

      if (!response.ok) {
        throw new Error("Daily report kaydedilemedi.");
      }

      const payload = (await response.json()) as DailyReportsApiResponse & {
        report?: DailyReportRecord;
      };
      const nextReports = sortDailyReportsNewestFirst(payload.reports || []);
      const savedReport = payload.report || reportToSave;
      setDailyReports(nextReports);
      setLatestPublishedDaily(payload.latestPublished || null);
      setSelectedDailyReportId(savedReport.id);
      setDraftDailyReport(JSON.parse(JSON.stringify(savedReport)));
    } catch (error) {
      setAdminError(
        error instanceof Error ? error.message : "Daily report kaydedilemedi."
      );
    } finally {
      setAdminBusy(false);
    }
  };

  const earningsStats = useMemo(() => {
    const published = reports.filter(report => report.status === "published");
    const totalEntries = reports.reduce(
      (sum, report) => sum + report.content.entries.length,
      0
    );

    return {
      totalReports: reports.length,
      publishedReports: published.length,
      totalEntries,
      latestWeek: reports[0] ? formatWeekRange(reports[0]) : "-",
    };
  }, [reports]);

  const momentumStats = useMemo(() => {
    const published = momentumReports.filter(report => report.status === "published");
    const totalEntries = momentumReports.reduce(
      (sum, report) => sum + report.content.featuredEntries.length,
      0
    );

    return {
      totalReports: momentumReports.length,
      publishedReports: published.length,
      totalEntries,
      latestDate: latestPublishedMomentum?.reportDate
        ? formatIsoDate(latestPublishedMomentum.reportDate)
        : "-",
    };
  }, [latestPublishedMomentum, momentumReports]);

  const dailyStats = useMemo(() => {
    const published = dailyReports.filter(report => report.status === "published");

    return {
      totalReports: dailyReports.length,
      publishedReports: published.length,
      sourcePackages: dailySourcePackages.length,
      latestDate: latestPublishedDaily?.reportDate
        ? formatIsoDate(latestPublishedDaily.reportDate)
        : "-",
    };
  }, [dailySourcePackages, dailyReports, latestPublishedDaily]);

  if (loading) {
    return (
      <div className="px-4 py-8">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-border bg-card/95 p-8 shadow-2xl">
          <h1 className="text-2xl font-semibold tracking-tight">
            Admin workspace yukleniyor
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Earnings ve momentum yayinlama araclari hazirlaniyor.
          </p>
        </div>
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="px-4 py-8">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-destructive/30 bg-card/95 p-8 shadow-2xl">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Admin sayfasi acilamadi
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{pageError}</p>
          <Button className="mt-5" onClick={() => void refreshPage(adminSecret)}>
            Tekrar dene
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-[2rem] border border-border bg-card/95 p-6 shadow-2xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-4">
              <Button
                type="button"
                variant="ghost"
                className="px-0 text-muted-foreground"
                onClick={() => setLocation("/app")}
              >
                <ArrowLeft className="size-4" />
                Workspace'e don
              </Button>

              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                <Shield className="size-4" />
                Admin Workspace
              </div>

              <div className="space-y-2">
                <h1 className="text-4xl font-semibold tracking-tight text-foreground">
                  Earnings ve Momentum Yonetimi
                </h1>
                <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
                  Sistem earnings haftalarini ve aday hisseleri bulur, momentum
                  scanner ise yayinlanabilir setup listesini uretir. Admin burada
                  sadece gozden gecirir, ince ayar yapar ve yayina alir.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {(["earnings", "momentum", "daily"] as WorkspaceKey[]).map(workspace => (
                <Button
                  key={workspace}
                  type="button"
                  variant={selectedWorkspace === workspace ? "default" : "outline"}
                  onClick={() => setSelectedWorkspace(workspace)}
                >
                  {workspace === "earnings" ? (
                    <FileSpreadsheet className="size-4" />
                  ) : workspace === "momentum" ? (
                    <Radar className="size-4" />
                  ) : (
                    <FileText className="size-4" />
                  )}
                  {workspace === "earnings"
                    ? "Earnings Workspace"
                    : workspace === "momentum"
                      ? "Momentum Workspace"
                      : "Daily Report"}
                </Button>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          {selectedWorkspace === "earnings" ? (
            <>
              <SectionCard
                title="Toplam rapor"
                value={String(earningsStats.totalReports)}
                description="Kayitli earnings haftalari"
              />
              <SectionCard
                title="Published"
                value={String(earningsStats.publishedReports)}
                description="Canliya alinmis haftalar"
              />
              <SectionCard
                title="Toplam entry"
                value={String(earningsStats.totalEntries)}
                description="Haftalara dagitilan toplam hisse"
              />
              <SectionCard
                title="En yeni hafta"
                value={earningsStats.latestWeek}
                description="Editor acilisinda ustte gorunen hafta"
              />
            </>
          ) : selectedWorkspace === "momentum" ? (
            <>
              <SectionCard
                title="Toplam snapshot"
                value={String(momentumStats.totalReports)}
                description="Kayitli momentum yayinlari"
              />
              <SectionCard
                title="Published"
                value={String(momentumStats.publishedReports)}
                description="Canliya alinmis momentum raporlari"
              />
              <SectionCard
                title="Featured setup"
                value={String(momentumStats.totalEntries)}
                description="Tum snapshot'lardaki toplam yayin setup'i"
              />
              <SectionCard
                title="Son yayin"
                value={momentumStats.latestDate}
                description="Latest published momentum snapshot"
              />
            </>
          ) : (
            <>
              <SectionCard
                title="Toplam daily"
                value={String(dailyStats.totalReports)}
                description="Kayitli daily report yayinlari"
              />
              <SectionCard
                title="Published"
                value={String(dailyStats.publishedReports)}
                description="Canliya alinmis gunluk raporlar"
              />
              <SectionCard
                title="Source package"
                value={String(dailyStats.sourcePackages)}
                description="dailyreport klasorunde hazir paketler"
              />
              <SectionCard
                title="Son yayin"
                value={dailyStats.latestDate}
                description="Latest published daily report"
              />
            </>
          )}
        </section>

        {!adminAuthorized ? (
          <section className="rounded-[2rem] border border-border bg-card/95 p-6 shadow-2xl">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-200">
                  <Shield className="size-4" />
                  Yonetici kilidi kapali
                </div>

                <div className="space-y-2">
                  <h2 className="text-3xl font-semibold tracking-tight text-foreground">
                    Yayina almadan once kilidi ac
                  </h2>
                  <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
                    Bu workspace canli earnings verisi, scanner sonuclari ve
                    yayinlama aksiyonlarini acar. Devam etmek icin{" "}
                    <strong>{adminEmail}</strong> hesabina tanimli gizli anahtari
                    gir.
                  </p>
                </div>

                <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
                  <label className="space-y-1.5">
                    <span className="text-xs font-medium text-muted-foreground">
                      Admin secret
                    </span>
                    <Input
                      type="password"
                      value={adminSecret}
                      onChange={event => {
                        setAdminSecret(event.target.value);
                        setAdminError("");
                      }}
                      placeholder="Coolify env icindeki REPORT_ADMIN_SECRET"
                    />
                  </label>

                  <div className="flex items-end">
                    <Button
                      type="button"
                      onClick={() => void handleUnlock()}
                      disabled={adminBusy || !adminSecret.trim()}
                    >
                      {adminBusy ? "Kontrol ediliyor" : "Kilidi ac"}
                    </Button>
                  </div>
                </div>

                {adminError ? (
                  <p className="text-sm text-destructive">{adminError}</p>
                ) : null}
              </div>

              <div className="rounded-[2rem] border border-border bg-background/60 p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Gerekli env ve veri
                </p>
                <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                  <p>
                    `REPORT_ADMIN_SECRET`: admin publish kilidi icin zorunlu
                  </p>
                  <p>`FMP_API_KEY`: gercek earnings takvimi ve hisse verisi icin zorunlu</p>
                  <p>
                    `VITE_SCANNER_MASSIVE_API_KEY`, `VITE_SCANNER_TWELVEDATA_API_KEY`,
                    `VITE_SCANNER_ALPHAVANTAGE_API_KEY`: momentum scanner fallback'i
                    icin opsiyonel
                  </p>
                  <p>
                    Daily report icin ek API key gerekmiyor. Yeni paketleri sadece
                    `dailyreport/DDMMYYYY` altina birakman yeterli.
                  </p>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {adminAuthorized && selectedWorkspace === "earnings" ? (
          <>
            <section className="grid gap-4 lg:grid-cols-3">
              <ProviderCard
                title="Earnings import"
                provider={workspaceStatus?.providers.earningsImport.provider || "-"}
                configured={Boolean(workspaceStatus?.providers.earningsImport.configured)}
                mode={workspaceStatus?.providers.earningsImport.mode || "disabled"}
                note={
                  workspaceStatus?.providers.earningsImport.configured
                    ? "Onumuzdeki iki hafta icin gercek earnings takvimi ve fiyat verisi cekiliyor."
                    : "Canli import kapali. `FMP_API_KEY` eklenmezse sadece fallback taslaklar gelir."
                }
              />
              <ProviderCard
                title="Options / IV"
                provider={workspaceStatus?.providers.optionsData.provider || "-"}
                configured={Boolean(workspaceStatus?.providers.optionsData.configured)}
                mode={workspaceStatus?.providers.optionsData.mode || "heuristic"}
                note={workspaceStatus?.providers.optionsData.note}
              />
              <ProviderCard
                title="Momentum enrichment"
                provider={workspaceStatus?.providers.momentumData.provider || "-"}
                configured={Boolean(workspaceStatus?.providers.momentumData.configured)}
                mode={workspaceStatus?.providers.momentumData.mode || "live"}
                note="Momentum skoru, RSI ve fiyat davranisi earnings draftlarini zenginlestirmek icin kullanilir."
              />
            </section>

            <section className="rounded-[2rem] border border-border bg-card/95 p-6 shadow-2xl">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                    1. Sistem Onerileri
                  </p>
                  <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                    Gercek veriden uretilecek haftalar
                  </h2>
                  <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
                    Sistem once canli provider ile haftalari bulur, sonra admin
                    sadece taslagi acar veya direkt yayinlar.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-border bg-background/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    mode: {suggestionMode}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => void loadSuggestions(adminSecret)}
                    disabled={adminBusy}
                  >
                    <Sparkles className="size-4" />
                    Onerileri yenile
                  </Button>
                </div>
              </div>

              <div className="mt-5 grid gap-4 xl:grid-cols-2">
                {suggestions.map(suggestion => {
                  const topTickers = suggestion.report.content.entries
                    .slice(0, 5)
                    .map(entry => entry.ticker)
                    .join(", ");

                  return (
                    <article
                      key={`${suggestion.report.id}-${suggestion.source}`}
                      className="rounded-[2rem] border border-border bg-background/60 p-5"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                              {formatWeekRange(suggestion.report)}
                            </span>
                            <span className="rounded-full border border-border bg-card px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                              {suggestion.source}
                            </span>
                            {suggestion.alreadyExists ? (
                              <span className="rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300">
                                mevcut
                              </span>
                            ) : null}
                          </div>

                          <h3 className="text-xl font-semibold text-foreground">
                            {suggestion.report.title}
                          </h3>
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            {suggestion.report.content.summary}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-border bg-card/80 px-4 py-3">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            Entry
                          </p>
                          <p className="mt-2 text-2xl font-semibold text-foreground">
                            {suggestion.report.content.entries.length}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 rounded-2xl border border-border bg-card/70 p-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          One cikan tickerlar
                        </p>
                        <p className="mt-2 text-sm text-foreground">{topTickers || "-"}</p>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {suggestion.alreadyExists ? (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleSelectReport(suggestion.report.id)}
                          >
                            Mevcut raporu ac
                          </Button>
                        ) : (
                          <>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => void persistWeeklyReport("draft", suggestion.report)}
                              disabled={adminBusy}
                            >
                              Taslak olarak al
                            </Button>
                            <Button
                              type="button"
                              onClick={() =>
                                void persistWeeklyReport("published", suggestion.report)
                              }
                              disabled={adminBusy}
                            >
                              Direkt yayinla
                            </Button>
                          </>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>

              {!suggestions.length ? (
                <div className="mt-5 rounded-[2rem] border border-dashed border-border bg-background/50 p-5 text-sm text-muted-foreground">
                  Bu an icin sistem oneri uretmedi. `FMP_API_KEY` tanimli degilse
                  veya provider cevap vermediyse fallback taslaklara dusersin.
                </div>
              ) : null}
            </section>

            <section className="space-y-3">
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                  2. Gelismis Duzenleme
                </p>
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                  Ince ayar ve publish
                </h2>
                <p className="text-sm text-muted-foreground">
                  Sistem draftlari yeterli olmadiginda buradan headline, strateji,
                  IV alanlari ve ticker bazli tezleri duzenleyip yayina al.
                </p>
              </div>

              <WeeklyReportAdminPanel
                adminEmail={adminEmail}
                adminAuthorized={adminAuthorized}
                adminSecret={adminSecret}
                adminBusy={adminBusy}
                adminError={adminError}
                reports={reports}
                selectedReportId={selectedReportId}
                onSelectReport={handleSelectReport}
                draftReport={draftReport}
                onDraftReportChange={setDraftReport}
                onAdminSecretChange={value => {
                  setAdminSecret(value);
                  setAdminError("");
                }}
                onUnlock={() => void handleUnlock()}
                onLock={handleLock}
                onRefresh={() =>
                  void loadAdminReports(adminSecret, selectedReportId)
                }
                onCreateNextWeek={handleCreateNextWeek}
                onAddEntry={handleAddEntry}
                onRemoveEntry={handleRemoveEntry}
                onSaveDraft={() => void persistWeeklyReport("draft")}
                onPublish={() => void persistWeeklyReport("published")}
              />
            </section>
          </>
        ) : null}

        {adminAuthorized && selectedWorkspace === "momentum" ? (
          <>
            <section className="grid gap-4 lg:grid-cols-3">
              <ProviderCard
                title="Primary scanner"
                provider={workspaceStatus?.providers.momentumData.provider || "-"}
                configured={Boolean(workspaceStatus?.providers.momentumData.configured)}
                mode={workspaceStatus?.providers.momentumData.mode || "live"}
                note="Momentum taramasi default olarak Yahoo uzerinden calisir. Paid fallback provider key'leri varsa kalite/genislik artar."
              />
              <ProviderCard
                title="Fallback keys"
                provider="massive / twelvedata / alphavantage"
                configured={
                  Boolean(workspaceStatus?.providers.momentumData.fallbackKeys.massive) ||
                  Boolean(workspaceStatus?.providers.momentumData.fallbackKeys.twelvedata) ||
                  Boolean(
                    workspaceStatus?.providers.momentumData.fallbackKeys.alphavantage
                  )
                }
                mode="optional"
                note={`Massive: ${
                  workspaceStatus?.providers.momentumData.fallbackKeys.massive
                    ? "hazir"
                    : "yok"
                } · TwelveData: ${
                  workspaceStatus?.providers.momentumData.fallbackKeys.twelvedata
                    ? "hazir"
                    : "yok"
                } · AlphaVantage: ${
                  workspaceStatus?.providers.momentumData.fallbackKeys.alphavantage
                    ? "hazir"
                    : "yok"
                }`}
              />
              <ProviderCard
                title="Publish target"
                provider="latest snapshot"
                configured={Boolean(latestPublishedMomentum)}
                mode={latestPublishedMomentum ? "published" : "draft-only"}
                note={
                  latestPublishedMomentum
                    ? `${latestPublishedMomentum.title} son canli momentum yayini.`
                    : "Henuz yayinlanmis momentum snapshot yok."
                }
              />
            </section>

            <section className="rounded-[2rem] border border-border bg-card/95 p-6 shadow-2xl">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                    1. Son Yayin
                  </p>
                  <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                    Kullaniciya gidecek momentum snapshot
                  </h2>
                  <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
                    Admin scanner sonucunu secip buradan yayinlar. `/momentum`
                    sayfasi ustte bu snapshot'i gosterir, altta ise canli scanner
                    acik kalir.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => void loadMomentumReports(adminSecret, selectedMomentumReportId)}
                    disabled={adminBusy}
                  >
                    <RefreshCw className="size-4" />
                    Listeyi yenile
                  </Button>
                  <Button type="button" onClick={handleCreateMomentumDraft}>
                    <ChartCandlestick className="size-4" />
                    Yeni snapshot taslagi
                  </Button>
                </div>
              </div>

              {latestPublishedMomentum ? (
                <div className="mt-5 rounded-[2rem] border border-border bg-background/60 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-2">
                      <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                        {formatIsoDate(latestPublishedMomentum.reportDate)}
                      </span>
                      <h3 className="text-xl font-semibold text-foreground">
                        {latestPublishedMomentum.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {latestPublishedMomentum.content.summary}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-border bg-card/80 px-4 py-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Featured setup
                      </p>
                      <p className="mt-2 text-2xl font-semibold text-foreground">
                        {latestPublishedMomentum.content.featuredEntries.length}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-5 rounded-[2rem] border border-dashed border-border bg-background/50 p-5 text-sm text-muted-foreground">
                  Henuz yayinlanmis momentum snapshot yok. Once taramayi calistir,
                  sonuclari taslaga aktar ve publish et.
                </div>
              )}
            </section>

            <section className="space-y-3">
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                  2. Scanner ve Editor
                </p>
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                  Tarama sonucunu analize donustur
                </h2>
                <p className="text-sm text-muted-foreground">
                  Ticker evrenini sec, scanner'i calistir, en iyi setup'lari
                  taslaga aktar ve admin notlariyla yayina hazirla.
                </p>
              </div>

              <MomentumReportAdminPanel
                adminAuthorized={adminAuthorized}
                adminBusy={adminBusy}
                adminError={adminError}
                reports={momentumReports}
                selectedReportId={selectedMomentumReportId}
                draftReport={draftMomentumReport}
                onSelectReport={handleSelectMomentumReport}
                onDraftReportChange={setDraftMomentumReport}
                onRefresh={() =>
                  void loadMomentumReports(adminSecret, selectedMomentumReportId)
                }
                onSaveDraft={() => void persistMomentumReport("draft")}
                onPublish={() => void persistMomentumReport("published")}
              />
            </section>
          </>
        ) : null}

        {adminAuthorized && selectedWorkspace === "daily" ? (
          <>
            <section className="grid gap-4 lg:grid-cols-3">
              <ProviderCard
                title="Source root"
                provider="dailyreport/"
                configured={dailySourcePackages.length > 0}
                mode={dailySourcePackages.length > 0 ? "live" : "empty"}
                note="Bu workspace yerel `dailyreport/<tarih>` klasorlerinden paket okur. Sen yeni gunluk paketi bu path'e biraktikca admin preview edip publish eder."
              />
              <ProviderCard
                title="Package count"
                provider="local filesystem"
                configured={dailySourcePackages.length > 0}
                mode={`${dailySourcePackages.length} package`}
                note="Her klasor tek bir gunluk source package olarak algilanir."
              />
              <ProviderCard
                title="Latest published"
                provider="daily report viewer"
                configured={Boolean(latestPublishedDaily)}
                mode={latestPublishedDaily ? "published" : "draft-only"}
                note={
                  latestPublishedDaily
                    ? `${latestPublishedDaily.title} son canli gunluk rapor.`
                    : "Henuz yayinlanmis daily report yok."
                }
              />
            </section>

            <section className="rounded-[2rem] border border-border bg-card/95 p-6 shadow-2xl">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                    1. Source Packages
                  </p>
                  <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                    Klasore birakilan gunluk paketler
                  </h2>
                  <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
                    Yeni klasoru `dailyreport/` altina birakman yeterli. Sistem paketi
                    listeler, admin preview eder ve tek tikla daily report draft'i olusturur.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => void loadDailyReportSources(adminSecret)}
                    disabled={adminBusy}
                  >
                    <RefreshCw className="size-4" />
                    Source'lari yenile
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => void loadDailyReports(adminSecret, selectedDailyReportId)}
                    disabled={adminBusy}
                  >
                    <RefreshCw className="size-4" />
                    Kayitlari yenile
                  </Button>
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                  2. Preview ve Publish
                </p>
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                  Daily report publish hatti
                </h2>
                <p className="text-sm text-muted-foreground">
                  Source package'i sec, sistemin cikardigi taslagi kontrol et ve
                  yayina al. Istersen baslik ve executive summary duzeltmesi yap.
                </p>
              </div>

              <DailyReportAdminPanel
                adminAuthorized={adminAuthorized}
                adminBusy={adminBusy}
                adminError={adminError}
                sources={dailySourcePackages}
                selectedSourceId={selectedDailySourceId}
                selectedSource={selectedDailySource}
                onSelectSource={setSelectedDailySourceId}
                onRefreshSources={() => void loadDailyReportSources(adminSecret)}
                onCreateDraftFromSource={handleCreateDailyDraftFromSource}
                reports={dailyReports}
                selectedReportId={selectedDailyReportId}
                draftReport={draftDailyReport}
                onSelectReport={handleSelectDailyReport}
                onDraftReportChange={setDraftDailyReport}
                onRefreshReports={() =>
                  void loadDailyReports(adminSecret, selectedDailyReportId)
                }
                onSaveDraft={() => void persistDailyReport("draft")}
                onPublish={() => void persistDailyReport("published")}
              />
            </section>
          </>
        ) : null}

        {adminAuthorized ? (
          <section className="rounded-[2rem] border border-border bg-card/95 p-5 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Kilit ve session
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Editor `REPORT_ADMIN_SECRET` ile acik. Bu sayfa public route
                  uzerinde olsa da publish aksiyonlari yine secret ile korunur.
                </p>
              </div>

              <Button type="button" variant="ghost" onClick={handleLock}>
                <Shield className="size-4" />
                Kilidi kapat
              </Button>
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
