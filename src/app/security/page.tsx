import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { SocDashboard } from "@/components/security/soc-dashboard";

export const metadata: Metadata = {
  title: "Security — Tacitus Dave OS",
};

export default function SecurityPage() {
  return (
    <>
      <PageHeader
        eyebrow="Security"
        title="SOC dashboard & threat simulator."
        description="A simulated security-operations view: synthetic events mapped to MITRE ATT&CK, triaged and displayed the way a real SOC dashboard would. Nothing here is live telemetry — it's a demonstration of how the data would be modeled, detected, and communicated."
      />

      <section className="mx-auto max-w-6xl px-6 py-12">
        <SocDashboard />
      </section>
    </>
  );
}
