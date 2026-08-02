import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { ContactForm } from "@/components/contact/contact-form";
import { SocialLinks } from "@/components/contact/social-links";
import { CopyButton } from "@/components/lab/copy-button";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Tacitus Dave for roles, projects, or technical questions.",
};

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
    </>
  );
}
