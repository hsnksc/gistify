import { Button } from "@/components/ui/button";
import WorkspaceHeroPanel from "@/components/workspace/WorkspaceHeroPanel";
import { copy, type AppLanguage } from "@/lib/i18n";
import { FileText, RefreshCw } from "lucide-react";
import type { EarningsStrategyData } from "@shared/earnings";

interface EarningsHeroProps {
  language: AppLanguage;
  data: EarningsStrategyData;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export default function EarningsHero({
  language,
  data,
  onRefresh,
  isRefreshing,
}: EarningsHeroProps) {
  const eyebrow = data.currentMonth
    ? `${data.currentMonth}${data.nextMonth ? ` + ${data.nextMonth}` : ""}`
    : copy(language, "Rolling 2-Aylık Earnings Stratejisi", "Rolling 2-Month Earnings Strategy");

  return (
    <WorkspaceHeroPanel
      eyebrow={eyebrow}
      title={copy(
        language,
        "Earnings Opsiyon Stratejisi",
        "Earnings Option Strategy"
      )}
      description={
        data.summary ||
        copy(
          language,
          "Earnings sezonu için IV Rank, CPR ve Greeks bazlı opsiyon stratejileri.",
          "IV Rank, CPR, and Greeks-based option strategies for earnings season."
        )
      }
      badges={[
        data.macro.vix && (
          <Badge key="vix" label="VIX" value={data.macro.vix} />
        ),
        data.macro.sp500 && (
          <Badge key="sp500" label="S&P 500" value={data.macro.sp500} />
        ),
        data.macro.nasdaq && (
          <Badge key="nasdaq" label="Nasdaq" value={data.macro.nasdaq} />
        ),
      ].filter(Boolean)}
      actions={[
        <Button
          key="refresh"
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw
            className={`mr-2 size-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
          {copy(language, "Yenile", "Refresh")}
        </Button>,
        <Button key="md" variant="outline" size="sm" asChild>
          <a
            href="/api/earnings/download?format=md"
            download
            className="inline-flex items-center"
          >
            <FileText className="mr-2 size-4" />
            MD
          </a>
        </Button>,
        <Button key="docx" variant="outline" size="sm" asChild>
          <a
            href="/api/earnings/download?format=docx"
            download
            className="inline-flex items-center"
          >
            <FileText className="mr-2 size-4" />
            DOCX
          </a>
        </Button>,
      ]}
      reportStrip={
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span>
            {copy(language, "Rapor Tarihi", "Report Date")}: {data.reportDate || "-"}
          </span>
          <span>·</span>
          <span>
            {copy(language, "Rejim", "Regime")}: {data.macro.regime || "-"}
          </span>
        </div>
      }
      statusBar={
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          {data.executiveSummary.slice(0, 3).map((item, index) => (
            <span
              key={index}
              className="inline-flex items-center rounded-full border border-border bg-background px-2 py-1"
            >
              {item}
            </span>
          ))}
        </div>
      }
      overlayClassName="bg-[linear-gradient(135deg,rgba(14,165,233,0.08),rgba(99,102,241,0.04),transparent)]"
    />
  );
}

function Badge({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium">
      <span className="text-muted-foreground">{label}:</span>
      <span className="text-foreground">{value}</span>
    </span>
  );
}
