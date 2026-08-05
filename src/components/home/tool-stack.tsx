import { Terminal } from "@/components/terminal/terminal";

interface GhostCardSpec {
  slug: string;
  title: string;
  /** 1 = just behind the front card, higher = further back. */
  offset: number;
  /** Fan rotation in degrees, settles to 0 as the hero scrolls past. */
  rotate: number;
}

const GHOST_CARDS: GhostCardSpec[] = [
  { slug: "flow", title: "Flow Builder", offset: 4, rotate: -14 },
  { slug: "browser", title: "In-Site Browser", offset: 3, rotate: 11 },
  { slug: "architecture", title: "Architecture Explorer", offset: 2, rotate: -9 },
  { slug: "security", title: "SOC Dashboard", offset: 1, rotate: 7 },
];

function GhostCardContent({ slug }: { slug: string }) {
  switch (slug) {
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
    default:
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
  }
}

/**
 * The five free flagship tools as a fanned card deck — the real, live
 * Terminal up front (interactive), four lightweight decorative mockups
 * behind it standing in for the other free tools (mounting all five live —
 * Flow Builder's React Flow instance, the SOC dashboard's interval-driven
 * event feed, etc. — simultaneously in a decorative hero would be wasted
 * work for something mostly hidden behind the front card). Each card's fan
 * angle settles flat as the hero scrolls past, via the same
 * --scroll-progress custom property ScrollProgress already writes.
 */
export function ToolStack() {
  return (
    <div
      className="relative mx-auto mt-12 w-full max-w-3xl"
      style={{ transform: "scale(calc(0.82 + var(--scroll-progress, 0) * 0.4))" }}
    >
      {GHOST_CARDS.map((card) => {
        const xOffset = card.offset % 2 === 0 ? card.offset * 18 : -card.offset * 18;
        return (
          <div
            key={card.slug}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-lg border border-border bg-background-elevated text-foreground-muted shadow-xl"
            style={{
              transform: `translateY(calc(${card.offset * 22}px * (1 - var(--scroll-progress, 0)))) translateX(calc(${xOffset}px * (1 - var(--scroll-progress, 0)))) rotate(calc(${card.rotate}deg * (1 - var(--scroll-progress, 0)))) scale(${1 - card.offset * 0.03})`,
              transformOrigin: "center 15%",
              zIndex: 10 - card.offset,
              opacity: 1 - card.offset * 0.1,
            }}
          >
            <div className="flex items-center justify-between border-b border-border bg-background-elevated px-3 py-2">
              <span className="font-mono text-[10px] uppercase tracking-widest">{card.title}</span>
              <span className="flex gap-1" aria-hidden="true">
                <span className="h-1.5 w-1.5 rounded-full bg-border" />
                <span className="h-1.5 w-1.5 rounded-full bg-border" />
              </span>
            </div>
            <div className="h-44">
              <GhostCardContent slug={card.slug} />
            </div>
          </div>
        );
      })}

      <div
        className="pointer-events-none relative z-10 shadow-2xl"
        aria-hidden="true"
        // @ts-expect-error -- `inert` is a valid DOM attribute; React's types haven't caught up.
        inert=""
      >
        <Terminal />
      </div>
    </div>
  );
}
