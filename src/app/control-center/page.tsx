import type { Metadata } from "next";
import { LogoutButton } from "@/components/admin/logout-button";
import { SubscriberManager } from "@/components/admin/subscriber-manager";

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
          <h1 className="mt-2 text-2xl font-medium tracking-tight text-foreground">Subscribers</h1>
        </div>
        <LogoutButton />
      </div>

      <div className="mt-8">
        <SubscriberManager />
      </div>
    </section>
  );
}
