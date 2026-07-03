import i18next from "i18next";
import { createContext, useContext } from "react";
import type { TranslationKey } from "@/i18n.generated";

export type AppLanguage = "tr" | "en";

export const SUPPORTED_LANGUAGES = ["tr", "en"] as const;
export const DEFAULT_LANGUAGE: AppLanguage = "tr";
export const APP_LANGUAGE_STORAGE_KEY = "app_language";

export const AppLanguageContext = createContext<AppLanguage>(DEFAULT_LANGUAGE);

type LocaleResources = Record<string, string>;
type NamespacedResources = Record<string, LocaleResources>;
type AppResources = Record<AppLanguage, NamespacedResources>;

const localeModules = import.meta.glob<LocaleResources>("../locales/*/*.json", {
  eager: true,
  import: "default",
});

const resources = Object.entries(localeModules).reduce<AppResources>(
  (accumulator, [modulePath, value]) => {
    const match = modulePath.match(/\/locales\/(tr|en)\/([^/]+)\.json$/);
    if (!match) {
      return accumulator;
    }

    const [, language, namespace] = match;
    accumulator[language as AppLanguage][namespace] = value;
    return accumulator;
  },
  {
    en: {},
    tr: {},
  }
);

function buildMissingKeyLabel(key: string) {
  return `⟦${key}⟧`;
}

export const i18n = i18next.createInstance();

void i18n.init({
  defaultNS: "common",
  fallbackLng: DEFAULT_LANGUAGE,
  interpolation: {
    escapeValue: false,
  },
  parseMissingKeyHandler: (key: string) => {
    if (import.meta.env.DEV) {
      console.warn(`[i18n] Missing key: ${key}`);
      return buildMissingKeyLabel(key);
    }

    return key;
  },
  resources,
  returnEmptyString: false,
  supportedLngs: [...SUPPORTED_LANGUAGES],
});

export function isAppLanguage(value: unknown): value is AppLanguage {
  return value === "tr" || value === "en";
}

export function getIntlLocale(language: AppLanguage = DEFAULT_LANGUAGE) {
  return language === "en" ? "en-US" : "tr-TR";
}

export function getOgLocale(language: AppLanguage = DEFAULT_LANGUAGE) {
  return language === "en" ? "en_US" : "tr_TR";
}

export function getLanguageFromNavigator() {
  if (typeof navigator === "undefined") {
    return DEFAULT_LANGUAGE;
  }

  return navigator.language.toLowerCase().startsWith("tr") ? "tr" : "en";
}

export function getLanguageFromPathname(pathname: string) {
  const normalizedPath = pathname.trim() || "/";
  const match = normalizedPath.match(/^\/(tr|en)(?=\/|$)/i);
  return (match?.[1]?.toLowerCase() as AppLanguage | undefined) || null;
}

export function stripLanguagePrefix(pathname: string) {
  const normalizedPath = pathname.trim() || "/";
  const stripped = normalizedPath.replace(/^\/(?:tr|en)(?=\/|$)/i, "");
  return stripped || "/";
}

export function localizePath(pathname: string, language: AppLanguage) {
  const normalizedPath = stripLanguagePrefix(pathname);
  if (normalizedPath === "/") {
    return `/${language}`;
  }

  return `/${language}${normalizedPath.startsWith("/") ? normalizedPath : `/${normalizedPath}`}`;
}

export function readStoredLanguage() {
  if (typeof window === "undefined") {
    return DEFAULT_LANGUAGE;
  }

  try {
    const stored = window.localStorage.getItem(APP_LANGUAGE_STORAGE_KEY);
    return isAppLanguage(stored) ? stored : DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE;
  }
}

export function persistLanguagePreference(language: AppLanguage) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(APP_LANGUAGE_STORAGE_KEY, language);
  } catch {
    // Ignore storage failures to keep language switching resilient.
  }
}

export function persistLanguageCookie(language: AppLanguage) {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${APP_LANGUAGE_STORAGE_KEY}=${encodeURIComponent(language)}; Path=/; Max-Age=31536000; SameSite=Lax`;
}

export function resolvePreferredLanguage(pathname: string) {
  return (
    getLanguageFromPathname(pathname) ||
    readStoredLanguage() ||
    getLanguageFromNavigator() ||
    DEFAULT_LANGUAGE
  );
}

export async function syncI18nLanguage(language: AppLanguage) {
  persistLanguagePreference(language);
  persistLanguageCookie(language);

  if (typeof document !== "undefined") {
    document.documentElement.lang = language;
  }

  if (i18n.resolvedLanguage !== language) {
    await i18n.changeLanguage(language);
  }
}

export function t(key: TranslationKey, options?: Record<string, unknown>) {
  return i18n.t(key, options);
}

export function useAppLanguage() {
  return useContext(AppLanguageContext);
}
