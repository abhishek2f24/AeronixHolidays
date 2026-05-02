export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getDuffel } from "@/lib/duffel";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { from, to, depart, returnDate, cabin = "economy", adults = 1 } = await req.json();

  const slices: any[] = [{ origin: from.toUpperCase(), destination: to.toUpperCase(), departure_date: depart }];
  if (returnDate) slices.push({ origin: to.toUpperCase(), destination: from.toUpperCase(), departure_date: returnDate });

  const passengers = Array.from({ length: adults }, () => ({ type: "adult" as const }));

  try {
    const duffel = getDuffel();
    const offerRequest = await duffel.offerRequests.create({
      slices,
      passengers,
      cabin_class: cabin as "economy" | "premium_economy" | "business" | "first",
    });

    const offers = offerRequest.data.offers?.slice(0, 20) ?? [];

    return NextResponse.json({ offers, requestId: offerRequest.data.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
