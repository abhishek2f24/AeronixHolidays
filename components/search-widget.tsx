"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles, Plane, Hotel, Package, Star,
  ArrowLeftRight, Users, Calendar, MapPin,
  Search, TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/* ── tab config ── */
const TABS = [
  { id: "odin",       label: "Ask Odin",   icon: Sparkles, premium: true },
  { id: "flights",    label: "Flights",    icon: Plane },
  { id: "hotels",     label: "Hotels",     icon: Hotel },
  { id: "holidays",   label: "Holidays",   icon: Package },
  { id: "experiences",label: "Experiences",icon: Star },
] as const;

type Tab = (typeof TABS)[number]["id"];

const TRIP_TYPES = ["One Way", "Round Trip", "Multi City"] as const;

const TRENDING = ["Bali", "Paris", "Maldives", "Tokyo", "Dubai", "Santorini"];

/* ── cabin options ── */
const CABINS = ["Economy", "Premium Economy", "Business", "First"];

export function SearchWidget() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("odin");
  const [tripType, setTripType] = useState<(typeof TRIP_TYPES)[number]>("Round Trip");
  const [cabin, setCabin] = useState("Economy");
  const [adults, setAdults] = useState(1);
  const [odinQuery, setOdinQuery] = useState("");

  /* ── flight fields ── */
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [depart, setDepart] = useState("");
  const [returnDate, setReturnDate] = useState("");

  /* ── hotel fields ── */
  const [hotelDest, setHotelDest] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [rooms, setRooms] = useState(1);

  function handleFlightSearch() {
    if (!from || !to || !depart) return;
    const params = new URLSearchParams({
      type: "flight", from, to, depart,
      return: returnDate, cabin, adults: String(adults),
    });
    router.push(`/search?${params}`);
  }

  function handleHotelSearch() {
    if (!hotelDest || !checkIn || !checkOut) return;
    const params = new URLSearchParams({
      type: "hotel", destination: hotelDest,
      checkIn, checkOut, rooms: String(rooms), guests: String(adults),
    });
    router.push(`/search?${params}`);
  }

  function handleOdinSearch() {
    if (!odinQuery.trim()) return;
    router.push(`/plan?q=${encodeURIComponent(odinQuery)}`);
  }

  function swapCities() {
    const tmp = from; setFrom(to); setTo(tmp);
  }

  return (
    <div className="glass-card rounded-2xl shadow-2xl overflow-hidden w-full max-w-5xl mx-auto">
      {/* ── Tab bar ── */}
      <div className="flex overflow-x-auto border-b border-stone/10 bg-white">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-1.5 px-4 py-3.5 text-sm font-medium whitespace-nowrap transition-all shrink-0",
              "border-b-2 -mb-px",
              activeTab === tab.id
                ? "border-oxblood text-oxblood bg-red-50/30"
                : "border-transparent text-stone hover:text-ink hover:border-stone/30"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.id === "odin" && (
              <span className="ml-1 text-[10px] font-semibold bg-oxblood text-white rounded px-1 py-0.5 leading-none">
                AI
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Tab content ── */}
      <div className="p-5">

        {/* ────── ODIN TAB ────── */}
        {activeTab === "odin" && (
          <div className="space-y-4">
            <div className="relative">
              <Sparkles className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-oxblood" />
              <Input
                value={odinQuery}
                onChange={(e) => setOdinQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleOdinSearch()}
                placeholder="Plan a 5-day Bali trip in June for 2 people, budget $3,000…"
                className="pl-11 h-14 text-base border-stone/20 rounded-xl bg-ivory/50 focus:border-oxblood focus:ring-oxblood/20 placeholder:text-stone/60"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-stone font-medium flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Trending:
                </span>
                {TRENDING.map((dest) => (
                  <button
                    key={dest}
                    onClick={() => setOdinQuery(`Plan a trip to ${dest}`)}
                    className="text-xs px-2.5 py-1 rounded-full bg-ivory border border-stone/20 text-stone hover:border-oxblood hover:text-oxblood transition-colors"
                  >
                    {dest}
                  </button>
                ))}
              </div>
              <Button
                onClick={handleOdinSearch}
                className="bg-oxblood hover:bg-oxblood/90 text-white rounded-xl px-6 h-10 font-medium shrink-0"
              >
                Ask Odin →
              </Button>
            </div>
            <p className="text-xs text-stone/70">
              Describe your trip in plain language — Odin will search flights, hotels and experiences for you.
            </p>
          </div>
        )}

        {/* ────── FLIGHTS TAB ────── */}
        {activeTab === "flights" && (
          <div className="space-y-4">
            {/* Trip type + cabin */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex bg-ivory rounded-lg p-0.5 gap-0.5">
                {TRIP_TYPES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTripType(t)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                      tripType === t
                        ? "bg-white text-oxblood shadow-sm"
                        : "text-stone hover:text-ink"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <select
                value={cabin}
                onChange={(e) => setCabin(e.target.value)}
                className="text-xs text-stone border border-stone/20 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:border-oxblood"
              >
                {CABINS.map((c) => <option key={c}>{c}</option>)}
              </select>
              <div className="flex items-center gap-1.5 text-xs text-stone border border-stone/20 rounded-lg px-3 py-1.5 bg-white">
                <Users className="w-3.5 h-3.5" />
                <button onClick={() => setAdults(Math.max(1, adults - 1))} className="hover:text-ink w-4">−</button>
                <span className="text-ink font-medium w-4 text-center">{adults}</span>
                <button onClick={() => setAdults(adults + 1)} className="hover:text-ink w-4">+</button>
                <span>Adult{adults > 1 ? "s" : ""}</span>
              </div>
            </div>

            {/* From / To / Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr_1fr_1fr] gap-2 items-center">
              {/* From */}
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone" />
                <Input
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  placeholder="From — City or airport"
                  className="pl-9 h-12 border-stone/20 rounded-xl bg-ivory/50 focus:border-oxblood text-sm"
                />
              </div>

              {/* Swap button */}
              <button
                onClick={swapCities}
                className="w-9 h-9 rounded-full border border-stone/20 bg-white flex items-center justify-center hover:border-oxblood hover:text-oxblood transition-all mx-auto shrink-0"
              >
                <ArrowLeftRight className="w-4 h-4" />
              </button>

              {/* To */}
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone" />
                <Input
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="To — City or airport"
                  className="pl-9 h-12 border-stone/20 rounded-xl bg-ivory/50 focus:border-oxblood text-sm"
                />
              </div>

              {/* Departure */}
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone pointer-events-none" />
                <input
                  type="date"
                  value={depart}
                  onChange={(e) => setDepart(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full pl-9 pr-3 h-12 border border-stone/20 rounded-xl bg-ivory/50 focus:border-oxblood focus:outline-none text-sm text-ink"
                />
              </div>

              {/* Return */}
              {tripType !== "One Way" ? (
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone pointer-events-none" />
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    min={depart || new Date().toISOString().split("T")[0]}
                    className="w-full pl-9 pr-3 h-12 border border-stone/20 rounded-xl bg-ivory/50 focus:border-oxblood focus:outline-none text-sm text-ink"
                  />
                </div>
              ) : (
                <div className="h-12 rounded-xl border border-dashed border-stone/20 flex items-center justify-center">
                  <span className="text-xs text-stone/50">No return</span>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleFlightSearch}
                className="bg-oxblood hover:bg-oxblood/90 text-white rounded-xl px-8 h-11 font-medium gap-2"
              >
                <Search className="w-4 h-4" />
                Search Flights
              </Button>
            </div>
          </div>
        )}

        {/* ────── HOTELS TAB ────── */}
        {activeTab === "hotels" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-stone border border-stone/20 rounded-lg px-3 py-1.5 bg-white">
                <Users className="w-3.5 h-3.5" />
                <button onClick={() => setAdults(Math.max(1, adults - 1))} className="hover:text-ink w-4">−</button>
                <span className="text-ink font-medium w-4 text-center">{adults}</span>
                <button onClick={() => setAdults(adults + 1)} className="hover:text-ink w-4">+</button>
                <span>Guest{adults > 1 ? "s" : ""}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-stone border border-stone/20 rounded-lg px-3 py-1.5 bg-white">
                <Hotel className="w-3.5 h-3.5" />
                <button onClick={() => setRooms(Math.max(1, rooms - 1))} className="hover:text-ink w-4">−</button>
                <span className="text-ink font-medium w-4 text-center">{rooms}</span>
                <button onClick={() => setRooms(rooms + 1)} className="hover:text-ink w-4">+</button>
                <span>Room{rooms > 1 ? "s" : ""}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr] gap-2 items-center">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone" />
                <Input
                  value={hotelDest}
                  onChange={(e) => setHotelDest(e.target.value)}
                  placeholder="City, area or property name"
                  className="pl-9 h-12 border-stone/20 rounded-xl bg-ivory/50 focus:border-oxblood text-sm"
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone pointer-events-none" />
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  placeholder="Check-in"
                  className="w-full pl-9 pr-3 h-12 border border-stone/20 rounded-xl bg-ivory/50 focus:border-oxblood focus:outline-none text-sm text-ink"
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone pointer-events-none" />
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={checkIn || new Date().toISOString().split("T")[0]}
                  placeholder="Check-out"
                  className="w-full pl-9 pr-3 h-12 border border-stone/20 rounded-xl bg-ivory/50 focus:border-oxblood focus:outline-none text-sm text-ink"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleHotelSearch}
                className="bg-oxblood hover:bg-oxblood/90 text-white rounded-xl px-8 h-11 font-medium gap-2"
              >
                <Search className="w-4 h-4" />
                Search Hotels
              </Button>
            </div>
          </div>
        )}

        {/* ────── HOLIDAYS + EXPERIENCES (coming soon) ────── */}
        {(activeTab === "holidays" || activeTab === "experiences") && (
          <div className="py-8 text-center">
            <div className="w-12 h-12 rounded-full bg-ivory flex items-center justify-center mx-auto mb-3">
              {activeTab === "holidays"
                ? <Package className="w-6 h-6 text-oxblood" />
                : <Star className="w-6 h-6 text-oxblood" />
              }
            </div>
            <p className="font-display text-xl font-semibold text-ink mb-1">Coming very soon</p>
            <p className="text-sm text-stone">
              {activeTab === "holidays"
                ? "Curated holiday packages with flights + hotels + experiences. Ask Odin to plan one now."
                : "Curated experiences — tours, activities, dining reservations. Ask Odin to find one."
              }
            </p>
            <Button
              onClick={() => setActiveTab("odin")}
              variant="outline"
              className="mt-4 border-oxblood text-oxblood hover:bg-oxblood hover:text-white"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Ask Odin instead
            </Button>
          </div>
        )}

      </div>
    </div>
  );
}
