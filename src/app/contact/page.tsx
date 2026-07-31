import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { ContactForm } from "@/components/contact/contact-form";
import { SocialLinks } from "@/components/contact/social-links";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Tacitus Dave for roles, projects, or technical questions.",
};

const socialLinks = [
  {
    label: "GitHub",
    href: siteConfig.social.github,
    description: "Real repositories, commit history, and open-source work.",
  },
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

      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-12 lg:grid-cols-[1fr_1.2fr]">
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="font-mono text-xs uppercase tracking-widest text-accent">
              Email
            </h2>
            <a
              href={`mailto:${siteConfig.contactEmail}`}
              className="mt-2 block text-sm text-foreground-muted transition-colors hover:text-accent"
            >
              {siteConfig.contactEmail}
            </a>
          </div>

          <div>
            <h2 className="font-mono text-xs uppercase tracking-widest text-accent">
              Elsewhere
            </h2>
            <SocialLinks links={socialLinks} />
          </div>
        </div>

        <ContactForm />
      </section>
    </>
  );
}
