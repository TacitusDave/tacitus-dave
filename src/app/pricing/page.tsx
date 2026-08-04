import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { buttonVariants } from "@/components/ui/button";
import { SubscribeButton } from "@/components/pricing/subscribe-button";
import { pricingPlans, billingCurrencyNote } from "@/lib/pricing";
import { labTools, toolsByCategory } from "@/lib/lab-tools";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Access",
  description:
    "Subscribe to unlock the full Tacitus Dave Lab — a premium, ever-expanding suite of developer and security utilities, crafted for professionals who won't settle for the free-tier version.",
};

const flagshipTools = labTools.filter((tool) => tool.kind === "flagship");

const trustSignals = [
  {
    title: "Your card never touches this site",
    detail: "Payment runs through Paystack directly. This site only ever sees the resulting subscription status.",
  },
  {
    title: "Sign-in doesn't outlive your browser",
    detail: "Lab sessions are cookie-based and session-only by design — closing the browser ends it, even on a shared machine.",
  },
  {
    title: "Cancel any month, no retention flow",
    detail: "No exit survey, no downgrade maze. Cancel and it stops at the end of the current billing period.",
  },
  {
    title: "Lose your key, get it back instantly",
    detail: "Access keys are resent on request — the same one every time, not a new one that invalidates the old.",
  },
] as const;

const faqs = [
  {
    question: "What's actually different between free and the Lab?",
    answer:
      "Five tools — Terminal, SOC Dashboard, Architecture Explorer, In-Site Browser, and Flow Builder — are free forever, no account needed. A Lab subscription unlocks the other 18 utilities: JWT Decoder, Hash Generator, Regex Tester, and the rest of the developer/security toolset below.",
  },
  {
    question: "What currency am I actually billed in?",
    answer:
      "Naira, via Paystack. The USD prices above are reference points so the cost is legible regardless of where you're reading from — the real charge is the NGN amount Paystack shows you at checkout.",
  },
  {
    question: "What happens if I cancel?",
    answer:
      "Access continues until the end of the period you already paid for, then reverts to the free flagship tools. No partial refunds for time already billed unless something on this end was actually broken.",
  },
  {
    question: "How do I get back in after subscribing?",
    answer:
      "You get a persistent access key by email at signup — go to Lab sign-in, enter your email and that key. It doesn't expire or rotate for the life of your subscription.",
  },
  {
    question: "Do new tools get added over time?",
    answer:
      "Yes — the Lab is actively growing, and anything added later is included in an existing subscription at no extra cost, the moment it ships.",
  },
] as const;

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

      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <Reveal>
            <h2 className="font-mono text-xs uppercase tracking-widest text-accent">
              What&apos;s in each tier, by category
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-foreground-muted">
              Every tool the Lab has, grouped the way the catalog is organized — not a marketing summary, the actual list.
            </p>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {toolsByCategory().map(({ category, tools }, index) => (
              <Reveal key={category} delayMs={index * 60}>
                <Card className="h-full p-5">
                  <h3 className="font-mono text-xs uppercase tracking-widest text-foreground">
                    {category}
                  </h3>
                  <ul className="mt-4 flex flex-col gap-2.5">
                    {tools.map((tool) => (
                      <li key={tool.slug} className="flex items-center justify-between gap-3 text-sm">
                        <span className="text-foreground-muted">{tool.title}</span>
                        <span
                          className={cn(
                            "shrink-0 rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest",
                            tool.kind === "flagship" ? "bg-background-elevated text-foreground-muted" : "bg-accent/15 text-accent",
                          )}
                        >
                          {tool.kind === "flagship" ? "Free" : "Lab"}
                        </span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {trustSignals.map((signal, index) => (
              <Reveal key={signal.title} delayMs={index * 60}>
                <Card className="h-full p-5">
                  <p className="text-sm font-medium text-foreground">{signal.title}</p>
                  <p className="mt-2 text-xs text-foreground-muted">{signal.detail}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <Reveal>
            <h2 className="font-mono text-xs uppercase tracking-widest text-accent">
              Questions
            </h2>
          </Reveal>
          <div className="mt-6 flex flex-col divide-y divide-border border-t border-border">
            {faqs.map((faq) => (
              <details key={faq.question} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-foreground marker:content-none">
                  {faq.question}
                  <span className="shrink-0 font-mono text-accent transition-transform duration-200 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-foreground-muted">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-6 py-20 text-center">
          <Reveal className="flex flex-col items-center gap-4">
            <h2 className="text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
              Still deciding? Try the free tools first.
            </h2>
            <p className="max-w-lg text-sm text-foreground-muted">
              Terminal, SOC Dashboard, Architecture Explorer, Browser, and Flow Builder cost nothing and need no account — see the actual quality of the work before paying for more of it.
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
              <Link href="/lab" className={buttonVariants()}>
                Explore the Lab
              </Link>
              <a href={`mailto:${siteConfig.contactEmail}`} className={buttonVariants({ variant: "outline" })}>
                Ask a question first
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
