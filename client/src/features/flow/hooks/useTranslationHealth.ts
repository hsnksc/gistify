import { useState, useEffect, useRef } from "react";
import type { AppLanguage } from "@/lib/i18n";

interface TranslationHealth {
  available: boolean | null; // null = loading, true = ok, false = unavailable
  checked: boolean;
}

export function useTranslationHealth(language: AppLanguage): TranslationHealth {
  const [available, setAvailable] = useState<boolean | null>(null);
  const checkedRef = useRef(false);

  useEffect(() => {
    if (language !== "en") {
      setAvailable(null);
      checkedRef.current = false;
      return;
    }

    if (checkedRef.current) return;
    checkedRef.current = true;

    // Ping translation API with a simple test
    fetch("/api/i18n/translate", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "tr",
        target: "en",
        texts: ["test"],
      }),
    })
      .then(res => {
        if (res.status === 503) {
          setAvailable(false);
        } else if (res.ok) {
          setAvailable(true);
        } else {
          setAvailable(false);
        }
      })
      .catch(() => {
        setAvailable(false);
      });
  }, [language]);

  return { available, checked: checkedRef.current };
}
