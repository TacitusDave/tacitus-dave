import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { AuthorizeFlow } from "@/components/lab/authorize-flow";

export const metadata: Metadata = {
  title: "Lab Authorization",
  description: "Sign in to the Tacitus Dave Lab with your subscriber email.",
};

export default function AuthorizePage() {
  return (
    <>
      <PageHeader
        eyebrow="Lab Authorization Center"
        title="Sign in to the Lab."
        description="Enter your access key — the one we emailed you when you subscribed. It stays valid for as long as your subscription is active."
      />

      <section className="mx-auto max-w-md px-6 py-12">
        <Suspense fallback={<div className="h-40 animate-pulse rounded-md border border-border bg-background-elevated/40" />}>
          <AuthorizeFlow />
        </Suspense>
      </section>
    </>
  );
}
