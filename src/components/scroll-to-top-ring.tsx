"use client";

import { useEffect, useRef } from "react";

const SIZE = 48;
const STROKE = 3;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * A fixed circular progress ring that fills as the page scrolls and doubles
 * as a "back to top" button — clicking it smooth-scrolls up, which visibly
 * drains the ring back to empty as a natural side effect of the same
 * scroll-linked update, no separate "retract" animation needed. Writes
 * directly to the DOM via refs inside an rAF-throttled scroll handler
 * (same pattern as ScrollProgress) rather than React state, so scrolling
 * never triggers a re-render.
 */
export function ScrollToTopRing() {
  const circleRef = useRef<SVGCircleElement>(null);
  const wrapperRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let ticking = false;

    function update() {
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop || document.body.scrollTop;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      const progress = scrollable > 0 ? Math.min(scrollTop / scrollable, 1) : 0;

      if (circleRef.current) {
        circleRef.current.style.strokeDashoffset = String(CIRCUMFERENCE * (1 - progress));
      }
      if (wrapperRef.current) {
        const shouldShow = scrollTop > 400;
        wrapperRef.current.style.opacity = shouldShow ? "1" : "0";
        wrapperRef.current.style.pointerEvents = shouldShow ? "auto" : "none";
      }
      ticking = false;
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <button
      ref={wrapperRef}
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      className="fixed bottom-6 right-4 z-40 opacity-0 shadow-lg transition-opacity duration-300 sm:right-6"
      style={{ pointerEvents: "none" }}
    >
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="-rotate-90 rounded-full bg-background-elevated/90 backdrop-blur-sm">
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="var(--border)"
          strokeWidth={STROKE}
        />
        <circle
          ref={circleRef}
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE}
          style={{ transition: "stroke-dashoffset 0.05s linear" }}
        />
      </svg>
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center font-mono text-sm text-foreground">
        ↑
      </span>
    </button>
  );
}
