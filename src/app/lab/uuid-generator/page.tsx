import type { Metadata } from "next";
import { ToolPageShell } from "@/components/lab/tool-page-shell";
import { UuidGenerator } from "@/components/lab/uuid-generator";

export const metadata: Metadata = {
  title: "UUID Generator — Tacitus Dave OS",
};

export default function UuidGeneratorPage() {
  return (
    <ToolPageShell
      eyebrow="Lab · Developer Utilities"
      title="UUID Generator"
      description="Generate RFC 4122 version 4 UUIDs using the browser's cryptographically secure random source."
      currentSlug="uuid-generator"
    >
      <UuidGenerator />
    </ToolPageShell>
  );
}
