import type { Metadata } from "next";
import { ToolPageShell } from "@/components/lab/tool-page-shell";
import { CidrCalculator } from "@/components/lab/cidr-calculator";

export const metadata: Metadata = {
  title: "CIDR Calculator",
  description:
    "Calculate a subnet's network address, broadcast address, and usable host range from a CIDR block.",
};

export default function CidrCalculatorPage() {
  return (
    <ToolPageShell
      eyebrow="Lab · Systems & Networking"
      title="CIDR Calculator"
      description="Enter an address and prefix to see the network address, broadcast address, subnet mask, and usable host range — real bitwise math, not a lookup table."
      currentSlug="cidr-calculator"
    >
      <CidrCalculator />
    </ToolPageShell>
  );
}
