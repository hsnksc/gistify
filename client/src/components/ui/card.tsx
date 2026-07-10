import * as React from "react";

import { cn } from "@/lib/utils";

function Card({
  className,
  surface = "raised",
  interactive = true,
  ...props
}: React.ComponentProps<"div"> & {
  surface?: "raised" | "base" | "overlay";
  interactive?: boolean;
}) {
  const surfaceClass =
    surface === "base"
      ? "bg-background/55 shadow-none"
      : surface === "overlay"
        ? "bg-popover shadow-[0_18px_40px_rgba(3,7,18,0.28)]"
        : "bg-card/95 shadow-[0_12px_28px_rgba(3,7,18,0.2)]";

  return (
    <div
      data-slot="card"
      data-surface={surface}
      data-interactive={interactive ? "true" : "false"}
      className={cn(
        "text-card-foreground flex min-w-0 flex-col gap-6 rounded-xl py-6 transition-[transform,box-shadow,background-color] duration-200 ease-out",
        surfaceClass,
        interactive &&
          "hover:-translate-y-0.5 hover:shadow-[0_18px_34px_rgba(3,7,18,0.26)]",
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-3 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold tracking-[-0.02em]", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm leading-6", className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center gap-3 px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
