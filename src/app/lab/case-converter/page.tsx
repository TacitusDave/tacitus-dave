import type { Metadata } from "next";
import { ToolPageShell } from "@/components/lab/tool-page-shell";
import { CaseConverter } from "@/components/lab/case-converter";

export const metadata: Metadata = {
  title: "Case Converter — Tacitus Dave OS",
};

export default function CaseConverterPage() {
  return (
    <ToolPageShell
      eyebrow="Lab · Developer Utilities"
      title="Case Converter"
      description="Convert any string to camelCase, PascalCase, snake_case, kebab-case, and more, all at once."
      currentSlug="case-converter"
    >
      <CaseConverter />
    </ToolPageShell>
  );
}
