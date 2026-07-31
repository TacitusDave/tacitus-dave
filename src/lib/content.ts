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

/** Placeholder project data — replace with real case studies. */
export const projects = [
  {
    slug: "placeholder-project-one",
    title: "Project One",
    summary:
      "A short, concrete description of the system: what it does, the scale it runs at, and the core engineering problem it solves.",
    details:
      "Replace this with the real architecture story: the constraint that shaped the design, the tradeoff that was made, and what it would look like done differently today.",
    stack: ["TypeScript", "Next.js", "PostgreSQL"],
  },
  {
    slug: "placeholder-project-two",
    title: "Project Two",
    summary:
      "A short, concrete description of the system: what it does, the scale it runs at, and the core engineering problem it solves.",
    details:
      "Replace this with the real architecture story: the constraint that shaped the design, the tradeoff that was made, and what it would look like done differently today.",
    stack: ["Go", "Kubernetes", "AWS"],
  },
  {
    slug: "placeholder-project-three",
    title: "Project Three",
    summary:
      "A short, concrete description of the system: what it does, the scale it runs at, and the core engineering problem it solves.",
    details:
      "Replace this with the real architecture story: the constraint that shaped the design, the tradeoff that was made, and what it would look like done differently today.",
    stack: ["Python", "Terraform", "GCP"],
  },
] as const;
