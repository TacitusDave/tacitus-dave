import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { projects } from "@/lib/content";
import { Badge } from "@/components/ui/badge";
import { cardStyles } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { ProjectLiveLink } from "@/components/projects/project-live-link";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.summary,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) notFound();

  const otherProjects = projects.filter((p) => p.slug !== project.slug);

  return (
    <>
      <section className="mx-auto max-w-4xl px-6 py-16">
        <Link
          href="/projects"
          className="font-mono text-xs uppercase tracking-widest text-foreground-muted transition-colors hover:text-accent"
        >
          ← All Projects
        </Link>

        <h1 className="mt-6 text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
          {project.title}
        </h1>

        <p className="mt-4 text-lg text-foreground-muted">{project.summary}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>

        {project.liveUrl ? (
          <div className="mt-6">
            <ProjectLiveLink url={project.liveUrl} title={project.title} />
          </div>
        ) : project.internalUrl ? (
          <div className="mt-6">
            <Link href={project.internalUrl} className={buttonVariants()}>
              Try It Live ↗
            </Link>
          </div>
        ) : null}

        {project.image ? (
          <div className="relative mt-10 aspect-video w-full overflow-hidden rounded-md border border-border">
            <Image
              src={project.image}
              alt={`Screenshot of ${project.title}`}
              fill
              priority
              sizes="(min-width: 1024px) 896px, 100vw"
              className="object-cover object-top"
            />
          </div>
        ) : null}

        <div className="mt-10 border-t border-border pt-10">
          <h2 className="font-mono text-xs uppercase tracking-widest text-accent">
            The story
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-foreground-muted">
            {project.details}
          </p>
        </div>
      </section>

      {otherProjects.length > 0 ? (
        <section className="border-t border-border">
          <div className="mx-auto max-w-4xl px-6 py-12">
            <h2 className="font-mono text-xs uppercase tracking-widest text-accent">
              More projects
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {otherProjects.map((other) => (
                <Link
                  key={other.slug}
                  href={`/projects/${other.slug}`}
                  className={cardStyles("block transition-colors hover:border-accent")}
                >
                  <p className="text-sm font-medium text-foreground">{other.title}</p>
                  <p className="mt-2 text-xs text-foreground-muted">{other.summary}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
