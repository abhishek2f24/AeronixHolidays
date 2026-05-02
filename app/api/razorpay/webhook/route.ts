export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
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

  // For one-time payments, we look for order.paid or payment.captured
  if (event.event === "order.paid") {
    const order = event.payload.order.entity;
    const notes = order.notes;
    const userId = notes.supabase_user_id;
    const plan   = notes.plan ?? "";
    const tier   = plan.startsWith("odyssey") ? "odyssey" : plan.startsWith("atlas") ? "atlas" : "voyager";

    await supabase.from("profiles").update({
      tier,
      subscription_status: "active", // For one-time, we can just mark it active
    }).eq("id", userId);
  }

  return NextResponse.json({ received: true });
}
