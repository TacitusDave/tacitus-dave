"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { buttonVariants } from "@/components/ui/button";

interface ExternalLinkPanelProps {
  href: string;
  label: string;
  description: string;
  trigger: (open: () => void) => ReactNode;
}

function hostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/**
 * A branded "you're about to leave" panel, styled like a minimal browser
 * chrome. External platforms (GitHub, Instagram, TikTok, LinkedIn) block
 * iframe embedding as an anti-clickjacking measure, so the destination
 * can't actually render inside the site — this keeps the transition
 * on-brand and explicit instead of a silent redirect.
 */
export function ExternalLinkPanel({
  href,
  label,
  description,
  trigger,
}: ExternalLinkPanelProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (isOpen && !node.open) node.showModal();
    if (!isOpen && node.open) node.close();
  }, [isOpen]);

  return (
    <>
      {trigger(() => setIsOpen(true))}

      <dialog
        ref={ref}
        onClose={() => setIsOpen(false)}
        onClick={(event) => {
          if (event.target === ref.current) setIsOpen(false);
        }}
        className="w-full max-w-md overflow-hidden rounded-md border border-border bg-background-elevated p-0 text-foreground backdrop:bg-black/60 backdrop:backdrop-blur-sm"
      >
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
          <div className="ml-2 flex-1 truncate rounded border border-border bg-background px-3 py-1 text-center font-mono text-[11px] text-foreground-muted">
            {hostname(href)}
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close"
            className="shrink-0 font-mono text-xs uppercase tracking-widest text-foreground-muted transition-colors hover:text-accent"
          >
            Esc
          </button>
        </div>

        <div className="flex flex-col items-center gap-4 px-6 py-10 text-center">
          <span
            className="flex h-12 w-12 items-center justify-center rounded-full border border-border font-mono text-lg text-accent"
            aria-hidden="true"
          >
            {label.charAt(0)}
          </span>
          <div>
            <p className="text-base font-medium text-foreground">{label}</p>
            <p className="mt-1 text-sm text-foreground-muted">{description}</p>
          </div>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className={buttonVariants()}
          >
            Continue to {label} ↗
          </a>
          <p className="font-mono text-[11px] text-foreground-muted">
            Opens {hostname(href)} in a new tab — {label} does not allow embedding.
          </p>
        </div>
      </dialog>
    </>
  );
}
