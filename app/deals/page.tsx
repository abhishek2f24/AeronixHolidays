import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Zap, Star, Gift, Clock } from "lucide-react";

export default function DealsPage() {
  const deals = [
    {
      title: "Maldives Flash Sale",
      offer: "Save 30% on Overwater Villas",
      expiry: "Valid till May 15",
      icon: Zap
    },
    {
      title: "Business Class Upgrade",
      offer: "Complimentary upgrade on Emirates to Dubai",
      expiry: "For Members Only",
      icon: Star
    },
    {
      title: "European Summer Special",
      offer: "Free Schengen Visa processing for Paris trips",
      expiry: "Limited slots available",
      icon: Gift
    },
    {
      title: "Early Bird Resort Credit",
      offer: "$500 Spa & Dining credit at Marriott properties",
      expiry: "Book 90 days in advance",
      icon: Clock
    }
  ];

  return (
    <main className="min-h-screen bg-cream">
      <Navigation />
      
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="font-display text-4xl md:text-6xl text-ink mb-6">Offers & Deals</h1>
          <p className="text-xl text-stone">Exclusive member-only rates curated for the discerning traveler.</p>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {deals.map((deal, idx) => (
            <div key={idx} className="bg-white p-8 rounded-[32px] border border-stone/10 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <deal.icon className="w-24 h-24 text-oxblood" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-oxblood/5 rounded-lg flex items-center justify-center">
                    <deal.icon className="w-4 h-4 text-oxblood" />
                  </div>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-stone">{deal.expiry}</span>
                </div>
                <h3 className="text-xl font-display text-ink mb-2">{deal.title}</h3>
                <p className="text-oxblood font-bold text-lg mb-6">{deal.offer}</p>
                <a href="/plan" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-ink hover:text-oxblood transition-colors">
                  Claim Offer <span className="text-lg">→</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto mt-20 p-8 bg-white rounded-3xl border border-oxblood/10 text-center">
          <p className="text-stone italic">"Luxury is not about price, it's about access. Our deals provide the latter without compromising the former."</p>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
