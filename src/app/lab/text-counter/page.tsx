import type { Metadata } from "next";
import { ToolPageShell } from "@/components/lab/tool-page-shell";
import { TextCounter } from "@/components/lab/text-counter";

export const metadata: Metadata = {
  title: "Text Counter",
  description: "Count words, characters, and sentences, and estimate reading time for any text.",
};

export default function TextCounterPage() {
  return (
    <ToolPageShell
      eyebrow="Lab · Developer Utilities"
      title="Text Counter"
      description="Word count, character count, sentence and paragraph count, and estimated reading/speaking time."
      currentSlug="text-counter"
    >
      <TextCounter />
    </ToolPageShell>
  );
}
