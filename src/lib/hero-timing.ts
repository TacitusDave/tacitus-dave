// Shared scroll-progress timing for the homepage hero, split into its own
// plain (non "use client") module so page.tsx (a Server Component) can
// import it directly. Exporting it from tool-stack.tsx instead silently
// resolved to `undefined` there — Next.js's Server/Client Component
// boundary only reliably passes the component itself across a "use client"
// module's boundary, not arbitrary named const exports alongside it.

// The first slice of the hero's scroll range is spent letting the stack
// grow AND rise into its full "docked" position — dead center in the
// viewport, exactly where the headline was — while the headline fades out.
// Cards don't move at all yet. Only once that settle phase is behind us
// does further scrolling start driving the card cycle.
export const HERO_SETTLE_FRACTION = 0.2;
