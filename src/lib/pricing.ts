export interface PricingPlan {
  id: "monthly" | "annual";
  label: string;
  /** Display text only — the reference USD price shown in the UI. */
  price: string;
  period: string;
  note?: string;
  /**
   * The real charge amount, in Naira (not kobo). Paystack charges whatever
   * amount is configured on the Plan itself when a `plan` code is passed to
   * /transaction/initialize — this value must match that Plan's dashboard
   * configuration exactly, or the two will silently disagree.
   */
  amountNgn: number;
}

/** TODO: placeholder amounts — update to match the real Paystack Plan amounts once created. */
export const pricingPlans: PricingPlan[] = [
  {
    id: "monthly",
    label: "Monthly",
    price: "$12",
    period: "/month",
    amountNgn: 18210,
  },
  {
    id: "annual",
    label: "Annual",
    price: "$99",
    period: "/year",
    note: "≈ $8.25/month",
    amountNgn: 150233,
  },
];

/** Shown near the price so visitors understand the $ figure is a reference, not what Paystack actually charges. */
export const billingCurrencyNote =
  "Billed in NGN at current exchange rates — the amount above is a USD reference price.";
