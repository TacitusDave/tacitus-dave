import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { pillars } from "@/lib/content";
import { labTools, toolsByCategory } from "@/lib/lab-tools";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardDescription } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { ScrollBrightenText } from "@/components/ui/scroll-brighten-text";
import { RadialBurst } from "@/components/lab/radial-burst";
import { HeroFlankArt } from "@/components/home/hero-flank-art";
import { HeroShowcase } from "@/components/home/hero-showcase";
import { HERO_SETTLE_FRACTION } from "@/lib/hero-timing";
import { TechMarquee } from "@/components/home/tech-marquee";
import { FeatureShowcase } from "@/components/home/feature-showcase";

const flagshipCount = labTools.filter((tool) => tool.kind === "flagship").length;

const homeStats = [
  { value: String(labTools.length), label: "Lab tools" },
  { value: String(toolsByCategory().length), label: "Categories" },
  { value: String(flagshipCount), label: "Free, no account" },
  { value: "0", label: "External UI/animation libraries" },
] as const;

const faqs = [
  {
    question: "Is everything on this site actually real?",
    answer:
      "Yes. The terminal, the SOC dashboard, the flow canvas, and every Lab utility genuinely compute in your browser — none of it is a screenshot or a staged demo.",
  },
  {
    question: "What's the difference between the free tools and the Lab?",
    answer:
      "Five flagship tools — Terminal, SOC Dashboard, Architecture Explorer, Browser, and Flow Builder — are free forever. Access unlocks the other 18 developer and security utilities.",
  },
  {
    question: "Are you available for freelance or full-time work?",
    answer: "Yes to both — see the Contact page for details on what I'm currently open to.",
  },
  {
    question: "Why build a portfolio this way instead of just listing skills?",
    answer:
      "Because a bullet-point list of skills is unverifiable. A working terminal, a real SOC dashboard, and tools you can actually run aren't.",
  },
] as const;

export default function Home() {
  return (
    <>
      <ScrollProgress heightVh={340}>
        {/* justify-start + top padding, not justify-center: on a short viewport,
            a centered flex column that overflows its container clips BOTH
            ends symmetrically — including the top of the headline, which can
            end up entirely invisible on shorter laptop/phone screens. Top-
            anchoring guarantees the headline always renders in full; the
            HeroShowcase still animates to true dead-center during the
            settle phase regardless, since that target is measured
            independently (see hero-showcase.tsx's measure()), not derived
            from this alignment. Any residual overflow on very short
            viewports now clips only the LESS critical bottom of the
            showcase, never the headline. */}
        <div className="relative mx-auto flex h-full max-w-6xl flex-col items-center justify-start px-6 pt-12 text-center sm:pt-16">
          <RadialBurst
            className="pointer-events-none absolute left-1/2 top-[38%] h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 text-accent/[0.18]"
            style={{
              maskImage: "radial-gradient(circle, black 0%, black 30%, transparent 70%)",
              WebkitMaskImage: "radial-gradient(circle, black 0%, black 30%, transparent 70%)",
            }}
          />

          <HeroFlankArt
            side="left"
            className="pointer-events-none absolute -left-6 top-1/2 hidden h-[420px] w-[420px] -translate-y-1/2 text-accent/[0.4] lg:block xl:-left-10"
            style={{
              maskImage: "linear-gradient(to right, black 0%, black 55%, transparent 92%)",
              WebkitMaskImage: "linear-gradient(to right, black 0%, black 55%, transparent 92%)",
            }}
          />
          <HeroFlankArt
            side="right"
            className="pointer-events-none absolute -right-6 top-1/2 hidden h-[420px] w-[420px] -translate-y-1/2 text-accent/[0.4] lg:block xl:-right-10"
            style={{
              maskImage: "linear-gradient(to left, black 0%, black 55%, transparent 92%)",
              WebkitMaskImage: "linear-gradient(to left, black 0%, black 55%, transparent 92%)",
            }}
          />

          <div
            style={{
              // Fully faded exactly as the settle phase completes (see
              // HERO_SETTLE_FRACTION, shared with HeroShowcase) — the text
              // needs to be gone by the moment the showcase finishes
              // rising into its place, not still fading in afterward.
              opacity: `calc(1 - var(--scroll-progress, 0) * ${(1 / HERO_SETTLE_FRACTION).toFixed(2)})`,
              transform: "translateY(calc(var(--scroll-progress, 0) * -40px))",
            }}
            // shrink-0: without it, flexbox silently compresses this block
            // (and the HeroShowcase below it) whenever their combined
            // natural height exceeds the sticky viewport — which it does
            // on a great many ordinary laptop screens — producing
            // inconsistent, non-round rendered sizes instead of a
            // predictable layout. Trimmed gaps (gap-4, was gap-7) claw
            // back some of the height that no longer being allowed to
            // silently shrink now costs.
            className="relative z-10 flex shrink-0 flex-col items-center gap-4"
          >
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Engineering &amp; Cybersecurity
            </div>

            <p className="font-mono text-sm text-foreground-muted">{siteConfig.name}</p>

            <h1 className="max-w-3xl text-5xl font-medium leading-[1.05] tracking-tight text-foreground sm:text-7xl">
              I build the software.
              <br />
              Then I defend it.
            </h1>

            <p className="max-w-2xl text-lg text-foreground-muted sm:text-xl">
              {siteConfig.description}
            </p>

            <div className="flex flex-col items-center gap-3 pt-2">
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link href="/pricing" className={buttonVariants({ size: "md" })}>
                  Get Started
                </Link>
                <Link href="/projects" className={buttonVariants({ variant: "outline", size: "md" })}>
                  View Projects
                </Link>
              </div>
              <p className="font-mono text-xs text-foreground-muted">
                or press <kbd className="rounded border border-border px-1.5 py-0.5">⌘K</kbd> to jump anywhere
              </p>
            </div>
          </div>

          <HeroShowcase />
        </div>
      </ScrollProgress>

      <section className="border-t border-border">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-6 py-16 text-center">
          <Reveal variant="drop" className="flex flex-col items-center gap-4">
            <p className="font-mono text-xs uppercase tracking-widest text-accent">
              Everything on this site is real, working software
            </p>
            <h2 className="text-xl font-medium tracking-tight text-foreground sm:text-2xl">
              Want to test them out yourself?
            </h2>
            <div className="mt-1 flex flex-wrap items-center justify-center gap-4">
              <Link href="/lab" className={buttonVariants()}>
                Try the free tools
              </Link>
              <Link href="/pricing" className={buttonVariants({ variant: "outline" })}>
                Get Started
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <TechMarquee />

      <section className="border-t border-border">
        <div className="mx-auto max-w-4xl px-6 py-24">
          <ScrollBrightenText
            text="I design, build, and secure modern web and mobile applications. Everything on this site — the terminal, the SOC dashboard, the tools in the Lab — is real, working software I built myself, not a mockup of what I could build."
            className="text-2xl font-medium leading-relaxed tracking-tight text-foreground sm:text-4xl"
          />
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <Reveal>
            <h2 className="font-mono text-xs uppercase tracking-widest text-accent">Two disciplines</h2>
            <p className="mt-3 max-w-2xl text-lg text-foreground-muted">
              Most people treat engineering and security as separate jobs. Here they&apos;re the same one.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <Reveal>
              <Card className="flex h-full flex-col p-8">
                <h3 className="font-mono text-xs uppercase tracking-widest text-accent">Engineering</h3>
                <p className="mt-3 text-xl font-medium text-foreground">
                  Full-stack builds that hold up under real load.
                </p>
                <ul className="mt-5 flex flex-1 flex-col gap-2 text-sm text-foreground-muted">
                  <li>— Next.js, TypeScript, React, Python/Django, PostgreSQL</li>
                  <li>— A real client platform in production (Ndukego Investments)</li>
                  <li>— A general-purpose diagram canvas built from scratch (Flow Builder)</li>
                </ul>
                <Link href="/projects" className="mt-6 self-start text-sm text-accent hover:underline">
                  See the case studies →
                </Link>
              </Card>
            </Reveal>

            <Reveal delayMs={80}>
              <Card className="flex h-full flex-col p-8">
                <h3 className="font-mono text-xs uppercase tracking-widest text-accent">Security</h3>
                <p className="mt-3 text-xl font-medium text-foreground">
                  Real SOC experience, not a certification without practice.
                </p>
                <ul className="mt-5 flex flex-1 flex-col gap-2 text-sm text-foreground-muted">
                  <li>— Threat monitoring mapped to the real MITRE ATT&amp;CK framework</li>
                  <li>— A live header-scanner you can point at any real URL right now</li>
                  <li>— Architecture reviewed for failure modes, not just features</li>
                </ul>
                <Link href="/security" className="mt-6 self-start text-sm text-accent hover:underline">
                  Open the SOC dashboard →
                </Link>
              </Card>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {pillars.map((pillar, index) => (
              <Reveal key={pillar.title} delayMs={index * 60}>
                <Card className="h-full hover:border-accent">
                  <h2 className="font-mono text-xs uppercase tracking-widest text-accent">{pillar.title}</h2>
                  <CardDescription>{pillar.description}</CardDescription>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <Reveal>
            <h2 className="font-mono text-xs uppercase tracking-widest text-accent">See it in action</h2>
            <p className="mt-3 max-w-2xl text-lg text-foreground-muted">Real tools, not screenshots — switch tabs or let it play.</p>
          </Reveal>
          <div className="mt-8">
            <FeatureShowcase />
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {homeStats.map((stat, index) => (
              <Reveal key={stat.label} delayMs={index * 60}>
                <Card className="p-5">
                  <p className="font-mono text-3xl font-medium text-foreground">{stat.value}</p>
                  <p className="mt-2 text-xs font-medium uppercase tracking-widest text-accent">{stat.label}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <Reveal>
            <h2 className="font-mono text-xs uppercase tracking-widest text-accent">Questions</h2>
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
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-6 py-24 text-center">
          <Reveal className="flex flex-col items-center gap-4">
            <h2 className="text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
              See it running, not just described.
            </h2>
            <p className="max-w-lg text-sm text-foreground-muted">
              Every tool on this site is one click away — no signup for the flagship set, no waiting for a demo call.
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
              <Link href="/lab" className={buttonVariants()}>
                Explore the Lab
              </Link>
              <Link href="/contact" className={buttonVariants({ variant: "outline" })}>
                Get in touch
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
