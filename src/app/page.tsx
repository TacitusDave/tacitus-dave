import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { pillars } from "@/lib/content";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardDescription } from "@/components/ui/card";

export default function Home() {
  return (
    <>
      <section className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-28 sm:py-36">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Engineering &amp; Cybersecurity
        </div>

        <h1 className="max-w-3xl text-4xl font-medium tracking-tight text-foreground sm:text-6xl">
          {siteConfig.name}
        </h1>

        <p className="max-w-2xl text-lg text-foreground-muted sm:text-xl">
          {siteConfig.description}
        </p>

        <p className="font-mono text-sm text-accent">{siteConfig.motto}</p>

        <div className="flex flex-wrap gap-4 pt-4">
          <Link href="/projects" className={buttonVariants()}>
            View Projects
          </Link>
          <Link href="/contact" className={buttonVariants({ variant: "outline" })}>
            Contact
          </Link>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {pillars.map((pillar) => (
              <Card key={pillar.title} className="hover:border-accent">
                <h2 className="font-mono text-xs uppercase tracking-widest text-accent">
                  {pillar.title}
                </h2>
                <CardDescription>{pillar.description}</CardDescription>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
