export interface PricingPlan {
  id: "monthly" | "annual";
  label: string;
  /** Display text only. */
  price: string;
  period: string;
  note?: string;
  /** Naira (not kobo) — Paystack's API wants kobo, converted at the call site. Keep this in sync with the real Paystack Plan amount. */
  amountNaira: number;
}

/** TODO: placeholder amounts — update to match the real Paystack Plan amounts once created. */
export const pricingPlans: PricingPlan[] = [
  {
    id: "monthly",
    label: "Monthly",
    price: "₦4,500",
    period: "/month",
    amountNaira: 4500,
  },
  {
    id: "annual",
    label: "Annual",
    price: "₦45,000",
    period: "/year",
    note: "≈ ₦3,750/month",
    amountNaira: 45000,
  },
];
