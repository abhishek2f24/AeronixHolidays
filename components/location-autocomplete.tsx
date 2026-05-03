"use client";

import { useState, useEffect, useRef } from "react";
import { AIRPORTS } from "@/lib/airports";
import { MapPin, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface Airport {
  city: string;
  name: string;
  iata: string;
  country: string;
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  mode?: "iata" | "city" | "country";
  icon?: "pin" | "globe";
}

export function LocationAutocomplete({ value, onChange, placeholder, className, mode = "iata", icon = "pin" }: Props) {
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Airport[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!value || value.length < 1) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    const filtered = AIRPORTS.filter(
      (a) =>
        a.city.toLowerCase().includes(value.toLowerCase()) ||
        a.iata.toLowerCase().includes(value.toLowerCase()) ||
        a.name.toLowerCase().includes(value.toLowerCase()) ||
        a.country.toLowerCase().includes(value.toLowerCase())
    ).slice(0, 8);

    setSuggestions(filtered);
    // Don't open if the exact match is already selected (simple heuristic)
    const isExactMatch = filtered.length === 1 && (
      filtered[0].iata === value || 
      `${filtered[0].city}, ${filtered[0].country}` === value ||
      filtered[0].country === value
    );
    
    setOpen(filtered.length > 0 && !isExactMatch);
  }, [value, mode]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (a: Airport) => {
    if (mode === "iata") {
      onChange(a.iata);
    } else if (mode === "city") {
      onChange(`${a.city}, ${a.country}`);
    } else if (mode === "country") {
      onChange(a.country);
    }
    setOpen(false);
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      {icon === "pin" ? (
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#C5A059] pointer-events-none z-10" />
      ) : (
        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#C5A059] pointer-events-none z-10" />
      )}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => value.length > 0 && setOpen(suggestions.length > 0)}
        placeholder={placeholder}
        className={cn(
          "w-full bg-[#FAF7F2] border border-[#E5E1DA] rounded-xl px-4 pl-9 h-12 text-sm text-[#1A1A1A] placeholder-[#8C8782]/60 focus:outline-none focus:ring-1 focus:ring-[#C5A059]/30 transition-all shadow-sm",
          className
        )}
      />

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E5E1DA] rounded-xl shadow-2xl overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
          {suggestions.map((a, i) => (
            <button
              key={`${a.iata}-${i}`}
              onClick={() => handleSelect(a)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#FAF7F2] transition-colors text-left border-b border-[#E5E1DA]/50 last:border-0"
            >
              <div className="w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center shrink-0">
                <span className="text-[10px] font-bold text-oxblood">{a.iata}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-ink truncate">{a.city}, {a.country}</p>
                <p className="text-[10px] text-stone truncate">{a.name}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
