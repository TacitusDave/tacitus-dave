"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger this element's entrance behind earlier ones on the same screen. */
  delayMs?: number;
  /** "fade" (default) is the standard subtle fade-up. "drop" is a more
   * deliberate settle-into-place entrance — falls from above with a slight
   * scale and rotation snap, for moments that should feel like something
   * physically arriving rather than just fading in. */
  variant?: "fade" | "drop";
}

/** Fades/slides an element into place the first time it scrolls into view. */
export function Reveal({ children, className, delayMs = 0, variant = "fade" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      const timeout = window.setTimeout(() => setVisible(true), 0);
      return () => window.clearTimeout(timeout);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            window.setTimeout(() => setVisible(true), delayMs);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [delayMs]);

  return (
    <div
      ref={ref}
      data-reveal={visible ? "visible" : undefined}
      data-reveal-variant={variant}
      className={className}
    >
      {children}
    </div>
  );
}
