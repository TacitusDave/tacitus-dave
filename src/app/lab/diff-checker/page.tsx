import type { Metadata } from "next";
import { ToolPageShell } from "@/components/lab/tool-page-shell";
import { DiffChecker } from "@/components/lab/diff-checker";

export const metadata: Metadata = {
  title: "Diff Checker",
  description: "Compare two blocks of text line by line with a real LCS-based diff.",
};

export default function DiffCheckerPage() {
  return (
    <ToolPageShell
      eyebrow="Lab · Developer Utilities"
      title="Diff Checker"
      description="Line-by-line comparison using a real longest-common-subsequence diff, computed entirely in your browser."
      currentSlug="diff-checker"
    >
      <DiffChecker />
    </ToolPageShell>
  );
}
