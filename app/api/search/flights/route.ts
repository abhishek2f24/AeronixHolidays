export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getDuffel } from "@/lib/duffel";

export async function POST(req: Request) {
  const { from, to, depart, adults = 1 } = await req.json();

  // If Duffel isn't configured or user wants to test Indian data (which Duffel test lacks)
  // we return professional mock data for Indian routes
  if (!process.env.DUFFEL_ACCESS_TOKEN || process.env.DUFFEL_ACCESS_TOKEN.includes("placeholder")) {
    const mockFlights = [
      {
        id: "f1",
        airline: "IndiGo",
        logo: "https://www.goindigo.in/content/dam/goindigo/6e-logo/indigo_logo.png",
        flight_number: "6E-2034",
        departure: { time: "06:00", airport: from.toUpperCase() },
        arrival: { time: "08:15", airport: to.toUpperCase() },
        duration: "2h 15m",
        total_amount: 4250 * adults,
        stops: "Non-stop"
      },
      {
        id: "f2",
        airline: "Air India",
        logo: "https://www.airindia.in/images/airindia-logo.png",
        flight_number: "AI-805",
        departure: { time: "09:30", airport: from.toUpperCase() },
        arrival: { time: "11:50", airport: to.toUpperCase() },
        duration: "2h 20m",
        total_amount: 5100 * adults,
        stops: "Non-stop"
      },
      {
        id: "f3",
        airline: "Vistara",
        logo: "https://www.airvistara.com/content/dam/airvistara/global/english/common/logo/vistara-logo.png",
        flight_number: "UK-981",
        departure: { time: "18:45", airport: from.toUpperCase() },
        arrival: { time: "21:00", airport: to.toUpperCase() },
        duration: "2h 15m",
        total_amount: 6800 * adults,
        stops: "Non-stop"
      }
    ];

    // Simulate network delay
    await new Promise(r => setTimeout(r, 800));
    return NextResponse.json({ offers: mockFlights });
  }

  // Real Duffel logic
  try {
    const duffel = getDuffel();
    const offerRequest = await duffel.offerRequests.create({
      slices: [{ origin: from.toUpperCase(), destination: to.toUpperCase(), departure_date: depart }],
      passengers: Array.from({ length: adults }, () => ({ type: "adult" as const })),
      cabin_class: "economy",
    });

    const offers = offerRequest.data.offers?.slice(0, 20).map(o => ({
      id: o.id,
      airline: o.owner.name,
      total_amount: o.total_amount,
      // Simplify for UI
      departure: { time: o.slices[0].segments[0].departing_at.split("T")[1].slice(0,5), airport: from },
      arrival: { time: o.slices[0].segments[o.slices[0].segments.length-1].arriving_at.split("T")[1].slice(0,5), airport: to },
      duration: "Calculated",
      stops: o.slices[0].segments.length > 1 ? `${o.slices[0].segments.length - 1} Stop` : "Non-stop"
    })) ?? [];

    return NextResponse.json({ offers, requestId: offerRequest.data.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
