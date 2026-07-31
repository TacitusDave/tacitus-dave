"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/site-config";
import { toolsByCategory } from "@/lib/lab-tools";
import { cn } from "@/lib/cn";

const toolGroups = toolsByCategory();

export function NavMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function linkClass(href: string) {
    return cn(
      "block rounded px-2 py-1.5 font-mono text-xs uppercase tracking-widest transition-colors hover:bg-background hover:text-accent",
      pathname === href ? "text-accent" : "text-foreground-muted",
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls="site-nav-menu"
        aria-label="Toggle navigation menu"
        className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-foreground-muted transition-colors hover:border-accent hover:text-accent"
      >
        <span className="flex flex-col items-center gap-[3px]" aria-hidden="true">
          <span
            className={cn(
              "h-px w-4 bg-current transition-transform duration-200",
              open && "translate-y-[5px] rotate-45",
            )}
          />
          <span
            className={cn("h-px w-4 bg-current transition-opacity duration-200", open && "opacity-0")}
          />
          <span
            className={cn(
              "h-px w-4 bg-current transition-transform duration-200",
              open && "-translate-y-[5px] -rotate-45",
            )}
          />
        </span>
      </button>

      <div
        id="site-nav-menu"
        role="menu"
        className={cn(
          "absolute right-0 top-[calc(100%+0.5rem)] max-h-[75vh] w-72 origin-top-right overflow-y-auto rounded-md border border-border bg-background-elevated p-3 shadow-lg transition-[opacity,transform] duration-150",
          open
            ? "pointer-events-auto scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0",
        )}
      >
        <div className="flex flex-col gap-0.5 border-b border-border pb-3">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
              className={linkClass(item.href)}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {toolGroups.map((group) => (
          <div key={group.category} className="border-b border-border py-3 last:border-b-0 last:pb-0">
            <p className="px-2 pb-1.5 font-mono text-[10px] uppercase tracking-widest text-foreground-muted/70">
              {group.category}
            </p>
            <div className="flex flex-col gap-0.5">
              {group.tools.map((tool) => (
                <Link
                  key={tool.slug}
                  href={tool.href}
                  role="menuitem"
                  tabIndex={open ? 0 : -1}
                  onClick={() => setOpen(false)}
                  className={linkClass(tool.href)}
                >
                  {tool.title}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
