export interface PricingPlan {
  id: "monthly" | "annual";
  label: string;
  /** Display text only. */
  price: string;
  period: string;
  note?: string;
  /** Dollars (not cents) — Paystack's API wants the smallest unit, converted at the call site. Keep this in sync with the real Paystack Plan amount. */
  amountUsd: number;
}

/** TODO: placeholder amounts — update to match the real Paystack Plan amounts once created. */
export const pricingPlans: PricingPlan[] = [
  {
    id: "monthly",
    label: "Monthly",
    price: "$12",
    period: "/month",
    amountUsd: 12,
  },
  {
    id: "annual",
    label: "Annual",
    price: "$99",
    period: "/year",
    note: "≈ $8.25/month",
    amountUsd: 99,
  },
];
