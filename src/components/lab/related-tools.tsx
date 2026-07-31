import Link from "next/link";
import { cardStyles } from "@/components/ui/card";
import { relatedTools } from "@/lib/lab-tools";

export function RelatedTools({ currentSlug }: { currentSlug: string }) {
  const tools = relatedTools(currentSlug);

  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="font-mono text-xs uppercase tracking-widest text-accent">
          More from the Lab
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link
              key={tool.slug}
              href={tool.href}
              className={cardStyles("block transition-colors hover:border-accent")}
            >
              <p className="text-sm font-medium text-foreground">{tool.title}</p>
              <p className="mt-2 text-xs text-foreground-muted">{tool.tagline}</p>
            </Link>
          ))}
        </div>
        <Link
          href="/lab"
          className="mt-6 inline-block font-mono text-xs uppercase tracking-widest text-accent hover:underline"
        >
          View all tools in the Lab →
        </Link>
      </div>
    </section>
  );
}
