"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Wifi, Coffee, Dumbbell, Waves, ArrowRight } from "lucide-react";

const AMENITY_ICONS: Record<string, React.ElementType> = {
  WIFI:           Wifi,
  SWIMMING_POOL:  Waves,
  FITNESS_CENTER: Dumbbell,
  RESTAURANT:     Coffee,
};

const AMENITY_LABELS: Record<string, string> = {
  WIFI: "Wi-Fi", SWIMMING_POOL: "Pool", FITNESS_CENTER: "Gym",
  RESTAURANT: "Restaurant", SPA: "Spa", BAR: "Bar", LOUNGE: "Lounge",
  CONCIERGE: "Concierge", PARKING: "Parking",
};

const BOARD_LABELS: Record<string, string> = {
  BREAKFAST: "Breakfast included",
  HALF_BOARD: "Half board",
  FULL_BOARD: "Full board",
  ROOM_ONLY: "Room only",
};

export function HotelCard({
  hotel, checkIn, checkOut, adults, rooms,
}: {
  hotel:    any;
  checkIn:  string;
  checkOut: string;
  adults:   number;
  rooms:    number;
}) {
  const router = useRouter();

  const formatINR = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  const nights = checkIn && checkOut
    ? Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000)
    : null;

  const totalPrice = hotel.price_per_night && nights ? hotel.price_per_night * nights * rooms : null;

  const topAmenities = (hotel.amenities ?? []).slice(0, 4);

  function handleBook() {
    const searchUrl = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(hotel.name)}&checkin=${checkIn}&checkout=${checkOut}&group_adults=${adults}&no_rooms=${rooms}`;
    router.push(`/redirect?type=hotel&name=${hotel.name}&url=${encodeURIComponent(searchUrl)}`);
  }

  return (
    <div className="bg-white rounded-2xl border border-stone/10 hover:shadow-md transition-shadow overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        {/* Hotel image */}
        <div className="sm:w-52 h-44 sm:h-auto shrink-0 relative overflow-hidden">
          {hotel.media ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={hotel.media}
              alt={hotel.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-ivory flex items-center justify-center">
              <span className="text-4xl">🏨</span>
            </div>
          )}
          {hotel.stars && (
            <div className="absolute top-3 left-3 flex gap-0.5">
              {Array.from({ length: Math.min(hotel.stars, 5) }).map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-gold text-gold" />
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-5 flex flex-col">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="min-w-0">
              <h3 className="font-display text-xl font-semibold text-ink leading-tight">{hotel.name}</h3>
              {hotel.chain && (
                <p className="text-xs text-stone/60 mt-0.5">{hotel.chain} collection</p>
              )}
            </div>
            {hotel.is_refundable && (
              <Badge className="shrink-0 bg-green-50 text-green-700 border-green-200 text-xs whitespace-nowrap">Free cancellation</Badge>
            )}
          </div>

          {/* Address */}
          <div className="flex items-start gap-1.5 mb-3">
            <MapPin className="w-3.5 h-3.5 text-stone shrink-0 mt-0.5" />
            <p className="text-xs text-stone leading-tight">{hotel.address || hotel.city}</p>
          </div>

          {/* Amenities */}
          {topAmenities.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {topAmenities.map((a: string) => {
                const Icon  = AMENITY_ICONS[a];
                const label = AMENITY_LABELS[a] ?? a.replace(/_/g, " ").toLowerCase();
                return (
                  <span key={a} className="flex items-center gap-1 text-[10px] text-stone bg-ivory px-2 py-0.5 rounded-full">
                    {Icon && <Icon className="w-2.5 h-2.5" />}
                    {label}
                  </span>
                );
              })}
            </div>
          )}

          {/* Room info */}
          {hotel.room_type && (
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-stone/8 text-stone border-transparent text-[10px] capitalize">
                {hotel.room_type.replace(/_/g, " ").toLowerCase()}
              </Badge>
              {hotel.room_beds && (
                <Badge className="bg-stone/8 text-stone border-transparent text-[10px] capitalize">
                  {hotel.room_beds.replace(/_/g, " ").toLowerCase()} bed
                </Badge>
              )}
              {hotel.board_type && (
                <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-[10px]">
                  {BOARD_LABELS[hotel.board_type] ?? hotel.board_type}
                </Badge>
              )}
            </div>
          )}

          {/* Price + book */}
          <div className="mt-auto flex items-end justify-between">
            <div>
              {hotel.price_per_night ? (
                <>
                  <p className="font-display text-2xl font-bold text-ink leading-none">
                    {formatINR(hotel.price_per_night)}
                    <span className="text-sm font-normal text-stone">/night</span>
                  </p>
                  {totalPrice && (
                    <p className="text-xs text-stone mt-0.5">
                      {formatINR(totalPrice)} total · {nights} night{nights !== 1 ? "s" : ""} · {rooms} room{rooms > 1 ? "s" : ""}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-sm text-stone">Price on request</p>
              )}
            </div>
            <Button
              onClick={handleBook}
              className="bg-oxblood hover:bg-oxblood/90 text-white rounded-xl h-10 px-6 font-medium gap-2"
            >
              Select room <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
