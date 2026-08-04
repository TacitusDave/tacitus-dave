import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { SubscribeButton } from "@/components/pricing/subscribe-button";
import { pricingPlans, billingCurrencyNote } from "@/lib/pricing";
import { labTools } from "@/lib/lab-tools";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Access",
  description:
    "Subscribe to unlock the full Tacitus Dave Lab — a premium, ever-expanding suite of developer and security utilities, crafted for professionals who won't settle for the free-tier version.",
};

const flagshipTools = labTools.filter((tool) => tool.kind === "flagship");

export default function PricingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Access"
        title="Unlock the full Lab."
        description="The flagship demonstrations — Terminal, SOC Dashboard, Architecture Explorer, Browser — stay free, always. A subscription unlocks the rest of the Lab: a premium, continuously expanding suite of production-grade utilities, built to the same standard as the tools you'd trust in a real engineering workflow — no ads, no artificial limits, no watered-down 'free tier' experience."
      />

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-6 sm:grid-cols-2">
          {pricingPlans.map((plan, index) => {
            const inverted = plan.highlight === "Best value";
            return (
              <Reveal key={plan.id} delayMs={index * 80}>
                <Card
                  className={cn(
                    "relative flex h-full flex-col gap-6",
                    inverted && "border-transparent bg-[#09122a] text-white",
                  )}
                >
                  {plan.highlight ? (
                    <span
                      className={cn(
                        "absolute -top-3 right-6 rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-widest",
                        inverted
                          ? "border-white/20 bg-white text-[#09122a]"
                          : "border-accent bg-background text-accent",
                      )}
                    >
                      {plan.highlight}
                    </span>
                  ) : null}
                  <div>
                    <p className="font-mono text-xs uppercase tracking-widest text-accent">
                      {plan.label}
                    </p>
                    <p className={cn("mt-2 text-sm", inverted ? "text-white/60" : "text-foreground-muted")}>
                      {plan.tagline}
                    </p>
                    <p className="mt-3 flex items-baseline gap-1">
                      <span className={cn("text-4xl font-medium", inverted ? "text-white" : "text-foreground")}>
                        {plan.price}
                      </span>
                      <span className={cn("text-sm", inverted ? "text-white/50" : "text-foreground-muted")}>
                        {plan.period}
                      </span>
                    </p>
                    {plan.note ? (
                      <p className={cn("mt-1 text-xs", inverted ? "text-white/50" : "text-foreground-muted")}>
                        {plan.note}
                      </p>
                    ) : null}
                  </div>
                  <ul className="flex flex-1 flex-col gap-2">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className={cn("flex gap-2 text-sm", inverted ? "text-white/80" : "text-foreground-muted")}
                      >
                        <span
                          aria-hidden="true"
                          className={cn(
                            "flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px]",
                            inverted ? "bg-accent text-white" : "bg-accent/15 text-accent",
                          )}
                        >
                          ✓
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <SubscribeButton plan={plan.id} label={`Subscribe ${plan.label}`} />
                </Card>
              </Reveal>
            );
          })}
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
            Always free
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {flagshipTools.map((tool) => (
              <Link
                key={tool.slug}
                href={tool.href}
                className="block rounded-xl border border-border bg-background-elevated/60 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-lg"
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
