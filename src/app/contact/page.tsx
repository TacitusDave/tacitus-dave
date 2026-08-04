import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { ContactForm } from "@/components/contact/contact-form";
import { SocialLinks } from "@/components/contact/social-links";
import { CopyButton } from "@/components/lab/copy-button";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Tacitus Dave for roles, projects, or technical questions.",
};

const engagementTypes = [
  {
    title: "Freelance",
    detail: "Scoped project work — a feature, a tool, a security review — with a clear start and end.",
  },
  {
    title: "Contract",
    detail: "Embedded with a team for a defined stretch, on either the engineering or SOC side of the work.",
  },
  {
    title: "Full-time",
    detail: "Open to the right role — one where security isn't bolted on after the software ships.",
  },
] as const;

const expectations = [
  {
    title: "Response time",
    detail: "Usually within a day or two. If it's been longer, the email genuinely got buried — send a follow-up.",
  },
  {
    title: "What to include",
    detail: "What you're building, the stack, and the actual problem you're stuck on — vague \"let's chat\" emails take longer to get a useful reply.",
  },
  {
    title: "How this works",
    detail: "No sales calls, no account managers. You're emailing the person who'd actually do the work.",
  },
] as const;

const contactFaqs = [
  {
    question: "Do you take on short, one-off jobs?",
    answer:
      "Yes, if the scope is clear. A single tool, a focused security review, a specific bug — those are easier to say yes to than open-ended \"help with everything.\"",
  },
  {
    question: "Are you open to remote-only work?",
    answer: "Yes — everything on this site, including this platform itself, was built and is maintained fully remote.",
  },
  {
    question: "Can I ask a technical question without hiring you?",
    answer:
      "Sure. Not everything needs to turn into a paid engagement — ask, and if it turns into more later, it turns into more later.",
  },
] as const;

const socialLinks = [
  {
    label: "Instagram",
    href: siteConfig.social.instagram,
    description: "Behind-the-scenes photos and build logs.",
  },
  {
    label: "TikTok",
    href: siteConfig.social.tiktok,
    description: "Short-form videos on engineering and security.",
  },
  {
    label: "LinkedIn",
    href: siteConfig.social.linkedin,
    description: "Professional experience and recommendations.",
  },
].filter((link) => link.href);

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Let's talk about your systems."
        description="Whether it's a role, a project, or a technical question — reach out directly."
      />

      <div className="mx-auto flex max-w-6xl items-center gap-2 px-6 font-mono text-xs uppercase tracking-widest text-accent">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
        </span>
        Open to freelance, contract, and full-time work
      </div>

      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-12 lg:grid-cols-[1fr_1.2fr]">
        <div className="flex flex-col gap-6">
          <div className="rounded-md border border-border bg-background-elevated/40 p-5">
            <h2 className="font-mono text-xs uppercase tracking-widest text-accent">
              Email
            </h2>
            <p className="mt-3 break-all text-lg text-foreground">{siteConfig.contactEmail}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                className={buttonVariants({ size: "sm" })}
              >
                Send an email
              </a>
              <CopyButton value={siteConfig.contactEmail} />
            </div>
          </div>

          <div>
            <h2 className="font-mono text-xs uppercase tracking-widest text-accent">
              Elsewhere
            </h2>
            <div className="mt-3">
              <SocialLinks links={socialLinks} />
            </div>
          </div>
        </div>

        <div className="rounded-md border border-border bg-background-elevated/40 p-6">
          <ContactForm />
          <p className="mt-4 text-xs text-foreground-muted">
            Submitting opens your email client with the message pre-filled — nothing is sent from
            this site directly, and nothing is stored. I typically reply within a day or two.
          </p>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <Reveal>
            <h2 className="font-mono text-xs uppercase tracking-widest text-accent">
              Ways to work together
            </h2>
          </Reveal>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {engagementTypes.map((type, index) => (
              <Reveal key={type.title} delayMs={index * 60}>
                <Card className="h-full p-5">
                  <p className="text-sm font-medium text-foreground">{type.title}</p>
                  <p className="mt-2 text-xs text-foreground-muted">{type.detail}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <Reveal>
            <h2 className="font-mono text-xs uppercase tracking-widest text-accent">
              What to expect
            </h2>
          </Reveal>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {expectations.map((item, index) => (
              <Reveal key={item.title} delayMs={index * 60}>
                <Card className="h-full p-5">
                  <p className="text-sm font-medium text-foreground">{item.title}</p>
                  <p className="mt-2 text-xs text-foreground-muted">{item.detail}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <Reveal>
            <h2 className="font-mono text-xs uppercase tracking-widest text-accent">
              Questions
            </h2>
          </Reveal>
          <div className="mt-6 flex flex-col divide-y divide-border border-t border-border">
            {contactFaqs.map((faq) => (
              <details key={faq.question} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-foreground marker:content-none">
                  {faq.question}
                  <span className="shrink-0 font-mono text-accent transition-transform duration-200 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-foreground-muted">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
