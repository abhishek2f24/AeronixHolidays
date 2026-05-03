"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { SearchWidget } from "@/components/search-widget";
import { FlightCard } from "@/components/flight-card";
import { HotelCard } from "@/components/hotel-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plane, Hotel, SlidersHorizontal, X, ChevronDown, Loader2, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

type SortOption = "cheapest" | "fastest" | "earliest";

function SearchResults() {
  const params    = useSearchParams();
  const type      = params.get("type")        ?? "flight";
  const from      = params.get("from")        ?? "";
  const to        = params.get("to")          ?? "";
  const depart    = params.get("depart")      ?? "";
  const returnD   = params.get("return")      ?? "";
  const cabin     = params.get("cabin")       ?? "Economy";
  const adults    = Number(params.get("adults")   ?? 1);
  const dest      = params.get("destination") ?? "";
  const checkIn   = params.get("checkIn")     ?? "";
  const checkOut  = params.get("checkOut")    ?? "";
  const rooms     = Number(params.get("rooms")    ?? 1);

  const [offers,        setOffers]        = useState<any[]>([]);
  const [hotels,        setHotels]        = useState<any[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState("");
  const [sort,          setSort]          = useState<SortOption>("cheapest");
  const [showFilters,   setShowFilters]   = useState(false);
  const [maxPrice,      setMaxPrice]      = useState(500000);
  const [stopFilter,    setStopFilter]    = useState<string[]>([]);
  const [airlineFilter, setAirlineFilter] = useState<string[]>([]);
  const [starFilter,    setStarFilter]    = useState<number[]>([]);

  async function handleTrackPrice() {
    try {
      const r = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ origin: from, destination: to, target_price: 50000, type }),
      });
      const d = await r.json();
      if (d.success) alert("Odin is now tracking this route for you.");
      else if (d.error === "Unauthorized") alert("Please sign in to track prices.");
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    if (type === "flight" && from && to && depart) fetchFlights();
    else if (type === "hotel" && dest && checkIn && checkOut) fetchHotels();
    else setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, from, to, depart, dest, checkIn, checkOut]);

  async function fetchFlights() {
    setLoading(true); setError("");
    try {
      const r = await fetch("/api/search/flights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from, to, depart, returnDate: returnD, cabin, adults }),
      });
      const d = await r.json();
      if (d.error) throw new Error(typeof d.error === "string" ? d.error : JSON.stringify(d.error));
      setOffers(d.offers ?? []);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }

  async function fetchHotels() {
    setLoading(true); setError("");
    try {
      const r = await fetch("/api/search/hotels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination: dest, checkIn, checkOut, adults, rooms }),
      });
      const d = await r.json();
      if (d.error) throw new Error(typeof d.error === "string" ? d.error : JSON.stringify(d.error));
      setHotels(d.hotels ?? []);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }

  const filteredFlights = offers
    .filter((o) => {
      if (o.total_amount > maxPrice) return false;
      if (stopFilter.length > 0 && !stopFilter.includes(o.stops)) return false;
      if (airlineFilter.length > 0 && !airlineFilter.includes(o.airline)) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === "cheapest") return a.total_amount - b.total_amount;
      if (sort === "fastest") return a.duration.localeCompare(b.duration);
      if (sort === "earliest") return a.departure.time.localeCompare(b.departure.time);
      return 0;
    });

  const filteredHotels = hotels
    .filter((h) => {
      if (h.price_per_night && h.price_per_night > maxPrice) return false;
      if (starFilter.length > 0 && !starFilter.includes(h.stars)) return false;
      return true;
    })
    .sort((a, b) => sort === "cheapest" ? (a.price_per_night ?? 0) - (b.price_per_night ?? 0) : 0);

  const airlineOptions = [...new Set(offers.map((o) => o.airline))];
  const stopOptions    = [...new Set(offers.map((o) => o.stops))];
  const resultCount    = type === "flight" ? filteredFlights.length : filteredHotels.length;

  const formatINR = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="min-h-screen bg-cream">
      <Navigation />
      {/* Sticky search bar */}
      <div className="pt-16 bg-white border-b border-stone/10 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <SearchWidget />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Route + sort */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm font-medium text-ink">
              {type === "flight"
                ? <Plane className="w-4 h-4 text-oxblood" />
                : <Hotel className="w-4 h-4 text-oxblood" />}
              {type === "flight"
                ? `${from.toUpperCase()} → ${to.toUpperCase()} · ${depart}`
                : `Hotels in ${dest.toUpperCase()} · ${checkIn} – ${checkOut}`}
            </div>
            {!loading && (
              <Badge className="bg-oxblood/10 text-oxblood border-transparent text-xs">
                {resultCount} result{resultCount !== 1 ? "s" : ""}
              </Badge>
            )}
            {!loading && type === "flight" && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleTrackPrice}
                className="text-[10px] uppercase tracking-widest font-bold text-[#C5A572] hover:bg-[#C5A572]/5 h-7 px-3 rounded-full border border-[#C5A572]/20"
              >
                <Zap className="w-3 h-3 mr-1.5" /> Track Prices
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}
              className="md:hidden gap-1.5 border-stone/20 rounded-xl text-xs">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
            </Button>
            <div className="flex bg-white border border-stone/15 rounded-xl p-0.5">
              {(["cheapest", "fastest", "earliest"] as SortOption[]).map((s) => (
                <button key={s} onClick={() => setSort(s)}
                  className={cn("px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-all",
                    sort === s ? "bg-ink text-white shadow-sm" : "text-stone hover:text-ink")}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-5">
          {/* Filters sidebar */}
          <aside className={cn("w-60 shrink-0 space-y-4 hidden md:block",
            showFilters && "!block fixed inset-0 z-50 bg-white p-5 overflow-y-auto")}>
            {showFilters && (
              <div className="flex items-center justify-between mb-4 md:hidden">
                <p className="font-semibold text-ink">Filters</p>
                <button onClick={() => setShowFilters(false)}><X className="w-5 h-5" /></button>
              </div>
            )}

            <FilterBox title="Max price">
              <p className="text-oxblood font-semibold text-sm mb-2">{formatINR(maxPrice)}</p>
              <input type="range" min={1000} max={type === "flight" ? 500000 : 200000}
                step={500} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-oxblood" />
              <div className="flex justify-between text-[10px] text-stone mt-0.5">
                <span>₹1,000</span><span>{type === "flight" ? "₹5,00,000" : "₹2,00,000"}</span>
              </div>
            </FilterBox>

            {type === "flight" && stopOptions.length > 0 && (
              <FilterBox title="Stops">
                {stopOptions.map((s) => (
                  <CheckRow key={s} label={s} checked={stopFilter.includes(s)}
                    onChange={(v) => setStopFilter(v ? [...stopFilter, s] : stopFilter.filter((x) => x !== s))} />
                ))}
              </FilterBox>
            )}

            {type === "flight" && airlineOptions.length > 0 && (
              <FilterBox title="Airlines">
                {airlineOptions.map((a) => (
                  <CheckRow key={a} label={a} checked={airlineFilter.includes(a)}
                    onChange={(v) => setAirlineFilter(v ? [...airlineFilter, a] : airlineFilter.filter((x) => x !== a))} />
                ))}
              </FilterBox>
            )}

            {type === "hotel" && (
              <FilterBox title="Star rating">
                {[5, 4, 3, 2].map((s) => (
                  <CheckRow key={s} label={`${s} Star`} checked={starFilter.includes(s)}
                    onChange={(v) => setStarFilter(v ? [...starFilter, s] : starFilter.filter((x) => x !== s))} />
                ))}
              </FilterBox>
            )}

            <button onClick={() => { setMaxPrice(500000); setStopFilter([]); setAirlineFilter([]); setStarFilter([]); }}
              className="text-xs text-oxblood hover:underline">
              Reset filters
            </button>
          </aside>

          {/* Results */}
          <div className="flex-1 min-w-0">
            {loading && (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-stone/10 p-5 animate-pulse">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-stone/10 rounded-xl" />
                      <div className="flex-1 space-y-2">
                        <div className="h-5 bg-stone/10 rounded w-1/3" />
                        <div className="h-3 bg-stone/8 rounded w-1/5" />
                      </div>
                      <div className="space-y-2 text-right">
                        <div className="h-6 bg-stone/10 rounded w-24" />
                        <div className="h-9 bg-stone/10 rounded-xl w-20" />
                      </div>
                    </div>
                  </div>
                ))}
                <p className="text-center text-stone text-xs flex items-center justify-center gap-2 pt-1">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  {type === "flight"
                    ? "Checking live fares from IndiGo, Air India, Vistara, SpiceJet…"
                    : "Finding the best hotels at your destination…"}
                </p>
              </div>
            )}

            {!loading && error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                <p className="text-red-700 font-semibold text-sm mb-1">Search unavailable</p>
                <p className="text-red-600 text-xs mb-4 max-w-md mx-auto">{error}</p>
                <Button size="sm" variant="outline" className="border-red-200 text-red-600 text-xs"
                  onClick={() => type === "flight" ? fetchFlights() : fetchHotels()}>
                  Try again
                </Button>
              </div>
            )}

            {!loading && !error && resultCount === 0 && (
              <div className="text-center py-20 bg-white rounded-2xl border border-stone/10">
                <div className="text-5xl mb-4">{type === "flight" ? "✈️" : "🏨"}</div>
                <p className="font-display text-xl font-semibold text-ink mb-2">No results found</p>
                <p className="text-stone text-sm">Try adjusting your dates, route or removing filters.</p>
              </div>
            )}

            {!loading && !error && type === "flight" && filteredFlights.length > 0 && (
              <div className="space-y-3">
                {filteredFlights.map((o) => <FlightCard key={o.id} offer={o} adults={adults} />)}
              </div>
            )}

            {!loading && !error && type === "hotel" && filteredHotels.length > 0 && (
              <div className="space-y-4">
                {filteredHotels.map((h) => (
                  <HotelCard key={h.id} hotel={h} checkIn={checkIn} checkOut={checkOut} adults={adults} rooms={rooms} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterBox({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-white rounded-xl border border-stone/10 overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-ink">
        {title} <ChevronDown className={cn("w-4 h-4 text-stone transition-transform", !open && "-rotate-90")} />
      </button>
      {open && <div className="px-4 pb-4 space-y-2">{children}</div>}
    </div>
  );
}

function CheckRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)}
        className="w-3.5 h-3.5 accent-oxblood" />
      <span className="text-xs text-stone group-hover:text-ink transition-colors">{label}</span>
    </label>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-oxblood animate-spin" />
      </div>
    }>
      <SearchResults />
    </Suspense>
  );
}
