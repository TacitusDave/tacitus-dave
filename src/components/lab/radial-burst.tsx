import type { CSSProperties } from "react";

const LINE_COUNT = 28;

// Deterministic pseudo-variation (no client JS/hooks needed) so each spoke
// gets a slightly different length and dot size instead of a perfect,
// mechanical circle — mirrors the "hand-placed" feel of a network diagram.
function spokes() {
  return Array.from({ length: LINE_COUNT }, (_, i) => {
    const angle = (360 / LINE_COUNT) * i;
    const length = 90 + ((i * 47) % 80);
    const hasDot = i % 3 !== 0;
    const dotRadius = 2 + ((i * 13) % 4);
    return { angle, length, hasDot, dotRadius };
  });
}

export function RadialBurst({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  const center = 200;
  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      aria-hidden="true"
      style={{ animation: "radial-burst-spin 140s linear infinite", ...style }}
    >
      {spokes().map(({ angle, length, hasDot, dotRadius }, i) => {
        const rad = (angle * Math.PI) / 180;
        const x2 = center + Math.cos(rad) * length;
        const y2 = center + Math.sin(rad) * length;
        return (
          <g key={i}>
            <line
              x1={center}
              y1={center}
              x2={x2}
              y2={y2}
              stroke="currentColor"
              strokeOpacity={0.35}
              strokeWidth={1}
            />
            {hasDot ? (
              <circle cx={x2} cy={y2} r={dotRadius} fill="currentColor" fillOpacity={0.7} />
            ) : null}
          </g>
        );
      })}
      <circle cx={center} cy={center} r={4} fill="currentColor" />
    </svg>
  );
}
