import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { SearchWidget } from "@/components/search-widget";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Shield, Clock, ChevronRight, Star, ArrowRight, Check } from "lucide-react";



const DESTINATIONS = [
  { name: "Maldives",     region: "Indian Ocean", tag: "Overwater", img: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80" },
  { name: "Kyoto",        region: "Japan",        tag: "Culture",   img: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=600&q=80" },
  { name: "Amalfi Coast", region: "Italy",        tag: "Coastal",   img: "https://images.unsplash.com/photo-1612698093158-e07ac200d44e?w=600&q=80" },
  { name: "Santorini",    region: "Greece",       tag: "Islands",   img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80" },
];

// Removed TIERS constant as we are moving away from subscriptions

const TESTIMONIALS = [
  {
    quote: "aeronix holidays replaced my Quintessentially membership at a tenth of the price. Odin planned our Japan trip in 12 minutes.",
    author: "Sarah K.", location: "New York", tier: "Odyssey",
  },
  {
    quote: "When my Heathrow connection fell apart, I had a new itinerary in my inbox before I even reached the gate agent.",
    author: "Marcus L.", location: "London", tier: "Atlas",
  },
];

export default function HomePage() {
  return (
    <>
      <Navigation transparent />

      {/* ── HERO ── */}
      <section className="relative flex flex-col items-center pt-24 pb-12 px-4 overflow-hidden bg-ink">
        <div className="absolute top-0 left-0 w-full h-full opacity-40 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-oxblood/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-900/30 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 text-center mb-8 max-w-4xl mx-auto">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold text-white leading-tight mb-4 tracking-tight">
            Luxury travel, <span className="text-gold">redefined by AI.</span>
          </h1>
          <p className="text-base sm:text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
            From instant itineraries to 24/7 disruption response. Aeronix Holidays combines 
            next-gen AI with professional concierge expertise.
          </p>
        </div>

        <div className="relative z-10 w-full max-w-5xl mx-auto px-0 sm:px-4 mb-10">
          <SearchWidget />
        </div>

        <div className="relative z-10 flex flex-wrap items-center justify-center gap-8 text-white/40 text-[10px] uppercase tracking-[0.2em] font-medium">
          <span className="flex items-center gap-2"><Shield className="w-3 h-3" /> No Booking Fees</span>
          <span className="flex items-center gap-2"><Clock className="w-3 h-3" /> 24/7 Support</span>
          <span className="flex items-center gap-2"><Star className="w-3 h-3" /> Exclusive Perks</span>
        </div>
      </section>


      {/* ── DESTINATIONS ── */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-display text-4xl sm:text-5xl font-semibold text-ink mb-2">Where will you go?</h2>
              <p className="text-stone">Curated picks from our travel editors</p>
            </div>
            <Link href="/destinations" className="hidden sm:flex items-center gap-1 text-oxblood text-sm font-medium hover:gap-2 transition-all">
              All destinations <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {DESTINATIONS.map((d) => (
              <div key={d.name} className="group relative rounded-2xl overflow-hidden aspect-[3/4] cursor-pointer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={d.img} alt={d.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <Badge className="mb-2 bg-white/20 text-white border-transparent text-[10px]">{d.tag}</Badge>
                  <p className="font-display text-xl font-semibold text-white leading-tight">{d.name}</p>
                  <p className="text-white/70 text-xs">{d.region}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="py-24 px-4 bg-cream">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-display text-4xl sm:text-5xl font-semibold text-ink mb-6">A concierge that never sleeps.</h2>
              <p className="text-stone text-lg mb-8 leading-relaxed">
                Whether you&apos;re planning a quick weekend getaway or a month-long expedition, 
                Aeronix provides the precision of AI with the touch of a professional agent.
              </p>
              <ul className="space-y-4 mb-10">
                {[
                  "Real-time flight and hotel integration via Duffel & Expedia",
                  "Instant AI-generated itineraries for complex trips",
                  "24/7 support for rebookings and disruptions",
                  "Exclusive perks at 1,500+ luxury properties worldwide",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-stone font-medium">
                    <div className="w-5 h-5 rounded-full bg-oxblood/10 flex items-center justify-center">
                      <Check className="w-3 h-3 text-oxblood" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/sign-up">
                <Button className="bg-ink text-white rounded-xl px-8 h-12">Create your free account</Button>
              </Link>
            </div>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-square">
              <img 
                src="https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&q=80" 
                alt="Luxury Travel" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 px-4 bg-ink">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white text-center mb-12">What our members say</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.author} className="bg-white/5 border border-white/10 rounded-2xl p-7">
                <p className="text-white/80 text-base leading-relaxed mb-5 italic">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium text-sm">{t.author}</p>
                    <p className="text-white/40 text-xs">{t.location}</p>
                  </div>
                  <Badge className="bg-oxblood/20 text-oxblood border-oxblood/20 text-xs">{t.tier}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ── */}
      <section className="py-20 px-4 bg-cream text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-4xl sm:text-5xl font-semibold text-ink mb-4">Ready to travel differently?</h2>
          <p className="text-stone text-lg mb-8">Join the private beta. First 100 members get Atlas pricing locked for life.</p>
          <Link href="/sign-up">
            <Button size="lg" className="bg-oxblood hover:bg-oxblood/90 text-white rounded-xl px-10 h-13 text-base font-medium">
              Begin your travel DNA →
            </Button>
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-stone/10 bg-white py-10 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-stone">
          <p className="font-display font-semibold text-ink">aeronix holidays</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-ink transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-ink transition-colors">Terms</Link>
          </div>
          <p>© {new Date().getFullYear()} aeronix holidays. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
