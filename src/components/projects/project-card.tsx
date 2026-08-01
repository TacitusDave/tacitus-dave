import Link from "next/link";
import Image from "next/image";
import { CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/lib/content";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="flex flex-col overflow-hidden rounded-md border border-border bg-background-elevated/40 text-left outline-none transition-colors duration-200 hover:border-accent focus-visible:border-accent"
    >
      {project.image ? (
        <div className="relative aspect-video w-full overflow-hidden border-b border-border bg-background-elevated">
          <Image
            src={project.image}
            alt={`Screenshot of ${project.title}`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover object-top"
          />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col p-6">
        <CardTitle>{project.title}</CardTitle>
        <CardDescription className="flex-1">{project.summary}</CardDescription>
        <CardFooter>
          {project.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </CardFooter>
      </div>
    </Link>
  );
}
