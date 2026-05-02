"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plane, Hotel, Clock, ArrowRight, Filter, ChevronDown, Loader2 } from "lucide-react";

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const type = searchParams.get("type") || "flight";
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const depart = searchParams.get("depart");
  const adults = searchParams.get("adults") || "1";

  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    async function fetchResults() {
      setLoading(true);
      try {
        if (type === "flight") {
          const res = await fetch("/api/search/flights", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ from, to, depart, adults: parseInt(adults) }),
          });
          const data = await res.json();
          setResults(data.offers || []);
        } else {
          const res = await fetch("/api/search/hotels", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              destination: searchParams.get("destination"),
              checkIn: searchParams.get("checkIn"),
              checkOut: searchParams.get("checkOut"),
              rooms: parseInt(searchParams.get("rooms") || "1"),
              guests: parseInt(searchParams.get("guests") || "1")
            }),
          });
          const data = await res.json();
          setResults(data.hotels || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, [type, from, to, depart, adults]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header / Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-stone/10">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink mb-1 flex items-center gap-2">
            {type === "flight" ? <Plane className="w-6 h-6" /> : <Hotel className="w-6 h-6" />}
            {type === "flight" ? `${from} to ${to}` : `Hotels in ${searchParams.get("destination") || "Your Destination"}`}
          </h1>
          <p className="text-sm text-stone flex items-center gap-3">
            <span>{depart}</span>
            <span className="w-1 h-1 bg-stone/30 rounded-full" />
            <span>{adults} Traveler{parseInt(adults) > 1 ? "s" : ""}</span>
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Button variant="outline" size="sm" className="rounded-lg h-9 text-xs">
            <Filter className="w-3.5 h-3.5 mr-2" /> Filters
          </Button>
          <Button variant="outline" size="sm" className="rounded-lg h-9 text-xs">
            Sort by: Lowest Price <ChevronDown className="w-3.5 h-3.5 ml-2" />
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[240px_1fr] gap-8">
        {/* Sidebar Filters (Desktop) */}
        <aside className="hidden lg:block space-y-8">
          <div>
            <h3 className="text-sm font-semibold text-ink mb-4">Stops</h3>
            <div className="space-y-2">
              {["Non-stop", "1 Stop", "2+ Stops"].map(s => (
                <label key={s} className="flex items-center gap-2 text-sm text-stone cursor-pointer hover:text-ink">
                  <input type="checkbox" className="rounded border-stone/30 text-oxblood focus:ring-oxblood" /> {s}
                </label>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-ink mb-4">Airlines</h3>
            <div className="space-y-2">
              {["Emirates", "Qatar Airways", "Singapore Airlines", "Lufthansa"].map(a => (
                <label key={a} className="flex items-center gap-2 text-sm text-stone cursor-pointer hover:text-ink">
                  <input type="checkbox" className="rounded border-stone/30 text-oxblood focus:ring-oxblood" /> {a}
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Results List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-stone/10 border-dashed">
              <Loader2 className="w-8 h-8 text-oxblood animate-spin mb-4" />
              <p className="text-stone font-medium">Finding the best {type}s for you...</p>
            </div>
          ) : results.length > 0 ? (
            results.map((res: any, i: number) => (
              type === "flight" ? (
                <div key={i} className="bg-white rounded-2xl border border-stone/10 p-5 hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="w-12 h-12 bg-ivory rounded-lg flex items-center justify-center shrink-0">
                      <Plane className="w-6 h-6 text-oxblood" />
                    </div>
                    <div className="flex-1 grid grid-cols-3 gap-4 text-center sm:text-left">
                      <div>
                        <p className="text-lg font-semibold text-ink">{res.departure.time}</p>
                        <p className="text-xs text-stone uppercase font-medium">{res.departure.airport}</p>
                      </div>
                      <div className="flex flex-col items-center justify-center px-4">
                        <p className="text-[10px] text-stone uppercase tracking-widest mb-1">{res.duration}</p>
                        <div className="relative w-full h-px bg-stone/20">
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-stone/40 rounded-full" />
                        </div>
                        <p className="text-[10px] text-stone mt-1">{res.stops}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-ink">{res.arrival.time}</p>
                        <p className="text-xs text-stone uppercase font-medium">{res.arrival.airport}</p>
                      </div>
                    </div>
                    <div className="sm:pl-6 sm:border-l border-stone/10 text-center sm:text-right shrink-0">
                      <p className="text-sm font-medium text-stone mb-1">{res.airline}</p>
                      <p className="text-2xl font-bold text-ink mb-2">₹{res.total_amount.toLocaleString()}</p>
                      <Button className="bg-oxblood hover:bg-oxblood/90 text-white rounded-xl h-9 px-6 text-sm">
                        View Deals
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div key={i} className="bg-white rounded-2xl border border-stone/10 p-4 hover:shadow-md transition-shadow flex gap-5">
                  <img src={res.img} alt={res.name} className="w-32 h-32 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-display text-lg font-semibold text-ink">{res.name}</h3>
                        <Badge variant="secondary" className="bg-gold/10 text-gold border-transparent">★ {res.rating}</Badge>
                      </div>
                      <p className="text-sm text-stone">Luxury Suite · Free Wifi · Breakfast Included</p>
                    </div>
                    <div className="flex items-end justify-between">
                      <p className="text-xs text-stone">Price for 1 night</p>
                      <div className="text-right">
                        <p className="text-xl font-bold text-ink">₹{res.price * 85}</p>
                        <Button className="bg-ink hover:bg-ink/90 text-white rounded-lg h-8 px-4 text-xs mt-1">Book Now</Button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            ))
          ) : (
            <div className="py-20 text-center">
              <p className="text-stone">No results found for your search. Try different dates or destinations.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <>
      <Navigation />
      <main className="pt-24 pb-20 bg-cream min-h-screen">
        <Suspense fallback={
          <div className="flex items-center justify-center h-[60vh]">
            <Loader2 className="w-10 h-10 text-oxblood animate-spin" />
          </div>
        }>
          <SearchResultsContent />
        </Suspense>
      </main>
    </>
  );
}
