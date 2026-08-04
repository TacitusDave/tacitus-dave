import type { Metadata } from "next";
import Link from "next/link";
import { focusAreas } from "@/lib/content";
import { labTools, type LabCategory } from "@/lib/lab-tools";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { ProfilePhoto } from "@/components/about/profile-photo";

const categoryCount = new Set<LabCategory>(labTools.map((tool) => tool.category)).size;

const stats = [
  { value: String(labTools.length), label: "Lab tools", detail: "Each one does real computation client-side — no mocked output." },
  { value: String(categoryCount), label: "Tool categories", detail: "Security, systems & networking, developer utilities, search & browsing." },
  { value: "0", label: "UI or animation libraries", detail: "Every transition, scroll effect, and layout here is hand-written CSS and React." },
  { value: "1", label: "Person building this", detail: "No team, no agency — every line on this site is mine." },
] as const;

export const metadata: Metadata = {
  title: "Profile",
  description:
    "How Tacitus Dave bridges software engineering and cybersecurity — the philosophy behind a platform built on transparency, security-first thinking, and continuous learning.",
};

export default function AboutPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
          <ProfilePhoto />

          <div className="flex-1">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Profile
            </div>

            <h1 className="mt-4 text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
              Full-stack developer. SOC analyst. One discipline, not two jobs.
            </h1>

            <p className="mt-4 max-w-2xl text-lg text-foreground-muted">
              I&apos;m the engineer behind this platform. I design, build, and secure modern web
              and mobile applications, and I built Tacitus Dave OS because I was tired of
              portfolios that describe skills instead of demonstrating them — everything you can
              click, type into, or run on this site, I built myself, and it does what it says.
            </p>

            <p className="mt-4 max-w-2xl text-sm text-foreground-muted">
              My work splits across two disciplines most people treat as separate. On one side:
              production-ready web and mobile applications — responsive interfaces, scalable
              backend APIs, systems that hold up under real load. On the other: the SOC side of
              the job — monitoring security events, investigating incidents, running threat
              detection and vulnerability assessment, reading logs closely enough to catch what
              shouldn&apos;t be there. I don&apos;t treat these as two jobs. Security shapes how I
              design software from the first line of code, and understanding a system at the
              architecture level is what makes me useful defending one.
            </p>

            <p className="mt-4 max-w-2xl text-sm text-foreground-muted">
              I got into this field the way a lot of people do: by breaking things first and
              learning how they worked afterward. That instinct — take it apart, understand the
              failure mode, put it back together more resilient — is still how I approach most of
              my work. I care about systems that are boring in the best way: predictable,
              observable, and hard to break by accident. That&apos;s the thread running through
              everything here, from the architecture walkthroughs to the tools in the Lab.
            </p>

            <p className="mt-6 max-w-2xl border-l-2 border-accent pl-4 font-mono text-sm text-accent">
              Great software isn&apos;t only functional — it&apos;s secure, scalable, reliable,
              and built to create lasting value. Always learning. Always building. Always
              improving.
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
            What&apos;s actually here
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.label} className="p-5 hover:border-accent">
                <p className="font-mono text-3xl font-medium text-foreground">{stat.value}</p>
                <p className="mt-2 text-xs font-medium uppercase tracking-widest text-accent">
                  {stat.label}
                </p>
                <p className="mt-2 text-xs text-foreground-muted">{stat.detail}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
