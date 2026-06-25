import * as React from "react";
import * as RechartsPrimitive from "recharts";

import { chartPalette } from "@/lib/chartTheme";
import { getTooltipDatum, getTooltipLabel } from "@/lib/chartTooltip";
import { cn } from "@/lib/utils";

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const;
type TooltipProps = React.ComponentProps<typeof RechartsPrimitive.Tooltip>;
type TooltipPayload = TooltipProps["payload"];

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

type ChartTooltipRenderProps = {
  config: ChartConfig;
  datum: Record<string, unknown> | null;
  label: React.ReactNode;
  payload: TooltipPayload;
};

function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }

  return context;
}

function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig;
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >["children"];
}) {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "[&_.recharts-cartesian-axis-line]:stroke-white/8 [&_.recharts-cartesian-axis-tick_line]:stroke-white/8 [&_.recharts-cartesian-axis-tick_text]:fill-slate-400 [&_.recharts-cartesian-grid_line]:stroke-white/8 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-sky-400/40 [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-white/10 [&_.recharts-radial-bar-background-sector]:fill-white/5 [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-sky-400/8 [&_.recharts-reference-line_[stroke='#ccc']]:stroke-white/10 flex aspect-video justify-center text-[11px] [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, config]) => config.theme || config.color
  );

  if (!colorConfig.length) {
    return null;
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
      itemConfig.color;
    return color ? `  --color-${key}: ${color};` : null;
  })
  .join("\n")}
}
`
          )
          .join("\n"),
      }}
    />
  );
};

function stringifyTooltipValue(value: unknown) {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  return "";
}

function buildTooltipReactKey(payload?: TooltipProps["payload"], label?: unknown) {
  const derivedLabel = getTooltipLabel(payload as never, label);
  const payloadSignature =
    payload
      ?.map(item =>
        [
          stringifyTooltipValue(item?.dataKey),
          stringifyTooltipValue(item?.name),
          stringifyTooltipValue(item?.value),
          stringifyTooltipValue((item?.payload as Record<string, unknown> | undefined)?.label),
          stringifyTooltipValue((item?.payload as Record<string, unknown> | undefined)?.ticker),
          stringifyTooltipValue((item?.payload as Record<string, unknown> | undefined)?.subject),
        ]
          .filter(Boolean)
          .join(":")
      )
      .filter(Boolean)
      .join("|") || "tooltip";

  return [derivedLabel, payloadSignature].filter(Boolean).join("|");
}

function ChartTooltip({
  content,
  ...props
}: React.ComponentProps<typeof RechartsPrimitive.Tooltip>) {
  const wrappedContent = React.useMemo(() => {
    if (!React.isValidElement(content)) {
      return content;
    }

    return (tooltipProps: TooltipProps) =>
      React.cloneElement(content as React.ReactElement, {
        ...tooltipProps,
        key: buildTooltipReactKey(tooltipProps.payload, tooltipProps.label),
      });
  }, [content]);

  return <RechartsPrimitive.Tooltip {...props} content={wrappedContent} />;
}

function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey,
  renderContent,
}: React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
  React.ComponentProps<"div"> & {
    hideLabel?: boolean;
    hideIndicator?: boolean;
    indicator?: "line" | "dot" | "dashed";
    nameKey?: string;
    labelKey?: string;
    renderContent?: (props: ChartTooltipRenderProps) => React.ReactNode;
  }) {
  const { config } = useChart();

  if (!active || !payload?.length) {
    return null;
  }

  let tooltipLabel: React.ReactNode = null;
  if (!hideLabel && payload.length) {
    const [item] = payload;
    const key = `${labelKey || item?.dataKey || item?.name || "value"}`;
    const itemConfig = getPayloadConfigFromPayload(config, item, key);
    const datum = getTooltipDatum(payload);
    const value =
      itemConfig?.label ||
      (!labelKey
        ? config[
            getTooltipLabel(payload as never, label) as keyof typeof config
          ]?.label
        : undefined) ||
      (datum && typeof datum[labelKey || "label"] === "string"
        ? (datum[labelKey || "label"] as string)
        : undefined) ||
      getTooltipLabel(payload as never, label);

    if (labelFormatter) {
      tooltipLabel = (
        <div className={cn("font-medium", labelClassName)}>
          {labelFormatter(value, payload)}
        </div>
      );
    } else if (value) {
      tooltipLabel = (
        <div className={cn("font-medium", labelClassName)}>{value}</div>
      );
    }
  }

  const nestLabel = payload.length === 1 && indicator !== "dot";
  const tooltipKey = buildTooltipReactKey(payload, label);
  const datum = getTooltipDatum(payload as never);

  if (renderContent) {
    return (
      <div
        className={cn(
          "grid min-w-[11rem] items-start gap-2 rounded-[calc(var(--radius)-2px)] border border-white/10 bg-[var(--surface-overlay)] px-3 py-2.5 text-xs shadow-[0_20px_48px_rgba(2,8,23,0.45)] backdrop-blur-sm",
          className
        )}
        style={{
          borderColor: chartPalette.surfaceBorder,
          background: chartPalette.surface,
        }}
      >
        {renderContent({
          config,
          datum,
          label: tooltipLabel,
          payload,
        })}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid min-w-[11rem] items-start gap-2 rounded-[calc(var(--radius)-2px)] border border-white/10 bg-[var(--surface-overlay)] px-3 py-2.5 text-xs shadow-[0_20px_48px_rgba(2,8,23,0.45)] backdrop-blur-sm",
        className
      )}
      style={{
        borderColor: chartPalette.surfaceBorder,
        background: chartPalette.surface,
      }}
    >
      {!nestLabel ? tooltipLabel : null}
      <div className="grid gap-2">
        {payload
          .filter(item => item.type !== "none")
          .map((item, index) => {
            const key = `${nameKey || item.name || item.dataKey || "value"}`;
            const itemConfig = getPayloadConfigFromPayload(config, item, key);
            const indicatorColor = color || item.payload.fill || item.color;

            return (
              <div
                key={`${tooltipKey}-${item.dataKey || item.name || index}-${index}`}
                className={cn(
                  "[&>svg]:text-muted-foreground flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5",
                  indicator === "dot" && "items-center"
                )}
              >
                {formatter && item?.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <div
                          className={cn(
                            "shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)",
                            {
                              "h-2.5 w-2.5": indicator === "dot",
                              "w-1": indicator === "line",
                              "w-0 border-[1.5px] border-dashed bg-transparent":
                                indicator === "dashed",
                              "my-0.5": nestLabel && indicator === "dashed",
                            }
                          )}
                          style={
                            {
                              "--color-bg": indicatorColor,
                              "--color-border": indicatorColor,
                            } as React.CSSProperties
                          }
                        />
                      )
                    )}
                    <div
                      className={cn(
                        "flex flex-1 justify-between leading-none",
                        nestLabel ? "items-end" : "items-center"
                      )}
                    >
                      <div className="grid gap-1.5">
                        {nestLabel ? tooltipLabel : null}
                        <span className="text-muted-foreground">
                          {itemConfig?.label || item.name}
                        </span>
                      </div>
                      {item.value !== undefined && item.value !== null && (
                        <span className="text-foreground font-mono font-medium tabular-nums">
                          {item.value.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}

const ChartLegend = RechartsPrimitive.Legend;

function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = "bottom",
  nameKey,
}: React.ComponentProps<"div"> &
  Pick<RechartsPrimitive.LegendProps, "payload" | "verticalAlign"> & {
    hideIcon?: boolean;
    nameKey?: string;
  }) {
  const { config } = useChart();

  if (!payload?.length) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-4",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className
      )}
    >
      {payload
        .filter(item => item.type !== "none")
        .map(item => {
          const key = `${nameKey || item.dataKey || "value"}`;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);

          return (
            <div
              key={item.value}
              className={cn(
                "[&>svg]:text-muted-foreground flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3"
              )}
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className="h-2 w-2 shrink-0 rounded-[2px]"
                  style={{
                    backgroundColor: item.color,
                  }}
                />
              )}
              {itemConfig?.label}
            </div>
          );
        })}
    </div>
  );
}

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string
) {
  if (typeof payload !== "object" || payload === null) {
    return undefined;
  }

  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined;

  let configLabelKey: string = key;

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === "string"
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string;
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string;
  }

  return configLabelKey in config
    ? config[configLabelKey]
    : config[key as keyof typeof config];
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
};
