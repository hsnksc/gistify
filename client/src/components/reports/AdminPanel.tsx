import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type AdminPanelLayout = "main-preview" | "sidebar-main" | "single";
type AdminSurfaceTone = "dashed" | "muted" | "raised";
type SurfaceTag = "article" | "aside" | "div" | "section";

export interface AdminPanelConfig {
  layout?: AdminPanelLayout;
}

interface AdminPanelProps {
  className?: string;
  config?: AdminPanelConfig;
  main: ReactNode;
  preview?: ReactNode;
  sidebar?: ReactNode;
}

interface AdminPanelSurfaceProps extends HTMLAttributes<HTMLElement> {
  as?: SurfaceTag;
  tone?: AdminSurfaceTone;
}

const LAYOUT_CLASSNAME: Record<AdminPanelLayout, string> = {
  "main-preview": "grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]",
  "sidebar-main": "grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]",
  single: "grid gap-6",
};

const SURFACE_CLASSNAME: Record<AdminSurfaceTone, string> = {
  dashed:
    "rounded-xl border border-dashed border-border bg-background/35 p-6 text-sm text-muted-foreground",
  muted: "rounded-xl border border-border bg-background/50 p-4",
  raised:
    "rounded-xl border border-border bg-card/95 p-6 shadow-[0_18px_40px_rgba(3,7,18,0.24)]",
};

export function AdminPanel({
  className,
  config,
  main,
  preview,
  sidebar,
}: AdminPanelProps) {
  const layout = config?.layout || "sidebar-main";

  return (
    <div className={cn(LAYOUT_CLASSNAME[layout], className)}>
      {layout === "sidebar-main" ? (
        <>
          {sidebar}
          <div className="space-y-6">{main}</div>
        </>
      ) : layout === "main-preview" ? (
        <>
          <div>{main}</div>
          {preview}
        </>
      ) : (
        <div>{main}</div>
      )}
    </div>
  );
}

export function AdminPanelSurface({
  as: Component = "section",
  className,
  tone = "raised",
  ...props
}: AdminPanelSurfaceProps) {
  return (
    <Component
      className={cn(SURFACE_CLASSNAME[tone], className)}
      {...props}
    />
  );
}

export function AdminField({
  children,
  className,
  label,
}: {
  children: ReactNode;
  className?: string;
  label: string;
}) {
  return (
    <label className={cn("space-y-1.5", className)}>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

export function AdminSectionLabel({
  children,
  className,
  tone = "muted",
}: {
  children: ReactNode;
  className?: string;
  tone?: "accent" | "muted";
}) {
  return (
    <p
      className={cn(
        "text-[11px] font-semibold uppercase tracking-[0.18em]",
        tone === "accent" ? "text-emerald-300" : "text-muted-foreground",
        className
      )}
    >
      {children}
    </p>
  );
}
