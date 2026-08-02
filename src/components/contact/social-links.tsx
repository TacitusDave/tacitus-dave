"use client";

import { ExternalLinkPanel } from "@/components/ui/external-link-panel";

interface SocialLink {
  label: string;
  href: string;
  description: string;
}

export function SocialLinks({ links }: { links: SocialLink[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {links.map((link) => (
        <ExternalLinkPanel
          key={link.label}
          href={link.href}
          label={link.label}
          description={link.description}
          trigger={(open) => (
            <button
              type="button"
              onClick={open}
              className="flex h-full flex-col items-start gap-3 rounded-md border border-border bg-background-elevated/40 p-4 text-left transition-colors hover:border-accent"
            >
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border font-mono text-sm text-accent"
                aria-hidden="true"
              >
                {link.label.charAt(0)}
              </span>
              <span>
                <span className="block text-sm font-medium text-foreground">{link.label}</span>
                <span className="mt-1 block text-xs text-foreground-muted">{link.description}</span>
              </span>
            </button>
          )}
        />
      ))}
    </div>
  );
}
