import type { Metadata } from "next";
import { ToolPageShell } from "@/components/lab/tool-page-shell";
import { EncodeDecodeTool } from "@/components/lab/encode-decode-tool";

export const metadata: Metadata = {
  title: "URL Encode / Decode",
  description: "Percent-encode or decode a URL component online, entirely in your browser.",
};

export default function UrlEncoderPage() {
  return (
    <ToolPageShell
      eyebrow="Lab · Developer Utilities"
      title="URL Encode / Decode"
      description="Percent-encode a string for safe use in a URL, or decode one back to plain text."
      currentSlug="url-encoder"
    >
      <EncodeDecodeTool variant="url" placeholder="Type or paste text or a URL component…" />
    </ToolPageShell>
  );
}
