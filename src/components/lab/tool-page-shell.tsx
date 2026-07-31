import type { ReactNode } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { RelatedTools } from "@/components/lab/related-tools";

export function ToolPageShell({
  eyebrow,
  title,
  description,
  currentSlug,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  currentSlug: string;
  children: ReactNode;
}) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} description={description} />
      <section className="mx-auto max-w-4xl px-6 py-12">{children}</section>
      <RelatedTools currentSlug={currentSlug} />
    </>
  );
}
