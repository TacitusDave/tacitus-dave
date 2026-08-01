import type { Metadata } from "next";
import { ToolPageShell } from "@/components/lab/tool-page-shell";
import { QrCodeGenerator } from "@/components/lab/qr-code-generator";

export const metadata: Metadata = {
  title: "QR Code Generator",
  description: "Generate a downloadable QR code from any text or URL, entirely in your browser.",
};

export default function QrCodePage() {
  return (
    <ToolPageShell
      eyebrow="Lab · Developer Utilities"
      title="QR Code Generator"
      description="Turn any text or URL into a scannable QR code — generated client-side, downloadable as a PNG."
      currentSlug="qr-code"
    >
      <QrCodeGenerator />
    </ToolPageShell>
  );
}
