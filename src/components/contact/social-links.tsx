"use client";

import { ExternalLinkPanel } from "@/components/ui/external-link-panel";

interface SocialLink {
  label: string;
  href: string;
  description: string;
}

export function SocialLinks({ links }: { links: SocialLink[] }) {
  return (
    <div className="mt-2 flex flex-col gap-1">
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
              className="text-left text-sm text-foreground-muted transition-colors hover:text-accent"
            >
              {link.label}
            </button>
          )}
        />
      ))}
    </div>
  );
}
