import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { SiteBrowser } from "@/components/browser/site-browser";
import { RelatedTools } from "@/components/lab/related-tools";

export const metadata: Metadata = {
  title: "Browser",
  description:
    "Search and browse without leaving the site — a private-search panel and localhost previewer built into Tacitus Dave OS.",
};

export default function BrowserPage() {
  return (
    <>
      <PageHeader
        eyebrow="Browser"
        title="Search and browse, without leaving the site."
        description="Type a search or a URL — plain text routes through a privacy-respecting search engine, and any localhost port previews instantly."
      />

      <section className="mx-auto max-w-5xl px-6 py-12">
        <Suspense fallback={<div className="h-[38rem] animate-pulse rounded-md border border-border bg-background-elevated/40" />}>
          <SiteBrowser />
        </Suspense>
      </section>

      <RelatedTools currentSlug="browser" />
    </>
  );
}
