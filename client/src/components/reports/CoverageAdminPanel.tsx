import { useEffect, useMemo, useState } from "react";
import { FileUp, RefreshCw, Save, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  fetchCoverageAdminReports, importLocalCoverageAdminReports, upsertCoverageAdminReport, } from "@/features/coverage/lib/coverageApi";
import {
  parseCoverageReport, type CoverageReport, type CoverageStoredRecord, } from "@/features/coverage/lib/coverageParser";
import { type AppLanguage, t } from "@/lib/i18n";

function formatDate(value: string, language: AppLanguage) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(language === "en" ? "en-US" : "tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsed);
}

function signalTone(signal: string) {
  const upper = signal.toUpperCase();
  if (upper.includes("BEAR")) {
    return "border-rose-500/30 bg-rose-500/10 text-rose-200";
  }
  if (upper.includes("BULL")) {
    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-200";
  }
  return "border-border bg-background/35 text-muted-foreground";
}

export default function CoverageAdminPanel({
  adminSecret,
  language,
}: {
  adminSecret: string;
  language: AppLanguage;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [reports, setReports] = useState<CoverageStoredRecord[]>([]);
  const [localReports, setLocalReports] = useState<CoverageStoredRecord[]>([]);
  const [rootPath, setRootPath] = useState("");
  const [draftSourceName, setDraftSourceName] = useState("");
  const [draftRaw, setDraftRaw] = useState("");
  const [selectedId, setSelectedId] = useState("");

  const parsedPreview = useMemo(() => {
    if (!draftRaw.trim()) {
      return { error: "", report: null as CoverageReport | null };
    }

    try {
      const previewRecord: CoverageStoredRecord = {
        id: draftSourceName.trim() || "draft-preview",
        importedAt: new Date().toISOString(),
        raw: draftRaw,
        sourceName: draftSourceName.trim() || "draft-preview.md",
      };
      return {
        error: "",
        report: parseCoverageReport(previewRecord),
      };
    } catch (previewError) {
      return {
        error:
          previewError instanceof Error
            ? previewError.message
            : t("flow:coverageMarkdownPreviewCouldNot"),
        report: null,
      };
    }
  }, [draftRaw, draftSourceName, language]);

  useEffect(() => {
    if (!adminSecret.trim()) {
      return;
    }

    void load();
  }, [adminSecret]);

  async function load() {
    if (!adminSecret.trim()) {
      return;
    }

    setBusy(true);
    setError("");
    setMessage("");
    try {
      const payload = await fetchCoverageAdminReports(adminSecret);
      setReports(payload.reports || []);
      setLocalReports(payload.localReports || []);
      setRootPath(payload.rootPath || "");
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : t("common:weak")
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleImportLocal() {
    if (!adminSecret.trim()) {
      return;
    }

    setBusy(true);
    setError("");
    setMessage("");
    try {
      const payload = await importLocalCoverageAdminReports(adminSecret);
      setReports(payload.reports || []);
      setMessage(
        t("flow:localCoverageFilesWereImported", { imported: payload.imported })
      );
    } catch (importError) {
      setError(
        importError instanceof Error
          ? importError.message
          : t("flow:localCoverageFilesCouldNot")
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleSave() {
    if (!adminSecret.trim()) {
      return;
    }

    setBusy(true);
    setError("");
    setMessage("");
    try {
      const payload = await upsertCoverageAdminReport(adminSecret, {
        raw: draftRaw,
        sourceName: draftSourceName,
      });
      setReports(payload.reports || []);
      setSelectedId(payload.report?.id || "");
      setDraftSourceName(payload.report?.sourceName || draftSourceName);
      setMessage(
        t("flow:coverageReportSaved", { sourcename: payload.report?.sourceName || "" })
      );
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : t("flow:coverageReportCouldNotBe")
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleFileUpload(file: File | null) {
    if (!file) {
      return;
    }

    const text = await file.text();
    setDraftRaw(text);
    setDraftSourceName(file.name);
    setSelectedId("");
    setError("");
    setMessage("");
  }

  const legacyOnlyReports = localReports.filter(
    local =>
      !reports.some(
        stored =>
          stored.sourceName.trim().toLowerCase() ===
          local.sourceName.trim().toLowerCase()
      )
  );

  const openInEditor = (record: CoverageStoredRecord) => {
    setSelectedId(record.id);
    setDraftRaw(record.raw);
    setDraftSourceName(record.sourceName);
    setError("");
    setMessage("");
  };

  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
          {t("flow:coverageArchive")}
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          {t("flow:coverageMarkdownPublishPipeline")}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t("flow:publicCoverageNowReadsFrom")}
        </p>
      </div>

      <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="gap-4" interactive={false}>
          <CardHeader className="gap-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <CardTitle>
                  {t("flow:archiveEntries")}
                </CardTitle>
                <CardDescription>
                  {t("flow:coverageReportsStoredThroughThe")}
                </CardDescription>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button type="button" variant="outline" onClick={() => void load()} disabled={busy}>
                  <RefreshCw className="size-4" />
                  {t("common:refresh")}
                </Button>
                <Button type="button" variant="outline" onClick={() => void handleImportLocal()} disabled={busy}>
                  <FileUp className="size-4" />
                  {t("flow:importLocal")}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border border-border bg-background/35 px-4 py-3 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">
                {t("flow:legacyFolder")}
              </p>
              <p className="mt-1 break-all">{rootPath || "reports/coverage"}</p>
              <p className="mt-2 text-xs">
                {t("flow:markdownFilesInThisFolder")}
              </p>
            </div>

            <div className="space-y-2">
              {reports.length > 0 ? (
                reports.map(report => (
                  <button
                    key={report.id}
                    type="button"
                    onClick={() => openInEditor(report)}
                    className={`w-full rounded-xl border px-4 py-3 text-left transition-colors ${
                      selectedId === report.id
                        ? "border-sky-500/30 bg-sky-500/10"
                        : "border-border bg-background/30 hover:border-sky-500/20 hover:bg-background/45"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-foreground">
                        {report.sourceName}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(report.importedAt, language)}
                      </span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-border bg-background/20 px-4 py-4 text-sm text-muted-foreground">
                  {t("flow:noAdminCoverageRecordExists")}
                </div>
              )}
            </div>

            {legacyOnlyReports.length > 0 ? (
              <div className="space-y-2 rounded-xl border border-amber-500/20 bg-amber-500/6 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-200">
                  {t("flow:localFilesNotImportedYet")}
                </p>
                {legacyOnlyReports.map(report => (
                  <div key={report.id} className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-muted-foreground">{report.sourceName}</span>
                    <Button type="button" variant="ghost" size="sm" onClick={() => openInEditor(report)}>
                      {t("marketing:flowFreeAndOpen")}
                    </Button>
                  </div>
                ))}
              </div>
            ) : null}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="gap-4" interactive={false}>
            <CardHeader className="gap-2">
              <CardTitle>
                {"Editor"}
              </CardTitle>
              <CardDescription>
                {t("flow:pasteMarkdownOrSelectA")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 md:grid-cols-[1fr_auto]">
                <Input
                  value={draftSourceName}
                  onChange={event => setDraftSourceName(event.target.value)}
                  placeholder={"CRWV-2026-07-02.md"}
                />
                <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground">
                  <Upload className="size-4" />
                  {t("flow:chooseFile")}
                  <input
                    type="file"
                    accept=".md,text/markdown,text/plain"
                    className="hidden"
                    onChange={event =>
                      void handleFileUpload(event.target.files?.[0] || null)
                    }
                  />
                </label>
              </div>

              <Textarea
                value={draftRaw}
                onChange={event => setDraftRaw(event.target.value)}
                placeholder={t("flow:pasteCoverageMarkdownHere")}
                className="min-h-[460px] font-mono text-xs"
              />

              <div className="flex flex-wrap items-center gap-2">
                <Button type="button" onClick={() => void handleSave()} disabled={busy || !draftRaw.trim()}>
                  <Save className="size-4" />
                  {t("flow:save")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSelectedId("");
                    setDraftSourceName("");
                    setDraftRaw("");
                    setError("");
                    setMessage("");
                  }}
                  disabled={busy}
                >
                  {t("flow:clear")}
                </Button>
              </div>

              {message ? (
                <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/8 px-4 py-3 text-sm text-emerald-200">
                  {message}
                </div>
              ) : null}

              {error ? (
                <div className="rounded-xl border border-rose-500/25 bg-rose-500/8 px-4 py-3 text-sm text-rose-200">
                  {error}
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card className="gap-4" interactive={false}>
            <CardHeader className="gap-2">
              <CardTitle>
                {t("flow:preview")}
              </CardTitle>
              <CardDescription>
                {t("flow:seeHowTheClientParser")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {parsedPreview.report ? (
                <>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className={signalTone(parsedPreview.report.signal)}>
                      {parsedPreview.report.signal || "Coverage"}
                    </Badge>
                    <Badge variant="outline" className="border-border bg-background/35">
                      {parsedPreview.report.ticker}
                    </Badge>
                    <Badge variant="outline" className="border-border bg-background/35">
                      {parsedPreview.report.reportDate}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-lg font-semibold text-foreground">
                      {parsedPreview.report.title}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {parsedPreview.report.company}
                    </p>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-xl border border-border bg-background/35 px-4 py-3">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                        {t("flow:sections")}
                      </p>
                      <p className="mt-1 text-lg font-semibold text-foreground">
                        {parsedPreview.report.sections.length}
                      </p>
                    </div>
                    <div className="rounded-xl border border-border bg-background/35 px-4 py-3">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                        {t("common:source")}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-foreground">
                        {draftSourceName || parsedPreview.report.sourceName}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm leading-7 text-muted-foreground">
                    {parsedPreview.report.summary}
                  </p>
                </>
              ) : parsedPreview.error ? (
                <div className="rounded-xl border border-amber-500/25 bg-amber-500/8 px-4 py-3 text-sm text-amber-200">
                  {parsedPreview.error}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-border bg-background/20 px-4 py-4 text-sm text-muted-foreground">
                  {t("scanner:belowVwap")}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </section>
  );
}
