import { useState } from "react";
import { Check, Copy, Zap } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { copy as i18nCopy, type AppLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { THEME } from "../Calendar.theme";

function HighlightText({
  text,
  keywords,
}: {
  text: string;
  keywords: string[];
}) {
  const pattern = new RegExp(`(${keywords.join("|")})`, "gi");
  const parts = text.split(pattern);
  return (
    <span>
      {parts.map((part, i) =>
        keywords.some(
          (k) => k.toLowerCase() === part.toLowerCase()
        ) ? (
          <span key={i} className="font-semibold text-emerald-200">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </span>
  );
}

function extractLevels(text: string): { label: string; value: string }[] {
  const regex =
    /(VIX|DXY|EUR\/USD|GBP\/USD|USD\/JPY|BTC|SPX|NDX)\s+([\d.,]+)/gi;
  const matches = Array.from(text.matchAll(regex));
  return matches.map((m) => ({ label: m[1], value: m[2] }));
}

export function MarketNarrativeCard({
  narrative,
  language,
}: {
  narrative: string;
  language: AppLanguage;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!narrative) return;
    await navigator.clipboard.writeText(narrative);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const safeNarrative =
    narrative ||
    i18nCopy(
      language,
      "Piyasa hikayesi henuz yuklenmedi.",
      "Market narrative has not loaded yet."
    );

  const levels = extractLevels(safeNarrative);

  return (
    <Card className={cn("overflow-hidden", THEME.softCardClassName)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Zap className={cn("size-5", THEME.iconClassName)} />
          {i18nCopy(language, "Piyasa Hikayesi", "Market Narrative")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {levels.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {levels.map((l, i) => (
              <Badge
                key={i}
                variant="outline"
                className="bg-emerald-500/5 text-xs"
              >
                {l.label}: {l.value}
              </Badge>
            ))}
          </div>
        )}
        <div className="rounded-xl border border-white/10 bg-black/20 p-3.5">
          <p className="text-[13px] leading-6 text-foreground/88">
            <HighlightText
              text={safeNarrative}
              keywords={["VIX", "FED", "BOJ", "DXY", "EUR/USD", "NFP", "CPI"]}
            />
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="mt-2 text-xs"
        >
          {copied ? (
            <Check className="size-3 mr-1" />
          ) : (
            <Copy className="size-3 mr-1" />
          )}
          {copied
            ? i18nCopy(language, "Kopyalandi", "Copied")
            : i18nCopy(language, "Kopyala", "Copy")}
        </Button>
      </CardContent>
    </Card>
  );
}

