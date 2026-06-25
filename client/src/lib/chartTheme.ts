const CHART_MONO_FONT = '"JetBrains Mono", ui-monospace, SFMono-Regular, monospace';

export const chartPalette = {
  accent: "var(--accent)",
  accentStrong: "var(--accent-hover)",
  accentSoft: "rgba(14, 165, 233, 0.18)",
  bull: "#10b981",
  bullSoft: "rgba(16, 185, 129, 0.16)",
  bullAlt: "#4ade80",
  warning: "#f59e0b",
  warningSoft: "rgba(245, 158, 11, 0.18)",
  bear: "#ef4444",
  bearSoft: "rgba(239, 68, 68, 0.18)",
  info: "#22d3ee",
  infoSoft: "rgba(34, 211, 238, 0.18)",
  violet: "#a78bfa",
  surface: "var(--surface-overlay)",
  surfaceBorder: "rgba(148, 163, 184, 0.18)",
  grid: "rgba(148, 163, 184, 0.16)",
  axis: "rgba(148, 163, 184, 0.82)",
  axisStrong: "rgba(226, 232, 240, 0.92)",
  text: "rgba(241, 245, 249, 0.96)",
  muted: "rgba(148, 163, 184, 0.86)",
} as const;

export const chartAxisTick = {
  fill: chartPalette.axis,
  fontFamily: CHART_MONO_FONT,
  fontSize: 10,
} as const;

export const chartAxisStrongTick = {
  ...chartAxisTick,
  fill: chartPalette.axisStrong,
  fontSize: 11,
  fontWeight: 600,
} as const;

export const chartGrid = {
  stroke: chartPalette.grid,
  strokeDasharray: "3 3",
} as const;

export const chartLegendWrapperStyle = {
  color: chartPalette.axis,
  fontSize: "11px",
} as const;

export const chartCursorLine = {
  stroke: chartPalette.info,
  strokeDasharray: "4 4",
  strokeOpacity: 0.45,
  strokeWidth: 1,
} as const;

export const chartCursorZone = {
  fill: chartPalette.accentSoft,
} as const;

export function chartAxisLabel(
  value: string,
  overrides: Partial<{
    angle: number;
    offset: number;
    position:
      | "top"
      | "left"
      | "right"
      | "bottom"
      | "inside"
      | "outside"
      | "insideLeft"
      | "insideRight"
      | "insideTop"
      | "insideBottom"
      | "insideTopLeft"
      | "insideBottomLeft"
      | "insideTopRight"
      | "insideBottomRight"
      | "insideStart"
      | "insideEnd"
      | "end"
      | "center";
  }> = {}
) {
  return {
    fill: chartPalette.axis,
    fontFamily: CHART_MONO_FONT,
    fontSize: 10,
    value,
    ...overrides,
  };
}

export function chartLineDot(color: string) {
  return {
    fill: color,
    r: 4,
    stroke: chartPalette.surface,
    strokeWidth: 2,
  };
}

export function coerceChartNumber(value: number | string | null | undefined) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

export function formatChartNumber(
  value: number | string | null | undefined,
  digits = 0
) {
  const parsed = coerceChartNumber(value);
  if (parsed === null) {
    return "-";
  }

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(parsed);
}

export function formatChartPercent(
  value: number | string | null | undefined,
  digits = 0
) {
  const parsed = coerceChartNumber(value);
  if (parsed === null) {
    return "-";
  }

  return `${formatChartNumber(parsed, digits)}%`;
}

export function formatChartCurrency(
  value: number | string | null | undefined,
  currencySymbol = "$",
  digits = 2
) {
  const parsed = coerceChartNumber(value);
  if (parsed === null) {
    return "-";
  }

  return `${currencySymbol}${formatChartNumber(parsed, digits)}`;
}

export function getSignalChartColor(signal: string) {
  switch (signal) {
    case "STRONG_BUY":
      return chartPalette.bull;
    case "BUY":
      return chartPalette.bullAlt;
    case "NEUTRAL":
      return chartPalette.warning;
    default:
      return chartPalette.bear;
  }
}

export function getMomentumBandColor(score: number) {
  if (score >= 85) {
    return chartPalette.bull;
  }

  if (score >= 65) {
    return chartPalette.bullAlt;
  }

  if (score >= 50) {
    return chartPalette.warning;
  }

  return chartPalette.bear;
}

export function getRatingChartColor(rating: string) {
  switch (rating) {
    case "EXCELLENT":
      return chartPalette.bull;
    case "GOOD":
      return chartPalette.bullAlt;
    case "FAIR":
      return chartPalette.warning;
    default:
      return chartPalette.bear;
  }
}

export function getDirectionalChartColor(direction: string) {
  switch (direction) {
    case "CALL":
      return chartPalette.bull;
    case "PUT":
      return chartPalette.bear;
    default:
      return chartPalette.warning;
  }
}

export function getChartAriaLabel(title: string, detail: string) {
  return `${title}. ${detail}`;
}
