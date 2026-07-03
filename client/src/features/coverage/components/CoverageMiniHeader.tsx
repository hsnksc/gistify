import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import LanguageSelector from "@/components/LanguageSelector";
import { type AppLanguage, copy } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { type CoverageReport } from "../lib/coverageParser";

interface CoverageMiniHeaderProps {
  className?: string;
  language: AppLanguage;
  onLanguageChange: (lang: AppLanguage) => void;
  progress: number;
  report: CoverageReport;
}

export default function CoverageMiniHeader({
  className,
  language,
  onLanguageChange,
  progress,
  report,
}: CoverageMiniHeaderProps) {
  const { theme, toggleTheme } = useTheme();

  const signalBadgeClass = (signal: string) => {
    const upper = signal.toUpperCase();
    if (upper.includes("BEAR")) {
      return "border-rose-500/35 bg-rose-500/12 text-rose-500";
    }
    if (upper.includes("SPEC")) {
      return "border-sky-500/35 bg-sky-500/12 text-sky-500";
    }
    if (upper.includes("BULL")) {
      return "border-emerald-500/35 bg-emerald-500/12 text-emerald-500";
    }
    return "border-border bg-background/60 text-muted-foreground";
  };

  const change = report.metrics.changePct ?? 0;
  const changeTone = change >= 0 ? "text-emerald-500" : "text-rose-500";

  return (
    <div
      className={cn(
        "fixed inset-x-0 top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md transition-transform duration-300 print:hidden",
        className
      )}
    >
      {/* Progress bar */}
      <div className="h-[2px] w-full bg-border/50">
        <div
          className="h-full bg-sky-500 transition-[width] duration-150"
          style={{ width: `${Math.max(0, Math.min(100, progress * 100))}%` }}
        />
      </div>

      <div className="flex items-center justify-between gap-3 px-4 py-2">
        <div className="flex min-w-0 items-center gap-3">
          <span className="text-lg font-bold tracking-tight text-foreground">
            {report.ticker}
          </span>
          <span
            className={cn(
              "hidden rounded-md border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider sm:inline-flex",
              signalBadgeClass(report.signal)
            )}
          >
            {report.signal || "Coverage"}
          </span>
          <span className="hidden font-mono text-sm text-foreground md:inline">
            {report.metrics.price?.toFixed(2) ?? "-"} USD
          </span>
          <span className={cn("hidden text-xs font-medium sm:inline", changeTone)}>
            {change > 0 ? "+" : ""}
            {change.toFixed(2)}%
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <LanguageSelector language={language} onChange={onLanguageChange} />
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            aria-label={copy(language, "Temayi degistir", "Toggle theme")}
            title={copy(language, "Temayi degistir", "Toggle theme")}
          >
            {theme === "dark" ? (
              <Sun className="size-4" />
            ) : (
              <Moon className="size-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
