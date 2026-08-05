"use client";

import { useEffect, useRef } from "react";
import { Terminal } from "@/components/terminal/terminal";

type ToolKind = "terminal" | "security" | "architecture" | "browser" | "flow";

interface ToolSpec {
  kind: ToolKind;
  title: string;
}

// Cycle order — this is also the order each tool takes its turn at front as
// the hero scrolls: Terminal starts front and recedes first, Flow Builder
// is last to arrive.
const TOOLS: ToolSpec[] = [
  { kind: "terminal", title: "Terminal" },
  { kind: "security", title: "SOC Dashboard" },
  { kind: "architecture", title: "Architecture Explorer" },
  { kind: "browser", title: "In-Site Browser" },
  { kind: "flow", title: "Flow Builder" },
];

function MockContent({ kind }: { kind: ToolKind }) {
  switch (kind) {
    case "security":
      return (
        <div className="flex h-full flex-col justify-center gap-3 p-5">
          {(["#c53434", "#b8760a", "#1a8a5f"] as const).map((color, i) => (
            <div key={color} className="flex items-center gap-2">
              <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: color }} />
              <span className="h-1.5 flex-1 rounded-full bg-border" style={{ maxWidth: `${70 - i * 15}%` }} />
            </div>
          ))}
        </div>
      );
    case "architecture":
      return (
        <svg viewBox="0 0 200 100" className="h-full w-full p-5" aria-hidden="true">
          <circle cx="40" cy="30" r="10" fill="none" stroke="currentColor" strokeOpacity="0.4" />
          <circle cx="160" cy="30" r="10" fill="none" stroke="currentColor" strokeOpacity="0.4" />
          <circle cx="100" cy="75" r="10" fill="none" stroke="currentColor" strokeOpacity="0.4" />
          <line x1="48" y1="34" x2="92" y2="70" stroke="currentColor" strokeOpacity="0.3" />
          <line x1="152" y1="34" x2="108" y2="70" stroke="currentColor" strokeOpacity="0.3" />
          <line x1="50" y1="30" x2="150" y2="30" stroke="currentColor" strokeOpacity="0.3" />
        </svg>
      );
    case "browser":
      return (
        <div className="flex h-full flex-col justify-center gap-3 p-5">
          <div className="h-5 rounded-full border border-border bg-background px-3 font-mono text-[10px] leading-5 text-foreground-muted">
            search…
          </div>
          <div className="h-1.5 w-3/4 rounded-full bg-border" />
          <div className="h-1.5 w-1/2 rounded-full bg-border" />
        </div>
      );
    case "flow":
      return (
        <svg viewBox="0 0 200 100" className="h-full w-full p-5" aria-hidden="true">
          <rect x="20" y="20" width="40" height="24" rx="4" fill="none" stroke="currentColor" strokeOpacity="0.4" />
          <rect x="140" y="20" width="40" height="24" rx="4" fill="none" stroke="currentColor" strokeOpacity="0.4" />
          <rect x="80" y="60" width="40" height="24" rx="4" fill="none" stroke="currentColor" strokeOpacity="0.4" />
          <line x1="60" y1="32" x2="140" y2="32" stroke="currentColor" strokeOpacity="0.3" />
          <line x1="40" y1="44" x2="90" y2="60" stroke="currentColor" strokeOpacity="0.3" />
          <line x1="160" y1="44" x2="110" y2="60" stroke="currentColor" strokeOpacity="0.3" />
        </svg>
      );
    default:
      return null;
  }
}

/**
 * The five free flagship tools as a scroll-driven cycling stack: as the
 * hero scrolls, each tool takes a turn at front (full size, centered) while
 * the others recede behind it — Terminal starts front and is first to
 * recede, each next tool arrives from the back in turn. Terminal renders
 * live (it's cheap — no intervals, no canvas); the other four are
 * lightweight labeled mockups rather than fully live instances, since
 * mounting Flow Builder's React Flow canvas or the SOC dashboard's
 * interval-driven event feed simultaneously in a decorative, mostly-hidden
 * stack would be wasted work.
 *
 * Position math runs in a scroll listener rather than pure CSS because it
 * needs abs()/sign()-style branching per card that isn't worth fighting
 * cross-browser CSS calc() support for — each card's transform is written
 * directly via a ref, never through React state, so scrolling never
 * triggers a re-render (same discipline as ScrollProgress/ScrollToTopRing).
 */
export function ToolStack() {
  const outerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const outer = outerRef.current;
    if (!outer) return;

    // The nearest ScrollProgress ancestor — computed from directly, not by
    // reading the --scroll-progress custom property it writes. Two
    // independent rAF-throttled scroll listeners (this one and
    // ScrollProgress's own) race on every scroll event; depending on effect
    // registration order, reading the property back can land on a stale,
    // one-frame-old value. Recomputing from the same source rect makes this
    // component self-sufficient and always exactly in sync with whatever
    // the CSS-driven elements (headline fade, outer scale) are showing.
    const progressRoot = outer.closest<HTMLElement>("[data-scroll-progress-root]");
    if (!progressRoot) return;

    let frame = 0;

    function update() {
      if (!outer || !progressRoot) return;
      const rect = progressRoot.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = Math.max(1, rect.height - vh);
      const traveled = Math.min(Math.max(-rect.top, 0), total);
      const progress = traveled / total;
      const frontPosition = progress * (TOOLS.length - 1);

      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        const relative = index - frontPosition;
        const depth = Math.min(Math.abs(relative), 3);
        const direction = relative === 0 ? 0 : relative > 0 ? 1 : -1;

        const scale = 1 - depth * 0.1;
        // Exponential, not linear — a linear falloff leaves two adjacent
        // cards similarly (~70%) opaque at the exact midpoint of a
        // transition, so their text visibly double-exposes. Exponential
        // decay keeps only the current front card clearly legible; anything
        // mid-transition reads as a fading edge, not competing text.
        const opacity = Math.max(Math.exp(-depth * 2.2), 0.06);
        const translateY = depth * 22;
        const translateX = direction * depth * 18;
        const rotate = direction * depth * 8;

        card.style.transform = `translate(${translateX}px, ${translateY}px) rotate(${rotate}deg) scale(${scale})`;
        card.style.opacity = String(opacity);
        card.style.zIndex = String(Math.round(100 - depth * 10));
      });

      frame = 0;
    }

    function onScroll() {
      if (frame) return;
      frame = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      ref={outerRef}
      className="relative mx-auto mt-10 h-72 w-full max-w-xl sm:h-80 sm:max-w-2xl md:h-96 md:max-w-3xl"
      style={{ transform: "scale(calc(0.94 + var(--scroll-progress, 0) * 0.34))" }}
    >
      {TOOLS.map((tool, index) => (
        <div
          key={tool.kind}
          ref={(el) => {
            cardRefs.current[index] = el;
          }}
          aria-hidden="true"
          // @ts-expect-error -- `inert` is a valid DOM attribute; React's types haven't caught up.
          inert=""
          className="pointer-events-none absolute inset-0 flex flex-col overflow-hidden rounded-lg border border-border bg-background-elevated text-foreground-muted shadow-2xl"
          style={{ willChange: "transform" }}
        >
          {tool.kind === "terminal" ? (
            <div className="h-full">
              <Terminal />
            </div>
          ) : (
            <>
              <div className="flex shrink-0 items-center justify-between border-b border-border bg-background-elevated px-3 py-2">
                <span className="font-mono text-[10px] uppercase tracking-widest">{tool.title}</span>
                <span className="flex gap-1" aria-hidden="true">
                  <span className="h-1.5 w-1.5 rounded-full bg-border" />
                  <span className="h-1.5 w-1.5 rounded-full bg-border" />
                </span>
              </div>
              <div className="flex-1 overflow-hidden">
                <MockContent kind={tool.kind} />
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
