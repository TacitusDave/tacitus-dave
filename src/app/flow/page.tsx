import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { FlowBuilder } from "@/components/flow/flow-builder";
import { RelatedTools } from "@/components/lab/related-tools";

export const metadata: Metadata = {
  title: "Flow Builder",
  description:
    "A visual canvas for mapping system flows, pipelines, and decision trees — drag, connect, auto-layout, and export, entirely in the browser.",
};

export default function FlowPage() {
  return (
    <>
      <PageHeader
        eyebrow="Flow Builder"
        title="Map a flow, not just a list of steps."
        description="Architecture diagrams, API sequences, CI/CD pipelines, decision trees, state machines — sketch it visually, connect the pieces, and export it. Everything saves to your browser automatically; nothing is sent anywhere."
      />

      <section className="mx-auto max-w-7xl px-6 py-12">
        <FlowBuilder />
      </section>

      <RelatedTools currentSlug="flow" />
    </>
  );
}
