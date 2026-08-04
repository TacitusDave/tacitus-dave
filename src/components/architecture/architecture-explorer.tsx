"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { cn } from "@/lib/cn";
import { archEdges, nodesByRow, scaleLevels, type ArchNode, type ScaleLevel } from "@/lib/architecture";

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
  const [scale, setScale] = useState<ScaleLevel>("baseline");

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
      <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
        {scaleLevels.map(({ level, label }) => (
          <button
            key={level}
            type="button"
            onClick={() => setScale(level)}
            className={cn(
              "rounded-full border px-3 py-1.5 font-mono text-xs uppercase tracking-widest transition-colors",
              scale === level
                ? "border-accent text-accent"
                : "border-border text-foreground-muted hover:border-accent hover:text-accent",
            )}
          >
            {label}
          </button>
        ))}
      </div>
      {scale !== "baseline" ? (
        <p className="mb-6 text-center text-sm text-foreground-muted">
          Nodes marked <span className="text-accent">●</span> need something to change at this
          scale — click one to see what and why.
        </p>
      ) : null}

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
                scale={scale}
                registerNode={registerNode}
                onActivate={() => setActiveId(node.id)}
                onDeactivate={() => setActiveId(null)}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="mt-10 flex justify-center border-t border-border pt-6">
        <Link
          href="/flow"
          className="font-mono text-xs uppercase tracking-widest text-foreground-muted transition-colors hover:text-accent"
        >
          Want to sketch your own system? Try the Flow Builder →
        </Link>
      </div>
    </div>
  );
}

function ArchNodeButton({
  node,
  scale,
  registerNode,
  onActivate,
  onDeactivate,
}: {
  node: ArchNode;
  scale: ScaleLevel;
  registerNode: (id: string, el: HTMLButtonElement | null) => void;
  onActivate: () => void;
  onDeactivate: () => void;
}) {
  const scaleNote = scale === "baseline" ? null : node.scaleNotes?.[scale];

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
            "relative flex w-44 flex-col items-center gap-1 rounded-md border border-border bg-background px-4 py-3 text-center outline-none transition-colors duration-200 hover:border-accent focus-visible:border-accent",
            node.id === "observability" && "border-dashed",
          )}
        >
          {scaleNote ? (
            <span
              aria-hidden="true"
              className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-accent"
            />
          ) : null}
          <span className="text-sm font-medium text-foreground">{node.label}</span>
          <span className="text-xs text-foreground-muted">{node.tagline}</span>
        </button>
      )}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3">
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            {node.decisionTitle}
          </p>
          <p className="text-sm text-foreground-muted">{node.decisionBody}</p>
        </div>
        {scaleNote ? (
          <div className="flex flex-col gap-2 border-t border-border pt-4">
            <p className="font-mono text-xs uppercase tracking-widest text-accent">
              At {scaleLevels.find((s) => s.level === scale)?.label}
            </p>
            <p className="text-sm text-foreground-muted">{scaleNote}</p>
          </div>
        ) : null}
      </div>
    </Dialog>
  );
}
