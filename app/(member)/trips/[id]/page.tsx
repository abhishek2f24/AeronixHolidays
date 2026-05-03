import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Plane, Hotel, Calendar, Clock, Users, MapPin,
  ArrowLeft, MessageSquare, Download, Share2, CheckCircle2,
} from "lucide-react";

function statusColor(status: string) {
  if (status === "confirmed" || status === "completed") return "bg-green-50 text-green-700 border-green-200";
  if (status === "canceled") return "bg-red-50 text-red-700 border-red-200";
  return "bg-amber-50 text-amber-700 border-amber-200";
}

export default async function TripDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in?redirect=/trips");

  const { data: booking } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!booking) notFound();

  const d = booking.details ?? {};
  const isFlightBooking = !!d.origin;
  const bookingDate = new Date(booking.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const conciergeSubject = `Help with booking ${booking.id.slice(0, 8).toUpperCase()}`;

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      {/* Back */}
      <Link href="/trips" className="flex items-center gap-2 text-stone text-sm hover:text-ink mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to My Trips
      </Link>

      {/* Header card */}
      <div className="bg-white rounded-2xl border border-stone/10 p-6 mb-4">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isFlightBooking ? "bg-blue-50" : "bg-emerald-50"}`}>
              {isFlightBooking
                ? <Plane className="w-6 h-6 text-blue-600" />
                : <Hotel className="w-6 h-6 text-emerald-600" />}
            </div>
            <div>
              <p className="text-stone text-xs font-medium uppercase tracking-wider">
                {isFlightBooking ? "Flight" : "Hotel"} Booking
              </p>
              <h1 className="font-display text-xl md:text-2xl font-bold text-ink">
                {d.origin ? `${d.origin} → ${d.destination}` : (d.hotel_name ?? "My Trip")}
              </h1>
            </div>
          </div>
          <Badge className={`text-xs capitalize shrink-0 ${statusColor(booking.status ?? "pending")}`}>
            {booking.status ?? "Pending"}
          </Badge>
        </div>
        <p className="text-stone text-xs">
          Booking ref: <span className="font-mono font-bold text-ink">{booking.id.slice(0, 8).toUpperCase()}</span>
        </p>
        <p className="text-stone text-xs mt-0.5">Booked on {bookingDate}</p>
      </div>

      {/* Details */}
      <div className="bg-white rounded-2xl border border-stone/10 p-6 mb-4">
        <h2 className="font-semibold text-ink mb-4">Trip Details</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {d.origin && (
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-stone mt-0.5 shrink-0" />
              <div><p className="text-xs text-stone font-medium">From</p><p className="font-semibold text-ink text-sm">{d.origin}</p></div>
            </div>
          )}
          {d.destination && (
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-oxblood mt-0.5 shrink-0" />
              <div><p className="text-xs text-stone font-medium">To</p><p className="font-semibold text-ink text-sm">{d.destination}</p></div>
            </div>
          )}
          {d.depart_date && (
            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 text-stone mt-0.5 shrink-0" />
              <div><p className="text-xs text-stone font-medium">Departure</p><p className="font-semibold text-ink text-sm">{d.depart_date}</p></div>
            </div>
          )}
          {d.return_date && (
            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 text-stone mt-0.5 shrink-0" />
              <div><p className="text-xs text-stone font-medium">Return</p><p className="font-semibold text-ink text-sm">{d.return_date}</p></div>
            </div>
          )}
          {d.airline && (
            <div className="flex items-start gap-3">
              <Plane className="w-4 h-4 text-stone mt-0.5 shrink-0" />
              <div><p className="text-xs text-stone font-medium">Airline</p><p className="font-semibold text-ink text-sm">{d.airline}</p></div>
            </div>
          )}
          {d.flight_number && (
            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-stone mt-0.5 shrink-0" />
              <div><p className="text-xs text-stone font-medium">Flight No.</p><p className="font-semibold text-ink text-sm">{d.flight_number}</p></div>
            </div>
          )}
          {d.adults && (
            <div className="flex items-start gap-3">
              <Users className="w-4 h-4 text-stone mt-0.5 shrink-0" />
              <div><p className="text-xs text-stone font-medium">Passengers</p><p className="font-semibold text-ink text-sm">{d.adults} Adult{Number(d.adults) > 1 ? "s" : ""}</p></div>
            </div>
          )}
          {booking.total_usd && (
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
              <div><p className="text-xs text-stone font-medium">Amount</p><p className="font-semibold text-ink text-sm">₹{Number(booking.total_usd).toLocaleString("en-IN")}</p></div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-2xl border border-stone/10 p-6 mb-4">
        <h2 className="font-semibold text-ink mb-4">Manage Booking</h2>
        <div className="flex flex-wrap gap-3">
          <Link href={`/concierge?subject=${encodeURIComponent(conciergeSubject)}`}>
            <Button variant="outline" className="border-stone/20 rounded-xl gap-2 text-ink">
              <MessageSquare className="w-4 h-4" /> Contact Support
            </Button>
          </Link>
          <Button variant="outline" className="border-stone/20 rounded-xl gap-2 text-stone/50 cursor-not-allowed" disabled>
            <Download className="w-4 h-4" /> E-ticket (coming soon)
          </Button>
          <Button variant="outline" className="border-stone/20 rounded-xl gap-2 text-stone/50 cursor-not-allowed" disabled>
            <Share2 className="w-4 h-4" /> Share (coming soon)
          </Button>
        </div>
        <p className="text-stone text-xs mt-3">
          For cancellations or changes, contact support with your booking reference above.
        </p>
      </div>

      {/* Policy */}
      <div className="bg-[#FAF7F2] rounded-2xl border border-[#E5E1DA] p-5">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-ink text-sm mb-1">Free Cancellation within 24 hours</p>
            <p className="text-stone text-xs">
              Cancel within 24 hours of booking for a full refund. After that, fees apply as per airline/hotel policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
