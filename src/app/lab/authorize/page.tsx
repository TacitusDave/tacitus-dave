import type { Metadata } from "next";
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
        description="Enter the email you subscribed with. We'll send a one-time code — it's valid for 15 minutes and works once."
      />

      <section className="mx-auto max-w-md px-6 py-12">
        <AuthorizeFlow />
      </section>
    </>
  );
}
