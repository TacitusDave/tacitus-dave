import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Terminal } from "@/components/terminal/terminal";
import { RelatedTools } from "@/components/lab/related-tools";

export const metadata: Metadata = {
  title: "Terminal",
  description:
    "A real command-line shell running in your browser, with a virtual filesystem and tab-completion.",
};

export default function TerminalPage() {
  return (
    <>
      <PageHeader
        eyebrow="Terminal"
        title="A real shell, running in your browser."
        description="A command parser, a virtual filesystem, tab-completion, and command history — all client-side. Type `help` to get started, or `open projects` to navigate the real site."
      />

      <section className="mx-auto max-w-4xl px-6 py-12">
        <Terminal />
      </section>

      <RelatedTools currentSlug="terminal" />
    </>
  );
}
