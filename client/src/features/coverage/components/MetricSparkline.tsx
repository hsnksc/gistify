interface MetricSparklineProps {
  data: number[];
  height?: number;
  width?: number;
}

export default function MetricSparkline({
  data,
  height = 28,
  width = 96,
}: MetricSparklineProps) {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const first = data[0];
  const last = data[data.length - 1];
  const positive = last >= first;

  const points = data.map((value, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  });

  const color = positive ? "var(--color-bull)" : "var(--color-bear)";

  return (
    <svg
      role="img"
      aria-label={`Sparkline: ${positive ? "up" : "down"} trend`}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="shrink-0"
    >
      <polyline
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points.join(" ")}
      />
      <circle cx={width} cy={height - ((last - min) / range) * height} r={2.5} fill={color} />
    </svg>
  );
}
