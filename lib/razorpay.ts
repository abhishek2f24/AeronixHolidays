import Razorpay from "razorpay";

export function getRazorpay() {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });
}

export const PLANS = {
  atlas_annual:   process.env.RAZORPAY_ATLAS_ANNUAL_PLAN_ID!,
  atlas_monthly:  process.env.RAZORPAY_ATLAS_MONTHLY_PLAN_ID!,
  odyssey_annual: process.env.RAZORPAY_ODYSSEY_ANNUAL_PLAN_ID!,
} as const;

export type PlanKey = keyof typeof PLANS;
