"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface ScrollProgressProps {
  children: ReactNode;
  /** How much scroll distance to "spend" on the effect — taller means slower/more gradual. */
  heightVh?: number;
  className?: string;
}

/**
 * A tall wrapper with a pinned (sticky) inner viewport. As the user scrolls
 * through it, writes 0–1 progress to the `--scroll-progress` CSS custom
 * property directly on the DOM node — no React state, no re-renders, so
 * children can drive opacity/transform off it via plain CSS at 60fps.
 */
export function ScrollProgress({ children, heightVh = 250, className }: ScrollProgressProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = wrapperRef.current;
    if (!node) return;

    let frame = 0;

    function update() {
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = Math.max(1, rect.height - vh);
      const traveled = Math.min(Math.max(-rect.top, 0), total);
      node.style.setProperty("--scroll-progress", (traveled / total).toFixed(4));
    }

    function onScroll() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    }

    frame = requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={wrapperRef} style={{ height: `${heightVh}vh` }} className={className}>
      <div className="sticky top-0 h-screen overflow-hidden">{children}</div>
    </div>
  );
}
