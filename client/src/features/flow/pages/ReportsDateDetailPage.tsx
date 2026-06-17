import { useMemo } from "react";
import {
  ArrowLeft,
  Globe2,
  Languages,
  MessageSquareText,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { useLocation } from "wouter";
import HtmlReportRenderer from "@/components/reports/HtmlReportRenderer";
import { Button } from "@/components/ui/button";
import { usePageMeta } from "@/hooks/usePageMeta";
import { copy, type AppLanguage } from "@/lib/i18n";
import FlowLayout from "../components/FlowLayout";
import { useFlowReport } from "../hooks/useFlowReport";
import { useFlowReportSummaries } from "../hooks/useFlowReportSummaries";
import {
  adaptFlowReportToStoredReport,
  findStoredReport,
  formatPriceChange,
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
    useFlowReportSummaries(language);
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
      ...localReports,
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
    : copy(language, "Gistify Rapor Detayi", "Gistify Report Detail");
  const pageDescription = report
    ? copy(
        language,
        `${report.ticker} icin ${report.reportDate} tarihli HTML rapor detayi.`,
        `HTML report detail for ${report.ticker} dated ${report.reportDate}.`
      )
    : copy(
        language,
        "Secilen ticker ve tarih icin rapor detay gorunumu.",
        "Report detail view for the selected ticker and date."
      );

  usePageMeta({
    description: pageDescription,
    title: pageTitle,
  });

  return (
    <FlowLayout
      language={language}
      eyebrow="Reports"
      title={
        report
          ? `${report.ticker} · ${report.companyName || report.fileName}`
          : copy(language, "Rapor detayi", "Report detail")
      }
      description={
        report
          ? copy(
              language,
              "HTML rapor sandbox'li iframe icinde calisir; ustte parse edilmis ozet seridi kalir ve dil butonlari dogrudan rapor dilini degistirir.",
              "The HTML report runs in a sandboxed iframe; a parsed summary strip stays above it and the language buttons switch the report language directly."
            )
          : copy(
              language,
              "Secilen ticker ve tarihe ait rapor detay gorunumu.",
              "Detail view for the selected ticker and date."
            )
      }
      actions={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={() => setLocation(`/reports/ticker/${encodeURIComponent(ticker)}`)}
          >
            <ArrowLeft className="size-4" />
            {copy(language, "Ticker Arsivi", "Ticker Archive")}
          </Button>
          <Button type="button" variant="outline" onClick={() => setLocation("/reports")}>
            {copy(language, "Tum Raporlar", "All Reports")}
          </Button>
          <Button type="button" variant="outline" onClick={() => void hydrate()}>
            <RefreshCw className="size-4" />
            {copy(language, "Yereli Yenile", "Refresh Local")}
          </Button>
          <Button type="button" variant="outline" onClick={() => void reload()}>
            <RefreshCw className="size-4" />
            {copy(language, "Yayinliyi Yenile", "Refresh Published")}
          </Button>
        </>
      }
    >
      {loading ? (
        <div className="rounded-[1.8rem] border border-border bg-card/75 px-5 py-6 text-sm text-muted-foreground">
          {copy(language, "Rapor detayi yukleniyor.", "Loading report detail.")}
        </div>
      ) : !report ? (
        <div className="rounded-[1.8rem] border border-dashed border-border bg-card/75 px-5 py-6 text-sm text-muted-foreground">
          {error ||
            copy(
              language,
              "Bu ticker ve tarih icin rapor bulunamadi.",
              "No report was found for this ticker and date."
            )}
        </div>
      ) : (
        <>
          <section className="rounded-[2rem] border border-border bg-card/95 p-5 shadow-2xl">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-border bg-background/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {report.reportDate}
                  </span>
                  <span className="rounded-full border border-border bg-background/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {report.exchange || copy(language, "Borsa yok", "No exchange")}
                  </span>
                  <span
                    className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${getRecommendationTone(report.recommendation)}`}
                  >
                    {formatRecommendationLabel(report.recommendation, language)}
                  </span>
                </div>

                <div className="grid gap-3 md:grid-cols-4">
                  <article className="rounded-[1.2rem] border border-border bg-background/55 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      {copy(language, "Fiyat", "Price")}
                    </p>
                    <p className="mt-2 text-xl font-semibold text-foreground">
                      {formatReportPrice(report.price, language)}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatPriceChange(report.priceChangePct, language)}
                    </p>
                  </article>
                  <article className="rounded-[1.2rem] border border-border bg-background/55 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      {copy(language, "Bolumler", "Sections")}
                    </p>
                    <p className="mt-2 text-xl font-semibold text-foreground">
                      {report.sections.length}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {report.sections.join(" · ") || copy(language, "Algilanmadi", "Not detected")}
                    </p>
                  </article>
                  <article className="rounded-[1.2rem] border border-border bg-background/55 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      {copy(language, "Grafik", "Charts")}
                    </p>
                    <p className="mt-2 text-xl font-semibold text-foreground">
                      {report.hasCharts ? copy(language, "Var", "Yes") : copy(language, "Yok", "No")}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {report.sourceLabel}
                    </p>
                  </article>
                  <article className="rounded-[1.2rem] border border-border bg-background/55 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      {copy(language, "Dil", "Language")}
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
                        TR
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant={language === "en" ? "secondary" : "outline"}
                        onClick={() => onLanguageChange("en")}
                        className="rounded-full"
                      >
                        <Globe2 className="size-3.5" />
                        EN
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
                    {copy(language, "Yerel Kaydi Sil", "Delete Local Copy")}
                  </Button>
                ) : null}
                {report.serverReportId ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setLocation(`/flow/${encodeURIComponent(report.serverReportId || "")}`)}
                  >
                    <MessageSquareText className="size-4" />
                    {copy(language, "Community View", "Community View")}
                  </Button>
                ) : null}
              </div>
            </div>
          </section>

          <section className="rounded-[1.8rem] border border-border bg-card/90 p-5 text-sm leading-7 text-muted-foreground shadow-xl">
            {copy(
              language,
              "Guvenlik notu: rapor ana uygulama DOM'una basilmiyor; iframe `sandbox=\"allow-scripts\"` ile izole aciliyor ve `allow-same-origin` verilmedigi icin rapor script'leri uygulama kabuguna erisemiyor.",
              "Security note: the report is not injected into the main app DOM; it runs inside an iframe with `sandbox=\"allow-scripts\"` and without `allow-same-origin`, so report scripts cannot reach the app shell."
            )}
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
              copy(
                language,
                "Rapor HTML icerigi yuklenemedi.",
                "The report HTML content could not be loaded."
              )
            }
          />
        </>
      )}
    </FlowLayout>
  );
}
