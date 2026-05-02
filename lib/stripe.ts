import Stripe from "stripe";

export function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-04-22.dahlia",
    typescript: true,
  });
}

export const PLANS = {
  atlas_annual:   process.env.STRIPE_ATLAS_ANNUAL_PRICE_ID!,
  atlas_monthly:  process.env.STRIPE_ATLAS_MONTHLY_PRICE_ID!,
  odyssey_annual: process.env.STRIPE_ODYSSEY_ANNUAL_PRICE_ID!,
} as const;

export type PlanKey = keyof typeof PLANS;
