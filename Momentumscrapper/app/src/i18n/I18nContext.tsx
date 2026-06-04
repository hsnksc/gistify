import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { translationsTR } from "@/locales/tr";
import { translationsEN } from "@/locales/en";

export type Lang = "tr" | "en";

const allTranslations: Record<Lang, typeof translationsTR> = {
  tr: translationsTR,
  en: translationsEN,
};

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const Ctx = createContext<I18nCtx>({
  lang: "tr",
  setLang: () => {},
  t: (k) => k,
});

function getNested(obj: Record<string, unknown>, path: string): string | undefined {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current && typeof current === "object" && part in current) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }
  return typeof current === "string" ? current : undefined;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem("scanner-lang") as Lang | null;
    return saved === "en" ? "en" : "tr";
  });

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem("scanner-lang", l);
  }, []);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>): string => {
      const dict = allTranslations[lang];
      let text = getNested(dict as unknown as Record<string, unknown>, key) || key;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          text = text.replace(new RegExp(`{{${k}}}`, "g"), String(v));
        }
      }
      return text;
    },
    [lang]
  );

  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export function useTranslation() {
  return useContext(Ctx);
}

/** Mini dil switcher button for header */
export function LangSwitcher() {
  const { lang, setLang } = useTranslation();
  return (
    <button
      onClick={() => setLang(lang === "tr" ? "en" : "tr")}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/60 text-slate-300 hover:text-white hover:bg-slate-700 transition-all text-xs font-medium border border-slate-700/40"
      title={lang === "tr" ? "Switch to English" : "Türkçeye geç"}
    >
      <span className={lang === "tr" ? "text-emerald-400" : "text-slate-500"}>TR</span>
      <span className="text-slate-600">/</span>
      <span className={lang === "en" ? "text-emerald-400" : "text-slate-500"}>EN</span>
    </button>
  );
}
