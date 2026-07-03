import { AlertCircle } from "lucide-react";
import { type AppLanguage, copy } from "@/lib/i18n";
import { type CoverageVizBlock, vizLabel } from "../lib/vizSchema";

interface VizRendererProps {
  block: CoverageVizBlock;
  language: AppLanguage;
}

/**
 * Faz 1 placeholder: viz bloklarını doğrular ve metadata kartı olarak gösterir.
 * Faz 2'de her `spec.type` için karşılık gelen SVG bileşeni buraya bağlanacak.
 */
export default function VizRenderer({ block, language }: VizRendererProps) {
  const { spec, error, raw } = block;

  if (!spec || error) {
    return (
      <div
        role="alert"
        className="rounded-xl border border-rose-500/25 bg-rose-500/8 p-4"
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 size-5 shrink-0 text-rose-300" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-rose-200">
              {vizLabel(language, "vizError")}
            </p>
            {error ? (
              <p className="mt-1 text-xs text-rose-200/80">{error}</p>
            ) : null}
            <details className="mt-3">
              <summary className="cursor-pointer text-xs text-rose-200/70">
                {vizLabel(language, "rawBlock")}
              </summary>
              <pre className="mt-2 max-h-48 overflow-auto rounded-lg bg-rose-950/30 p-3 text-[11px] text-rose-100/80">
                <code>{raw}</code>
              </pre>
            </details>
          </div>
        </div>
      </div>
    );
  }

  return (
    <figure className="rounded-xl border border-border bg-background/30 p-4">
      <figcaption className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        <span className="inline-flex h-2 w-2 rounded-full bg-sky-400" />
        {vizLabel(language, spec.type)}
      </figcaption>

      <div className="mt-4 rounded-lg border border-dashed border-border bg-background/40 p-8 text-center text-sm text-muted-foreground">
        {copy(
          language,
          "Bu görselleştirme Faz 2'de SVG olarak render edilecek.",
          "This visualization will render as SVG in Phase 2."
        )}
      </div>

      {spec.caption ? (
        <p className="mt-3 text-xs text-muted-foreground/80">
          <span className="font-medium text-muted-foreground">
            {vizLabel(language, "howToRead")}:{" "}
          </span>
          {spec.caption}
        </p>
      ) : null}
      {spec.insight ? (
        <p className="mt-2 text-xs text-foreground/90">
          <span className="font-medium text-muted-foreground">
            {vizLabel(language, "keyTakeaway")}:{" "}
          </span>
          {spec.insight}
        </p>
      ) : null}
    </figure>
  );
}
