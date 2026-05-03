"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { toast } from "sonner";
import { useSearchParams, useRouter } from "next/navigation";
import { saveSearch } from "@/lib/local-history";
import { FlightCardSkeleton, HotelCardSkeleton } from "@/components/skeletons";
import { Navigation } from "@/components/navigation";
import { SearchWidget } from "@/components/search-widget";
import { FlightCard } from "@/components/flight-card";
import { HotelCard } from "@/components/hotel-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plane, Hotel, SlidersHorizontal, X, ChevronDown,
  Loader2, Zap, Pencil, Calendar, Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

type SortOption = "cheapest" | "fastest" | "earliest";

/* ─── Compact sticky bar shown after user scrolls past the search form ─── */
function CompactSearchBar({
  type, from, to, depart, returnD, cabin, adults,
  dest, checkIn, checkOut, rooms,
  onModify,
}: {
  type: string; from: string; to: string; depart: string; returnD: string;
  cabin: string; adults: number; dest: string; checkIn: string;
  checkOut: string; rooms: number; onModify: () => void;
}) {
  function fmtDate(d: string) {
    if (!d) return "";
    const dt = new Date(d);
    return dt.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-white border-b border-stone/15 shadow-md">
      <div className="max-w-6xl mx-auto px-3 md:px-4 h-14 flex items-center gap-3">

        {type === "flight" ? (
          <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0 overflow-hidden">
            <Plane className="w-4 h-4 text-oxblood shrink-0" />
            <span className="font-bold text-ink text-sm md:text-base shrink-0">
              {from.toUpperCase()} → {to.toUpperCase()}
            </span>
            <span className="text-stone/60 hidden sm:block">|</span>
            <span className="text-stone text-xs md:text-sm shrink-0 hidden sm:block">
              <Calendar className="w-3.5 h-3.5 inline mr-1" />
              {fmtDate(depart)}{returnD ? ` – ${fmtDate(returnD)}` : ""}
            </span>
            <span className="text-stone/60 hidden md:block">|</span>
            <span className="text-stone text-xs shrink-0 hidden md:block">
              <Users className="w-3.5 h-3.5 inline mr-1" />
              {adults} Adult{adults > 1 ? "s" : ""} · {cabin}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0 overflow-hidden">
            <Hotel className="w-4 h-4 text-oxblood shrink-0" />
            <span className="font-bold text-ink text-sm md:text-base shrink-0">
              Hotels in {dest.toUpperCase()}
            </span>
            <span className="text-stone/60 hidden sm:block">|</span>
            <span className="text-stone text-xs md:text-sm shrink-0 hidden sm:block">
              <Calendar className="w-3.5 h-3.5 inline mr-1" />
              {fmtDate(checkIn)} – {fmtDate(checkOut)}
            </span>
            <span className="text-stone/60 hidden md:block">|</span>
            <span className="text-stone text-xs shrink-0 hidden md:block">
              <Users className="w-3.5 h-3.5 inline mr-1" />
              {adults} Adult{adults > 1 ? "s" : ""} · {rooms} Room{rooms > 1 ? "s" : ""}
            </span>
          </div>
        )}

        <button
          onClick={onModify}
          className="flex items-center gap-1.5 text-oxblood text-xs font-bold uppercase tracking-wider border border-oxblood/25 rounded-xl px-3 py-2 hover:bg-oxblood hover:text-white transition-all shrink-0"
        >
          <Pencil className="w-3 h-3" />
          <span className="hidden sm:inline">Modify</span>
        </button>
      </div>
    </div>
  );
}

/* ─── Main search results component ─── */
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

  /* ── Compact bar: show when search widget scrolls out of view ── */
  const searchRef   = useRef<HTMLDivElement>(null);
  const [isCompact, setIsCompact] = useState(false);

  const hasParams = (type === "flight" && !!(from && to && depart))
                 || (type === "hotel"  && !!(dest && checkIn && checkOut));

  useEffect(() => {
    if (!searchRef.current || !hasParams) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsCompact(!entry.isIntersecting),
      { threshold: 0, rootMargin: "-1px 0px 0px 0px" }
    );
    observer.observe(searchRef.current);
    return () => observer.disconnect();
  }, [hasParams]);

  function scrollToSearch() {
    searchRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function handleTrackPrice() {
    try {
      const r = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ origin: from, destination: to, target_price: 50000, type }),
      });
      const d = await r.json();
      if (d.success) toast.success("Price alert set! Odin is now tracking this route for you.");
      else if (d.error === "Unauthorized") toast.error("Please sign in to track prices.");
      else toast.error(d.error || "Failed to set price alert.");
    } catch (e) { 
      console.error(e); 
      toast.error("Something went wrong. Please try again.");
    }
  }

  // Reset scroll + compact state every time a new search is submitted
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    setIsCompact(false);
  }, [type, from, to, depart, dest, checkIn, checkOut]);

  // Save search to history once results are loaded (localStorage + Supabase)
  useEffect(() => {
    if (loading || !hasParams) return;

    let entry: { type: "flight" | "hotel"; label: string; href: string; payload?: object } | null = null;

    if (type === "flight" && from && to && depart) {
      entry = {
        type:  "flight",
        label: `${from.toUpperCase()} → ${to.toUpperCase()} · ${depart}${returnD ? ` – ${returnD}` : ""} · ${adults} Adult${adults > 1 ? "s" : ""} · ${cabin}`,
        href:  window.location.pathname + window.location.search,
        payload: { fromCode: from, toCode: to, departDate: depart, returnDate: returnD, cabin, adults, resultsCount: offers.length },
      };
    } else if (type === "hotel" && dest && checkIn && checkOut) {
      entry = {
        type:  "hotel",
        label: `Hotels in ${dest} · ${checkIn} – ${checkOut} · ${adults} Adult${adults > 1 ? "s" : ""}`,
        href:  window.location.pathname + window.location.search,
        payload: { destination: dest, checkIn, checkOut, adults, rooms, resultsCount: hotels.length },
      };
    }

    if (!entry) return;

    // 1. localStorage — instant, always works
    saveSearch({ type: entry.type, label: entry.label, href: entry.href });

    // 2. Supabase — cross-device sync, fire-and-forget
    fetch("/api/search/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: entry.type, label: entry.label, href: entry.href, ...entry.payload }),
    }).catch(() => {}); // silently ignore errors
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

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
      if (sort === "fastest")  return a.duration.localeCompare(b.duration);
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

      {/* ── Compact sticky bar (only after scrolling past search form) ── */}
      {isCompact && hasParams && (
        <CompactSearchBar
          type={type} from={from} to={to} depart={depart} returnD={returnD}
          cabin={cabin} adults={adults} dest={dest} checkIn={checkIn}
          checkOut={checkOut} rooms={rooms} onModify={scrollToSearch}
        />
      )}

      {/* ── Full search form — in normal flow, NOT sticky ── */}
      <div ref={searchRef} className="pt-20 bg-white border-b border-stone/10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <SearchWidget collapsible={hasParams} />
        </div>
      </div>

      {/* ── Results area — gets top padding when compact bar is showing ── */}
      <div className={cn("max-w-6xl mx-auto px-4 py-5 transition-all", isCompact && "pt-[72px]")}>

        {/* Route summary + sort bar */}
        {hasParams && (
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                {type === "flight"
                  ? <><Plane className="w-4 h-4 text-oxblood" /> {from.toUpperCase()} → {to.toUpperCase()} · {depart}</>
                  : <><Hotel className="w-4 h-4 text-oxblood" /> Hotels in {dest.toUpperCase()} · {checkIn} – {checkOut}</>
                }
              </div>
              {!loading && (
                <Badge className="bg-oxblood/10 text-oxblood border-transparent text-xs">
                  {resultCount} result{resultCount !== 1 ? "s" : ""}
                </Badge>
              )}
              {!loading && type === "flight" && (
                <button
                  onClick={handleTrackPrice}
                  className="text-[10px] uppercase tracking-widest font-bold text-[#C5A572] hover:bg-[#C5A572]/5 h-7 px-3 rounded-full border border-[#C5A572]/20 flex items-center gap-1.5"
                >
                  <Zap className="w-3 h-3" /> Track Prices
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden gap-1.5 border-stone/20 rounded-xl text-xs">
                <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
              </Button>
              <div className="flex bg-white border border-stone/15 rounded-xl p-0.5">
                {(["cheapest", "fastest", "earliest"] as SortOption[]).map((s) => (
                  <button key={s} onClick={() => setSort(s)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-all",
                      sort === s ? "bg-ink text-white shadow-sm" : "text-stone hover:text-ink"
                    )}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-5">
          {/* ── Filters sidebar ── */}
          {hasParams && (
            <aside className={cn(
              "w-56 shrink-0 space-y-3 hidden md:block",
              showFilters && "!block fixed inset-0 z-50 bg-white p-5 overflow-y-auto md:static md:inset-auto"
            )}>
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
                  <span>₹1,000</span>
                  <span>{type === "flight" ? "₹5,00,000" : "₹2,00,000"}</span>
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

              <button
                onClick={() => { setMaxPrice(500000); setStopFilter([]); setAirlineFilter([]); setStarFilter([]); }}
                className="text-xs text-oxblood hover:underline">
                Reset filters
              </button>
            </aside>
          )}

          {/* ── Results ── */}
          <div className="flex-1 min-w-0">

            {/* No params yet — prompt user to search */}
            {!hasParams && !loading && (
              <div className="text-center py-20 bg-white rounded-2xl border border-stone/10">
                <div className="text-5xl mb-4">{type === "flight" ? "✈️" : "🏨"}</div>
                <p className="font-display text-xl font-semibold text-ink mb-2">Fill in your search above</p>
                <p className="text-stone text-sm">Enter your {type === "flight" ? "origin, destination and travel dates" : "destination and check-in/out dates"} to see results.</p>
              </div>
            )}

            {loading && (
              <div className="space-y-4">
                {type === "flight" 
                  ? Array.from({ length: 5 }).map((_, i) => <FlightCardSkeleton key={i} />)
                  : Array.from({ length: 5 }).map((_, i) => <HotelCardSkeleton key={i} />)
                }
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

            {!loading && !error && hasParams && resultCount === 0 && (
              <div className="text-center py-20 bg-white rounded-2xl border border-stone/10">
                <div className="text-5xl mb-4">{type === "flight" ? "✈️" : "🏨"}</div>
                <p className="font-display text-xl font-semibold text-ink mb-2">No results found</p>
                <p className="text-stone text-sm">Try adjusting dates, route or filters.</p>
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
        {title}
        <ChevronDown className={cn("w-4 h-4 text-stone transition-transform", !open && "-rotate-90")} />
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
