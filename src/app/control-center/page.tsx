import type { Metadata } from "next";
import { LogoutButton } from "@/components/admin/logout-button";
import { OrgManager } from "@/components/admin/org-manager";
import { OwnerCodePanel } from "@/components/admin/owner-code-panel";
import { OwnerSessionsPanel } from "@/components/admin/owner-sessions-panel";
import { ActivityLog } from "@/components/admin/activity-log";

export const metadata: Metadata = {
  title: "Control Center",
  robots: { index: false, follow: false },
};

export default function ControlCenterPage() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-accent">Control Center</p>
          <h1 className="mt-2 text-2xl font-medium tracking-tight text-foreground">Organizations</h1>
        </div>
        <LogoutButton />
      </div>

      <div className="mt-8">
        <OrgManager />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <OwnerCodePanel />
        <ActivityLog />
      </div>

      <div className="mt-6">
        <OwnerSessionsPanel />
      </div>
    </section>
  );
}
