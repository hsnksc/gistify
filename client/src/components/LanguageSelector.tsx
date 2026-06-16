import type { AppLanguage } from "@/lib/i18n";

interface LanguageSelectorProps {
  language: AppLanguage;
  onChange: (next: AppLanguage) => void;
}

export default function LanguageSelector({
  language,
  onChange,
}: LanguageSelectorProps) {
  return (
    <div
      data-no-translate
      className="inline-flex items-center rounded-full border border-border bg-card p-0.5"
    >
      <button
        type="button"
        className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
          language === "tr"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
        onClick={() => onChange("tr")}
      >
        TR
      </button>
      <button
        type="button"
        className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
          language === "en"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
        onClick={() => onChange("en")}
      >
        EN
      </button>
    </div>
  );
}
