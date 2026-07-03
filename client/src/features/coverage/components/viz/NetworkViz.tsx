import { useMemo } from "react";
import { type AppLanguage } from "@/lib/i18n";
import { type NetworkSpec } from "../../lib/vizSchema";
import VizContainer from "./VizContainer";
import { colorForRelation, uniqueId } from "./utils";

interface NetworkVizProps {
  language: AppLanguage;
  spec: NetworkSpec;
}

export default function NetworkViz({ language, spec }: NetworkVizProps) {
  const { center, nodes, caption, insight } = spec;
  const id = useMemo(() => uniqueId("network"), []);

  const width = 640;
  const height = 360;
  const cx = width / 2;
  const cy = height / 2;
  const radius = 130;

  const positioned = useMemo(() => {
    const count = Math.max(nodes.length, 1);
    return nodes.map((node, i) => {
      const angle = (2 * Math.PI * i) / count - Math.PI / 2;
      const weight = node.weight ?? 0.5;
      const r = radius * (0.6 + 0.4 * weight);
      return {
        ...node,
        angle,
        x: cx + r * Math.cos(angle),
        y: cy + r * Math.sin(angle),
        r: 6 + weight * 8,
      };
    });
  }, [nodes, cx, cy]);

  return (
    <VizContainer
      ariaLabel={`Ecosystem network centered on ${center.label ?? center.id}`}
      caption={caption}
      className="rounded-xl border border-border bg-background/30 p-4"
      insight={insight}
      language={language}
      title={language === "en" ? "Ecosystem" : "Ekosistem"}
    >
      <svg
        role="img"
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        <defs>
          <marker
            id={`${id}-arrow`}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M0 0 L10 5 L0 10 Z" fill="var(--color-border-strong)" />
          </marker>
        </defs>

        {/* Links */}
        {positioned.map(node => {
          const color = colorForRelation(node.relation);
          return (
            <line
              key={`link-${node.id}`}
              x1={cx}
              y1={cy}
              x2={node.x}
              y2={node.y}
              stroke={color}
              strokeOpacity={0.35}
              strokeWidth={1.5}
            />
          );
        })}

        {/* Center */}
        <circle
          cx={cx}
          cy={cy}
          r={22}
          fill="var(--color-accent-subtle)"
          stroke="var(--color-accent)"
          strokeWidth={2}
        />
        <text
          x={cx}
          y={cy + 4}
          textAnchor="middle"
          fill="var(--color-text-primary)"
          fontSize={11}
          fontWeight={700}
        >
          {center.label ?? center.id}
        </text>

        {/* Nodes */}
        {positioned.map(node => {
          const color = colorForRelation(node.relation);
          return (
            <g key={node.id}>
              <circle
                cx={node.x}
                cy={node.y}
                r={node.r}
                fill="var(--color-bg-elevated)"
                stroke={color}
                strokeWidth={2}
              >
                <title>{`${node.label ?? node.id} (${node.relation})`}</title>
              </circle>
              <text
                x={node.x}
                y={node.y + node.r + 14}
                textAnchor="middle"
                fill="var(--color-text-secondary)"
                fontSize={10}
                fontWeight={500}
              >
                {node.label ?? node.id}
              </text>
              <text
                x={node.x}
                y={node.y + node.r + 26}
                textAnchor="middle"
                fill={color}
                fontSize={9}
              >
                {node.relation}
              </text>
            </g>
          );
        })}
      </svg>
    </VizContainer>
  );
}
