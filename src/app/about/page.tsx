import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import profileImage from "../../../public/profile.jpg";
import { brandTraits, brandPromise, focusAreas } from "@/lib/content";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About",
  description:
    "How Tacitus Dave bridges software engineering and cybersecurity — the philosophy behind a platform built on transparency, security-first thinking, and continuous learning.",
};

export default function AboutPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
          <div className="mx-auto w-48 shrink-0 sm:w-56 lg:mx-0">
            <div className="overflow-hidden rounded-md border border-border">
              <Image
                src={profileImage}
                alt={`Portrait of ${siteConfig.name}`}
                priority
                placeholder="blur"
                sizes="(min-width: 1024px) 224px, 192px"
                className="h-auto w-full object-cover"
              />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              About
            </div>

            <h1 className="mt-4 text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
              Bridging software engineering and cybersecurity.
            </h1>

            <p className="mt-4 max-w-2xl text-lg text-foreground-muted">
              I&apos;m the engineer behind this platform. I work across software development and
              security, and I built Tacitus Dave OS because I was tired of portfolios that
              describe skills instead of demonstrating them — everything you can click, type
              into, or run on this site, I built myself, and it does what it says.
            </p>

            <p className="mt-4 max-w-2xl text-sm text-foreground-muted">
              I got into this field the way a lot of people do: by breaking things first and
              learning how they worked afterward. That instinct — take it apart, understand the
              failure mode, put it back together more resilient — is still how I approach most of
              my work. I care about systems that are boring in the best way: predictable,
              observable, and hard to break by accident. Security isn&apos;t a checklist bolted on
              at the end; it&apos;s a habit built into how something gets designed from the first
              line of code. That&apos;s the thread running through everything here, from the
              architecture walkthroughs to the tools in the Lab.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {focusAreas.map((area) => (
                <Badge key={area}>{area}</Badge>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/projects" className={buttonVariants()}>
                View Projects
              </Link>
              <Link href="/contact" className={buttonVariants({ variant: "outline" })}>
                Contact
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-12">
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
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <h2 className="font-mono text-xs uppercase tracking-widest text-accent">
            How this platform operates
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {brandTraits.map(({ trait, description }) => (
              <Card key={trait} className="p-5 hover:border-accent">
                <div className="flex items-center gap-2">
                  <Badge className="border-accent/40 text-accent">
                    {trait}
                  </Badge>
                </div>
                <p className="mt-3 text-xs text-foreground-muted">
                  {description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
