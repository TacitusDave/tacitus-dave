import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { brandTraits, brandPromise } from "@/lib/content";

export const metadata: Metadata = {
  title: "About — Tacitus Dave OS",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Bridging software engineering and cybersecurity."
        description="Tacitus Dave exists to demonstrate that security should not be an afterthought added after development, but an integral part of every stage of system design, implementation, deployment, and operation."
      />

      <section className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="font-mono text-xs uppercase tracking-widest text-accent">
          What you can expect
        </h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {brandPromise.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 rounded-md border border-border p-4 text-sm text-foreground-muted"
            >
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <h2 className="font-mono text-xs uppercase tracking-widest text-accent">
            How this platform operates
          </h2>
          <div className="mt-6 grid gap-px overflow-hidden rounded-md bg-border sm:grid-cols-2 lg:grid-cols-5">
            {brandTraits.map(({ trait, description }) => (
              <div key={trait} className="bg-background p-5">
                <p className="text-sm font-medium text-foreground">{trait}</p>
                <p className="mt-2 text-xs text-foreground-muted">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
