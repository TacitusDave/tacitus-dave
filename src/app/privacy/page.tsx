import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Privacy & Terms",
  description:
    "What data this site collects, how payments and sign-in work, and the terms behind a Tacitus Dave Lab subscription.",
};

const sections = [
  {
    heading: "What's collected",
    body: [
      "An email address, when you subscribe to the Lab or use the contact form — that's it for personal data. No analytics pixels, no ad trackers, no third-party marketing tools.",
      "Vercel (the host) logs standard request data for operating the site, the same as any web host.",
    ],
  },
  {
    heading: "Payments",
    body: [
      "Subscriptions are processed by Paystack. Card details go directly to Paystack — this site never sees or stores them, only the resulting subscription status.",
    ],
  },
  {
    heading: "Access & sign-in",
    body: [
      "A Lab subscription gets you a persistent access key, emailed via Resend. The key and your email are stored in Redis for as long as the subscription is active, and are used for nothing except verifying access.",
      "Lab sign-in sessions are cookie-based and session-only — closing the browser ends the session. Sign-in attempts are rate-limited to slow down brute-forcing, not to track you.",
    ],
  },
  {
    heading: "What this site doesn't do",
    body: [
      "Sell, rent, or share your email with anyone. Run ads or ad trackers. Use your data to train anything.",
    ],
  },
  {
    heading: "Cancelling & data requests",
    body: [
      `Email ${siteConfig.contactEmail} to cancel a subscription, request your data, or ask that it be deleted. Requests are handled directly — there's no support ticket system standing between you and an answer.`,
    ],
  },
  {
    heading: "Terms",
    body: [
      "The Lab tools are provided as-is. The free flagship tools (Terminal, SOC Dashboard, Architecture Explorer, Browser) stay free indefinitely. A subscription unlocks the rest of the Lab for as long as it's active; cancelling stops future billing but doesn't retroactively refund completed billing periods unless something on this end was broken.",
    ],
  },
] as const;

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Privacy & Terms"
        title="What happens to your data."
        description="Short version: this is a one-person site, not a data broker. Here's exactly what's collected and why."
      />

      <section className="mx-auto max-w-3xl px-6 py-12">
        <div className="flex flex-col gap-10">
          {sections.map((section) => (
            <div key={section.heading}>
              <h2 className="font-mono text-xs uppercase tracking-widest text-accent">
                {section.heading}
              </h2>
              <div className="mt-3 flex flex-col gap-3">
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="text-sm leading-relaxed text-foreground-muted">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
