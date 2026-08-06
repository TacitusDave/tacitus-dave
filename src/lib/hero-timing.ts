// Shared scroll-progress timing for the homepage hero, split into its own
// plain (non "use client") module so page.tsx (a Server Component) can
// import it directly. Exporting it from tool-stack.tsx instead silently
// resolved to `undefined` there — Next.js's Server/Client Component
// boundary only reliably passes the component itself across a "use client"
// module's boundary, not arbitrary named const exports alongside it.

// The first slice of the hero's scroll range is spent letting the showcase
// grow AND rise into its full "docked" position — dead center in the
// viewport, exactly where the headline was — while the headline fades out.
// Nothing else moves yet. Only once that settle phase is behind us does
// further scrolling start driving the showcase itself (video scrub, etc).
export const HERO_SETTLE_FRACTION = 0.2;

// The showcase phase finishes a bit before the hero's sticky pin actually
// releases — the video reaches its last frame and holds there for a beat,
// rather than the page handing off to the next section the instant it ends.
export const HERO_SHOWCASE_END_FRACTION = 0.92;
