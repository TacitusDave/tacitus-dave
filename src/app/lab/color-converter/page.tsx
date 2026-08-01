import type { Metadata } from "next";
import { ToolPageShell } from "@/components/lab/tool-page-shell";
import { ColorConverter } from "@/components/lab/color-converter";

export const metadata: Metadata = {
  title: "Color Converter",
  description: "Convert a color between hex, RGB, and HSL, with a live preview swatch.",
};

export default function ColorConverterPage() {
  return (
    <ToolPageShell
      eyebrow="Lab · Developer Utilities"
      title="Color Converter"
      description="Edit any of hex, RGB, or HSL and the others update live — all three always stay in sync."
      currentSlug="color-converter"
    >
      <ColorConverter />
    </ToolPageShell>
  );
}
