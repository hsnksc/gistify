import { type ReactNode } from "react";
import { type AppLanguage } from "@/lib/i18n";
import { vizLabel } from "../../lib/vizSchema";

interface VizContainerProps {
  ariaLabel: string;
  caption?: string;
  children: ReactNode;
  className?: string;
  insight?: string;
  language: AppLanguage;
  title: string;
}

export default function VizContainer({
  ariaLabel,
  caption,
  children,
  className,
  insight,
  language,
  title,
}: VizContainerProps) {
  return (
    <figure className={className}>
      <figcaption className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        <span className="inline-flex h-2 w-2 rounded-full bg-sky-400" />
        {title}
      </figcaption>

      {children}

      {caption ? (
        <p className="mt-3 text-xs text-muted-foreground/80">
          <span className="font-medium text-muted-foreground">
            {vizLabel(language, "howToRead")}:{" "}
          </span>
          {caption}
        </p>
      ) : null}
      {insight ? (
        <p className="mt-2 text-xs text-foreground/90">
          <span className="font-medium text-muted-foreground">
            {vizLabel(language, "keyTakeaway")}:{" "}
          </span>
          {insight}
        </p>
      ) : null}
    </figure>
  );
}
