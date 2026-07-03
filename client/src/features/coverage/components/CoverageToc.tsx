import { useEffect, useState } from "react";
import { type AppLanguage, copy } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { type CoverageSection } from "../lib/coverageParser";

interface CoverageTocProps {
  className?: string;
  language: AppLanguage;
  sections: CoverageSection[];
}

export default function CoverageToc({ className, language, sections }: CoverageTocProps) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? "");

  useEffect(() => {
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-15% 0px -60% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    sections.forEach(section => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav
      className={cn(
        "sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-xl border border-border bg-background/50 p-4 backdrop-blur-sm",
        className
      )}
      aria-label={copy(language, "Bolum navigasyonu", "Section navigation")}
    >
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {copy(language, "Icerik", "Contents")}
      </p>
      <ul className="space-y-1">
        {sections.map(section => (
          <li key={section.id}>
            <button
              type="button"
              onClick={() =>
                document.getElementById(section.id)?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                })
              }
              className={cn(
                "w-full rounded-lg px-2 py-1.5 text-left text-xs transition-colors",
                section.level === 3 && "pl-4",
                activeId === section.id
                  ? "bg-accent/10 font-medium text-foreground"
                  : "text-muted-foreground hover:bg-background/60 hover:text-foreground"
              )}
            >
              {section.title}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
