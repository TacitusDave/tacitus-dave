export interface PricingPlan {
  id: "monthly" | "annual";
  label: string;
  /** Display text only — the actual charge amount comes from the Stripe Price object. Update both together. */
  price: string;
  period: string;
  note?: string;
}

/** TODO: placeholder amounts — update to match the real Stripe Price objects once created. */
export const pricingPlans: PricingPlan[] = [
  {
    id: "monthly",
    label: "Monthly",
    price: "$9",
    period: "/month",
  },
  {
    id: "annual",
    label: "Annual",
    price: "$79",
    period: "/year",
    note: "≈ $6.60/month",
  },
];
