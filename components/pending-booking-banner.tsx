"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plane, Hotel, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPendingBooking, clearPendingBooking, type PendingBooking } from "@/lib/local-history";

export function PendingBookingBanner() {
  const [booking, setBooking] = useState<PendingBooking | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setBooking(getPendingBooking());
  }, []);

  if (!mounted || !booking) return null;

  const isFlightBooking = booking.type === "flight";

  function dismiss() {
    clearPendingBooking();
    setBooking(null);
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
        isFlightBooking ? "bg-blue-100" : "bg-emerald-100"
      }`}>
        {isFlightBooking
          ? <Plane className="w-5 h-5 text-blue-600" />
          : <Hotel className="w-5 h-5 text-emerald-600" />}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-amber-800 font-semibold text-sm mb-0.5">
          Did you complete your booking?
        </p>
        <p className="text-amber-700 text-xs truncate mb-3">{booking.label}</p>
        <div className="flex flex-wrap gap-2">
          <a
            href={`/redirect?type=${booking.type}&name=${encodeURIComponent(booking.label.split("·")[0].trim())}&url=${encodeURIComponent(booking.partnerUrl)}`}
            className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl px-4 py-2 transition-colors"
          >
            Complete booking <ArrowRight className="w-3.5 h-3.5" />
          </a>
          <Link href={booking.searchHref}>
            <Button variant="outline" size="sm" className="border-amber-300 text-amber-800 text-xs rounded-xl hover:bg-amber-100">
              Back to results
            </Button>
          </Link>
        </div>
      </div>

      <button
        onClick={dismiss}
        className="text-amber-400 hover:text-amber-600 transition-colors shrink-0 mt-0.5"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
