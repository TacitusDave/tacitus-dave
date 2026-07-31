import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { ArchitectureExplorer } from "@/components/architecture/architecture-explorer";
import { RelatedTools } from "@/components/lab/related-tools";

export const metadata: Metadata = {
  title: "Architecture — Tacitus Dave OS",
};

export default function ArchitecturePage() {
  return (
    <>
      <PageHeader
        eyebrow="Architecture · Worked Example"
        title="Explore a system, not just a diagram."
        description="A reference architecture for a typical production API — the kind of system-design walkthrough this platform will host for real case studies. Click any node for the reasoning behind it, not just its name."
      />

      <section className="mx-auto max-w-5xl px-6 py-12">
        <ArchitectureExplorer />
      </section>

      <RelatedTools currentSlug="architecture" />
    </>
  );
}
