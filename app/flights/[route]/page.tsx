import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SearchWidget } from "@/components/search-widget";
import { Badge } from "@/components/ui/badge";
import { Plane, ShieldCheck, Zap, ArrowRight, MapPin } from "lucide-react";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { route: string } }): Promise<Metadata> {
  const [from, to] = params.route.split("-to-").map(s => s.charAt(0).toUpperCase() + s.slice(1));
  return {
    title: `Luxury Flights from ${from} to ${to} | Aeronix Holidays`,
    description: `Secure the most exclusive fares and private jet options for your journey from ${from} to ${to}. Monitored 24/7 by Odin AI.`,
  };
}

export default function FlightRoutePage({ params }: { params: { route: string } }) {
  const parts = params.route.split("-to-");
  const from = parts[0]?.charAt(0).toUpperCase() + parts[0]?.slice(1) || "Origin";
  const to = parts[1]?.charAt(0).toUpperCase() + parts[1]?.slice(1) || "Destination";

  return (
    <div className="min-h-screen bg-cream">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 bg-[#080A0F] text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-30">
          <img 
            src="https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover" 
            alt="Private Jet"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080A0F] to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <Badge className="bg-[#C5A572] text-white border-transparent mb-6 px-4 py-1 text-xs uppercase tracking-[0.2em] font-bold">
            Elite Route Collection
          </Badge>
          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12 mb-10">
            <h1 className="font-display text-5xl md:text-7xl font-bold">
              {from} <span className="text-[#C5A572]">to</span> {to}
            </h1>
            <div className="flex items-center gap-4 text-[#C5A572]">
              <Plane className="w-10 h-10 md:w-16 md:h-16 stroke-[1]" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#C5A572] mt-1" />
              <div>
                <p className="text-sm font-bold uppercase tracking-wider mb-1">Guaranteed Fares</p>
                <p className="text-xs text-white/60">We lock in the lowest luxury rates available across all major alliances.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-[#C5A572] mt-1" />
              <div>
                <p className="text-sm font-bold uppercase tracking-wider mb-1">Instant Prediction</p>
                <p className="text-xs text-white/60">Odin AI analyzes historical data to tell you exactly when to buy.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#C5A572] mt-1" />
              <div>
                <p className="text-sm font-bold uppercase tracking-wider mb-1">Bespoke Handling</p>
                <p className="text-xs text-white/60">Personal concierge support for every leg of your journey from {from}.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-stone/5 border border-stone/10 -mt-20 relative z-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl font-bold text-ink mb-4">Check Real-time Availability</h2>
              <p className="text-stone">Live search results from 600+ airlines including Emirates, Qatar Airways, and British Airways.</p>
            </div>
            <SearchWidget />
          </div>
        </div>
      </section>

      {/* Editorial Content */}
      <section className="py-24 max-w-5xl mx-auto px-6 text-center">
        <h3 className="font-display text-4xl font-bold text-ink mb-8">Travel redefined.</h3>
        <p className="text-stone text-lg leading-relaxed mb-12">
          Your journey from {from} to {to} is more than just a flight. With Aeronix Holidays, you gain access to 
          exclusive business class inventory, private lounge access, and a dedicated team that monitors your 
          connection in real-time. If there is a delay, we have already found your alternative before you touch down.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Badge variant="outline" className="px-6 py-2 border-stone/20 text-stone">Business Class Specialists</Badge>
          <Badge variant="outline" className="px-6 py-2 border-stone/20 text-stone">Private Jet Charters</Badge>
          <Badge variant="outline" className="px-6 py-2 border-stone/20 text-stone">Elite Chauffeur Transfers</Badge>
        </div>
      </section>

      <Footer />
    </div>
  );
}
