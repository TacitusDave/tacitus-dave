"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { labTools } from "@/lib/lab-tools";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/cn";

interface PaletteItem {
  id: string;
  label: string;
  sublabel: string;
  href: string;
  group: "Navigate" | "Lab tools";
}

const NAV_ITEMS: PaletteItem[] = [
  ...siteConfig.nav.map((item) => ({
    id: `nav-${item.href}`,
    label: item.label,
    sublabel: item.href,
    href: item.href,
    group: "Navigate" as const,
  })),
  { id: "nav-home", label: "Home", sublabel: "/", href: "/", group: "Navigate" as const },
];

const TOOL_ITEMS: PaletteItem[] = labTools.map((tool) => ({
  id: `tool-${tool.slug}`,
  label: tool.title,
  sublabel: tool.tagline,
  href: tool.href,
  group: "Lab tools" as const,
}));

const ALL_ITEMS = [...NAV_ITEMS, ...TOOL_ITEMS];

export function CommandPalette() {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ALL_ITEMS;
    return ALL_ITEMS.filter(
      (item) => item.label.toLowerCase().includes(q) || item.sublabel.toLowerCase().includes(q),
    );
  }, [query]);

  useEffect(() => {
    const node = dialogRef.current;
    if (!node) return;
    if (isOpen && !node.open) node.showModal();
    if (!isOpen && node.open) node.close();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    const id = window.setTimeout(() => setActiveIndex(0), 0);
    return () => window.clearTimeout(id);
  }, [query, isOpen]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsOpen((open) => !open);
      }
    }
    document.addEventListener("keydown", handleKeyDown);

    function handleOpenEvent() {
      setIsOpen((open) => !open);
    }
    window.addEventListener("open-command-palette", handleOpenEvent);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-command-palette", handleOpenEvent);
    };
  }, []);

  function navigate(href: string) {
    setIsOpen(false);
    setQuery("");
    router.push(href);
  }

  function handleInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const item = results[activeIndex];
      if (item) navigate(item.href);
    }
  }

  const groups = [
    { group: "Navigate" as const, items: results.filter((item) => item.group === "Navigate") },
    { group: "Lab tools" as const, items: results.filter((item) => item.group === "Lab tools") },
  ].filter((group) => group.items.length > 0);

  let flatIndex = -1;

  return (
    <dialog
      ref={dialogRef}
      onClose={() => {
        setIsOpen(false);
        setQuery("");
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) setIsOpen(false);
      }}
      className="w-full max-w-lg rounded-lg border border-border bg-background-elevated p-0 text-foreground shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm"
      aria-label="Command palette"
    >
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="font-mono text-accent" aria-hidden="true">
          $
        </span>
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder="Jump to a page or tool…"
          className="w-full bg-transparent font-mono text-sm text-foreground outline-none placeholder:text-foreground-muted"
          aria-label="Search pages and tools"
        />
        <kbd className="hidden shrink-0 rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-foreground-muted sm:block">
          esc
        </kbd>
      </div>

      <div className="max-h-80 overflow-y-auto p-2">
        {groups.length === 0 ? (
          <p className="px-3 py-6 text-center text-sm text-foreground-muted">
            No matches for &quot;{query}&quot;.
          </p>
        ) : (
          groups.map((group) => (
            <div key={group.group} className="mb-2 last:mb-0">
              <p className="px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-foreground-muted">
                {group.group}
              </p>
              {group.items.map((item) => {
                flatIndex += 1;
                const active = flatIndex === activeIndex;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onMouseEnter={() => setActiveIndex(flatIndex)}
                    onClick={() => navigate(item.href)}
                    className={cn(
                      "flex w-full flex-col gap-0.5 rounded-md px-3 py-2 text-left transition-colors",
                      active ? "bg-accent/15 text-foreground" : "text-foreground-muted hover:bg-background/60",
                    )}
                  >
                    <span className="text-sm font-medium text-foreground">{item.label}</span>
                    <span className="truncate text-xs text-foreground-muted">{item.sublabel}</span>
                  </button>
                );
              })}
            </div>
          ))
        )}
      </div>
    </dialog>
  );
}
