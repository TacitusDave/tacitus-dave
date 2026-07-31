import type { Metadata } from "next";
import { ToolPageShell } from "@/components/lab/tool-page-shell";
import { HttpStatusReference } from "@/components/lab/http-status-reference";

export const metadata: Metadata = {
  title: "HTTP Status Reference — Tacitus Dave OS",
};

export default function HttpStatusPage() {
  return (
    <ToolPageShell
      eyebrow="Lab · Systems & Networking"
      title="HTTP Status Reference"
      description="A searchable reference for the HTTP status codes you'll actually run into, grouped by what they mean."
      currentSlug="http-status"
    >
      <HttpStatusReference />
    </ToolPageShell>
  );
}
