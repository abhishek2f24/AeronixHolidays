"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Plane, 
  Hotel, 
  Palmtree, 
  Ticket, 
  FileCheck, 
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const TABS = [
  { id: "odin", label: "Ask Odin AI", icon: Sparkles },
  { id: "flights", label: "Flights", icon: Plane },
  { id: "hotels", label: "Hotels", icon: Hotel },
  { id: "holidays", label: "Holidays", icon: Palmtree },
  { id: "experiences", label: "Experiences", icon: Ticket },
  { id: "visa", label: "Visa Support", icon: FileCheck },
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

const PREVIEW_RESULTS = [
  { id: 1, title: "Emirates Flights", status: "found", icon: CheckCircle2 },
  { id: 2, title: "St. Regis Maldives", status: "available", icon: CheckCircle2 },
  { id: 3, title: "Visa Checklist", status: "ready", icon: CheckCircle2 },
  { id: 4, title: "Yacht Sunset Dinner", status: "added", icon: CheckCircle2 },
];

export function SearchWidget() {
  const [activeTab, setActiveTab] = useState("odin");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      {/* AI Glowing Border Animation */}
      <div className="absolute -inset-[1px] bg-gradient-to-r from-[#C5A572]/0 via-[#C5A572]/40 to-[#C5A572]/0 rounded-[32px] blur-sm animate-pulse pointer-events-none" />
      
      <div className="relative bg-white/95 backdrop-blur-2xl rounded-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] border border-[#E5E1DA] overflow-hidden">
        
        {/* Tabs Section - Architectural Integration */}
        <div className="flex items-center bg-[#FAF7F2] border-b border-[#E5E1DA]">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2.5 px-8 py-5 text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-300 relative",
                activeTab === tab.id
                  ? "text-[#6B1F2A] bg-white"
                  : "text-[#8C8782] hover:text-[#6B1F2A] hover:bg-white/40"
              )}
            >
              <tab.icon className={cn("w-3.5 h-3.5 transition-colors", activeTab === tab.id ? "text-[#C5A059]" : "text-current")} />
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C5A059]" />
              )}
            </button>
          ))}
        </div>

        {/* Input Section */}
        <div className="p-10 pb-8">
          <div className="relative flex items-center group">
            <div className="absolute left-7 text-[#C5A059] group-focus-within:scale-110 transition-transform duration-300">
              <Sparkles className="w-7 h-7" />
            </div>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={PLACEHOLDERS[placeholderIndex]}
              className="w-full bg-[#FAF7F2] border border-[#E5E1DA] rounded-xl h-24 pl-20 pr-52 text-xl font-display text-[#1A1A1A] placeholder-[#8C8782]/40 focus:outline-none focus:ring-1 focus:ring-[#C5A059]/30 transition-all shadow-sm"
            />
            <div className="absolute right-4">
              <Button 
                className="bg-gradient-to-r from-[#6B1F2A] to-[#8B2A38] hover:scale-[1.02] text-white h-16 px-12 rounded-lg font-bold uppercase tracking-[0.2em] text-xs shadow-xl border border-[#C5A059]/20 transition-all flex items-center gap-3"
                onClick={() => router.push(`/plan?q=${encodeURIComponent(inputValue)}`)}
              >
                Ask Odin <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick Chips */}
          <div className="flex flex-wrap items-center gap-3 mt-10">
            <span className="text-[11px] uppercase tracking-[0.25em] font-extrabold text-[#8C8782]/60 mr-4">Trending:</span>
            {QUICK_CHIPS.map((chip) => (
              <button
                key={chip}
                onClick={() => setInputValue(chip)}
                className="px-6 py-3 rounded-lg border border-[#E5E1DA] bg-white text-[11px] font-bold tracking-wider text-[#6B1F2A] hover:border-[#C5A059] hover:bg-[#FAF7F2] hover:shadow-md transition-all"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>


      </div>
    </div>
  );
}
