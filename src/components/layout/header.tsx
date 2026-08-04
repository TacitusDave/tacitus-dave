"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import logoIcon from "../../../public/tacitus-dave-logo-icon.png";
import { siteConfig } from "@/lib/site-config";
import { buttonVariants } from "@/components/ui/button";
import { NavMenu } from "@/components/layout/nav-menu";
import { cn } from "@/lib/cn";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image src={logoIcon} alt="" priority width={28} height={28} className="rounded-md" />
          <span className="font-mono text-sm font-medium tracking-tight text-foreground">
            {siteConfig.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          {siteConfig.nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className="group relative py-2 font-mono text-xs uppercase tracking-widest"
              >
                <span
                  className={cn(
                    "transition-colors",
                    active ? "text-foreground" : "text-foreground-muted group-hover:text-foreground",
                  )}
                >
                  {item.label}
                </span>
                <span
                  className={cn(
                    "absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-accent transition-transform duration-200 group-hover:scale-x-100",
                    active && "scale-x-100",
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/lab/authorize"
            className="hidden font-mono text-xs uppercase tracking-widest text-foreground-muted transition-colors hover:text-foreground sm:block"
          >
            Sign in
          </Link>
          <Link href="/pricing" className={buttonVariants({ size: "sm", className: "hidden sm:inline-flex" })}>
            Get Started
          </Link>
          <div className="md:hidden">
            <NavMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
