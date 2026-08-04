import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { projects } from "@/lib/content";
import { ProjectCard } from "@/components/projects/project-card";

export const metadata: Metadata = {
  title: "Builds",
  description:
    "Engineering case studies from Tacitus Dave — systems built end to end, with the reasoning behind each decision.",
};

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Builds"
        title="Engineering case studies."
        description="Systems built end to end — from architecture decisions through deployment and operation. Each case study explains not just what was built, but why."
      />

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>
    </>
  );
}
