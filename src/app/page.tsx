import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { pillars } from "@/lib/content";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardDescription } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { ScrollBrightenText } from "@/components/ui/scroll-brighten-text";
import { Terminal } from "@/components/terminal/terminal";
import { TechMarquee } from "@/components/home/tech-marquee";
import { FeatureShowcase } from "@/components/home/feature-showcase";

export default function Home() {
  return (
    <>
      <ScrollProgress heightVh={220}>
        <div className="mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-6 text-center">
          <div
            style={{
              opacity: "calc(1 - var(--scroll-progress, 0) * 3)",
              transform: "translateY(calc(var(--scroll-progress, 0) * -40px))",
            }}
            className="flex flex-col items-center gap-6"
          >
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Engineering &amp; Cybersecurity
            </div>
            <h1 className="max-w-3xl text-5xl font-medium tracking-tight text-foreground sm:text-7xl">
              {siteConfig.name}
            </h1>
            <p className="max-w-2xl text-lg text-foreground-muted sm:text-xl">
              {siteConfig.description}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link href="/pricing" className={buttonVariants({ size: "md" })}>
                Get Started
              </Link>
              <Link href="/projects" className={buttonVariants({ variant: "outline", size: "md" })}>
                View Projects
              </Link>
            </div>
          </div>

          <div
            style={{
              transform: "scale(calc(0.82 + var(--scroll-progress, 0) * 0.4))",
            }}
            className="pointer-events-none mt-12 w-full max-w-3xl origin-center shadow-2xl"
            aria-hidden="true"
            // @ts-expect-error -- `inert` is a valid DOM attribute; React's types haven't caught up.
            inert=""
          >
            <Terminal />
          </div>
        </div>
      </ScrollProgress>

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
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {pillars.map((pillar, index) => (
              <Reveal key={pillar.title} delayMs={index * 60}>
                <Card className="h-full hover:border-accent">
                  <h2 className="font-mono text-xs uppercase tracking-widest text-accent">
                    {pillar.title}
                  </h2>
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
            <h2 className="font-mono text-xs uppercase tracking-widest text-accent">
              See it in action
            </h2>
            <p className="mt-3 max-w-2xl text-lg text-foreground-muted">
              Real tools, not screenshots — switch tabs or let it play.
            </p>
          </Reveal>
          <div className="mt-8">
            <FeatureShowcase />
          </div>
        </div>
      </section>
    </>
  );
}
