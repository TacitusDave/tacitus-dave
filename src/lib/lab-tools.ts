export type LabCategory =
  | "Security"
  | "Systems & Networking"
  | "Developer Utilities"
  | "Search & Browsing";

export interface LabTool {
  slug: string;
  href: string;
  title: string;
  tagline: string;
  category: LabCategory;
  kind: "flagship" | "utility";
}

export const labTools: LabTool[] = [
  {
    slug: "terminal",
    href: "/terminal",
    title: "Terminal",
    tagline: "A real shell in your browser — parser, virtual filesystem, tab-completion.",
    category: "Developer Utilities",
    kind: "flagship",
  },
  {
    slug: "security",
    href: "/security",
    title: "SOC Dashboard",
    tagline: "Simulated threat monitoring mapped to MITRE ATT&CK.",
    category: "Security",
    kind: "flagship",
  },
  {
    slug: "architecture",
    href: "/architecture",
    title: "Architecture Explorer",
    tagline: "A clickable, self-measuring system diagram.",
    category: "Systems & Networking",
    kind: "flagship",
  },
  {
    slug: "browser",
    href: "/browser",
    title: "In-Site Browser",
    tagline: "Private search and local dev ports, without leaving the tab.",
    category: "Search & Browsing",
    kind: "flagship",
  },
  {
    slug: "jwt-decoder",
    href: "/lab/jwt-decoder",
    title: "JWT Decoder",
    tagline: "Inspect a JSON Web Token's header, payload, and expiry.",
    category: "Security",
    kind: "utility",
  },
  {
    slug: "hash-generator",
    href: "/lab/hash-generator",
    title: "Hash Generator",
    tagline: "SHA-1 / SHA-256 / SHA-384 / SHA-512, computed in-browser.",
    category: "Security",
    kind: "utility",
  },
  {
    slug: "password-entropy",
    href: "/lab/password-entropy",
    title: "Password Entropy",
    tagline: "Real entropy math from character variety and length.",
    category: "Security",
    kind: "utility",
  },
  {
    slug: "contrast-checker",
    href: "/lab/contrast-checker",
    title: "Contrast Checker",
    tagline: "WCAG contrast ratio between two colors, with pass/fail thresholds.",
    category: "Security",
    kind: "utility",
  },
  {
    slug: "cidr-calculator",
    href: "/lab/cidr-calculator",
    title: "CIDR Calculator",
    tagline: "Network address, broadcast address, and usable host range.",
    category: "Systems & Networking",
    kind: "utility",
  },
  {
    slug: "http-status",
    href: "/lab/http-status",
    title: "HTTP Status Reference",
    tagline: "Searchable reference for every standard HTTP status code.",
    category: "Systems & Networking",
    kind: "utility",
  },
  {
    slug: "timestamp-converter",
    href: "/lab/timestamp-converter",
    title: "Timestamp Converter",
    tagline: "Unix epoch to and from ISO 8601 and local time.",
    category: "Systems & Networking",
    kind: "utility",
  },
  {
    slug: "base64",
    href: "/lab/base64",
    title: "Base64 Encode / Decode",
    tagline: "Convert text to and from Base64, UTF-8 safe.",
    category: "Developer Utilities",
    kind: "utility",
  },
  {
    slug: "url-encoder",
    href: "/lab/url-encoder",
    title: "URL Encode / Decode",
    tagline: "Percent-encode or decode a string.",
    category: "Developer Utilities",
    kind: "utility",
  },
  {
    slug: "uuid-generator",
    href: "/lab/uuid-generator",
    title: "UUID Generator",
    tagline: "Generate RFC 4122 v4 UUIDs.",
    category: "Developer Utilities",
    kind: "utility",
  },
  {
    slug: "json-formatter",
    href: "/lab/json-formatter",
    title: "JSON Formatter",
    tagline: "Validate and pretty-print JSON, with real error messages.",
    category: "Developer Utilities",
    kind: "utility",
  },
  {
    slug: "case-converter",
    href: "/lab/case-converter",
    title: "Case Converter",
    tagline: "camelCase, snake_case, kebab-case, Title Case, and more.",
    category: "Developer Utilities",
    kind: "utility",
  },
  {
    slug: "text-counter",
    href: "/lab/text-counter",
    title: "Text Counter",
    tagline: "Word count, character count, and estimated reading time.",
    category: "Developer Utilities",
    kind: "utility",
  },
];

export function toolsByCategory(): Array<{ category: LabCategory; tools: LabTool[] }> {
  const order: LabCategory[] = [
    "Security",
    "Systems & Networking",
    "Developer Utilities",
    "Search & Browsing",
  ];
  return order.map((category) => ({
    category,
    tools: labTools.filter((tool) => tool.category === category),
  }));
}

export function relatedTools(currentSlug: string, count = 3): LabTool[] {
  return labTools.filter((tool) => tool.slug !== currentSlug).slice(0, count);
}
