import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Sparkles, ShieldCheck, CreditCard, Headphones } from "lucide-react";

export default function HowItWorksPage() {
  const steps = [
    {
      icon: Sparkles,
      title: "1. Ask Odin AI",
      desc: "Tell our AI exactly what you're looking for. From '7-day Santorini honeymoon' to 'Family trip to Bali with 5-star villas', Odin understands intent, not just keywords."
    },
    {
      icon: ShieldCheck,
      title: "2. Precision Engineering",
      desc: "Odin scans global inventories to find the best flight paths, premium hotel rooms, and exclusive experiences that match your profile."
    },
    {
      icon: CreditCard,
      title: "3. Seamless Booking",
      desc: "Once you approve the itinerary, our secure platform handles all bookings instantly. No multiple tabs, no hidden fees, just one elegant interface."
    },
    {
      icon: Headphones,
      title: "4. Concierge Monitoring",
      desc: "After booking, our 24/7 concierge takes over. We monitor your flight status, coordinate with hotel staff, and assist with visas or any last-minute changes."
    }
  ];

  return (
    <main className="min-h-screen bg-cream">
      <Navigation />
      
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="font-display text-4xl md:text-6xl text-ink mb-6">How Aeronix Works</h1>
          <p className="text-xl text-stone">The architectural blueprint of your next great journey.</p>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="bg-white p-8 rounded-[32px] border border-stone/10 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-oxblood/5 rounded-2xl flex items-center justify-center mb-6">
                <step.icon className="w-6 h-6 text-oxblood" />
              </div>
              <h3 className="text-xl font-display text-ink mb-3">{step.title}</h3>
              <p className="text-stone leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto mt-20 p-8 bg-[#FAF7F2] rounded-3xl border border-oxblood/10 text-center">
          <h2 className="text-2xl font-display text-ink mb-4">Ready to start?</h2>
          <p className="text-stone mb-8">Let Odin AI design your first itinerary in less than 30 seconds.</p>
          <a href="/plan" className="inline-block bg-oxblood text-white px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-oxblood/90 transition-all">
            Start Planning
          </a>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
