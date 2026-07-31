import type { Metadata } from "next";
import { ToolPageShell } from "@/components/lab/tool-page-shell";
import { ContrastChecker } from "@/components/lab/contrast-checker";

export const metadata: Metadata = {
  title: "Contrast Checker",
  description: "Check the WCAG contrast ratio between two colors and see whether they pass AA or AAA.",
};

export default function ContrastCheckerPage() {
  return (
    <ToolPageShell
      eyebrow="Lab · Security"
      title="Contrast Checker"
      description="The real WCAG relative-luminance formula, not an approximation — check whether a color pair clears AA or AAA thresholds."
      currentSlug="contrast-checker"
    >
      <ContrastChecker />
    </ToolPageShell>
  );
}
