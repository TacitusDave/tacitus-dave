"use client";

import { useEffect, useRef } from "react";
import { Terminal } from "@/components/terminal/terminal";
import { HERO_SETTLE_FRACTION } from "@/lib/hero-timing";

type ToolKind = "terminal" | "security" | "architecture" | "browser" | "flow";

interface ToolSpec {
  kind: ToolKind;
  title: string;
}

// HERO_SETTLE_FRACTION lives in @/lib/hero-timing (a plain module, not
// "use client") so page.tsx — a Server Component — can import it too; see
// that file for why it can't just be exported from here directly. It's the
// slice of the hero's scroll range spent letting the stack grow AND rise
// into its full "docked" position — dead center in the viewport, exactly
// where the headline was — while the headline fades out (page.tsx uses
// this same constant so its fade finishes exactly as the stack finishes
// settling) and the background art drifts. Cards don't move at all yet.
// Only once that settle phase is behind us does further scrolling start
// driving the card cycle, over the rest of the range up to
// HERO_CYCLE_END_FRACTION. Splitting these into distinct phases (rather
// than all three fighting over the same scroll budget) is what makes each
// one read clearly instead of blurring together.
// The cycle finishes (and Flow Builder freezes at front) a bit before the
// hero's sticky pin actually releases — a deliberate held beat on the last
// tool rather than an instant handoff straight into the next section.
const HERO_CYCLE_END_FRACTION = 0.92;
// Viewport offset the sticky hero viewport starts at (header's top-24 /
// main's pt-24, both 6rem) — needed to compute the sticky viewport's own
// vertical center in viewport coordinates.
const STICKY_TOP_OFFSET_PX = 96;

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
  // The vertical distance (viewport px) between the stack's natural,
  // untransformed position and dead-center in the sticky hero viewport —
  // measured from the DOM rather than guessed, since it depends on the
  // headline's actual rendered height (which varies by breakpoint and text
  // wrap). Settling drives translateY from 0 up to this value.
  const neededTranslateYRef = useRef(0);
  // Below lg the card is already full-bleed against the hero's own padding
  // — growing it by the same amount used on desktop would push it past the
  // viewport edge. Same threshold as the responsive classes removed below.
  const scaleMaxRef = useRef(1.06);

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
    // the CSS-driven elements (headline fade) are showing.
    const progressRoot = outer.closest<HTMLElement>("[data-scroll-progress-root]");
    if (!progressRoot) return;

    // offsetTop/offsetHeight reflect the CSS layout box and are unaffected
    // by `transform` (transforms are paint-time only), so this is safe to
    // call even after a translateY/scale has already been applied — no
    // need to clear and restore the transform first. offsetTop is relative
    // to outer's offsetParent (the flex column div, itself `relative`),
    // whose own top edge already coincides with the sticky viewport's top —
    // so the target is just half the sticky viewport's height, NOT that
    // plus STICKY_TOP_OFFSET_PX again (that offset is already "baked in" to
    // this coordinate frame, not something to add on top of it).
    function measure() {
      if (!outer) return;
      const stickyViewportHeight = window.innerHeight - STICKY_TOP_OFFSET_PX;
      const targetCenterY = stickyViewportHeight / 2;
      const naturalCenterY = outer.offsetTop + outer.offsetHeight / 2;
      neededTranslateYRef.current = targetCenterY - naturalCenterY;
      scaleMaxRef.current = window.innerWidth >= 1024 ? 1.28 : 1.06;
    }

    let frame = 0;

    function update() {
      if (!outer || !progressRoot) return;
      const rect = progressRoot.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = Math.max(1, rect.height - vh);
      const traveled = Math.min(Math.max(-rect.top, 0), total);
      const progress = traveled / total;
      const N = TOOLS.length;

      // Settle phase: grow from 0.94 to the responsive max scale AND rise
      // from its natural (post-headline) position up to dead-center, in
      // lockstep, finishing exactly as the headline finishes fading (see
      // page.tsx, which uses this same HERO_SETTLE_FRACTION).
      const settleT = Math.min(1, progress / HERO_SETTLE_FRACTION);
      const scale = 0.94 + settleT * (scaleMaxRef.current - 0.94);
      const outerTranslateY = settleT * neededTranslateYRef.current;
      outer.style.transform = `translate(0, ${outerTranslateY}px) scale(${scale})`;

      // Cycle phase: sweeps 0 -> N-1 (not N) — ends ON the last tool and
      // stays there once cycleProgress hits 1, rather than looping back to
      // Terminal. Finishes at HERO_CYCLE_END_FRACTION, short of the hero's
      // full scroll range, so the last tool holds for a beat before the
      // sticky pin releases into the next section — not an instant handoff.
      const cycleProgress = Math.max(
        0,
        Math.min(1, (progress - HERO_SETTLE_FRACTION) / (HERO_CYCLE_END_FRACTION - HERO_SETTLE_FRACTION)),
      );
      const frontPosition = cycleProgress * (N - 1);

      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        // No wraparound needed now that the cycle doesn't loop — a plain
        // distance means a card that's already had its turn just keeps
        // receding (never creeps back into view), and a card whose turn
        // hasn't come yet approaches smoothly, continuous through arrival
        // exactly like before (this is still just a continuous function of
        // frontPosition, so there's no pop — only the wraparound-specific
        // "closeness" trick is gone, because there's no wrap left to fix).
        const distance = Math.abs(frontPosition - index);
        // A brief hold at true front — without this, "depth 0" is a single
        // instant and no tool ever reads as fully sharp, only ever mid-fade.
        const DWELL = 0.12;
        const depth = Math.min(Math.max(0, distance - DWELL), 1.8);

        const cardScale = 1 - depth * 0.12;
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

        card.style.transform = `translate(${translateX}px, ${translateY}px) rotate(${rotate}deg) scale(${cardScale})`;
        card.style.opacity = String(opacity);
        card.style.zIndex = String(Math.round(100 - depth * 10));
      });

      frame = 0;
    }

    function onScroll() {
      if (frame) return;
      frame = requestAnimationFrame(update);
    }

    function onResize() {
      measure();
      onScroll();
    }

    measure();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div
      ref={outerRef}
      // mt-6 is just the initial (unscrolled) spacing below the headline —
      // it doesn't fight the settle-phase translateY at all, since that's
      // measured via offsetTop, which already reflects this margin. Below
      // lg the card is already full-bleed against the hero's own padding
      // (w-full with no side room to spare) — growing it by the same
      // amount used on desktop would push it past the viewport edge, which
      // is why scaleMaxRef caps lower there (see measure()). Heights are
      // deliberately modest (it grows into its docked size via scale
      // during the settle phase, see update() above) — combined with the
      // headline block above, this needs to comfortably fit inside the
      // sticky viewport on an ordinary laptop screen (~700-800px tall)
      // without flexbox silently compressing either one; shrink-0 makes
      // that an explicit, testable constraint instead of a silent squish.
      className="relative mx-auto mt-4 h-44 w-full max-w-xl shrink-0 sm:h-52 sm:max-w-2xl md:h-56 md:max-w-3xl"
      // Matches progress=0's computed transform so there's no flash between
      // first paint and the effect below taking over a frame later.
      style={{ transform: "scale(0.94)" }}
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
