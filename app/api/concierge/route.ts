export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getResend, FROM_EMAIL } from "@/lib/resend";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { subject, message } = await req.json();
  if (!message?.trim()) return NextResponse.json({ error: "Message required" }, { status: 400 });

  const { data: profile } = await supabase.from("profiles").select("full_name, tier").eq("id", user.id).single();
  const tier = profile?.tier ?? "voyager";

  await supabase.from("concierge_requests").insert({
    user_id: user.id,
    subject: subject ?? "New concierge request",
    message,
    tier,
  });

  const resend = getResend();
  await resend.emails.send({
    from: FROM_EMAIL,
    to: process.env.FOUNDER_EMAIL ?? "abhishek2f24@gmail.com",
    subject: `[${tier.toUpperCase()}] Concierge: ${subject ?? "New request"}`,
    text: `From: ${profile?.full_name ?? "Member"} (${user.email})\nTier: ${tier}\n\n${message}`,
  });

  return NextResponse.json({ success: true });
}
