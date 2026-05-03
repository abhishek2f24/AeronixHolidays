import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Plane, Calendar, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function TripsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in?redirect=/trips");

  const { data: bookings } = await supabase
    .from("bookings")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">My Trips</h1>
          <p className="text-stone mt-1">All your bookings and travel history.</p>
        </div>
        <Link href="/search">
          <Button className="bg-oxblood hover:bg-oxblood/90 text-white rounded-xl gap-2">
            <Search className="w-4 h-4" /> New Search
          </Button>
        </Link>
      </div>

      {bookings && bookings.length > 0 ? (
        <div className="space-y-3">
          {bookings.map((b: any) => (
            <div key={b.id} className="bg-white rounded-xl border border-stone/10 p-5 flex items-center gap-4 hover:shadow-sm transition-shadow">
              <div className="w-10 h-10 bg-oxblood/10 rounded-xl flex items-center justify-center shrink-0">
                <Plane className="w-5 h-5 text-oxblood" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-ink font-semibold truncate">
                  {b.details?.origin ?? "—"} → {b.details?.destination ?? "—"}
                </p>
                <div className="flex items-center gap-2 text-stone text-xs mt-0.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{b.details?.depart_date ?? new Date(b.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <Badge className={`text-xs capitalize shrink-0 ${
                b.status === "confirmed" ? "bg-green-50 text-green-700 border-green-200" :
                b.status === "canceled"  ? "bg-red-50 text-red-700 border-red-200" :
                "bg-stone/10 text-stone"
              }`}>
                {b.status ?? "pending"}
              </Badge>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone/10 p-16 text-center">
          <div className="w-16 h-16 bg-oxblood/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Plane className="w-8 h-8 text-stone/30" />
          </div>
          <h2 className="font-display text-xl font-semibold text-ink mb-2">No trips yet</h2>
          <p className="text-stone text-sm mb-6">Search for flights or ask Odin to plan your first journey.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/search?type=flight"><Button variant="outline" className="rounded-xl border-stone/20 gap-2"><Plane className="w-4 h-4" /> Search Flights</Button></Link>
            <Link href="/plan"><Button className="bg-oxblood hover:bg-oxblood/90 text-white rounded-xl gap-2">Ask Odin AI</Button></Link>
          </div>
        </div>
      )}
    </div>
  );
}
