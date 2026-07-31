"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

const QUICK_LINKS = [
  { label: "localhost:3000", url: "http://localhost:3000" },
  { label: "localhost:3001", url: "http://localhost:3001" },
  { label: "localhost:5173", url: "http://localhost:5173" },
  { label: "localhost:8080", url: "http://localhost:8080" },
];

function looksLikeUrl(input: string): boolean {
  if (/^https?:\/\//i.test(input)) return true;
  if (/\s/.test(input)) return false;
  if (/^localhost(:\d+)?(\/.*)?$/i.test(input)) return true;
  if (/^\d{1,3}(\.\d{1,3}){3}(:\d+)?(\/.*)?$/.test(input)) return true;
  return /^[a-z0-9-]+(\.[a-z0-9-]+)+(:\d+)?(\/.*)?$/i.test(input);
}

function normalizeUrl(input: string): string {
  if (/^https?:\/\//i.test(input)) return input;
  if (/^localhost(:\d+)?/i.test(input) || /^\d{1,3}(\.\d{1,3}){3}/.test(input)) {
    return `http://${input}`;
  }
  return `https://${input}`;
}

/** URL or free-text query → a navigable URL. Search routes through DuckDuckGo's
 * lightweight HTML results, which don't build an ad profile from the query. */
function resolveInput(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (looksLikeUrl(trimmed)) return normalizeUrl(trimmed);
  return `https://duckduckgo.com/html/?q=${encodeURIComponent(trimmed)}`;
}

const navButtonStyles =
  "flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border text-foreground-muted transition-colors hover:border-accent hover:text-accent disabled:pointer-events-none disabled:opacity-30";

export function SiteBrowser() {
  const searchParams = useSearchParams();
  const initialTarget = (searchParams.get("url") || searchParams.get("q") || "").trim();
  const initialResolved = initialTarget ? resolveInput(initialTarget) : null;

  const [inputValue, setInputValue] = useState(initialTarget);
  const [url, setUrl] = useState<string | null>(initialResolved);
  const [history, setHistory] = useState<string[]>(initialResolved ? [initialResolved] : []);
  const [historyIndex, setHistoryIndex] = useState(initialResolved ? 0 : -1);
  const [reloadKey, setReloadKey] = useState(0);

  function navigate(target: string) {
    const resolved = resolveInput(target);
    if (!resolved) return;
    setUrl(resolved);
    setInputValue(target.trim());
    setHistory((prev) => [...prev.slice(0, historyIndex + 1), resolved]);
    setHistoryIndex((i) => i + 1);
  }

  function goBack() {
    if (historyIndex <= 0) return;
    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    setUrl(history[newIndex]);
  }

  function goForward() {
    if (historyIndex >= history.length - 1) return;
    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    setUrl(history[newIndex]);
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-md border border-border bg-background-elevated">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="ml-2 font-mono text-xs uppercase tracking-widest text-foreground-muted">
          in-site browser — private search
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-3">
        <button type="button" onClick={goBack} disabled={historyIndex <= 0} aria-label="Back" className={navButtonStyles}>
          ←
        </button>
        <button
          type="button"
          onClick={goForward}
          disabled={historyIndex >= history.length - 1}
          aria-label="Forward"
          className={navButtonStyles}
        >
          →
        </button>
        <button
          type="button"
          onClick={() => setReloadKey((k) => k + 1)}
          disabled={!url}
          aria-label="Reload"
          className={navButtonStyles}
        >
          ⟳
        </button>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            navigate(inputValue);
          }}
          className="flex min-w-[200px] flex-1 items-center gap-2"
        >
          <input
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            placeholder="Search, or enter a URL / localhost port"
            className="min-w-0 flex-1 rounded-md border border-border bg-background px-3 py-1.5 text-base text-foreground outline-none transition-colors focus:border-accent sm:text-sm"
            aria-label="Search or address bar"
          />
          <Button type="submit" size="sm" variant="outline">
            Go
          </Button>
        </form>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-border px-4 py-3">
        {QUICK_LINKS.map((link) => (
          <button
            key={link.url}
            type="button"
            onClick={() => navigate(link.url)}
            className={cn(
              "rounded-full border border-border px-3 py-1 font-mono text-[11px] text-foreground-muted transition-colors hover:border-accent hover:text-accent",
              url === link.url && "border-accent text-accent",
            )}
          >
            {link.label}
          </button>
        ))}
      </div>

      <div className="relative h-[32rem] bg-background">
        {url ? (
          <iframe key={`${url}-${reloadKey}`} src={url} title="In-site browser" className="h-full w-full" />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
            <p className="text-sm text-foreground-muted">
              Search, enter a URL, or point it at a local dev port — without leaving this tab.
            </p>
            <p className="max-w-md font-mono text-[11px] text-foreground-muted">
              Plain text routes through DuckDuckGo&apos;s lightweight HTML search, which doesn&apos;t
              build an ad profile from your query the way mainstream search does. This site adds
              no tracking of its own — but this isn&apos;t an anonymity tool; your network or ISP
              can still see that a request was made. Some sites (GitHub, Instagram, most banks)
              block being displayed inside another page as a security measure — the same
              limitation VS Code&apos;s Simple Browser has.
            </p>
          </div>
        )}
      </div>

      {url ? (
        <div className="flex items-center justify-between border-t border-border px-4 py-2">
          <span className="truncate font-mono text-[11px] text-foreground-muted">{url}</span>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 font-mono text-[11px] uppercase tracking-widest text-accent hover:underline"
          >
            Trouble loading? Open in new tab ↗
          </a>
        </div>
      ) : null}
    </div>
  );
}
