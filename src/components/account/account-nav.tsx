"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const TABS = [
  { href: "/account", label: "Overview", ownerOnly: false },
  { href: "/account/billing", label: "Billing", ownerOnly: false },
  { href: "/account/members", label: "Members", ownerOnly: true },
  { href: "/account/api-keys", label: "API Keys", ownerOnly: true },
  { href: "/account/usage", label: "Usage", ownerOnly: true },
] as const;

export function AccountNav({ canManage }: { canManage: boolean }) {
  const pathname = usePathname();
  const tabs = TABS.filter((tab) => canManage || !tab.ownerOnly);

  return (
    <nav className="flex flex-wrap gap-1 border-b border-border" aria-label="Account">
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "border-b-2 px-3 py-2.5 font-mono text-xs uppercase tracking-widest transition-colors",
              active
                ? "border-accent text-foreground"
                : "border-transparent text-foreground-muted hover:text-foreground",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
