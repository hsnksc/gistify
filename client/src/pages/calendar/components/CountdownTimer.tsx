import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { copy, type AppLanguage } from "@/lib/i18n";

function getRemainingSeconds(target: string): number {
  return Math.floor((new Date(target).getTime() - Date.now()) / 1000);
}

function formatRemaining(totalSeconds: number): string {
  if (totalSeconds <= 0) return "00:00:00";
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function CountdownTimer({
  targetTime,
  language,
}: {
  targetTime: string;
  language: AppLanguage;
}) {
  const [remaining, setRemaining] = useState(() => getRemainingSeconds(targetTime));

  useEffect(() => {
    const interval = window.setInterval(() => {
      setRemaining(getRemainingSeconds(targetTime));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [targetTime]);

  if (remaining <= 0) {
    return (
      <span className="text-xs font-medium text-emerald-400">
        {copy(language, "Yayinda", "Live")}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-1.5 text-xs text-emerald-300">
      <Clock className="size-3" />
      <span>{formatRemaining(remaining)}</span>
    </div>
  );
}
