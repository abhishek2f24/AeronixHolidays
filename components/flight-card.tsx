"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Luggage, Lock, ChevronDown, ArrowRight, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Airline logo map — Indian carriers first ── */
const AIRLINE_LOGOS: Record<string, string> = {
  "6E": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/IndiGo_Airlines_logo.svg/120px-IndiGo_Airlines_logo.svg.png",
  AI:   "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Air_India_logo.svg/120px-Air_India_logo.svg.png",
  UK:   "https://upload.wikimedia.org/wikipedia/en/thumb/9/9f/Vistara_Logo.svg/120px-Vistara_Logo.svg.png",
  SG:   "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/SpiceJet_logo.svg/120px-SpiceJet_logo.svg.png",
  G8:   "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Go_First_Logo.png/120px-Go_First_Logo.png",
  I5:   "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/AirAsia_India_Logo.png/120px-AirAsia_India_Logo.png",
  QP:   "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Akasa_Air_logo.svg/120px-Akasa_Air_logo.svg.png",
  EK:   "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Emirates_logo.svg/120px-Emirates_logo.svg.png",
  QR:   "https://upload.wikimedia.org/wikipedia/en/thumb/9/9b/Qatar_Airways_Logo.svg/120px-Qatar_Airways_Logo.svg.png",
  SQ:   "https://upload.wikimedia.org/wikipedia/en/thumb/0/0a/Singapore_Airlines_Logo_2.svg/120px-Singapore_Airlines_Logo_2.svg.png",
};

const CABIN_LABELS: Record<string, string> = {
  ECONOMY: "Economy", PREMIUM_ECONOMY: "Prem. Economy",
  BUSINESS: "Business", FIRST: "First Class",
};

const BOARD_COLORS: Record<string, string> = {
  BREAKFAST: "bg-amber-50 text-amber-700 border-amber-200",
  HALF_BOARD: "bg-blue-50 text-blue-700 border-blue-200",
  FULL_BOARD: "bg-green-50 text-green-700 border-green-200",
  ROOM_ONLY:  "bg-stone/10 text-stone border-stone/20",
};

export function FlightCard({ offer, adults = 1 }: { offer: any; adults?: number }) {
  const router  = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [locking,  setLocking]  = useState(false);
  const [locked,   setLocked]   = useState(false);

  const formatINR = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  async function handleFareLock() {
    setLocking(true);
    try {
      const res = await fetch("/api/bookings/fare-lock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offer_token: offer.offer_token, price: offer.total_amount }),
      });
      if (res.ok) {
        setLocked(true);
      } else {
        const d = await res.json();
        alert(d.error === "Unauthorized" ? "Sign in to lock a fare." : "Could not lock fare. Please try again.");
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setLocking(false);
    }
  }

  function handleBook() {
    // Use today's date as fallback when mock data has empty date
    const departDate = offer.departure.date || new Date().toISOString().split("T")[0];
    const skyscannerDate = departDate.replace(/-/g, "");
    const searchUrl = `https://www.skyscanner.co.in/transport/flights/${offer.departure.airport.toLowerCase()}/${offer.arrival.airport.toLowerCase()}/${skyscannerDate}/?adults=${adults}&cabinclass=${offer.cabin.toLowerCase()}`;
    router.push(`/redirect?type=flight&name=${offer.airline}&url=${encodeURIComponent(searchUrl)}`);
  }

  const logoSrc = AIRLINE_LOGOS[offer.carrier_code];

  return (
    <div className={cn(
      "bg-white rounded-2xl border transition-shadow",
      expanded ? "border-oxblood/30 shadow-md" : "border-stone/10 hover:shadow-sm"
    )}>
      {/* ── Main row ── */}
      <div className="p-5 flex flex-wrap items-center gap-4">
        {/* Airline logo + name */}
        <div className="w-14 flex flex-col items-center gap-1.5 shrink-0">
          {logoSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoSrc}
              alt={offer.airline}
              className="h-8 w-14 object-contain"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-oxblood/10 flex items-center justify-center">
              <span className="text-oxblood font-bold text-sm">{offer.carrier_code}</span>
            </div>
          )}
          <span className="text-[10px] text-stone text-center leading-tight">{offer.flight_number}</span>
        </div>

        {/* Departure */}
        <div className="text-center min-w-[70px]">
          <p className="font-display text-2xl font-semibold text-ink leading-none">{offer.departure.time}</p>
          <p className="text-xs font-semibold text-stone mt-0.5">{offer.departure.airport}</p>
          {offer.departure.terminal && (
            <p className="text-[10px] text-stone/60">T{offer.departure.terminal}</p>
          )}
        </div>

        {/* Duration + stops */}
        <div className="flex-1 flex flex-col items-center gap-1 min-w-[100px]">
          <p className="text-[10px] text-stone">{offer.duration}</p>
          <div className="w-full flex items-center gap-1">
            <div className="flex-1 h-px bg-stone/20" />
            {offer.stop_airports.map((a: string) => (
              <div key={a} className="w-1.5 h-1.5 rounded-full bg-stone/40" />
            ))}
            <div className="flex-1 h-px bg-stone/20" />
          </div>
          <Badge className={cn(
            "text-[10px] border",
            offer.stops === "Non-stop"
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-amber-50 text-amber-700 border-amber-200"
          )}>
            {offer.stops}
          </Badge>
        </div>

        {/* Arrival */}
        <div className="text-center min-w-[70px]">
          <p className="font-display text-2xl font-semibold text-ink leading-none">{offer.arrival.time}</p>
          <p className="text-xs font-semibold text-stone mt-0.5">{offer.arrival.airport}</p>
          {offer.arrival.terminal && (
            <p className="text-[10px] text-stone/60">T{offer.arrival.terminal}</p>
          )}
        </div>

        {/* Tags */}
        <div className="hidden sm:flex flex-col gap-1.5 items-start">
          <Badge className="text-[10px] bg-stone/8 text-stone border-transparent">
            {CABIN_LABELS[offer.cabin] ?? offer.cabin}
          </Badge>
          {offer.bags_included > 0 ? (
            <Badge className="text-[10px] bg-blue-50 text-blue-700 border-blue-200">
              <Luggage className="w-2.5 h-2.5 mr-1" />
              {offer.bags_included} bag free
            </Badge>
          ) : (
            <Badge className="text-[10px] bg-stone/8 text-stone/60 border-transparent">Cabin only</Badge>
          )}
          {offer.is_refundable && (
            <Badge className="text-[10px] bg-green-50 text-green-700 border-green-200">Refundable</Badge>
          )}
        </div>

        {/* Price + actions */}
        <div className="ml-auto text-right flex flex-col items-end gap-2">
          <div>
            <p className="font-display text-2xl font-bold text-ink leading-none">
              {formatINR(offer.total_amount)}
            </p>
            {adults > 1 && (
              <p className="text-[10px] text-stone">
                {formatINR(offer.total_amount / adults)}/person
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!locked ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleFareLock}
                disabled={locking}
                className="text-xs h-8 rounded-lg border-stone/20 gap-1.5 text-stone hover:border-oxblood hover:text-oxblood"
              >
                <Lock className="w-3 h-3" />
                {locking ? "Locking…" : "Hold ₹99"}
              </Button>
            ) : (
              <Badge className="bg-green-50 text-green-700 border-green-200 text-xs">✓ Price locked</Badge>
            )}
            <Button
              size="sm"
              onClick={handleBook}
              className="bg-oxblood hover:bg-oxblood/90 text-white rounded-xl h-9 px-5 text-sm font-medium"
            >
              Book
            </Button>
          </div>
        </div>
      </div>

      {/* ── Expand toggle ── */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 pb-3 flex items-center gap-1.5 text-xs text-stone hover:text-ink transition-colors"
      >
        <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", expanded && "rotate-180")} />
        {expanded ? "Hide details" : "Flight details"}
      </button>

      {/* ── Expanded: fare rules + details ── */}
      {expanded && (
        <div className="px-5 pb-5 border-t border-stone/8 pt-4">
          <div className="grid sm:grid-cols-3 gap-4 text-xs text-stone">
            <div>
              <p className="font-semibold text-ink mb-1.5">Baggage</p>
              <p>Cabin: 7 kg included</p>
              <p>Check-in: {offer.bags_included > 0 ? `${offer.bags_included} × 15 kg free` : "Not included — add at checkout"}</p>
            </div>
            <div>
              <p className="font-semibold text-ink mb-1.5">Cancellation</p>
              <p>{offer.is_refundable ? "Free cancellation within 24h" : "Non-refundable fare"}</p>
              <p className="text-stone/60 mt-0.5">Date change fee may apply</p>
            </div>
            <div>
              <p className="font-semibold text-ink mb-1.5">Fare class</p>
              <p>{CABIN_LABELS[offer.cabin] ?? offer.cabin}</p>
              <p className="text-stone/60 mt-0.5">Operated by {offer.airline}</p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <Button
              onClick={handleBook}
              className="bg-oxblood hover:bg-oxblood/90 text-white rounded-xl h-10 px-8 font-medium gap-2"
            >
              Book this flight <ArrowRight className="w-4 h-4" />
            </Button>
            <p className="text-xs text-stone">No hidden fees · Pay in full or via EMI</p>
          </div>
        </div>
      )}
    </div>
  );
}
