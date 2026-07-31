import type { Metadata } from "next";
import { ToolPageShell } from "@/components/lab/tool-page-shell";
import { HashGenerator } from "@/components/lab/hash-generator";

export const metadata: Metadata = {
  title: "Hash Generator",
  description:
    "Generate SHA-1, SHA-256, SHA-384, and SHA-512 hashes in your browser using the Web Crypto API.",
};

export default function HashGeneratorPage() {
  return (
    <ToolPageShell
      eyebrow="Lab · Security"
      title="Hash Generator"
      description="Compute SHA-1, SHA-256, SHA-384, and SHA-512 digests using the browser's native Web Crypto API."
      currentSlug="hash-generator"
    >
      <HashGenerator />
    </ToolPageShell>
  );
}
