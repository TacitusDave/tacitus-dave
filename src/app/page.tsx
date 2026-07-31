import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { pillars } from "@/lib/content";

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
          <Link
            href="/projects"
            className="rounded-md bg-accent px-5 py-2.5 font-mono text-sm text-accent-foreground transition-opacity hover:opacity-90"
          >
            View Projects
          </Link>
          <Link
            href="/contact"
            className="rounded-md border border-border px-5 py-2.5 font-mono text-sm text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            Contact
          </Link>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto grid max-w-6xl gap-px bg-border px-6 sm:grid-cols-2 lg:grid-cols-5">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="bg-background p-6">
              <h2 className="font-mono text-xs uppercase tracking-widest text-accent">
                {pillar.title}
              </h2>
              <p className="mt-3 text-sm text-foreground-muted">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
