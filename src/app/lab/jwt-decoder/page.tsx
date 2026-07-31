import type { Metadata } from "next";
import { ToolPageShell } from "@/components/lab/tool-page-shell";
import { JwtDecoder } from "@/components/lab/jwt-decoder";

export const metadata: Metadata = {
  title: "JWT Decoder — Tacitus Dave OS",
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
