export interface PricingPlan {
  id: "monthly" | "annual";
  label: string;
  /** Short, premium-toned line shown directly under the plan label. */
  tagline: string;
  /** Display text only — the reference USD price shown in the UI. */
  price: string;
  period: string;
  note?: string;
  /** Highlight badge shown on the card, e.g. "Recommended" or "Best value". */
  highlight?: string;
  /** Bullet list of what the plan includes, rendered on the pricing card. */
  features: string[];
  /**
   * The real charge amount, in Naira (not kobo). Paystack charges whatever
   * amount is configured on the Plan itself when a `plan` code is passed to
   * /transaction/initialize — this value must match that Plan's dashboard
   * configuration exactly, or the two will silently disagree.
   */
  amountNgn: number;
}

export const pricingPlans: PricingPlan[] = [
  {
    id: "monthly",
    label: "Monthly",
    tagline: "Complete access, on your own schedule.",
    price: "$12",
    period: "/month",
    highlight: "Recommended",
    features: [
      "Unrestricted access to every tool in the Lab — nothing gated, nothing capped",
      "Every new tool added to the Lab, available to you the moment it ships",
      "Direct email support from the engineer who builds the tools",
      "Full flexibility — cancel any month, no questions asked",
    ],
    amountNgn: 18210,
  },
  {
    id: "annual",
    label: "Annual",
    tagline: "Complete access, secured at the best possible rate.",
    price: "$99",
    period: "/year",
    note: "≈ $8.25/month — save 31% versus paying monthly",
    highlight: "Best value",
    features: [
      "Unrestricted access to every tool in the Lab — nothing gated, nothing capped",
      "Every new tool added to the Lab, available to you the moment it ships",
      "Direct email support from the engineer who builds the tools",
      "One payment secures a full year at 31% less than paying monthly",
    ],
    amountNgn: 150233,
  },
];

/** Shown near the price so visitors understand the $ figure is a reference, not what Paystack actually charges. */
export const billingCurrencyNote =
  "Billed in NGN at current exchange rates — the amount above is a USD reference price.";
