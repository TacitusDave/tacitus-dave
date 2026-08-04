export const focusAreas = [
  "TypeScript",
  "React",
  "Next.js",
  "Python",
  "Django",
  "PostgreSQL",
  "React Native",
  "Docker",
  "SOC Operations",
  "SIEM",
  "Threat Detection",
  "Incident Response",
] as const;

export const pillars = [
  {
    title: "Real Software, Not Mockups",
    description:
      "The terminal, the SOC dashboard, the flow canvas — every interactive piece on this site is working code you can use right now, not a screenshot of what I could build.",
  },
  {
    title: "Security-First, Not Security-Bolted-On",
    description:
      "I read real alerts on real SOC shifts. That's the same lens I bring to the first line of code, not something added after the fact.",
  },
  {
    title: "Built to Operate, Not Just Ship",
    description:
      "A demo that works once is easy. Software that stays observable, debuggable, and boring under real load is the actual job.",
  },
  {
    title: "The Reasoning Is Public",
    description:
      "The architecture walkthroughs and project write-ups on this site explain the tradeoff, not just the result — because 'it works' isn't an explanation.",
  },
  {
    title: "Always Under Construction",
    description:
      "This platform ships in the open and keeps changing. What you're looking at today is not the final version.",
  },
] as const;

export interface Project {
  slug: string;
  title: string;
  summary: string;
  details: string;
  tags: string[];
  /** Path under /public, or undefined for projects without a screenshot yet. */
  image?: string;
  /** URL of the live deployed site, if it's publicly reachable. */
  liveUrl?: string;
  /** Path to a live page on this same site, for projects that are part of this platform. */
  internalUrl?: string;
}

export const projects: Project[] = [
  {
    slug: "ndukego-investments-properties",
    title: "Ndukego Investments & Properties",
    summary:
      "A real estate and investment platform for a Nigerian property group — verified listings, consultation booking, and financing and capital services in one site.",
    details:
      "Built for Ndukego Investments & Properties Ltd: a marketplace-style homepage with location and title search, a verified-listings pipeline, a consultation booking flow, and four service lines — real estate, LPO financing, investment capital, and consultancy — backed by live stats: 50+ verified listings, over 10 years operating in Nigeria, and more than ₦500M in properties transacted.",
    tags: ["Real Estate", "Property Listings", "Booking Flow", "Investment Services"],
    image: "/project1.png",
    liveUrl: "https://ndukego-ltd.vercel.app",
  },
  {
    slug: "in-browser-terminal",
    title: "A Real Shell, Running in the Browser",
    summary:
      "Not a themed textarea — a command parser, a virtual filesystem, tab-completion, and history, built from scratch and shipped as this platform's own front door.",
    details:
      "Most portfolio 'terminals' are a fixed-width font and a typing animation. This one parses real input, walks an actual virtual filesystem (cd, ls, cat, tree all work the way you'd expect), keeps arrow-key history, and tab-completes paths and commands. It also runs a sandboxed JavaScript REPL in-browser, plus real utility commands — base64, hashing, URL encode/decode, UUID generation — that compute actual output rather than printing a canned string. The constraint that shaped it: everything had to run client-side with zero backend calls, so every command is pure, synchronous, and testable in isolation. It's the same component embedded live on the homepage and in the Lab — not a screenshot of itself.",
    tags: ["TypeScript", "Web Crypto API", "Command Parser", "Virtual Filesystem"],
    internalUrl: "/terminal",
  },
  {
    slug: "flow-builder",
    title: "A Diagram Canvas, Not Just a Flowchart Tool",
    summary:
      "A full drag-and-connect canvas with auto-layout, undo/redo, autosave, and PNG/JSON export — built on React Flow, not a wrapper around someone else's editor.",
    details:
      "Started as a flowchart tool and grew into a general design canvas: 310+ icons grouped by category, automatic graph layout via Dagre, a full undo/redo history stack, inline double-click-to-rename on every node and edge, autosave to localStorage with non-serializable state stripped before persisting, and one-click export to PNG or a re-importable JSON file. The hard part wasn't the drawing — it was making the editor feel instant: layout recalculation, history snapshots, and canvas rendering all had to stay off the main interaction thread's critical path so dragging a node never stutters, even with a large graph on screen.",
    tags: ["React Flow", "Dagre", "Undo/Redo", "Client-Side Export"],
    internalUrl: "/flow",
  },
];
