import { useMemo } from "react";
import {
  AlertCircle, ArrowLeft, FileSearch, Globe2, Languages, MessageSquareText, RefreshCw, Trash2, } from "lucide-react";
import { useLocation } from "wouter";
import HtmlReportRenderer from "@/components/reports/HtmlReportRenderer";
import { Button } from "@/components/ui/button";
import { Delta } from "@/components/ui/delta";
import EmptyState from "@/components/ui/empty-state";
import LoadingState from "@/components/ui/loading-state";
import { usePageMeta } from "@/hooks/usePageMeta";
import { type AppLanguage, t } from "@/lib/i18n";
import FlowLayout from "../components/FlowLayout";
import { useFlowReport } from "../hooks/useFlowReport";
import { useFlowReportSummaries } from "../hooks/useFlowReportSummaries";
import {
  adaptFlowReportToStoredReport,
  findStoredReport,
  formatRecommendationLabel,
  formatReportPrice,
  getRecommendationTone,
} from "../lib/reportGallery";
import { useReportStore } from "../store/useReportStore";

interface ReportsDateDetailPageProps {
  language: AppLanguage;
  onLanguageChange: (next: AppLanguage) => void;
  reportDate: string;
  ticker: string;
}

export default function ReportsDateDetailPage({
  language,
  onLanguageChange,
  reportDate,
  ticker,
}: ReportsDateDetailPageProps) {
  const [location, setLocation] = useLocation();
  const { reports: serverReports, loading: serverLoading, error: serverError, reload } =
    useFlowReportSummaries(language, { reportKind: "stock" });
  const {
    error: localError,
    hydrate,
    loading: localLoading,
    removeReport,
    reports: localReports,
  } = useReportStore(language);

  const reportIdFromQuery = useMemo(() => {
    if (typeof window === "undefined") {
      return "";
    }
    return new URLSearchParams(window.location.search).get("report") || "";
  }, [location]);

  const allReports = useMemo(
    () => [
      ...serverReports
        .map(adaptFlowReportToStoredReport)
        .filter((report): report is NonNullable<typeof report> => Boolean(report)),
      ...localReports.filter(report => (report.reportKind || "stock") === "stock"),
    ],
    [localReports, serverReports]
  );

  const report = useMemo(
    () => findStoredReport(allReports, ticker, reportDate, reportIdFromQuery),
    [allReports, reportDate, reportIdFromQuery, ticker]
  );
  const serverDetailReportId =
    report?.sourceType === "server" ? report.serverReportId || "" : "";
  const {
    report: serverDetailReport,
    loading: serverDetailLoading,
    error: serverDetailError,
  } = useFlowReport(serverDetailReportId, language);
  const loading = serverLoading || localLoading || serverDetailLoading;
  const error = [serverError, localError].filter(Boolean).join(" · ");
  const pageTitle = report
    ? `${report.ticker} · ${report.companyName || report.fileName} · Gistify`
    : t("calendar:fearGreedOutlook");
  const pageDescription = report
    ? t("flow:htmlReportDetailForDated", { ticker: report.ticker, reportdate: report.reportDate })
    : t("flow:reportDetailViewForThe");

  usePageMeta({
    description: pageDescription,
    title: pageTitle,
  });

  return (
    <FlowLayout
      language={language}
      eyebrow={t("common:reports")}
      title={
        report
          ? `${report.ticker} · ${report.companyName || report.fileName}`
          : t("flow:reportDetail")
      }
      description={
        report
          ? t("flow:theHtmlReportRunsIn")
          : t("flow:detailViewForTheSelected")
      }
      actions={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={() => setLocation(`/reports/ticker/${encodeURIComponent(ticker)}`)}
          >
            <ArrowLeft className="size-4" />
            {t("flow:tickerArchive")}
          </Button>
          <Button type="button" variant="outline" onClick={() => setLocation("/reports")}>
            {t("scanner:layer2OpenPositions")}
          </Button>
          <Button type="button" variant="outline" onClick={() => void hydrate()}>
            <RefreshCw className="size-4" />
            {t("flow:refreshLocal")}
          </Button>
          <Button type="button" variant="outline" onClick={() => void reload()}>
            <RefreshCw className="size-4" />
            {t("flow:refreshPublished")}
          </Button>
        </>
      }
    >
      {loading ? (
        <LoadingState
          compact
          label={t("flow:stockHtmlReportGallery")}
        />
      ) : !report ? (
        <EmptyState
          description={
            error ||
            t("flow:checkTheTickerDateOr")
          }
          icon={error ? AlertCircle : FileSearch}
          role={error ? "alert" : "status"}
          title={t("flow:noReportWasFoundFor")}
          tone={error ? "danger" : "neutral"}
        />
      ) : (
        <>
          <section className="rounded-xl border border-border bg-card/95 p-6 shadow-2xl">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-border bg-background/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {report.reportDate}
                  </span>
                  <span className="rounded-full border border-border bg-background/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {report.exchange || t("flow:noExchange")}
                  </span>
                  <span
                    className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${getRecommendationTone(report.recommendation)}`}
                  >
                    {formatRecommendationLabel(report.recommendation, language)}
                  </span>
                </div>

                <div className="grid gap-3 md:grid-cols-4">
                  <article className="rounded-xl border border-border bg-background/55 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      {t("common:price")}
                    </p>
                    <p className="mt-2 text-xl font-semibold text-foreground">
                      {formatReportPrice(report.price, language)}
                    </p>
                    <Delta value={report.priceChangePct} className="mt-1 text-sm" />
                  </article>
                  <article className="rounded-xl border border-border bg-background/55 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      {t("flow:sections03e0")}
                    </p>
                    <p className="mt-2 text-xl font-semibold text-foreground">
                      {report.sections.length}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {report.sections.join(" · ") || t("marketing:openFlow")}
                    </p>
                  </article>
                  <article className="rounded-xl border border-border bg-background/55 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      {t("flow:charts")}
                    </p>
                    <p className="mt-2 text-xl font-semibold text-foreground">
                      {report.hasCharts ? t("flow:yes") : t("flow:no")}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {report.sourceLabel}
                    </p>
                  </article>
                  <article className="rounded-xl border border-border bg-background/55 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      {t("flow:language")}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant={language === "tr" ? "secondary" : "outline"}
                        onClick={() => onLanguageChange("tr")}
                        className="rounded-full"
                      >
                        <Languages className="size-3.5" />
                        {"TR"}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant={language === "en" ? "secondary" : "outline"}
                        onClick={() => onLanguageChange("en")}
                        className="rounded-full"
                      >
                        <Globe2 className="size-3.5" />
                        {"EN"}
                      </Button>
                    </div>
                  </article>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {report.sourceType === "upload" ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={async () => {
                      await removeReport(report.id);
                      setLocation("/reports");
                    }}
                  >
                    <Trash2 className="size-4" />
                    {t("flow:deleteLocalCopy")}
                  </Button>
                ) : null}
                {report.serverReportId ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setLocation(`/flow/${encodeURIComponent(report.serverReportId || "")}`)}
                  >
                    <MessageSquareText className="size-4" />
                    {"Community View"}
                  </Button>
                ) : null}
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card/90 p-6 text-sm leading-7 text-muted-foreground shadow-xl">
            {t("flow:securityNoteTheReportIs")}
          </section>

          <HtmlReportRenderer
            language={language}
            html={
              report.sourceType === "upload"
                ? report.rawHtml
                : serverDetailReport?.content.html || ""
            }
            emptyMessage={
              serverDetailError ||
              t("flow:theReportHtmlContentCould")
            }
            sourceLabel={report.sourceLabel}
            title={report.companyName || report.fileName}
          />
        </>
      )}
    </FlowLayout>
  );
}

