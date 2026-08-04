import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { LabCatalog } from "@/components/lab/lab-catalog";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { buttonVariants } from "@/components/ui/button";
import { labTools, toolsByCategory } from "@/lib/lab-tools";

export const metadata: Metadata = {
  title: "Lab",
  description:
    "A searchable catalog of every interactive tool on Tacitus Dave OS, grouped by security, systems, and developer utilities.",
};

const flagshipCount = labTools.filter((tool) => tool.kind === "flagship").length;
const utilityCount = labTools.length - flagshipCount;

const labStats = [
  { value: String(labTools.length), label: "Total tools" },
  { value: String(toolsByCategory().length), label: "Categories" },
  { value: String(flagshipCount), label: "Free, no account" },
  { value: String(utilityCount), label: "Unlocked with Access" },
] as const;

export default function LabPage() {
  return (
    <>
      <PageHeader
        eyebrow="The Lab"
        title="Every tool, in one place."
        description="Flagship demonstrations and small utilities, grouped by discipline. Some are polished simulations, some are real everyday tools — all of them are here so you can see how this platform's builder actually works, not just read a claim about it."
      />

      <section className="mx-auto max-w-6xl px-6 pb-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {labStats.map((stat, index) => (
            <Reveal key={stat.label} delayMs={index * 60}>
              <Card className="h-full p-5">
                <p className="font-mono text-3xl font-medium text-foreground">{stat.value}</p>
                <p className="mt-2 text-xs font-medium uppercase tracking-widest text-accent">
                  {stat.label}
                </p>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <LabCatalog />
      </section>

      <section className="border-t border-border">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-6 py-20 text-center">
          <Reveal className="flex flex-col items-center gap-4">
            <h2 className="text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
              {utilityCount} more tools, one subscription away.
            </h2>
            <p className="max-w-lg text-sm text-foreground-muted">
              Everything marked outside the flagship set above unlocks with Lab Access — same build quality, no artificial limits.
            </p>
            <Link href="/pricing" className={buttonVariants()}>
              See Access plans
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
