import { AppLanguage, t } from "@/lib/i18n";

import type {
  CalendarActualSurprise,
  CalendarEvent,
  CalendarImportance,
  CalendarLiveSyncStatus,
  CalendarOptionSetup,
  CalendarPipelineStatus,
} from "@shared/calendar";
export function formatTimestamp(
  value: string | null | undefined,
  language: AppLanguage
) {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat(language === "en" ? "en-US" : "tr-TR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsed);
}

export function formatRelativeTime(
  value: string | null | undefined,
  language: AppLanguage
) {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  const diff = Date.now() - parsed.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return t("calendar:justNow");
  if (mins < 60)
    return `${mins} ${t("calendar:minAgo")}`;
  const hours = Math.floor(mins / 60);
  if (hours < 24)
    return `${hours} ${t("calendar:hAgo")}`;
  const days = Math.floor(hours / 24);
  return `${days} ${t("calendar:dAgo")}`;
}

export function formatDateLabel(
  value: string | undefined,
  language: AppLanguage
) {
  if (!value) return "-";
  const normalized = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? `${value}T00:00:00Z`
    : value;
  const parsed = new Date(normalized);
  if (Number.isNaN(parsed.getTime())) return value;
  const weekday = new Intl.DateTimeFormat(
    language === "en" ? "en-US" : "tr-TR",
    { weekday: "long" }
  ).format(parsed);
  const dayMonth = new Intl.DateTimeFormat(
    language === "en" ? "en-US" : "tr-TR",
    { day: "2-digit", month: "short", year: "numeric" }
  ).format(parsed);
  return `${weekday}, ${dayMonth}`;
}

export function pipelineStatusLabel(
  status: CalendarPipelineStatus,
  language: AppLanguage
) {
  switch (status) {
    case "ok":
      return t("common:synced");
    case "stale":
      return t("common:stale");
    case "error":
      return t("common:error");
    default:
      return t("common:idle");
  }
}

export function pipelineStatusClass(status: CalendarPipelineStatus) {
  switch (status) {
    case "ok":
      return "border-emerald-500/25 bg-emerald-500/12 text-emerald-200";
    case "stale":
      return "border-amber-500/25 bg-amber-500/12 text-amber-200";
    case "error":
      return "border-rose-500/25 bg-rose-500/12 text-rose-200";
    default:
      return "border-border bg-background/70 text-muted-foreground";
  }
}

export function liveSyncStatusLabel(
  status: CalendarLiveSyncStatus,
  language: AppLanguage
) {
  switch (status) {
    case "ok":
      return t("common:synced");
    case "error":
      return t("common:error");
    default:
      return t("common:idle");
  }
}

export function importanceLabel(
  importance: CalendarImportance,
  language: AppLanguage
) {
  switch (importance) {
    case "high":
      return t("common:high");
    case "medium":
      return t("common:medium");
    default:
      return t("common:low");
  }
}

export function importanceClass(importance: CalendarImportance) {
  switch (importance) {
    case "high":
      return "border-rose-500/30 bg-rose-500/15 text-rose-200 font-semibold shadow-[0_0_12px_rgba(244,63,94,0.08)]";
    case "medium":
      return "border-amber-500/30 bg-amber-500/15 text-amber-200 font-semibold shadow-[0_0_12px_rgba(245,158,11,0.06)]";
    default:
      return "border-slate-500/25 bg-slate-500/10 text-slate-300";
  }
}

export function importanceRowClass(importance: CalendarImportance) {
  switch (importance) {
    case "high":
      return "border-l-2 border-l-rose-500/50 bg-rose-500/[0.04] hover:bg-rose-500/[0.07]";
    case "medium":
      return "border-l-2 border-l-amber-500/40 bg-amber-500/[0.03] hover:bg-amber-500/[0.06]";
    default:
      return "hover:bg-white/[0.02]";
  }
}

export function biasLabel(
  bias: CalendarOptionSetup["bias"],
  language: AppLanguage
) {
  switch (bias) {
    case "bullish":
      return t("calendar:bullish");
    case "bearish":
      return t("calendar:bearish");
    default:
      return t("common:neutral");
  }
}

export function biasClass(bias: CalendarOptionSetup["bias"]) {
  switch (bias) {
    case "bullish":
      return "border-emerald-500/25 bg-emerald-500/12 text-emerald-200";
    case "bearish":
      return "border-rose-500/25 bg-rose-500/12 text-rose-200";
    default:
      return "border-amber-500/25 bg-amber-500/12 text-amber-200";
  }
}

export function parseNumericValue(value: string | undefined): number | null {
  if (!value) return null;
  const cleaned = value
    .replace(/%/g, "")
    .replace(/,/g, ".")
    .replace(/[^\d.\-]/g, "");
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

export function actualHighlightClass(
  actual: string | undefined,
  forecast: string | undefined,
  impactDirection: CalendarEvent["impactDirection"] = "positive"
): string {
  if (!actual || !forecast) return "text-foreground";
  const actualValue = parseNumericValue(actual);
  const forecastValue = parseNumericValue(forecast);
  if (actualValue === null || forecastValue === null) return "text-foreground";
  const isHigher = actualValue > forecastValue;
  if (impactDirection === "positive") {
    return isHigher
      ? "text-emerald-400 font-semibold"
      : "text-rose-400 font-semibold";
  }
  return isHigher
    ? "text-rose-400 font-semibold"
    : "text-emerald-400 font-semibold";
}

export function surpriseClass(
  surprise: CalendarActualSurprise | undefined
) {
  if (!surprise) {
    return "border-white/10 bg-white/5 text-muted-foreground";
  }

  switch (surprise.direction) {
    case "above":
      return "border-emerald-500/25 bg-emerald-500/12 text-emerald-200";
    case "below":
      return "border-rose-500/25 bg-rose-500/12 text-rose-200";
    default:
      return "border-amber-500/25 bg-amber-500/12 text-amber-200";
  }
}

export function formatSurprise(
  surprise: CalendarActualSurprise | undefined
) {
  if (!surprise) {
    return null;
  }

  if (surprise.pct !== undefined) {
    return `${surprise.pct > 0 ? "+" : ""}${surprise.pct}%`;
  }

  return surprise.direction === "above"
    ? "↑"
    : surprise.direction === "below"
      ? "↓"
      : "=";
}

export function getDayTheme(
  events: CalendarEvent[],
  language: AppLanguage
): string | null {
  const names = events.map((e) => e.eventName.toLowerCase());
  if (names.some((n) => n.includes("fed") && n.includes("faiz")))
    return t("calendar:fedDay");
  if (names.some((n) => n.includes("nfp") || n.includes("tarim disi")))
    return t("calendar:nfpDay");
  if (names.some((n) => n.includes("boe") || n.includes("ingiltere")))
    return t("calendar:boeDay");
  if (names.some((n) => n.includes("ecb") || n.includes("avro")))
    return t("calendar:ecbDay");
  return null;
}

export type MarketSession = {
  label: string;
  className: string;
};

export function getCurrentMarketSession(
  language: AppLanguage
): MarketSession {
  const now = new Date();
  const hour = now.getUTCHours();
  if (hour >= 13 && hour < 20) {
    return {
      label: t("calendar:openMarket"),
      className: "border-emerald-500/25 bg-emerald-500/12 text-emerald-200",
    };
  }
  if (hour >= 8 && hour < 13) {
    return {
      label: t("calendar:preMarket"),
      className: "border-amber-500/25 bg-amber-500/12 text-amber-200",
    };
  }
  return {
    label: t("calendar:closed"),
    className: "border-slate-500/25 bg-slate-500/10 text-slate-300",
  };
}

