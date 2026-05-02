export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getRazorpay, PLANS, type PlanKey } from "@/lib/razorpay";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { plan } = await req.json() as { plan: PlanKey };
  if (!PLANS[plan]) return NextResponse.json({ error: "Invalid plan" }, { status: 400 });

  const { data: profile } = await supabase.from("profiles").select("full_name, razorpay_customer_id").eq("id", user.id).single();

  const razorpay = getRazorpay();

  // Create a subscription
  // Note: For Razorpay, we usually create a subscription and then the frontend opens the modal.
  const subscription = await razorpay.subscriptions.create({
    plan_id: PLANS[plan],
    customer_notify: 1,
    total_count: plan.endsWith("_annual") ? 10 : 120, // Example: 10 years or 10 years of months
    quantity: 1,
    notes: {
      supabase_user_id: user.id,
      plan: plan,
    },
  });

  return NextResponse.json({ 
    subscription_id: subscription.id,
    key_id: process.env.RAZORPAY_KEY_ID,
    amount: subscription.amount, // This might be undefined for subscriptions until first charge
    name: "Aeronix Holidays",
    description: `${plan.replace("_", " ")} Plan`,
    prefill: {
      name: profile?.full_name ?? "",
      email: user.email ?? "",
    }
  });
}
