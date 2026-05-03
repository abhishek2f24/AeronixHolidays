import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchWidget } from "@/components/search-widget";
import { RecentSearches } from "@/components/recent-searches";
import { PendingBookingBanner } from "@/components/pending-booking-banner";
import {
  Sparkles, Plane, Hotel, Calendar, MessageSquare,
  ChevronRight, AlertCircle, Bell, Lock, Tag,
  TrendingDown, ArrowRight,
} from "lucide-react";

const INSPIRATIONS = [
  { title: "Golden Hour in Kyoto",      subtitle: "May – June · Culture",  href: "/destinations/kyoto",  img: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&q=80"  },
  { title: "Overwater in the Maldives", subtitle: "Year-round · Luxury",   href: "/destinations/maldives",img: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&q=80"  },
  { title: "Mediterranean Summer",      subtitle: "Jun – Sep · Beaches",   href: "/destinations/santorini",img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&q=80" },
];

const QUICK_LINKS = [
  { label: "Search Flights",   icon: Plane,    href: "/search?type=flight",  color: "bg-blue-50 text-blue-700"   },
  { label: "Search Hotels",    icon: Hotel,    href: "/search?type=hotel",   color: "bg-emerald-50 text-emerald-700" },
  { label: "Holiday Packages", icon: Calendar, href: "/packages",             color: "bg-amber-50 text-amber-700" },
  { label: "Ask Odin AI",      icon: Sparkles, href: "/plan",                color: "bg-oxblood/8 text-oxblood"  },
];

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  const { data: bookings } = await supabase.from("bookings").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(3);
  const { data: requests } = await supabase.from("concierge_requests").select("*").eq("user_id", user.id).eq("status", "open").limit(1);
  const { data: fareLocks } = await supabase.from("fare_locks").select("*").eq("user_id", user.id).gt("expires_at", new Date().toISOString()).order("expires_at", { ascending: true }).limit(3);
  const { data: priceAlerts } = await supabase.from("price_alerts").select("*").eq("user_id", user.id).eq("is_active", true).limit(5);

  const name  = profile?.full_name ?? "Traveler";
  const hasDNA = profile?.travel_dna && Object.keys(profile.travel_dna).length > 2;

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">

      {/* ── Greeting ── */}
      <div className="mb-6">
        <h1 className="font-display text-2xl md:text-3xl font-semibold text-ink">
          Good {getGreeting()}, {name.split(" ")[0]} 👋
        </h1>
        <p className="text-stone mt-1 text-sm">Where are you headed next?</p>
      </div>

      {/* ── Travel DNA nudge ── */}
      {!hasDNA && (
        <div className="bg-oxblood/5 border border-oxblood/20 rounded-2xl p-4 mb-6 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-oxblood/10 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-oxblood" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-ink text-sm">Personalise your experience</p>
            <p className="text-stone text-xs">Tell Odin your travel style for perfectly tailored recommendations.</p>
          </div>
          <Link href="/onboarding">
            <Button size="sm" className="bg-oxblood hover:bg-oxblood/90 text-white rounded-xl shrink-0">
              Set up <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      )}

      {/* ── Quick links ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {QUICK_LINKS.map(({ label, icon: Icon, href, color }) => (
          <Link key={label} href={href}>
            <div className={`flex flex-col items-center gap-2 p-4 rounded-2xl border border-stone/10 bg-white hover:shadow-md transition-all cursor-pointer text-center`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-ink">{label}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Pending booking recovery banner (client — reads localStorage) ── */}
      <PendingBookingBanner />

      {/* ── Search widget ── */}
      <div className="my-6">
        <SearchWidget />
      </div>

      <div className="grid md:grid-cols-3 gap-6">

        {/* ── Left: Trips + Fare Locks ── */}
        <div className="md:col-span-2 space-y-6">

          {/* Upcoming trips */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-lg font-semibold text-ink">My Trips</h2>
              <Link href="/trips" className="text-oxblood text-sm hover:underline flex items-center gap-1">
                See all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            {bookings && bookings.length > 0 ? (
              <div className="space-y-2">
                {bookings.map((b: any) => (
                  <Link key={b.id} href={`/trips/${b.id}`}>
                    <div className="bg-white rounded-xl border border-stone/10 p-4 flex items-center gap-3 hover:shadow-sm transition-shadow">
                      <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                        <Plane className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-ink font-medium text-sm truncate">
                          {b.details?.origin ?? "—"} → {b.details?.destination ?? "—"}
                        </p>
                        <p className="text-stone text-xs">{b.details?.depart_date ?? new Date(b.created_at).toLocaleDateString("en-IN")}</p>
                      </div>
                      <Badge className={`text-xs capitalize shrink-0 ${
                        b.status === "confirmed" ? "bg-green-50 text-green-700 border-green-200" :
                        b.status === "canceled"  ? "bg-red-50 text-red-700 border-red-200" :
                        "bg-amber-50 text-amber-700 border-amber-200"
                      }`}>
                        {b.status ?? "booked"}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-stone/10 p-6 text-center">
                <Calendar className="w-8 h-8 text-stone/30 mx-auto mb-2" />
                <p className="text-stone text-sm">No trips yet. Search for flights or let Odin plan one.</p>
              </div>
            )}
          </div>

          {/* Locked Fares */}
          {fareLocks && fareLocks.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Lock className="w-4 h-4 text-oxblood" />
                <h2 className="font-display text-lg font-semibold text-ink">Locked Fares</h2>
              </div>
              <div className="space-y-2">
                {fareLocks.map((lock: any) => {
                  const expiresAt = new Date(lock.expires_at);
                  const hoursLeft = Math.max(0, Math.round((expiresAt.getTime() - Date.now()) / 3600000));
                  return (
                    <div key={lock.id} className="bg-white rounded-xl border border-amber-200 p-4 flex items-center gap-3">
                      <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
                        <Lock className="w-4 h-4 text-amber-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-ink font-medium text-sm truncate">Fare locked · ₹{Number(lock.price_usd).toLocaleString("en-IN")}</p>
                        <p className="text-amber-600 text-xs">Expires in {hoursLeft}h</p>
                      </div>
                      <Link href="/search">
                        <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs">Book now</Button>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Price Alerts */}
          {priceAlerts && priceAlerts.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-oxblood" />
                  <h2 className="font-display text-lg font-semibold text-ink">Price Alerts</h2>
                </div>
              </div>
              <div className="space-y-2">
                {priceAlerts.map((alert: any) => (
                  <div key={alert.id} className="bg-white rounded-xl border border-stone/10 p-4 flex items-center gap-3">
                    <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center shrink-0">
                      <TrendingDown className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-ink font-medium text-sm">{alert.origin} → {alert.destination}</p>
                      <p className="text-stone text-xs">Alert below ₹{Number(alert.target_price).toLocaleString("en-IN")}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-xs text-stone">Watching</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent searches (client — reads localStorage) */}
          <RecentSearches />

          {/* Offers teaser */}
          <Link href="/offers">
            <div className="bg-gradient-to-r from-[#6B1F2A] to-[#8B2A38] rounded-2xl p-5 flex items-center gap-4 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <Tag className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white text-sm">Today's Special Offers</p>
                <p className="text-white/60 text-xs">Promo codes, cashback deals, and limited-time fares</p>
              </div>
              <ArrowRight className="w-5 h-5 text-white/60 shrink-0" />
            </div>
          </Link>
        </div>

        {/* ── Right: Concierge + Inspiration ── */}
        <div className="space-y-5">
          {/* Concierge */}
          <div className="bg-white rounded-2xl border border-stone/10 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-ink text-sm">Travel Support</h3>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-stone">Online</span>
              </div>
            </div>
            {requests && requests.length > 0 && (
              <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl mb-3">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                <p className="text-xs text-amber-700">1 open support request</p>
              </div>
            )}
            <p className="text-stone text-xs mb-3">Need help with bookings, visa, or itineraries? Our team responds within 24 hours.</p>
            <Link href="/concierge">
              <Button variant="outline" size="sm" className="w-full rounded-xl border-stone/20 gap-2 text-ink">
                <MessageSquare className="w-3.5 h-3.5" />
                Contact support
              </Button>
            </Link>
          </div>

          {/* Inspiration */}
          <div>
            <h3 className="font-semibold text-ink text-sm mb-3">Trending Destinations</h3>
            <div className="space-y-2">
              {INSPIRATIONS.map((i) => (
                <Link key={i.title} href={i.href}>
                  <div className="group relative rounded-xl overflow-hidden cursor-pointer">
                    <img src={i.img} alt={i.title} className="w-full h-20 object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-3">
                      <p className="text-white text-xs font-semibold leading-tight">{i.title}</p>
                      <p className="text-white/60 text-[10px]">{i.subtitle}</p>
                    </div>
                  </div>
                </Link>
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
