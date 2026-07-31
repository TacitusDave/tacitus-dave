import type { Metadata } from "next";
import { ToolPageShell } from "@/components/lab/tool-page-shell";
import { EncodeDecodeTool } from "@/components/lab/encode-decode-tool";

export const metadata: Metadata = {
  title: "Base64 Encode / Decode",
  description:
    "Encode or decode Base64 text online, UTF-8 safe in both directions — runs entirely in your browser.",
};

export default function Base64Page() {
  return (
    <ToolPageShell
      eyebrow="Lab · Developer Utilities"
      title="Base64 Encode / Decode"
      description="Convert text to and from Base64. UTF-8 safe in both directions."
      currentSlug="base64"
    >
      <EncodeDecodeTool variant="base64" placeholder="Type or paste text to encode…" />
    </ToolPageShell>
  );
}
