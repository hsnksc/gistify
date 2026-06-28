import { useEffect, useState } from "react";
import { APP_LANGUAGE_STORAGE_KEY, type AppLanguage } from "@/lib/i18n";

function readStoredLanguage(): AppLanguage {
  if (typeof window === "undefined") {
    return "tr";
  }

  try {
    return window.localStorage.getItem(APP_LANGUAGE_STORAGE_KEY) === "en"
      ? "en"
      : "tr";
  } catch {
    return "tr";
  }
}

function persistLanguage(language: AppLanguage) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(APP_LANGUAGE_STORAGE_KEY, language);
  } catch {
    // Ignore storage failures so auth bootstrap cannot get stuck behind UI preferences.
  }
}

export function useAppLanguage() {
  const [language, setLanguage] = useState<AppLanguage>(() =>
    readStoredLanguage()
  );

  useEffect(() => {
    persistLanguage(language);
    document.documentElement.lang = language;
  }, [language]);

  return {
    language,
    setLanguage,
  };
}
