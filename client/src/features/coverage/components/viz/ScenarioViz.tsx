import { type AppLanguage } from "@/lib/i18n";
import { type ScenarioSpec } from "../../lib/vizSchema";
import VizContainer from "./VizContainer";
import { colorForTone, formatCurrency } from "./utils";

interface ScenarioVizProps {
  language: AppLanguage;
  spec: ScenarioSpec;
}

export default function ScenarioViz({ language, spec }: ScenarioVizProps) {
  const { cases, caption, insight } = spec;

  const keyTone = (key: string): string => {
    const lower = key.toLowerCase();
    if (lower.includes("bull")) return "bull";
    if (lower.includes("bear")) return "bear";
    return "neutral";
  };

  return (
    <VizContainer
      ariaLabel={`Scenario analysis with ${cases.length} cases`}
      caption={caption}
      className="rounded-xl border border-border bg-background/30 p-4"
      insight={insight}
      language={language}
      title={language === "en" ? "Scenarios" : "Senaryolar"}
    >
      <div className="grid gap-3 md:grid-cols-3">
        {cases.map(scenario => {
          const tone = keyTone(scenario.key);
          const borderColor = colorForTone(tone);
          const pl = scenario.pl ?? 0;

          return (
            <article
              key={scenario.key}
              className="relative overflow-hidden rounded-xl border border-border bg-background/40 p-4"
              style={{ borderTopColor: borderColor, borderTopWidth: 3 }}
            >
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-foreground">{scenario.title}</h4>
                <span
                  className="rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                  style={{
                    backgroundColor: `${borderColor}20`,
                    color: borderColor,
                  }}
                >
                  {scenario.key}
                </span>
              </div>

              {scenario.range ? (
                <div className="mt-3">
                  <div className="h-2 w-full rounded-full bg-border-subtle" style={{ backgroundColor: "var(--color-border-subtle)" }}>
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: "100%",
                        backgroundColor: borderColor,
                        opacity: 0.8,
                      }}
                    />
                  </div>
                  <div className="mt-1 flex justify-between font-mono text-[10px] text-muted-foreground">
                    <span>{formatCurrency(scenario.range[0])}</span>
                    <span>{formatCurrency(scenario.range[1])}</span>
                  </div>
                </div>
              ) : null}

              {typeof scenario.pl === "number" ? (
                <p className="mt-3 font-mono text-sm font-semibold" style={{ color: pl >= 0 ? "var(--color-bull)" : "var(--color-bear)" }}>
                  P&L {pl > 0 ? "+" : ""}
                  {formatCurrency(pl)}
                </p>
              ) : null}

              {scenario.drivers && scenario.drivers.length > 0 ? (
                <ul className="mt-3 space-y-2">
                  {scenario.drivers.map((driver, i) => {
                    const [actor, note, driverTone] = driver;
                    const driverColor = colorForTone(driverTone ?? tone);
                    return (
                      <li key={i} className="flex items-start gap-2 text-xs">
                        <span
                          className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ backgroundColor: driverColor }}
                        />
                        <span className="text-muted-foreground">
                          <span className="font-medium text-foreground">{actor}</span>
                          <span className="mx-1">·</span>
                          {note}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </article>
          );
        })}
      </div>
    </VizContainer>
  );
}
