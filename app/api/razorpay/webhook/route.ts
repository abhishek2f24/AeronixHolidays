export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getRazorpay } from "@/lib/razorpay";
import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";

export async function POST(req: Request) {
  const body = await req.text();
  const sig  = req.headers.get("x-razorpay-signature")!;

  const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;
  const expectedSig = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  if (sig !== expectedSig) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(body);
  const supabase = await createClient();

  if (event.event === "subscription.activated" || event.event === "subscription.charged") {
    const sub = event.payload.subscription.entity;
    const notes = sub.notes;
    const userId = notes.supabase_user_id;
    const plan   = notes.plan ?? "";
    const tier   = plan.startsWith("odyssey") ? "odyssey" : plan.startsWith("atlas") ? "atlas" : "voyager";

    await supabase.from("profiles").update({
      tier,
      razorpay_subscription_id: sub.id,
      subscription_status: sub.status,
    }).eq("id", userId);
  }

  if (event.event === "subscription.cancelled") {
    const sub = event.payload.subscription.entity;
    const userId = sub.notes.supabase_user_id;
    await supabase.from("profiles").update({ tier: "voyager", subscription_status: "cancelled" }).eq("id", userId);
  }

  return NextResponse.json({ received: true });
}
