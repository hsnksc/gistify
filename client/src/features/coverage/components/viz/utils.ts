import { type AppLanguage } from "@/lib/i18n";

export function formatCurrency(value: number, compact = false): string {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: value >= 100 || compact ? 0 : 2,
    minimumFractionDigits: 0,
    notation: compact && Math.abs(value) >= 1000 ? "compact" : "standard",
    style: "currency",
  }).format(value);
}

export function formatNumber(value: number, digits = 2): string {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number, digits = 1): string {
  if (!Number.isFinite(value)) return "—";
  return `${value > 0 ? "+" : ""}${value.toFixed(digits)}%`;
}

export function formatDate(iso: string, language: AppLanguage): string {
  const parsed = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return iso;
  return new Intl.DateTimeFormat(language === "en" ? "en-US" : "tr-TR", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(parsed);
}

export function daysBetween(a: string, b: string): number {
  const start = new Date(`${a}T00:00:00Z`).getTime();
  const end = new Date(`${b}T00:00:00Z`).getTime();
  if (Number.isNaN(start) || Number.isNaN(end)) return 0;
  return Math.round((end - start) / (1000 * 60 * 60 * 24));
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function colorForTone(tone?: string): string {
  switch (tone?.toLowerCase()) {
    case "bull":
    case "positive":
    case "buy":
      return "var(--color-bull)";
    case "bear":
    case "negative":
    case "sell":
      return "var(--color-bear)";
    case "caution":
    case "neutral":
    case "hold":
      return "var(--color-caution)";
    default:
      return "var(--color-info)";
  }
}

export function colorForRelation(relation: string): string {
  switch (relation) {
    case "customer":
      return "var(--color-bull)";
    case "supplier":
      return "var(--color-info)";
    case "partner":
      return "var(--color-accent)";
    case "underwriter":
      return "var(--color-caution)";
    case "frenemy":
    default:
      return "var(--color-bear)";
  }
}

export function classNames(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function uniqueId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}
