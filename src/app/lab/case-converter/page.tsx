import type { Metadata } from "next";
import { ToolPageShell } from "@/components/lab/tool-page-shell";
import { CaseConverter } from "@/components/lab/case-converter";

export const metadata: Metadata = {
  title: "Case Converter",
  description: "Convert text to camelCase, snake_case, kebab-case, Title Case, and more, instantly.",
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
