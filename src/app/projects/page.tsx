import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { projects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projects — Tacitus Dave OS",
};

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Projects"
        title="Engineering case studies."
        description="Systems built end to end — from architecture decisions through deployment and operation. Each case study explains not just what was built, but why."
      />

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <article
              key={project.slug}
              className="flex flex-col rounded-md border border-border p-6 transition-colors hover:border-accent"
            >
              <h2 className="text-lg font-medium text-foreground">
                {project.title}
              </h2>
              <p className="mt-3 flex-1 text-sm text-foreground-muted">
                {project.summary}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-border px-2.5 py-1 font-mono text-[11px] text-foreground-muted"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
