export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getRazorpay, PRICES, type PlanKey } from "@/lib/razorpay";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { plan } = await req.json() as { plan: PlanKey };
  if (!PRICES[plan]) return NextResponse.json({ error: "Invalid plan" }, { status: 400 });

  const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).single();

  const razorpay = getRazorpay();

  // Create an Order for one-time payment
  const order = await razorpay.orders.create({
    amount: PRICES[plan],
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
    notes: {
      supabase_user_id: user.id,
      plan: plan,
    },
  });

  return NextResponse.json({ 
    order_id: order.id,
    key_id: process.env.RAZORPAY_KEY_ID,
    amount: order.amount,
    currency: order.currency,
    name: "Aeronix Holidays",
    description: `${plan.replace("_", " ")} Purchase`,
    prefill: {
      name: profile?.full_name ?? "",
      email: user.email ?? "",
    }
  });
}
