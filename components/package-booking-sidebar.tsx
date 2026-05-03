"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Calendar, Users, ArrowRight } from "lucide-react";

interface Props {
  pkgId: string;
  pkgTitle: string;
  priceInr: number;
  originalPriceInr?: number;
  maxPax: number;
}

export function PackageBookingSidebar({ pkgId, pkgTitle, priceInr, originalPriceInr, maxPax }: Props) {
  const [date, setDate]   = useState("");
  const [guests, setGuests] = useState("2");

  const subject = `Package booking: ${pkgTitle}`;
  const conciergeUrl = `/concierge?subject=${encodeURIComponent(subject)}&date=${date}&guests=${guests}`;

  return (
    <div className="sticky top-32 bg-white rounded-[32px] p-8 border border-[#E5E1DA] shadow-xl">
      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8C8782] mb-1">Total Price</p>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-[#1A1A1A]">₹{priceInr.toLocaleString("en-IN")}</span>
          {originalPriceInr && (
            <span className="text-lg text-[#8C8782] line-through">₹{originalPriceInr.toLocaleString("en-IN")}</span>
          )}
        </div>
        <p className="text-[10px] text-[#8C8782] font-medium mt-1">*Price per person, inclusive of taxes</p>
      </div>

      <div className="space-y-3 mb-8">
        <div>
          <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-[#8C8782] mb-1.5">
            <Calendar className="inline w-3.5 h-3.5 text-[#C5A572] mr-1" />
            Travel Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-[#F8F5F2] border border-[#E5E1DA] rounded-xl px-4 h-12 text-sm text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#C5A059]/30 transition-all"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-[#8C8782] mb-1.5">
            <Users className="inline w-3.5 h-3.5 text-[#C5A572] mr-1" />
            Guests
          </label>
          <select
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="w-full bg-[#F8F5F2] border border-[#E5E1DA] rounded-xl px-4 h-12 text-sm text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#C5A059]/30 transition-all cursor-pointer"
          >
            {Array.from({ length: Math.min(maxPax, 10) }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>{n} Guest{n > 1 ? "s" : ""}</option>
            ))}
          </select>
        </div>
      </div>

      <Link href={conciergeUrl}>
        <Button className="w-full h-16 bg-[#6B1F2A] hover:bg-[#8B2A38] text-white rounded-2xl font-bold uppercase tracking-[0.2em] text-xs shadow-lg transition-all group">
          Book This Journey <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </Link>

      <div className="mt-8 pt-8 border-t border-[#E5E1DA] space-y-4">
        <div className="flex items-center gap-3 text-[#8C8782]">
          <CheckCircle2 className="w-4 h-4 text-green-500" />
          <span className="text-[11px] font-medium uppercase tracking-wider">Free Cancellation within 48h</span>
        </div>
        <div className="flex items-center gap-3 text-[#8C8782]">
          <CheckCircle2 className="w-4 h-4 text-green-500" />
          <span className="text-[11px] font-medium uppercase tracking-wider">24/7 Concierge Support</span>
        </div>
      </div>
    </div>
  );
}
