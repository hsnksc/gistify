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
      className="inline-flex items-center rounded-full border border-border bg-card p-1"
    >
      <button
        type="button"
        className={`min-h-11 rounded-full px-4 py-2 text-[clamp(0.875rem,2.8vw,0.95rem)] font-semibold transition-colors md:min-h-8 md:px-3 md:py-1 md:text-xs ${
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
        className={`min-h-11 rounded-full px-4 py-2 text-[clamp(0.875rem,2.8vw,0.95rem)] font-semibold transition-colors md:min-h-8 md:px-3 md:py-1 md:text-xs ${
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
