import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft, BookOpen, ChartCandlestick, FileText, FileSpreadsheet, Radar, RefreshCw, Shield, Sparkles, } from "lucide-react";
import type {
  DailyReportRecord, DailyReportSourcePackage, } from "@shared/dailyReports";
import type { DailyReportOpenAiChartGenerateResponse } from "@shared/dailyReportOpenAiCharts";
import type { MomentumReportRecord } from "@shared/momentumReports";
import type { WeeklyReportRecord } from "@shared/weeklyReports";
import DailyReportAdminPanel from "@/components/reports/DailyReportAdminPanel";
import CoverageAdminPanel from "@/components/reports/CoverageAdminPanel";
import MomentumReportAdminPanel from "@/components/reports/MomentumReportAdminPanel";
import OpenAiImageAdminPanel from "@/components/reports/OpenAiImageAdminPanel";
import WeeklyReportAdminPanel from "@/components/reports/WeeklyReportAdminPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  REPORT_ADMIN_SECRET_STORAGE_KEY, createEmptyEntry, createNextWeeklyReportDraft, deepCloneReport, formatWeekRange, sortReportsNewestFirst, } from "@/lib/weeklyReports";
import { createEmptyMomentumReportDraft } from "@/lib/momentumReports";
import {
  createDailyReportDraftFromSource, syncDailyReportDraftWithSource, sortDailyReportsNewestFirst, } from "@/lib/dailyReports";
import { extractApiErrorMessage, readJsonResponse } from "@/lib/api";
import { useLocation } from "wouter";
import { type AppLanguage, t } from "@/lib/i18n";
import { toast } from "sonner";

type WorkspaceKey = "earnings" | "momentum" | "daily" | "coverage" | "images";

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
    <div className="rounded-xl border border-border bg-card/85 p-6 shadow-xl">
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
  language,
}: {
  title: string;
  mode: string;
  provider: string;
  configured: boolean;
  note?: string;
  language: AppLanguage;
}) {
  return (
    <article className="rounded-xl border border-border bg-card/90 p-6 shadow-xl">
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
      <p className="mt-2 text-sm text-muted-foreground">
        {t("flow:provider")} {provider}
      </p>
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
  const [adminBusyLabel, setAdminBusyLabel] = useState("");
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
    t("flow:reproduceTheSourceChartAt")
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
        throw new Error(t("flow:adminMetaCouldNotBe"));
      }

      const payload = await readJsonResponse<WeeklyReportsApiResponse>(
        response,
        "Admin meta"
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
        throw new Error(t("scanner:30IvSpike"));
      }

      const payload = await readJsonResponse<AdminMarketDataStatus>(
        response,
        t("flow:workspaceProviderStatus")
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
        throw new Error(t("flow:earningsReportsCouldNotBe"));
      }

      const payload = await readJsonResponse<WeeklyReportsApiResponse>(
        response,
        t("flow:earningsReports")
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
        throw new Error(t("flow:liveEarningsSuggestionsCouldNot"));
      }

      const payload = await readJsonResponse<{
        suggestions?: WeeklyReportSuggestion[];
        mode?: "live" | "empty";
      }>(response, t("flow:liveEarningsSuggestions"));
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
        throw new Error(t("flow:momentumReportsCouldNotBe"));
      }

      const payload = await readJsonResponse<MomentumReportsApiResponse>(
        response,
        t("flow:momentumReports90b5")
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
        throw new Error(t("flow:dailyReportSourcePackagesCould"));
      }

      const payload = await readJsonResponse<DailyReportSourcesApiResponse>(
        response,
        t("flow:dailyReportSourcePackages")
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
        throw new Error(t("flow:dailyReportSourceDetailCould"));
      }

      const payload = await readJsonResponse<DailyReportSourcesApiResponse>(
        response,
        t("flow:dailyReportSourceDetail")
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
        throw new Error(t("flow:dailyReportRecordsCouldNot"));
      }

      const payload = await readJsonResponse<DailyReportsApiResponse>(
        response,
        t("flow:dailyReportRecords")
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
                : t("flow:adminWorkspaceCouldNotBe")
            );
            if (secretOverride.trim()) {
              writeStoredAdminSecret("");
              setAdminSecret("");
            }
          }
        }
      } catch (error) {
        setPageError(
          error instanceof Error ? error.message : t("flow:adminPageCouldNotBe")
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

  const handleAdminFailure = useCallback(
    (error: unknown, fallback: string) => {
      const message = error instanceof Error ? error.message : fallback;
      setAdminError(message);
      toast.error(message);
      return message;
    },
    []
  );

  const handleUnlock = async () => {
    setAdminBusy(true);
    setAdminBusyLabel(
      t("flow:unlockingAdminWorkspace")
    );
    setAdminError("");

    try {
      const payload = await loadViewerMeta(adminSecret);
      const isAuthorized = Boolean(payload.admin?.authorized || adminSecret.trim());

      if (!isAuthorized) {
        throw new Error(t("flow:adminLockCouldNotBe"));
      }

      await loadAuthorizedWorkspace(
        adminSecret,
        selectedReportId,
        selectedMomentumReportId,
        selectedDailyReportId
      );
      writeStoredAdminSecret(adminSecret);
      setAdminAuthorized(true);
      toast.success(
        t("flow:adminWorkspaceUnlocked")
      );
    } catch (error) {
      writeStoredAdminSecret("");
      setAdminAuthorized(false);
      handleAdminFailure(
        error,
        t("flow:adminLockCouldNotBe")
      );
    } finally {
      setAdminBusy(false);
      setAdminBusyLabel("");
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
    setAdminBusyLabel(
      status === "published"
        ? t("flow:publishingEarningsReport")
        : t("flow:savingEarningsDraft")
    );
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
      >(response, t("flow:earningsReportRecord"));

      if (!response.ok) {
        throw new Error(
          extractApiErrorMessage(
            payload,
            language === "en"
              ? "Earnings report could not be saved."
              : "Earnings raporu kaydedilemedi."
          )
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
      toast.success(
        status === "published"
          ? t("flow:earningsReportPublished")
          : t("flow:earningsDraftSaved")
      );
    } catch (error) {
      handleAdminFailure(
        error,
        t("flow:earningsReportCouldNotBe")
      );
    } finally {
      setAdminBusy(false);
      setAdminBusyLabel("");
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
    setAdminBusyLabel(
      status === "published"
        ? t("flow:publishingMomentumSnapshot")
        : t("flow:savingMomentumDraft")
    );
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
      >(response, t("flow:momentumReportRecord"));

      if (!response.ok) {
        throw new Error(
          extractApiErrorMessage(
            payload,
            language === "en"
              ? "Momentum report could not be saved."
              : "Momentum raporu kaydedilemedi."
          )
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
      toast.success(
        status === "published"
          ? t("flow:momentumSnapshotPublished")
          : t("flow:momentumDraftSaved")
      );
    } catch (error) {
      handleAdminFailure(
        error,
        t("flow:momentumReportCouldNotBe")
      );
    } finally {
      setAdminBusy(false);
      setAdminBusyLabel("");
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
    setAdminBusyLabel(
      status === "published"
        ? t("flow:publishingDailyReport")
        : t("flow:savingDailyDraft")
    );
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
      >(response, t("flow:dailyReportRecord"));

      if (!response.ok) {
        throw new Error(
          extractApiErrorMessage(
            payload,
            language === "en"
              ? "Daily report could not be saved."
              : "Daily report kaydedilemedi."
          )
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
      toast.success(
        status === "published"
          ? t("flow:dailyReportPublished")
          : t("flow:dailyDraftSaved")
      );
    } catch (error) {
      handleAdminFailure(
        error,
        t("flow:dailyReportCouldNotBe")
      );
    } finally {
      setAdminBusy(false);
      setAdminBusyLabel("");
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
      setDailyOpenAiChartError(t("flow:sourceChartNotFound"));
      return;
    }

    const normalizedPrompt = dailyOpenAiChartPrompt.trim();
    if (!normalizedPrompt) {
      setDailyOpenAiChartError(t("flow:openaiChartPromptIsRequired"));
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
        >(response, t("flow:dailyReportOpenaiChartGeneration"));

        if (!response.ok) {
          throw new Error(
            extractApiErrorMessage(payload, t("flow:openaiChartGenerationFailed"))
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
        const successMessage = `${result.generatedFiles.length} ${t("flow:openaiVariantSGeneratedFor")}`;
        setDailyOpenAiChartMessage(successMessage);
        toast.success(successMessage);
        return;
      }

      for (const figureFileName of nextFigureFileNames) {
        currentFigureFileName = figureFileName;
        setDailyOpenAiChartMessage(
          `${completed}/${total} ${t("flow:completedNextChart")} ${figureFileName}`
        );
        const result = await requestChartGeneration([figureFileName]);
        applyGeneratedSource(result);
        completed += 1;
        setDailyOpenAiChartMessage(
          `${completed}/${total} ${t("flow:chartsGeneratedOneByOne")}`
        );
      }

      if (completed > 0) {
        toast.success(
          `${completed}/${total} ${t("flow:chartsGenerated")}`
        );
      }
    } catch (error) {
      const message =
        completed > 0
          ? `${completed}/${total} ${t("flow:chartsGenerated")} ${
              currentFigureFileName ? `${currentFigureFileName} ${t("flow:atStage")} ` : ""
            }${
              error instanceof Error
                ? error.message
                : t("flow:openaiChartGenerationCouldNot")
            }`
          : error instanceof Error
            ? error.message
            : t("flow:openaiChartGenerationCouldNot");
      setDailyOpenAiChartError(message);
      toast.error(message);
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
        <div className="mx-auto max-w-7xl rounded-xl border border-border bg-card/95 p-8 shadow-2xl">
          <h1 className="text-2xl font-semibold tracking-tight">
            {t("flow:adminWorkspaceLoading")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("flow:earningsAndMomentumPublishingTools")}
          </p>
        </div>
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="px-4 py-8">
        <div className="mx-auto max-w-4xl rounded-xl border border-destructive/30 bg-card/95 p-8 shadow-2xl">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {t("flow:adminPageCouldNotBeff5d")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{pageError}</p>
          <Button className="mt-6" onClick={() => void refreshPage(adminSecret)}>
            {t("flow:tryAgain")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8">
      {adminBusy ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/55 p-4 backdrop-blur-sm md:items-start md:pt-24">
          <div className="flex w-full max-w-md items-start gap-3 rounded-xl border border-border bg-card/96 p-4 shadow-2xl">
            <RefreshCw className="mt-0.5 size-4 shrink-0 animate-spin text-emerald-300" />
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
                {t("flow:actionInProgress")}
              </p>
              <p className="text-sm font-medium text-foreground">
                {adminBusyLabel || t("flow:adminActionIsRunning")}
              </p>
              <p className="text-sm text-muted-foreground">
                {t("flow:thisOverlayStaysOpenUntil")}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-xl border border-border bg-card/95 p-6 shadow-2xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-4">
              <Button
                type="button"
                variant="ghost"
                className="px-0 text-muted-foreground"
                onClick={() => setLocation("/app")}
              >
                <ArrowLeft className="size-4" />
                {t("flow:backToWorkspace")}
              </Button>

              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                <Shield className="size-4" />
                Admin Workspace
              </div>

              <div className="space-y-2">
                <h1 className="text-4xl font-semibold tracking-tight text-foreground">
                  {t("flow:earningsCoverageDailyAndImage")}
                </h1>
                <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
                  {t("flow:theSystemFindsEarningsWeeks")}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {(["earnings", "momentum", "coverage", "daily", "images"] as WorkspaceKey[]).map(
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
                    ) : workspace === "coverage" ? (
                      <BookOpen className="size-4" />
                    ) : workspace === "daily" ? (
                      <FileText className="size-4" />
                    ) : (
                      <Sparkles className="size-4" />
                    )}
                    {workspace === "earnings"
                      ? "Earnings Workspace"
                      : workspace === "momentum"
                        ? "Momentum Workspace"
                        : workspace === "coverage"
                          ? "Coverage Workspace"
                        : workspace === "daily"
                          ? "Daily Report"
                          : "Image Studio"}
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
                title={t("flow:totalReports37ae")}
                value={String(earningsStats.totalReports)}
                description={t("flow:registeredEarningsWeeks")}
              />
              <SectionCard
                title={t("flow:publisheda780")}
                value={String(earningsStats.publishedReports)}
                description={t("flow:publishedWeeks")}
              />
              <SectionCard
                title={t("flow:totalEntries")}
                value={String(earningsStats.totalEntries)}
                description={t("flow:totalStocksDistributedAcrossWeeks")}
              />
              <SectionCard
                title={t("flow:latestWeek")}
                value={earningsStats.latestWeek}
                description={t("flow:weekShownAtTheTop")}
              />
            </>
          ) : selectedWorkspace === "momentum" ? (
            <>
              <SectionCard
                title={t("flow:totalSnapshots")}
                value={String(momentumStats.totalReports)}
                description={t("flow:registeredMomentumPublications")}
              />
              <SectionCard
                title={t("flow:publisheda780")}
                value={String(momentumStats.publishedReports)}
                description={t("flow:publishedMomentumReports")}
              />
              <SectionCard
                title={t("flow:featuredSetup")}
                value={String(momentumStats.totalEntries)}
                description={t("flow:totalPublishedSetupsAcrossAll")}
              />
              <SectionCard
                title={t("flow:latestPublication")}
                value={momentumStats.latestDate}
                description={t("flow:latestPublishedMomentumSnapshot")}
              />
            </>
          ) : selectedWorkspace === "coverage" ? (
            <>
              <SectionCard
                title={t("flow:publishMode")}
                value={t("flow:adminLockedf69f")}
                description={t("flow:thePublicCoverageArchiveIs")}
              />
              <SectionCard
                title={t("flow:archiveFormat")}
                value="coverage-md/1"
                description={t("flow:skillAndRendererShareThe")}
              />
              <SectionCard
                title={t("flow:legacySource")}
                value="reports/coverage"
                description={t("flow:theLocalMarkdownFolderCan")}
              />
              <SectionCard
                title={t("flow:persistentArchive")}
                value="SQLite"
                description={t("flow:newCoverageReportsAreWritten")}
              />
            </>
          ) : selectedWorkspace === "images" ? (
            <>
              <SectionCard
                title={t("flow:provider5edb")}
                value="OpenAI"
                description={t("flow:serverSideImageGeneration")}
              />
              <SectionCard
                title={t("flow:auth")}
                value={t("flow:serverEnv")}
                description={t("flow:apiKeyIsNotExposed")}
              />
              <SectionCard
                title={t("flow:referenceLimit")}
                value="4"
                description={t("flow:maximumImagesPerBatch")}
              />
              <SectionCard
                title={t("flow:output")}
                value="PNG"
                description={t("flow:previewAndDownloadInThe")}
              />
            </>
          ) : (
            <>
              <SectionCard
                title={t("flow:totalDaily")}
                value={String(dailyStats.totalReports)}
                description={t("flow:registeredDailyReportPublications")}
              />
              <SectionCard
                title={t("flow:publisheda780")}
                value={String(dailyStats.publishedReports)}
                description={t("flow:publishedDailyReports")}
              />
              <SectionCard
                title={t("flow:sourcePackage")}
                value={String(dailyStats.sourcePackages)}
                description={t("flow:readyPackagesInDailyreportFolder")}
              />
              <SectionCard
                title={t("flow:latestPublication")}
                value={dailyStats.latestDate}
                description={t("flow:latestPublishedDailyReport")}
              />
            </>
          )}
        </section>

        {!adminAuthorized ? (
          <section className="rounded-xl border border-border bg-card/95 p-6 shadow-2xl">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-200">
                  <Shield className="size-4" />
                  {t("flow:adminLockIsClosed50b1")}
                </div>

                <div className="space-y-2">
                  <h2 className="text-3xl font-semibold tracking-tight text-foreground">
                    {t("flow:unlockBeforePublishing")}
                  </h2>
                  <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
                    {t("flow:thisWorkspaceOpensLiveEarnings", { adminemail: adminEmail })}
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
                      placeholder={t("flow:reportAdminSecretInCoolify")}
                    />
                  </label>

                  <div className="flex items-end">
                    <Button
                      type="button"
                      onClick={() => void handleUnlock()}
                      disabled={adminBusy || !adminSecret.trim()}
                    >
                      {adminBusy ? t("flow:checking") : t("flow:unlock")}
                    </Button>
                  </div>
                </div>

                {adminError ? (
                  <p className="text-sm text-destructive">{adminError}</p>
                ) : null}
              </div>

              <div className="rounded-xl border border-border bg-background/60 p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {t("flow:requiredEnvAndData")}
                </p>
                <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                  <p>
                    {t("flow:reportAdminSecretRequiredFor")}
                  </p>
                  <p>
                    {t("flow:fmpApiKeyRequiredFor")}
                  </p>
                  <p>
                    {t("flow:openaiApiKeyRequiredTo")}
                  </p>
                  <p>
                    {t("flow:viteScannerMassiveApiKey")}
                  </p>
                  <p>
                    {t("flow:noExtraApiKeyNeeded")}
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
                title={t("flow:earningsImport")}
                provider={workspaceStatus?.providers.earningsImport.provider || "-"}
                configured={Boolean(workspaceStatus?.providers.earningsImport.configured)}
                mode={workspaceStatus?.providers.earningsImport.mode || "disabled"}
                note={
                  workspaceStatus?.providers.earningsImport.configured
                    ? t("flow:realEarningsCalendarAndPrice")
                    : t("flow:liveImportIsDisabledWeekly")
                }
                language={language}
              />
              <ProviderCard
                title={t("flow:optionsIv")}
                provider={workspaceStatus?.providers.optionsData.provider || "-"}
                configured={Boolean(workspaceStatus?.providers.optionsData.configured)}
                mode={workspaceStatus?.providers.optionsData.mode || "heuristic"}
                note={workspaceStatus?.providers.optionsData.note}
                language={language}
              />
              <ProviderCard
                title={t("flow:momentumEnrichment")}
                provider={workspaceStatus?.providers.momentumData.provider || "-"}
                configured={Boolean(workspaceStatus?.providers.momentumData.configured)}
                mode={workspaceStatus?.providers.momentumData.mode || "live"}
                note={t("flow:momentumScoreRsiAndPrice")}
                language={language}
              />
            </section>

            <section className="rounded-xl border border-border bg-card/95 p-6 shadow-2xl">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                    {t("flow:1SystemSuggestions")}
                  </p>
                  <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                    {t("flow:weeksToBeGeneratedFrom")}
                  </h2>
                  <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
                    {t("flow:theSystemFirstFindsWeeks")}
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
                    {t("flow:refreshSuggestions")}
                  </Button>
                </div>
              </div>

              <div className="mt-6 grid gap-4 xl:grid-cols-2">
                {suggestions.map(suggestion => {
                  const topTickers = suggestion.report.content.entries
                    .slice(0, 5)
                    .map(entry => entry.ticker)
                    .join(", ");

                  return (
                    <article
                      key={`${suggestion.report.id}-${suggestion.source}`}
                      className="rounded-xl border border-border bg-background/60 p-6"
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
                                {t("flow:exists")}
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

                        <div className="rounded-xl border border-border bg-card/80 px-4 py-3">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            Entry
                          </p>
                          <p className="mt-2 text-2xl font-semibold text-foreground">
                            {suggestion.report.content.entries.length}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 rounded-xl border border-border bg-card/70 p-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          {t("flow:highlightedTickers")}
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
                            {t("flow:openExistingReport")}
                          </Button>
                        ) : (
                          <>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => void persistWeeklyReport("draft", suggestion.report)}
                              disabled={adminBusy}
                            >
                              {t("flow:takeAsDraft")}
                            </Button>
                            <Button
                              type="button"
                              onClick={() =>
                                void persistWeeklyReport("published", suggestion.report)
                              }
                              disabled={adminBusy}
                            >
                              {t("flow:publishDirectly")}
                            </Button>
                          </>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>

              {!suggestions.length ? (
                <div className="mt-6 rounded-xl border border-dashed border-border bg-background/50 p-6 text-sm text-muted-foreground">
                  {t("flow:theSystemDidNotGenerate")}
                </div>
              ) : null}
            </section>

            <section className="space-y-3">
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                  {t("flow:2AdvancedEditing")}
                </p>
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                  {t("flow:fineTuningAndPublish")}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {t("flow:whenSystemDraftsAreInsufficient")}
                </p>
              </div>

              <WeeklyReportAdminPanel
                language={language}
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
                title={t("flow:primaryScanner")}
                provider={workspaceStatus?.providers.momentumData.provider || "-"}
                configured={Boolean(workspaceStatus?.providers.momentumData.configured)}
                mode={workspaceStatus?.providers.momentumData.mode || "live"}
                note={t("flow:momentumScanRunsViaYahoo")}
                language={language}
              />
              <ProviderCard
                title={t("flow:fallbackKeys")}
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
                    ? t("flow:ready")
                    : t("flow:missing")
                } · TwelveData: ${
                  workspaceStatus?.providers.momentumData.fallbackKeys.twelvedata
                    ? t("flow:ready")
                    : t("flow:missing")
                } · AlphaVantage: ${
                  workspaceStatus?.providers.momentumData.fallbackKeys.alphavantage
                    ? t("flow:ready")
                    : t("flow:missing")
                }`}
                language={language}
              />
              <ProviderCard
                title={t("flow:publishTarget")}
                provider="latest snapshot"
                configured={Boolean(latestPublishedMomentum)}
                mode={latestPublishedMomentum ? "published" : "draft-only"}
                note={
                  latestPublishedMomentum
                    ? `${latestPublishedMomentum.title} ${t("flow:isTheLatestLiveMomentum")}`
                    : t("flow:noMomentumSnapshotHasBeen")
                }
                language={language}
              />
            </section>

            <section className="rounded-xl border border-border bg-card/95 p-6 shadow-2xl">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                    {t("flow:1LatestPublication")}
                  </p>
                  <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                    {t("flow:momentumSnapshotForUsers")}
                  </h2>
                  <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
                    {t("flow:theAdminSelectsTheScanner")}
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
                    {t("flow:refreshList")}
                  </Button>
                  <Button type="button" onClick={handleCreateMomentumDraft}>
                    <ChartCandlestick className="size-4" />
                    {t("flow:newSnapshotDraft")}
                  </Button>
                </div>
              </div>

              {latestPublishedMomentum ? (
                <div className="mt-6 rounded-xl border border-border bg-background/60 p-6">
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

                    <div className="rounded-xl border border-border bg-card/80 px-4 py-3">
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
                <div className="mt-6 rounded-xl border border-dashed border-border bg-background/50 p-6 text-sm text-muted-foreground">
                  {t("flow:noMomentumSnapshotHasBeenbbd3")}
                </div>
              )}
            </section>

            <section className="space-y-3">
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                  {t("flow:2ScannerAndEditor")}
                </p>
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                  {t("flow:turnScanResultIntoAnalysis")}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {t("flow:selectTheTickerUniverseRun")}
                </p>
              </div>

              <MomentumReportAdminPanel
                language={language}
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

        {adminAuthorized && selectedWorkspace === "coverage" ? (
          <CoverageAdminPanel language={language} adminSecret={adminSecret} />
        ) : null}

        {adminAuthorized && selectedWorkspace === "daily" ? (
          <>
            <section className="grid gap-4 lg:grid-cols-3">
              <ProviderCard
                title={t("flow:sourceRoot")}
                provider="dailyreport/ + flow/"
                configured={dailySourcePackages.length > 0}
                mode={dailySourcePackages.length > 0 ? "live" : "empty"}
                note={t("flow:thisWorkspaceReadsLocalDailyreport")}
                language={language}
              />
              <ProviderCard
                title={t("flow:packageCount")}
                provider="local filesystem"
                configured={dailySourcePackages.length > 0}
                mode={`${dailySourcePackages.length} package`}
                note={t("flow:eachFolderOrMarkdownFile")}
                language={language}
              />
              <ProviderCard
                title={t("flow:latestPublished")}
                provider="daily report viewer"
                configured={Boolean(latestPublishedDaily)}
                mode={latestPublishedDaily ? "published" : "draft-only"}
                note={
                  latestPublishedDaily
                    ? `${latestPublishedDaily.title} ${t("flow:isTheLatestLiveDaily")}`
                    : t("flow:noDailyReportHasBeen")
                }
                language={language}
              />
            </section>

            <section className="rounded-xl border border-border bg-card/95 p-6 shadow-2xl">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                    {"1. Source Packages"}
                  </p>
                  <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                    {t("flow:localDailySourcePackages")}
                  </h2>
                  <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
                    {t("flow:justDropTheNewFolder")}
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
                    {t("flow:refreshSources")}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => void loadDailyReports(adminSecret, selectedDailyReportId)}
                    disabled={adminBusy}
                  >
                    <RefreshCw className="size-4" />
                    {t("flow:refreshRecords")}
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
                  {t("flow:dailyReportPublishPipeline")}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {t("flow:selectTheSourcePackageReview")}
                </p>
              </div>

              <DailyReportAdminPanel
                language={language}
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
          <OpenAiImageAdminPanel language={language} adminSecret={adminSecret} />
        ) : null}

        {adminAuthorized ? (
          <section className="rounded-xl border border-border bg-card/95 p-6 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {t("flow:lockAndSession")}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("flow:editorIsOpenWithReport")}
                </p>
              </div>

              <Button type="button" variant="ghost" onClick={handleLock}>
                <Shield className="size-4" />
                {t("flow:lock")}
              </Button>
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
