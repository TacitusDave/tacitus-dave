import { SubscriptionCountdown } from "@/components/lab/subscription-countdown";

export default function LabLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <SubscriptionCountdown />
    </>
  );
}
