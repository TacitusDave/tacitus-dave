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
    title: "Engineering Excellence",
    description:
      "High-quality software engineering built upon strong architectural foundations.",
  },
  {
    title: "Security by Design",
    description:
      "Every system is secure from the first design decision through production operations.",
  },
  {
    title: "Operational Reliability",
    description:
      "Software is only successful when it remains available, observable, maintainable, and resilient.",
  },
  {
    title: "Continuous Learning",
    description: "Technology evolves constantly. The work evolves with it.",
  },
  {
    title: "Knowledge Sharing",
    description:
      "Teaching reinforces mastery. Documentation and writing are as important as the code itself.",
  },
] as const;

export const brandTraits = [
  { trait: "Intelligent", description: "Knowledgeable without being arrogant." },
  { trait: "Calm", description: "Professional under pressure." },
  { trait: "Precise", description: "Every detail matters." },
  { trait: "Reliable", description: "Systems should be dependable." },
  { trait: "Curious", description: "Always learning." },
  { trait: "Innovative", description: "Adopts modern technologies thoughtfully." },
  { trait: "Transparent", description: "Documents decisions and shares lessons learned." },
  { trait: "Disciplined", description: "Structured engineering practices." },
  { trait: "Helpful", description: "Knowledge should be shared generously." },
  { trait: "Professional", description: "Enterprise quality in every interaction." },
] as const;

export const brandPromise = [
  "Understand complex systems.",
  "Design scalable architectures.",
  "Build production-grade software.",
  "Secure modern applications.",
  "Deploy reliable infrastructure.",
  "Monitor distributed systems.",
  "Respond to security incidents.",
  "Communicate technical decisions clearly.",
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
    slug: "placeholder-project-two",
    title: "Project Two",
    summary:
      "A short, concrete description of the system: what it does, the scale it runs at, and the core engineering problem it solves.",
    details:
      "Replace this with the real architecture story: the constraint that shaped the design, the tradeoff that was made, and what it would look like done differently today.",
    tags: ["Go", "Kubernetes", "AWS"],
  },
  {
    slug: "placeholder-project-three",
    title: "Project Three",
    summary:
      "A short, concrete description of the system: what it does, the scale it runs at, and the core engineering problem it solves.",
    details:
      "Replace this with the real architecture story: the constraint that shaped the design, the tradeoff that was made, and what it would look like done differently today.",
    tags: ["Python", "Terraform", "GCP"],
  },
];
