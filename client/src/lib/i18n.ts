export type AppLanguage = "tr" | "en";

export const APP_LANGUAGE_STORAGE_KEY = "app_language";

export function copy(language: AppLanguage, tr: string, en: string) {
  return language === "en" ? en : tr;
}
