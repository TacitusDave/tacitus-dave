"use client";

import { useEffect, useRef } from "react";
import { Terminal } from "@/components/terminal/terminal";

type ToolKind = "terminal" | "security" | "architecture" | "browser" | "flow";

interface ToolSpec {
  kind: ToolKind;
  title: string;
}

// The first slice of the hero's scroll range is spent letting the stack
// grow into its full "docked" size (see page.tsx's scale clamp, which uses
// this same constant) while the headline fades and the background art
// drifts — cards don't move at all yet. Only once that settle phase is
// behind us does further scrolling start driving the card cycle, over the
// remaining (1 - HERO_SETTLE_FRACTION) of the range. Splitting these into
// two distinct phases (rather than both spanning 0-1 at once) is the fix
// for the cycle feeling like it was fighting the entrance for the same
// scroll budget.
const HERO_SETTLE_FRACTION = 0.2;

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

// Real content pulled from each tool's actual data (src/lib/security-sim.ts,
// src/lib/architecture.ts) rather than invented labels — these are meant to
// read as recognizable snapshots of the real tool, not generic diagrams.
const SOC_EVENTS = [
  { technique: "T1595 · Active Scanning", message: "Port scan detected from 203.0.113.44", severity: "Medium", color: "#b8760a" },
  { technique: "T1190 · Exploit Public-Facing App", message: "Exploit attempt blocked at the edge", severity: "High", color: "#c53434" },
  { technique: "T1583 · Acquire Infrastructure", message: "Newly registered domain matched threat feed", severity: "Low", color: "#1a8a5f" },
] as const;

const ARCHITECTURE_NODES = [
  { label: "Client", x: 30, y: 26 },
  { label: "Edge / CDN", x: 100, y: 12 },
  { label: "API Gateway", x: 170, y: 26 },
] as const;

function MockContent({ kind }: { kind: ToolKind }) {
  switch (kind) {
    case "security":
      return (
        <div className="flex h-full flex-col gap-2 p-3">
          <div className="flex items-center justify-between px-1 font-mono text-[9px] uppercase tracking-widest text-foreground-muted">
            <span>MITRE ATT&amp;CK Feed</span>
            <span className="text-accent">3 events</span>
          </div>
          {SOC_EVENTS.map((event) => (
            <div key={event.technique} className="flex flex-col gap-0.5 rounded-md border border-border bg-background/60 px-2.5 py-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate font-mono text-[9px] text-foreground-muted">{event.technique}</span>
                <span
                  className="shrink-0 rounded-full px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-wide text-white"
                  style={{ backgroundColor: event.color }}
                >
                  {event.severity}
                </span>
              </div>
              <p className="truncate text-[10px] text-foreground">{event.message}</p>
            </div>
          ))}
        </div>
      );
    case "architecture":
      return (
        <div className="flex h-full flex-col justify-center p-4">
          <svg viewBox="0 0 200 100" className="h-full w-full" aria-hidden="true">
            <line x1="42" y1="26" x2="88" y2="16" stroke="currentColor" strokeOpacity="0.35" />
            <line x1="112" y1="16" x2="158" y2="26" stroke="currentColor" strokeOpacity="0.35" />
            {ARCHITECTURE_NODES.map((node) => (
              <g key={node.label}>
                <rect
                  x={node.x - 24}
                  y={node.y - 10}
                  width="48"
                  height="20"
                  rx="5"
                  fill="var(--background-elevated)"
                  stroke="currentColor"
                  strokeOpacity="0.5"
                />
                <text
                  x={node.x}
                  y={node.y + 3}
                  textAnchor="middle"
                  fontSize="7"
                  fontFamily="var(--font-geist-mono)"
                  fill="currentColor"
                  fillOpacity="0.85"
                >
                  {node.label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      );
    case "browser":
      return (
        <div className="flex h-full flex-col gap-2.5 p-3">
          <div className="flex items-center gap-1.5 rounded-md border border-border bg-background/60 px-2 py-1.5">
            <span className="flex gap-1" aria-hidden="true">
              <span className="h-1.5 w-1.5 rounded-full bg-border" />
              <span className="h-1.5 w-1.5 rounded-full bg-border" />
            </span>
            <span className="truncate font-mono text-[9px] text-foreground-muted">
              duckduckgo.com/?q=cidr+calculator
            </span>
          </div>
          <div className="flex flex-1 flex-col gap-1.5 rounded-md border border-border bg-background/40 p-2.5">
            <div className="h-2 w-2/3 rounded-full bg-border" />
            <div className="h-1.5 w-full rounded-full bg-border/70" />
            <div className="h-1.5 w-5/6 rounded-full bg-border/70" />
            <div className="h-1.5 w-4/6 rounded-full bg-border/70" />
          </div>
        </div>
      );
    case "flow":
      return (
        <div className="flex h-full flex-col p-3">
          <div className="mb-2 flex gap-1.5 rounded-md border border-border bg-background/60 px-2 py-1.5" aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="h-3 w-3 rounded-sm border border-border" />
            ))}
          </div>
          <svg viewBox="0 0 200 90" className="h-full w-full flex-1" aria-hidden="true">
            <rect x="16" y="14" width="44" height="22" rx="4" fill="none" stroke="currentColor" strokeOpacity="0.45" />
            <text x="38" y="28" textAnchor="middle" fontSize="7" fontFamily="var(--font-geist-mono)" fill="currentColor" fillOpacity="0.85">Start</text>
            <rect x="140" y="14" width="44" height="22" rx="4" fill="none" stroke="currentColor" strokeOpacity="0.45" />
            <text x="162" y="28" textAnchor="middle" fontSize="7" fontFamily="var(--font-geist-mono)" fill="currentColor" fillOpacity="0.85">Deploy</text>
            <rect x="78" y="54" width="44" height="22" rx="4" fill="none" stroke="currentColor" strokeOpacity="0.45" />
            <text x="100" y="68" textAnchor="middle" fontSize="7" fontFamily="var(--font-geist-mono)" fill="currentColor" fillOpacity="0.85">Review</text>
            <line x1="60" y1="26" x2="140" y2="26" stroke="currentColor" strokeOpacity="0.3" />
            <line x1="45" y1="36" x2="90" y2="54" stroke="currentColor" strokeOpacity="0.3" />
            <line x1="155" y1="36" x2="115" y2="54" stroke="currentColor" strokeOpacity="0.3" />
          </svg>
        </div>
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
      const N = TOOLS.length;
      // Nothing shuffles during the settle phase — frontPosition sits at 0
      // (Terminal, fully front) until the stack has finished growing into
      // place, then sweeps 0 -> N (not N-1) over the rest of the scroll: a
      // full shuffle of the deck, ending back on Terminal exactly when the
      // hero scroll finishes, not stopping on the last tool.
      const cycleProgress = Math.max(0, Math.min(1, (progress - HERO_SETTLE_FRACTION) / (1 - HERO_SETTLE_FRACTION)));
      const frontPosition = cycleProgress * N;

      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        // One direction only, via modulo — this is the actual fix for the
        // earlier bug where cards exited left OR right depending on
        // whether they were "past" or "future": a real deck shuffle always
        // moves the top card the same way. relative=0 is front; it rises
        // toward N as the card recedes, wrapping back to 0 exactly when the
        // deck has come full circle.
        const relative = ((frontPosition - index) % N + N) % N;
        // relative alone is discontinuous at each card's arrival: right up
        // until frontPosition reaches its index, relative sits near N (deep,
        // capped, invisible), then snaps to ~0 the instant its turn starts —
        // a hard pop-in rather than a rise. closeness is the distance to
        // front measured the SHORT way around (whichever is nearer, past or
        // future turn), which is continuous through that wrap — so the
        // incoming card now visibly rises out of the same down-left "stack"
        // spot the outgoing card just receded into, instead of appearing
        // out of nowhere.
        const closeness = Math.min(relative, N - relative);
        // A brief hold at true front — without this, "depth 0" is a single
        // instant and no tool ever reads as fully sharp, only ever mid-fade.
        const DWELL = 0.12;
        const eased = Math.max(0, closeness - DWELL);
        const depth = Math.min(eased, 1.8);

        const scale = 1 - depth * 0.12;
        // Steep exponential falloff — by the time a card has dropped away
        // it needs to already read as gone, not still hanging around
        // half-visible while the next one arrives underneath it.
        const opacity = Math.max(Math.exp(-depth * 3.4), 0.04);
        // A pronounced downward slide is the actual "drops into the garage"
        // motion — this is doing most of the work now; the earlier version
        // barely moved vertically and read as a soft recede instead.
        const translateY = depth * 92;
        const translateX = -depth * 42;
        const rotate = -depth * 6;

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
      // Below lg, the card is already full-bleed against the hero's own
      // padding (w-full with no side room to spare) — scaling it up by the
      // same 1.28x used on desktop pushes it past the viewport edge and
      // clips card headers mid-letter. --stack-scale-max keeps the grow
      // effect present everywhere but caps it at a value that's provably
      // safe against that padding down to very narrow phones; lg+ has
      // genuine slack (the card's own max-w-3xl cap leaves margin against
      // the viewport) so it gets the fuller effect.
      className="relative mx-auto mt-10 h-72 w-full max-w-xl [--stack-scale-max:1.06] sm:h-80 sm:max-w-2xl md:h-96 md:max-w-3xl lg:[--stack-scale-max:1.28]"
      // Pure CSS (no JS needed here, unlike the per-card math above) — grows
      // from 0.94 to --stack-scale-max over just the settle fraction of the
      // scroll, via clamp(), then holds flat for the rest of the cycle
      // phase instead of continuing to grow through it. The growth rate is
      // derived from --stack-scale-max rather than hardcoded, so the
      // responsive cap above still finishes growing at the same settle
      // point regardless of which tier's max it's clamped to.
      style={{
        transform: `scale(clamp(0.94, calc(0.94 + var(--scroll-progress, 0) * (var(--stack-scale-max) - 0.94) / ${HERO_SETTLE_FRACTION}), var(--stack-scale-max)))`,
      }}
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
