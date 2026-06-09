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
import type { DailyReportOpenAiChartGenerateResponse } from "@shared/dailyReportOpenAiCharts";
import type { MomentumReportRecord } from "@shared/momentumReports";
import type { WeeklyReportRecord } from "@shared/weeklyReports";
import DailyReportAdminPanel from "@/components/reports/DailyReportAdminPanel";
import MomentumReportAdminPanel from "@/components/reports/MomentumReportAdminPanel";
import OpenAiImageAdminPanel from "@/components/reports/OpenAiImageAdminPanel";
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
  syncDailyReportDraftWithSource,
  sortDailyReportsNewestFirst,
} from "@/lib/dailyReports";
import { extractApiErrorMessage, readJsonResponse } from "@/lib/api";
import { useLocation } from "wouter";
import { copy, type AppLanguage } from "@/lib/i18n";

type WorkspaceKey = "earnings" | "momentum" | "daily" | "images";

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

interface DailyReportOpenAiChartErrorResponse {
  error?: string;
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

function formatIsoDate(value?: string, locale: AppLanguage = "tr") {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "tr-TR", {
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

function sortDailySourcesNewestFirst(sources: DailyReportSourcePackage[]) {
  return [...sources].sort((left, right) => {
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

export default function ReportsAdmin({ language }: { language: AppLanguage }) {
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
  const [suggestionMode, setSuggestionMode] = useState<"live" | "empty">(
    "empty"
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
  const [dailyOpenAiChartPrompt, setDailyOpenAiChartPrompt] = useState(
    copy(
      language,
      "Kaynak chart'i premium institutional research kalitesinde yeniden uret. Tum sayisal iliskileri, eksenleri, tarihleri, anotasyonlari, ok yonlerini, legend'i ve veri hiyerarsisini birebir koru. Yalnizca netlik, tipografi, kontrast ve okunabilirligi iyilestir; veri uydurma veya yorum ekleme.",
      "Reproduce the source chart at premium institutional research quality. Preserve all numerical relationships, axes, dates, annotations, arrow directions, legend and data hierarchy exactly. Only improve clarity, typography, contrast and readability; do not fabricate data or add commentary."
    )
  );
  const [selectedDailyFigureFile, setSelectedDailyFigureFile] = useState("");
  const [dailyOpenAiChartBusy, setDailyOpenAiChartBusy] = useState(false);
  const [dailyOpenAiChartError, setDailyOpenAiChartError] = useState("");
  const [dailyOpenAiChartMessage, setDailyOpenAiChartMessage] = useState("");

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
        throw new Error(copy(language, "Admin meta yuklenemedi.", "Admin meta could not be loaded."));
      }

      const payload = await readJsonResponse<WeeklyReportsApiResponse>(
        response,
        copy(language, "Admin meta", "Admin meta")
      );
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
        throw new Error(copy(language, "Workspace provider durumlari yuklenemedi.", "Workspace provider statuses could not be loaded."));
      }

      const payload = await readJsonResponse<AdminMarketDataStatus>(
        response,
        copy(language, "Workspace provider durumu", "Workspace provider status")
      );
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
        throw new Error(copy(language, "Earnings raporlari yuklenemedi.", "Earnings reports could not be loaded."));
      }

      const payload = await readJsonResponse<WeeklyReportsApiResponse>(
        response,
        copy(language, "Earnings raporlari", "Earnings reports")
      );
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
        throw new Error(copy(language, "Canli earnings onerileri yuklenemedi.", "Live earnings suggestions could not be loaded."));
      }

      const payload = await readJsonResponse<{
        suggestions?: WeeklyReportSuggestion[];
        mode?: "live" | "empty";
      }>(response, copy(language, "Canli earnings onerileri", "Live earnings suggestions"));
      setSuggestions(payload.suggestions || []);
      setSuggestionMode(payload.mode || "empty");
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
        throw new Error(copy(language, "Momentum raporlari yuklenemedi.", "Momentum reports could not be loaded."));
      }

      const payload = await readJsonResponse<MomentumReportsApiResponse>(
        response,
        copy(language, "Momentum raporlari", "Momentum reports")
      );
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
        throw new Error(copy(language, "Daily report source paketleri yuklenemedi.", "Daily report source packages could not be loaded."));
      }

      const payload = await readJsonResponse<DailyReportSourcesApiResponse>(
        response,
        copy(language, "Daily report source paketleri", "Daily report source packages")
      );
      const nextSources = sortDailySourcesNewestFirst(payload.sources || []);
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
        throw new Error(copy(language, "Daily report source detayi yuklenemedi.", "Daily report source detail could not be loaded."));
      }

      const payload = await readJsonResponse<DailyReportSourcesApiResponse>(
        response,
        copy(language, "Daily report source detayi", "Daily report source detail")
      );
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
        throw new Error(copy(language, "Daily report kayitlari yuklenemedi.", "Daily report records could not be loaded."));
      }

      const payload = await readJsonResponse<DailyReportsApiResponse>(
        response,
        copy(language, "Daily report kayitlari", "Daily report records")
      );
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
                : copy(language, "Admin workspace yuklenemedi.", "Admin workspace could not be loaded.")
            );
            if (secretOverride.trim()) {
              writeStoredAdminSecret("");
              setAdminSecret("");
            }
          }
        }
      } catch (error) {
        setPageError(
          error instanceof Error ? error.message : copy(language, "Admin sayfasi acilamadi.", "Admin page could not be opened.")
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

  useEffect(() => {
    if (!selectedDailySource?.figureFiles.length) {
      setSelectedDailyFigureFile("");
      return;
    }

    setSelectedDailyFigureFile(current =>
      current && selectedDailySource.figureFiles.includes(current)
        ? current
        : selectedDailySource.figureFiles[0] || ""
    );
  }, [selectedDailySource]);

  const handleUnlock = async () => {
    setAdminBusy(true);
    setAdminError("");

    try {
      const payload = await loadViewerMeta(adminSecret);
      const isAuthorized = Boolean(payload.admin?.authorized || adminSecret.trim());

      if (!isAuthorized) {
        throw new Error(copy(language, "Admin kilidi acilamadi.", "Admin lock could not be opened."));
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
        error instanceof Error ? error.message : copy(language, "Admin kilidi acilamadi.", "Admin lock could not be opened.")
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
    setDailyOpenAiChartError("");
    setDailyOpenAiChartMessage("");
    setDailyOpenAiChartBusy(false);
    setSelectedDailyFigureFile("");
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

      const payload = await readJsonResponse<
        WeeklyReportsApiResponse & {
          report?: WeeklyReportRecord;
        }
      >(response, copy(language, "Earnings raporu kaydi", "Earnings report record"));

      if (!response.ok) {
        throw new Error(
          extractApiErrorMessage(payload, copy(language, copy(language, "Earnings raporu kaydedilemedi.", "Earnings report could not be saved."), "Earnings report could not be saved."))
        );
      }

      const nextPayload = payload as WeeklyReportsApiResponse & {
        report?: WeeklyReportRecord;
      };
      const nextReports = sortReportsNewestFirst(nextPayload.reports || []);
      const savedReport = nextPayload.report || reportToSave;
      setReports(nextReports);
      setSelectedReportId(savedReport.id);
      setDraftReport(deepCloneReport(savedReport));
      await loadSuggestions(adminSecret);
    } catch (error) {
      setAdminError(
        error instanceof Error
          ? error.message
          : copy(language, copy(language, "Earnings raporu kaydedilemedi.", "Earnings report could not be saved."), "Earnings report could not be saved.")
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

      const payload = await readJsonResponse<
        MomentumReportsApiResponse & {
          report?: MomentumReportRecord;
        }
      >(response, copy(language, "Momentum raporu kaydi", "Momentum report record"));

      if (!response.ok) {
        throw new Error(
          extractApiErrorMessage(payload, copy(language, copy(language, "Momentum raporu kaydedilemedi.", "Momentum report could not be saved."), "Momentum report could not be saved."))
        );
      }

      const nextPayload = payload as MomentumReportsApiResponse & {
        report?: MomentumReportRecord;
      };
      const nextReports = sortMomentumReportsNewestFirst(nextPayload.reports || []);
      const savedReport = nextPayload.report || reportToSave;
      setMomentumReports(nextReports);
      setLatestPublishedMomentum(nextPayload.latestPublished || null);
      setSelectedMomentumReportId(savedReport.id);
      setDraftMomentumReport(JSON.parse(JSON.stringify(savedReport)));
    } catch (error) {
      setAdminError(
        error instanceof Error
          ? error.message
          : copy(language, copy(language, "Momentum raporu kaydedilemedi.", "Momentum report could not be saved."), "Momentum report could not be saved.")
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

      const payload = await readJsonResponse<
        DailyReportsApiResponse & {
          report?: DailyReportRecord;
        }
      >(response, copy(language, "Daily report kaydi", "Daily report record"));

      if (!response.ok) {
        throw new Error(
          extractApiErrorMessage(payload, copy(language, copy(language, "Daily report kaydedilemedi.", "Daily report could not be saved."), "Daily report could not be saved."))
        );
      }

      const nextPayload = payload as DailyReportsApiResponse & {
        report?: DailyReportRecord;
      };
      const nextReports = sortDailyReportsNewestFirst(nextPayload.reports || []);
      const savedReport = nextPayload.report || reportToSave;
      setDailyReports(nextReports);
      setLatestPublishedDaily(nextPayload.latestPublished || null);
      setSelectedDailyReportId(savedReport.id);
      setDraftDailyReport(JSON.parse(JSON.stringify(savedReport)));
    } catch (error) {
      setAdminError(
        error instanceof Error ? error.message : copy(language, copy(language, "Daily report kaydedilemedi.", "Daily report could not be saved."), "Daily report could not be saved.")
      );
    } finally {
      setAdminBusy(false);
    }
  };

  const generateDailyOpenAiCharts = async (figureFileNames?: string[]) => {
    if (!selectedDailySource) {
      return;
    }

    const nextFigureFileNames =
      figureFileNames?.length && figureFileNames[0]
        ? figureFileNames
        : selectedDailySource.figureFiles;
    if (!nextFigureFileNames.length) {
      setDailyOpenAiChartError(copy(language, "Kaynak grafik bulunamadi.", "Source chart not found."));
      return;
    }

    const normalizedPrompt = dailyOpenAiChartPrompt.trim();
    if (!normalizedPrompt) {
      setDailyOpenAiChartError(copy(language, "OpenAI chart prompt gerekli.", "OpenAI chart prompt is required."));
      return;
    }

    setDailyOpenAiChartBusy(true);
    setDailyOpenAiChartError("");
    setDailyOpenAiChartMessage("");
    let completed = 0;
    const total = nextFigureFileNames.length;
    let currentFigureFileName = "";

    try {
      const requestChartGeneration = async (
        targetFigureFileNames: string[]
      ): Promise<DailyReportOpenAiChartGenerateResponse> => {
        const response = await fetch("/api/admin/daily-report-charts/openai", {
          method: "POST",
          credentials: "include",
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
            ...buildAdminHeaders(),
          },
          body: JSON.stringify({
            sourceId: selectedDailySource.id,
            prompt: normalizedPrompt,
            figureFileNames: targetFigureFileNames,
          }),
        });

        const payload = await readJsonResponse<
          | DailyReportOpenAiChartGenerateResponse
          | DailyReportOpenAiChartErrorResponse
        >(response, copy(language, "Daily report OpenAI chart uretimi", "Daily report OpenAI chart generation"));

        if (!response.ok) {
          throw new Error(
            extractApiErrorMessage(payload, copy(language, "OpenAI chart generation basarisiz oldu.", "OpenAI chart generation failed."))
          );
        }

        return payload as DailyReportOpenAiChartGenerateResponse;
      };

      const applyGeneratedSource = (
        result: DailyReportOpenAiChartGenerateResponse
      ) => {
        setSelectedDailySource(result.source);
        setDailySourcePackages(current =>
          sortDailySourcesNewestFirst([
            result.source,
            ...current.filter(source => source.id !== result.source.id),
          ])
        );
        setDraftDailyReport(current =>
          current?.sourceFolder === result.source.folderName
            ? syncDailyReportDraftWithSource(current, result.source)
            : current
        );
      };

      if (nextFigureFileNames.length === 1) {
        const result = await requestChartGeneration(nextFigureFileNames);
        applyGeneratedSource(result);
        setDailyOpenAiChartMessage(
          `${result.generatedFiles.length} ${copy(language, "grafik icin OpenAI varyanti uretildi.", "OpenAI variant(s) generated for chart(s).")}`
        );
        return;
      }

      for (const figureFileName of nextFigureFileNames) {
        currentFigureFileName = figureFileName;
        setDailyOpenAiChartMessage(
          `${completed}/${total} ${copy(language, "tamamlandi. Siradaki grafik:", "completed. Next chart:")} ${figureFileName}`
        );
        const result = await requestChartGeneration([figureFileName]);
        applyGeneratedSource(result);
        completed += 1;
        setDailyOpenAiChartMessage(
          `${completed}/${total} ${copy(language, "grafik tek tek uretildi.", "charts generated one by one.")}`
        );
      }
    } catch (error) {
      setDailyOpenAiChartError(
        completed > 0
          ? `${completed}/${total} ${copy(language, "grafik uretildi.", "charts generated.")} ${
              currentFigureFileName ? `${currentFigureFileName} ${copy(language, "asamasinda", "at stage")} ` : ""
            }${
              error instanceof Error
                ? error.message
                : copy(language, "OpenAI chart generation tamamlanamadi.", "OpenAI chart generation could not be completed.")
            }`
          : error instanceof Error
            ? error.message
            : copy(language, "OpenAI chart generation tamamlanamadi.", "OpenAI chart generation could not be completed.")
      );
    } finally {
      setDailyOpenAiChartBusy(false);
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
        ? formatIsoDate(latestPublishedMomentum.reportDate, language)
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
        ? formatIsoDate(latestPublishedDaily.reportDate, language)
        : "-",
    };
  }, [dailySourcePackages, dailyReports, latestPublishedDaily]);

  if (loading) {
    return (
      <div className="px-4 py-8">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-border bg-card/95 p-8 shadow-2xl">
          <h1 className="text-2xl font-semibold tracking-tight">
            {copy(language, "Admin workspace yukleniyor", "Admin workspace loading")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {copy(language, "Earnings ve momentum yayinlama araclari hazirlaniyor.", "Earnings and momentum publishing tools are loading.")}
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
            {copy(language, "Admin sayfasi acilamadi", "Admin page could not be opened")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{pageError}</p>
          <Button className="mt-5" onClick={() => void refreshPage(adminSecret)}>
            {copy(language, "Tekrar dene", "Try again")}
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
                {copy(language, "Workspace'e don", "Back to workspace")}
              </Button>

              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                <Shield className="size-4" />
                Admin Workspace
              </div>

              <div className="space-y-2">
                <h1 className="text-4xl font-semibold tracking-tight text-foreground">
                  {copy(language, "Earnings, Daily ve Image Yonetimi", "Earnings, Daily and Image Management")}
                </h1>
                <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
                  {copy(language, "Sistem earnings haftalarini ve aday hisseleri bulur, momentum scanner ise yayinlanabilir setup listesini uretir. Admin burada sadece gozden gecirir, ince ayar yapar, yayina alir ve gerekirse referans gorsellerden yeni image uretir.", "The system finds earnings weeks and candidate stocks, while the momentum scanner produces a publishable setup list. The admin only reviews, fine-tunes, publishes and generates new images from reference visuals when needed.")}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {(["earnings", "momentum", "daily", "images"] as WorkspaceKey[]).map(
                workspace => (
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
                    ) : workspace === "daily" ? (
                      <FileText className="size-4" />
                    ) : (
                      <Sparkles className="size-4" />
                    )}
                    {workspace === "earnings"
                      ? copy(language, "Earnings Workspace", "Earnings Workspace")
                      : workspace === "momentum"
                        ? copy(language, "Momentum Workspace", "Momentum Workspace")
                        : workspace === "daily"
                          ? copy(language, "Daily Report", "Daily Report")
                          : copy(language, "Image Studio", "Image Studio")}
                  </Button>
                )
              )}
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          {selectedWorkspace === "earnings" ? (
            <>
              <SectionCard
                title={copy(language, "Toplam rapor", "Total reports")}
                value={String(earningsStats.totalReports)}
                description={copy(language, "Kayitli earnings haftalari", "Registered earnings weeks")}
              />
              <SectionCard
                title="Published"
                value={String(earningsStats.publishedReports)}
                description={copy(language, "Canliya alinmis haftalar", "Published weeks")}
              />
              <SectionCard
                title={copy(language, "Toplam entry", "Total entries")}
                value={String(earningsStats.totalEntries)}
                description={copy(language, "Haftalara dagitilan toplam hisse", "Total stocks distributed across weeks")}
              />
              <SectionCard
                title={copy(language, "En yeni hafta", "Latest week")}
                value={earningsStats.latestWeek}
                description={copy(language, "Editor acilisinda ustte gorunen hafta", "Week shown at the top when editor opens")}
              />
            </>
          ) : selectedWorkspace === "momentum" ? (
            <>
              <SectionCard
                title={copy(language, "Toplam snapshot", "Total snapshots")}
                value={String(momentumStats.totalReports)}
                description={copy(language, "Kayitli momentum yayinlari", "Registered momentum publications")}
              />
              <SectionCard
                title="Published"
                value={String(momentumStats.publishedReports)}
                description={copy(language, "Canliya alinmis momentum raporlari", "Published momentum reports")}
              />
              <SectionCard
                title="Featured setup"
                value={String(momentumStats.totalEntries)}
                description={copy(language, "Tum snapshot'lardaki toplam yayin setup'i", "Total published setups across all snapshots")}
              />
              <SectionCard
                title={copy(language, "Son yayin", "Latest publication")}
                value={momentumStats.latestDate}
                description="Latest published momentum snapshot"
              />
            </>
          ) : selectedWorkspace === "images" ? (
            <>
              <SectionCard
                title="Provider"
                value="OpenAI"
                description="Server-side image generation"
              />
              <SectionCard
                title="Auth"
                value="Server env"
                description={copy(language, "API key frontend'e verilmez", "API key is not exposed to frontend")}
              />
              <SectionCard
                title={copy(language, "Referans limit", "Reference limit")}
                value="4"
                description={copy(language, "Tek seferde en fazla gorsel", "Maximum images per batch")}
              />
              <SectionCard
                title={copy(language, "Cikis", "Output")}
                value="PNG"
                description={copy(language, "Preview ve indirme ayni panelde", "Preview and download in the same panel")}
              />
            </>
          ) : (
            <>
              <SectionCard
                title={copy(language, "Toplam daily", "Total daily")}
                value={String(dailyStats.totalReports)}
                description={copy(language, "Kayitli daily report yayinlari", "Registered daily report publications")}
              />
              <SectionCard
                title="Published"
                value={String(dailyStats.publishedReports)}
                description={copy(language, "Canliya alinmis gunluk raporlar", "Published daily reports")}
              />
              <SectionCard
                title="Source package"
                value={String(dailyStats.sourcePackages)}
                description={copy(language, "dailyreport klasorunde hazir paketler", "Ready packages in dailyreport folder")}
              />
              <SectionCard
                title={copy(language, "Son yayin", "Latest publication")}
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
                  {copy(language, "Yonetici kilidi kapali", "Admin lock is closed")}
                </div>

                <div className="space-y-2">
                  <h2 className="text-3xl font-semibold tracking-tight text-foreground">
                    {copy(language, "Yayina almadan once kilidi ac", "Unlock before publishing")}
                  </h2>
                  <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
                    {copy(language, `Bu workspace canli earnings verisi, scanner sonuclari ve yayinlama aksiyonlarini acar. Devam etmek icin ${adminEmail} hesabina tanimli gizli anahtari gir.`, `This workspace opens live earnings data, scanner results and publishing actions. Enter the secret key assigned to the ${adminEmail} account to continue.`)}
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
                      placeholder={copy(language, "Coolify env icindeki REPORT_ADMIN_SECRET", "REPORT_ADMIN_SECRET in Coolify env")}
                    />
                  </label>

                  <div className="flex items-end">
                    <Button
                      type="button"
                      onClick={() => void handleUnlock()}
                      disabled={adminBusy || !adminSecret.trim()}
                    >
                      {adminBusy ? copy(language, "Kontrol ediliyor", "Checking") : copy(language, "Kilidi ac", "Unlock")}
                    </Button>
                  </div>
                </div>

                {adminError ? (
                  <p className="text-sm text-destructive">{adminError}</p>
                ) : null}
              </div>

              <div className="rounded-[2rem] border border-border bg-background/60 p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {copy(language, "Gerekli env ve veri", "Required env and data")}
                </p>
                <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                  <p>
                    copy(language, "`REPORT_ADMIN_SECRET`: admin publish kilidi icin zorunlu", "`REPORT_ADMIN_SECRET`: required for admin publish lock")
                  </p>
                  <p>copy(language, "`FMP_API_KEY`: gercek earnings takvimi ve hisse verisi icin zorunlu", "`FMP_API_KEY`: required for real earnings calendar and stock data")</p>
                  <p>
                    copy(language, "`OPENAI_API_KEY`: Image Studio ile referans gorselden yeni image uretmek icin zorunlu", "`OPENAI_API_KEY`: required to generate new images from reference visuals via Image Studio")
                  </p>
                  <p>
                    copy(language, "`VITE_SCANNER_MASSIVE_API_KEY`, `VITE_SCANNER_TWELVEDATA_API_KEY`, `VITE_SCANNER_ALPHAVANTAGE_API_KEY`: momentum scanner fallback'i icin opsiyonel", "`VITE_SCANNER_MASSIVE_API_KEY`, `VITE_SCANNER_TWELVEDATA_API_KEY`, `VITE_SCANNER_ALPHAVANTAGE_API_KEY`: optional for momentum scanner fallback")
                  </p>
                  <p>
                    copy(language, "Daily report icin ek API key gerekmiyor. Yeni paketleri sadece `dailyreport/DDMMYYYY` altina birakman yeterli.", "No extra API key needed for Daily report. Just drop new packages under `dailyreport/DDMMYYYY`.")
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
                    ? copy(language, "Onumuzdeki iki hafta icin gercek earnings takvimi ve fiyat verisi cekiliyor.", "Real earnings calendar and price data are being pulled for the next two weeks.")
                    : copy(language, "Canli import kapali. `FMP_API_KEY` eklenmezse weekly suggestion listesi bos kalir.", "Live import is disabled. Weekly suggestion list will remain empty if `FMP_API_KEY` is not added.")
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
                note={copy(language, "Momentum skoru, RSI ve fiyat davranisi earnings draftlarini zenginlestirmek icin kullanilir.", "Momentum score, RSI and price behavior are used to enrich earnings drafts.")}
              />
            </section>

            <section className="rounded-[2rem] border border-border bg-card/95 p-6 shadow-2xl">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                    {copy(language, "1. Sistem Onerileri", "1. System Suggestions")}
                  </p>
                  <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                    {copy(language, "Gercek veriden uretilecek haftalar", "Weeks to be generated from real data")}
                  </h2>
                  <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
                    {copy(language, "Sistem once canli provider ile haftalari bulur, sonra admin sadece taslagi acar veya direkt yayinlar.", "The system first finds weeks with the live provider, then the admin simply opens the draft or publishes directly.")}
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
                    {copy(language, "Onerileri yenile", "Refresh suggestions")}
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
                                {copy(language, "mevcut", "exists")}
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
                          {copy(language, "One cikan tickerlar", "Highlighted tickers")}
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
                            {copy(language, "Mevcut raporu ac", "Open existing report")}
                          </Button>
                        ) : (
                          <>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => void persistWeeklyReport("draft", suggestion.report)}
                              disabled={adminBusy}
                            >
                              {copy(language, "Taslak olarak al", "Take as draft")}
                            </Button>
                            <Button
                              type="button"
                              onClick={() =>
                                void persistWeeklyReport("published", suggestion.report)
                              }
                              disabled={adminBusy}
                            >
                              {copy(language, "Direkt yayinla", "Publish directly")}
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
                  {copy(language, "Bu an icin sistem oneri uretmedi. Static seed fallback kapali; `FMP_API_KEY` tanimli degilse veya provider veri donmezse bu alan bilerek bos kalir.", "The system did not generate suggestions at this time. Static seed fallback is disabled; this area intentionally remains empty if `FMP_API_KEY` is not set or the provider returns no data.")}
                </div>
              ) : null}
            </section>

            <section className="space-y-3">
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                  {copy(language, "2. Gelismis Duzenleme", "2. Advanced Editing")}
                </p>
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                  {copy(language, "Ince ayar ve publish", "Fine-tuning and publish")}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {copy(language, "Sistem draftlari yeterli olmadiginda buradan headline, strateji, IV alanlari ve ticker bazli tezleri duzenleyip yayina al.", "When system drafts are insufficient, edit headlines, strategies, IV fields and ticker-based theses here and publish.")}
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
                note={copy(language, "Momentum taramasi default olarak Yahoo uzerinden calisir. Paid fallback provider key'leri varsa kalite/genislik artar.", "Momentum scan runs via Yahoo by default. Paid fallback provider keys improve quality/coverage.")}
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
                    ? copy(language, "hazir", "ready")
                    : copy(language, "yok", "missing")
                } · TwelveData: ${
                  workspaceStatus?.providers.momentumData.fallbackKeys.twelvedata
                    ? copy(language, "hazir", "ready")
                    : copy(language, "yok", "missing")
                } · AlphaVantage: ${
                  workspaceStatus?.providers.momentumData.fallbackKeys.alphavantage
                    ? copy(language, "hazir", "ready")
                    : copy(language, "yok", "missing")
                }`}
              />
              <ProviderCard
                title="Publish target"
                provider="latest snapshot"
                configured={Boolean(latestPublishedMomentum)}
                mode={latestPublishedMomentum ? "published" : "draft-only"}
                note={
                  latestPublishedMomentum
                    ? `${latestPublishedMomentum.title} ${copy(language, "son canli momentum yayini.", "is the latest live momentum publication.")}`
                    : copy(language, "Henuz yayinlanmis momentum snapshot yok.", "No momentum snapshot has been published yet.")
                }
              />
            </section>

            <section className="rounded-[2rem] border border-border bg-card/95 p-6 shadow-2xl">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                    {copy(language, "1. Son Yayin", "1. Latest Publication")}
                  </p>
                  <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                    {copy(language, "Kullaniciya gidecek momentum snapshot", "Momentum snapshot for users")}
                  </h2>
                  <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
                    {copy(language, "Admin scanner sonucunu secip buradan yayinlar. `/momentum` sayfasi ustte bu snapshot'i gosterir, altta ise canli scanner acik kalir.", "The admin selects the scanner result and publishes it here. The `/momentum` page shows this snapshot at the top, while the live scanner remains open below.")}
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
                    {copy(language, "Listeyi yenile", "Refresh list")}
                  </Button>
                  <Button type="button" onClick={handleCreateMomentumDraft}>
                    <ChartCandlestick className="size-4" />
                    {copy(language, "Yeni snapshot taslagi", "New snapshot draft")}
                  </Button>
                </div>
              </div>

              {latestPublishedMomentum ? (
                <div className="mt-5 rounded-[2rem] border border-border bg-background/60 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-2">
                      <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                        {formatIsoDate(latestPublishedMomentum.reportDate, language)}
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
                  {copy(language, "Henuz yayinlanmis momentum snapshot yok. Once taramayi calistir, sonuclari taslaga aktar ve publish et.", "No momentum snapshot has been published yet. First run the scan, transfer results to draft and publish.")}
                </div>
              )}
            </section>

            <section className="space-y-3">
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                  {copy(language, "2. Scanner ve Editor", "2. Scanner and Editor")}
                </p>
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                  {copy(language, "Tarama sonucunu analize donustur", "Turn scan result into analysis")}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {copy(language, "Ticker evrenini sec, scanner'i calistir, en iyi setup'lari taslaga aktar ve admin notlariyla yayina hazirla.", "Select the ticker universe, run the scanner, transfer the best setups to draft and prepare for publication with admin notes.")}
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
                note={copy(language, "Bu workspace yerel `dailyreport/<tarih>` klasorlerinden paket okur. Sen yeni gunluk paketi bu path'e biraktikca admin preview edip publish eder.", "This workspace reads packages from local `dailyreport/<date>` folders. As you drop new daily packages into this path, the admin previews and publishes them.")}
              />
              <ProviderCard
                title="Package count"
                provider="local filesystem"
                configured={dailySourcePackages.length > 0}
                mode={`${dailySourcePackages.length} package`}
                note={copy(language, "Her klasor tek bir gunluk source package olarak algilanir.", "Each folder is treated as a single daily source package.")}
              />
              <ProviderCard
                title="Latest published"
                provider="daily report viewer"
                configured={Boolean(latestPublishedDaily)}
                mode={latestPublishedDaily ? "published" : "draft-only"}
                note={
                  latestPublishedDaily
                    ? `${latestPublishedDaily.title} ${copy(language, "son canli gunluk rapor.", "is the latest live daily report.")}`
                    : copy(language, "Henuz yayinlanmis daily report yok.", "No daily report has been published yet.")
                }
              />
            </section>

            <section className="rounded-[2rem] border border-border bg-card/95 p-6 shadow-2xl">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                    {copy(language, "1. Source Packages", "1. Source Packages")}
                  </p>
                  <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                    {copy(language, "Klasore birakilan gunluk paketler", "Daily packages dropped in folder")}
                  </h2>
                  <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
                    {copy(language, "Yeni klasoru `dailyreport/` altina birakman yeterli. Sistem paketi listeler, admin preview eder ve tek tikla daily report draft'i olusturur.", "Just drop the new folder under `dailyreport/`. The system lists the package, the admin previews it and creates a daily report draft with one click.")}
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
                    {copy(language, "Source'lari yenile", "Refresh sources")}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => void loadDailyReports(adminSecret, selectedDailyReportId)}
                    disabled={adminBusy}
                  >
                    <RefreshCw className="size-4" />
                    {copy(language, "Kayitlari yenile", "Refresh records")}
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
                  {copy(language, "Daily report publish hatti", "Daily report publish pipeline")}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {copy(language, "Source package'i sec, sistemin cikardigi taslagi kontrol et ve yayina al. Istersen baslik ve executive summary duzeltmesi yap.", "Select the source package, review the draft extracted by the system and publish. You may also edit the title and executive summary.")}
                </p>
              </div>

              <DailyReportAdminPanel
                adminAuthorized={adminAuthorized}
                adminBusy={adminBusy}
                adminError={adminError}
                sources={dailySourcePackages}
                selectedSourceId={selectedDailySourceId}
                selectedSource={selectedDailySource}
                onSelectSource={value => {
                  setSelectedDailySourceId(value);
                  setDailyOpenAiChartError("");
                  setDailyOpenAiChartMessage("");
                }}
                onRefreshSources={() => void loadDailyReportSources(adminSecret)}
                onCreateDraftFromSource={handleCreateDailyDraftFromSource}
                openAiChartBusy={dailyOpenAiChartBusy}
                openAiChartError={dailyOpenAiChartError}
                openAiChartMessage={dailyOpenAiChartMessage}
                openAiChartPrompt={dailyOpenAiChartPrompt}
                selectedOpenAiFigureFile={selectedDailyFigureFile}
                onOpenAiChartPromptChange={value => {
                  setDailyOpenAiChartPrompt(value);
                  setDailyOpenAiChartError("");
                  setDailyOpenAiChartMessage("");
                }}
                onSelectOpenAiFigureFile={value => {
                  setSelectedDailyFigureFile(value);
                  setDailyOpenAiChartError("");
                  setDailyOpenAiChartMessage("");
                }}
                onGenerateSelectedOpenAiChart={() =>
                  void generateDailyOpenAiCharts(
                    selectedDailyFigureFile ? [selectedDailyFigureFile] : []
                  )
                }
                onGenerateAllOpenAiCharts={() => void generateDailyOpenAiCharts()}
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

        {adminAuthorized && selectedWorkspace === "images" ? (
          <OpenAiImageAdminPanel adminSecret={adminSecret} />
        ) : null}

        {adminAuthorized ? (
          <section className="rounded-[2rem] border border-border bg-card/95 p-5 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {copy(language, "Kilit ve session", "Lock and session")}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {copy(language, "Editor `REPORT_ADMIN_SECRET` ile acik. Bu sayfa public route uzerinde olsa da publish aksiyonlari yine secret ile korunur.", "Editor is open with `REPORT_ADMIN_SECRET`. Even though this page is on a public route, publish actions are still protected by the secret.")}
                </p>
              </div>

              <Button type="button" variant="ghost" onClick={handleLock}>
                <Shield className="size-4" />
                {copy(language, "Kilidi kapat", "Lock")}
              </Button>
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
