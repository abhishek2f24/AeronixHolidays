export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getAmadeus, formatDuration, formatTime, AIRLINE_NAMES } from "@/lib/amadeus";

/* ── Normalise a raw Amadeus flight offer into our UI shape ── */
function normaliseOffer(o: any) {
  const itinerary  = o.itineraries[0];
  const segments   = itinerary.segments;
  const firstSeg   = segments[0];
  const lastSeg    = segments[segments.length - 1];
  const carrierCode = firstSeg.carrierCode;
  const flightNo   = `${carrierCode}-${firstSeg.number}`;

  return {
    id:             o.id,
    offer_token:    o.id,                              // used for fare lock / booking
    carrier_code:   carrierCode,
    airline:        AIRLINE_NAMES[carrierCode] ?? carrierCode,
    flight_number:  flightNo,
    departure: {
      time:    formatTime(firstSeg.departure.at),
      airport: firstSeg.departure.iataCode,
      terminal:firstSeg.departure.terminal ?? null,
      date:    firstSeg.departure.at.split("T")[0],
    },
    arrival: {
      time:    formatTime(lastSeg.arrival.at),
      airport: lastSeg.arrival.iataCode,
      terminal:lastSeg.arrival.terminal ?? null,
      date:    lastSeg.arrival.at.split("T")[0],
    },
    duration:       formatDuration(itinerary.duration),
    stops:          segments.length === 1 ? "Non-stop" : `${segments.length - 1} stop${segments.length > 2 ? "s" : ""}`,
    stop_airports:  segments.length > 1
                    ? segments.slice(0, -1).map((s: any) => s.arrival.iataCode)
                    : [],
    total_amount:   Number(o.price.grandTotal),
    currency:       o.price.currency,
    cabin:          o.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin ?? "ECONOMY",
    bags_included:  o.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.includedCheckedBags?.quantity ?? 0,
    is_refundable:  false,                             // enrich later if needed
    raw:            o,                                 // keep full offer for booking step
  };
}

export async function POST(req: Request) {
  const {
    from,
    to,
    depart,
    returnDate,
    cabin    = "ECONOMY",
    adults   = 1,
    children = 0,
    infants  = 0,
    nonStop  = false,
  } = await req.json();

  if (!from || !to || !depart) {
    return NextResponse.json({ error: "from, to, depart are required" }, { status: 400 });
  }

  /* ── Fallback to rich mock data when Amadeus is not yet configured ── */
  const hasAmadeus = process.env.AMADEUS_CLIENT_ID && !process.env.AMADEUS_CLIENT_ID.includes("placeholder");

  if (!hasAmadeus) {
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json({
      offers: buildMockOffers(from.toUpperCase(), to.toUpperCase(), adults),
      source: "mock",
    });
  }

  try {
    const amadeus = getAmadeus();

    const params: Record<string, any> = {
      originLocationCode:      from.toUpperCase(),
      destinationLocationCode: to.toUpperCase(),
      departureDate:           depart,
      adults,
      currencyCode:            "INR",
      max:                     25,
      nonStop,
      travelClass:             cabin,
    };
    if (children > 0)  params.children  = children;
    if (infants  > 0)  params.infants   = infants;
    if (returnDate)    params.returnDate = returnDate;

    const response = await amadeus.shopping.flightOffersSearch.get(params);
    const offers   = (response.data ?? []).map(normaliseOffer);

    return NextResponse.json({ offers, source: "amadeus" });
  } catch (err: any) {
    // Surface Amadeus error body for easier debugging
    const detail = err.response?.result?.errors ?? err.message;
    return NextResponse.json({ error: detail }, { status: 502 });
  }
}

/* ── Rich mock with real Indian airline data ── */
function buildMockOffers(from: string, to: string, adults: number) {
  const base = [
    {
      id: "mock-6E-2034", offer_token: "mock-6E-2034",
      carrier_code: "6E", airline: "IndiGo", flight_number: "6E-2034",
      departure: { time: "06:00", airport: from, terminal: "2", date: "" },
      arrival:   { time: "08:15", airport: to,   terminal: "1", date: "" },
      duration: "2h 15m", stops: "Non-stop", stop_airports: [],
      total_amount: 4250 * adults, currency: "INR", cabin: "ECONOMY",
      bags_included: 0, is_refundable: false, raw: null,
    },
    {
      id: "mock-AI-805", offer_token: "mock-AI-805",
      carrier_code: "AI", airline: "Air India", flight_number: "AI-805",
      departure: { time: "09:30", airport: from, terminal: "3", date: "" },
      arrival:   { time: "11:50", airport: to,   terminal: "2", date: "" },
      duration: "2h 20m", stops: "Non-stop", stop_airports: [],
      total_amount: 5100 * adults, currency: "INR", cabin: "ECONOMY",
      bags_included: 1, is_refundable: true, raw: null,
    },
    {
      id: "mock-UK-981", offer_token: "mock-UK-981",
      carrier_code: "UK", airline: "Vistara", flight_number: "UK-981",
      departure: { time: "18:45", airport: from, terminal: "2", date: "" },
      arrival:   { time: "21:00", airport: to,   terminal: "1", date: "" },
      duration: "2h 15m", stops: "Non-stop", stop_airports: [],
      total_amount: 6800 * adults, currency: "INR", cabin: "ECONOMY",
      bags_included: 1, is_refundable: false, raw: null,
    },
    {
      id: "mock-SG-143", offer_token: "mock-SG-143",
      carrier_code: "SG", airline: "SpiceJet", flight_number: "SG-143",
      departure: { time: "05:15", airport: from, terminal: "1", date: "" },
      arrival:   { time: "07:35", airport: to,   terminal: "1", date: "" },
      duration: "2h 20m", stops: "Non-stop", stop_airports: [],
      total_amount: 3900 * adults, currency: "INR", cabin: "ECONOMY",
      bags_included: 0, is_refundable: false, raw: null,
    },
    {
      id: "mock-AI-805-bc", offer_token: "mock-AI-805-bc",
      carrier_code: "AI", airline: "Air India", flight_number: "AI-805",
      departure: { time: "09:30", airport: from, terminal: "3", date: "" },
      arrival:   { time: "11:50", airport: to,   terminal: "2", date: "" },
      duration: "2h 20m", stops: "Non-stop", stop_airports: [],
      total_amount: 18500 * adults, currency: "INR", cabin: "BUSINESS",
      bags_included: 2, is_refundable: true, raw: null,
    },
  ];
  return base;
}
