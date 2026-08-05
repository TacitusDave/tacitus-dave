"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/site-config";
import { buttonVariants } from "@/components/ui/button";
import { NavMenu } from "@/components/layout/nav-menu";
import { LogoScrollRing } from "@/components/layout/logo-scroll-ring";
import { cn } from "@/lib/cn";

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className="group relative py-2 font-mono text-xs uppercase tracking-widest"
    >
      <span
        className={cn(
          "transition-colors",
          active ? "text-foreground" : "text-foreground-muted group-hover:text-foreground",
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          "absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-accent transition-transform duration-200 group-hover:scale-x-100",
          active && "scale-x-100",
        )}
      />
    </Link>
  );
}

// Liquid-glass treatment: heavy backdrop blur + saturation lift so whatever
// scrolls underneath actually shows through refracted, a bright inset top
// edge to read as a lit glass rim, and a soft outer shadow to lift the
// whole bar off the page — not just a tinted box.
const GLASS_SHADOW =
  "0 12px 32px -12px rgba(9, 18, 42, 0.2), 0 2px 6px rgba(9, 18, 42, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.9), inset 0 0 0 1px rgba(255, 255, 255, 0.4)";

export function Header() {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4 sm:top-5 sm:px-6">
      <header
        className="pointer-events-auto flex w-full max-w-6xl items-center justify-between gap-4 rounded-full border border-white/70 bg-white/40 px-3 py-2 backdrop-blur-xl backdrop-saturate-150 sm:px-5"
        style={{ boxShadow: GLASS_SHADOW }}
      >
        <div className="flex items-center gap-2.5">
          <LogoScrollRing />
          <span className="hidden font-mono text-sm font-medium tracking-tight text-foreground sm:block">
            {siteConfig.name}
          </span>
        </div>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          {siteConfig.nav.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} />
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("open-command-palette"))}
            className="flex items-center gap-1.5 rounded-full border border-border/70 px-2 py-1 font-mono text-[11px] text-foreground-muted transition-colors hover:border-accent hover:text-accent"
            aria-label="Open command palette"
          >
            <span aria-hidden="true">⌘</span>K
          </button>
          <Link
            href="/lab/authorize"
            className="font-mono text-xs uppercase tracking-widest text-foreground-muted transition-colors hover:text-foreground"
          >
            Sign in
          </Link>
          <Link href="/pricing" className={buttonVariants({ size: "sm" })}>
            Get Started
          </Link>
        </div>
        <div className="md:hidden">
          <NavMenu />
        </div>
      </header>
    </div>
  );
}
