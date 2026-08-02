import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { SubscribeButton } from "@/components/pricing/subscribe-button";
import { pricingPlans, billingCurrencyNote } from "@/lib/pricing";
import { labTools } from "@/lib/lab-tools";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Subscribe to unlock the full Tacitus Dave Lab — a premium, ever-expanding suite of developer and security utilities, crafted for professionals who won't settle for the free-tier version.",
};

const labUtilities = labTools.filter((tool) => tool.kind === "utility");
const flagshipTools = labTools.filter((tool) => tool.kind === "flagship");

export default function PricingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Pricing"
        title="Unlock the full Lab."
        description="The flagship demonstrations — Terminal, SOC Dashboard, Architecture Explorer, Browser — stay free, always. A subscription unlocks the rest of the Lab: a premium, continuously expanding suite of production-grade utilities, built to the same standard as the tools you'd trust in a real engineering workflow — no ads, no artificial limits, no watered-down 'free tier' experience."
      />

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-6 sm:grid-cols-2">
          {pricingPlans.map((plan) => (
            <Card key={plan.id} className="relative flex flex-col gap-6">
              {plan.highlight ? (
                <span className="absolute -top-3 right-6 rounded-full border border-accent bg-background px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-accent">
                  {plan.highlight}
                </span>
              ) : null}
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-accent">
                  {plan.label}
                </p>
                <p className="mt-2 text-sm text-foreground-muted">{plan.tagline}</p>
                <p className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-medium text-foreground">{plan.price}</span>
                  <span className="text-sm text-foreground-muted">{plan.period}</span>
                </p>
                {plan.note ? (
                  <p className="mt-1 text-xs text-foreground-muted">{plan.note}</p>
                ) : null}
              </div>
              <ul className="flex flex-1 flex-col gap-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2 text-sm text-foreground-muted">
                    <span aria-hidden="true" className="text-accent">
                      ✓
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <SubscribeButton plan={plan.id} label={`Subscribe ${plan.label}`} />
            </Card>
          ))}
        </div>

        <p className="mt-6 text-xs text-foreground-muted">{billingCurrencyNote}</p>

        <p className="mt-2 text-xs text-foreground-muted">
          Already subscribed?{" "}
          <Link href="/lab/authorize" className="text-accent hover:underline">
            Sign in to the Lab
          </Link>
          .
        </p>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <h2 className="font-mono text-xs uppercase tracking-widest text-accent">
            What&apos;s included
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-foreground-muted">
            Every tool below is built to the same exacting standard, engineered for precision
            and speed rather than thrown together as a gimmick.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {labUtilities.map((tool) => (
              <Card key={tool.slug}>
                <CardTitle>{tool.title}</CardTitle>
                <CardDescription>{tool.tagline}</CardDescription>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <h2 className="font-mono text-xs uppercase tracking-widest text-accent">
            Always free
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {flagshipTools.map((tool) => (
              <Link
                key={tool.slug}
                href={tool.href}
                className="block rounded-md border border-border p-5 transition-colors hover:border-accent"
              >
                <p className="text-sm font-medium text-foreground">{tool.title}</p>
                <p className="mt-2 text-xs text-foreground-muted">{tool.tagline}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
