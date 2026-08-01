import type { Metadata } from "next";
import { ToolPageShell } from "@/components/lab/tool-page-shell";
import { MarkdownPreviewer } from "@/components/lab/markdown-previewer";

export const metadata: Metadata = {
  title: "Markdown Previewer",
  description: "Write Markdown and see the rendered HTML live, side by side.",
};

export default function MarkdownPreviewerPage() {
  return (
    <ToolPageShell
      eyebrow="Lab · Developer Utilities"
      title="Markdown Previewer"
      description="Live side-by-side Markdown rendering — parsed and sanitized entirely in your browser."
      currentSlug="markdown-previewer"
    >
      <MarkdownPreviewer />
    </ToolPageShell>
  );
}
