import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { SearchWidget } from "@/components/search-widget";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Shield, Clock, ChevronRight, Star, ArrowRight } from "lucide-react";

const VALUE_PROPS = [
  {
    icon: Sparkles,
    title: "Plan in minutes, not weeks",
    body: "Odin builds a complete multi-modal itinerary — flights, hotels, transfers, restaurant bookings — from a single sentence.",
  },
  {
    icon: Shield,
    title: "Sleep through disruption",
    body: "Flight cancelled? We rebook before you wake up. Hotel walks you? Our team escalates and finds an alternative.",
  },
  {
    icon: Clock,
    title: "A curator on retainer",
    body: "Atlas members get priority AI access and hotel perks. Odyssey members get a named Trip Designer who knows your preferences.",
  },
];

const DESTINATIONS = [
  { name: "Maldives",     region: "Indian Ocean", tag: "Overwater", img: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80" },
  { name: "Kyoto",        region: "Japan",        tag: "Culture",   img: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=600&q=80" },
  { name: "Amalfi Coast", region: "Italy",        tag: "Coastal",   img: "https://images.unsplash.com/photo-1612698093158-e07ac200d44e?w=600&q=80" },
  { name: "Santorini",    region: "Greece",       tag: "Islands",   img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80" },
];

const TIERS = [
  {
    name: "Voyager", price: "Free", period: "", highlight: false,
    features: ["Search flights & hotels", "3 Odin AI turns/day", "Standard booking", "Email support"],
  },
  {
    name: "Atlas", price: "$480", period: "/year", highlight: true, badge: "Most popular",
    features: [
      "Unlimited Odin AI",
      "1,500+ hotel perks (upgrade, $100 credit, late checkout)",
      "4 Cancel-for-any-reason trips/year",
      "0% FX virtual card",
      "Priority chat support",
    ],
  },
  {
    name: "Odyssey", price: "$4,800", period: "/year", highlight: false,
    features: [
      "Everything in Atlas",
      "Named personal Trip Designer",
      "24/7 disruption response pod",
      "Unlimited DragonPass lounge access",
      "$300 annual transfer credit",
    ],
  },
];

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
      <section className="relative min-h-screen hero-gradient flex flex-col items-center justify-center pt-16 pb-12 px-4 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-oxblood/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-900/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center mb-10 max-w-3xl mx-auto">
          <Badge className="mb-5 bg-white/10 text-white border-white/20 text-xs font-medium px-3 py-1 hover:bg-white/10">
            <Star className="w-3 h-3 mr-1.5 fill-gold text-gold" />
            Private beta — invite only
          </Badge>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-semibold text-white leading-[1.05] mb-6">
            Your private<br />
            <span className="text-gold">travel firm.</span><br />
            In your pocket.
          </h1>
          <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            aeronix holidays pairs an autonomous AI travel agent with a human concierge desk —
            for travelers who&apos;d rather live the trip than plan it.
          </p>
        </div>

        <div className="relative z-10 w-full max-w-5xl mx-auto px-0 sm:px-4">
          <SearchWidget />
        </div>

        <div className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-6 text-white/40 text-xs">
          <span>✦ No booking fees</span>
          <span>✦ Free cancellation on select fares</span>
          <span>✦ 24/7 disruption support</span>
          <span>✦ Secure payments via Stripe</span>
        </div>
      </section>

      {/* ── VALUE PROPS ── */}
      <section className="py-24 px-4 bg-cream">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display text-4xl sm:text-5xl font-semibold text-ink mb-4">Travel, rethought</h2>
            <p className="text-stone text-lg max-w-xl mx-auto">
              The tools of a personal travel manager, powered by AI, available to everyone.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {VALUE_PROPS.map((v) => (
              <div key={v.title} className="bg-white rounded-2xl p-8 border border-stone/10 hover:shadow-lg transition-shadow">
                <div className="w-11 h-11 rounded-xl bg-[#6b1f2a]/8 flex items-center justify-center mb-5">
                  <v.icon className="w-5 h-5 text-oxblood" />
                </div>
                <h3 className="font-display text-xl font-semibold text-ink mb-2">{v.title}</h3>
                <p className="text-stone text-sm leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
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

      {/* ── PRICING PREVIEW ── */}
      <section className="py-24 px-4 bg-cream">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display text-4xl sm:text-5xl font-semibold text-ink mb-4">One membership. Every journey.</h2>
            <p className="text-stone text-lg max-w-xl mx-auto">Start free and upgrade when you&apos;re ready. Cancel anytime.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`relative rounded-2xl p-7 border transition-shadow hover:shadow-lg ${
                  tier.highlight ? "bg-ink border-ink text-white shadow-xl" : "bg-white border-stone/10"
                }`}
              >
                {tier.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-oxblood text-white border-transparent text-xs px-3">{tier.badge}</Badge>
                  </div>
                )}
                <div className="mb-5">
                  <p className={`text-sm font-medium mb-1 ${tier.highlight ? "text-white/60" : "text-stone"}`}>{tier.name}</p>
                  <div className="flex items-baseline gap-1">
                    <span className={`font-display text-4xl font-semibold ${tier.highlight ? "text-white" : "text-ink"}`}>{tier.price}</span>
                    {tier.period && <span className={`text-sm ${tier.highlight ? "text-white/50" : "text-stone"}`}>{tier.period}</span>}
                  </div>
                </div>
                <ul className="space-y-2.5 mb-7">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <span className={`mt-0.5 ${tier.highlight ? "text-gold" : "text-oxblood"}`}>✓</span>
                      <span className={tier.highlight ? "text-white/80" : "text-stone"}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href={tier.name === "Voyager" ? "/sign-up" : "/pricing"}>
                  <Button
                    className={`w-full rounded-xl font-medium ${
                      tier.highlight
                        ? "bg-oxblood hover:bg-oxblood/90 text-white"
                        : "border border-stone/30 bg-transparent text-ink hover:bg-ivory"
                    }`}
                    variant={tier.highlight ? "default" : "outline"}
                  >
                    {tier.name === "Voyager" ? "Start for free" : `Get ${tier.name}`}
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center text-stone text-sm mt-8">
            All plans include secure payments via Stripe · No hidden booking fees
          </p>
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
            <Link href="/pricing" className="hover:text-ink transition-colors">Pricing</Link>
          </div>
          <p>© {new Date().getFullYear()} aeronix holidays. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
