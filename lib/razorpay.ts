import Razorpay from "razorpay";

export function getRazorpay() {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });
}

export const PRICES = {
  atlas_annual:   parseInt(process.env.RAZORPAY_ATLAS_ANNUAL_PRICE || "48000"),
  atlas_monthly:  parseInt(process.env.RAZORPAY_ATLAS_MONTHLY_PRICE || "4900"),
  odyssey_annual: parseInt(process.env.RAZORPAY_ODYSSEY_ANNUAL_PRICE || "480000"),
} as const;

export type PlanKey = keyof typeof PRICES;
