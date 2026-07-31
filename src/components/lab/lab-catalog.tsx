"use client";

import { useState } from "react";
import Link from "next/link";
import { cardStyles } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fieldStyles } from "@/components/lab/field-styles";
import { toolsByCategory, type LabTool } from "@/lib/lab-tools";

export function LabCatalog() {
  const [query, setQuery] = useState("");
  const groups = toolsByCategory();

  const q = query.trim().toLowerCase();
  const filteredGroups = !q
    ? groups
    : groups
        .map((group) => ({
          category: group.category,
          tools: group.tools.filter(
            (tool) =>
              tool.title.toLowerCase().includes(q) ||
              tool.tagline.toLowerCase().includes(q),
          ),
        }))
        .filter((group) => group.tools.length > 0);

  const totalCount = groups.reduce((sum, g) => sum + g.tools.length, 0);
  const visibleCount = filteredGroups.reduce((sum, g) => sum + g.tools.length, 0);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={`Search ${totalCount} tools…`}
          className={fieldStyles}
          aria-label="Search the Lab"
        />
        <p className="font-mono text-xs text-foreground-muted">
          {visibleCount} / {totalCount} tools
        </p>
      </div>

      {filteredGroups.length === 0 ? (
        <p className="text-sm text-foreground-muted">No tools match &quot;{query}&quot;.</p>
      ) : (
        filteredGroups.map((group) => (
          <div key={group.category}>
            <h2 className="font-mono text-xs uppercase tracking-widest text-accent">
              {group.category}
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.tools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function ToolCard({ tool }: { tool: LabTool }) {
  return (
    <Link
      href={tool.href}
      className={cardStyles("flex flex-col gap-3 transition-colors hover:border-accent")}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-foreground">{tool.title}</p>
        {tool.kind === "flagship" ? <Badge className="border-accent/40 text-accent">Flagship</Badge> : null}
      </div>
      <p className="text-xs text-foreground-muted">{tool.tagline}</p>
    </Link>
  );
}
