import type { Metadata } from "next";
import { ToolPageShell } from "@/components/lab/tool-page-shell";
import { JwtDecoder } from "@/components/lab/jwt-decoder";

export const metadata: Metadata = {
  title: "JWT Decoder",
  description:
    "Decode a JSON Web Token's header and payload, and check its expiry — entirely client-side.",
};

export default function JwtDecoderPage() {
  return (
    <ToolPageShell
      eyebrow="Lab · Security"
      title="JWT Decoder"
      description="Paste a JSON Web Token to inspect its header and payload. Runs entirely in your browser — the token never leaves this page."
      currentSlug="jwt-decoder"
    >
      <JwtDecoder />
    </ToolPageShell>
  );
}
