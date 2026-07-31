import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border px-2.5 py-1 font-mono text-[11px] text-foreground-muted",
        className,
      )}
      {...props}
    />
  );
}
