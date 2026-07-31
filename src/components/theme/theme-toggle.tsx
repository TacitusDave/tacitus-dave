"use client";

import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-foreground-muted transition-colors hover:border-accent hover:text-accent"
    >
      <span className="font-mono text-xs">
        {theme === "dark" ? "☾" : "☀"}
      </span>
    </button>
  );
}
