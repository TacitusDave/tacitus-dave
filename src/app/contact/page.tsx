import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { ContactForm } from "@/components/contact/contact-form";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact — Tacitus Dave OS",
};

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
            <div className="mt-2 flex flex-col gap-1">
              <a
                href={siteConfig.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-foreground-muted transition-colors hover:text-accent"
              >
                GitHub
              </a>
              <a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-foreground-muted transition-colors hover:text-accent"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        <ContactForm />
      </section>
    </>
  );
}
