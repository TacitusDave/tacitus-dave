"use client";

import { cardStyles, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import type { projects } from "@/lib/content";

export function ProjectCard({ project }: { project: (typeof projects)[number] }) {
  return (
    <Dialog
      title={project.title}
      description={project.stack.join(" · ")}
      trigger={(open) => (
        <button
          type="button"
          onClick={open}
          className={cardStyles(
            "flex w-full flex-col outline-none hover:border-accent focus-visible:border-accent",
          )}
        >
          <CardTitle>{project.title}</CardTitle>
          <CardDescription className="flex-1">
            {project.summary}
          </CardDescription>
          <CardFooter>
            {project.stack.map((tech) => (
              <Badge key={tech}>{tech}</Badge>
            ))}
          </CardFooter>
        </button>
      )}
    >
      <p className="text-sm text-foreground-muted">{project.details}</p>
    </Dialog>
  );
}
