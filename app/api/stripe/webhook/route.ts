export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import type Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const sig  = req.headers.get("stripe-signature")!;

  const stripe = getStripe();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = await createClient();

  if (event.type === "customer.subscription.created" || event.type === "customer.subscription.updated") {
    const sub = event.data.object as Stripe.Subscription;
    const userId = sub.metadata.supabase_user_id;
    const plan   = sub.metadata.plan ?? "";
    const tier   = plan.startsWith("odyssey") ? "odyssey" : plan.startsWith("atlas") ? "atlas" : "voyager";

    await supabase.from("profiles").update({
      tier,
      stripe_subscription_id: sub.id,
      subscription_status: sub.status,
    }).eq("id", userId);
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    const userId = sub.metadata.supabase_user_id;
    await supabase.from("profiles").update({ tier: "voyager", subscription_status: "canceled" }).eq("id", userId);
  }

  return NextResponse.json({ received: true });
}
