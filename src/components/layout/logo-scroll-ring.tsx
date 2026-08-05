"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import logoIcon from "../../../public/tacitus-dave-logo-icon.png";

const SIZE = 40;
const STROKE = 2.5;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * The logo doubles as the page-scroll indicator: a ring around its border
 * fills as you scroll down the whole page, and is a complete circle by the
 * time you hit the bottom. Clicking the ring itself (not the logo) smooth-
 * scrolls back to top, which visibly drains the ring as a side effect of
 * the same scroll-linked update — same mechanic as the old standalone
 * bottom-right button, just relocated.
 *
 * The ring and the logo link are genuinely two separate click targets
 * sharing the same visual spot: the ring's progress circle has
 * `pointer-events: stroke` so only clicking exactly on the drawn arc
 * triggers scroll-to-top, while clicks on the logo itself pass through to
 * the Link underneath and navigate home as normal.
 */
export function LogoScrollRing() {
  const circleRef = useRef<SVGCircleElement>(null);

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
    <div className="relative flex h-10 w-10 shrink-0 items-center justify-center">
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="absolute inset-0 -rotate-90"
        style={{ pointerEvents: "none" }}
        aria-hidden="true"
      >
        <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none" stroke="var(--border)" strokeWidth={STROKE} />
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
          className="cursor-pointer"
          style={{ pointerEvents: "stroke", transition: "stroke-dashoffset 0.05s linear" }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          role="button"
          aria-label="Scroll to top"
        />
      </svg>
      <Link href="/" className="relative z-10 flex h-7 w-7 items-center justify-center" aria-label="Home">
        <Image src={logoIcon} alt="" priority width={22} height={22} className="rounded-md" />
      </Link>
    </div>
  );
}
