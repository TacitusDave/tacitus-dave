import type { CSSProperties } from "react";

interface Node {
  x: number;
  y: number;
  r: number;
}

// Deterministic pseudo-scatter (same technique as RadialBurst's spokes()) —
// stable across server/client renders, no Math.random, no client JS needed.
function nodes(seed: number, count: number): Node[] {
  return Array.from({ length: count }, (_, i) => {
    const n = i + seed;
    const x = 20 + ((n * 53) % 260);
    const y = 20 + ((n * 97) % 260);
    const r = 2 + ((n * 17) % 5);
    return { x, y, r };
  });
}

// Connects each node to two others a fixed index-distance away — enough to
// read as a network graph without becoming a solid, illegible mesh.
function edges(pts: Node[]): [Node, Node][] {
  const pairs: [Node, Node][] = [];
  for (let i = 0; i < pts.length; i++) {
    for (const offset of [1, 3]) {
      const b = pts[i + offset];
      if (b) pairs.push([pts[i], b]);
    }
  }
  return pairs;
}

/**
 * A constellation-style cluster flanking the hero headline — left and right
 * instances use different seeds and drift directions so they don't read as
 * a mirrored pair, just two independent pieces of the same motif.
 */
export function HeroFlankArt({
  side,
  className,
  style,
}: {
  side: "left" | "right";
  className?: string;
  style?: CSSProperties;
}) {
  const pts = nodes(side === "left" ? 1 : 41, 11);
  const links = edges(pts);
  const animationName = side === "left" ? "hero-flank-drift-left" : "hero-flank-drift-right";

  return (
    <svg
      viewBox="0 0 300 300"
      className={className}
      aria-hidden="true"
      style={{ animation: `${animationName} 18s ease-in-out infinite`, ...style }}
    >
      {links.map(([a, b], i) => (
        <line
          key={i}
          x1={a.x}
          y1={a.y}
          x2={b.x}
          y2={b.y}
          stroke="currentColor"
          strokeOpacity={0.45}
          strokeWidth={1}
        />
      ))}
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={p.r} fill="currentColor" fillOpacity={0.8} />
      ))}
    </svg>
  );
}
