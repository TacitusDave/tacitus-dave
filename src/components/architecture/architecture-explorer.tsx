"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { cn } from "@/lib/cn";
import { archEdges, nodesByRow, type ArchNode } from "@/lib/architecture";

interface Line {
  id: string;
  from: string;
  to: string;
  dashed: boolean;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export function ArchitectureExplorer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [lines, setLines] = useState<Line[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  function registerNode(id: string, el: HTMLButtonElement | null) {
    if (el) nodeRefs.current.set(id, el);
    else nodeRefs.current.delete(id);
  }

  function measure() {
    const container = containerRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();

    const nextLines: Line[] = [];
    for (const edge of archEdges) {
      const fromEl = nodeRefs.current.get(edge.from);
      const toEl = nodeRefs.current.get(edge.to);
      if (!fromEl || !toEl) continue;
      const fromRect = fromEl.getBoundingClientRect();
      const toRect = toEl.getBoundingClientRect();
      nextLines.push({
        id: `${edge.from}-${edge.to}`,
        from: edge.from,
        to: edge.to,
        dashed: edge.style === "dashed",
        x1: fromRect.left + fromRect.width / 2 - containerRect.left,
        y1: fromRect.bottom - containerRect.top,
        x2: toRect.left + toRect.width / 2 - containerRect.left,
        y2: toRect.top - containerRect.top,
      });
    }
    setLines(nextLines);
  }

  useLayoutEffect(() => {
    measure();

    // Mobile browsers reflow after initial paint more than desktop does —
    // the address bar collapsing/expanding, web fonts settling, or the
    // visual viewport resizing all shift node positions after this effect
    // has already run once. Re-measure a beat later to catch that, plus on
    // any subsequent resize.
    const settleTimer = window.setTimeout(measure, 300);

    const hasResizeObserver = typeof ResizeObserver !== "undefined";
    const observer = hasResizeObserver ? new ResizeObserver(() => measure()) : null;
    if (observer && containerRef.current) observer.observe(containerRef.current);

    window.addEventListener("resize", measure);
    window.visualViewport?.addEventListener("resize", measure);

    return () => {
      window.clearTimeout(settleTimer);
      observer?.disconnect();
      window.removeEventListener("resize", measure);
      window.visualViewport?.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <div className="rounded-md border border-border bg-background-elevated/40 p-6 sm:p-10">
      <div ref={containerRef} className="relative flex flex-col items-center gap-10">
        <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
          {lines.map((line) => {
            const highlighted = activeId === line.from || activeId === line.to;
            return (
              <line
                key={line.id}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                strokeWidth={highlighted ? 2 : 1}
                strokeDasharray={line.dashed ? "4 4" : undefined}
                style={{
                  stroke: highlighted ? "var(--accent)" : "var(--border)",
                  transition: "stroke 150ms ease, stroke-width 150ms ease",
                }}
              />
            );
          })}
        </svg>

        {nodesByRow().map((row, rowIndex) => (
          <div key={rowIndex} className="relative z-10 flex flex-wrap justify-center gap-4">
            {row.map((node) => (
              <ArchNodeButton
                key={node.id}
                node={node}
                registerNode={registerNode}
                onActivate={() => setActiveId(node.id)}
                onDeactivate={() => setActiveId(null)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function ArchNodeButton({
  node,
  registerNode,
  onActivate,
  onDeactivate,
}: {
  node: ArchNode;
  registerNode: (id: string, el: HTMLButtonElement | null) => void;
  onActivate: () => void;
  onDeactivate: () => void;
}) {
  return (
    <Dialog
      title={node.label}
      description={node.tagline}
      trigger={(open) => (
        <button
          ref={(el) => registerNode(node.id, el)}
          type="button"
          onClick={open}
          onMouseEnter={onActivate}
          onMouseLeave={onDeactivate}
          onFocus={onActivate}
          onBlur={onDeactivate}
          className={cn(
            "flex w-44 flex-col items-center gap-1 rounded-md border border-border bg-background px-4 py-3 text-center outline-none transition-colors duration-200 hover:border-accent focus-visible:border-accent",
            node.id === "observability" && "border-dashed",
          )}
        >
          <span className="text-sm font-medium text-foreground">{node.label}</span>
          <span className="text-xs text-foreground-muted">{node.tagline}</span>
        </button>
      )}
    >
      <div className="flex flex-col gap-3">
        <p className="font-mono text-xs uppercase tracking-widest text-accent">
          {node.decisionTitle}
        </p>
        <p className="text-sm text-foreground-muted">{node.decisionBody}</p>
      </div>
    </Dialog>
  );
}
