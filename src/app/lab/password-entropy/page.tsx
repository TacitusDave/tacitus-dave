import type { Metadata } from "next";
import { ToolPageShell } from "@/components/lab/tool-page-shell";
import { PasswordEntropy } from "@/components/lab/password-entropy";

export const metadata: Metadata = {
  title: "Password Entropy",
  description:
    "Calculate real password entropy from character variety and length — not a fake strength meter.",
};

export default function PasswordEntropyPage() {
  return (
    <ToolPageShell
      eyebrow="Lab · Security"
      title="Password Entropy"
      description="Real entropy math instead of a fake strength bar — see exactly how length and character variety affect the search space an attacker faces."
      currentSlug="password-entropy"
    >
      <PasswordEntropy />
    </ToolPageShell>
  );
}
