import { AlertTriangle } from "lucide-react";
import { copy, type AppLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { FOMCData } from "@shared/earnings";

interface FOMCWarningBannerProps {
  language: AppLanguage;
  fomc: FOMCData;
}

export default function FOMCWarningBanner({
  language,
  fomc,
}: FOMCWarningBannerProps) {
  const status = fomc.status || "distant";
  const days = fomc.daysUntil ?? undefined;

  const config = {
    distant: {
      border: "border-emerald-500/20",
      bg: "bg-emerald-500/10",
      text: "text-emerald-200",
      icon: "text-emerald-300",
    },
    approaching: {
      border: "border-amber-500/20",
      bg: "bg-amber-500/10",
      text: "text-amber-200",
      icon: "text-amber-300",
    },
    imminent: {
      border: "border-orange-500/20",
      bg: "bg-orange-500/10",
      text: "text-orange-200",
      icon: "text-orange-300",
    },
    blackout: {
      border: "border-rose-500/20",
      bg: "bg-rose-500/10",
      text: "text-rose-200",
      icon: "text-rose-300",
    },
  }[status];

  return (
    <div
      className={cn(
        "rounded-xl border p-4",
        config.border,
        config.bg
      )}
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className={cn("mt-0.5 size-5 shrink-0", config.icon)} />
        <div className="space-y-1">
          <h3 className={cn("font-semibold", config.text)}>
            {copy(language, "FOMC Uyarısı", "FOMC Warning")}
          </h3>
          <p className="text-sm text-foreground/80">
            {copy(
              language,
              `${fomc.date || "-"} tarihinde FOMC toplantısı var.`,
              `FOMC meeting on ${fomc.date || "-"}.`
            )}
            {days !== undefined &&
              ` ${copy(language, "Kalan gün:", "Days left:")} ${days}`}
          </p>
          {fomc.blackoutStart && (
            <p className="text-xs text-muted-foreground">
              {copy(language, "Blackout başlangıcı", "Blackout starts")}: {fomc.blackoutStart}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
