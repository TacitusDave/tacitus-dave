import type { Metadata } from "next";
import { ToolPageShell } from "@/components/lab/tool-page-shell";
import { TimestampConverter } from "@/components/lab/timestamp-converter";

export const metadata: Metadata = {
  title: "Timestamp Converter",
  description: "Convert between Unix epoch time and human-readable dates, in both directions.",
};

export default function TimestampConverterPage() {
  return (
    <ToolPageShell
      eyebrow="Lab · Systems & Networking"
      title="Timestamp Converter"
      description="Convert between Unix epoch time and human-readable dates, in both directions."
      currentSlug="timestamp-converter"
    >
      <TimestampConverter />
    </ToolPageShell>
  );
}
