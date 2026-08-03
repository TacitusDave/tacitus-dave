import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { FlowBuilder } from "@/components/flow/flow-builder";
import { RelatedTools } from "@/components/lab/related-tools";

export const metadata: Metadata = {
  title: "Flow Builder",
  description:
    "A general-purpose visual design canvas — flowcharts, architecture diagrams, wireframes, and system sketches, with shapes, icons, and text, entirely in the browser.",
};

export default function FlowPage() {
  return (
    <>
      <PageHeader
        eyebrow="Flow Builder"
        title="A canvas for any kind of diagram, not just flowcharts."
        description="Flowchart nodes, generic shapes, free text, and a real icon library — architecture diagrams, API sequences, CI/CD pipelines, decision trees, UI wireframes, system sketches. Sketch it visually, connect the pieces, and export it. Everything saves to your browser automatically; nothing is sent anywhere."
      />

      <section className="mx-auto max-w-7xl px-6 py-12">
        <FlowBuilder />
      </section>

      <RelatedTools currentSlug="flow" />
    </>
  );
}
