import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { NavMenu } from "@/components/layout/nav-menu";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="font-mono text-sm font-medium tracking-tight text-foreground"
        >
          <span className="text-accent">$</span> {siteConfig.name}
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <NavMenu />
        </div>
      </div>
    </header>
  );
}
