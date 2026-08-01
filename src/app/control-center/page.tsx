import type { Metadata } from "next";
import { LogoutButton } from "@/components/admin/logout-button";

export const metadata: Metadata = {
  title: "Control Center",
  robots: { index: false, follow: false },
};

export default function ControlCenterPage() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-accent">Control Center</p>
          <h1 className="mt-2 text-2xl font-medium tracking-tight text-foreground">
            You&apos;re in.
          </h1>
        </div>
        <LogoutButton />
      </div>

      <p className="mt-6 max-w-xl text-sm text-foreground-muted">
        This is the authenticated shell — no admin capabilities are wired up yet. Tell me what
        should live here (subscriber list, manual access grants, content editing, whatever else)
        and I&apos;ll build it against this same login.
      </p>
    </section>
  );
}
