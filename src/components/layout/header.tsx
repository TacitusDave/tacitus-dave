import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { ThemeToggle } from "@/components/theme/theme-toggle";

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

        <nav className="flex items-center gap-8">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-mono text-xs uppercase tracking-widest text-foreground-muted transition-colors hover:text-accent"
            >
              {item.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
