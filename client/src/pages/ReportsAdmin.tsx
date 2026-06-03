import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, FileSpreadsheet, Shield, Sparkles } from "lucide-react";
import type { WeeklyReportRecord } from "@shared/weeklyReports";
import WeeklyReportAdminPanel from "@/components/reports/WeeklyReportAdminPanel";
import { Button } from "@/components/ui/button";
import {
  REPORT_ADMIN_SECRET_STORAGE_KEY,
  createEmptyEntry,
  createNextWeeklyReportDraft,
  deepCloneReport,
  formatWeekRange,
  sortReportsNewestFirst,
} from "@/lib/weeklyReports";
import { useLocation } from "wouter";

interface WeeklyReportsApiResponse {
  reports?: WeeklyReportRecord[];
  admin?: {
    authorized?: boolean;
    email?: string;
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
    // Ignore storage errors.
  }
}

export default function ReportsAdmin() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [adminEmail, setAdminEmail] = useState("hsnksc@gmail.com");
  const [adminAuthorized, setAdminAuthorized] = useState(false);
  const [adminSecret, setAdminSecret] = useState(() => readStoredAdminSecret());
  const [adminBusy, setAdminBusy] = useState(false);
  const [adminError, setAdminError] = useState("");
  const [reports, setReports] = useState<WeeklyReportRecord[]>([]);
  const [selectedReportId, setSelectedReportId] = useState("");
  const [draftReport, setDraftReport] = useState<WeeklyReportRecord | null>(null);

  const buildAdminHeaders = useCallback(
    (secretOverride?: string): Record<string, string> => {
      const secret = (secretOverride ?? adminSecret).trim();
      return secret ? { "x-gistify-admin-secret": secret } : {};
    },
    [adminSecret]
  );

  const syncDraft = useCallback(
    (nextReports: WeeklyReportRecord[], preferredId?: string) => {
      const target =
        nextReports.find(report => report.id === preferredId) || nextReports[0] || null;
      setSelectedReportId(target?.id || "");
      setDraftReport(target ? deepCloneReport(target) : null);
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
        throw new Error("Weekly report meta yuklenemedi.");
      }

      const payload = (await response.json()) as WeeklyReportsApiResponse;
      setAdminEmail(payload.admin?.email || "hsnksc@gmail.com");
      setAdminAuthorized(Boolean(payload.admin?.authorized));
      return payload;
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
        throw new Error("Admin raporlari yuklenemedi.");
      }

      const payload = (await response.json()) as WeeklyReportsApiResponse;
      const nextReports = sortReportsNewestFirst(payload.reports || []);
      setReports(nextReports);
      setAdminAuthorized(true);
      syncDraft(nextReports, preferredId);
    },
    [buildAdminHeaders, syncDraft]
  );

  const refreshPage = useCallback(
    async (secretOverride = "", preferredId?: string) => {
      setLoading(true);
      setPageError("");

      try {
        const payload = await loadViewerMeta(secretOverride);
        if (payload.admin?.authorized || secretOverride.trim()) {
          await loadAdminReports(secretOverride, preferredId);
        }
      } catch (error) {
        setPageError(
          error instanceof Error
            ? error.message
            : "Admin sayfasi yuklenemedi."
        );
      } finally {
        setLoading(false);
      }
    },
    [loadAdminReports, loadViewerMeta]
  );

  useEffect(() => {
    void refreshPage(readStoredAdminSecret());
  }, [refreshPage]);

  const handleUnlock = async () => {
    setAdminBusy(true);
    setAdminError("");

    try {
      await loadAdminReports(adminSecret, selectedReportId);
      writeStoredAdminSecret(adminSecret);
      await loadViewerMeta(adminSecret);
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
    setReports([]);
    setSelectedReportId("");
    setDraftReport(null);
    setAdminError("");
  };

  const handleSelectReport = (reportId: string) => {
    setSelectedReportId(reportId);
    const next = reports.find(report => report.id === reportId) || null;
    setDraftReport(next ? deepCloneReport(next) : null);
  };

  const handleCreateNextWeek = () => {
    const nextDraft = createNextWeeklyReportDraft(draftReport || reports[0]);
    setDraftReport(nextDraft);
    setSelectedReportId(nextDraft.id);
    setReports(current => sortReportsNewestFirst([nextDraft, ...current]));
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

  const persistAdminReport = async (status: WeeklyReportRecord["status"]) => {
    if (!draftReport) {
      return;
    }

    setAdminBusy(true);
    setAdminError("");

    try {
      const reportToSave: WeeklyReportRecord = {
        ...draftReport,
        status,
        publishedAt:
          status === "published"
            ? draftReport.publishedAt || new Date().toISOString()
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
        throw new Error("Rapor kaydedilemedi.");
      }

      const payload = (await response.json()) as WeeklyReportsApiResponse & {
        report?: WeeklyReportRecord;
      };
      const nextReports = sortReportsNewestFirst(payload.reports || []);
      const savedReport = payload.report || reportToSave;
      setReports(nextReports);
      setSelectedReportId(savedReport.id);
      setDraftReport(deepCloneReport(savedReport));
      await loadViewerMeta(adminSecret);
    } catch (error) {
      setAdminError(
        error instanceof Error ? error.message : "Rapor kaydedilemedi."
      );
    } finally {
      setAdminBusy(false);
    }
  };

  const stats = useMemo(() => {
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

  if (loading) {
    return (
      <div className="px-4 py-8">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-border bg-card/95 p-8 shadow-2xl">
          <h1 className="text-2xl font-semibold tracking-tight">Admin editoru yukleniyor</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Haftalik raporlar ve editor durumlari hazirlaniyor.
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
                  Haftalik Rapor Yonetimi
                </h1>
                <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
                  Modal yerine tam sayfa editor. Buradan haftalari planla,
                  ticker analizlerini duzenle ve publish et. Publish edilen
                  raporlar otomatik olarak viewer ve projection katmanina yansir.
                </p>
              </div>
            </div>

            <div className="grid min-w-[280px] gap-3 sm:grid-cols-2">
              {[
                ["Toplam rapor", String(stats.totalReports)],
                ["Published", String(stats.publishedReports)],
                ["Toplam entry", String(stats.totalEntries)],
                ["En yeni hafta", stats.latestWeek],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-3xl border border-border bg-background/60 p-4"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {label}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-foreground">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[2rem] border border-border bg-card/90 p-5 shadow-xl">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="size-4 text-emerald-300" />
              <p className="text-sm font-semibold text-foreground">Planlama</p>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Yeni hafta olustur, tarihleri kaydir ve mevcut yapidan draft turet.
            </p>
          </div>
          <div className="rounded-[2rem] border border-border bg-card/90 p-5 shadow-xl">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-emerald-300" />
              <p className="text-sm font-semibold text-foreground">Yayinlama</p>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Save draft ve publish aksiyonlari tam sayfada calisir; modal kapanmasi
              veya dar alan sorunu kalmaz.
            </p>
          </div>
          <div className="rounded-[2rem] border border-border bg-card/90 p-5 shadow-xl">
            <div className="flex items-center gap-2">
              <Shield className="size-4 text-emerald-300" />
              <p className="text-sm font-semibold text-foreground">Guvenlik</p>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Page route acik olsa da editor verisi yine `REPORT_ADMIN_SECRET`
              ile korunur.
            </p>
          </div>
        </section>

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
          onRefresh={() => void loadAdminReports(adminSecret, selectedReportId)}
          onCreateNextWeek={handleCreateNextWeek}
          onAddEntry={handleAddEntry}
          onRemoveEntry={handleRemoveEntry}
          onSaveDraft={() => void persistAdminReport("draft")}
          onPublish={() => void persistAdminReport("published")}
        />
      </div>
    </div>
  );
}
