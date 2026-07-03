import { useMemo } from "react";
import { type AppLanguage } from "@/lib/i18n";
import { type TimelineSpec } from "../../lib/vizSchema";
import VizContainer from "./VizContainer";
import { daysBetween, formatDate } from "./utils";

interface TimelineVizProps {
  language: AppLanguage;
  spec: TimelineSpec;
}

export default function TimelineViz({ language, spec }: TimelineVizProps) {
  const { today, events, caption, insight } = spec;

  const width = 640;
  const height = events.length * 40 + 80;
  const pad = { top: 32, right: 72, bottom: 24, left: 120 };
  const plotWidth = width - pad.left - pad.right;

  const sorted = useMemo(
    () => [...events].sort((a, b) => a.date.localeCompare(b.date)),
    [events]
  );
  const minDate = today;
  const maxDate = sorted[sorted.length - 1]?.date ?? today;
  const totalDays = Math.max(daysBetween(minDate, maxDate), 1);

  const xForDate = (date: string) => {
    const d = daysBetween(minDate, date);
    return pad.left + (d / totalDays) * plotWidth;
  };

  const severityColor = (s: string) => {
    switch (s) {
      case "critical":
        return "var(--color-bear)";
      case "high":
        return "var(--color-caution)";
      case "mid":
      default:
        return "var(--color-info)";
    }
  };

  return (
    <VizContainer
      ariaLabel={`Catalyst timeline with ${events.length} events`}
      caption={caption}
      className="rounded-xl border border-border bg-background/30 p-4"
      insight={insight}
      language={language}
      title={language === "en" ? "Catalyst Timeline" : "Katalizör Zaman Çizelgesi"}
    >
      <svg
        role="img"
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {/* Today line */}
        <line
          x1={xForDate(today)}
          y1={pad.top - 12}
          x2={xForDate(today)}
          y2={height - pad.bottom}
          stroke="var(--color-text-primary)"
          strokeWidth={2}
          strokeDasharray="5 4"
        />
        <text
          x={xForDate(today)}
          y={pad.top - 18}
          textAnchor="middle"
          fill="var(--color-text-primary)"
          fontSize={10}
          fontWeight={600}
        >
          {language === "en" ? "Today" : "Bugün"}
        </text>

        {/* Axis */}
        <line
          x1={pad.left}
          y1={height - pad.bottom}
          x2={width - pad.right}
          y2={height - pad.bottom}
          stroke="var(--color-border-strong)"
          strokeWidth={1}
        />

        {/* Events */}
        {sorted.map((event, i) => {
          const x = xForDate(event.date);
          const y = pad.top + i * 40;
          const dte = daysBetween(today, event.date);
          const color = severityColor(event.severity);

          return (
            <g key={`${event.date}-${i}`}>
              <line
                x1={x}
                y1={y}
                x2={x}
                y2={height - pad.bottom}
                stroke="var(--color-border-subtle)"
                strokeWidth={1}
                strokeDasharray="2 2"
              />
              <circle cx={x} cy={y} r={6} fill={color} stroke="var(--color-bg-elevated)" strokeWidth={2} />
              <text
                x={pad.left - 10}
                y={y + 4}
                textAnchor="end"
                fill="var(--color-text-secondary)"
                fontSize={10}
                fontWeight={500}
              >
                {formatDate(event.date, language)}
              </text>
              <text
                x={pad.left - 10}
                y={y + 18}
                textAnchor="end"
                fill="var(--color-text-muted)"
                fontSize={9}
              >
                DTE {dte}
              </text>
              <text
                x={x + 12}
                y={y + 4}
                textAnchor="start"
                fill="var(--color-text-primary)"
                fontSize={11}
                fontWeight={600}
              >
                {event.label}
              </text>
              <text
                x={width - pad.right + 8}
                y={y + 4}
                textAnchor="start"
                fill={color}
                fontSize={9}
                fontWeight={600}
              >
                {event.severity.toUpperCase()}
              </text>
            </g>
          );
        })}
      </svg>
    </VizContainer>
  );
}
