"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logoIcon from "../../../public/tacitus-dave-logo-icon.png";

const SIZE = 40;
const STROKE = 2.5;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
// "Already at top" tolerance — a few px of residual scroll shouldn't count.
const TOP_THRESHOLD = 24;

/**
 * The logo doubles as the page-scroll indicator: a ring around its border
 * fills as you scroll down the whole page, and is a complete circle by the
 * time you hit the bottom. One tap target, context-dependent behavior —
 * tap while scrolled down and it smooth-scrolls to the top of the current
 * page (draining the ring as a side effect of the same scroll-linked
 * update); tap again once you're already at the top and it navigates home
 * instead. No separate click zones — a thin ring-only hit target doesn't
 * work well as a tap target, especially on touch.
 */
export function LogoScrollRing() {
  const router = useRouter();
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

  function handleClick() {
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    if (scrollTop > TOP_THRESHOLD) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push("/");
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Scroll to top, or go home"
      className="relative flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center"
    >
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="pointer-events-none absolute inset-0 -rotate-90"
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
          style={{ transition: "stroke-dashoffset 0.05s linear" }}
        />
      </svg>
      <span className="relative z-10 flex h-7 w-7 items-center justify-center">
        <Image src={logoIcon} alt="" priority width={22} height={22} className="rounded-md" />
      </span>
    </button>
  );
}
