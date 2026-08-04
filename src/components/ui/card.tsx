import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function cardStyles(className?: string) {
  return cn(
    "rounded-xl border border-border bg-background-elevated/60 p-6 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
    className,
  );
}

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cardStyles(className)} {...props} />;
}

export function CardTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-lg font-medium text-foreground", className)}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("mt-3 text-sm text-foreground-muted", className)}
      {...props}
    />
  );
}

export function CardFooter({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mt-6 flex flex-wrap gap-2", className)} {...props} />
  );
}
