export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { offer_token, price } = await req.json();
  if (!offer_token) return NextResponse.json({ error: "offer_token required" }, { status: 400 });

  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24h hold

  const { data, error } = await supabase.from("fare_locks").insert({
    user_id:     user.id,
    offer_token,
    price_usd:   price,
    expires_at:  expiresAt,
  }).select("id").single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ lock_id: data.id, expires_at: expiresAt });
}
