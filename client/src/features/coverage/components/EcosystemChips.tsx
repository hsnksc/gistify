import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

export interface EcosystemChipsProps {
  items: Array<{
    detay?: string;
    iliski: string;
    onem?: string;
    sirket?: string;
    ticker: string;
  }>;
  language?: "tr" | "en";
  onNavigate?: (ticker: string) => void;
}

export default function EcosystemChips({ items, language = "tr", onNavigate }: EcosystemChipsProps) {
  const t = (tr: string, en: string) => (language === "tr" ? tr : en);

  const importanceBorder = (onem?: string) => {
    if (!onem) return "border-border/60";
    const lower = onem.toLowerCase();
    if (lower.includes("kritik") || lower.includes("🔴")) return "border-rose-500/40";
    if (lower.includes("yuksek") || lower.includes("🟠")) return "border-amber-500/40";
    if (lower.includes("orta") || lower.includes("🟡")) return "border-yellow-400/40";
    return "border-border/60";
  };

  const importanceBg = (onem?: string) => {
    if (!onem) return "bg-background/35";
    const lower = onem.toLowerCase();
    if (lower.includes("kritik") || lower.includes("🔴")) return "bg-rose-500/8";
    if (lower.includes("yuksek") || lower.includes("🟠")) return "bg-amber-500/8";
    if (lower.includes("orta") || lower.includes("🟡")) return "bg-yellow-400/8";
    return "bg-background/35";
  };

  return (
    <div className="rounded-xl border border-border bg-background/40 p-5">
      <h3 className="mb-4 text-sm font-semibold text-foreground">
        {t("Ekosistem & Iliskili Hisseler", "Ecosystem & Related Stocks")}
      </h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => {
          const clickable = !!onNavigate;
          return (
            <button
              key={index}
              type="button"
              disabled={!clickable}
              onClick={() => onNavigate?.(item.ticker)}
              className={cn(
                "group flex items-center gap-2 rounded-lg border px-3 py-2 text-left transition-colors",
                importanceBorder(item.onem),
                importanceBg(item.onem),
                clickable
                  ? "hover:bg-background/55 cursor-pointer"
                  : "cursor-default opacity-70"
              )}
            >
              <span className="text-sm font-bold uppercase tracking-wide text-foreground">
                {item.ticker}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {item.iliski}
              </span>
              {clickable && (
                <ExternalLink className="size-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
