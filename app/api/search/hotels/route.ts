export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { destination, checkIn, checkOut, rooms = 1, guests = 1 } = await req.json();

  // Mock hotel data
  const hotels = [
    {
      id: "h1",
      name: "The Oberoi",
      location: destination || "New Delhi",
      price: 18500,
      rating: 4.9,
      img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80",
      description: "Legendary service in the heart of the city.",
      amenities: ["Free WiFi", "Pool", "Spa", "Airport Transfer"]
    },
    {
      id: "h2",
      name: "Taj Palace",
      location: destination || "New Delhi",
      price: 15200,
      rating: 4.8,
      img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
      description: "Majestic luxury with world-class dining.",
      amenities: ["Free WiFi", "Gym", "Lounge", "Valet Parking"]
    },
    {
      id: "h3",
      name: "Leela Palace",
      location: destination || "New Delhi",
      price: 21000,
      rating: 5.0,
      img: "https://images.unsplash.com/photo-1551882547-ff43c63faf76?w=600&q=80",
      description: "Opulence and grandeur at its finest.",
      amenities: ["Free WiFi", "Butler Service", "Rooftop Pool"]
    }
  ];

  // Simulate network delay
  await new Promise(r => setTimeout(r, 800));

  return NextResponse.json({ hotels });
}
