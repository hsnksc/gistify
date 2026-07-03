import { AlertCircle } from "lucide-react";
import { type AppLanguage } from "@/lib/i18n";
import { type CoverageVizBlock, vizLabel } from "../lib/vizSchema";
import {
  BulletViz,
  ChainViz,
  DonutViz,
  EarningsViz,
  GaugeViz,
  LadderViz,
  NetworkViz,
  PayoffViz,
  ProbViz,
  RangeDotViz,
  ScenarioViz,
  TimelineViz,
} from "./viz";

interface VizRendererProps {
  block: CoverageVizBlock;
  language: AppLanguage;
}

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

  switch (spec.type) {
    case "ladder":
      return <LadderViz language={language} spec={spec} />;
    case "gauge":
      return <GaugeViz language={language} spec={spec} />;
    case "bullet":
      return <BulletViz language={language} spec={spec} />;
    case "payoff":
      return <PayoffViz language={language} spec={spec} />;
    case "earnings":
      return <EarningsViz language={language} spec={spec} />;
    case "rangeDot":
      return <RangeDotViz language={language} spec={spec} />;
    case "donut":
      return <DonutViz language={language} spec={spec} />;
    case "network":
      return <NetworkViz language={language} spec={spec} />;
    case "chainViz":
      return <ChainViz language={language} spec={spec} />;
    case "prob":
      return <ProbViz language={language} spec={spec} />;
    case "timeline":
      return <TimelineViz language={language} spec={spec} />;
    case "scenario":
      return <ScenarioViz language={language} spec={spec} />;
    default:
      return (
        <div
          role="alert"
          className="rounded-xl border border-amber-500/25 bg-amber-500/8 p-4"
        >
          <p className="text-sm font-semibold text-amber-200">
            {vizLabel(language, "unknownType")}
          </p>
          <pre className="mt-2 max-h-48 overflow-auto rounded-lg bg-amber-950/30 p-3 text-[11px] text-amber-100/80">
            <code>{raw}</code>
          </pre>
        </div>
      );
  }
}
