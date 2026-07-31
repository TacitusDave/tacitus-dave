import type { Metadata } from "next";
import { ToolPageShell } from "@/components/lab/tool-page-shell";
import { JsonFormatter } from "@/components/lab/json-formatter";

export const metadata: Metadata = {
  title: "JSON Formatter — Tacitus Dave OS",
};

export default function JsonFormatterPage() {
  return (
    <ToolPageShell
      eyebrow="Lab · Developer Utilities"
      title="JSON Formatter"
      description="Validate and pretty-print JSON, with the real parser error message when something's wrong."
      currentSlug="json-formatter"
    >
      <JsonFormatter />
    </ToolPageShell>
  );
}
