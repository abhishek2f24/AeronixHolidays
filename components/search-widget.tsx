"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Plane, Hotel, Palmtree, Ticket,
  FileCheck, ArrowRight, MapPin, Search, Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const TABS = [
  { id: "odin",        label: "Ask Odin AI",  icon: Sparkles  },
  { id: "flights",     label: "Flights",       icon: Plane     },
  { id: "hotels",      label: "Hotels",        icon: Hotel     },
  { id: "holidays",    label: "Holidays",      icon: Palmtree  },
  { id: "experiences", label: "Experiences",   icon: Ticket    },
  { id: "visa",        label: "Visa Support",  icon: FileCheck },
];

const PLACEHOLDERS = [
  "Plan a 7-day Santorini honeymoon under $8,000",
  "Business trip to Dubai with Emirates business class",
  "Maldives luxury family vacation with private pool villa",
  "Europe summer itinerary with Schengen visa help",
];

const QUICK_CHIPS = [
  "Luxury Honeymoon",
  "Family Escape",
  "Visa + Flights",
  "Corporate Travel",
  "Last Minute Rescue",
];

const INPUT = "w-full bg-[#FAF7F2] border border-[#E5E1DA] rounded-xl px-4 h-12 text-sm text-[#1A1A1A] placeholder-[#8C8782]/60 focus:outline-none focus:ring-1 focus:ring-[#C5A059]/30 transition-all";
const LABEL = "block text-[10px] uppercase tracking-[0.2em] font-bold text-[#8C8782] mb-1.5";
const SELECT = `${INPUT} cursor-pointer`;

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className={LABEL}>{label}</p>
      {children}
    </div>
  );
}

function SearchBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Button
      onClick={onClick}
      className="w-full sm:w-auto bg-gradient-to-r from-[#6B1F2A] to-[#8B2A38] text-white h-12 px-8 rounded-lg font-bold uppercase tracking-[0.2em] text-xs shadow-xl border border-[#C5A059]/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
    >
      <Search className="w-3.5 h-3.5" /> {label}
    </Button>
  );
}

import { LocationAutocomplete } from "@/components/location-autocomplete";
import { Checkbox } from "@/components/ui/checkbox";

function FlightsForm() {
  const router = useRouter();
  const [tripType, setTripType] = useState<"round" | "oneway" | "multi">("round");
  const [segments, setSegments] = useState([{ from: "", to: "", date: "" }]);
  const [roundTrip, setRoundTrip] = useState({ from: "", to: "", depart: "", return: "" });
  const [oneWay, setOneWay] = useState({ from: "", to: "", depart: "" });
  const [cabin, setCabin] = useState("ECONOMY");
  const [adults, setAdults] = useState("1");
  const [nonStop, setNonStop] = useState(false);

  function handleSearch() {
    const params = new URLSearchParams({ type: "flight", cabin, adults });
    if (nonStop) params.set("nonStop", "true");

    if (tripType === "round") {
      if (!roundTrip.from || !roundTrip.to || !roundTrip.depart) { 
        toast.error("Please fill in origin, destination, and departure date."); 
        return; 
      }
      params.set("from", roundTrip.from.toUpperCase());
      params.set("to", roundTrip.to.toUpperCase());
      params.set("depart", roundTrip.depart);
      if (roundTrip.return) params.set("return", roundTrip.return);
    } else if (tripType === "oneway") {
      if (!oneWay.from || !oneWay.to || !oneWay.depart) { 
        toast.error("Please fill in origin, destination, and departure date."); 
        return; 
      }
      params.set("from", oneWay.from.toUpperCase());
      params.set("to", oneWay.to.toUpperCase());
      params.set("depart", oneWay.depart);
    } else {
      // Multi-city
      if (segments.some(s => !s.from || !s.to || !s.date)) {
        toast.error("Please fill in all flight details for your multi-city journey.");
        return;
      }
      const multi = segments.map(s => `${s.from.toUpperCase()}-${s.to.toUpperCase()}-${s.date}`).join(",");
      params.set("multi", multi);
    }
    router.push(`/search?${params}`);
  }

  const addSegment = () => setSegments([...segments, { from: "", to: "", date: "" }]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          {(["round", "oneway", "multi"] as const).map((val) => (
            <button key={val} onClick={() => setTripType(val)}
              className={cn("px-4 py-1.5 rounded-lg text-[10px] uppercase tracking-[0.2em] font-bold border transition-all",
                tripType === val ? "bg-[#6B1F2A] text-white border-[#6B1F2A]" : "bg-white text-[#8C8782] border-[#E5E1DA] hover:border-[#C5A059]"
              )}>
              {val === "round" ? "Round-trip" : val === "oneway" ? "One-way" : "Multi-city"}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 cursor-pointer group">
            <div className={cn("w-4 h-4 rounded border border-[#E5E1DA] flex items-center justify-center transition-all", nonStop ? "bg-[#6B1F2A] border-[#6B1F2A]" : "bg-white")}>
              {nonStop && <Check className="w-3 h-3 text-white" />}
            </div>
            <input type="checkbox" checked={nonStop} onChange={e => setNonStop(e.target.checked)} className="hidden" />
            <span className="text-[10px] uppercase tracking-widest font-bold text-[#8C8782] group-hover:text-ink">Non-stop only</span>
          </label>
        </div>
      </div>

      {tripType === "round" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <Field label="From">
            <LocationAutocomplete value={roundTrip.from} onChange={v => setRoundTrip({...roundTrip, from: v})} placeholder="Origin" mode="iata" />
          </Field>
          <Field label="To">
            <LocationAutocomplete value={roundTrip.to} onChange={v => setRoundTrip({...roundTrip, to: v})} placeholder="Destination" mode="iata" />
          </Field>
          <Field label="Departure">
            <input type="date" value={roundTrip.depart} onChange={e => setRoundTrip({...roundTrip, depart: e.target.value})} className={INPUT} />
          </Field>
          <Field label="Return">
            <input type="date" value={roundTrip.return} onChange={e => setRoundTrip({...roundTrip, return: e.target.value})} className={INPUT} />
          </Field>
          <Field label="Passengers">
            <select value={`${adults}|${cabin}`} onChange={e => { const [a, c] = e.target.value.split("|"); setAdults(a); setCabin(c); }} className={SELECT}>
              <option value="1|ECONOMY">1 Adult · Economy</option>
              <option value="2|ECONOMY">2 Adults · Economy</option>
              <option value="1|BUSINESS">1 Adult · Business</option>
              <option value="2|BUSINESS">2 Adults · Business</option>
              <option value="1|FIRST">1 Adult · First</option>
            </select>
          </Field>
        </div>
      )}

      {tripType === "oneway" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Field label="From">
            <LocationAutocomplete value={oneWay.from} onChange={v => setOneWay({...oneWay, from: v})} placeholder="Origin" mode="iata" />
          </Field>
          <Field label="To">
            <LocationAutocomplete value={oneWay.to} onChange={v => setOneWay({...oneWay, to: v})} placeholder="Destination" mode="iata" />
          </Field>
          <Field label="Departure">
            <input type="date" value={oneWay.depart} onChange={e => setOneWay({...oneWay, depart: e.target.value})} className={INPUT} />
          </Field>
          <Field label="Passengers">
            <select value={`${adults}|${cabin}`} onChange={e => { const [a, c] = e.target.value.split("|"); setAdults(a); setCabin(c); }} className={SELECT}>
              <option value="1|ECONOMY">1 Adult · Economy</option>
              <option value="2|ECONOMY">2 Adults · Economy</option>
              <option value="1|BUSINESS">1 Adult · Business</option>
              <option value="2|BUSINESS">2 Adults · Business</option>
              <option value="1|FIRST">1 Adult · First</option>
            </select>
          </Field>
        </div>
      )}

      {tripType === "multi" && (
        <div className="space-y-4">
          {segments.map((seg, i) => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 items-end">
              <Field label={`Flight ${i+1} From`}>
                <LocationAutocomplete value={seg.from} onChange={v => {
                  const n = [...segments]; n[i].from = v; setSegments(n);
                }} placeholder="Origin" mode="iata" />
              </Field>
              <Field label="To">
                <LocationAutocomplete value={seg.to} onChange={v => {
                  const n = [...segments]; n[i].to = v; setSegments(n);
                }} placeholder="Destination" mode="iata" />
              </Field>
              <Field label="Date">
                <input type="date" value={seg.date} onChange={e => {
                  const n = [...segments]; n[i].date = e.target.value; setSegments(n);
                }} className={INPUT} />
              </Field>
              {i === segments.length - 1 && segments.length < 4 && (
                <Button variant="ghost" onClick={addSegment} className="h-12 border border-dashed border-[#E5E1DA] text-[#6B1F2A] font-bold text-[10px] uppercase tracking-widest">
                  + Add Flight
                </Button>
              )}
            </div>
          ))}
          <div className="pt-2">
            <Field label="Passengers & Class">
              <select value={`${adults}|${cabin}`} onChange={e => { const [a, c] = e.target.value.split("|"); setAdults(a); setCabin(c); }} className={cn(SELECT, "max-w-xs")}>
                <option value="1|ECONOMY">1 Adult · Economy</option>
                <option value="2|ECONOMY">2 Adults · Economy</option>
                <option value="1|BUSINESS">1 Adult · Business</option>
                <option value="2|BUSINESS">2 Adults · Business</option>
              </select>
            </Field>
          </div>
        </div>
      )}

      <div className="flex justify-center sm:justify-end">
        <SearchBtn label="Search Flights" onClick={handleSearch} />
      </div>
    </div>
  );
}

function HotelsForm() {
  const router = useRouter();
  const [dest, setDest]       = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests]   = useState("1|1");

  function handleSearch() {
    if (!dest || !checkIn || !checkOut) { 
      toast.error("Please fill in destination, check-in, and check-out dates."); 
      return; 
    }
    const [adults, rooms] = guests.split("|");
    router.push(`/search?type=hotel&destination=${encodeURIComponent(dest)}&checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}&rooms=${rooms}`);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Field label="Destination">
          <LocationAutocomplete value={dest} onChange={v => setDest(v)} placeholder="City or Hotel" mode="city" />
        </Field>
        <Field label="Check-in">
          <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} className={INPUT} />
        </Field>
        <Field label="Check-out">
          <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} className={INPUT} />
        </Field>
        <Field label="Guests & Rooms">
          <select value={guests} onChange={e => setGuests(e.target.value)} className={SELECT}>
            <option value="1|1">1 Room · 1 Adult</option>
            <option value="2|1">1 Room · 2 Adults</option>
            <option value="3|1">1 Room · 2 Adults + 1 Child</option>
            <option value="2|2">2 Rooms · 2 Adults</option>
            <option value="4|2">2 Rooms · 4 Adults</option>
          </select>
        </Field>
      </div>
      <SearchBtn label="Search Hotels" onClick={handleSearch} />
    </div>
  );
}

function HolidaysForm() {
  const router = useRouter();
  const [dest, setDest]         = useState("");
  const [date, setDate]         = useState("");
  const [duration, setDuration] = useState("5-7");
  const [travellers, setTravellers] = useState("2");

  function handleSearch() {
    if (!dest) { alert("Please enter a destination."); return; }
    const params = new URLSearchParams({ destination: dest });
    if (date) params.set("date", date);
    router.push(`/packages?${params}`);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Field label="Destination">
          <LocationAutocomplete value={dest} onChange={v => setDest(v)} placeholder="e.g. Maldives, Europe" mode="city" />
        </Field>
        <Field label="Travel Date">
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className={INPUT} />
        </Field>
        <Field label="Duration">
          <select value={duration} onChange={e => setDuration(e.target.value)} className={SELECT}>
            <option value="3-5">3–5 Nights</option>
            <option value="5-7">5–7 Nights</option>
            <option value="7-10">7–10 Nights</option>
            <option value="10-14">10–14 Nights</option>
            <option value="14+">14+ Nights</option>
          </select>
        </Field>
        <Field label="Travellers">
          <select value={travellers} onChange={e => setTravellers(e.target.value)} className={SELECT}>
            <option value="1">Solo</option>
            <option value="2">2 Adults</option>
            <option value="3">2 Adults + 1 Child</option>
            <option value="4">2 Adults + 2 Children</option>
            <option value="5">Family (4+)</option>
          </select>
        </Field>
      </div>
      <SearchBtn label="Search Holidays" onClick={handleSearch} />
    </div>
  );
}

function ExperiencesForm() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("All Experiences");
  const [date, setDate]         = useState("");
  const [guests, setGuests]     = useState("2");

  function handleSearch() {
    const q = [
      location && `${category} in ${location}`,
      date && `on ${date}`,
      `for ${guests} guest${Number(guests) > 1 ? "s" : ""}`,
    ].filter(Boolean).join(" ");
    router.push(`/plan?q=${encodeURIComponent(q || category)}`);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Field label="Location">
          <LocationAutocomplete value={location} onChange={v => setLocation(v)} placeholder="City or Country" mode="city" />
        </Field>
        <Field label="Category">
          <select value={category} onChange={e => setCategory(e.target.value)} className={SELECT}>
            <option>All Experiences</option>
            <option>Adventure & Sports</option>
            <option>Culture & Heritage</option>
            <option>Food & Wine</option>
            <option>Wellness & Spa</option>
            <option>Yacht & Sailing</option>
            <option>Private Tours</option>
          </select>
        </Field>
        <Field label="Date">
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className={INPUT} />
        </Field>
        <Field label="Guests">
          <select value={guests} onChange={e => setGuests(e.target.value)} className={SELECT}>
            <option value="1">1 Guest</option>
            <option value="2">2 Guests</option>
            <option value="4">3–5 Guests</option>
            <option value="8">6–10 Guests</option>
            <option value="12">Private Group (10+)</option>
          </select>
        </Field>
      </div>
      <SearchBtn label="Search Experiences" onClick={handleSearch} />
    </div>
  );
}

function VisaForm() {
  const router = useRouter();
  const [nationality, setNationality] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate]               = useState("");
  const [visaType, setVisaType]       = useState("Tourist Visa");

  function handleSearch() {
    if (!destination) { alert("Please enter a destination country."); return; }
    const q = `${visaType} requirements for ${nationality || "Indian"} passport holder traveling to ${destination}${date ? ` in ${date}` : ""}`;
    router.push(`/plan?q=${encodeURIComponent(q)}`);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Field label="Your Nationality">
          <LocationAutocomplete value={nationality} onChange={v => setNationality(v)} placeholder="e.g. Indian, American" mode="country" />
        </Field>
        <Field label="Destination Country">
          <LocationAutocomplete value={destination} onChange={v => setDestination(v)} placeholder="e.g. Schengen, USA, UK" mode="country" />
        </Field>
        <Field label="Travel Date">
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className={INPUT} />
        </Field>
        <Field label="Visa Type">
          <select value={visaType} onChange={e => setVisaType(e.target.value)} className={SELECT}>
            <option>Tourist Visa</option>
            <option>Business Visa</option>
            <option>Transit Visa</option>
            <option>Student Visa</option>
            <option>Work Permit</option>
          </select>
        </Field>
      </div>
      <SearchBtn label="Check Visa Requirements" onClick={handleSearch} />
    </div>
  );
}

export function SearchWidget() {
  const [activeTab, setActiveTab]         = useState("odin");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [inputValue, setInputValue]       = useState("");
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const TAB_FORMS: Record<string, React.ReactNode> = {
    flights:     <FlightsForm />,
    hotels:      <HotelsForm />,
    holidays:    <HolidaysForm />,
    experiences: <ExperiencesForm />,
    visa:        <VisaForm />,
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      {/* AI Glowing Border */}
      <div className="absolute -inset-[1px] bg-gradient-to-r from-[#C5A572]/0 via-[#C5A572]/40 to-[#C5A572]/0 rounded-[32px] blur-sm animate-pulse pointer-events-none" />

      <div className="relative bg-white/95 backdrop-blur-2xl rounded-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] border border-[#E5E1DA] overflow-hidden">

        {/* Tabs — scrollable on mobile */}
        <div className="flex items-center bg-[#FAF7F2] border-b border-[#E5E1DA] overflow-x-auto scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-1.5 md:gap-2.5 px-4 md:px-8 py-3 md:py-5 text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-300 relative shrink-0",
                activeTab === tab.id
                  ? "text-[#6B1F2A] bg-white"
                  : "text-[#8C8782] hover:text-[#6B1F2A] hover:bg-white/40"
              )}
            >
              <tab.icon className={cn("w-3.5 h-3.5 transition-colors", activeTab === tab.id ? "text-[#C5A059]" : "text-current")} />
              <span className="whitespace-nowrap">{tab.label}</span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C5A059]" />
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="p-4 md:p-8"
          >
            {activeTab === "odin" ? (
              <>
                <div className="flex flex-col md:relative md:flex-row md:items-center group gap-3 md:gap-0">
                  <div className="hidden md:block absolute left-7 text-[#C5A059] group-focus-within:scale-110 transition-transform duration-300">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && router.push(`/plan?q=${encodeURIComponent(inputValue)}`)}
                    placeholder={PLACEHOLDERS[placeholderIndex]}
                    className="w-full bg-[#FAF7F2] border border-[#E5E1DA] rounded-xl h-14 md:h-20 px-4 md:pl-20 md:pr-52 text-base md:text-xl font-display text-[#1A1A1A] placeholder-[#8C8782]/40 focus:outline-none focus:ring-1 focus:ring-[#C5A059]/30 transition-all shadow-sm"
                  />
                  <div className="md:absolute md:right-4 w-full md:w-auto">
                    <Button
                      className="w-full md:w-auto bg-gradient-to-r from-[#6B1F2A] to-[#8B2A38] hover:scale-[1.02] text-white h-12 md:h-14 px-6 md:px-10 rounded-lg font-bold uppercase tracking-[0.2em] text-xs shadow-xl border border-[#C5A059]/20 transition-all flex items-center justify-center gap-3"
                      onClick={() => router.push(`/plan?q=${encodeURIComponent(inputValue)}`)}
                    >
                      Ask Odin <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-4 md:mt-6">
                  <span className="text-[10px] uppercase tracking-[0.25em] font-extrabold text-[#8C8782]/60 mr-1">Trending:</span>
                  {QUICK_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => setInputValue(chip)}
                      className="px-4 py-2 rounded-lg border border-[#E5E1DA] bg-white text-[11px] font-bold tracking-wider text-[#6B1F2A] hover:border-[#C5A059] hover:bg-[#FAF7F2] hover:shadow-md transition-all"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              TAB_FORMS[activeTab]
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
