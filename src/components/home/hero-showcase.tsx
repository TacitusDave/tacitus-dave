"use client";

import { useEffect, useRef, useState } from "react";
import { Terminal } from "@/components/terminal/terminal";
import { HERO_SETTLE_FRACTION, HERO_SHOWCASE_END_FRACTION } from "@/lib/hero-timing";

// Drop the real demo video at public/hero-demo.mp4 to activate scroll
// scrubbing — until then (or if it 404s) this falls back to the live
// Terminal, so the hero never ships an empty or broken-looking box.
const VIDEO_SRC = "/hero-demo.mp4";

// Viewport offset the sticky hero viewport starts at (header's top-24 /
// main's pt-24, both 6rem) — needed to compute the sticky viewport's own
// vertical center in viewport coordinates.
const STICKY_TOP_OFFSET_PX = 96;

/**
 * The hero's centerpiece: grows and rises into place (dead center, where
 * the headline was) during the settle phase, exactly like the previous
 * card-stack did — then, instead of cycling through cards, the rest of the
 * scroll scrubs through a single video's timeline, frame-synced to scroll
 * position (currentTime = scroll progress * duration). No loop — it plays
 * through once and holds on the last frame, matching how the rest of the
 * hero scroll behaves (settle, then one pass through, then hold).
 *
 * Falls back to the real Terminal (no scrubbing, just sits there once
 * settled) if no video is present yet, so the page is never left with a
 * broken or empty showcase while waiting on the asset.
 */
export function HeroShowcase() {
  const outerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoAvailable, setVideoAvailable] = useState(true);
  const neededTranslateYRef = useRef(0);
  const scaleMaxRef = useRef(1.06);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // A failed video load (e.g. hero-demo.mp4 not present yet) can set
    // video.error and fire the native 'error' event before React finishes
    // attaching its onError prop — media error events don't bubble, so
    // React's usual delegated listener can miss one that fires this early.
    // Checking video.error synchronously here catches an already-failed
    // load; the direct addEventListener catches one that fails slightly
    // later (e.g. a slow 404 response).
    if (video.error) {
      setVideoAvailable(false);
      return;
    }
    function handleError() {
      setVideoAvailable(false);
    }
    video.addEventListener("error", handleError);
    return () => video.removeEventListener("error", handleError);
  }, []);

  useEffect(() => {
    const outer = outerRef.current;
    if (!outer) return;

    // Computed directly from the ScrollProgress ancestor's own rect, not by
    // reading the --scroll-progress custom property it writes — avoids a
    // race between this component's rAF-throttled listener and
    // ScrollProgress's own (see tool-stack.tsx's original version of this
    // same comment, in git history, for the full story on why).
    const progressRoot = outer.closest<HTMLElement>("[data-scroll-progress-root]");
    if (!progressRoot) return;

    // offsetTop/offsetHeight reflect the CSS layout box and are unaffected
    // by `transform`, so this is safe even after a translateY/scale has
    // already been applied. Assumes the sticky hero is pinned (top: 6rem)
    // at measurement time — true both at initial mount (a fresh page load
    // starts at scrollY 0, right where the sticky threshold already sits)
    // and on resize.
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

      const settleT = Math.min(1, progress / HERO_SETTLE_FRACTION);
      const scale = 0.94 + settleT * (scaleMaxRef.current - 0.94);
      const translateY = settleT * neededTranslateYRef.current;
      outer.style.transform = `translate(0, ${translateY}px) scale(${scale})`;

      const video = videoRef.current;
      if (video && video.readyState >= 1 && video.duration) {
        const showcaseProgress = Math.max(
          0,
          Math.min(1, (progress - HERO_SETTLE_FRACTION) / (HERO_SHOWCASE_END_FRACTION - HERO_SETTLE_FRACTION)),
        );
        video.currentTime = showcaseProgress * video.duration;
      }

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
      className="relative mx-auto mt-4 h-44 w-full max-w-xl shrink-0 overflow-hidden rounded-lg border border-border bg-background-elevated shadow-2xl sm:h-52 sm:max-w-2xl md:h-56 md:max-w-3xl"
      // Matches progress=0's computed transform so there's no flash between
      // first paint and the effect above taking over a frame later.
      style={{ transform: "scale(0.94)" }}
    >
      {videoAvailable ? (
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="h-full">
          <Terminal />
        </div>
      )}
    </div>
  );
}
