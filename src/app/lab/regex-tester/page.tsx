import type { Metadata } from "next";
import { ToolPageShell } from "@/components/lab/tool-page-shell";
import { RegexTester } from "@/components/lab/regex-tester";

export const metadata: Metadata = {
  title: "Regex Tester",
  description: "Test a regular expression against a string with live match highlighting and capture groups.",
};

export default function RegexTesterPage() {
  return (
    <ToolPageShell
      eyebrow="Lab · Developer Utilities"
      title="Regex Tester"
      description="Live match highlighting and capture groups — uses the browser's real RegExp engine, not an approximation."
      currentSlug="regex-tester"
    >
      <RegexTester />
    </ToolPageShell>
  );
}
