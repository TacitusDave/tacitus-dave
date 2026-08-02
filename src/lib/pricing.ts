export interface PricingPlan {
  id: "monthly" | "annual";
  label: string;
  /** Short, premium-toned line shown directly under the plan label. */
  tagline: string;
  /** Display text only — the reference USD price shown in the UI. */
  price: string;
  period: string;
  note?: string;
  /** Highlight badge shown on the card, e.g. "Best value". */
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

const sharedFeatures = [
  "Every utility in the Lab, unlocked — no per-tool paywalls, no usage caps",
  "New tools and refinements added continuously, at no extra charge",
  "Direct email support from the engineer who builds the tools",
];

export const pricingPlans: PricingPlan[] = [
  {
    id: "monthly",
    label: "Monthly",
    tagline: "The full toolkit, on your terms — billed month to month.",
    price: "$12",
    period: "/month",
    features: [...sharedFeatures, "Cancel anytime — no contracts, no lock-in"],
    amountNgn: 18210,
  },
  {
    id: "annual",
    label: "Annual",
    tagline: "The same complete toolkit, at the best rate available.",
    price: "$99",
    period: "/year",
    note: "≈ $8.25/month — save 31% versus paying monthly",
    highlight: "Best value",
    features: [
      ...sharedFeatures,
      "Save 31% versus paying monthly",
      "One annual charge — your rate is locked in for the full year",
    ],
    amountNgn: 150233,
  },
];

/** Shown near the price so visitors understand the $ figure is a reference, not what Paystack actually charges. */
export const billingCurrencyNote =
  "Billed in NGN at current exchange rates — the amount above is a USD reference price.";
