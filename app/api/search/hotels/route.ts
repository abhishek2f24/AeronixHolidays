export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getAmadeus } from "@/lib/amadeus";

function normaliseHotel(h: any) {
  const offer = h.offers?.[0];
  const hotel = h.hotel;
  return {
    id:              hotel.hotelId,
    name:            hotel.name,
    city:            hotel.cityCode,
    latitude:        hotel.latitude ?? null,
    longitude:       hotel.longitude ?? null,
    stars:           hotel.rating ?? null,
    chain:           hotel.chainCode ?? null,
    address:         hotel.address?.lines?.join(", ") ?? "",
    amenities:       hotel.amenities ?? [],
    media:           hotel.media?.[0]?.uri ?? null,
    offer_id:        offer?.id ?? null,
    room_type:       offer?.room?.typeEstimated?.category ?? "STANDARD",
    room_beds:       offer?.room?.typeEstimated?.bedType ?? null,
    check_in:        offer?.checkInDate ?? null,
    check_out:       offer?.checkOutDate ?? null,
    price_per_night: offer ? Number(offer.price.total) : null,
    currency:        offer?.price.currency ?? "INR",
    board_type:      offer?.boardType ?? "ROOM_ONLY",
    is_refundable:   offer?.policies?.cancellations?.[0]?.type === "FULL_CREDIT",
    raw_offer:       offer ?? null,
  };
}

export async function POST(req: Request) {
  const { destination, checkIn, checkOut, adults = 2, rooms = 1 } = await req.json();

  if (!destination || !checkIn || !checkOut) {
    return NextResponse.json({ error: "destination, checkIn, checkOut are required" }, { status: 400 });
  }

  const hasAmadeus = process.env.AMADEUS_CLIENT_ID && !process.env.AMADEUS_CLIENT_ID.includes("placeholder");

  if (!hasAmadeus) {
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json({ hotels: buildMockHotels(destination), source: "mock" });
  }

  try {
    const amadeus  = getAmadeus();
    const cityCode = destination.toUpperCase().slice(0, 3);

    const listResp = await amadeus.referenceData.locations.hotels.byCity.get({
      cityCode, radius: 20, radiusUnit: "KM", hotelSource: "ALL",
    });

    const hotelIds: string[] = (listResp.data ?? []).slice(0, 30).map((h: any) => h.hotelId);
    if (hotelIds.length === 0) return NextResponse.json({ hotels: [], source: "amadeus" });

    const offersResp = await amadeus.shopping.hotelOffersSearch.get({
      hotelIds: hotelIds.join(","), adults, checkInDate: checkIn,
      checkOutDate: checkOut, roomQuantity: rooms, currency: "INR", bestRateOnly: true,
    });

    return NextResponse.json({ hotels: (offersResp.data ?? []).map(normaliseHotel), source: "amadeus" });
  } catch (err: any) {
    return NextResponse.json({ error: err.response?.result?.errors ?? err.message }, { status: 502 });
  }
}

function buildMockHotels(dest: string) {
  return [
    {
      id: "HLDEL001", name: "The Leela Palace New Delhi", city: dest, stars: 5, chain: "Leela",
      address: "Diplomatic Enclave, Chanakyapuri, New Delhi",
      amenities: ["SWIMMING_POOL", "SPA", "RESTAURANT", "WIFI"],
      media: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
      offer_id: "mock-offer-1", room_type: "DELUXE", room_beds: "KING",
      check_in: null, check_out: null, price_per_night: 28000, currency: "INR",
      board_type: "BREAKFAST", is_refundable: true, raw_offer: null,
    },
    {
      id: "HLDEL002", name: "The Oberoi, New Delhi", city: dest, stars: 5, chain: "Oberoi",
      address: "Dr. Zakir Hussain Marg, New Delhi",
      amenities: ["SWIMMING_POOL", "SPA", "FITNESS_CENTER", "RESTAURANT", "WIFI"],
      media: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80",
      offer_id: "mock-offer-2", room_type: "PREMIER", room_beds: "KING",
      check_in: null, check_out: null, price_per_night: 32000, currency: "INR",
      board_type: "BREAKFAST", is_refundable: true, raw_offer: null,
    },
    {
      id: "HLDEL003", name: "Hyatt Regency Delhi", city: dest, stars: 5, chain: "Hyatt",
      address: "Bhikaiji Cama Place, Ring Road, New Delhi",
      amenities: ["SWIMMING_POOL", "FITNESS_CENTER", "RESTAURANT", "WIFI"],
      media: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80",
      offer_id: "mock-offer-3", room_type: "STANDARD", room_beds: "DOUBLE",
      check_in: null, check_out: null, price_per_night: 15000, currency: "INR",
      board_type: "ROOM_ONLY", is_refundable: false, raw_offer: null,
    },
    {
      id: "HLDEL004", name: "ibis New Delhi Aerocity", city: dest, stars: 3, chain: "ibis",
      address: "Aerocity, New Delhi", amenities: ["RESTAURANT", "WIFI", "FITNESS_CENTER"],
      media: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80",
      offer_id: "mock-offer-4", room_type: "STANDARD", room_beds: "DOUBLE",
      check_in: null, check_out: null, price_per_night: 5500, currency: "INR",
      board_type: "ROOM_ONLY", is_refundable: true, raw_offer: null,
    },
    {
      id: "HLDEL005", name: "JW Marriott Hotel New Delhi Aerocity", city: dest, stars: 5, chain: "Marriott",
      address: "Aerocity, IGI Airport, New Delhi",
      amenities: ["SWIMMING_POOL", "SPA", "FITNESS_CENTER", "RESTAURANT", "WIFI"],
      media: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&q=80",
      offer_id: "mock-offer-5", room_type: "DELUXE", room_beds: "KING",
      check_in: null, check_out: null, price_per_night: 22000, currency: "INR",
      board_type: "BREAKFAST", is_refundable: true, raw_offer: null,
    },
  ];
}
