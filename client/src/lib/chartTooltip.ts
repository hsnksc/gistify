type TooltipPayloadEntry = {
  payload?: Record<string, unknown>;
};

const DEFAULT_LABEL_KEYS = ["ticker", "name", "sector", "subject", "day"] as const;

export function getTooltipDatum(
  payload?: TooltipPayloadEntry[] | null
): Record<string, unknown> | null {
  if (!payload?.length) {
    return null;
  }

  const datum = payload[0]?.payload;
  if (!datum || typeof datum !== "object") {
    return null;
  }

  return datum;
}

export function getTooltipLabel(
  payload?: TooltipPayloadEntry[] | null,
  label?: unknown,
  preferredKeys: readonly string[] = DEFAULT_LABEL_KEYS
) {
  const datum = getTooltipDatum(payload);

  if (datum) {
    for (const key of preferredKeys) {
      const value = datum[key];
      if (typeof value === "string" && value.trim().length > 0) {
        return value;
      }
    }
  }

  if (typeof label === "string" && label.trim().length > 0) {
    return label;
  }

  return "";
}
