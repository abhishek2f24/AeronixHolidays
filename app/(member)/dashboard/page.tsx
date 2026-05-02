import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchWidget } from "@/components/search-widget";
import {
  Sparkles, Plane, Calendar, MessageSquare,
  ChevronRight, AlertCircle, TrendingUp,
} from "lucide-react";

const INSPIRATIONS = [
  { title: "Golden Hour in Kyoto", subtitle: "May – June • Culture & Temples", img: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&q=80" },
  { title: "Overwater in the Maldives", subtitle: "Year-round • Luxury Resorts", img: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&q=80" },
  { title: "Mediterranean Summer", subtitle: "Jun – Sep • Beaches & History", img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&q=80" },
];

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  const { data: bookings } = await supabase.from("bookings").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(3);
  const { data: requests } = await supabase.from("concierge_requests").select("*").eq("user_id", user.id).eq("status", "open").limit(1);

  const tier = profile?.tier ?? "voyager";
  const name = profile?.full_name ?? "Traveler";
  const hasDNA = profile?.travel_dna && Object.keys(profile.travel_dna).length > 2;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">
            Good {getGreeting()}, {name.split(" ")[0]}
          </h1>
          <p className="text-stone mt-1">Where are you headed next?</p>
        </div>
        <Badge className={`text-xs px-3 py-1 capitalize ${
          tier === "odyssey" ? "bg-gold/10 text-gold border-gold/20" :
          tier === "atlas"   ? "bg-oxblood/10 text-oxblood border-oxblood/20" :
          "bg-stone/10 text-stone border-stone/20"
        }`}>
          {tier} member
        </Badge>
      </div>

      {/* ── DNA Quiz nudge ── */}
      {!hasDNA && (
        <div className="bg-oxblood/5 border border-oxblood/20 rounded-2xl p-5 mb-6 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-oxblood/10 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-oxblood" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-ink text-sm">Complete your Travel DNA</p>
            <p className="text-stone text-xs">Tell Odin your travel style so it can give you perfectly personalized recommendations.</p>
          </div>
          <Link href="/onboarding">
            <Button size="sm" className="bg-oxblood hover:bg-oxblood/90 text-white rounded-xl shrink-0">
              Take quiz <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      )}

      {/* ── Upgrade nudge for Voyager ── */}
      {tier === "voyager" && (
        <div className="bg-ink rounded-2xl p-5 mb-6 flex items-center gap-4">
          <TrendingUp className="w-6 h-6 text-gold shrink-0" />
          <div className="flex-1">
            <p className="font-medium text-white text-sm">Upgrade to Atlas — $480/year</p>
            <p className="text-white/60 text-xs">Unlimited Odin AI, hotel perks, 0% FX card, and more.</p>
          </div>
          <Link href="/pricing">
            <Button size="sm" className="bg-oxblood hover:bg-oxblood/90 text-white rounded-xl shrink-0">
              Upgrade
            </Button>
          </Link>
        </div>
      )}

      {/* ── Search widget ── */}
      <div className="mb-8">
        <SearchWidget />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* ── Recent Trips ── */}
        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-semibold text-ink">My trips</h2>
            <Link href="/trips" className="text-oxblood text-sm hover:underline">See all</Link>
          </div>

          {bookings && bookings.length > 0 ? (
            <div className="space-y-3">
              {bookings.map((b: any) => (
                <Link key={b.id} href={`/trips/${b.id}`}>
                  <div className="bg-white rounded-xl border border-stone/10 p-4 flex items-center gap-3 hover:shadow-sm transition-shadow">
                    <div className="w-9 h-9 bg-oxblood/10 rounded-lg flex items-center justify-center shrink-0">
                      <Plane className="w-4 h-4 text-oxblood" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-ink font-medium text-sm truncate">
                        {b.details?.origin ?? "—"} → {b.details?.destination ?? "—"}
                      </p>
                      <p className="text-stone text-xs">{b.details?.depart_date ?? "—"}</p>
                    </div>
                    <Badge className={`text-xs capitalize ${
                      b.status === "confirmed" ? "bg-green-50 text-green-700 border-green-200" :
                      b.status === "canceled"  ? "bg-red-50 text-red-700 border-red-200" :
                      "bg-stone/10 text-stone"
                    }`}>
                      {b.status}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-stone/10 p-8 text-center">
              <Calendar className="w-8 h-8 text-stone/40 mx-auto mb-3" />
              <p className="text-stone text-sm">No trips yet. Search for flights or ask Odin to plan one.</p>
            </div>
          )}
        </div>

        {/* ── Right column ── */}
        <div className="space-y-5">
          {/* Concierge status */}
          <div className="bg-white rounded-2xl border border-stone/10 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-ink text-sm">Concierge</h3>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-stone">Available</span>
              </div>
            </div>
            {requests && requests.length > 0 ? (
              <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl mb-3">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                <p className="text-xs text-amber-700">1 open request</p>
              </div>
            ) : null}
            <Link href="/concierge">
              <Button variant="outline" size="sm" className="w-full rounded-xl border-stone/20 gap-2 text-ink">
                <MessageSquare className="w-3.5 h-3.5" />
                New request
              </Button>
            </Link>
          </div>

          {/* Sunday Inspiration */}
          <div>
            <h3 className="font-semibold text-ink text-sm mb-3">Sunday Inspiration</h3>
            <div className="space-y-2">
              {INSPIRATIONS.map((i) => (
                <div key={i.title} className="group relative rounded-xl overflow-hidden cursor-pointer">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={i.img} alt={i.title} className="w-full h-20 object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-3">
                    <p className="text-white text-xs font-semibold leading-tight">{i.title}</p>
                    <p className="text-white/60 text-[10px]">{i.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}
