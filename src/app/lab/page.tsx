import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { LabCatalog } from "@/components/lab/lab-catalog";

export const metadata: Metadata = {
  title: "Lab",
  description:
    "A searchable catalog of every interactive tool on Tacitus Dave OS, grouped by security, systems, and developer utilities.",
};

export default function LabPage() {
  return (
    <>
      <PageHeader
        eyebrow="The Lab"
        title="Every tool, in one place."
        description="Flagship demonstrations and small utilities, grouped by discipline. Some are polished simulations, some are real everyday tools — all of them are here so you can see how this platform's builder actually works, not just read a claim about it."
      />

      <section className="mx-auto max-w-6xl px-6 py-12">
        <LabCatalog />
      </section>
    </>
  );
}
