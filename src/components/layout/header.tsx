"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import logoIcon from "../../../public/tacitus-dave-logo-icon.png";
import { siteConfig } from "@/lib/site-config";
import { buttonVariants } from "@/components/ui/button";
import { NavMenu } from "@/components/layout/nav-menu";
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

export function Header() {
  const nav = siteConfig.nav;
  const mid = Math.ceil(nav.length / 2);
  const leftNav = nav.slice(0, mid);
  const rightNav = nav.slice(mid);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto grid h-16 max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-6">
        {/* Left: nav links (desktop) / logo (mobile) */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 md:hidden">
            <Image src={logoIcon} alt="" priority width={28} height={28} className="rounded-md" />
            <span className="font-mono text-sm font-medium tracking-tight text-foreground">
              {siteConfig.name}
            </span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
            {leftNav.map((item) => (
              <NavLink key={item.href} href={item.href} label={item.label} />
            ))}
          </nav>
        </div>

        {/* Center: logo, floating glass pill — desktop only. Liquid-glass
            treatment: heavy backdrop blur + saturation lift so whatever
            scrolls underneath actually shows through refracted, a bright
            inset top edge to read as a lit glass rim, and a soft outer
            shadow to lift it off the page — not just a tinted box. */}
        <Link
          href="/"
          className="hidden items-center gap-2 rounded-full border border-white/70 bg-white/35 px-4 py-1.5 backdrop-blur-xl backdrop-saturate-150 transition-all hover:border-accent/50 hover:bg-white/50 md:flex"
          style={{
            boxShadow:
              "0 8px 24px -8px rgba(9, 18, 42, 0.18), 0 1px 2px rgba(9, 18, 42, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.9), inset 0 0 0 1px rgba(255, 255, 255, 0.4)",
          }}
        >
          <Image src={logoIcon} alt="" priority width={22} height={22} className="rounded-md" />
          <span className="font-mono text-sm font-medium tracking-tight text-foreground">
            {siteConfig.name}
          </span>
        </Link>

        {/* Right: nav links + actions (desktop) / hamburger (mobile) */}
        <div className="flex items-center justify-end gap-6">
          <nav className="hidden items-center gap-6 md:flex" aria-label="Secondary">
            {rightNav.map((item) => (
              <NavLink key={item.href} href={item.href} label={item.label} />
            ))}
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("open-command-palette"))}
              className="flex items-center gap-1.5 rounded-md border border-border px-2 py-1 font-mono text-[11px] text-foreground-muted transition-colors hover:border-accent hover:text-accent"
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
        </div>
      </div>
    </header>
  );
}
