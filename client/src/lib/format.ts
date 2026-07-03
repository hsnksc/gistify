import { i18n, type AppLanguage, DEFAULT_LANGUAGE, getIntlLocale } from "@/lib/i18n";

function activeLanguage(language?: AppLanguage) {
  return language || (i18n.resolvedLanguage as AppLanguage) || DEFAULT_LANGUAGE;
}

export function formatNumber(
  value: number,
  options?: Intl.NumberFormatOptions,
  language?: AppLanguage
) {
  return new Intl.NumberFormat(getIntlLocale(activeLanguage(language)), options).format(
    value
  );
}

export function formatCurrency(
  value: number,
  currency = "USD",
  options?: Intl.NumberFormatOptions,
  language?: AppLanguage
) {
  return formatNumber(
    value,
    {
      currency,
      style: "currency",
      ...options,
    },
    language
  );
}

export function formatDate(
  value: Date | number | string,
  options?: Intl.DateTimeFormatOptions,
  language?: AppLanguage
) {
  const parsed = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat(getIntlLocale(activeLanguage(language)), options).format(
    parsed
  );
}

export function formatPercent(
  value: number,
  options?: Intl.NumberFormatOptions,
  language?: AppLanguage
) {
  return formatNumber(
    value,
    {
      style: "percent",
      ...options,
    },
    language
  );
}
