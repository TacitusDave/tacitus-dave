import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "accent" | "outline" | "ghost";
export type ButtonSize = "sm" | "md";

const variantStyles: Record<ButtonVariant, string> = {
  accent: "bg-accent text-accent-foreground hover:opacity-90",
  outline:
    "border border-border text-foreground hover:border-accent hover:text-accent",
  ghost: "text-foreground-muted hover:text-accent",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
};

export function buttonVariants({
  variant = "accent",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-md font-mono transition-colors duration-200",
    variantStyles[variant],
    sizeStyles[size],
    className,
  );
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ variant, size, className, ...props }, ref) {
    return (
      <button
        ref={ref}
        className={buttonVariants({ variant, size, className })}
        {...props}
      />
    );
  },
);
