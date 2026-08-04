const STACK = [
  "Next.js",
  "TypeScript",
  "React",
  "Tailwind CSS",
  "Redis",
  "Paystack",
  "Resend",
  "Web Crypto API",
  "Vercel",
];

/**
 * An honest "built with" strip — not a fake client-logo carousel. This site
 * doesn't have real customer logos to show yet, and a "Trusted by" row of
 * invented company names would be exactly the kind of fake social proof
 * that's actually deceptive to visitors, not just a placeholder.
 */
export function TechMarquee() {
  const items = [...STACK, ...STACK];

  return (
    <div className="overflow-hidden border-y border-border py-6" style={{ maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}>
      <div className="flex w-max animate-[marquee_28s_linear_infinite] gap-12">
        {items.map((name, index) => (
          <span
            key={`${name}-${index}`}
            className="whitespace-nowrap font-mono text-sm uppercase tracking-widest text-foreground-muted"
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}
