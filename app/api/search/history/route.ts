export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ ok: false }, { status: 401 });

    const body = await req.json();
    const { type, label, href, fromCode, toCode, departDate, returnDate,
            cabin, destination, checkIn, checkOut, adults, rooms, resultsCount } = body;

    // Gracefully skip if table doesn't exist yet (migration not run)
    const { error } = await supabase.from("search_history").insert({
      user_id:       user.id,
      type,
      label,
      href,
      from_code:     fromCode    ?? null,
      to_code:       toCode      ?? null,
      depart_date:   departDate  ?? null,
      return_date:   returnDate  ?? null,
      cabin:         cabin       ?? null,
      destination:   destination ?? null,
      check_in:      checkIn     ?? null,
      check_out:     checkOut    ?? null,
      adults:        adults      ?? 1,
      rooms:         rooms       ?? 1,
      results_count: resultsCount ?? null,
    });

    // Silently ignore if table doesn't exist (42P01 = undefined_table)
    if (error && !error.code?.includes("42P01")) {
      console.error("search_history insert error:", error.message);
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    // Never surface errors to the client — this is a background operation
    return NextResponse.json({ ok: false });
  }
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ searches: [] });

    const { data } = await supabase
      .from("search_history")
      .select("id, type, label, href, searched_at")
      .eq("user_id", user.id)
      .order("searched_at", { ascending: false })
      .limit(10);

    return NextResponse.json({ searches: data ?? [] });
  } catch {
    return NextResponse.json({ searches: [] });
  }
}
